import styleText from 'css:./style.css'

import { addStyle, registerMenu as gmRegisterMenu } from '../../common/gm'
import {
  createSettingsStore,
  openSettingsPanel as openPanel,
  type Field,
  type PanelSchema,
} from '../../common/settings'
import { initAutoMarkNotificationsRead } from './auto-mark-notifications-read'

type Settings = {
  enabled: boolean
  autoMarkNotificationsRead: boolean
}

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  autoMarkNotificationsRead: true,
}

const store = createSettingsStore('settings', DEFAULT_SETTINGS)

let enabled = DEFAULT_SETTINGS.enabled
let autoMarkNotificationsRead = DEFAULT_SETTINGS.autoMarkNotificationsRead

function buildSettingsSchema(): PanelSchema {
  const fields: Field[] = [
    { type: 'toggle', key: 'enabled', label: '启用' },
    {
      type: 'toggle',
      key: 'autoMarkNotificationsRead',
      label: '自动将通知页设为已读',
    },
  ]
  return {
    type: 'simple',
    title: '2Libra Plus 设置',
    fields,
  }
}

function openSettings(): void {
  const schema = buildSettingsSchema()
  const s = store
  openPanel(schema, s, {
    hostDatasetKey: 'libraPlusHost',
    hostDatasetValue: '2libra-plus-settings',
    theme: {
      activeBg: '#2563eb',
      activeFg: '#ffffff',
      colorRing: '#2563eb',
      toggleOnBg: '#2563eb',
    },
  })
}

function registerMenus(): void {
  try {
    gmRegisterMenu('设置', () => {
      try {
        openSettings()
      } catch {}
    })
  } catch {}
}

function listenSettings(): void {
  try {
    store.onChange(() => {
      void applySettingsFromStore()
    })
  } catch {}
}

async function applySettingsFromStore(): Promise<void> {
  try {
    const prevEnabled = enabled
    const obj = await store.getAll<Settings>()
    enabled = Boolean(obj.enabled)
    autoMarkNotificationsRead = Boolean(obj.autoMarkNotificationsRead)
    if (!prevEnabled && enabled) {
      initFeatures()
    }
  } catch {}
}

function getSettingsSnapshot(): Settings {
  return {
    enabled,
    autoMarkNotificationsRead,
  }
}

let featuresInitialized = false

function initFeatures(): void {
  if (featuresInitialized) return
  featuresInitialized = true
  initAutoMarkNotificationsRead(getSettingsSnapshot)
}

function bootstrap(): void {
  const d = document.documentElement
  const ds = d.dataset as Record<string, string>
  if (ds.libraPlus === '1') return
  ds.libraPlus = '1'
  void addStyle(styleText)
  registerMenus()
  listenSettings()
  void applySettingsFromStore()
  if (enabled) {
    initFeatures()
  }
}

bootstrap()
