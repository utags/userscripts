import { doc } from '../globals/doc'
import {
  closestBlockElement,
  hasNestedBlock,
  isElementVisible,
  caretRangeFromPoint,
} from './dom'

export type TextIndex = {
  nodes: Text[]
  starts: number[]
  ends: number[]
  text: string
}

export function buildTextIndex(root: Element): TextIndex {
  const nodes: Text[] = []
  const texts: string[] = []
  const tw = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (tw.nextNode()) {
    const t = tw.currentNode as Text
    if (hasNestedBlock(root, t)) continue
    if (!isElementVisible(t.parentElement || undefined)) continue
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

const textIndexCache = new WeakMap<
  Element,
  { index: TextIndex; textLength: number }
>()

export function getTextIndex(root: Element): TextIndex {
  const tl = (root.textContent || '').length
  const cached = textIndexCache.get(root)
  if (cached && cached.textLength === tl) return cached.index
  const idx = buildTextIndex(root)
  textIndexCache.set(root, { index: idx, textLength: tl })
  return idx
}

export function mapIndexToPosition(
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

export function adjustIndexToNode(
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

export function mapPositionToIndex(
  node: Node,
  offset: number,
  index: TextIndex
): number | undefined {
  const i = index.nodes.indexOf(node as Text)
  if (i !== -1) return index.starts[i] + offset
  return undefined
}

export function isSentenceTerminator(ch: string): boolean {
  return /[。．｡.!?！？…]/.test(ch)
}

export function isClauseTerminator(ch: string): boolean {
  return /[，,、；;：:.。！？!?]/.test(ch)
}

export function findPrevBoundary(
  text: string,
  pos: number,
  m: 'sentence' | 'clause'
): number {
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

export function findNextBoundary(
  text: string,
  pos: number,
  m: 'sentence' | 'clause'
): number {
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

export function rangeForParagraph(caret: Range): Range {
  const block = closestBlockElement(caret.startContainer)
  const r = doc.createRange()
  r.selectNodeContents(block)
  return r
}

export function rangeForLine(caret: Range): Range | undefined {
  const block = closestBlockElement(caret.startContainer)
  const caretRect = caret.getBoundingClientRect()
  const r = doc.createRange()
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
  const out = doc.createRange()
  out.setStart(block, 0)
  out.setEnd(block, block.childNodes.length)
  ;(out as any).__singleLineRect = pick
  return out
}

export function rangeForText(
  caret: Range,
  m: 'sentence' | 'clause'
): Range | undefined {
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

  const sAdj = adjustIndexToNode(s, idx, 'forward')
  const eAdj = adjustIndexToNode(e, idx, 'backward')
  const startPos = mapIndexToPosition(sAdj, idx)
  const endPos = mapIndexToPosition(eAdj, idx)
  if (!startPos || !endPos) return undefined
  const r = doc.createRange()
  r.setStart(startPos.node, startPos.offset)
  r.setEnd(endPos.node, endPos.offset)
  return r
}

export function isPunctuationRect(rect: {
  left: number
  top: number
  width: number
  height: number
}): boolean {
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
