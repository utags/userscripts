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

export async function getValue<T = unknown>(
  key: string,
  defaultValue?: T
): Promise<T | undefined> {
  if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
    return GM.getValue<T>(key, defaultValue as T)
  }

  if (typeof GM_getValue === 'function') {
    return GM_getValue(key, defaultValue as T)
  }

  return defaultValue
}

export async function setValue(key: string, value: unknown): Promise<void> {
  if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
    await GM.setValue(key, value)
    return
  }

  if (typeof GM_setValue === 'function') {
    GM_setValue(key, value)
  }
}

export async function addValueChangeListener(
  key: string,
  callback: (
    key: string,
    oldValue: unknown,
    newValue: unknown,
    remote: boolean
  ) => void
): Promise<number> {
  if (
    typeof GM !== 'undefined' &&
    typeof GM.addValueChangeListener === 'function'
  ) {
    return GM.addValueChangeListener(key, callback)
  }

  if (typeof GM_addValueChangeListener === 'function') {
    return GM_addValueChangeListener(key, callback as any)
  }

  return 0
}

export async function removeValueChangeListener(id: number): Promise<void> {
  if (
    typeof GM !== 'undefined' &&
    typeof GM.removeValueChangeListener === 'function'
  ) {
    await GM.removeValueChangeListener(id)
    return
  }

  if (typeof GM_removeValueChangeListener === 'function') {
    GM_removeValueChangeListener(id)
  }
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

export function addStyle(css: string): HTMLStyleElement {
  if (typeof GM_addStyle === 'function') {
    return GM_addStyle(css)
  }

  const style = document.createElement('style')
  style.textContent = css
  document.head.append(style)
  return style
}
