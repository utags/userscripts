import { onDomChange, onUrlChange } from '../../utils/dom-watcher'
import { randomToken } from '../../utils/random'

type SettingsSnapshot = {
  enabled: boolean
  hideSidebarEmail: boolean
  hideSidebarExperience: boolean
  hideSidebarCoins: boolean
  hideSidebarCheckin: boolean
  anonymizeSidebarNickname: boolean
  sidebarNicknameAlias: string
  anonymizeSidebarAvatar: boolean
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

function applyAnonymizeNickname(
  h2: HTMLElement,
  settings: SettingsSnapshot
): void {
  const nicknameLink = h2.querySelector<HTMLAnchorElement>('a[href^="/user/"]')
  if (!nicknameLink) return

  if (nicknameLink.dataset.libraPlusOriginalText === undefined) {
    nicknameLink.dataset.libraPlusOriginalText = nicknameLink.textContent || ''
  }

  if (settings.anonymizeSidebarNickname) {
    const alias = (settings.sidebarNicknameAlias || '').trim()
    if (alias !== '' && alias !== nicknameLink.textContent) {
      nicknameLink.textContent = alias
      nicknameLink.style.color = 'inherit'
    }
  } else {
    const original = nicknameLink.dataset.libraPlusOriginalText
    if (original !== undefined && original !== nicknameLink.textContent) {
      nicknameLink.textContent = original
      nicknameLink.style.removeProperty('color')
    }
  }
}

function applyAnonymizeAvatar(
  h2: HTMLElement,
  settings: SettingsSnapshot
): void {
  const avatarImg = h2.querySelector<HTMLImageElement>(
    'img[src*="/avatars/"],img[src*="avatars"]'
  )
  if (!avatarImg) return

  if (avatarImg.dataset.libraPlusOriginalSrc === undefined) {
    avatarImg.dataset.libraPlusOriginalSrc =
      avatarImg.currentSrc || avatarImg.src
    avatarImg.dataset.libraPlusOriginalSrcset = avatarImg.srcset
  }

  if (settings.anonymizeSidebarAvatar) {
    let fakeSrc = avatarImg.dataset.libraPlusFakeSrc
    if (!fakeSrc) {
      fakeSrc = `https://r2.2libra.com/avatars/none-${randomToken(8)}.png`
      avatarImg.dataset.libraPlusFakeSrc = fakeSrc
    }

    if (avatarImg.src !== fakeSrc) {
      avatarImg.src = fakeSrc
    }

    if (avatarImg.srcset !== '') {
      avatarImg.srcset = ''
    }
  } else {
    const originalSrc = avatarImg.dataset.libraPlusOriginalSrc
    if (originalSrc !== undefined && originalSrc !== avatarImg.src) {
      avatarImg.src = originalSrc
    }

    const originalSrcset = avatarImg.dataset.libraPlusOriginalSrcset
    if (originalSrcset !== undefined && originalSrcset !== avatarImg.srcset) {
      avatarImg.srcset = originalSrcset
    }
  }
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
    applyAnonymizeNickname(h2, settings)
    applyAnonymizeAvatar(h2, settings)
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
