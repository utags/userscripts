// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as domUtils from '../../../utils/dom'
import { findNeighborByGeometry, type Mode } from '../index'

vi.mock('../../../utils/dom', async () => {
  const mod = await vi.importActual<any>('../../../utils/dom')
  return {
    ...mod,
    isElementVisible: (el?: Element) => !(el as any)?.hidden,
  }
})
vi.mock('../../../utils/text', async () => {
  const mod = await vi.importActual<any>('../../../utils/text')
  return {
    ...mod,
    rangeForText(caret: Range) {
      const sc = caret.startContainer
      const owner =
        sc.nodeType === Node.ELEMENT_NODE
          ? (sc as Element)
          : (sc as any).parentElement
      const root =
        (owner as Element).closest('p') ||
        (owner as Element).closest('div') ||
        document.body
      const r = document.createRange()
      r.selectNodeContents(root)
      return r
    },
  }
})

function makeBlock(id: string, top: number, height: number, text: string) {
  const div = document.createElement('div')
  div.id = id
  div.style.display = 'block'
  ;(div as any).getBoundingClientRect = () => new DOMRect(0, top, 800, height)
  const p = document.createElement('p')
  p.textContent = text
  p.id = id
  ;(p as any).getBoundingClientRect = () => new DOMRect(0, top, 800, height)
  div.append(p)
  return div
}

describe('findNeighborByGeometry', () => {
  let p1: HTMLElement
  let p2: HTMLElement
  let p3: HTMLElement
  let restoreCaret: () => void
  let restoreRects: () => void
  let restoreGC: () => void

  beforeEach(() => {
    document.body.replaceChildren()
    const host = document.createElement('div')
    host.id = 'main'
    host.style.display = 'block'
    ;(host as any).getBoundingClientRect = () => new DOMRect(0, 0, 800, 1200)
    document.body.append(host)

    p1 = makeBlock('p1', 80, 60, '第一段。第二段？第三段!')
    p2 = makeBlock('p2', 180, 60, '另一段，包含逗号：结尾。')
    p3 = makeBlock('p3', 280, 60, '第三段内容。')
    host.append(p1, p2, p3)

    const gcStub = vi
      .spyOn(globalThis, 'getComputedStyle' as any)
      .mockImplementation((el: Element) => {
        const d = (el as any).style?.display || 'block'
        return { display: d, lineHeight: '24px', visibility: 'visible' } as any
      })
    restoreGC = () => {
      gcStub.mockRestore()
    }

    const caretForBlock = (el: Element) => {
      const r = document.createRange()
      const t = el.textContent || ''
      const tn = el.querySelector('p')?.firstChild as Text
      r.setStart(tn, Math.min(1, t.length))
      r.collapse(true)
      return r
    }

    const stub = vi
      .spyOn(domUtils, 'caretRangeFromPoint')
      .mockImplementation(() => undefined)

    restoreCaret = () => {
      stub.mockRestore()
    }

    const origGetRects = (globalThis.Range as any).prototype.getClientRects
    ;(globalThis.Range as any).prototype.getClientRects = function (
      this: Range
    ) {
      const block = domUtils.closestBlockElement(this.startContainer)
      const clip = (block as any).getBoundingClientRect()
      const top =
        Number(clip.top) + Math.max(2, Math.min(Number(clip.height) - 2, 10))
      const left = Number(clip.left) + 10
      const width = Math.max(10, Math.min(clip.width - 20, 200))
      const height = Math.max(10, Math.min(clip.height - 20, 24))
      return [new DOMRect(left, top, width, height)]
    }

    restoreRects = () => {
      ;(globalThis.Range as any).prototype.getClientRects = origGetRects
    }
  })

  afterEach(() => {
    restoreCaret()
    restoreRects()
    restoreGC()
    document.body.replaceChildren()
  })

  it('navigates to next sentence by geometry', () => {
    const ref = document.createRange()
    const tn = p1.querySelector('p')!.firstChild as Text
    ref.setStart(tn, 0)
    ref.setEnd(tn, tn.data.length)
    ;(ref as any).__singleLineRect = new DOMRect(10, 100, 160, 20)

    const out = findNeighborByGeometry(ref, 'next', 'sentence' as Mode)!
    expect(out).toBeTruthy()
    const owner = domUtils.closestBlockElement(out.startContainer)
    expect(owner.id).toBe('p2')
  })

  it('skips invisible targets and finds next visible block', () => {
    p2.hidden = true
    const caretStub = vi
      .spyOn(domUtils, 'caretRangeFromPoint')
      .mockImplementation(() => {
        const r = document.createRange()
        const tn = p3.querySelector('p')!.firstChild as Text
        r.setStart(tn, 0)
        r.collapse(true)
        return r
      })

    const ref = document.createRange()
    const tn = p1.querySelector('p')!.firstChild as Text
    ref.setStart(tn, 0)
    ref.setEnd(tn, tn.data.length)
    ;(ref as any).__singleLineRect = new DOMRect(10, 100, 160, 20)

    const out = findNeighborByGeometry(ref, 'next', 'sentence' as Mode)!
    expect(out).toBeTruthy()
    const owner = domUtils.closestBlockElement(out.startContainer)
    expect(owner.id).toBe('p3')
    caretStub.mockRestore()
  })

  it('prev navigates within multiline paragraph (mode: line) using sample.html', () => {
    const html = `
      <div id="main-content">
        <p>这里记录每周值得分享的科技内容，周五发布。</p>
        <p>AI 大发展，数据中心不够用了，建造和运营成本飞涨。</p>
      </div>
    `
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const main = doc.querySelector('#main-content') || doc.body

    const pPrev = main
      .querySelector('p')
      ?.cloneNode(true) as HTMLParagraphElement
    const pLast = main
      .querySelectorAll('p')[1]
      ?.cloneNode(true) as HTMLParagraphElement
    pPrev.id = 'ml-prev'
    pLast.id = 'ml-last'
    ;(pPrev as any).getBoundingClientRect = () => new DOMRect(0, 260, 800, 120)
    ;(pLast as any).getBoundingClientRect = () => new DOMRect(0, 400, 800, 120)
    document.querySelector('#main')!.append(pPrev, pLast)

    const origGetRects = (globalThis.Range as any).prototype.getClientRects
    ;(globalThis.Range as any).prototype.getClientRects = function (
      this: Range
    ) {
      const block = domUtils.closestBlockElement(this.startContainer)
      const id = (block as any).id || ''
      if (id === 'ml-last') {
        const rectBottom = new DOMRect(10, 480, 300, 20)
        const rectMid = new DOMRect(10, 456, 300, 20)
        const rectTop = new DOMRect(10, 432, 300, 20)
        return [rectBottom, rectMid, rectTop]
      }

      const clip = (block as any).getBoundingClientRect()
      const top = Number(clip.top) + 8
      const left = Number(clip.left) + 10
      return [new DOMRect(left, top, 300, 20)]
    }

    const caretStub = vi
      .spyOn(domUtils, 'caretRangeFromPoint')
      .mockImplementation((x, y) => {
        const r = document.createRange()
        const tn = pLast.firstChild as Text
        r.setStart(tn, 0)
        r.collapse(true)
        const lineTop = y < 470 ? 456 : 480
        ;(r as any).getBoundingClientRect = () =>
          new DOMRect(x, lineTop + 5, 2, 18)
        return r
      })

    const ref = document.createRange()
    const tn0 = pLast.firstChild as Text
    ref.setStart(tn0, 0)
    ref.setEnd(tn0, tn0.data.length)

    const out = findNeighborByGeometry(ref, 'prev', 'line')!
    expect(out).toBeTruthy()
    const owner = domUtils.closestBlockElement(out.startContainer)
    expect(owner.id).toBe('ml-last')

    caretStub.mockRestore()
    ;(globalThis.Range as any).prototype.getClientRects = origGetRects
  })

  it('prev jumps to previous paragraph (mode: sentence) using sample.html', () => {
    const html = `
      <div id="main-content">
        <p>这里记录每周值得分享的科技内容，周五发布。</p>
        <p>AI 大发展，数据中心不够用了，建造和运营成本飞涨。</p>
      </div>
    `
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const main = doc.querySelector('#main-content') || doc.body

    const pPrev = main
      .querySelector('p')
      ?.cloneNode(true) as HTMLParagraphElement
    const pLast = main
      .querySelectorAll('p')[1]
      ?.cloneNode(true) as HTMLParagraphElement
    pPrev.id = 'ml-prev2'
    pLast.id = 'ml-last2'
    ;(pPrev as any).getBoundingClientRect = () => new DOMRect(0, 260, 800, 60)
    ;(pLast as any).getBoundingClientRect = () => new DOMRect(0, 340, 800, 60)
    document.querySelector('#main')!.append(pPrev, pLast)

    const origGetRects = (globalThis.Range as any).prototype.getClientRects
    ;(globalThis.Range as any).prototype.getClientRects = function (
      this: Range
    ) {
      const block = domUtils.closestBlockElement(this.startContainer)
      const clip = (block as any).getBoundingClientRect()
      const top = Number(clip.top) + 8
      const left = Number(clip.left) + 10
      return [new DOMRect(left, top, 300, 20)]
    }

    const caretStub = vi
      .spyOn(domUtils, 'caretRangeFromPoint')
      .mockImplementation((x, y) => {
        if (y < 330) {
          const r = document.createRange()
          const tn = pPrev.firstChild as Text
          r.setStart(tn, 0)
          r.collapse(true)
          ;(r as any).getBoundingClientRect = () => new DOMRect(x, 270, 2, 18)
          return r
        }

        return undefined
      })

    const ref = document.createRange()
    const tn0 = pLast.firstChild as Text
    ref.setStart(tn0, 0)
    ref.setEnd(tn0, tn0.data.length)

    const out = findNeighborByGeometry(ref, 'prev', 'sentence')!
    expect(out).toBeTruthy()
    const owner = domUtils.closestBlockElement(out.startContainer)
    expect(owner.id).toBe('ml-prev2')

    caretStub.mockRestore()
    ;(globalThis.Range as any).prototype.getClientRects = origGetRects
  })
})
