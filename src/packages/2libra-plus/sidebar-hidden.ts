import { onDomChange, onUrlChange } from '../../utils/dom-watcher'
import { randomToken } from '../../utils/random'

type SettingsSnapshot = {
  enabled: boolean
  hideLeftSidebar: boolean
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

let leftSidebarEl: HTMLElement | undefined
let leftLogoEl: HTMLElement | undefined
let leftSidebarStyleEl: HTMLStyleElement | undefined

function ensureLeftSidebarHoverStyle(): void {
  if (leftSidebarStyleEl?.isConnected) return
  const styleEl = document.createElement('style')
  styleEl.dataset.libraPlusLeftSidebarStyle = '1'
  styleEl.textContent = `
html[data-libra-plus-left-sidebar='1'] [data-main-left-sidebar='true'] {
  display: none !important;
}
html[data-libra-plus-left-sidebar='1']:has([data-libra-plus-left-logo='1']:hover) [data-main-left-sidebar='true'][data-libra-plus-left-sidebar-floating='1'],
html[data-libra-plus-left-sidebar='1'] [data-main-left-sidebar='true'][data-libra-plus-left-sidebar-floating='1']:hover {
  display: block !important;
}
`.trim()
  ;(document.head || document.documentElement).append(styleEl)
  leftSidebarStyleEl = styleEl
}

function saveElStyle(el: HTMLElement): void {
  const ds = el.dataset
  if (ds.libraPlusSavedStyle === '1') return
  ds.libraPlusSavedStyle = '1'
  ds.libraPlusOrigDisplay = el.style.display
  ds.libraPlusOrigPosition = el.style.position
  ds.libraPlusOrigLeft = el.style.left
  ds.libraPlusOrigTop = el.style.top
  ds.libraPlusOrigTransform = el.style.transform
  ds.libraPlusOrigZIndex = el.style.zIndex
  ds.libraPlusOrigMaxHeight = el.style.maxHeight
  ds.libraPlusOrigOverflow = el.style.overflow
  ds.libraPlusOrigPointerEvents = el.style.pointerEvents
  ds.libraPlusOrigPaddingTop = el.style.paddingTop
}

function restoreElStyle(el: HTMLElement): void {
  const ds = el.dataset
  if (ds.libraPlusSavedStyle !== '1') return

  if (ds.libraPlusOrigDisplay) el.style.display = ds.libraPlusOrigDisplay
  else el.style.removeProperty('display')

  if (ds.libraPlusOrigPosition) el.style.position = ds.libraPlusOrigPosition
  else el.style.removeProperty('position')

  if (ds.libraPlusOrigLeft) el.style.left = ds.libraPlusOrigLeft
  else el.style.removeProperty('left')

  if (ds.libraPlusOrigTop) el.style.top = ds.libraPlusOrigTop
  else el.style.removeProperty('top')

  if (ds.libraPlusOrigTransform) el.style.transform = ds.libraPlusOrigTransform
  else el.style.removeProperty('transform')

  if (ds.libraPlusOrigZIndex) el.style.zIndex = ds.libraPlusOrigZIndex
  else el.style.removeProperty('z-index')

  if (ds.libraPlusOrigMaxHeight) el.style.maxHeight = ds.libraPlusOrigMaxHeight
  else el.style.removeProperty('max-height')

  if (ds.libraPlusOrigOverflow) el.style.overflow = ds.libraPlusOrigOverflow
  else el.style.removeProperty('overflow')

  if (ds.libraPlusOrigPointerEvents) {
    el.style.pointerEvents = ds.libraPlusOrigPointerEvents
  } else {
    el.style.removeProperty('pointer-events')
  }

  if (ds.libraPlusOrigPaddingTop) {
    el.style.paddingTop = ds.libraPlusOrigPaddingTop
  } else {
    el.style.removeProperty('padding-top')
  }
}

function applyLeftSidebarHidden(settings: SettingsSnapshot): void {
  const rootDs = document.documentElement.dataset
  const sidebar = document.querySelector<HTMLElement>(
    '[data-main-left-sidebar="true"]'
  )
  const logo = document.querySelector<HTMLElement>(
    '[role~="work"] + a,.breadcrumbs a[href="/"]'
  )

  if (!sidebar || !logo) {
    if (leftSidebarEl) {
      restoreElStyle(leftSidebarEl)
      delete leftSidebarEl.dataset.libraPlusLeftSidebarFloating
    }

    if (leftLogoEl) {
      delete leftLogoEl.dataset.libraPlusLeftLogo
    }

    delete rootDs.libraPlusLeftSidebar
    leftSidebarEl = sidebar || undefined
    leftLogoEl = logo || undefined
    return
  }

  if (leftSidebarEl !== sidebar) {
    leftSidebarEl = sidebar
  }

  if (leftLogoEl !== logo) {
    leftLogoEl = logo
  }

  saveElStyle(sidebar)

  if (!settings.hideLeftSidebar) {
    restoreElStyle(sidebar)
    delete sidebar.dataset.libraPlusLeftSidebarFloating
    delete logo.dataset.libraPlusLeftLogo
    delete rootDs.libraPlusLeftSidebar
    return
  }

  ensureLeftSidebarHoverStyle()
  rootDs.libraPlusLeftSidebar = '1'
  sidebar.dataset.libraPlusLeftSidebarFloating = '1'
  logo.dataset.libraPlusLeftLogo = '1'
  sidebar.style.position = 'fixed'

  const logoRect = leftLogoEl?.getBoundingClientRect()
  const isBreadcrumbsLogo = Boolean(leftLogoEl?.closest('.breadcrumbs'))
  if (logoRect) {
    const top = Math.round(logoRect.bottom)
    if (isBreadcrumbsLogo) {
      const left = Math.round(logoRect.left)
      sidebar.style.left = `${left}px`
      sidebar.style.transform = 'translate(0, 0)'
    } else {
      const centerX = Math.round(logoRect.left + logoRect.width / 2)
      sidebar.style.left = `${centerX}px`
      sidebar.style.transform = 'translate(-50%, 0)'
    }

    sidebar.style.top = `${top}px`
    sidebar.style.maxHeight = `calc(100vh - ${top}px - 16px)`
    sidebar.style.paddingTop = '2px'
  } else {
    sidebar.style.left = '50%'
    sidebar.style.top = 'var(--tab-height, 40px)'
    sidebar.style.transform = 'translate(-50%, 0)'
    sidebar.style.maxHeight = '80vh'
    sidebar.style.paddingTop = '2px'
  }

  sidebar.style.zIndex = '2147483647'
  sidebar.style.overflow = 'auto'
  sidebar.style.pointerEvents = 'auto'
}

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

  applyLeftSidebarHidden(settings)

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

  ensureLeftSidebarHoverStyle()

  const run = () => {
    applySidebarHidden(getSettings)
  }

  onDomChange(run)
  onUrlChange(run)

  // Initial run
  run()
}
