import { openSettingsPanel } from './settings-panel'

type Mode = 'sentence' | 'clause' | 'line' | 'paragraph'
type Style = 'box' | 'underline'

const MODE_KEY = 'read_helper_mode'
const STYLE_KEY = 'read_helper_style'
const COLOR_KEY = 'read_helper_color'
const ENABLED_KEY = 'read_helper_enabled'
const SCROLL_HIDE_KEY = 'read_helper_scroll_hide'
const MOVE_BY_ARROWS_KEY = 'read_helper_move_by_arrows'

let mode: Mode = 'sentence'
let style: Style = 'box'
let color = '#ff4d4f'
let enabled = true
let hideOnScroll = true
let moveByArrows = false

let overlay: HTMLDivElement | undefined
let clickHandlerInstalled = false
let selectionHandlerInstalled = false
let dblClickHandlerInstalled = false
let keyHandlerInstalled = false
let menuIds: number[] = []
let selectStartInstalled = false
let mouseUpInstalled = false
let scrollHandlerInstalled = false
let resizeHandlerInstalled = false
let lastRange: Range | undefined
const redrawScheduled = false
let redrawDebounceTimer: number | undefined
const redrawDebounceMs = 200
const MERGE_EPS = 2
const MERGE_MIN_OVERLAP_RATIO = 0.5
let scrollingActive = false
const textIndexCache = new WeakMap<
  Element,
  { index: TextIndex; textLength: number }
>()

function ensureOverlay(): HTMLDivElement {
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'read-helper-overlay'
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '0'
    overlay.style.height = '0'
    overlay.style.pointerEvents = 'none'
    overlay.style.zIndex = '2147483647'
    document.documentElement.append(overlay)
  }

  return overlay
}

function clearOverlay(): void {
  if (!overlay) return

  overlay.replaceChildren()
  lastRange = undefined
  if (redrawDebounceTimer !== undefined) {
    globalThis.clearTimeout(redrawDebounceTimer)
    redrawDebounceTimer = undefined
  }
}

function isInteractive(el: Element | undefined): boolean {
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  if (['input', 'textarea', 'select', 'button'].includes(tag)) return true
  if (el.hasAttribute('contenteditable')) return true
  return false
}

function caretRangeFromPoint(x: number, y: number): Range | undefined {
  const anyDoc = document as any
  if (typeof anyDoc.caretRangeFromPoint === 'function') {
    const r = anyDoc.caretRangeFromPoint(x, y)
    if (r) return r as Range
  }

  if (typeof anyDoc.caretPositionFromPoint === 'function') {
    const pos = anyDoc.caretPositionFromPoint(x, y)
    if (pos && pos.offsetNode !== undefined && pos.offsetNode !== null) {
      const r = document.createRange()
      r.setStart(pos.offsetNode, pos.offset)
      r.collapse(true)
      return r
    }
  }

  const sel = globalThis.getSelection()
  if (!sel) return undefined
  const r = sel.rangeCount
    ? sel.getRangeAt(0).cloneRange()
    : document.createRange()
  return r
}

function isBlockElement(el: Element): boolean {
  const cs = globalThis.getComputedStyle(el)
  const d = cs.display
  const tag = el.tagName.toLowerCase()
  if (
    d === 'block' ||
    d === 'list-item' ||
    d === 'table' ||
    d === 'table-cell' ||
    d === 'flex' ||
    d === 'grid' ||
    d === 'flow-root'
  )
    return true

  if (
    tag === 'td' ||
    tag === 'th' ||
    tag === 'li' ||
    tag === 'section' ||
    tag === 'article'
  )
    return true

  return false
}

function closestBlockElement(node: Node): Element {
  let el =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : node.parentElement || document.body
  while (el && el !== document.body) {
    if (isBlockElement(el)) return el
    el = el.parentElement || document.body
  }

  return document.body
}

function caretAtBlockEdge(
  block: Element,
  edge: 'start' | 'end'
): Range | undefined {
  const idx = getTextIndex(block)
  if (idx.nodes.length === 0) return undefined
  const r = document.createRange()
  if (edge === 'start') {
    r.setStart(idx.nodes[0], 0)
  } else {
    const nodes = idx.nodes
    const lastIndex = nodes.length - 1
    const last = nodes[lastIndex]
    r.setStart(last, last.data.length)
  }

  r.collapse(true)
  return r
}

function findAdjacentBlock(
  cur: Element,
  dir: 'prev' | 'next'
): Element | undefined {
  const it = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT)
  const blocks: Element[] = []
  while (true) {
    const n = it.nextNode()
    if (!n) break
    const el = n as Element
    if (isBlockElement(el)) {
      const idx = getTextIndex(el)
      if (idx.nodes.length > 0) blocks.push(el)
    }
  }

  let i = blocks.indexOf(cur)
  if (i === -1) {
    for (const [j, b] of blocks.entries()) {
      if (b.contains(cur)) {
        i = j
        break
      }
    }

    if (i === -1) return undefined
  }

  if (dir === 'prev') return i > 0 ? blocks[i - 1] : undefined
  return i < blocks.length - 1 ? blocks[i + 1] : undefined
}

function findTextRangeFromAdjacentBlock(
  from: Element,
  dir: 'prev' | 'next',
  m: Mode
): Range | undefined {
  let cur = from
  let loops = 0
  while (loops < 64) {
    const adj = findAdjacentBlock(cur, dir)
    if (!adj) return undefined
    const caret = caretAtBlockEdge(adj, dir === 'prev' ? 'end' : 'start')
    if (!caret) return undefined
    const r = m === 'line' ? rangeForLine(caret) : rangeForText(caret, m)
    if (r && hasVisibleRects(r)) return r
    cur = adj
    loops++
  }

  return undefined
}

type TextIndex = {
  nodes: Text[]
  starts: number[]
  ends: number[]
  text: string
}

function buildTextIndex(root: Element): TextIndex {
  const nodes: Text[] = []
  const texts: string[] = []
  const it = document.createNodeIterator(root, NodeFilter.SHOW_TEXT)
  while (true) {
    const n = it.nextNode()
    if (!n) break
    const t = n as Text
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
}

function getTextIndex(root: Element): TextIndex {
  const tl = (root.textContent || '').length
  const cached = textIndexCache.get(root)
  if (cached && cached.textLength === tl) return cached.index
  const idx = buildTextIndex(root)
  textIndexCache.set(root, { index: idx, textLength: tl })
  return idx
}

function mapIndexToPosition(
  idx: number,
  index: TextIndex
): { node: Text; offset: number } | undefined {
  for (const [i, node] of index.nodes.entries()) {
    if (idx >= index.starts[i] && idx <= index.ends[i]) {
      return { node, offset: idx - index.starts[i] }
    }
  }

  return undefined
}

function adjustIndexToNode(
  idx: number,
  index: TextIndex,
  dir: 'forward' | 'backward'
): number {
  const starts = index.starts
  const ends = index.ends
  let lo = 0
  let hi = starts.length - 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (idx < starts[mid]) hi = mid - 1
    else if (idx > ends[mid]) lo = mid + 1
    else return idx
  }

  if (dir === 'forward') {
    const j = Math.min(starts.length - 1, Math.max(0, lo))
    return starts[j]
  }

  const j = Math.max(0, Math.min(ends.length - 1, hi))
  return ends[j]
}

function mapPositionToIndex(
  node: Node,
  offset: number,
  index: TextIndex
): number | undefined {
  const i = index.nodes.indexOf(node as Text)
  if (i !== -1) return index.starts[i] + offset

  return undefined
}

function isSentenceTerminator(ch: string): boolean {
  return /[。．｡.!?！？…]/.test(ch)
}

function isClauseTerminator(ch: string): boolean {
  return /[，,、；;：:.。！？!?]/.test(ch)
}

function findPrevBoundary(text: string, pos: number, m: Mode): number {
  for (let i = pos - 1; i >= 0; i--) {
    const ch = text[i]
    const hit =
      m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
    if (hit) {
      if (
        ch === '.' &&
        /[A-Za-z\d]/.test(text[i + 1] || '') &&
        /[A-Za-z\d]/.test(text[i - 1] || '')
      )
        continue
      return i
    }
  }

  return -1
}

function findNextBoundary(text: string, pos: number, m: Mode): number {
  for (let i = pos; i < text.length; i++) {
    const ch = text[i]
    const hit =
      m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
    if (hit) {
      if (
        ch === '.' &&
        /[A-Za-z\d]/.test(text[i + 1] || '') &&
        /[A-Za-z\d]/.test(text[i - 1] || '')
      )
        continue
      return i
    }
  }

  return text.length
}

function isPunctuationRect(rect: DOMRect): boolean {
  if (rect.width > 8) return false
  const x = rect.left + Math.max(1, Math.min(rect.width - 1, rect.width * 0.5))
  const y = rect.top + rect.height / 2
  const cr = caretRangeFromPoint(x, y)
  if (!cr) return false
  const n = cr.startContainer
  const o = cr.startOffset
  if (n.nodeType === Node.TEXT_NODE) {
    const t = n as Text
    const s = t.data
    const i = Math.max(0, Math.min(o - 1, s.length - 1))
    const ch = s[i] || ''
    return /[，,、；;：:.。！？!?\s\u00A0]/.test(ch)
  }

  return false
}

function rangeForParagraph(caret: Range): Range {
  const block = closestBlockElement(caret.startContainer)
  const r = document.createRange()
  r.selectNodeContents(block)

  return r
}

function rangeForLine(caret: Range): Range | undefined {
  const block = closestBlockElement(caret.startContainer)
  const caretRect = caret.getBoundingClientRect()
  const r = document.createRange()
  r.selectNodeContents(block)
  const rects = Array.from(r.getClientRects())
  let pick: DOMRect | undefined
  for (const rect of rects) {
    if (caretRect.top >= rect.top && caretRect.top <= rect.bottom) {
      pick = rect
      break
    }
  }

  if (!pick) return undefined
  if (pick.width <= 2) return undefined
  const out = document.createRange()
  out.setStart(block, 0)
  out.setEnd(block, block.childNodes.length)
  ;(out as any).__singleLineRect = pick

  return out
}

function rangeForText(caret: Range, m: Mode): Range | undefined {
  const block = closestBlockElement(caret.startContainer)
  const idx = getTextIndex(block)
  if (idx.nodes.length === 0) return undefined
  const startNode = caret.startContainer
  const startOffset = caret.startOffset
  const caretGlobal = mapPositionToIndex(startNode, startOffset, idx)
  if (caretGlobal === undefined) return undefined

  const text = idx.text
  let s = caretGlobal
  let e = caretGlobal
  for (let i = caretGlobal - 1; i >= 0; i--) {
    const ch = text[i]
    const hit =
      m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
    if (hit) {
      if (
        ch === '.' &&
        /[A-Za-z\d]/.test(text[i + 1] || '') &&
        /[A-Za-z\d]/.test(text[i - 1] || '')
      )
        continue
      s = i + 1
      break
    }

    s = i
  }

  while (s < text.length && /[，,、；;：:.。！？!?…\s\u00A0]/.test(text[s])) s++

  for (let i = caretGlobal; i < text.length; i++) {
    const ch = text[i]
    const hit =
      m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
    if (hit) {
      if (
        ch === '.' &&
        /[A-Za-z\d]/.test(text[i + 1] || '') &&
        /[A-Za-z\d]/.test(text[i - 1] || '')
      )
        continue
      e = i
      break
    }

    e = i + 1
  }

  //

  const sAdj = adjustIndexToNode(s, idx, 'forward')
  const eAdj = adjustIndexToNode(e, idx, 'backward')
  const startPos = mapIndexToPosition(sAdj, idx)
  const endPos = mapIndexToPosition(eAdj, idx)
  if (!startPos || !endPos) return undefined
  const r = document.createRange()
  r.setStart(startPos.node, startPos.offset)
  r.setEnd(endPos.node, endPos.offset)

  return r
}

function rangeForNeighbor(
  ref: Range,
  dir: 'prev' | 'next',
  m: Mode
): Range | undefined {
  const block = closestBlockElement(ref.startContainer)
  const idx = getTextIndex(block)
  if (idx.nodes.length === 0) return undefined
  const sIdx = mapPositionToIndex(ref.startContainer, ref.startOffset, idx)
  const eIdx = mapPositionToIndex(ref.endContainer, ref.endOffset, idx)
  if (sIdx === undefined || eIdx === undefined) return undefined
  const text = idx.text
  let left = sIdx
  let right = eIdx
  if (dir === 'prev') {
    const lb = findPrevBoundary(text, left, m)
    const plb = findPrevBoundary(text, Math.max(0, lb), m)
    if (lb === -1) {
      const cross = findTextRangeFromAdjacentBlock(block, 'prev', m)
      if (cross) return cross
      left = plb === -1 ? 0 : plb + 1
      right = lb === -1 ? right : lb
    } else {
      left = plb === -1 ? 0 : plb + 1
      right = lb
    }
  } else {
    const rb = findNextBoundary(text, right, m)
    const nrb = findNextBoundary(text, Math.min(text.length, rb + 1), m)
    if (rb === text.length) {
      const cross = findTextRangeFromAdjacentBlock(block, 'next', m)
      if (cross) return cross
      left = rb === text.length ? left : rb + 1
      right = nrb === text.length ? text.length : nrb
    } else {
      left = rb + 1
      right = nrb === text.length ? text.length : nrb
    }
  }

  const leftAdj = adjustIndexToNode(left, idx, 'forward')
  const rightAdj = adjustIndexToNode(right, idx, 'backward')
  const startPos = mapIndexToPosition(leftAdj, idx)
  const endPos = mapIndexToPosition(rightAdj, idx)
  if (!startPos || !endPos) return undefined
  const out = document.createRange()
  out.setStart(startPos.node, startPos.offset)
  out.setEnd(endPos.node, endPos.offset)
  return out
}

function findNeighborByGeometry(
  ref: Range,
  dir: 'prev' | 'next',
  m: Mode
): Range | undefined {
  const rects = visibleRects(ref)
  if (rects.length === 0) return undefined
  let pick = rects[0]
  if (dir !== 'prev') {
    for (let i = 1; i < rects.length; i++) pick = rects[i]
  }

  const base =
    dir === 'prev'
      ? pick.left + Math.min(14, Math.max(4, Math.floor(pick.width * 0.1)))
      : pick.right - Math.min(14, Math.max(4, Math.floor(pick.width * 0.1)))
  const offsets = [0, -8, 8]
  const step = Math.max(1, Math.min(36, Math.floor((pick.height || 16) * 0.45)))
  for (const dx of offsets) {
    const x = base + dx
    let y = dir === 'prev' ? pick.top - 1 : pick.bottom + 1
    for (let i = 0; i < 48; i++) {
      const cr = caretRangeFromPoint(x, y)
      if (cr) {
        const r = findSegmentRange(cr, m)
        if (r && hasVisibleRects(r)) return r
      }

      y = dir === 'prev' ? y - step : y + step
    }
  }

  const block = closestBlockElement(ref.startContainer)
  const cross = findTextRangeFromAdjacentBlock(block, dir, m)
  if (cross && hasVisibleRects(cross)) return cross
  return undefined
}

function findSegmentRange(caret: Range, m: Mode): Range | undefined {
  if (m === 'paragraph') return rangeForParagraph(caret)
  if (m === 'line') return rangeForLine(caret)
  return rangeForText(caret, m)
}

function hasVisibleRects(r: Range): boolean {
  const rects: DOMRect[] = []
  const anyR = r as any
  if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect as DOMRect)
  else {
    const list = r.getClientRects()
    for (const rect of Array.from(list)) rects.push(rect)
  }

  const filtered: DOMRect[] = []
  for (const r0 of rects) {
    if (r0.width <= 2) continue
    if (isPunctuationRect(r0)) continue
    filtered.push(r0)
  }

  return filtered.length > 0
}

function visibleRects(r: Range): DOMRect[] {
  const rects: DOMRect[] = []
  const anyR = r as any
  if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect as DOMRect)
  else {
    const list = r.getClientRects()
    for (const rect of Array.from(list)) rects.push(rect)
  }

  const out: DOMRect[] = []
  for (const r0 of rects) {
    if (r0.width <= 2) continue
    if (isPunctuationRect(r0)) continue
    out.push(r0)
  }

  return out
}

function scrollRangeIntoView(r: Range): void {
  const rects: DOMRect[] = []
  const anyR = r as any
  if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect as DOMRect)
  else {
    const list = r.getClientRects()
    for (const rect of Array.from(list)) rects.push(rect)
  }

  let top = Infinity
  let bottom = -Infinity
  for (const rr of rects) {
    if (rr.width <= 2) continue
    if (isPunctuationRect(rr)) continue
    top = Math.min(top, rr.top)
    bottom = Math.max(bottom, rr.bottom)
  }

  if (!Number.isFinite(top) || !Number.isFinite(bottom)) return
  const vh = globalThis.innerHeight || 0
  const margin = 80
  let targetY: number | undefined
  if (top < 0) targetY = globalThis.scrollY + top - margin
  else if (bottom > vh) targetY = globalThis.scrollY + (bottom - vh) + margin
  if (targetY === undefined) return
  const se = document.scrollingElement
  const maxY = (se?.scrollHeight || 0) - vh
  const y = Math.max(0, Math.min(maxY, targetY))
  if (se && typeof (se as any).scrollTo === 'function')
    (se as any).scrollTo({ top: y })
  else globalThis.scrollTo(0, y)
}

function drawRange(r: Range): void {
  const host = ensureOverlay()
  host.replaceChildren()
  const rects: DOMRect[] = []
  const anyR = r as any
  if (anyR.__singleLineRect) {
    rects.push(anyR.__singleLineRect as DOMRect)
  } else {
    const list = r.getClientRects()
    for (const rect of Array.from(list)) rects.push(rect)
  }

  const BOX_PAD_X = 6
  const DESIRED_PAD_Y = 2
  const UNDERLINE_OFFSET = 4
  const block = closestBlockElement(r.startContainer)
  let lineH = rects.length > 0 ? rects[0].height : 0
  if (block) {
    const cs = globalThis.getComputedStyle(block)
    const lh = Number.parseFloat(cs.lineHeight || '0')
    if (!Number.isNaN(lh) && lh > 0) lineH = lh
  }

  if (style === 'box') {
    const filtered: DOMRect[] = []
    for (const r0 of rects) {
      if (r0.width <= 2) continue
      if (isPunctuationRect(r0)) continue
      filtered.push(r0)
    }

    const groups: Array<{
      top: number
      bottom: number
      left: number
      right: number
      height: number
    }> = []
    const eps = MERGE_EPS
    for (const r0 of filtered) {
      const t0 = r0.top
      const b0 = r0.bottom
      let placed = false
      for (const g of groups) {
        const overlap = Math.min(b0, g.bottom) - Math.max(t0, g.top)
        const minH = Math.min(r0.height, g.height)
        if (overlap >= Math.max(0, minH * MERGE_MIN_OVERLAP_RATIO - eps)) {
          g.top = Math.min(g.top, t0)
          g.bottom = Math.max(g.bottom, b0)
          g.left = Math.min(g.left, r0.left)
          g.right = Math.max(g.right, r0.right)
          g.height = Math.max(g.height, r0.height)
          placed = true
          break
        }
      }

      if (!placed) {
        groups.push({
          top: t0,
          bottom: b0,
          left: r0.left,
          right: r0.right,
          height: r0.height,
        })
      }
    }

    const frag = document.createDocumentFragment()
    for (const g of groups) {
      const h = Math.min(g.height, lineH)
      const padY = Math.max(0, Math.min(DESIRED_PAD_Y, (lineH - h) / 2))
      const d = document.createElement('div')
      d.style.position = 'fixed'
      d.style.left = `${g.left - BOX_PAD_X}px`
      d.style.top = `${g.top - padY}px`
      d.style.width = `${Math.max(0, g.right - g.left + BOX_PAD_X * 2)}px`
      d.style.height = `${Math.max(0, h + padY * 2)}px`
      d.style.border = `2px dashed ${color}`
      d.style.borderRadius = '4px'
      d.style.boxSizing = 'border-box'
      frag.append(d)
    }

    host.append(frag)
  } else {
    const filtered: DOMRect[] = []
    for (const r0 of rects) {
      if (r0.width <= 2) continue
      if (isPunctuationRect(r0)) continue
      filtered.push(r0)
    }

    const groups: Array<{
      top: number
      bottom: number
      left: number
      right: number
    }> = []
    const eps = MERGE_EPS
    for (const r0 of filtered) {
      const t0 = r0.top
      const b0 = r0.bottom
      let placed = false
      for (const g of groups) {
        const overlap = Math.min(b0, g.bottom) - Math.max(t0, g.top)
        const minH = Math.min(r0.height, g.bottom - g.top)
        if (overlap >= Math.max(0, minH * MERGE_MIN_OVERLAP_RATIO - eps)) {
          g.top = Math.min(g.top, t0)
          g.bottom = Math.max(g.bottom, b0)
          g.left = Math.min(g.left, r0.left)
          g.right = Math.max(g.right, r0.right)
          placed = true
          break
        }
      }

      if (!placed)
        groups.push({ top: t0, bottom: b0, left: r0.left, right: r0.right })
    }

    const frag = document.createDocumentFragment()
    for (const g of groups) {
      const d = document.createElement('div')
      d.style.position = 'fixed'
      d.style.left = `${g.left}px`
      d.style.top = `${g.bottom + UNDERLINE_OFFSET}px`
      d.style.width = `${Math.max(0, g.right - g.left)}px`
      d.style.height = `0px`
      d.style.borderBottom = `2px dashed ${color}`
      frag.append(d)
    }

    host.append(frag)
  }
}

function onClick(e: MouseEvent): void {
  if (!enabled) return
  const t = e.target as Element | undefined
  if (isInteractive(t)) {
    clearOverlay()
    return
  }

  const cr = caretRangeFromPoint(e.clientX, e.clientY)
  if (!cr) return
  const r = findSegmentRange(cr, mode)
  if (!r) return
  drawRange(r)
  lastRange = r
}

function onSelectionChange(): void {
  const sel = globalThis.getSelection()
  if (!sel) return

  if (!sel.isCollapsed) {
    clearOverlay()
  }
}

function onSelectStart(): void {
  try {
    clearOverlay()
  } catch {}
}

function onMouseUp(): void {
  try {
    const sel = globalThis.getSelection()
    if (sel && !sel.isCollapsed) clearOverlay()
  } catch {}
}

function redraw(): void {
  if (!lastRange) return
  drawRange(lastRange)
}

function onScroll(): void {
  try {
    if (hideOnScroll) {
      clearOverlay()
    } else {
      if (!scrollingActive) {
        scrollingActive = true
        if (overlay) overlay.replaceChildren()
      }

      if (redrawDebounceTimer !== undefined) {
        globalThis.clearTimeout(redrawDebounceTimer)
        redrawDebounceTimer = undefined
      }

      redrawDebounceTimer = globalThis.setTimeout(() => {
        scrollingActive = false
        redrawDebounceTimer = undefined
        redraw()
      }, redrawDebounceMs)
    }
  } catch {}
}

function onResize(): void {
  try {
    if (hideOnScroll) return
    if (redrawDebounceTimer !== undefined) return
    redrawDebounceTimer = globalThis.setTimeout(() => {
      redrawDebounceTimer = undefined
      redraw()
    }, redrawDebounceMs)
  } catch {}
}

function onDblClick(): void {
  clearOverlay()
}

function onKeyDown(e: KeyboardEvent): void {
  if (!enabled) return
  if (!moveByArrows) return
  const t = e.target as Element | undefined
  if (isInteractive(t)) return
  if (e.ctrlKey || e.altKey || e.metaKey) return
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
  const dir = e.key === 'ArrowUp' ? 'prev' : 'next'
  const r = lastRange
  if (!r) return
  if (mode !== 'sentence' && mode !== 'clause') return
  let next = rangeForNeighbor(r, dir, mode)
  let steps = 0
  while (next && !hasVisibleRects(next) && steps < 16) {
    next = rangeForNeighbor(next, dir, mode)
    steps++
  }

  if ((!next || !hasVisibleRects(next)) && r) {
    next = findNeighborByGeometry(r, dir, mode)
  }

  if (!next || !hasVisibleRects(next)) return
  e.preventDefault()
  drawRange(next)
  lastRange = next
  const rectsOk = hasVisibleRects(next)
  if (!rectsOk) return
  const anyR = next as any
  const list = anyR.__singleLineRect
    ? [anyR.__singleLineRect as DOMRect]
    : Array.from(next.getClientRects())
  let fullyVisible = false
  for (const r0 of list) {
    const top = r0.top
    const bottom = r0.bottom
    if (top >= 0 && bottom <= globalThis.innerHeight) {
      fullyVisible = true
      break
    }
  }

  if (!fullyVisible) {
    scrollRangeIntoView(next)
    if (hideOnScroll) {
      globalThis.setTimeout(() => {
        if (lastRange) drawRange(lastRange)
      }, 50)
    }
  }
}

function installEvents(): void {
  if (!clickHandlerInstalled) {
    document.addEventListener('click', onClick, true)
    clickHandlerInstalled = true
  }

  if (!selectionHandlerInstalled) {
    document.addEventListener('selectionchange', onSelectionChange)
    selectionHandlerInstalled = true
  }

  if (!dblClickHandlerInstalled) {
    document.addEventListener('dblclick', onDblClick, true)
    dblClickHandlerInstalled = true
  }

  if (!selectStartInstalled) {
    document.addEventListener('selectstart', onSelectStart, true)
    selectStartInstalled = true
  }

  if (!mouseUpInstalled) {
    document.addEventListener('mouseup', onMouseUp, true)
    mouseUpInstalled = true
  }

  if (!scrollHandlerInstalled) {
    globalThis.addEventListener('scroll', onScroll, true)
    scrollHandlerInstalled = true
  }

  if (!resizeHandlerInstalled) {
    globalThis.addEventListener('resize', onResize)
    resizeHandlerInstalled = true
  }

  if (!keyHandlerInstalled) {
    document.addEventListener('keydown', onKeyDown, true)
    keyHandlerInstalled = true
  }
}

function removeEvents(): void {
  if (clickHandlerInstalled) {
    document.removeEventListener('click', onClick, true)
    clickHandlerInstalled = false
  }

  if (selectionHandlerInstalled) {
    document.removeEventListener('selectionchange', onSelectionChange)
    selectionHandlerInstalled = false
  }

  if (dblClickHandlerInstalled) {
    document.removeEventListener('dblclick', onDblClick, true)
    dblClickHandlerInstalled = false
  }

  if (selectStartInstalled) {
    document.removeEventListener('selectstart', onSelectStart, true)
    selectStartInstalled = false
  }

  if (mouseUpInstalled) {
    document.removeEventListener('mouseup', onMouseUp, true)
    mouseUpInstalled = false
  }

  if (scrollHandlerInstalled) {
    globalThis.removeEventListener('scroll', onScroll, true)
    scrollHandlerInstalled = false
  }

  if (resizeHandlerInstalled) {
    globalThis.removeEventListener('resize', onResize)
    resizeHandlerInstalled = false
  }

  if (keyHandlerInstalled) {
    document.removeEventListener('keydown', onKeyDown, true)
    keyHandlerInstalled = false
  }
}

function cycle<T>(arr: readonly T[], cur: T): T {
  const i = arr.indexOf(cur)
  const n = i === -1 ? 0 : (i + 1) % arr.length
  return arr[n]
}

function registerMenus(): void {
  try {
    if (menuIds.length > 0 && typeof GM_unregisterMenuCommand === 'function') {
      for (const id of menuIds) {
        try {
          GM_unregisterMenuCommand(id)
        } catch {}
      }
    }

    menuIds = []
  } catch {}

  if (typeof GM_registerMenuCommand !== 'function') return
  const id = GM_registerMenuCommand('设置', () => {
    openSettingsPanel()
  })
  try {
    menuIds.push(id as any)
  } catch {}
}

function listenSettings(): void {
  if (typeof GM_addValueChangeListener !== 'function') return
  GM_addValueChangeListener(MODE_KEY, (_, __, nv) => {
    mode = nv as Mode
    if (lastRange) {
      const caret = document.createRange()
      caret.setStart(lastRange.startContainer, lastRange.startOffset)
      caret.collapse(true)
      const r = findSegmentRange(caret, mode)
      if (r) {
        drawRange(r)
        lastRange = r
      } else {
        clearOverlay()
      }
    }
  })
  GM_addValueChangeListener(STYLE_KEY, (_, __, nv) => {
    style = nv as Style
    if (lastRange) drawRange(lastRange)
    else clearOverlay()
  })
  GM_addValueChangeListener(COLOR_KEY, (_, __, nv) => {
    color = nv as string
    if (lastRange) drawRange(lastRange)
    else clearOverlay()
  })
  GM_addValueChangeListener(ENABLED_KEY, (_, __, nv) => {
    enabled = typeof nv === 'string' ? nv === '1' : Boolean(nv)
    if (enabled) installEvents()
    else {
      clearOverlay()
      removeEvents()
    }
  })
  GM_addValueChangeListener(SCROLL_HIDE_KEY, (_, __, nv) => {
    hideOnScroll = Boolean(nv)
    if (hideOnScroll) clearOverlay()
  })
  GM_addValueChangeListener(MOVE_BY_ARROWS_KEY, (_, __, nv) => {
    moveByArrows = Boolean(nv)
  })
}

function bootstrap(): void {
  const d = document.documentElement
  if ((d.dataset as any).readHelper === '1') return
  ;(d.dataset as any).readHelper = '1'
  if (enabled) installEvents()
  registerMenus()
  listenSettings()
  void (async () => {
    try {
      const mv = await (GM as any).getValue(MODE_KEY, mode)
      mode = mv as Mode
    } catch {}

    try {
      const sv = await (GM as any).getValue(STYLE_KEY, style)
      style = sv as Style
    } catch {}

    try {
      const cv = await (GM as any).getValue(COLOR_KEY, color)
      color = String(cv || color)
    } catch {}

    try {
      const ev = await (GM as any).getValue(ENABLED_KEY, enabled ? '1' : '0')
      const flag = typeof ev === 'string' ? ev === '1' : Boolean(ev)
      enabled = flag
      if (enabled) installEvents()
      else removeEvents()
    } catch {}

    try {
      const sh = await (GM as any).getValue(SCROLL_HIDE_KEY, hideOnScroll)
      hideOnScroll = Boolean(sh)
    } catch {}

    try {
      const ma = await (GM as any).getValue(MOVE_BY_ARROWS_KEY, moveByArrows)
      moveByArrows = Boolean(ma)
    } catch {}
  })()
}

bootstrap()
