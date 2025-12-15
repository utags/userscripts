declare module 'css:*' {
  const cssText: string
  export default cssText
}

declare function GM_addValueChangeListener(
  key: string,
  cb: (name: string, old_value: any, new_value: any, remote: boolean) => void
): number

declare function GM_registerMenuCommand(
  caption: string,
  onClick: () => void,
  accessKey?: string
): number

declare function GM_unregisterMenuCommand(menuId: number): void

declare const GM: {
  getValue<T = unknown>(key: string, defaultValue: T): Promise<T>
  setValue(key: string, value: unknown): Promise<void>
}

declare function GM_getValue(name: string, defaultValue: T): any
declare function GM_setValue(name: string, value: any): void
declare function GM_addStyle(css: string): void
declare function GM_openInTab(
  url: string,
  options?: { active?: boolean; insert?: boolean }
): void

declare function GM_xmlhttpRequest(options: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers?: Record<string, string>
  data?: string | FormData | ArrayBuffer
  responseType?: 'text' | 'json' | 'blob'
  onload?: (response: {
    status: number
    responseText?: string
    response?: any
    responseHeaders?: string
  }) => void
  onerror?: (error: any) => void
}): void
