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

declare const GM: {
  getValue<T = unknown>(key: string, defaultValue: T): Promise<T>
  setValue(key: string, value: unknown): Promise<void>
}
