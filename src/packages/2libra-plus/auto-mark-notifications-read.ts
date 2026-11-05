import { onDomChange, onUrlChange } from '../../utils/dom-watcher'
import {
  check as checkUnreadCount,
  setUnreadCount,
} from './check-notifications'

type SettingsSnapshot = {
  enabled: boolean
  autoMarkNotificationsRead: boolean
  checkUnreadNotifications: boolean
  checkUnreadNotificationsTitle: boolean
  checkUnreadNotificationsFavicon: boolean
  checkUnreadNotificationsUtags: boolean
}

type GetSettings = () => SettingsSnapshot

const MARK_READ_BUTTON_SELECTOR =
  'div[data-main-left] [aria-label="刷新通知"] + button.btn-primary:not(.btn-disabled)'

let initialized = false
let clickTimer: number | undefined

function isNotificationsPage(): boolean {
  const loc = globalThis.location
  if (!loc) return false
  return loc.pathname === '/notifications'
}

function markUnreadItems(): void {
  if (!isNotificationsPage()) return

  const items = document.querySelectorAll<HTMLDivElement>(
    'div[data-main-left] .card > div.flex'
  )
  for (const item of items) {
    if (item.dataset.unreadMark === '1') continue

    const spans = item.querySelectorAll('span')
    let isUnread = false
    for (const span of spans) {
      if (span.textContent && span.textContent.trim() === '未读') {
        isUnread = true
        break
      }
    }

    if (!isUnread) continue
    item.dataset.unreadMark = '1'
  }
}

function tryClickMarkButton(getSettings: GetSettings): void {
  const settings = getSettings()
  if (!settings.enabled || !settings.autoMarkNotificationsRead) return
  if (!isNotificationsPage()) return

  markUnreadItems()
  const btn = document.querySelector<HTMLButtonElement>(
    MARK_READ_BUTTON_SELECTOR
  )
  if (!btn) return
  console.info('[2libra-plus] 🔘 自动点击"已读当前页"按钮')
  btn.click()
}

function bindMarkReadButton(getSettings: GetSettings): void {
  const settings = getSettings()
  if (!settings.enabled) return
  if (!isNotificationsPage()) return

  const btn = document.querySelector<HTMLButtonElement>(
    MARK_READ_BUTTON_SELECTOR
  )
  if (!btn) return
  if (btn.dataset.listenClick === '1') return

  btn.dataset.listenClick = '1'
  btn.addEventListener('click', () => {
    void setUnreadCount(0)
    setTimeout(() => {
      void checkUnreadCount(getSettings, true)
    }, 1000)
  })
}

function scheduleClick(getSettings: GetSettings): void {
  if (clickTimer !== undefined) {
    globalThis.clearTimeout(clickTimer)
  }

  clickTimer = globalThis.setTimeout(() => {
    clickTimer = undefined
    tryClickMarkButton(getSettings)
  }, 800)
}

export function runAutoMarkNotificationsRead(getSettings: GetSettings): void {
  scheduleClick(getSettings)
}

export function initAutoMarkNotificationsRead(getSettings: GetSettings): void {
  if (initialized) return
  initialized = true

  const check = () => {
    bindMarkReadButton(getSettings)
    scheduleClick(getSettings)
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        check()
      },
      { once: true }
    )
  } else {
    check()
  }

  onUrlChange(check)
  onDomChange(check)
}
