import { fetchWithGmFallback } from '../common/fetch'
import { getValue, setValue } from '../common/gm/storage'
import { c } from './c'
import { clearChildren } from './dom'
import { getWrappedIconUrl } from './favicon'
import { getNewIconId, logIconPerf } from './icon-perf-off'

function createIconImage(src: string, className?: string) {
  return c('img', {
    className,
    attrs: { width: '16', height: '16', src, loading: 'lazy' },
    style: { objectFit: 'contain' },
  })
}

const iconCache = new Map<string, string>()

const STORAGE_KEY = 'utags_icon_cache'

// Load cache on startup
void (async () => {
  try {
    const stored = await getValue<Record<string, string>>(STORAGE_KEY, {})
    if (stored) {
      for (const [key, value] of Object.entries(stored)) {
        if (!iconCache.has(key)) {
          iconCache.set(key, value)
        }
      }
    }
  } catch {}
})()

let saveTimeoutId: any

async function saveCache() {
  try {
    const stored =
      (await getValue<Record<string, string>>(STORAGE_KEY, {})) || {}
    const merged = { ...stored }

    for (const [key, value] of iconCache) {
      merged[key] = value
    }

    await setValue(STORAGE_KEY, merged)

    // Sync back new items from storage to memory
    for (const [key, value] of Object.entries(merged)) {
      if (!iconCache.has(key)) {
        iconCache.set(key, value)
      }
    }
  } catch {}
}

function scheduleSaveCache() {
  if (saveTimeoutId) clearTimeout(saveTimeoutId)

  saveTimeoutId = setTimeout(() => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(
        () => {
          void saveCache()
        },
        { timeout: 2000 }
      )
    } else {
      void saveCache()
    }
  }, 3000)
}

let lastSuccessfulCdnIndex = 0
const cdnBases = [
  'https://cdn.jsdelivr.net/npm',
  'https://fastly.jsdelivr.net/npm',
  'https://unpkg.com',
]

function injectLucideIcon(container: HTMLElement, name: string, id: number) {
  try {
    const cached = iconCache.get(name)
    if (cached) {
      logIconPerf(id, name, 'cache-hit')
      const img = createIconImage(cached, 'lucide-icon')
      clearChildren(container)
      container.append(img)
      return
    }
  } catch {}

  const orderedCdnIndices = [
    lastSuccessfulCdnIndex,
    ...[0, 1, 2].filter((i) => i !== lastSuccessfulCdnIndex),
  ]

  const tryFetch = (attempt: number) => {
    if (attempt >= orderedCdnIndices.length) {
      return // All CDNs failed
    }

    const cdnIndex = orderedCdnIndices[attempt]
    const cdnBase = cdnBases[cdnIndex]
    const url = `${cdnBase}/lucide-static@latest/icons/${name}.svg`
    logIconPerf(id, name, 'server-start', { url })

    try {
      fetchWithGmFallback({
        method: 'GET',
        url,
        timeout: 5000,
        onload(res: any) {
          try {
            const svg = String(res.responseText || '')
            logIconPerf(id, name, 'server-end', { status: res.status, url })
            if (res.status >= 200 && res.status < 300 && svg) {
              const dataUrl =
                'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
              iconCache.set(name, dataUrl)
              scheduleSaveCache()
              const img = createIconImage(dataUrl, 'lucide-icon')
              clearChildren(container)
              container.append(img)
              // Remember this CDN for next time
              lastSuccessfulCdnIndex = cdnIndex
            } else {
              tryFetch(attempt + 1)
            }
          } catch {
            tryFetch(attempt + 1)
          }
        },
        onerror() {
          tryFetch(attempt + 1)
        },
        ontimeout() {
          tryFetch(attempt + 1)
        },
      })
    } catch {
      tryFetch(attempt + 1)
    }
  }

  tryFetch(0)
}

function injectImageAsData(container: HTMLElement, url: string, id: number) {
  try {
    const cached = iconCache.get(url)
    if (cached) {
      logIconPerf(id, url, 'cache-hit')
      const img = createIconImage(cached)
      clearChildren(container)
      container.append(img)
      return
    }

    logIconPerf(id, url, 'server-start', { url })

    fetchWithGmFallback({
      method: 'GET',
      url,
      timeout: 5000,
      responseType: 'blob',
      onload(res: any) {
        try {
          const blob = res.response as Blob
          if (!blob) return
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            logIconPerf(id, url, 'server-end', { status: 200, url })
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const result = String(reader.result || '')
            iconCache.set(url, result)
            scheduleSaveCache()
            const img = createIconImage(result)
            clearChildren(container)
            container.append(img)
          })
          reader.readAsDataURL(blob)
        } catch {}
      },
    })
  } catch {}
}

export function renderIcon(s?: string) {
  const span = c('span', { className: 'icon' })
  let t = String(s || '').trim()
  if (!t) t = 'lucide:link'

  const id = getNewIconId()
  logIconPerf(id, t, 'start')

  if (t.startsWith('lucide:')) {
    const k = t.split(':')[1]
    injectLucideIcon(span, k, id)
    return span
  }

  if (t.startsWith('url:')) {
    const url = t.slice(4)
    injectImageAsData(span, getWrappedIconUrl(url), id)
    return span
  }

  if (t.startsWith('svg:')) {
    try {
      const svg = t.slice(4)
      const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
      const img = createIconImage(url)
      clearChildren(span)
      span.append(img)
    } catch {}

    logIconPerf(id, t, 'cache-hit')
    return span
  }

  span.textContent = t
  logIconPerf(id, t, 'cache-hit')
  return span
}

export function setIcon(el: HTMLElement, icon?: string, title?: string) {
  try {
    clearChildren(el)
    el.append(renderIcon(icon))
    if (title !== undefined) el.title = title
  } catch {}
}
