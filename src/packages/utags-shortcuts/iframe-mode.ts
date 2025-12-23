import { createUshortcutsSettingsStore } from './settings-panel'
import { isEditableTarget } from './utils'

const DISABLE_IFRAME_KEY = 'utags_iframe_mode_disabled'

const BLACKLIST_DOMAINS = new Set([
  'mail.google.com',
  'gemini.google.com',
  'github.com',
  'developer.mozilla.org',
  'www.threads.com',
  'x.com',
  'pro.x.com',
  'www.facebook.com',
  'www.instagram.com',
])
const BLACKLIST_URL_PATTERNS = new Set([
  /https:\/\/www\.google\.com\/.*[&?]udm=50/,
])

export function isIframeModeDisabled() {
  if (BLACKLIST_DOMAINS.has(location.host)) {
    return true
  }

  if (Array.from(BLACKLIST_URL_PATTERNS).some((p) => p.test(location.href))) {
    return true
  }

  return Boolean(localStorage.getItem(DISABLE_IFRAME_KEY))
}

export async function checkAndEnableIframeMode() {
  if (globalThis.top !== globalThis.self) return

  // 0. Check if disabled for this site
  if (isIframeModeDisabled()) return

  // 1. Check settings
  const settings = await createUshortcutsSettingsStore().getAll()
  if (settings.layoutMode !== 'sidebar' || !(settings as any).sidebarUseIframe)
    return

  // 2. Enable Iframe Mode
  enableIframeMode((settings.sidebarSide as any) || 'right')
}

function enableIframeMode(side: 'left' | 'right') {
  // Stop existing rendering if possible?
  // We can't easily stop parsing, but we can clear the body.
  const currentUrl = location.href

  // Use safe API to clear DOM and avoid Trusted Types violation
  // document.documentElement.innerHTML = '' -> replaceChildren()
  document.documentElement.replaceChildren()

  // Re-create head (required for document.title and favicons)
  const newHead = document.createElement('head')
  document.documentElement.append(newHead)

  // Create a new body for the iframe
  const newBody = document.createElement('body')
  document.documentElement.append(newBody)

  // Monitor and remove any additional body elements injected by the site
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (
          node instanceof HTMLElement &&
          node.tagName === 'BODY' &&
          node !== newBody
        ) {
          node.remove()
        }
      }
    }
  })
  observer.observe(document.documentElement, { childList: true })

  // Reset html/body styles
  document.documentElement.style.cssText =
    'height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden;'
  newBody.style.cssText =
    'height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden;'

  const iframe = document.createElement('iframe')
  iframe.src = currentUrl
  iframe.style.cssText = `
    border: none;
    width: calc(100% - 360px);
    height: 100%;
    position: absolute;
    top: 0;
    ${side === 'left' ? 'right: 0;' : 'left: 0;'}
  `
  // Add a marker to identify this iframe as "managed" by us
  iframe.name = 'utags-shortcuts-iframe'

  newBody.append(iframe)

  let isChildReady = false
  let failTimer: ReturnType<typeof setTimeout> | undefined

  // Sync URL changes from iframe to top window
  // Since it's same-origin, we can access contentWindow
  // But we need to wait for it to load
  iframe.addEventListener('load', () => {
    try {
      if (!isChildReady) {
        // If loaded but script not ready, wait a bit more (e.g. for document-idle scripts)
        // If still not ready, assume failed (e.g. CSP blocked script execution)
        failTimer = setTimeout(() => {
          if (!isChildReady) {
            console.warn(
              '[utags] Iframe mode script failed to start. Disabling for this site.'
            )
            localStorage.setItem(DISABLE_IFRAME_KEY, '1')
            location.reload()
          }
        }, 5000)
      }

      const win = iframe.contentWindow
      if (!win) return

      // Initial sync
      syncState(win.location.href, win.document.title)
      syncFavicon(win.document)
    } catch (error) {
      console.error('Failed to access iframe content', error)
      // If we can't access content (e.g. cross-origin redirect), fallback immediately
      if (!isChildReady) {
        localStorage.setItem(DISABLE_IFRAME_KEY, '1')
        location.reload()
      }
    }
  })

  // Handle messages from child
  globalThis.addEventListener('message', (e) => {
    if (e.source !== iframe.contentWindow) return
    const data = e.data
    if (!data || !data.type) return

    switch (data.type) {
      case 'USHORTCUTS_IFRAME_READY': {
        isChildReady = true
        if (failTimer) clearTimeout(failTimer)
        break
      }

      case 'USHORTCUTS_URL_CHANGE': {
        syncState(data.url, data.title)
        break
      }

      case 'USHORTCUTS_FORWARD_KEYDOWN': {
        const evt = data.event
        const event = new KeyboardEvent('keydown', {
          code: evt.code,
          key: evt.key || evt.code,
          ctrlKey: evt.ctrlKey,
          metaKey: evt.metaKey,
          altKey: evt.altKey,
          shiftKey: evt.shiftKey,
          bubbles: true,
          cancelable: true,
          composed: true,
        })
        document.dispatchEvent(event)
        break
      }

      default: {
        break
      }
    }
  })
}

export function updateIframeLayout(sidebarVisible: boolean) {
  const iframe = document.querySelector<HTMLElement>(
    'iframe[name="utags-shortcuts-iframe"]'
  )
  if (!iframe) return

  iframe.style.width = sidebarVisible ? 'calc(100% - 360px)' : '100%'
}

export function updateIframeUrl(url: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(
    'iframe[name="utags-shortcuts-iframe"]'
  )
  if (iframe) {
    iframe.src = url
    return true
  }

  return false
}

function syncState(url: string, title?: string) {
  if (location.href !== url) {
    history.replaceState(null, '', url)
  }

  if (title && document.title !== title) {
    document.title = title
  }
}

function syncFavicon(doc: Document) {
  const links = doc.querySelectorAll("link[rel*='icon']")
  for (const link of links) {
    const newLink = link.cloneNode() as HTMLLinkElement
    document.head.append(newLink)
  }
}

export function initIframeChild() {
  // Check if we are inside the managed iframe
  if ((globalThis as any).name !== 'utags-shortcuts-iframe') return

  // Notify parent that we are ready
  globalThis.parent.postMessage({ type: 'USHORTCUTS_IFRAME_READY' }, '*')

  // 1. Notify parent about URL changes
  const notify = () => {
    globalThis.parent.postMessage(
      {
        type: 'USHORTCUTS_URL_CHANGE',
        url: location.href,
        title: document.title,
      },
      '*'
    )
  }

  // Monitor title changes
  try {
    const titleObserver = new MutationObserver(() => {
      notify()
    })

    let currentTitle: Element | undefined

    const updateTitleObserver = () => {
      const titleEl = document.querySelector('title') ?? undefined
      if (titleEl === currentTitle) return

      if (currentTitle) {
        titleObserver.disconnect()
      }

      currentTitle = titleEl
      if (currentTitle) {
        titleObserver.observe(currentTitle, { childList: true })
        notify()
      }
    }

    updateTitleObserver()

    const headObserver = new MutationObserver(updateTitleObserver)
    if (document.head) {
      headObserver.observe(document.head, { childList: true })
    }
  } catch {}

  // Hook pushState/replaceState
  const originalPushState = history.pushState
  history.pushState = function (...args) {
    originalPushState.apply(this, args)
    notify()
  }

  const originalReplaceState = history.replaceState
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args)
    notify()
  }

  globalThis.addEventListener('popstate', notify)
  globalThis.addEventListener('hashchange', notify)

  // 2. Intercept link clicks
  document.addEventListener(
    'click',
    (e) => {
      const target = (e.target as Element).closest('a')
      if (!target || !target.href) return

      // Check if it's same origin
      const url = new URL(target.href, location.href)
      if (url.origin === location.origin) {
        // Internal link: let it proceed in iframe
        // (Browser default behavior or SPA router will handle it)
        // We just need to make sure we notify parent if URL changes (handled by hooks above)
      } else {
        // External link: open in top frame
        if (target.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey)
          return

        e.preventDefault()
        globalThis.top!.location.href = target.href
      }
    },
    true
  ) // Capture phase to run before other handlers

  // 3. Forward keydown events
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return
    if (isEditableTarget((e as any).target || undefined)) return

    globalThis.parent.postMessage(
      {
        type: 'USHORTCUTS_FORWARD_KEYDOWN',
        event: {
          code: e.code,
          key: e.key,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
        },
      },
      '*'
    )
  })
}
