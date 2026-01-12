import { doc } from '../globals/doc'
import { c } from './c'

export function shouldOpenInCurrentTab(
  e: MouseEvent | KeyboardEvent,
  target?: HTMLAnchorElement | HTMLAreaElement
) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false
  if (target && target.target === '_blank') return false
  return true
}

export function clearChildren(el: Node & ParentNode) {
  try {
    ;(el as any).textContent = ''
  } catch {
    try {
      while (el.firstChild) el.firstChild.remove()
    } catch {}
  }
}

export function querySelectorAllDeep(
  root: Document | ShadowRoot | Element,
  selector: string
) {
  const result: Element[] = []
  const visited = new Set<Node>()
  const visit = (node: Node | undefined) => {
    if (!node || visited.has(node)) return
    visited.add(node)
    const anyNode = node as any
    try {
      if (typeof anyNode.querySelectorAll === 'function') {
        const found = Array.from<any>(anyNode.querySelectorAll(selector))
        for (const el of found) if (el instanceof Element) result.push(el)
      }
    } catch {}

    try {
      const children: Node[] = Array.from(anyNode.childNodes || [])
      for (const child of children) visit(child)
    } catch {}

    try {
      const shadow: ShadowRoot | undefined = anyNode.shadowRoot
      if (shadow) visit(shadow)
    } catch {}
  }

  visit(root)
  return Array.from(new Set(result))
}

export function isElementVisible(el: Element | undefined): boolean {
  if (!el) return true
  try {
    const anyEl = el as any
    if (
      typeof anyEl.checkVisibility === 'function' &&
      anyEl.checkVisibility() === false
    )
      return false
  } catch {}

  let cur: Element | undefined = el
  while (cur) {
    const he = cur as any
    if (typeof he.hidden === 'boolean' && he.hidden) return false
    const cs = globalThis.getComputedStyle(cur)
    if (cs.display === 'none') return false
    if (cs.visibility === 'hidden') return false
    if (he !== doc.body && he.parentElement && he.offsetParent === null)
      return false

    cur = (cur.parentElement || undefined) as Element | undefined
  }

  return true
}

export function isInteractive(el: Element | undefined): boolean {
  if (!el) return false
  const tag = (el.tagName || '').toLowerCase()
  if (['input', 'textarea', 'select', 'button'].includes(tag)) return true
  if (
    typeof el.hasAttribute === 'function' &&
    el.hasAttribute('contenteditable')
  )
    return true
  return false
}

export function isBlockElement(el: Element): boolean {
  const cs = globalThis.getComputedStyle(el)
  const d = cs.display
  const tag = (el.tagName || '').toLowerCase()
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

export function closestBlockElement(node: Node): Element {
  let el =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : node.parentElement || doc.body
  while (el && el !== doc.body) {
    if (isBlockElement(el)) return el
    el = el.parentElement || doc.body
  }

  return doc.body
}

export function hasNestedBlock(root: Element, t: Text): boolean {
  let el: Element | undefined = t.parentElement || undefined
  while (el && el !== root) {
    if (isBlockElement(el)) return true
    el = (el.parentElement || undefined) as Element | undefined
  }

  return false
}

export function caretRangeFromPoint(x: number, y: number): Range | undefined {
  const anyDoc = document as any
  if (typeof anyDoc.caretRangeFromPoint === 'function') {
    const r = anyDoc.caretRangeFromPoint(x, y)
    if (r) return r as Range
  }

  if (typeof anyDoc.caretPositionFromPoint === 'function') {
    const pos = anyDoc.caretPositionFromPoint(x, y)
    if (pos && pos.offsetNode !== undefined && pos.offsetNode !== null) {
      const r = doc.createRange()
      r.setStart(pos.offsetNode, pos.offset)
      r.collapse(true)
      return r
    }
  }

  const sel = globalThis.getSelection()
  if (!sel) return undefined
  const r = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : doc.createRange()
  return r
}

export function addStyleToShadow(shadowRoot: ShadowRoot, css: string): void {
  try {
    if (shadowRoot.adoptedStyleSheets) {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(css)
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet]
      return
    }
  } catch {}

  const s = c('style', { text: css })
  shadowRoot.append(s)
}

function camelToKebab(str: string) {
  return str.replaceAll(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

export function ensureShadowRoot(options: {
  hostId: string
  hostDatasetKey?: string
  style?: string
  moveToEnd?: boolean
}): { host: HTMLDivElement; root: ShadowRoot; existed: boolean } {
  const key = options.hostDatasetKey || 'userscriptHost'
  const val = options.hostId
  const attrKey = camelToKebab(key)
  const sel = `[data-${attrKey}="${val}"]`

  const existing = doc.querySelector(sel)
  if (existing instanceof HTMLDivElement && existing.shadowRoot) {
    if (!existing.isConnected || options.moveToEnd) {
      try {
        doc.documentElement.append(existing)
      } catch {}
    }

    return { host: existing, root: existing.shadowRoot, existed: true }
  }

  const host = c('div', { dataset: { [key]: val } })
  const root = host.attachShadow({ mode: 'open' })

  if (options.style) {
    addStyleToShadow(root, options.style)
  }

  doc.documentElement.append(host)
  return { host, root, existed: false }
}
