import { xmlHttpRequest } from './gm/index'

type FetchStatus = 'unknown' | 'testing' | 'working' | 'broken'
const originStatus = new Map<string, FetchStatus>()
const originQueue = new Map<string, Array<() => void>>()

function getOrigin(url: string): string {
  try {
    return new URL(url, globalThis.location?.href).origin
  } catch {
    return 'default'
  }
}

function flushOriginQueue(origin: string) {
  const queue = originQueue.get(origin) || []
  originQueue.delete(origin)
  for (const req of queue) {
    req()
  }
}

export function resetFetchStatus() {
  originStatus.clear()
  originQueue.clear()
}

export function getFetchStatus(url: string): FetchStatus {
  return originStatus.get(getOrigin(url)) || 'unknown'
}

export function fetchWithGmFallback(options: {
  method?: string
  url: string
  responseType?: string
  timeout?: number
  onload?: (response: any) => void
  onerror?: (error: unknown) => void
  ontimeout?: () => void
}): void {
  const {
    method = 'GET',
    url,
    responseType,
    timeout,
    onload,
    onerror,
    ontimeout,
  } = options
  const origin = getOrigin(url)
  const status = originStatus.get(origin) || 'unknown'

  if (status === 'broken') {
    xmlHttpRequest({ ...options, method })
    return
  }

  const performFetch = () => {
    void (async () => {
      const controller = new AbortController()
      let timeoutId: number | undefined

      if (timeout && timeout > 0) {
        timeoutId = setTimeout(() => {
          controller.abort()
        }, timeout) as unknown as number
      }

      try {
        const res = await fetch(url, { method, signal: controller.signal })
        if (timeoutId) clearTimeout(timeoutId)

        // If fetch succeeds (even 404), we might want to use it if it's a valid HTTP response.
        // However, for CSP/Network errors, fetch throws.
        // For 404, fetch returns ok=false.
        // If we want to fallback to GM on 404 (maybe GM has different headers/cookies?), we could.
        // But usually for static assets, 404 is 404.
        // The user's goal is caching.

        // If we get a response (even 404), fetch is working (CSP didn't block it)
        const currentStatus = originStatus.get(origin)
        if (currentStatus === 'testing') {
          originStatus.set(origin, 'working')
          flushOriginQueue(origin)
        }

        if (res.ok || res.status === 304) {
          let response: any
          let responseText: string | undefined

          // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
          switch (responseType) {
            case 'blob': {
              response = await res.blob()
              break
            }

            case 'json': {
              response = await res.json()
              responseText = JSON.stringify(response)
              break
            }

            case 'arraybuffer': {
              response = await res.arrayBuffer()
              break
            }

            default: {
              responseText = await res.text()
              response = responseText
              break
            }
          }

          onload?.({
            status: res.status,
            statusText: res.statusText,
            response,
            responseText,
            finalUrl: res.url,
          })
          return
        }

        throw new Error(`Fetch failed: ${res.status}`)
      } catch (error: unknown) {
        if (timeoutId) clearTimeout(timeoutId)

        const isHttpError =
          error instanceof Error && error.message.startsWith('Fetch failed:')

        if (!isHttpError) {
          const currentStatus = originStatus.get(origin)
          if (currentStatus === 'testing') {
            originStatus.set(origin, 'broken')
            flushOriginQueue(origin)
          } else if (currentStatus === 'working') {
            // Should not happen if logic is correct, but network might fail later
            // We assume if it worked once, it works. But if it fails now with network error,
            // we should probably fallback for this request.
            // For now, let's keep it simple: fallback this request.
          }
        }

        xmlHttpRequest({ ...options, method })
      }
    })()
  }

  if (status === 'working') {
    performFetch()
    return
  }

  if (status === 'testing') {
    const queue = originQueue.get(origin) || []
    queue.push(() => {
      fetchWithGmFallback(options)
    })
    originQueue.set(origin, queue)
    return
  }

  // status === 'unknown'
  originStatus.set(origin, 'testing')
  performFetch()
}
