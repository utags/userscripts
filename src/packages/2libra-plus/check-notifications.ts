import {
  addValueChangeListener,
  getValue,
  setValue,
} from 'browser-extension-storage'

import { debounce } from '../../utils/async'

type SettingsSnapshot = {
  enabled: boolean
  checkUnreadNotifications: boolean
  checkUnreadNotificationsTitle: boolean
  checkUnreadNotificationsFavicon: boolean
  checkUnreadNotificationsUtags: boolean
}

type GetSettings = () => SettingsSnapshot

const CHECK_INTERVAL = 30 * 1000
const LOCK_TIMEOUT = 20 * 1000
const KEY_LOCK = 'check_lock'
const KEY_LAST_CHECK = 'last_check'
const KEY_UNREAD_COUNT = 'unread_count'

let initialized = false
let currentUnreadCount = 0
let utagsHostObserver: MutationObserver | undefined
let utagsShadowObserver: MutationObserver | undefined

function startUtagsObserver(getSettings: GetSettings): void {
  // Observer for Shadow Root changes
  const onShadowMutation: MutationCallback = (mutations) => {
    let shouldUpdate = false
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        shouldUpdate = true
        break
      }
    }

    if (shouldUpdate) {
      updateUtagsShortcuts(currentUnreadCount, getSettings)
    }
  }

  // Observer for Document changes (to detect Host element)
  const onDocumentMutation: MutationCallback = (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (
          node instanceof HTMLElement &&
          node.dataset.ushortcutsHost === 'utags-shortcuts'
        ) {
          observeShadowRoot(node)
          updateUtagsShortcuts(currentUnreadCount, getSettings)
        }
      }
    }
  }

  // Function to attach observer to Shadow Root
  function observeShadowRoot(host: HTMLElement): void {
    if (utagsShadowObserver) utagsShadowObserver.disconnect()
    if (!host.shadowRoot) return

    utagsShadowObserver = new MutationObserver(onShadowMutation)
    utagsShadowObserver.observe(host.shadowRoot, {
      childList: true,
      subtree: true,
    })
  }

  // Check if host already exists
  const host = document.querySelector<HTMLElement>(
    '[data-ushortcuts-host="utags-shortcuts"]'
  )
  if (host) {
    observeShadowRoot(host)
  }

  // Start observing document for new host elements
  utagsHostObserver = new MutationObserver(onDocumentMutation)
  utagsHostObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

type ApiResponse = {
  c: number
  m: string
  d?: {
    unread_count: number
    badge_unread_count: number
  }
  t: number
}

async function fetchUnreadCount(): Promise<number | undefined> {
  try {
    const res = await fetch('https://2libra.com/api/notifications/unread-count')
    const json = (await res.json()) as ApiResponse
    if (json.c === 0 && json.d) {
      return json.d.unread_count
    }
  } catch (error) {
    console.error('[2libra-plus] Failed to fetch unread count', error)
  }

  return undefined
}

let originalFavicon: string | undefined

function updateFavicon(count: number): void {
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')
  let link = links[0]

  // Remove other icon links to prevent conflicts
  if (links.length > 1) {
    for (let i = 1; i < links.length; i++) {
      links[i].remove()
    }
  }

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.append(link)
  }

  if (link.dataset.count === count.toString()) {
    return
  }

  link.type = 'image/png'
  link.dataset.count = count.toString()

  if (originalFavicon === undefined) {
    originalFavicon = '/favicon.ico'
  }

  if (count === 0) {
    link.href = originalFavicon
    // Force update favicon
    document.head.append(link)
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.addEventListener('load', () => {
    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(img, 0, 0, 32, 32)

    // Draw red circle
    ctx.beginPath()
    ctx.arc(22, 22, 10, 0, 2 * Math.PI)
    ctx.fillStyle = '#ff0000'
    ctx.fill()

    // Draw text
    const text = count > 99 ? '99+' : count.toString()
    ctx.font = count > 99 ? 'bold 12px sans-serif' : 'bold 16px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 22, 23)

    if (link) {
      link.href = canvas.toDataURL('image/png')
      // Force update favicon
      document.head.append(link)
    }
  })

  img.src = originalFavicon
}

const updateUtagsShortcuts = debounce(
  (count: number, getSettings: GetSettings): void => {
    const settings = getSettings()
    const displayCount = settings.checkUnreadNotificationsUtags ? count : 0

    const host = document.querySelector(
      '[data-ushortcuts-host="utags-shortcuts"]'
    )
    if (!host || !host.shadowRoot) return

    const links = host.shadowRoot.querySelectorAll('a')
    for (const link of links) {
      try {
        updateUtagsShortcutsLink(link, displayCount)
      } catch {}
    }
  },
  200
)

function updateUtagsShortcutsLink(
  link: HTMLAnchorElement,
  count: number
): void {
  const url = new URL(link.href)
  if (url.origin !== location.origin || url.pathname !== '/notifications')
    return

  const textSpan = link.querySelector<HTMLElement>('.title-text')
  if (!textSpan) return

  if (count > 0) {
    if (!textSpan.dataset.originalText) {
      textSpan.dataset.originalText = textSpan.textContent || '通知'
    }

    const newText = `${textSpan.dataset.originalText} (${count} 条未读)`
    if (textSpan.textContent !== newText) {
      textSpan.textContent = newText
    }

    if (textSpan.style.fontWeight !== 'bold') {
      textSpan.style.fontWeight = 'bold'
    }

    if (textSpan.style.color !== 'red') {
      textSpan.style.color = 'red'
    }
  } else if (textSpan.dataset.originalText) {
    if (textSpan.textContent !== textSpan.dataset.originalText) {
      textSpan.textContent = textSpan.dataset.originalText
    }

    delete textSpan.dataset.originalText
    if (textSpan.style.fontWeight !== '') {
      textSpan.style.fontWeight = ''
    }

    if (textSpan.style.color !== '') {
      textSpan.style.color = ''
    }
  }
}

function updateUI(count: number, getSettings: GetSettings): void {
  currentUnreadCount = count
  const settings = getSettings()

  const element = document.querySelector(
    '[data-right-sidebar="true"] .card-body a[href="/notifications"] > div'
  )
  if (element) {
    const newText = `${count} 条消息`
    const className = count > 0 ? 'text-primary' : ''
    if (element.textContent !== newText) {
      element.textContent = newText
    }

    if (element.className !== className) {
      element.className = className
    }
  }

  if (settings.checkUnreadNotificationsFavicon) {
    updateFavicon(count)
  } else if (originalFavicon) {
    // Restore original favicon if setting is disabled
    updateFavicon(0)
  }

  updateUtagsShortcuts(count, getSettings)

  const title = document.title
  const prefixRegex = /^\(\d+\) /
  let newTitle = title
  if (settings.checkUnreadNotificationsTitle && count > 0) {
    const newPrefix = `(${count}) `
    newTitle = prefixRegex.test(title)
      ? title.replace(prefixRegex, newPrefix)
      : newPrefix + title
  } else {
    newTitle = title.replace(prefixRegex, '')
  }

  if (newTitle !== title) {
    document.title = newTitle
  }
}

export async function check(
  getSettings: GetSettings,
  force = false
): Promise<void> {
  const settings = getSettings()
  if (!settings.enabled || !settings.checkUnreadNotifications) return

  const now = Date.now()
  if (!force) {
    const lastCheck = (await getValue<number>(KEY_LAST_CHECK, 0))!
    if (now - lastCheck < CHECK_INTERVAL) return
  }

  const lockTime = (await getValue<number>(KEY_LOCK, 0))!
  if (now - lockTime < LOCK_TIMEOUT) return

  // Try acquire lock
  await setValue(KEY_LOCK, now)
  const currentLock = (await getValue<number>(KEY_LOCK, 0))!
  if (currentLock !== now) return

  try {
    const count = await fetchUnreadCount()
    if (count !== undefined) {
      await setValue(KEY_UNREAD_COUNT, count)
      await setValue(KEY_LAST_CHECK, Date.now())
    }
  } finally {
    await setValue(KEY_LOCK, 0)
  }
}

export function initCheckNotifications(getSettings: GetSettings): void {
  if (initialized) return
  initialized = true

  startUtagsObserver(getSettings)

  // Listen for changes
  void addValueChangeListener(KEY_UNREAD_COUNT, (_key, _old, newValue) => {
    if (typeof newValue === 'number') {
      updateUI(newValue, getSettings)
    }
  })

  // Initial check of stored value to update UI immediately
  void (async () => {
    const value = await getValue<number>(KEY_UNREAD_COUNT)
    if (typeof value === 'number') {
      updateUI(value, getSettings)
    }
  })()

  // Loop
  setInterval(() => {
    void check(getSettings)
  }, 10 * 1000)

  // Run once immediately
  void check(getSettings)
}

export function runCheckNotifications(getSettings: GetSettings): void {
  void check(getSettings)
  void (async () => {
    const value = await getValue<number>(KEY_UNREAD_COUNT)
    if (typeof value === 'number') {
      updateUI(value, getSettings)
    }
  })()
}
