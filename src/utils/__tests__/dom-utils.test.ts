// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import {
  isInteractive,
  isBlockElement,
  closestBlockElement,
  isElementVisible,
  hasNestedBlock,
  caretRangeFromPoint,
  ensureShadowRoot,
} from '../dom'

describe('dom utils', () => {
  beforeEach(() => {
    document.body.replaceChildren()
  })

  it('isInteractive detects inputs and contenteditable', () => {
    const input = document.createElement('input')
    const ta = document.createElement('textarea')
    const sel = document.createElement('select')
    const btn = document.createElement('button')
    const div = document.createElement('div')
    div.setAttribute('contenteditable', 'true')
    const span = document.createElement('span')
    expect(isInteractive(input)).toBe(true)
    expect(isInteractive(ta)).toBe(true)
    expect(isInteractive(sel)).toBe(true)
    expect(isInteractive(btn)).toBe(true)
    expect(isInteractive(div)).toBe(true)
    expect(isInteractive(span)).toBe(false)
    expect(isInteractive(undefined)).toBe(false)
  })

  it('isBlockElement detects by display', () => {
    const div = document.createElement('div')
    div.style.display = 'block'
    const span = document.createElement('span')
    span.style.display = 'inline'
    expect(isBlockElement(div)).toBe(true)
    expect(isBlockElement(span)).toBe(false)
  })

  it('isBlockElement detects by tag', () => {
    const li = document.createElement('li')
    const section = document.createElement('section')
    expect(isBlockElement(li)).toBe(true)
    expect(isBlockElement(section)).toBe(true)
  })

  it('closestBlockElement finds nearest block', () => {
    const section = document.createElement('section')
    const div = document.createElement('div')
    div.style.display = 'inline'
    const span = document.createElement('span')
    section.append(div)
    div.append(span)
    document.body.append(section)
    const hit = closestBlockElement(span)
    expect(hit).toBe(section)
  })

  it('isElementVisible returns false for hidden/display/visibility', () => {
    const a = document.createElement('div')
    a.hidden = true
    document.body.append(a)
    expect(isElementVisible(a)).toBe(false)

    const b = document.createElement('div')
    b.style.display = 'none'
    document.body.append(b)
    expect(isElementVisible(b)).toBe(false)

    const c = document.createElement('div')
    c.style.visibility = 'hidden'
    document.body.append(c)
    expect(isElementVisible(c)).toBe(false)
  })

  it('isElementVisible returns false when parent hidden', () => {
    const parent = document.createElement('div')
    parent.style.display = 'none'
    const child = document.createElement('span')
    parent.append(child)
    document.body.append(parent)
    expect(isElementVisible(child)).toBe(false)
  })

  it('hasNestedBlock detects text inside child block', () => {
    const root = document.createElement('div')
    const li = document.createElement('li')
    const t1 = document.createTextNode('item')
    li.append(t1)
    const t0 = document.createTextNode('root text')
    root.append(t0)
    root.append(li)
    document.body.append(root)
    expect(hasNestedBlock(root, t1)).toBe(true)
    expect(hasNestedBlock(root, t0)).toBe(false)
  })

  it('caretRangeFromPoint returns a range (fallback via selection)', () => {
    const span = document.createElement('span')
    span.textContent = 'hello'
    document.body.append(span)
    const r = document.createRange()
    r.setStart(span.firstChild as Text, 1)
    r.collapse(true)
    const sel = globalThis.getSelection()!
    sel.removeAllRanges()
    sel.addRange(r)
    const got = caretRangeFromPoint(0, 0)
    expect(got).toBeDefined()
    expect(got!.startContainer).toBe(span.firstChild)
    expect(got!.startOffset).toBe(1)
  })

  it('ensureShadowRoot creates or reuses host', () => {
    // 1. Create new
    const { host, root, existed } = ensureShadowRoot({
      hostId: 'test-host',
      hostDatasetKey: 'myHost',
      style: '.foo { color: red; }',
    })
    expect(document.documentElement.contains(host)).toBe(true)
    expect(host.dataset.myHost).toBe('test-host')
    expect(host.shadowRoot).toBe(root)
    expect(existed).toBe(false)
    expect(root.querySelector('style')?.textContent).toContain('.foo')

    // 2. Reuse existing
    const {
      host: h2,
      root: r2,
      existed: e2,
    } = ensureShadowRoot({
      hostId: 'test-host',
      hostDatasetKey: 'myHost',
    })
    expect(h2).toBe(host)
    expect(r2).toBe(root)
    expect(e2).toBe(true)

    // 3. Move to end
    const other = document.createElement('div')
    document.documentElement.append(other)
    expect(document.documentElement.lastElementChild).toBe(other)

    ensureShadowRoot({
      hostId: 'test-host',
      hostDatasetKey: 'myHost',
      moveToEnd: true,
    })
    expect(document.documentElement.lastElementChild).toBe(host)
  })
})
