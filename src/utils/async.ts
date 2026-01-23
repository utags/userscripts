export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timer: number | undefined

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay) as unknown as number
  } as T
}
