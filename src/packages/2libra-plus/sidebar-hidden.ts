import { onDomChange, onUrlChange } from '../../utils/dom-watcher'

type SettingsSnapshot = {
  enabled: boolean
  hideSidebarEmail: boolean
  hideSidebarExperience: boolean
  hideSidebarCoins: boolean
  hideSidebarCheckin: boolean
}

type GetSettings = () => SettingsSnapshot

let initialized = false

function applyHideEmail(
  cardBody: HTMLElement,
  settings: SettingsSnapshot
): void {
  // [data-right-sidebar="true"] .card-body > h2 .text-gray-400
  const emailEl = cardBody.querySelector<HTMLElement>(
    ':scope > h2 .text-gray-400'
  )
  if (!emailEl) return

  if (settings.hideSidebarEmail) {
    emailEl.style.display = 'none'
  } else {
    emailEl.style.removeProperty('display')
  }
}

function applyHideExperience(
  h2: HTMLElement,
  settings: SettingsSnapshot
): HTMLElement | undefined {
  // [data-right-sidebar="true"] .card-body > h2 + div
  const experienceEl = h2.nextElementSibling as HTMLElement
  if (!experienceEl) return

  if (settings.hideSidebarExperience) {
    experienceEl.style.display = 'none'
  } else {
    experienceEl.style.removeProperty('display')
  }

  return experienceEl
}

function applyHideActions(
  experienceEl: HTMLElement,
  settings: SettingsSnapshot
): void {
  // [data-right-sidebar="true"] .card-body > h2 + div + div
  const actionsContainer = experienceEl.nextElementSibling as HTMLElement
  if (!actionsContainer) return

  const coinsLink =
    actionsContainer.querySelector<HTMLElement>('a[href="/coins"]')
  const checkinBtn =
    actionsContainer.querySelector<HTMLElement>(
      '[data-tip*="签到"]'
    )?.parentElement

  const hideCoins = settings.hideSidebarCoins
  const hideCheckin = settings.hideSidebarCheckin

  const spans = Array.from(
    actionsContainer.querySelectorAll<HTMLElement>(':scope > span')
  )

  if (hideCoins || hideCheckin) {
    actionsContainer.style.justifyContent = 'space-between'
    for (const span of spans) {
      span.style.display = 'none'
    }
  } else {
    actionsContainer.style.removeProperty('justify-content')
    for (const span of spans) {
      span.style.removeProperty('display')
    }
  }

  if (coinsLink) {
    if (hideCoins) {
      coinsLink.style.display = 'none'
    } else {
      coinsLink.style.removeProperty('display')
    }
  }

  if (checkinBtn) {
    if (hideCheckin) {
      checkinBtn.style.display = 'none'
    } else {
      checkinBtn.style.removeProperty('display')
    }
  }
}

function applySidebarHidden(getSettings: GetSettings): void {
  const settings = getSettings()

  const cardBody = document.querySelector<HTMLElement>(
    '[data-right-sidebar="true"] .card-body'
  )
  if (!cardBody) return

  applyHideEmail(cardBody, settings)

  const h2 = cardBody.querySelector<HTMLElement>(':scope > h2')
  if (h2) {
    const experienceEl = applyHideExperience(h2, settings)
    if (experienceEl) {
      applyHideActions(experienceEl, settings)
    }
  }
}

export function runSidebarHidden(getSettings: GetSettings): void {
  applySidebarHidden(getSettings)
}

export function initSidebarHidden(getSettings: GetSettings): void {
  if (initialized) return
  initialized = true

  const run = () => {
    applySidebarHidden(getSettings)
  }

  onDomChange(run)
  onUrlChange(run)

  // Initial run
  run()
}
