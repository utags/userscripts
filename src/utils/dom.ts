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
