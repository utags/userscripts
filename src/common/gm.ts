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

export function addStyle(css: string): void {
  if (typeof GM_addStyle === 'function') {
    GM_addStyle(css)
    return
  }

  const style = document.createElement('style')
  style.textContent = css
  document.head.append(style)
}
