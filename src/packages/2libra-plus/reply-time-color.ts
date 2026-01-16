import { onDomChange, onUrlChange } from '../../utils/dom-watcher'

type SettingsSnapshot = {
  enabled: boolean
  replyTimeColor: boolean
}

type GetSettings = () => SettingsSnapshot
const storageKey = '2libraPlus:lastHomeViewTime'
let initialized = false
let lastHomeViewBase: number | undefined

function getListContainer(): HTMLElement | undefined {
  return (
    document.querySelector<HTMLElement>('[data-main-left="true"] ul.card') ||
    undefined
  )
}

function getLastHomeViewTime(): number | undefined {
  try {
    const raw = globalThis.localStorage.getItem(storageKey)
    if (raw) {
      const n = Number.parseInt(raw, 10)
      if (Number.isFinite(n) && n > 0) {
        return n
      }
    }
  } catch {}

  return undefined
}

function logLastHomeViewTime(base: number | undefined): void {
  if (!base) return

  const now = Date.now()
  const diffSeconds = Math.max(0, Math.floor((now - base) / 1000))
  const minute = 60
  const hour = 60 * minute
  const day = 24 * hour

  let unit = '秒'
  let value = diffSeconds
  if (diffSeconds >= minute && diffSeconds < hour) {
    unit = '分'
    value = Math.floor(diffSeconds / minute)
  } else if (diffSeconds >= hour && diffSeconds < day) {
    unit = '小时'
    value = Math.floor(diffSeconds / hour)
  } else if (diffSeconds >= day) {
    unit = '天'
    value = Math.floor(diffSeconds / day)
  }

  const date = new Date(base)
  const pad = (n: number) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const dayOfMonth = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  const formatted = `${year}-${month}-${dayOfMonth} ${hours}:${minutes}:${seconds}`

  console.log(
    `[2libra-plus] 🕙 上次首页访问时间：${value} ${unit} 前（${formatted}）`
  )
}

function updateReplyTimeColor(getSettings: GetSettings): void {
  let lastHomeViewTime = lastHomeViewBase

  const settings = getSettings()
  if (!settings.enabled || !settings.replyTimeColor) {
    const timeElements = Array.from(
      getListContainer()?.querySelectorAll<HTMLTimeElement>('li time') || []
    )
    for (const el of timeElements) {
      el.style.removeProperty('color')
    }

    return
  }

  const list = getListContainer()
  if (!list) return

  const timeElements = Array.from(
    list.querySelectorAll<HTMLTimeElement>('li time')
  )

  if (timeElements.length === 0) return

  const now = Date.now()
  const timestamps: number[] = []

  if (lastHomeViewTime && lastHomeViewTime > now) {
    lastHomeViewTime = undefined
  }

  for (const el of timeElements) {
    const dt = el.getAttribute('datetime')
    if (!dt) continue
    const t = Date.parse(dt)
    if (Number.isNaN(t)) continue
    if (t > now) continue
    timestamps.push(t)
  }

  if (timestamps.length === 0) return

  const min = Math.min(...timestamps)
  const max = Math.max(...timestamps)

  if (!lastHomeViewTime) {
    lastHomeViewTime = min
  }

  if (lastHomeViewTime < min) {
    lastHomeViewTime = min
  } else if (lastHomeViewTime > max) {
    lastHomeViewTime = max
  }

  for (const el of timeElements) {
    const dt = el.getAttribute('datetime')
    if (!dt) continue
    const t = Date.parse(dt)
    if (Number.isNaN(t)) continue
    if (t > now) continue

    let opacity: number
    if (t >= lastHomeViewTime) {
      const rangeNew = now - lastHomeViewTime || 1
      const ageNew = now - t
      const ratioNew = Math.min(Math.max(ageNew / rangeNew, 0), 1)
      const eased = Math.sqrt(ratioNew)
      opacity = 1 - eased * 0.3

      const percent = Math.round(opacity * 100)
      el.style.color = `color-mix(in oklab,var(--color-primary) ${percent}%,transparent)`
    } else {
      const rangeOld = lastHomeViewTime - min || 1
      const ageOld = lastHomeViewTime - t
      const ratioOld = Math.min(Math.max(ageOld / rangeOld, 0), 1)
      const eased = Math.sqrt(ratioOld)
      const maxOld = 0.69
      const minOld = 0.3
      opacity = maxOld - eased * (maxOld - minOld)

      const percent = Math.round(opacity * 100)
      el.style.color = `color-mix(in oklab,var(--color-base-content) ${percent}%,transparent)`
    }
  }
}

export function runReplyTimeColor(getSettings: GetSettings): void {
  updateReplyTimeColor(getSettings)
}

export function initReplyTimeColor(getSettings: GetSettings): void {
  if (initialized) return
  initialized = true

  const runUpdateColor = () => {
    updateReplyTimeColor(getSettings)
  }

  const handleHomeView = () => {
    const last = getLastHomeViewTime()
    lastHomeViewBase = last
    logLastHomeViewTime(last)
    runUpdateColor()

    if (globalThis.location.pathname === '/') {
      try {
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000
        if ((!last || now - last >= fiveMinutes) && getListContainer()) {
          globalThis.localStorage.setItem(storageKey, String(now))
        }
      } catch {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        handleHomeView()
      },
      { once: true }
    )
  } else {
    handleHomeView()
  }

  onUrlChange(() => {
    handleHomeView()
  })

  onDomChange(runUpdateColor)
}
