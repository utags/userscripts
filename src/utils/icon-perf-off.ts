export function getNewIconId(): number {
  return 0
}

export function logIconPerf(
  id: number,
  icon: string,
  stage: 'start' | 'cache-hit' | 'server-start' | 'server-end',
  extra?: any
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) {}
