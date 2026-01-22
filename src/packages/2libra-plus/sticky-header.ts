import { onDomChange, onUrlChange } from '../../utils/dom-watcher'

type SettingsSnapshot = {
  enabled: boolean
  stickyHeader: boolean
}

type GetSettings = () => SettingsSnapshot

let initialized = false

function applyStickyHeader(getSettings: GetSettings): void {
  const settings = getSettings()
  const target =
    document.querySelector('.node-parent-tabs')?.parentElement?.parentElement

  if (!target) return

  if (settings.enabled && settings.stickyHeader) {
    target.style.position = 'sticky'
    target.style.top = '0'
    target.style.zIndex = '1'
  } else {
    // Reset styles if disabled
    target.style.removeProperty('position')
    target.style.removeProperty('top')
    target.style.removeProperty('z-index')
  }
}

export function runStickyHeader(getSettings: GetSettings): void {
  applyStickyHeader(getSettings)
}

export function initStickyHeader(getSettings: GetSettings): void {
  if (initialized) return
  initialized = true

  const run = () => {
    applyStickyHeader(getSettings)
  }

  onDomChange(run)
  onUrlChange(run)

  // Initial run
  run()
}
