import { scriptHandler } from '../../common/gm/script-handler'
import { ProgressBar } from '../../common/progress-bar'
import { shouldOpenInCurrentTab } from '../../utils/dom'
import { isTopFrame } from '../../utils/is-top-frame'
import { navigateUrl } from '../../utils/navigate'
import { isSameOrigin } from '../../utils/url'
import { watchTitleChange } from '../../utils/watch-title'
import { createUshortcutsSettingsStore } from './settings-panel'
import { isEditableTarget } from './utils'

const DISABLE_IFRAME_KEY = 'utags_iframe_mode_disabled'
const CHECK_IFRAME_KEY = 'utags_iframe_mode_checking'

// SessionStorage keys for infinite reload detection and support verification
const RELOAD_COUNT_KEY = 'utags_iframe_reload_count'
const LAST_LOAD_TIME_KEY = 'utags_iframe_last_load_time'
const LAST_LOAD_URL_KEY = 'utags_iframe_last_load_url'
const LAST_CLICK_URL_KEY = 'utags_iframe_last_click_url'
const SUPPORTED_KEY = 'utags_iframe_supported'

const isSupported = () => sessionStorage.getItem(SUPPORTED_KEY) === '1'

// Helper to clear all detection-related storage keys
function clearDetectionStorage() {
  sessionStorage.removeItem(RELOAD_COUNT_KEY)
  sessionStorage.removeItem(LAST_LOAD_URL_KEY)
  sessionStorage.removeItem(LAST_LOAD_TIME_KEY)
  sessionStorage.removeItem(LAST_CLICK_URL_KEY)
}

const BLACKLIST_DOMAINS = new Set([
  'mail.google.com',
  'accounts.google.com',
  'gds.google.com',
  'gemini.google.com',
  'github.com',
  'developer.mozilla.org',
  'addons.mozilla.org',
  'www.threads.com',
  'x.com',
  'pro.x.com',
  'www.facebook.com',
  'www.instagram.com',
  'stackoverflow.com',
  'superuser.com',
  't.me',
  'discord.com',
  'wsrv.nl',
  'external-content.duckduckgo.com',
  'proxy.duckduckgo.com',
  'images.unsplash.com',
])
const BLACKLIST_URL_PATTERNS = new Set([
  /^https:\/\/www\.google\.com\/search\?.*[&?]udm=50/,
  /^https:\/\/www\.google\.com\/search\?((?![?&]udm=).)*$/,
  /^https:\/\/(.+\.)?stackexchange\.com\//,
  // /^https:\/\/(login|auth)[^.]*\./,
  /\b(login|auth|signin|signup|raw)/i,
  /(login|auth|signin|signup|raw)\b/i,
  /\.(md|png|jpe?g|gif|webp|svg|user\.js)([?#].*)?$/,
])

let progressBar: ProgressBar | undefined

let activeIframe: HTMLIFrameElement | undefined
let isChildReady = false
let failTimer: ReturnType<typeof setTimeout> | undefined
let isMessageListenerAttached = false

const messageHandler = (e: MessageEvent) => {
  if (!e.source || !e.data || e.source !== activeIframe?.contentWindow) return
  const data = e.data
  if (!data || !data.type) return

  switch (data.type) {
    case 'USHORTCUTS_IFRAME_READY': {
      isChildReady = true
      setTimeout(() => {
        // Remove the check flag
        localStorage.removeItem(CHECK_IFRAME_KEY)
      }, 10_000)
      if (failTimer) clearTimeout(failTimer)
      break
    }

    case 'USHORTCUTS_IFRAME_FAILED': {
      console.warn('[utags-shortcuts] Iframe mode failed:', data.reason)
      localStorage.setItem(DISABLE_IFRAME_KEY, '1')
      localStorage.setItem(CHECK_IFRAME_KEY, '4')
      location.reload()
      break
    }

    case 'USHORTCUTS_URL_CHANGE': {
      syncState(data.url, data.title)
      progressBar?.finish()
      break
    }

    case 'USHORTCUTS_LOADING_START': {
      progressBar?.start()
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
}

function isUserScript(url: string): boolean {
  return url.endsWith('.user.js')
}

export function isIframeModeDisabledUrl(url: string): boolean {
  return Array.from(BLACKLIST_URL_PATTERNS).some((p) => p.test(url))
}

export function isIframeModeDisabled() {
  if (BLACKLIST_DOMAINS.has(location.host)) {
    return true
  }

  if (isIframeModeDisabledUrl(location.href)) {
    return true
  }

  // Stay scripts manager will delete the newBody containing the iframe, so we must disable iframe mode for it.
  if (scriptHandler === 'tamp' || scriptHandler.includes('stay')) {
    return true
  }

  return (
    Boolean(localStorage.getItem(DISABLE_IFRAME_KEY)) ||
    Boolean(localStorage.getItem(CHECK_IFRAME_KEY))
  )
}

export async function checkAndEnableIframeMode() {
  if (!isTopFrame() || document.documentElement.tagName !== 'HTML') return

  // 0. Check if disabled for this site
  if (isIframeModeDisabled()) return

  // 1. Check settings
  const settings = await createUshortcutsSettingsStore().getAll()
  if (
    !settings.enabled ||
    settings.layoutMode !== 'sidebar' ||
    !settings.sidebarUseIframe
  )
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

  // Create a new body for prevent the site from injecting additional body elements
  const newBody = document.createElement('body')
  document.documentElement.append(newBody)
  // Create a container for the iframe
  const iframeContainer = document.createElement('div')
  document.documentElement.append(iframeContainer)

  // Monitor and remove any additional body elements injected by the site
  // Also restore iframe/container if they are deleted
  const observer = new MutationObserver((mutations) => {
    let shouldRestore = false
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

      for (const node of mutation.removedNodes) {
        if (node === iframeContainer || node === iframe) {
          shouldRestore = true
        }
      }
    }

    if (shouldRestore) {
      console.info(
        '[utags-shortcuts] Iframe mode container or iframe deleted. Restoring...'
      )
      // Disconnect observer to avoid infinite loops during restoration
      observer.disconnect()
      // Re-enable iframe mode
      enableIframeMode(side)
    }
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })

  // Reset html/body styles
  document.documentElement.style.cssText =
    'height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden;'
  newBody.style.cssText =
    'height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden;'
  iframeContainer.style.cssText =
    'height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; position: absolute; top: 0; left: 0;'

  progressBar = new ProgressBar()

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

  iframeContainer.append(iframe)
  activeIframe = iframe

  // Reset state
  if (failTimer) clearTimeout(failTimer)
  isChildReady = false
  failTimer = undefined

  // Sync URL changes from iframe to top window
  // Since it's same-origin, we can access contentWindow
  // But we need to wait for it to load
  iframe.addEventListener('load', () => {
    iframe.focus()
    progressBar?.finish()

    try {
      if (!isChildReady) {
        // If loaded but script not ready, wait a bit more (e.g. for document-idle scripts)
        // If still not ready, assume failed (e.g. CSP blocked script execution)
        failTimer = setTimeout(() => {
          if (!isChildReady) {
            console.warn(
              '[utags-shortcuts] Iframe mode script failed to start. Disabling for this site.'
            )
            localStorage.setItem(DISABLE_IFRAME_KEY, '1')
            localStorage.setItem(CHECK_IFRAME_KEY, '3')
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
        localStorage.setItem(CHECK_IFRAME_KEY, '2')
        location.reload()
      }
    }
  })

  // Handle messages from child
  // Ensure global message listener is attached
  if (!isMessageListenerAttached) {
    globalThis.addEventListener('message', messageHandler)
    isMessageListenerAttached = true
  }
}

export function updateIframeLayout(sidebarVisible: boolean) {
  const iframe = document.querySelector<HTMLElement>(
    'iframe[name="utags-shortcuts-iframe"]'
  )
  if (!iframe) return

  iframe.style.width = sidebarVisible ? 'calc(100% - 360px)' : '100%'
}

function redirectToTop(url: string): boolean {
  try {
    globalThis.top!.location.href = url
    return true
  } catch {}

  return false
}

export function updateIframeUrl(url: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(
    'iframe[name="utags-shortcuts-iframe"]'
  )
  if (isIframeModeDisabledUrl(url)) {
    redirectToTop(url)
    return true
  }

  if (iframe && iframe.contentWindow) {
    progressBar?.start()
    iframe.contentWindow.postMessage({ type: 'USHORTCUTS_NAVIGATE', url }, '*')
    iframe.focus()
    return true
  }

  return false
}

function syncState(url: string, title?: string) {
  if (location.href !== url) {
    try {
      history.replaceState(null, '', url)
    } catch {
      location.href = url
    }
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

  let initialOrigin = 'http://unkownorigin.unknown'
  // Capture initial state before detection logic modifies it
  const initialLoadUrl = sessionStorage.getItem(LAST_LOAD_URL_KEY)

  // Check for infinite reload loop (e.g. site detects iframe and reloads itself)
  if (!detectInfiniteReload()) return

  // Notify parent that we are ready
  globalThis.parent.postMessage({ type: 'USHORTCUTS_IFRAME_READY' }, '*')

  // Verify support on initial load
  verifyIframeSupport(initialLoadUrl ?? undefined)

  // 1. Notify parent about URL changes
  const notify = () => {
    // Verify support on navigation (SPA)
    verifyIframeSupport()
    const url = location.href

    // Check if we are same-origin and iframe mode is disabled
    if (
      isSameOrigin(url, initialOrigin) &&
      isIframeModeDisabledUrl(url) &&
      !redirectToTop(url)
    )
      return

    globalThis.parent.postMessage(
      {
        type: 'USHORTCUTS_URL_CHANGE',
        url,
        title: document.title,
      },
      '*'
    )
  }

  try {
    if (globalThis.top!.location.origin !== location.origin) {
      // Cross-origin redirect: redirect top frame
      notify()
      return
    }
  } catch {
    // Cross-origin redirect: redirect top frame
    notify()
    return
  }

  initialOrigin = location.origin

  // Monitor title changes
  watchTitleChange(() => {
    notify()
  })

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
  globalThis.addEventListener('beforeunload', () => {
    globalThis.parent.postMessage({ type: 'USHORTCUTS_LOADING_START' }, '*')
  })

  // 2. Intercept link clicks
  document.addEventListener(
    'click',
    (e) => {
      const target = (e.target as Element).closest('a')
      if (!target) return
      const hrefAttr = target.getAttribute('href')
      if (!hrefAttr || hrefAttr.startsWith('#')) return
      const href = target.href

      // Check if it's same origin
      if (isSameOrigin(href)) {
        // Internal link: let it proceed in iframe
        // (Browser default behavior or SPA router will handle it)
        // We just need to make sure we notify parent if URL changes (handled by hooks above)
        if (!isSupported()) {
          sessionStorage.setItem(LAST_CLICK_URL_KEY, href)
        }

        if (shouldOpenInCurrentTab(e, target)) {
          // if (isUserScript(href)) {
          //   e.preventDefault()
          //   window.open(href, '_blank', 'noopener')
          // } else
          if (isIframeModeDisabledUrl(href)) {
            e.preventDefault()
            redirectToTop(href)
          } else {
            globalThis.parent.postMessage(
              { type: 'USHORTCUTS_LOADING_START' },
              '*'
            )
          }
        }
      } else {
        // External link: open in top frame
        if (!shouldOpenInCurrentTab(e, target)) return

        e.preventDefault()
        redirectToTop(href)
      }
    },
    false
  ) // Use Bubble phase. Checking defaultPrevented is unreliable as SPAs often call it. Bubble phase allows ignoring events that stopped propagation.

  // 3. Intercept navigation API (if supported) to handle JS-initiated location changes
  if ((globalThis as any).navigation) {
    ;(globalThis as any).navigation.addEventListener('navigate', (e: any) => {
      // Only handle navigations that aren't downloads/hash changes
      if (e.hashChange || e.downloadRequest) return

      const url = e.destination.url
      if (!url) return

      // Check if it's same origin
      if (!isSameOrigin(url)) {
        // External navigation: prevent default handling in iframe and open in top frame
        e.preventDefault()
        redirectToTop(url)
      } else if (isIframeModeDisabledUrl(url)) {
        // Disabled URL: prevent default handling in iframe and open in top frame
        e.preventDefault()
        redirectToTop(url)
      }
    })
  }

  // 4. Forward keydown events
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
  // 5. Handle messages from parent
  globalThis.addEventListener('message', (e) => {
    if (e.source !== globalThis.parent) return
    const data = e.data
    if (!data || !data.type) return

    if (data.type === 'USHORTCUTS_NAVIGATE') {
      navigateUrl(data.url)
    }
  })
}

function detectInfiniteReload() {
  try {
    if (isSupported()) return true

    const now = Date.now()
    const lastLoadTime = Number.parseInt(
      sessionStorage.getItem(LAST_LOAD_TIME_KEY) || '0',
      10
    )
    const lastLoadUrl = sessionStorage.getItem(LAST_LOAD_URL_KEY)
    let reloadCount = Number.parseInt(
      sessionStorage.getItem(RELOAD_COUNT_KEY) || '0',
      10
    )

    if (
      now - lastLoadTime < 5000 &&
      (!lastLoadUrl || lastLoadUrl === location.href)
    ) {
      reloadCount++
    } else {
      reloadCount = 1
    }

    sessionStorage.setItem(LAST_LOAD_TIME_KEY, now.toString())
    sessionStorage.setItem(LAST_LOAD_URL_KEY, location.href)
    sessionStorage.setItem(RELOAD_COUNT_KEY, reloadCount.toString())

    if (reloadCount > 5) {
      clearDetectionStorage()
      // Infinite reload detected
      globalThis.parent.postMessage(
        { type: 'USHORTCUTS_IFRAME_FAILED', reason: 'infinite_reload' },
        '*'
      )
      // Stop further execution
      return false
    }

    return true
  } catch {
    return true
  }
}

function verifyIframeSupport(previousUrl?: string) {
  try {
    if (isSupported()) return

    // Use provided previousUrl (for initial load check) or fetch from storage (for SPA nav check)
    // Note: On initial load, storage has just been updated to current URL by detectInfiniteReload,
    // so we must use the captured previousUrl.
    const lastLoadUrl =
      previousUrl === undefined
        ? sessionStorage.getItem(LAST_LOAD_URL_KEY)
        : previousUrl

    const lastClickUrl = sessionStorage.getItem(LAST_CLICK_URL_KEY)

    if (
      lastLoadUrl &&
      lastLoadUrl !== location.href &&
      lastClickUrl === location.href
    ) {
      sessionStorage.setItem(SUPPORTED_KEY, '1')
      clearDetectionStorage()
    }
  } catch {}
}
