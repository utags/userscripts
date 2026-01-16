import { deleteValue, getValue, setValue } from 'browser-extension-storage'

import {
  ALLOWED_BUTTON_POSITIONS,
  ALLOWED_HOSTS,
  ALLOWED_PROXIES,
  BTN_SETTINGS_MAP_KEY,
  CONFIG,
  DEFAULT_BUTTON_POSITION,
  FORMAT_MAP_KEY,
  HISTORY_KEY,
  HOST_MAP_KEY,
  PROXY_MAP_KEY,
  SITE_SETTINGS_MAP_KEY,
} from './constants'
import {
  ensureAllowedFormat,
  ensureAllowedValue,
  normalizeHost,
  t,
} from './utils'

// Migrate legacy storage keys from older versions (iu_*) to new (uiu_*) - v0.1 to v0.2
export async function migrateLegacyStorage() {
  try {
    const maybeMove = async (oldKey: string, newKey: string) => {
      const newVal = await getValue(newKey)
      const hasNew = newVal !== undefined
      const oldVal = await getValue(oldKey)
      const hasOld = oldVal !== undefined
      if (!hasNew && hasOld) {
        await setValue(newKey, oldVal)
        try {
          await deleteValue(oldKey)
        } catch {}
      }
    }

    await maybeMove('iu_history', HISTORY_KEY)
    await maybeMove('iu_format_map', FORMAT_MAP_KEY)
    await maybeMove('iu_site_btn_settings_map', BTN_SETTINGS_MAP_KEY)
  } catch {}
}

// Migrate existing separate maps (format/host/proxy/buttons) into unified per-domain map - v0.2 to v0.3 and later
export async function migrateToUnifiedSiteMap() {
  try {
    const existing: Record<string, any> | undefined = await getValue<
      Record<string, any> | undefined
    >(SITE_SETTINGS_MAP_KEY, undefined)
    const siteMap = existing && typeof existing === 'object' ? existing : {}
    const isEmpty = !siteMap || Object.keys(siteMap).length === 0
    // Only migrate if the unified map is empty to avoid overwriting user settings
    if (!isEmpty) return

    const formatMap =
      (await getValue<Record<string, any>>(FORMAT_MAP_KEY, {})) || {}
    const hostMap =
      (await getValue<Record<string, any>>(HOST_MAP_KEY, {})) || {}
    const proxyMap =
      (await getValue<Record<string, any>>(PROXY_MAP_KEY, {})) || {}
    const btnMap =
      (await getValue<Record<string, any>>(BTN_SETTINGS_MAP_KEY, {})) || {}

    const rawKeys = new Set<string>([
      ...Object.keys(formatMap),
      ...Object.keys(hostMap),
      ...Object.keys(proxyMap),
      ...Object.keys(btnMap),
      ...Object.keys(CONFIG || {}),
    ])
    const keys = new Set<string>()
    for (const k of rawKeys) keys.add(normalizeHost(k))

    for (const key of keys) {
      if (!key) continue
      const preset = CONFIG?.[key] || {}
      const s = siteMap[key] || {}
      // Format
      if (s.format === undefined) {
        const fmt = formatMap[key] ?? preset.format
        const normalizedFormat = await ensureAllowedFormat(fmt)
        if (normalizedFormat) s.format = normalizedFormat
      }

      // Host
      if (s.host === undefined) {
        const h = hostMap[key] ?? preset.host
        const normalizedHost = ensureAllowedValue(h, ALLOWED_HOSTS)
        if (normalizedHost) s.host = normalizedHost
      }

      // Proxy (Due to legacy logic, do not persist 'none', convert 'none' to undefined)
      if (s.proxy === undefined) {
        const px = proxyMap[key] ?? preset.proxy
        const resolved = ensureAllowedValue(px, ALLOWED_PROXIES)
        if (resolved && resolved !== 'none') s.proxy = resolved
      }

      // Buttons
      if (s.buttons === undefined) {
        const raw = btnMap[key] ?? preset.buttons ?? preset.button ?? []
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : []
        const list = arr
          .map((c: any) => {
            const selector = String(c?.selector || '').trim()
            if (!selector) return null
            const p = String(c?.position || '').trim()
            const pos = ensureAllowedValue(
              p,
              ALLOWED_BUTTON_POSITIONS,
              DEFAULT_BUTTON_POSITION
            )
            const text = String(
              c?.text || t('insert_image_button_default')
            ).trim()
            return { selector, position: pos, text }
          })
          .filter(Boolean)
        if (list.length > 0) s.buttons = list
      }

      if (Object.keys(s).length > 0) siteMap[key] = s
    }

    await setValue(SITE_SETTINGS_MAP_KEY, siteMap)
    // Optionally clear legacy keys to avoid duplication
    try {
      await deleteValue(FORMAT_MAP_KEY)
      await deleteValue(HOST_MAP_KEY)
      await deleteValue(PROXY_MAP_KEY)
      await deleteValue(BTN_SETTINGS_MAP_KEY)
    } catch {}
  } catch {}
}
