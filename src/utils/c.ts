import { doc } from '../globals/doc'

export function c<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  opts?: {
    className?: string
    classes?: string[]
    dataset?: Record<string, string>
    attrs?: Record<string, string>
    style?: Record<string, string>
    text?: string
    value?: string
    type?: string
    rows?: number
    placeholder?: string
    checked?: boolean
    children?: Array<Node | string>
  }
): HTMLElementTagNameMap[K] {
  const el = doc.createElement(tag)
  if (!opts) return el
  if (opts.className) (el as any).className = opts.className
  if (opts.classes)
    for (const cls of opts.classes) (el as any).classList.add(cls)
  if (opts.dataset && (el as any).dataset)
    for (const k of Object.keys(opts.dataset))
      (el as any).dataset[k] = opts.dataset[k]
  if (opts.attrs)
    for (const k of Object.keys(opts.attrs))
      (el as any).setAttribute(k, opts.attrs[k])
  if (opts.style)
    for (const k of Object.keys(opts.style))
      (el as any).style[k] = opts.style[k]
  if ('text' in opts) (el as any).textContent = opts.text || ''
  if (opts.type && 'type' in (el as any)) (el as any).type = opts.type
  if ('value' in opts && 'value' in (el as any))
    (el as any).value = opts.value || ''
  if (opts.rows && 'rows' in (el as any)) (el as any).rows = opts.rows
  if (opts.placeholder && 'placeholder' in (el as any))
    (el as any).placeholder = opts.placeholder
  if (typeof opts.checked === 'boolean' && 'checked' in (el as any))
    (el as any).checked = opts.checked
  if (opts.children) {
    for (const ch of opts.children) {
      if (typeof ch === 'string') (el as any).append(doc.createTextNode(ch))
      else (el as any).append(ch)
    }
  }

  return el
}
