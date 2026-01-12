// Performance tracking
let iconLoadCount = 0
let lastIconLoadTime = 0
const iconLoadStartTimes = new Map<number, number>()

export function getNewIconId(): number {
  return ++iconLoadCount
}

export function logIconPerf(
  id: number,
  icon: string,
  stage: 'start' | 'cache-hit' | 'server-start' | 'server-end',
  extra?: any
) {
  const now = performance.now()
  switch (stage) {
    case 'start': {
      const interval = lastIconLoadTime ? now - lastIconLoadTime : 0
      lastIconLoadTime = now
      iconLoadStartTimes.set(id, now)
      console.log(
        `[IconPerf] #${id} Start: "${icon}" | Interval: ${interval.toFixed(2)}ms`
      )
      break
    }

    case 'cache-hit': {
      const start = iconLoadStartTimes.get(id) || now
      const duration = now - start
      console.log(
        `[IconPerf] #${id} Cache Hit: "${icon}" | Duration: ${duration.toFixed(2)}ms`
      )
      iconLoadStartTimes.delete(id)
      break
    }

    case 'server-start': {
      console.log(
        `[IconPerf] #${id} Server Fetch Start: "${icon}" | URL: ${extra?.url}`
      )
      break
    }

    case 'server-end': {
      const start = iconLoadStartTimes.get(id) || now
      const duration = now - start
      console.log(
        `[IconPerf] #${id} Server Fetch End: "${icon}" | Status: ${extra?.status} | Duration: ${duration.toFixed(2)}ms | URL: ${extra?.url}`
      )
      iconLoadStartTimes.delete(id)
      break
    }
  }
}
