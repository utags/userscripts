export function registerMenu(caption: string, onClick: () => void): number {
  if (typeof GM_registerMenuCommand === 'function') {
    return GM_registerMenuCommand(caption, onClick)
  }

  return 0
}

export function unregisterMenu(menuId: number): void {
  if (typeof GM_unregisterMenuCommand === 'function') {
    GM_unregisterMenuCommand(menuId)
  }
}

export function openInTab(
  url: string,
  options?: { active?: boolean; insert?: boolean }
): void {
  if (typeof GM_openInTab === 'function') {
    GM_openInTab(url, options)
    return
  }

  globalThis.open(url, '_blank')
}

export function xmlHttpRequest(options: {
  method: string
  url: string
  responseType?: string
  onload?: (response: any) => void
  onerror?: (error: unknown) => void
}): void {
  try {
    if (
      typeof GM !== 'undefined' &&
      typeof (GM as any).xmlHttpRequest === 'function'
    ) {
      ;(GM as any).xmlHttpRequest(options)
      return
    }
  } catch {}

  try {
    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest(options as any)
    }
  } catch {}
}

export async function xmlHttpRequestWithFallback(options: {
  method: string
  url: string
  responseType?: string
  onload?: (response: any) => void
  onerror?: (error: unknown) => void
}): Promise<void> {
  try {
    if (
      typeof GM !== 'undefined' &&
      typeof (GM as any).xmlHttpRequest === 'function'
    ) {
      ;(GM as any).xmlHttpRequest(options)
      return
    }
  } catch {}

  try {
    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest(options as any)
      return
    }
  } catch {}

  try {
    const { url, method, responseType, onload, onerror } = options
    const init: RequestInit = { method }
    const res = await fetch(url, init)
    try {
      let responseText = ''
      let response: any
      if (responseType === 'blob') {
        response = await res.blob()
      } else {
        responseText = await res.text()
      }

      onload?.({ status: res.status, responseText, response })
    } catch (error: unknown) {
      try {
        onerror?.(error)
      } catch {}
    }
  } catch (error: unknown) {
    try {
      options.onerror?.(error)
    } catch {}
  }
}

export async function addStyle(css: string): Promise<HTMLStyleElement> {
  if (typeof GM_addStyle === 'function') {
    const style = GM_addStyle(css)
    if (style instanceof HTMLStyleElement) return style
  }

  if (typeof GM !== 'undefined' && typeof GM.addStyle === 'function') {
    const style = await GM.addStyle(css)
    if (style instanceof HTMLStyleElement) return style
  }

  const style = document.createElement('style')
  style.textContent = css
  ;(document.head || document.documentElement).append(style)
  return style
}

export async function addElement(
  tag: string,
  attributes?: Record<string, string>
): Promise<HTMLElement>
export async function addElement(
  parentNode: Element,
  tag: string,
  attributes?: Record<string, string>
): Promise<HTMLElement>
export async function addElement(...args: any[]): Promise<HTMLElement> {
  let parentNode: Element | undefined
  let tag: string
  let attributes: Record<string, string> | undefined

  if (typeof args[0] === 'string') {
    tag = args[0]
    attributes = args[1]
  } else {
    parentNode = args[0]
    tag = args[1]
    attributes = args[2]
  }

  if (typeof GM_addElement === 'function') {
    try {
      const el = parentNode
        ? GM_addElement(parentNode, tag, attributes)
        : GM_addElement(tag, attributes)
      if (el instanceof HTMLElement) return el
    } catch {}
  }

  if (typeof GM !== 'undefined' && typeof GM.addElement === 'function') {
    try {
      const el = await (parentNode
        ? GM.addElement(parentNode, tag, attributes)
        : GM.addElement(tag, attributes))
      if (el instanceof HTMLElement) return el
    } catch {}
  }

  const el = document.createElement(tag)
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value)
    }
  }

  if (parentNode) {
    parentNode.append(el)
  } else {
    ;(document.body || document.documentElement).append(el)
  }

  return el
}
