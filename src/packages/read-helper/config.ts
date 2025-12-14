export type Mode = 'sentence' | 'clause' | 'line' | 'paragraph'
export type Style = 'box' | 'underline'

export type ReadHelperSettings = {
  mode: Mode
  style: Style
  color: string
  enabled: boolean
  hideOnScroll: boolean
  moveByArrows: boolean
  skipButtons: boolean
  skipLinks: boolean
}

export const READ_HELPER_SETTINGS_KEY = 'read_helper_settings'

export const DEFAULT_READ_HELPER_SETTINGS: ReadHelperSettings = {
  mode: 'sentence',
  style: 'underline',
  color: '#ff4d4f',
  enabled: true,
  hideOnScroll: false,
  moveByArrows: false,
  skipButtons: true,
  skipLinks: true,
}
