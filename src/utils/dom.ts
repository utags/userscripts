import { getWrappedIconUrl } from './favicon'
import { xmlHttpRequest } from '../common/gm'

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

const iconCache = new Map<string, string>()

export function renderIcon(s?: string) {
  const span = document.createElement('span')
  span.className = 'icon'
  let t = String(s || '').trim()
  if (!t) t = 'lucide:link'
  if (t.startsWith('lucide:')) {
    const k = t.split(':')[1]
    injectLucideIcon(span, k)
    return span
  }

  if (t.startsWith('url:')) {
    const url = t.slice(4)
    injectImageAsData(span, getWrappedIconUrl(url))
    return span
  }

  if (t.startsWith('svg:')) {
    try {
      const svg = t.slice(4)
      const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
      const img = document.createElement('img')
      img.width = 16
      img.height = 16
      img.style.objectFit = 'contain'
      img.src = url
      clearChildren(span)
      span.append(img)
    } catch {}

    return span
  }

  span.textContent = t
  return span
}

export function setIcon(el: HTMLElement, icon?: string, title?: string) {
  try {
    clearChildren(el)
    el.append(renderIcon(icon))
    if (title !== undefined) el.title = title
  } catch {}
}

let lastSuccessfulCdnIndex = 0
const cdnBases = [
  'https://cdn.jsdelivr.net/npm',
  'https://fastly.jsdelivr.net/npm',
  'https://unpkg.com',
]

function injectLucideIcon(container: HTMLElement, name: string) {
  try {
    const cached = iconCache.get(name)
    if (cached) {
      const img = document.createElement('img')
      img.width = 16
      img.height = 16
      img.style.objectFit = 'contain'
      img.className = 'lucide-icon'
      img.src = cached
      clearChildren(container)
      container.append(img)
      return
    }
  } catch {}

  const orderedCdnIndices = [
    lastSuccessfulCdnIndex,
    ...[0, 1, 2].filter((i) => i !== lastSuccessfulCdnIndex),
  ]

  const tryFetch = (attempt: number) => {
    if (attempt >= orderedCdnIndices.length) {
      return // All CDNs failed
    }

    const cdnIndex = orderedCdnIndices[attempt]
    const cdnBase = cdnBases[cdnIndex]
    const url = `${cdnBase}/lucide-static@latest/icons/${name}.svg`

    try {
      xmlHttpRequest({
        method: 'GET',
        url,
        onload(res: any) {
          try {
            const svg = String(res.responseText || '')
            if (res.status >= 200 && res.status < 300 && svg) {
              const dataUrl =
                'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
              iconCache.set(name, dataUrl)
              const img = document.createElement('img')
              img.width = 16
              img.height = 16
              img.style.objectFit = 'contain'
              img.className = 'lucide-icon'
              img.src = dataUrl
              clearChildren(container)
              container.append(img)
              // Remember this CDN for next time
              lastSuccessfulCdnIndex = cdnIndex
            } else {
              tryFetch(attempt + 1)
            }
          } catch {
            tryFetch(attempt + 1)
          }
        },
        onerror() {
          tryFetch(attempt + 1)
        },
      })
    } catch {
      tryFetch(attempt + 1)
    }
  }

  tryFetch(0)
}

function injectImageAsData(container: HTMLElement, url: string) {
  try {
    xmlHttpRequest({
      method: 'GET',
      url,
      responseType: 'blob' as any,
      onload(res: any) {
        try {
          const blob = res.response as Blob
          if (!blob) return
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            const img = document.createElement('img')
            img.width = 16
            img.height = 16
            img.style.objectFit = 'contain'
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            img.src = String(reader.result || '')
            clearChildren(container)
            container.append(img)
          })
          reader.readAsDataURL(blob)
        } catch {}
      },
    })
  } catch {}
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
    if (he !== document.body && he.parentElement && he.offsetParent === null)
      return false

    cur = (cur.parentElement || undefined) as Element | undefined
  }

  return true
}

export function isInteractive(el: Element | undefined): boolean {
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  if (['input', 'textarea', 'select', 'button'].includes(tag)) return true
  if (el.hasAttribute('contenteditable')) return true
  return false
}

export function isBlockElement(el: Element): boolean {
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

export function closestBlockElement(node: Node): Element {
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
