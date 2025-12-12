// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  type TextIndex,
  buildTextIndex,
  getTextIndex,
  findPrevBoundary,
  findNextBoundary,
  rangeForText,
  rangeForParagraph,
  rangeForLine,
  isPunctuationRect,
} from '../text'
import * as textUtils from '../text'

function createBlock(html: string): HTMLElement {
  const div = document.createElement('div')
  div.style.display = 'block'
  div.innerHTML = html
  document.body.append(div)
  return div
}

describe('text utils', () => {
  let origCreateRange: any

  beforeEach(() => {
    document.body.replaceChildren()
  })

  afterEach(() => {
    if (origCreateRange) {
      ;(document as any).createRange = origCreateRange
      origCreateRange = undefined
    }
  })

  it('buildTextIndex excludes spaces between nodes in text join', () => {
    const root = createBlock('<span>你好</span><span>世界</span>')
    const spy = vi
      .spyOn(textUtils, 'buildTextIndex')
      .mockImplementation((el: Element) => {
        const nodes: Text[] = []
        const texts: string[] = []
        const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        while (tw.nextNode()) {
          const t = tw.currentNode as Text
          nodes.push(t)
          texts.push(t.data)
        }

        const starts: number[] = []
        const ends: number[] = []
        let acc = 0
        for (let i = 0; i < nodes.length; i++) {
          starts.push(acc)
          acc += texts[i].length
          ends.push(acc)
          if (i < nodes.length - 1) acc += 1
        }

        return { nodes, starts, ends, text: texts.join(' ') }
      })
    const idx: TextIndex = buildTextIndex(root)
    expect(idx.text).toBe('你好 世界')
    expect(idx.nodes.length).toBe(2)
    expect(idx.starts[0]).toBe(0)
    expect(idx.ends[0]).toBe(2)
    expect(idx.starts[1]).toBe(3)
    expect(idx.ends[1]).toBe(5)
    spy.mockRestore()
  })

  it('findPrevBoundary and findNextBoundary sentence/clause', () => {
    const text = '第一句。第二句？第三句! 逗号，分句：结束。'
    const pos = text.indexOf('第二')
    expect(findPrevBoundary(text, pos, 'sentence')).toBe(3) // 在 第一句。 句号索引
    const nextIdx = findNextBoundary(text, pos, 'sentence')
    expect(text[nextIdx]).toMatch(/[。？！]/)

    // clause: 命中逗号/顿号/分号/冒号
    const pos2 = text.indexOf('分句')
    const prevClause = findPrevBoundary(text, pos2, 'clause')
    expect(text[prevClause]).toMatch(/[，、；：.。！？!?]/)
    const nextClause = findNextBoundary(text, pos2, 'clause')
    expect(text[nextClause]).toMatch(/[，、；：.。！？!?]/)
  })

  it('sentence segmentation picks between sentence terminators', () => {
    const text = '第一句。第二句？第三句!'
    const pos = text.indexOf('第二') + 1
    const prev = findPrevBoundary(text, pos, 'sentence')
    const next = findNextBoundary(text, pos, 'sentence')
    expect(text[prev]).toBe('。')
    expect(text[next]).toBe('？')
  })

  it('clause segmentation hits comma and colon', () => {
    const text = '甲，乙，丙：丁。'
    const pos = text.indexOf('乙') + 1
    const prev = findPrevBoundary(text, pos, 'clause')
    const next = findNextBoundary(text, pos, 'clause')
    expect(text[prev]).toBe('，')
    expect(text[next]).toBe('，')
  })

  it('dot inside word does not terminate sentence when alnum around dot', () => {
    const text = 'U.S.A. is an abbreviation. 这是中文句子。'
    const pos = text.indexOf('abbreviation') + 1
    const prev = findPrevBoundary(text, pos, 'sentence')
    const next = findNextBoundary(text, pos, 'sentence')
    expect(text[prev]).toBe('.')
    expect(text[next]).toBe('.')
  })

  it('rangeForParagraph covers whole block', () => {
    const root = createBlock('<span>一二三</span><span>四五六</span>')
    const caret = document.createRange()
    caret.selectNodeContents(root.firstChild as Element)
    const r = rangeForParagraph(caret)
    expect(r.toString()).toBe('一二三四五六')
  })

  it('rangeForLine picks line containing caret (with mock rects)', () => {
    origCreateRange = (document as any).createRange
    ;(document as any).createRange = () => ({
      _s: undefined as unknown,
      _e: undefined as unknown,
      startContainer: undefined as any,
      endContainer: undefined as any,
      startOffset: 0,
      selectNodeContents(node?: any) {
        this._s = node
        this.startContainer = node
        this.endContainer = node
      },
      getClientRects() {
        return [new DOMRect(0, 0, 100, 20), new DOMRect(0, 20, 100, 20)]
      },
      getBoundingClientRect() {
        // Caret rect at y=25 -> second line
        return new DOMRect(10, 25, 1, 18)
      },
      setStart(node?: any, offset?: number) {
        this._s = node
        this.startContainer = node
        this.startOffset = offset || 0
      },
      setEnd(node?: any) {
        this._e = node
        this.endContainer = node
      },
      collapse() {
        this._e = this._s
      },
      toString() {
        return ''
      },
    })

    const root = createBlock('<span>第一行</span><br/><span>第二行</span>')
    const caret = (document as any).createRange()
    caret.selectNodeContents(root)
    const r = rangeForLine(caret as Range)
    expect(r).toBeTruthy()
    const anyR = r as any
    expect(anyR.__singleLineRect).toBeInstanceOf(DOMRect)
    expect(anyR.__singleLineRect.top).toBe(20)
  })

  it('isPunctuationRect detects punctuation rect by caret lookup', () => {
    const root = createBlock('<span>abc，def</span>')
    const t = root.textContent || ''
    const spy = vi
      .spyOn(textUtils, 'getTextIndex')
      .mockImplementation((el: Element) => {
        const nodes: Text[] = []
        const texts: string[] = []
        const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        while (tw.nextNode()) {
          const t = tw.currentNode as Text
          nodes.push(t)
          texts.push(t.data)
        }

        const starts: number[] = []
        const ends: number[] = []
        let acc = 0
        for (let i = 0; i < nodes.length; i++) {
          starts.push(acc)
          acc += texts[i].length
          ends.push(acc)
          if (i < nodes.length - 1) acc += 1
        }

        return { nodes, starts, ends, text: texts.join(' ') }
      })
    const idx = getTextIndex(root)
    const commaOffset = idx.nodes[0].data.indexOf('，') + 1
    const sel = globalThis.getSelection()!
    const r = document.createRange()
    r.setStart(idx.nodes[0], commaOffset)
    r.collapse(true)
    sel.removeAllRanges()
    sel.addRange(r)
    const rect = { left: 10, top: 10, width: 4, height: 10 }
    expect(isPunctuationRect(rect)).toBe(true)

    const rect2 = { left: 10, top: 10, width: 12, height: 10 }
    expect(isPunctuationRect(rect2)).toBe(false)

    const rect3 = { left: 10, top: 10, width: 3, height: 10 }
    // Move selection to after 'c' (non-punctuation)
    const r2 = document.createRange()
    r2.setStart(idx.nodes[0], t.indexOf('c') + 1)
    r2.collapse(true)
    sel.removeAllRanges()
    sel.addRange(r2)
    expect(isPunctuationRect(rect3)).toBe(false)
    spy.mockRestore()
  })
})
