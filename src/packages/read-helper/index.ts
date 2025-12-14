import {
  isElementVisible,
  isInteractive,
  isBlockElement,
  closestBlockElement,
  caretRangeFromPoint,
  hasNestedBlock,
} from '../../utils/dom'
import { c } from '../../utils/c'
import {
  type TextIndex,
  getTextIndex,
  mapIndexToPosition,
  mapPositionToIndex,
  adjustIndexToNode,
  findPrevBoundary,
  findNextBoundary,
  rangeForParagraph,
  rangeForLine,
  rangeForText,
  isPunctuationRect,
} from '../../utils/text'
import {
  type Mode,
  type Style,
  DEFAULT_READ_HELPER_SETTINGS,
  READ_HELPER_SETTINGS_KEY,
} from './config'
import {
  createObjectSettingsStore,
  openSettingsPanel as openPanel,
  type Field,
  type PanelSchema,
} from '../../common/settings'

let mode: Mode = DEFAULT_READ_HELPER_SETTINGS.mode
let style: Style = DEFAULT_READ_HELPER_SETTINGS.style
let color = DEFAULT_READ_HELPER_SETTINGS.color
let enabled = DEFAULT_READ_HELPER_SETTINGS.enabled
let hideOnScroll = DEFAULT_READ_HELPER_SETTINGS.hideOnScroll
let moveByArrows = DEFAULT_READ_HELPER_SETTINGS.moveByArrows
let skipButtons = DEFAULT_READ_HELPER_SETTINGS.skipButtons
let skipLinks = DEFAULT_READ_HELPER_SETTINGS.skipLinks

const store = createObjectSettingsStore(
  READ_HELPER_SETTINGS_KEY,
  DEFAULT_READ_HELPER_SETTINGS
)

let overlay: HTMLDivElement | undefined
let clickHandlerInstalled = false
let selectionHandlerInstalled = false
let dblClickHandlerInstalled = false
let keyHandlerInstalled = false
let selectStartInstalled = false
let mouseUpInstalled = false
let scrollHandlerInstalled = false
let resizeHandlerInstalled = false
let lastRange: Range | undefined
let redrawDebounceTimer: number | undefined
const redrawDebounceMs = 200
const MERGE_EPS = 2
const MERGE_MIN_OVERLAP_RATIO = 0.5
let scrollingActive = false

function ensureOverlay(): HTMLDivElement {
  if (!overlay) {
    overlay = c('div', {
      attrs: { id: 'read-helper-overlay' },
      style: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0',
        height: '0',
        pointerEvents: 'none',
        zIndex: '2147483647',
      },
    })
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

function caretAtBlockEdge(
  block: Element,
  edge: 'start' | 'end'
): Range | undefined {
  if (!isElementVisible(block)) return undefined
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
      if (!isElementVisible(el)) continue
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
    const r =
      m === 'line'
        ? rangeForLine(caret)
        : rangeForText(caret, m === 'sentence' ? 'sentence' : 'clause')
    if (r && hasVisibleRects(r)) return r
    cur = adj
    loops++
  }

  return undefined
}

// text index moved to utils/text

// helpers moved to utils/text

// helpers moved to utils/text

// helpers moved to utils/text

// terminators moved to utils/text

// boundaries moved to utils/text

// boundaries moved to utils/text

// isPunctuationRect moved to utils/text

// rangeForParagraph moved to utils/text

// rangeForLine moved to utils/text

// rangeForText moved to utils/text

function rangeForNeighbor(
  ref: Range,
  dir: 'prev' | 'next',
  m: Mode
): Range | undefined {
  const block = closestBlockElement(ref.startContainer)
  if (!isElementVisible(block)) return undefined
  const idx = getTextIndex(block)
  if (idx.nodes.length === 0) return undefined
  const sIdx = mapPositionToIndex(ref.startContainer, ref.startOffset, idx)
  const eIdx = mapPositionToIndex(ref.endContainer, ref.endOffset, idx)
  if (sIdx === undefined || eIdx === undefined) return undefined
  const text = idx.text
  let left = sIdx
  let right = eIdx
  const mm = m === 'sentence' ? 'sentence' : 'clause'
  if (dir === 'prev') {
    const lb = findPrevBoundary(text, left, mm)
    const plb = findPrevBoundary(text, Math.max(0, lb), mm)
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
    const rb = findNextBoundary(text, right, mm)
    const nrb = findNextBoundary(text, Math.min(text.length, rb + 1), mm)
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
        const sc = cr.startContainer
        const owner =
          sc.nodeType === Node.ELEMENT_NODE ? (sc as Element) : sc.parentElement
        if (owner && !isElementVisible(owner)) {
          // Skip invisible targets
        } else {
          const r = findSegmentRange(cr, m)
          if (r && hasVisibleRects(r)) return r
        }
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
  const sc = caret.startContainer
  const owner =
    sc.nodeType === Node.ELEMENT_NODE ? (sc as Element) : sc.parentElement
  if (owner && !isElementVisible(owner)) return undefined
  if (m === 'paragraph') return rangeForParagraph(caret)
  if (m === 'line') return rangeForLine(caret)
  return rangeForText(caret, m === 'sentence' ? 'sentence' : 'clause')
}

function hasVisibleRects(r: Range): boolean {
  const rects: DOMRect[] = []
  const anyR = r as any
  if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect as DOMRect)
  else {
    const list = r.getClientRects()
    for (const rect of Array.from(list)) rects.push(rect)
  }

  const block = closestBlockElement(r.startContainer)
  if (!isElementVisible(block)) return false
  const clip = block.getBoundingClientRect()
  let count = 0
  for (const r0 of rects) {
    const left = Math.max(r0.left, clip.left)
    const right = Math.min(r0.right, clip.right)
    const top = Math.max(r0.top, clip.top)
    const bottom = Math.min(r0.bottom, clip.bottom)
    const w = right - left
    const h = bottom - top
    if (w <= 2 || h <= 0) continue
    const test = new DOMRect(left, top, w, h)
    if (isPunctuationRect(test)) continue
    count++
    if (count > 0) break
  }

  return count > 0
}

function visibleRects(r: Range): DOMRect[] {
  const rects: DOMRect[] = []
  const anyR = r as any
  if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect as DOMRect)
  else {
    const list = r.getClientRects()
    for (const rect of Array.from(list)) rects.push(rect)
  }

  const block = closestBlockElement(r.startContainer)
  if (!isElementVisible(block)) return []
  const clip = block.getBoundingClientRect()
  const out: DOMRect[] = []
  for (const r0 of rects) {
    const left = Math.max(r0.left, clip.left)
    const right = Math.min(r0.right, clip.right)
    const top = Math.max(r0.top, clip.top)
    const bottom = Math.min(r0.bottom, clip.bottom)
    const w = right - left
    const h = bottom - top
    if (w <= 2 || h <= 0) continue
    const rr = new DOMRect(left, top, w, h)
    if (isPunctuationRect(rr)) continue
    out.push(rr)
  }

  return out
}

function isButtonLikeElement(el: Element | undefined): boolean {
  if (!el) return false
  const tag = (el.tagName || '').toLowerCase()
  if (tag === 'button') return true
  const tokens: string[] = Array.from(el.classList || [])
  for (const c of tokens) {
    if (
      c === 'btn' ||
      c.startsWith('btn') ||
      c === 'button' ||
      c.startsWith('button')
    )
      return true
  }

  return false
}

function isButtonLikeRange(r: Range): boolean {
  const sc = r.startContainer
  const owner =
    sc.nodeType === Node.ELEMENT_NODE
      ? (sc as Element)
      : (sc as any).parentElement
  return isButtonLikeElement(owner)
}

function rangeVerticalBounds(
  r: Range
): { top: number; bottom: number } | undefined {
  const rects = visibleRects(r)
  let top = Infinity
  let bottom = -Infinity
  for (const rr of rects) {
    if (rr.width <= 2) continue
    if (isPunctuationRect(rr)) continue
    top = Math.min(top, rr.top)
    bottom = Math.max(bottom, rr.bottom)
  }

  if (!Number.isFinite(top) || !Number.isFinite(bottom)) return undefined
  return { top, bottom }
}

function isSameVisualLine(a: Range, b: Range): boolean {
  const va = rangeVerticalBounds(a)
  const vb = rangeVerticalBounds(b)
  if (!va || !vb) return false
  const overlap = Math.min(va.bottom, vb.bottom) - Math.max(va.top, vb.top)
  const minH = Math.min(va.bottom - va.top, vb.bottom - vb.top)
  return overlap >= Math.max(0, minH * MERGE_MIN_OVERLAP_RATIO - MERGE_EPS)
}

function scrollRangeIntoView(r: Range, dir?: 'prev' | 'next'): void {
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
  const center = (top + bottom) / 2
  const desired = vh * 0.5
  const tolerance = Math.max(120, Math.floor(vh * 0.18))
  const fullyVisible = top >= 0 && bottom <= vh
  const nearCenter = Math.abs(center - desired) <= tolerance
  let targetY: number | undefined
  if (!fullyVisible) {
    if (top < 0) targetY = globalThis.scrollY + top - margin
    else if (bottom > vh) targetY = globalThis.scrollY + (bottom - vh) + margin
  } else if (!nearCenter) {
    const h = bottom - top
    targetY =
      h >= vh * 0.8
        ? globalThis.scrollY + top - margin
        : globalThis.scrollY + (center - desired)
  }

  if (targetY === undefined) return
  const se = document.scrollingElement
  const maxY = (se?.scrollHeight || 0) - vh
  const curY = se
    ? Number((se as any).scrollTop || 0)
    : Number(globalThis.scrollY || 0)
  let y = Math.max(0, Math.min(maxY, targetY))

  if (dir === 'next' && y < curY) y = curY
  else if (dir === 'prev' && y > curY) y = curY
  if (se && typeof (se as any).scrollTo === 'function') {
    ;(se as any).scrollTo({ top: y, behavior: 'smooth' })
  } else {
    globalThis.scrollTo({ top: y, behavior: 'smooth' } as any)
  }
}

function drawRange(r: Range): void {
  const host = ensureOverlay()
  host.replaceChildren()
  const rects = visibleRects(r)

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
    const filtered: DOMRect[] = rects
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
      const d = c('div', {
        style: {
          position: 'fixed',
          left: `${g.left - BOX_PAD_X}px`,
          top: `${g.top - padY}px`,
          width: `${Math.max(0, g.right - g.left + BOX_PAD_X * 2)}px`,
          height: `${Math.max(0, h + padY * 2)}px`,
          border: `2px dashed ${color}`,
          borderRadius: '4px',
          boxSizing: 'border-box',
        },
      })
      frag.append(d)
    }

    host.append(frag)
  } else {
    const filtered: DOMRect[] = rects

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
      const d = c('div', {
        style: {
          position: 'fixed',
          left: `${g.left}px`,
          top: `${g.bottom + UNDERLINE_OFFSET}px`,
          width: `${Math.max(0, g.right - g.left)}px`,
          height: '0px',
          borderBottom: `2px dashed ${color}`,
        },
      })
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

  if (skipLinks && t && t.closest('a')) {
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
  let sameLine = isSameVisualLine(r, next)
  if (skipButtons && isButtonLikeRange(next)) {
    let hop = 0
    let alt: Range | undefined = next
    while (alt && hop < 32) {
      const nn = rangeForNeighbor(alt, dir, mode)
      alt = nn
      hop++
      if (!alt || !hasVisibleRects(alt)) {
        const gg = findNeighborByGeometry(next, dir, mode)
        alt = gg
      }

      if (alt && hasVisibleRects(alt) && !isButtonLikeRange(alt)) break
    }

    if (alt && hasVisibleRects(alt) && !isButtonLikeRange(alt)) {
      next = alt
      drawRange(next)
      lastRange = next
      sameLine = isSameVisualLine(r, next)
    }
  }

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

  const vh2 = globalThis.innerHeight
  const center2 = globalThis.innerHeight ? globalThis.innerHeight / 2 : 0
  let nearCenter2 = false
  if (vh2) {
    const list2 = anyR.__singleLineRect
      ? [anyR.__singleLineRect as DOMRect]
      : Array.from(next.getClientRects())
    let t2 = Infinity
    let b2 = -Infinity
    for (const rr of list2) {
      if (rr.width <= 2) continue
      if (isPunctuationRect(rr)) continue
      t2 = Math.min(t2, rr.top)
      b2 = Math.max(b2, rr.bottom)
    }

    if (Number.isFinite(t2) && Number.isFinite(b2)) {
      const c2 = (t2 + b2) / 2
      const tol2 = Math.max(120, Math.floor(vh2 * 0.18))
      nearCenter2 = Math.abs(c2 - center2) <= tol2
    }
  }

  if (!sameLine && (!fullyVisible || !nearCenter2)) {
    scrollRangeIntoView(next, dir)
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

function openSettingsPanel(): void {
  const schema: PanelSchema = {
    type: 'simple',
    title: '阅读助手设置',
    fields: [
      { type: 'toggle', key: 'enabled', label: '启用' },
      {
        type: 'radio',
        key: 'mode',
        label: '模式',
        options: [
          { value: 'sentence', label: '按句' },
          { value: 'clause', label: '按段' },
          { value: 'line', label: '按行' },
          { value: 'paragraph', label: '整段' },
        ],
      },
      {
        type: 'radio',
        key: 'style',
        label: '样式',
        options: [
          { value: 'box', label: '虚线框' },
          { value: 'underline', label: '下划线' },
        ],
      },
      {
        type: 'colors',
        key: 'color',
        label: '颜色',
        options: [
          { value: '#ff4d4f' },
          { value: '#3b82f6' },
          { value: '#22c55e' },
          { value: '#f59e0b' },
          { value: '#8b5cf6' },
          { value: '#111827' },
        ],
      },
      { type: 'toggle', key: 'moveByArrows', label: '用方向键移动' },
      { type: 'toggle', key: 'hideOnScroll', label: '滚动时隐藏' },
      { type: 'toggle', key: 'skipButtons', label: '跳过按钮' },
      { type: 'toggle', key: 'skipLinks', label: '跳过链接' },
    ] as Field[],
  }

  openPanel(schema, store, {
    hostDatasetKey: 'rhHost',
    hostDatasetValue: 'read-helper-settings',
    theme: {
      activeBg: '#111827',
      activeFg: '#ffffff',
      colorRing: '#111827',
      toggleOnBg: '#111827',
    },
  })
}

function installUrlWatcher(): void {
  let lastUrl = globalThis.location.href
  const onUrlChanged = () => {
    const cur = globalThis.location.href
    if (cur === lastUrl) return
    lastUrl = cur
    if (!lastRange) return
    const sc = lastRange.startContainer
    const ec = lastRange.endContainer
    const stillConnected =
      Boolean(sc && (sc as any).isConnected) &&
      Boolean(ec && (ec as any).isConnected)
    if (!stillConnected) {
      clearOverlay()
      return
    }

    const anc = lastRange.commonAncestorContainer
    const elem = anc instanceof Element ? anc : anc.parentElement || undefined
    const block = elem ? closestBlockElement(elem) || elem : undefined
    if (!block || !isElementVisible(block)) {
      clearOverlay()
    }
  }

  try {
    const origPush = history.pushState
    history.pushState = function (...args: any[]) {
      const ret = origPush.apply(history, args as any)
      onUrlChanged()
      return ret
    } as any
  } catch {}

  try {
    const origReplace = history.replaceState
    history.replaceState = function (...args: any[]) {
      const ret = origReplace.apply(history, args as any)
      onUrlChanged()
      return ret
    } as any
  } catch {}

  globalThis.addEventListener('popstate', onUrlChanged)
  globalThis.addEventListener('hashchange', onUrlChanged)
}

function registerMenus(): void {
  if (typeof GM_registerMenuCommand !== 'function') return
  GM_registerMenuCommand('设置', () => {
    ;(async () => {
      try {
        openSettingsPanel()
      } catch {}
    })()
  })
}

function listenSettings(): void {
  try {
    store.onChange?.(() => {
      void applySettingsFromStore()
    })
  } catch {}
}

async function applySettingsFromStore(): Promise<void> {
  try {
    const prevEnabled = enabled
    const obj = await store.getAll<{
      mode: Mode
      style: Style
      color: string
      enabled: boolean
      hideOnScroll: boolean
      moveByArrows: boolean
      skipButtons: boolean
      skipLinks: boolean
    }>()

    mode = obj.mode
    style = obj.style
    color = String(obj.color || '')
    enabled = Boolean(obj.enabled)
    hideOnScroll = Boolean(obj.hideOnScroll)
    moveByArrows = Boolean(obj.moveByArrows)
    skipButtons = Boolean(obj.skipButtons)
    skipLinks = Boolean(obj.skipLinks)

    const changed = prevEnabled !== enabled
    if (changed) {
      if (enabled) installEvents()
      else {
        clearOverlay()
        removeEvents()
      }
    } else if (lastRange) {
      drawRange(lastRange)
    } else {
      clearOverlay()
    }
  } catch {}
}

function bootstrap(): void {
  const d = document.documentElement
  if ((d.dataset as any).readHelper === '1') return
  ;(d.dataset as any).readHelper = '1'
  if (enabled) installEvents()
  registerMenus()
  listenSettings()
  void applySettingsFromStore()
  installUrlWatcher()
}

bootstrap()
export type { Mode, Style } from './config'
export { findNeighborByGeometry }
