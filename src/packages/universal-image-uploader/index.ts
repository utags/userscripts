import {
  addValueChangeListener,
  deleteValue,
  getValue,
  setValue,
} from 'browser-extension-storage'

import { addStyle, registerMenu, unregisterMenu } from '../../common/gm'
import { isTopFrame } from '../../utils/is-top-frame'
import { applyProxy, applyProxyForDualHost } from './apply-proxy.js'
import {
  ALLOWED_BUTTON_POSITIONS,
  ALLOWED_FORMATS,
  ALLOWED_HOSTS,
  ALLOWED_PROXIES,
  ALLOWED_PROXIES_MULTI_HOST,
  APPINN_UPLOAD_ENDPOINT,
  APPINN_UPLOAD_PARAMS,
  BTN_SETTINGS_MAP_KEY,
  CONFIG,
  CUSTOM_FORMATS_KEY,
  DEFAULT_BUTTON_POSITION,
  DEFAULT_FORMAT,
  DEFAULT_HOST,
  DEFAULT_PROXY,
  FORMAT_MAP_KEY,
  HISTORY_KEY,
  HOST_MAP_KEY,
  I18N,
  IMGUR_CLIENT_IDS,
  PROXY_MAP_KEY,
  SITE_SETTINGS_MAP_KEY,
} from './constants'
import { migrateLegacyStorage, migrateToUnifiedSiteMap } from './migration'
import {
  CustomFormat,
  detectLanguage,
  ensureAllowedFormat,
  ensureAllowedValue,
  getAllowedFormats,
  getCustomFormats,
  md5Encode,
  normalizeHost,
  removeCustomFormat,
  setCustomFormats,
  t,
  tpl,
  upsertCustomFormat,
  USER_LANG,
} from './utils'

// Apply preset config to unified storage (only set missing fields)
async function applyPresetConfig() {
  try {
    const siteMap = (await getValue(SITE_SETTINGS_MAP_KEY, {})) || {}
    let changed = false
    for (const [host, preset] of Object.entries(CONFIG || {})) {
      const key = normalizeHost(host)
      if (!key || typeof preset !== 'object') continue
      const s = siteMap[key] || {}
      // format
      if (s.format === undefined && preset.format) {
        const normalizedFormat = ensureAllowedValue(
          preset.format,
          ALLOWED_FORMATS
        )
        if (normalizedFormat) {
          s.format = normalizedFormat
          changed = true
        }
      }

      // host
      if (s.host === undefined && preset.host) {
        const normalizedHost = ensureAllowedValue(preset.host, ALLOWED_HOSTS)
        if (normalizedHost) {
          s.host = normalizedHost
          changed = true
        }
      }

      // proxy
      if (s.proxy === undefined && preset.proxy) {
        const resolved = ensureAllowedValue(preset.proxy, ALLOWED_PROXIES)
        if (resolved) {
          s.proxy = resolved
          changed = true
        }
      }

      // buttons
      if (s.buttons === undefined) {
        const raw = preset.buttons || preset.button || []
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : []
        const list = arr
          .map((c) => {
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
        if (list.length > 0) {
          s.buttons = list
          changed = true
        }
      }

      // enabled
      if (s.enabled === undefined && typeof preset.enabled === 'boolean') {
        s.enabled = preset.enabled
        changed = true
      }

      // pasteEnabled
      if (
        s.pasteEnabled === undefined &&
        typeof preset.pasteEnabled === 'boolean'
      ) {
        s.pasteEnabled = preset.pasteEnabled
        changed = true
      }

      // dragAndDropEnabled
      if (
        s.dragAndDropEnabled === undefined &&
        typeof preset.dragAndDropEnabled === 'boolean'
      ) {
        s.dragAndDropEnabled = preset.dragAndDropEnabled
        changed = true
      }

      if (changed) siteMap[key] = s
    }

    if (changed) await setValue(SITE_SETTINGS_MAP_KEY, siteMap)
  } catch {}
}

// Initialize once at runtime
// applyPresetConfig() // Moved to init

const SITE_KEY = normalizeHost(location.hostname || '')
const getSiteSettingsMap = async (): Promise<Record<string, any>> =>
  (await getValue<Record<string, any>>(SITE_SETTINGS_MAP_KEY, {})) || {}
const setSiteSettingsMap = async (map: Record<string, any>): Promise<void> => {
  await setValue(SITE_SETTINGS_MAP_KEY, map)
}

const getCurrentSiteSettings = async (): Promise<Record<string, any>> => {
  const map = await getSiteSettingsMap()
  return map[SITE_KEY] || {}
}

const updateCurrentSiteSettings = async (
  updater:
    | Record<string, any>
    | ((current: Record<string, any>) => Record<string, any>)
): Promise<void> => {
  const map = await getSiteSettingsMap()
  const key = SITE_KEY
  const current = map[key] || {}
  const partial =
    typeof updater === 'function' ? updater({ ...current }) : { ...updater }
  const next = { ...current, ...partial }
  // sanitize format (allow built-ins and user custom formats)
  if (Object.prototype.hasOwnProperty.call(next, 'format')) {
    const resolvedFormat = await ensureAllowedFormat(next.format)
    if (resolvedFormat) next.format = resolvedFormat
    else delete next.format
  }

  // sanitize host
  if (Object.prototype.hasOwnProperty.call(next, 'host')) {
    const resolvedHost = ensureAllowedValue(next.host, ALLOWED_HOSTS)
    if (resolvedHost) next.host = resolvedHost
    else delete next.host
  }

  // sanitize secondary host
  if (Object.prototype.hasOwnProperty.call(next, 'secondaryHost')) {
    const resolvedSecondaryHost = ensureAllowedValue(
      next.secondaryHost,
      ALLOWED_HOSTS
    )
    if (resolvedSecondaryHost) next.secondaryHost = resolvedSecondaryHost
    else delete next.secondaryHost
  }

  // sanitize proxy
  if (Object.prototype.hasOwnProperty.call(next, 'proxy')) {
    const resolved = ensureAllowedValue(next.proxy, ALLOWED_PROXIES)
    if (resolved) next.proxy = resolved
    else delete next.proxy
  }

  // sanitize buttons (empty or falsy removes the field)
  if (Object.prototype.hasOwnProperty.call(next, 'buttons')) {
    const list = next.buttons
    if (!list || !Array.isArray(list) || list.length === 0) {
      delete next.buttons
    }
  }

  // persist
  if (!next || Object.keys(next).length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (map[key]) delete map[key]
  } else {
    map[key] = next
  }

  await setSiteSettingsMap(map)
}

const getFormat = async () => {
  const s = await getCurrentSiteSettings()
  return s.format || DEFAULT_FORMAT
}

const setFormat = async (format) => {
  await updateCurrentSiteSettings({ format })
}

const getHost = async () => {
  const s = await getCurrentSiteSettings()
  return ensureAllowedValue(s.host, ALLOWED_HOSTS, DEFAULT_HOST)
}

const setHost = async (host: string) => {
  const resolvedHost = ensureAllowedValue(host, ALLOWED_HOSTS, DEFAULT_HOST)
  const s = await getCurrentSiteSettings()
  let secondaryHost = s.secondaryHost
  if (resolvedHost === secondaryHost) {
    secondaryHost = undefined
  }

  let proxy = s.proxy
  if (secondaryHost) {
    proxy = ensureAllowedValue(proxy, ALLOWED_PROXIES_MULTI_HOST, DEFAULT_PROXY)
  }

  await updateCurrentSiteSettings({ host: resolvedHost, secondaryHost, proxy })
}

const getSecondaryHost = async (): Promise<string> => {
  const s = await getCurrentSiteSettings()
  const primaryHost = ensureAllowedValue(s.host, ALLOWED_HOSTS, DEFAULT_HOST)
  const secondaryHost = ensureAllowedValue(
    s.secondaryHost,
    ALLOWED_HOSTS,
    undefined
  )
  return secondaryHost && secondaryHost !== primaryHost ? secondaryHost : ''
}

const setSecondaryHost = async (host: string | undefined) => {
  const s = await getCurrentSiteSettings()
  const secondaryHost = ensureAllowedValue(host, ALLOWED_HOSTS, undefined)
  let proxy = s.proxy
  if (secondaryHost) {
    proxy = ensureAllowedValue(proxy, ALLOWED_PROXIES_MULTI_HOST, DEFAULT_PROXY)
  }

  await updateCurrentSiteSettings({
    secondaryHost,
    proxy,
  })
}

const getProxy = async () => {
  const s = await getCurrentSiteSettings()
  const secondaryHost = ensureAllowedValue(
    s.secondaryHost,
    ALLOWED_HOSTS,
    undefined
  )
  const resolvedProxy = ensureAllowedValue(
    s.proxy,
    secondaryHost ? ALLOWED_PROXIES_MULTI_HOST : ALLOWED_PROXIES,
    DEFAULT_PROXY
  )
  return resolvedProxy
}

const setProxy = async (proxy: string) => {
  const s = await getCurrentSiteSettings()
  const secondaryHost = ensureAllowedValue(
    s.secondaryHost,
    ALLOWED_HOSTS,
    undefined
  )
  const resolvedProxy = ensureAllowedValue(
    proxy,
    secondaryHost ? ALLOWED_PROXIES_MULTI_HOST : ALLOWED_PROXIES,
    DEFAULT_PROXY
  )
  await updateCurrentSiteSettings({ proxy: resolvedProxy })
}

const getWebpEnabled = async () => {
  const s = await getCurrentSiteSettings()
  return s.webp === true
}

const setWebpEnabled = async (val) => {
  await updateCurrentSiteSettings({ webp: Boolean(val) })
}

const getEnabled = async () => {
  const s = await getCurrentSiteSettings()
  return s.enabled === true
}

const setEnabled = async (val) => {
  await updateCurrentSiteSettings({ enabled: Boolean(val) })
}

const getPasteEnabled = async () => {
  const s = await getCurrentSiteSettings()
  return s.pasteEnabled === true
}

const setPasteEnabled = async (val) => {
  await updateCurrentSiteSettings({ pasteEnabled: Boolean(val) })
}

const getDragAndDropEnabled = async () => {
  const s = await getCurrentSiteSettings()
  return s.dragAndDropEnabled === true
}

const setDragAndDropEnabled = async (val) => {
  await updateCurrentSiteSettings({ dragAndDropEnabled: Boolean(val) })
}

// Support multiple site button configurations
const getSiteBtnSettingsList = async () => {
  const s = await getCurrentSiteSettings()
  const val = s.buttons || []
  return Array.isArray(val) ? val : val?.selector ? [val] : []
}

const setSiteBtnSettingsList = async (list) => {
  await updateCurrentSiteSettings({ buttons: list })
}

const addSiteBtnSetting = async (cfg) => {
  const selector = (cfg?.selector || '').trim()
  if (!selector) return
  const p = (cfg?.position || '').trim()
  const pos = ensureAllowedValue(
    p,
    ALLOWED_BUTTON_POSITIONS,
    DEFAULT_BUTTON_POSITION
  )
  const text = (cfg?.text || t('insert_image_button_default')).trim()
  const list = await getSiteBtnSettingsList()
  list.push({ selector, position: pos, text })
  await setSiteBtnSettingsList(list)
}

const removeSiteBtnSetting = async (index) => {
  const list = await getSiteBtnSettingsList()
  if (index >= 0 && index < list.length) {
    list.splice(index, 1)
    await setSiteBtnSettingsList(list)
  }
}

const updateSiteBtnSetting = async (index, cfg) => {
  const list = await getSiteBtnSettingsList()
  if (!list || index < 0 || index >= list.length) return
  const selector = (cfg?.selector || '').trim()
  if (!selector) return
  const p = (cfg?.position || '').trim()
  const pos = ensureAllowedValue(
    p,
    ALLOWED_BUTTON_POSITIONS,
    DEFAULT_BUTTON_POSITION
  )
  const text = (cfg?.text || t('insert_image_button_default')).trim()
  list[index] = { selector, position: pos, text }
  await setSiteBtnSettingsList(list)
}

const MAX_HISTORY = 200

const createEl = (
  tag: string,
  attrs: Record<string, string> = {},
  children: Array<string | Node> = []
): any => {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') el.textContent = v
    else if (k === 'class') el.className = v
    else el.setAttribute(k, v)
  }

  for (const c of children) el.append(c)
  return el
}

const requestOpenFilePicker = () => {
  if (isTopFrame()) {
    globalThis.dispatchEvent(new CustomEvent('uiu:request-open-file-picker'))
  } else {
    window.top?.postMessage({ type: 'uiu:request-open-file-picker' }, '*')
  }
}

function applySingle(cfg: any) {
  if (!cfg?.selector) return
  let targets
  try {
    targets = document.querySelectorAll(cfg.selector)
  } catch {
    return
  }

  if (!targets || targets.length === 0) return
  const posRaw = (cfg.position || '').trim()
  const pos =
    posRaw === 'before' ? 'before' : posRaw === 'inside' ? 'inside' : 'after'
  const content = (cfg.text || t('insert_image_button_default')).trim()
  for (const t of Array.from(targets)) {
    const target = t as HTMLElement
    let exists = false
    if (pos === 'inside') {
      exists = Boolean(target.querySelector('.uiu-insert-btn'))
    } else {
      const prev = target.previousElementSibling
      const next = target.nextElementSibling
      if (
        (prev && prev.classList?.contains('uiu-insert-btn')) ||
        (next && next.classList?.contains('uiu-insert-btn'))
      ) {
        exists = true
      } else {
        const parent = target.parentElement
        if (parent) {
          for (const child of Array.from(parent.children)) {
            if (child === target) continue
            if (child.classList?.contains('uiu-insert-btn')) {
              exists = true
              break
            }
          }
        }
      }
    }

    if (exists) continue
    let btn: HTMLElement | undefined
    try {
      // Parse HTML without using innerHTML to comply with Trusted Types
      const range = document.createRange()
      const ctx = document.createElement('div')
      range.selectNodeContents(ctx)
      const frag = range.createContextualFragment(content)
      if (frag && frag.childElementCount === 1) {
        btn = frag.firstElementChild as HTMLElement
      }
    } catch {}

    if (btn) {
      btn.classList.add('uiu-insert-btn')
    } else {
      btn = createEl('button', {
        class: 'uiu-insert-btn uiu-default',
        text: content,
      }) as HTMLElement
    }

    btn.addEventListener('click', handleSiteButtonClick)
    if (pos === 'before') {
      target.before(btn)
    } else if (pos === 'inside') {
      target.append(btn)
    } else {
      target.after(btn)
    }
  }
}

async function applySiteButtons() {
  const list = await getSiteBtnSettingsList()
  for (const cfg of list) {
    try {
      applySingle(cfg)
    } catch {}
  }
}

let siteBtnObserver: MutationObserver | undefined
async function restartSiteButtonObserver() {
  try {
    if (siteBtnObserver) siteBtnObserver.disconnect()
  } catch {}

  const list = await getSiteBtnSettingsList()
  if (list.length === 0) {
    siteBtnObserver = undefined
    return
  }

  const checkAndInsertAll = () => {
    for (const cfg of list) {
      try {
        applySingle(cfg)
      } catch {}
    }
  }

  checkAndInsertAll()
  siteBtnObserver = new MutationObserver(() => {
    checkAndInsertAll()
  })
  siteBtnObserver.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  })
}

// Helper: build button position options for a select element
// selectedValue is optional; defaults to DEFAULT_BUTTON_POSITION when absent/invalid
const buildPositionOptions = (selectEl, selectedValue) => {
  if (!selectEl) return
  // Avoid Trusted Types violation: clear without using innerHTML
  selectEl.textContent = ''
  const selected = selectedValue
    ? ensureAllowedValue(
        selectedValue,
        ALLOWED_BUTTON_POSITIONS,
        DEFAULT_BUTTON_POSITION
      )
    : DEFAULT_BUTTON_POSITION
  for (const value of ALLOWED_BUTTON_POSITIONS) {
    const opt = createEl('option', { value, text: t('pos_' + value) })
    if (value === selected) opt.selected = true
    selectEl.append(opt)
  }
}

// Helper: build format options
const buildFormatOptions = async (selectEl, selectedValue) => {
  if (!selectEl) return
  // Avoid Trusted Types violation: clear without using innerHTML
  selectEl.textContent = ''
  const selected = selectedValue
    ? await ensureAllowedFormat(selectedValue)
    : DEFAULT_FORMAT
  const builtins = ALLOWED_FORMATS
  const customs = await getCustomFormats()
  for (const val of builtins) {
    const opt = createEl('option', { value: val, text: t('format_' + val) })
    if (val === selected) opt.selected = true
    selectEl.append(opt)
  }

  for (const cf of customs) {
    const opt = createEl('option', { value: cf.name, text: cf.name })
    if (cf.name === selected) opt.selected = true
    selectEl.append(opt)
  }
}

var STARDOTS_CONFIG = { key: '', secret: '', bucket: '' }

const injectStarDotsSettings = () => {
  const hostEl = document.querySelector('#uiu-panel')
  if (!hostEl) return
  const shadowRoot = hostEl.shadowRoot
  if (!shadowRoot) return
  const container = shadowRoot.querySelectorAll('.uiu-body .uiu-controls')[1]
  const wrapper = document.createElement('div')
  wrapper.innerHTML = `
  <div id="sd-configuration-section" style="width: 100%;border-top: 1px solid #F6C844;border-bottom: 1px solid #F6C844;padding: 8px 0px;">
    <h3>${t('stardots_config_title')}</h3>
    <label style="display: inline-block; width: 96%">${t('stardots_key_title')}</label>
    <input style="display: inline-block; width: 96%" type="text" id="sd-api-key" placeholder="${t('stardots_key_placeholder')}" />

    <label style="display: inline-block; width: 96%">${t('stardots_secret_title')}</label>
    <input style="display: inline-block; width: 96%" type="password" id="sd-api-secret" placeholder="${t('stardots_secret_placeholder')}" />

    <label style="display: inline-block; width: 96%">${t('stardots_bucket_title')}</label>
    <input style="display: inline-block; width: 96%" type="text" id="sd-bucket" placeholder="${t('stardots_bucket_placeholder')}" />

    <div style="width: 100%;">
      <button id="sd-save-config" style="margin-top: 4px">${t('stardots_save_title')}</button>
      <span id="sd-save-status" style="margin-left:8px;color: #00ff9f;"></span>
      <a style="color: #F6C844;" href="https://dashboard.stardots.io/openapi/key-and-secret" target="_blank">${t('stardots_get_credentials_title')}</a>
    </div>
  </div>
`
  const scsEl = container.querySelector('#sd-configuration-section')
  if (scsEl) {
    scsEl.remove()
  }

  container.appendChild(wrapper)

  loadStarDotsConfig()

  shadowRoot
    .getElementById('sd-save-config')
    ?.addEventListener('click', async () => {
      const key = (
        shadowRoot.getElementById('sd-api-key') as HTMLInputElement
      )?.value.trim()
      const secret = (
        shadowRoot.getElementById('sd-api-secret') as HTMLInputElement
      )?.value.trim()
      const bucket = (
        shadowRoot.getElementById('sd-bucket') as HTMLInputElement
      )?.value.trim()

      const targetOrigin: string = '*'
      window.postMessage(
        {
          type: 'uiu:stardots-save-config',
          payload: { key, secret, bucket },
        },
        targetOrigin
      )

      const statusEl = shadowRoot.getElementById(
        'sd-save-status'
      ) as HTMLSpanElement
      if (statusEl) {
        statusEl.innerText = t('stardots_save_result_title')
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.innerText = ''
        }
        const configSection = shadowRoot.getElementById(
          'sd-configuration-section'
        ) as HTMLDivElement
        if (configSection) {
          configSection.style.display = 'none'
        }
      }, 2000)
    })
}
var loadStarDotsConfig = async () => {
  window.postMessage(
    {
      type: 'uiu:stardots-get-config',
    },
    '*'
  )
}

// Helper: build host options
const buildHostOptions = (selectEl, selectedValue) => {
  if (!selectEl) return
  // Avoid Trusted Types violation: clear without using innerHTML
  selectEl.textContent = ''
  const selected = selectedValue
    ? ensureAllowedValue(selectedValue, ALLOWED_HOSTS, DEFAULT_HOST)
    : DEFAULT_HOST
  for (const val of ALLOWED_HOSTS) {
    const opt = createEl('option', { value: val, text: t('host_' + val) })
    if (val === selected) opt.selected = true
    selectEl.append(opt)
  }
  selectEl.onchange = (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement)?.value.trim()
    if (selectedValue === 'stardots') {
      injectStarDotsSettings()
    } else {
      //TODO other logic
    }
  }
}

const buildSecondaryHostOptions = (
  selectEl: HTMLSelectElement,
  selectedValue: string | undefined,
  primaryHost: string
) => {
  if (!selectEl) return
  selectEl.textContent = ''
  const placeholder = createEl('option', {
    value: '',
    text: t('multi_host_none'),
  })
  selectEl.append(placeholder)
  const candidates = ALLOWED_HOSTS.filter((h) => h !== primaryHost)
  const selected =
    selectedValue && candidates.includes(selectedValue) ? selectedValue : ''
  for (const val of candidates) {
    const opt = createEl('option', { value: val, text: t('host_' + val) })
    if (val === selected) opt.selected = true
    selectEl.append(opt)
  }
  selectEl.onchange = (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement)?.value.trim()
    if (selectedValue === 'stardots') {
      injectStarDotsSettings()
    } else {
      //TODO other logic
    }
  }
}

// Helper: get proxy label key
const getProxyLabelKey = (val: string) =>
  `proxy_${val.replaceAll('.', '_').replaceAll('-', '_')}`

// Helper: build proxy options
const buildProxyOptions = (selectEl, selectedValue, limitToWsrv = false) => {
  if (!selectEl) return
  // Avoid Trusted Types violation: clear without using innerHTML
  selectEl.textContent = ''
  const selected = selectedValue
    ? ensureAllowedValue(
        selectedValue,
        limitToWsrv ? ALLOWED_PROXIES_MULTI_HOST : ALLOWED_PROXIES,
        DEFAULT_PROXY
      )
    : DEFAULT_PROXY
  const visibleProxies = limitToWsrv
    ? ALLOWED_PROXIES_MULTI_HOST
    : ALLOWED_PROXIES
  for (const val of visibleProxies) {
    const opt = createEl('option', {
      value: val,
      text: t(getProxyLabelKey(val)),
    })
    if (val === selected) opt.selected = true
    selectEl.append(opt)
  }
}

const css = `
  #uiu-panel { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; width: 440px; max-height: calc(100vh - 32px); overflow: auto; background: #111827cc; color: #fff; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.25); font-family: system-ui, -apple-system, Segoe UI, Roboto; font-size: 13px; line-height: 1.5; }
  #uiu-panel header { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; font-weight: 600; font-size: 16px; background-color: unset; box-shadow: unset; transition: unset; }
  #uiu-panel header .uiu-actions { display:flex; gap:8px; }
  #uiu-panel header .uiu-actions button { font-size: 12px; }
  /* Active styles for toggles when sections are open */
  #uiu-panel header.uiu-show-history .uiu-actions .uiu-toggle-history { background:#2563eb; border-color:#1d4ed8; box-shadow: 0 0 0 1px #1d4ed8 inset; color:#fff; }
  #uiu-panel header.uiu-show-settings .uiu-actions .uiu-toggle-settings { background:#2563eb; border-color:#1d4ed8; box-shadow: 0 0 0 1px #1d4ed8 inset; color:#fff; }
  #uiu-panel .uiu-body { padding: 8px 12px; }
  #uiu-panel .uiu-controls { display:flex; align-items:center; gap:8px; flex-wrap: wrap; }
  #uiu-panel .uiu-controls label { display:inline-flex; align-items:center; }
  #uiu-panel select, #uiu-panel button, #uiu-panel input { font-size: 12px; padding: 6px 10px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; }
  #uiu-panel button.uiu-primary { background:#2563eb; border-color:#1d4ed8; }
  #uiu-panel .uiu-list { margin-top:8px; max-height: 140px; overflow-y:auto; overflow-x:hidden; font-size: 12px; }
  #uiu-panel .uiu-list .uiu-item { padding:6px 0; border-bottom: 1px dashed #334155; white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
  #uiu-panel .uiu-list .uiu-log-item { padding: 6px 8px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3); transition: all .15s; white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
  #uiu-panel .uiu-list .uiu-log-item:hover { background: #334155; border-color: #475569; }
  #uiu-panel .uiu-history { display:none; margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }
  #uiu-panel header.uiu-show-history + .uiu-body .uiu-history { display:block; }
  #uiu-panel .uiu-history .uiu-controls > span { font-size: 16px; font-weight: 600;}
  #uiu-panel .uiu-history .uiu-list { max-height: 240px; }
  #uiu-panel .uiu-history .uiu-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; }
  #uiu-panel .uiu-history .uiu-row .uiu-ops { display:flex; gap:6px; }
  #uiu-panel .uiu-history .uiu-row .uiu-name { display:block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #uiu-panel .uiu-hint { font-size: 11px; opacity:.85; margin-top:6px; }
  /* Settings container toggling */
  #uiu-panel .uiu-settings-container { display:none; margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }
  #uiu-panel header.uiu-show-settings + .uiu-body .uiu-settings-container { display:block; }
  #uiu-panel .uiu-settings .uiu-controls > span { font-size: 16px; font-weight: 600;}
  #uiu-panel .uiu-settings .uiu-controls > .uiu-subtitle { font-size: 13px; font-weight: 600; }
  #uiu-panel .uiu-settings .uiu-settings-list { margin-top:6px; max-height: 240px; overflow-y:auto; overflow-x:hidden; }
  #uiu-panel .uiu-settings .uiu-settings-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; font-size: 12px; flex-wrap: nowrap; }
  #uiu-panel .uiu-settings .uiu-settings-row .uiu-settings-item { flex:1; display:flex; align-items:center; gap:6px; min-width:0; }
  #uiu-panel .uiu-settings .uiu-settings-row .uiu-settings-item input[type="text"] { flex:1; min-width:0; }
  #uiu-panel .uiu-settings .uiu-settings-row .uiu-settings-item select { flex:0 0 auto; }
  #uiu-panel .uiu-settings .uiu-settings-row .uiu-ops { display:flex; gap:6px; flex-shrink:0; white-space:nowrap; }
  #uiu-drop { position: fixed; inset: 0; background: rgba(37,99,235,.12); border: 2px dashed #2563eb; display:none; align-items:center; justify-content:center; z-index: 999998; color:#2563eb; font-size: 18px; font-weight: 600; pointer-events:none; }
  #uiu-drop.show { display:flex; }
  .uiu-insert-btn { cursor:pointer; }
  .uiu-insert-btn.uiu-default { font-size: 12px; padding: 4px 8px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; cursor:pointer; }
  /* Hover effects for all buttons */
  #uiu-panel button { transition: background-color .12s ease, box-shadow .12s ease, transform .06s ease, opacity .12s ease, border-color .12s ease; }
  #uiu-panel button:hover { background:#334155; border-color:#475569; box-shadow: 0 0 0 1px #475569 inset; transform: translateY(-0.5px); }
  #uiu-panel button.uiu-primary:hover { background:#1d4ed8; border-color:#1e40af; }
  #uiu-panel button:active { transform: translateY(0); }
  /* Disabled style for proxy selector */
  #uiu-panel select:disabled { opacity:.55; cursor:not-allowed; filter: grayscale(80%); background:#111827; color:#9ca3af; border-color:#475569; }
  /* Custom Formats layout */
  #uiu-panel .uiu-formats { margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }
  #uiu-panel .uiu-formats .uiu-controls > span { font-size: 16px; font-weight: 600; }
  #uiu-panel .uiu-formats .uiu-controls > .uiu-subtitle { font-size: 13px; font-weight: 600; }
  #uiu-panel .uiu-formats .uiu-formats-list { margin-top:6px; max-height: 200px; overflow-y:auto; overflow-x:hidden; }
  #uiu-panel .uiu-formats .uiu-formats-row { display:grid; grid-template-columns: 1fr 2fr 180px; align-items:center; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; }
  #uiu-panel .uiu-formats .uiu-formats-row .uiu-ops { display:flex; gap:6px; justify-content:flex-end; }
  #uiu-panel .uiu-formats .uiu-formats-row:not(.uiu-editing) .uiu-fmt-name, #uiu-panel .uiu-formats .uiu-formats-row:not(.uiu-editing) .uiu-fmt-template { display:block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #uiu-panel .uiu-formats .uiu-formats-row.uiu-editing .uiu-fmt-name, #uiu-panel .uiu-formats .uiu-formats-row.uiu-editing .uiu-fmt-template { overflow: visible; text-overflow: clip; white-space: normal; }
  #uiu-panel .uiu-formats .uiu-form-add { display:grid; grid-template-columns: 1fr 2fr 180px; align-items:center; gap:8px; }
  #uiu-panel .uiu-formats .uiu-formats-row input[type="text"] { width:100%; }
  #uiu-panel .uiu-formats .uiu-form-add input[type="text"] { width:100%; }
  #uiu-panel .uiu-formats .uiu-form-add button { justify-self: end; }
  #uiu-panel .uiu-formats .uiu-formats-header { font-weight: 600; color:#e5e7eb; }
  #uiu-panel .uiu-formats .uiu-form-add .uiu-fmt-name, #uiu-panel .uiu-formats .uiu-form-add .uiu-fmt-template { display:block; min-width:0; }
  #uiu-panel .uiu-formats .uiu-format-example-row { padding-top:4px; border-bottom: none; }
  #uiu-panel .uiu-formats .uiu-format-example-row .uiu-fmt-template { font-size:12px; color:#cbd5e1; white-space: normal; overflow: visible; text-overflow: clip; }
  `
GM_addStyle(css)

async function loadHistory() {
  return (await getValue<any[]>(HISTORY_KEY, [])) || []
}

async function saveHistory(list) {
  await setValue(HISTORY_KEY, list.slice(0, MAX_HISTORY))
}

async function addToHistory(entry) {
  const list = await loadHistory()
  list.unshift(entry)
  await saveHistory(list)
}

function basename(name) {
  const n = (name || '').trim()
  if (!n) return t('default_image_name')
  return n.replace(/\.[^.]+$/, '')
}

async function formatText(link, name, fmt) {
  const alt = basename(name)
  // Custom format support: if fmt matches a user-defined template name
  try {
    const formats = await getCustomFormats()
    const custom = formats.find((cf) => cf.name === fmt)
    if (custom) {
      return tpl(custom.template, { link, name: alt })
    }
  } catch {}

  switch (fmt) {
    case 'html': {
      return `<img src="${link}" alt="${alt}" />`
    }

    case 'bbcode': {
      return `[img]${link}[/img]`
    }

    case 'link': {
      return link
    }

    default: {
      return `![${alt}](${link})`
    }
  }
}

async function applyProxyForCurrentSite(
  url: string,
  providerKey?: string,
  originalName?: string,
  defaultUrl?: string,
  secondary?: {
    url: string
    providerKey?: string
  }
) {
  let useWebp = false
  try {
    useWebp = await getWebpEnabled()
  } catch {}

  const proxy = await getProxy()

  if (secondary) {
    return applyProxyForDualHost(
      {
        url,
        providerKey,
        originalName,
      },
      secondary,
      {
        proxy,
        useWebp,
      }
    )
  }

  return applyProxy(url, {
    providerKey,
    originalName,
    proxy,
    defaultUrl,
    useWebp,
  })
}

async function gmRequest(opts: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers?: Record<string, string>
  data?: string | ArrayBuffer | FormData
  responseType?: 'text' | 'json'
}): Promise<any> {
  const req: ((details: any) => void) | undefined =
    typeof GM !== 'undefined' && (GM as any)?.xmlHttpRequest
      ? (GM as any).xmlHttpRequest
      : typeof GM_xmlhttpRequest === 'undefined'
        ? undefined
        : GM_xmlhttpRequest
  if (!req) throw new Error('GM.xmlHttpRequest unavailable')
  return new Promise<any>((resolve, reject) => {
    try {
      req({
        method: opts.method || 'GET',
        url: opts.url,
        headers: opts.headers,
        data: opts.data,
        responseType: opts.responseType || 'text',
        onload(res: any) {
          try {
            if ((opts.responseType || 'text') === 'json') {
              resolve(res.response ?? JSON.parse(res.responseText || '{}'))
            } else {
              resolve(res.responseText)
            }
          } catch (error) {
            reject(error as Error)
          }
        },
        onerror() {
          reject(new Error(t('error_network')))
        },
        ontimeout() {
          reject(new Error(t('error_network')))
        },
      })
    } catch (error) {
      reject(error as Error)
    }
  })
}

async function getMjjAuthToken() {
  const html = await gmRequest({ url: 'https://mjj.today/upload' })
  const m = /PF\.obj\.config\.auth_token\s*=\s*["']([A-Za-z\d]+)["']/.exec(
    String(html || '')
  )
  if (!m || !m[1]) throw new Error(t('error_network'))
  return m[1]
}

async function uploadToMjj(file) {
  if (Math.floor(file.size / 1000) > 10_000) {
    throw new Error('10mb limit')
  }

  const token = await getMjjAuthToken()
  const formData = new FormData()
  formData.append('source', file)
  formData.append('type', 'file')
  formData.append('action', 'upload')
  formData.append('timestamp', String(Date.now()))
  formData.append('auth_token', token)
  formData.append('expiration', '')
  formData.append('nsfw', '0')
  const data = await gmRequest({
    method: 'POST',
    url: 'https://mjj.today/json',
    data: formData,
    responseType: 'json',
  })
  if (data?.status_code === 200 && data?.image?.url) {
    const url = String(data.image.url)
    return url.includes('i.mji.rip')
      ? url.replace('i.mji.rip', 'i.mij.rip')
      : url
  }

  throw new Error(t('error_upload_failed'))
}

async function getImgbbAuthToken() {
  const html = await gmRequest({ url: 'https://imgbb.com/upload' })
  const m = /PF\.obj\.config\.auth_token\s*=\s*["']([A-Za-z\d]+)["']/.exec(
    String(html || '')
  )
  if (!m || !m[1]) throw new Error(t('error_network'))
  return m[1]
}

async function uploadToImgbb(file) {
  if (Math.floor(file.size / 1000) > 32_000) {
    throw new Error('32mb limit')
  }

  const token = await getImgbbAuthToken()
  const formData = new FormData()
  formData.append('source', file)
  formData.append('type', 'file')
  formData.append('action', 'upload')
  formData.append('timestamp', String(Date.now()))
  formData.append('auth_token', token)
  formData.append('expiration', '')
  formData.append('nsfw', '0')
  const data = await gmRequest({
    method: 'POST',
    url: 'https://imgbb.com/json',
    data: formData,
    responseType: 'json',
  })
  if (data?.status_code === 200 && data?.image?.url) {
    return String(data.image.url)
  }

  throw new Error(t('error_upload_failed'))
}

async function uploadToPhotoLily(file) {
  const formData = new FormData()
  formData.append('file', file)
  const data = await gmRequest({
    method: 'POST',
    url: 'https://photo.lily.lat/upload',
    data: formData,
    responseType: 'json',
  })
  if (Array.isArray(data) && data[0]?.src) {
    const src = String(data[0].src)
    return /^https?:\/\//i.test(src) ? src : `https://photo.lily.lat${src}`
  }

  throw new Error(t('error_upload_failed'))
}

const HOST_111666_TOKENS = [
  '6Fqz4pDz949bhzMOvUj2Ytgiy17ARsWz',
  'FcyNm0KvmHx73qOcwbm0uZ89rXOQFuIT',
  'yHF9Br2kXZqEC0sQR2hOSKlGv0A6hyMU',
  'B56UgFSDhGeXpK1WSNBd6NakwuWHEmGP',
  'qFxuIgXxCTOY0cj5VDiZPZW7uwPVbT7L',
]

async function uploadTo111666Best(file) {
  const tokens = [...HOST_111666_TOKENS]
  for (let i = tokens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tokens[i], tokens[j]] = [tokens[j], tokens[i]]
  }

  let lastError
  for (const token of tokens) {
    const formData = new FormData()
    formData.append('payload', file)
    try {
      const data = await gmRequest({
        method: 'POST',
        url: 'https://i.111666.best/image',
        headers: { 'auth-token': token },
        data: formData,
        responseType: 'json',
      })
      if (data?.ok && data?.src) {
        const src = String(data.src)
        return /^https?:\/\//i.test(src) ? src : `https://i.111666.best${src}`
      }

      lastError = new Error(t('error_upload_failed'))
    } catch (error) {
      lastError = error
    }
  }

  throw (lastError as Error) || new Error(t('error_upload_failed'))
}

async function uploadToAppinn(file) {
  if (Math.floor(file.size / 1000) > 20_000) {
    throw new Error('20mb limit')
  }

  const filename = file?.name || `file_${Date.now()}`
  const formData = new FormData()
  formData.append('filename', filename)
  formData.append('file', file)
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(APPINN_UPLOAD_PARAMS))
    qs.append(k, String(v))

  const uploadUrl = `${APPINN_UPLOAD_ENDPOINT}?${qs.toString()}`
  const data = await gmRequest({
    method: 'POST',
    url: uploadUrl,
    data: formData,
    responseType: 'json',
  })
  if (Array.isArray(data) && data[0]?.src) {
    const src = String(data[0].src)
    const abs = /^https?:\/\//i.test(src)
      ? src
      : new URL(src, APPINN_UPLOAD_ENDPOINT).href
    return abs
  }

  throw new Error(t('error_upload_failed'))
}

async function getSkyimgCsrfToken() {
  const data = await gmRequest({
    url: 'https://skyimg.net/csrf-token',
    responseType: 'json',
  })
  const token = data?.csrfToken
  if (!token) throw new Error(t('error_network'))
  return String(token)
}

async function uploadToSkyimg(file, webp = false) {
  if (Math.floor(file.size / 1000) > 100_000) {
    throw new Error('100mb limit')
  }

  const token = await getSkyimgCsrfToken()
  const formData = new FormData()
  formData.append('file', file)
  const data = await gmRequest({
    method: 'POST',
    url: webp
      ? 'https://skyimg.net/upload?webp=true'
      : 'https://skyimg.net/upload',
    headers: {
      origin: 'https://skyimg.net',
      'x-csrf-token': token,
      'x-sync-token': webp
        ? '47e9f97c4c3ea304ef8ff4f232e27c7095d4c1cd7f6930860b083affd03ac831'
        : 'f68b6cc9282eac325398df4bb608ee14e28219533b350ba3c911abdd3742681a',
    },
    data: formData,
    responseType: 'json',
  })

  const first = Array.isArray(data) && data.length > 0 ? data[0] : data
  const rawUrl =
    first?.url ||
    first?.thumbnail ||
    first?.link ||
    first?.src ||
    data?.url ||
    data?.data?.url
  if (rawUrl) {
    const src = String(rawUrl).trim().replaceAll(/`+/g, '')
    const abs = /^https?:\/\//i.test(src)
      ? src
      : new URL(src.replace(/^\//, ''), 'https://skyimg.net/').href
    return abs
  }

  throw new Error(t('error_upload_failed'))
}

async function uploadToImgur(file) {
  // Shuffle Client-ID list to ensure a different ID on each retry
  const ids = [...IMGUR_CLIENT_IDS]
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }

  let lastError
  for (const id of ids) {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const data = await gmRequest({
        method: 'POST',
        url: 'https://api.imgur.com/3/upload',
        headers: { Authorization: `Client-ID ${id}` },
        data: formData,
        responseType: 'json',
      })
      if (data?.success && data?.data?.link) {
        return data.data.link
      }

      lastError = new Error(t('error_upload_failed'))
    } catch (error) {
      lastError = error
    }
  }

  throw (lastError as Error) || new Error(t('error_upload_failed'))
}

async function uploadToTikolu(file) {
  // 8mb size limit (server also checks)
  if (Math.floor(file.size / 1000) > 8000) {
    throw new Error('8mb limit')
  }

  const formData = new FormData()
  formData.append('upload', 'true')
  formData.append('file', file)
  const data = await gmRequest({
    method: 'POST',
    url: 'https://tikolu.net/i/',
    data: formData,
    responseType: 'json',
  })
  if (data?.status === 'uploaded' && data?.id) {
    return `https://tikolu.net/i/${data.id}`
  }

  throw new Error(t('error_upload_failed'))
}

const STARDOTS_ENDPOINT = 'https://api.stardots.io'
async function uploadToStarDots(file) {
  const apiKey = STARDOTS_CONFIG.key
  const apiSecret = STARDOTS_CONFIG.secret
  const bucket = STARDOTS_CONFIG.bucket

  if (!apiKey || !apiSecret) {
    alert(t('stardots_set_config_tips'))
    throw new Error('Missing credentials')
  }

  const timestamp = parseInt((Date.now() / 1000).toString()).toString()
  const nonce = `${Date.now()}${Math.random().toString(16)}`
    .replace('.', '')
    .slice(0, 20)

  const stringToSign = `${timestamp}|${apiSecret}|${nonce}`
  const signature = md5Encode(stringToSign).toUpperCase()

  console.log(timestamp, nonce, stringToSign, signature)

  const form = new FormData()
  form.append('file', file)
  form.append('filename', file.name)
  form.append('space', bucket)

  try {
    const data = await gmRequest({
      method: 'PUT',
      url: `${STARDOTS_ENDPOINT}/openapi/file/upload`,
      headers: {
        'x-stardots-key': apiKey,
        'x-stardots-nonce': nonce,
        'x-stardots-timestamp': timestamp,
        'x-stardots-sign': signature,
        'x-stardots-assistant-version': 'upload-by-utags',
      },
      data: form,
      responseType: 'json',
    })
    if (data.success) {
      return data.data.url
    }
    throw new Error(`${data.message}(${data.requestId})`)
  } catch (e) {
    console.log('stardots upload error', e)
    throw new Error(t('error_upload_failed'))
  }
}

async function uploadImageToHost(file, host: string) {
  if (host === 'mock' || host === 'mock2') {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    const samples = [
      'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176',
      'https://images.unsplash.com/photo-1526045612212-70caf35c14df',
    ]
    const idx = Math.floor(Math.random() * samples.length)
    return samples[idx]
  }

  if (host === 'skyimg') return uploadToSkyimg(file, false)
  if (host === 'skyimg_webp') return uploadToSkyimg(file, true)
  if (host === 'tikolu') return uploadToTikolu(file)
  if (host === 'mjj') return uploadToMjj(file)
  if (host === 'imgbb') return uploadToImgbb(file)
  if (host === 'appinn') return uploadToAppinn(file)
  if (host === 'photo_lily') return uploadToPhotoLily(file)
  if (host === '111666_best') return uploadTo111666Best(file)
  if (host === 'stardots') return uploadToStarDots(file)
  // Default
  return uploadToImgur(file)
}

async function uploadImage(file) {
  const host = await getHost()
  return uploadImageToHost(file, host)
}

// Track last visited editable element to support insertion after focus is lost
let lastEditableEl:
  | HTMLTextAreaElement
  | HTMLInputElement
  | HTMLElement
  | undefined
let lastEditableFrame: Window | undefined
// Helper: get deepest active element across Shadow DOM and same-origin iframes
function getDeepActiveElement(): Element | undefined {
  let el = document.activeElement
  try {
    // Traverse into open shadow roots
    while (el && el.shadowRoot && el.shadowRoot.activeElement) {
      el = el.shadowRoot.activeElement
    }

    // Traverse into same-origin iframes
    while (
      el &&
      el instanceof HTMLIFrameElement &&
      el.contentDocument &&
      el.contentDocument.activeElement
    ) {
      el = el.contentDocument.activeElement
    }
  } catch {}

  return el || undefined
}

// Helper: check if node is inside our UI panel (including its Shadow DOM)
function isInsideUIPanel(node: Node | undefined): boolean {
  try {
    const host = document.querySelector('#uiu-panel')
    if (!host || !node) return false
    if (host === node) return true
    if (host.contains(node)) return true
    const root = host.shadowRoot
    return root ? root.contains(node) : false
  } catch {}

  return false
}

function isTextInput(el: unknown): el is HTMLInputElement {
  if (!(el instanceof HTMLInputElement)) return false
  const type = (el.type || '').toLowerCase()
  return (
    type === 'text' ||
    type === 'search' ||
    type === 'url' ||
    type === 'email' ||
    type === 'tel'
  )
}

function isEditable(
  el: unknown
): el is HTMLTextAreaElement | HTMLInputElement | HTMLElement {
  return (
    el instanceof HTMLTextAreaElement ||
    isTextInput(el) ||
    (el instanceof HTMLElement && el.isContentEditable)
  )
}

function isOverEditableOrPanel(target: EventTarget | undefined): boolean {
  if (!(target instanceof Node)) return false
  if (isInsideUIPanel(target)) return true
  let el =
    target instanceof Element
      ? target
      : target.parentNode instanceof Element
        ? target.parentNode
        : undefined
  while (el) {
    if (isEditable(el)) return true
    el = el.parentElement || undefined
  }

  return false
}

function initPasteUpload(initialEnabled = true) {
  let pasteHandler: ((event: ClipboardEvent) => void) | undefined

  const enablePaste = () => {
    if (pasteHandler) return
    pasteHandler = (event) => {
      const cd = event.clipboardData
      if (!cd) return
      const list: File[] = []
      const seen = new Set<string>()
      const addIfNew = (f: File) => {
        const sig = `${f.name}|${f.size}|${f.type}|${f.lastModified || 0}`
        if (!seen.has(sig)) {
          seen.add(sig)
          list.push(f)
        }
      }

      const items = cd.items ? Array.from(cd.items) : []
      for (const i of items) {
        if (i && i.type && i.type.includes('image')) {
          const f = i.getAsFile?.()
          if (f) addIfNew(f)
        }
      }

      const files = cd.files ? Array.from(cd.files) : []
      for (const f of files) {
        if (f && f.type && f.type.includes('image')) addIfNew(f)
      }

      if (list.length > 0) {
        event.preventDefault()
        event.stopPropagation()
        const detail = { files: list }
        if (isTopFrame()) {
          globalThis.dispatchEvent(
            new CustomEvent('iu:uploadFiles', { detail })
          )
        } else {
          try {
            globalThis.top?.postMessage(
              {
                type: 'iu:uploadFiles',
                detail,
              },
              '*'
            )
          } catch {}
        }
      }
    }

    document.addEventListener('paste', pasteHandler, true)
  }

  const disablePaste = () => {
    if (!pasteHandler) return
    document.removeEventListener('paste', pasteHandler, true)
    pasteHandler = undefined
  }

  if (initialEnabled) enablePaste()
  globalThis.addEventListener('beforeunload', () => {
    disablePaste()
  })

  return { enable: enablePaste, disable: disablePaste }
}

function initDragAndDrop(initialEnabled = true) {
  let drop: HTMLElement | undefined
  let dragoverHandler: ((event: DragEvent) => void) | undefined
  let dragleaveHandler: ((event: DragEvent) => void) | undefined
  let dropHandler: ((event: DragEvent) => void) | undefined
  let lastDragoverVisible = false
  let lastDragoverTarget: EventTarget | undefined

  const enableDrag = () => {
    if (!drop) {
      drop = createEl('div', { id: 'uiu-drop', text: t('drop_overlay') })
      if (drop) document.documentElement.append(drop)
    }

    if (!dragoverHandler) {
      dragoverHandler = (event) => {
        const dt = event.dataTransfer
        const types = dt?.types ? Array.from(dt.types) : []
        const hasFileType = types.includes('Files')
        const hasFileItem = dt?.items
          ? Array.from(dt.items).some((it) => it.kind === 'file')
          : false
        const firstTarget =
          typeof event.composedPath === 'function'
            ? event.composedPath()[0]
            : event.target || undefined

        if (firstTarget === lastDragoverTarget) {
          if (lastDragoverVisible) {
            event.preventDefault()
          }

          return
        }

        lastDragoverTarget = firstTarget

        const allowedTarget = isOverEditableOrPanel(firstTarget)
        const shouldShow = (hasFileType || hasFileItem) && allowedTarget

        if (shouldShow) {
          event.preventDefault()
        }

        if (shouldShow === lastDragoverVisible) return
        lastDragoverVisible = shouldShow

        if (shouldShow) {
          if (drop) drop.classList.add('show')
        } else if (drop) {
          drop.classList.remove('show')
        }
      }

      document.addEventListener('dragover', dragoverHandler)
    }

    if (!dragleaveHandler) {
      dragleaveHandler = (event) => {
        if (!drop) return
        const target = event.target
        if (target === document.documentElement || target === document.body) {
          lastDragoverVisible = false
          lastDragoverTarget = undefined
          drop.classList.remove('show')
        }
      }

      document.addEventListener('dragleave', dragleaveHandler)
    }

    if (!dropHandler) {
      dropHandler = (event) => {
        lastDragoverVisible = false
        lastDragoverTarget = undefined
        if (drop) drop.classList.remove('show')
        const firstTarget =
          typeof event.composedPath === 'function'
            ? event.composedPath()[0]
            : event.target || undefined
        const allowedTarget = isOverEditableOrPanel(firstTarget)
        if (!allowedTarget) return

        try {
          let el =
            firstTarget instanceof Element
              ? firstTarget
              : firstTarget instanceof Node && firstTarget.parentElement
                ? firstTarget.parentElement
                : undefined
          while (el) {
            if (isEditable(el)) {
              lastEditableEl = el
              lastEditableFrame = globalThis as unknown as Window
              break
            }

            el = el.parentElement || undefined
          }

          const files = event.dataTransfer?.files
          if (!files?.length) return
          const imgs = Array.from(files).filter((f) => f.type.includes('image'))
          if (imgs.length === 0) return
          event.preventDefault()
          event.stopPropagation()
          const detail = { files: imgs }
          if (isTopFrame()) {
            globalThis.dispatchEvent(
              new CustomEvent('iu:uploadFiles', { detail })
            )
          } else {
            globalThis.top?.postMessage(
              {
                type: 'iu:uploadFiles',
                detail,
              },
              '*'
            )
          }
        } catch {}
      }

      document.addEventListener('drop', dropHandler)
    }
  }

  const disableDrag = () => {
    if (dragoverHandler) {
      document.removeEventListener('dragover', dragoverHandler)
      dragoverHandler = undefined
    }

    if (dragleaveHandler) {
      document.removeEventListener('dragleave', dragleaveHandler)
      dragleaveHandler = undefined
    }

    if (dropHandler) {
      document.removeEventListener('drop', dropHandler)
      dropHandler = undefined
    }

    if (drop) {
      try {
        drop.remove()
      } catch {}

      drop = undefined
    }

    lastDragoverVisible = false
    lastDragoverTarget = undefined
  }

  if (initialEnabled) enableDrag()
  globalThis.addEventListener('beforeunload', () => {
    disableDrag()
  })

  return { enable: enableDrag, disable: disableDrag }
}

function findNearestEditableElement(
  from?: Element
): HTMLTextAreaElement | HTMLInputElement | HTMLElement | undefined {
  let parent = from?.parentElement
  while (parent) {
    const textarea = parent.querySelector('textarea')
    if (textarea instanceof HTMLTextAreaElement) return textarea

    const contentEditable = parent.querySelector(
      '[contenteditable],[contenteditable="true"],[contenteditable="plaintext-only"]'
    )
    if (
      contentEditable instanceof HTMLElement &&
      contentEditable.isContentEditable
    ) {
      return contentEditable
    }

    const input = parent.querySelector('input')
    if (input instanceof HTMLInputElement && isTextInput(input)) return input

    parent = parent.parentElement
  }

  return undefined
}

function handleSiteButtonClick(event: Event) {
  event.preventDefault()
  try {
    lastEditableFrame = globalThis as unknown as Window
    if (!lastEditableEl) {
      const target = event.currentTarget
      if (target instanceof HTMLElement) {
        const nearest = findNearestEditableElement(target)
        if (nearest) lastEditableEl = nearest
      }
    }

    requestOpenFilePicker()
  } catch {}
}

document.addEventListener(
  'focusin',
  (e) => {
    // Use deep active element to handle Shadow DOM editors
    const deepTarget =
      getDeepActiveElement() ||
      (typeof e.composedPath === 'function' ? e.composedPath()[0] : e.target)
    if (deepTarget && isEditable(deepTarget) && !isInsideUIPanel(deepTarget)) {
      lastEditableEl = deepTarget
      lastEditableFrame = globalThis as unknown as Window
      try {
        if (isTopFrame()) return
        globalThis.top?.postMessage({ type: 'uiu:focus-editable' }, '*')
      } catch {}
    }
  },
  true
)

// document.addEventListener(
//   'focusout',
//   () => {
//     try {
//       if (isTopFrame()) {
//         // lastEditableEl = undefined
//         // lastEditableFrame = undefined
//         return
//       }

//       globalThis.top?.postMessage({ type: 'uiu:blur-editable' }, '*')
//     } catch {}
//   },
//   true
// )

globalThis.addEventListener('message', async (event) => {
  const type = event.data?.type
  switch (type) {
    case 'uiu:insert-placeholder': {
      const ph = String(event.data?.placeholder || '')
      if (ph) insertIntoFocused(`\n${ph}\n`)
      break
    }

    case 'uiu:replace-placeholder': {
      const ph = String(event.data?.placeholder || '')
      const rep = String(event.data?.replacement || '')
      const el = getActiveEditableTarget()
      const ok = el ? replacePlaceholder(el, ph, rep) : false
      if (!ok && rep) insertIntoFocused(`\n${rep}\n`)
      break
    }

    case 'uiu:insert-text': {
      const txt = String(event.data?.text || '')
      if (txt) insertIntoFocused(`\n${txt}\n`)
      break
    }

    case 'uiu:stardots-save-config': {
      const { key, secret, bucket } = event.data.payload
      await setValue('stardots_key', key)
      await setValue('stardots_secret', secret)
      await setValue('stardots_bucket', bucket)
      break
    }
    case 'uiu:stardots-get-config': {
      const key = await getValue('stardots_key')
      const secret = await getValue('stardots_secret')
      const bucket = await getValue('stardots_bucket')
      const hostEl = document.querySelector('#uiu-panel')
      if (!hostEl) return
      const shadowRoot = hostEl.shadowRoot
      if (!shadowRoot) return
      const keyInput = shadowRoot.getElementById(
        'sd-api-key'
      ) as HTMLInputElement
      if (keyInput) {
        keyInput.value = key ?? ''
      }
      const secretInput = shadowRoot.getElementById(
        'sd-api-secret'
      ) as HTMLInputElement
      if (secretInput) {
        secretInput.value = secret ?? ''
      }
      const bucketInput = shadowRoot.getElementById(
        'sd-bucket'
      ) as HTMLInputElement
      if (bucketInput) {
        bucketInput.value = bucket ?? ''
      }
      STARDOTS_CONFIG = {
        key: key || '',
        secret: secret || '',
        bucket: bucket || '',
      }
      break
    }

    default: {
      break
    }
  }
})

function insertIntoFocused(text: string): boolean {
  let el = getDeepActiveElement()
  // Fallback to last editable target if current focus is not usable (or inside our panel)
  if (!isEditable(el) || isInsideUIPanel(el)) {
    el = lastEditableEl
    try {
      if (el instanceof HTMLElement) el.focus()
    } catch {}
  }

  if (!isEditable(el) || isInsideUIPanel(el)) return false
  try {
    if (el instanceof HTMLTextAreaElement || isTextInput(el)) {
      const start = el.selectionStart ?? el.value.length
      const end = el.selectionEnd ?? el.value.length
      const v = el.value
      el.value = v.slice(0, start) + text + v.slice(end)
      const bubbles = { bubbles: true }
      el.dispatchEvent(new Event('input', bubbles))
      el.dispatchEvent(new Event('change', bubbles))
      el.dispatchEvent(new KeyboardEvent('keydown', bubbles))
      el.dispatchEvent(new KeyboardEvent('keypress', bubbles))
      el.dispatchEvent(new KeyboardEvent('keyup', bubbles))
      return true
    }

    if (el instanceof HTMLElement && el.isContentEditable) {
      // Ensure caret is inside the element, fallback to end
      try {
        const sel = globalThis.getSelection()
        if (sel) {
          const range = document.createRange()
          range.selectNodeContents(el)
          range.collapse(false)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      } catch {}

      // eslint-disable-next-line @typescript-eslint/no-deprecated
      document.execCommand('insertText', false, text)
      return true
    }
  } catch {}

  return false
}

function copyAndInsert(text: string): void {
  try {
    GM_setClipboard(text)
  } catch {}

  insertIntoFocused(`\n${text}\n`)
}

async function handleCopyClick(it: any) {
  const fmt = await getFormat()
  const secondary = it.extra?.[0]
  const proxied = await applyProxyForCurrentSite(
    it.link,
    it.provider,
    it.name,
    undefined,
    secondary
      ? { url: secondary.link, providerKey: secondary.provider }
      : undefined
  )
  const out = await formatText(proxied, it.name || t('default_image_name'), fmt)

  if (
    lastEditableFrame &&
    lastEditableFrame !== (globalThis as unknown as Window)
  ) {
    try {
      GM_setClipboard(out)
      lastEditableFrame.postMessage({ type: 'uiu:insert-text', text: out }, '*')
    } catch {}
  } else {
    copyAndInsert(out)
  }
}

function getActiveEditableTarget():
  | HTMLTextAreaElement
  | HTMLInputElement
  | HTMLElement
  | undefined {
  let el = getDeepActiveElement()
  if (!isEditable(el) || isInsideUIPanel(el)) el = lastEditableEl
  return isEditable(el) && !isInsideUIPanel(el) ? el : undefined
}

function createUploadPlaceholder(name: string): string {
  const safe = String(name || t('default_image_name'))
  return `<!-- ${tpl(t('placeholder_uploading'), { name: safe })} -->`
}

function replacePlaceholder(el, placeholder, replacement) {
  if (!el || !placeholder) return false
  try {
    if (el instanceof HTMLTextAreaElement || isTextInput(el)) {
      el.focus()
      const v = el.value
      const idx = v.indexOf(placeholder)
      if (idx !== -1) {
        el.value =
          v.slice(0, idx) + replacement + v.slice(idx + placeholder.length)
        const bubbles = { bubbles: true }
        el.dispatchEvent(new Event('input', bubbles))
        el.dispatchEvent(new Event('change', bubbles))
        el.dispatchEvent(new KeyboardEvent('keydown', bubbles))
        el.dispatchEvent(new KeyboardEvent('keypress', bubbles))
        el.dispatchEvent(new KeyboardEvent('keyup', bubbles))
        return true
      }

      return false
    }

    if (el instanceof HTMLElement && el.isContentEditable) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let node
      while ((node = walker.nextNode())) {
        const pos = node.data.indexOf(placeholder)
        if (pos !== -1) {
          node.replaceData(pos, placeholder.length, replacement)
          return true
        }
      }

      return false
    }
  } catch {}

  return false
}

async function createPanel(): Promise<
  | {
      handleFiles: (files: File[]) => void
    }
  | undefined
> {
  if (!isTopFrame()) {
    return
  }

  const panel = createEl('div', { id: 'uiu-panel' })
  // Attach Shadow DOM and inject scoped styles (convert '#uiu-panel' selectors to ':host')
  const root = panel.attachShadow({ mode: 'open' })
  try {
    const styleEl = document.createElement('style')
    styleEl.textContent = css.replaceAll(/#uiu-panel\b/g, ':host')
    root.append(styleEl)
  } catch {}

  const header = createEl('header')
  header.append(createEl('span', { text: t('header_title') }))
  const actions = createEl('div', { class: 'uiu-actions' })
  const toggleHistoryBtn = createEl('button', {
    text: t('btn_history'),
    class: 'uiu-toggle-history',
  })
  toggleHistoryBtn.addEventListener('click', async () => {
    header.classList.toggle('uiu-show-history')
    await renderHistory()
    try {
      toggleHistoryBtn.setAttribute(
        'aria-pressed',
        header.classList.contains('uiu-show-history') ? 'true' : 'false'
      )
    } catch {}
  })
  const settingsBtn = createEl('button', {
    text: t('btn_settings'),
    class: 'uiu-toggle-settings',
  })
  settingsBtn.addEventListener('click', async () => {
    header.classList.toggle('uiu-show-settings')
    try {
      await refreshSettingsUI()
    } catch {}

    try {
      settingsBtn.setAttribute(
        'aria-pressed',
        header.classList.contains('uiu-show-settings') ? 'true' : 'false'
      )
    } catch {}
  })
  const closeBtn = createEl('button', { text: t('btn_close') })
  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none'
  })
  actions.append(toggleHistoryBtn)
  actions.append(settingsBtn)
  actions.append(closeBtn)
  header.append(actions)

  const body = createEl('div', { class: 'uiu-body' })
  const controls = createEl('div', {
    style: 'display:flex; flex-direction:column; gap:4px;',
  })

  const format = await getFormat()
  const formatSel = createEl('select')
  await buildFormatOptions(formatSel, format)
  formatSel.addEventListener('change', async () => {
    await setFormat(formatSel.value)
  })

  const host = await getHost()
  const hostSel = createEl('select', {
    style: 'border-left: 3px solid #3b82f6;',
  })
  buildHostOptions(hostSel, host)
  const secondaryHostValue = await getSecondaryHost()
  const secondaryHostSel = createEl('select', {
    style: 'border-left: 3px solid #a855f7;',
  })
  buildSecondaryHostOptions(secondaryHostSel, secondaryHostValue, host)

  hostSel.addEventListener('change', async () => {
    await setHost(hostSel.value)
  })
  secondaryHostSel.addEventListener('change', async () => {
    await setSecondaryHost(secondaryHostSel.value)
  })

  const proxy = await getProxy()
  const proxySel = createEl('select')
  buildProxyOptions(proxySel, proxy, Boolean(secondaryHostValue))

  const webpLabel = createEl('label')
  const webpChk = createEl('input', { type: 'checkbox' })
  try {
    webpChk.checked = await getWebpEnabled()
  } catch {}

  webpChk.disabled = proxy === 'none'

  proxySel.addEventListener('change', async () => {
    await setProxy(proxySel.value)
  })

  webpChk.addEventListener('change', async () => {
    await setWebpEnabled(Boolean(webpChk.checked))
  })
  webpLabel.append(webpChk)
  webpLabel.append(
    createEl('span', {
      text: t('toggle_webp_enabled'),
      style: 'margin-left:6px;',
    })
  )

  function openFilePicker() {
    const input = createEl('input', {
      type: 'file',
      accept: 'image/*',
      multiple: 'true',
      style: 'display:none',
    })
    input.addEventListener('change', () => {
      if (input.files?.length) handleFiles(Array.from(input.files))
    })
    input.click()
  }

  const selectBtn = createEl('button', {
    class: 'uiu-primary',
    text: t('btn_select_images'),
  })
  selectBtn.addEventListener('click', openFilePicker)

  const progressEl = createEl('span', {
    class: 'uiu-progress',
    text: t('progress_initial'),
  })

  const row1 = createEl('div', { class: 'uiu-controls' })
  row1.append(formatSel)
  row1.append(hostSel)
  row1.append(secondaryHostSel)

  const row2 = createEl('div', { class: 'uiu-controls' })
  row2.append(proxySel)
  row2.append(webpLabel)

  const row3 = createEl('div', { class: 'uiu-controls' })
  row3.append(selectBtn)
  row3.append(progressEl)

  controls.append(row1)
  controls.append(row2)
  controls.append(row3)
  body.append(controls)

  const list = createEl('div', { class: 'uiu-list' })
  body.append(list)

  const hint = createEl('div', {
    class: 'uiu-hint',
    text: t('hint_text'),
  })
  body.append(hint)

  const history = createEl('div', { class: 'uiu-history' })
  body.append(history)

  // Parent container that groups Site Button Settings and Custom Formats
  const settingsContainer = createEl('div', {
    class: 'uiu-settings-container',
  })
  body.append(settingsContainer)

  const settings = createEl('div', { class: 'uiu-settings' })
  const settingsHeader = createEl('div', {
    class: 'uiu-controls',
    style: 'margin-bottom:8px;',
  })
  settingsHeader.append(createEl('span', { text: t('settings_section_title') }))
  settings.append(settingsHeader)
  const togglesRow = createEl('div', { class: 'uiu-controls' })
  const pasteLabel = createEl('label')
  const pasteChk = createEl('input', { type: 'checkbox' })
  try {
    pasteChk.checked = await getPasteEnabled()
  } catch {}

  pasteChk.addEventListener('change', async () => {
    await setPasteEnabled(Boolean(pasteChk.checked))
  })
  pasteLabel.append(pasteChk)
  pasteLabel.append(
    createEl('span', {
      text: t('toggle_paste_enabled'),
      style: 'margin-left:6px;',
    })
  )
  const dragLabel = createEl('label', { style: 'margin-left:12px;' })
  const dragChk = createEl('input', { type: 'checkbox' })
  try {
    dragChk.checked = await getDragAndDropEnabled()
  } catch {}

  dragChk.addEventListener('change', async () => {
    await setDragAndDropEnabled(Boolean(dragChk.checked))
  })
  dragLabel.append(dragChk)
  dragLabel.append(
    createEl('span', {
      text: t('toggle_drag_enabled'),
      style: 'margin-left:6px;',
    })
  )
  togglesRow.append(pasteLabel)
  togglesRow.append(dragLabel)
  settings.append(togglesRow)
  const btnsSubHeader = createEl('div', {
    class: 'uiu-controls',
    style: 'margin-top:12px;border-top:2px solid #475569;padding-top:8px;',
  })
  btnsSubHeader.append(
    createEl('span', {
      class: 'uiu-subtitle',
      text: t('settings_site_buttons'),
    })
  )
  settings.append(btnsSubHeader)
  const settingsForm = createEl('div', { class: 'uiu-controls' })
  const selInput = createEl('input', {
    type: 'text',
    placeholder: t('placeholder_css_selector'),
  })
  const posSel = createEl('select')
  buildPositionOptions(posSel, undefined)
  const textInput = createEl('input', {
    type: 'text',
    placeholder: t('placeholder_button_content'),
  })
  textInput.value = t('insert_image_button_default')
  const saveBtn = createEl('button', { text: t('btn_save_and_insert') })
  saveBtn.addEventListener('click', async () => {
    await addSiteBtnSetting({
      selector: selInput.value,
      position: posSel.value,
      text: textInput.value,
    })

    selInput.value = ''
    buildPositionOptions(posSel, undefined)
    textInput.value = t('insert_image_button_default')
    await renderSettingsList()

    for (const el of document.querySelectorAll('.uiu-insert-btn')) el.remove()
    await applySiteButtons()
    try {
      await restartSiteButtonObserver()
    } catch {}
  })
  const removeBtn = createEl('button', { text: t('btn_remove_button_temp') })
  removeBtn.addEventListener('click', () => {
    for (const el of document.querySelectorAll('.uiu-insert-btn')) el.remove()
    try {
      if (siteBtnObserver) siteBtnObserver.disconnect()
    } catch {}
  })
  const clearBtn = createEl('button', { text: t('btn_clear_settings') })
  clearBtn.addEventListener('click', async () => {
    await setSiteBtnSettingsList([])
    await renderSettingsList()
    for (const el of document.querySelectorAll('.uiu-insert-btn')) el.remove()
    try {
      if (siteBtnObserver) siteBtnObserver.disconnect()
    } catch {}
  })
  const settingsList = createEl('div', { class: 'uiu-settings-list' })
  settings.append(settingsList)
  settingsForm.append(selInput)
  settingsForm.append(posSel)
  settingsForm.append(textInput)
  settingsForm.append(saveBtn)
  settingsForm.append(removeBtn)
  settingsForm.append(clearBtn)
  settings.append(settingsForm)
  settingsContainer.append(settings)

  // Custom Formats section (below Site Button Settings)
  const formats = createEl('div', { class: 'uiu-formats' })
  const formatsHeader = createEl('div', { class: 'uiu-controls' })
  formatsHeader.append(
    createEl('span', {
      class: 'uiu-subtitle',
      text: t('formats_section_title'),
    })
  )
  formats.append(formatsHeader)
  // Column headers: Name | Format | Actions
  const formatsColsHeader = createEl('div', {
    class: 'uiu-formats-row uiu-formats-header',
  })
  formatsColsHeader.append(
    createEl('span', { class: 'uiu-fmt-name', text: t('formats_col_name') })
  )
  formatsColsHeader.append(
    createEl('span', {
      class: 'uiu-fmt-template',
      text: t('formats_col_template'),
    })
  )
  formatsColsHeader.append(
    createEl('span', { class: 'uiu-ops', text: t('formats_col_ops') })
  )
  formats.append(formatsColsHeader)
  const formatsForm = createEl('div', { class: 'uiu-controls uiu-form-add' })
  const fnameInput = createEl('input', {
    type: 'text',
    placeholder: t('placeholder_format_name'),
  })
  const ftemplateInput = createEl('input', {
    type: 'text',
    placeholder: t('placeholder_format_template'),
  })
  const addFmtBtn = createEl('button', { text: t('btn_add_format') })
  addFmtBtn.addEventListener('click', async () => {
    const name = (fnameInput.value || '').trim()
    const tplStr = String(ftemplateInput.value || '')
    if (!name || !tplStr) return
    await upsertCustomFormat(name, tplStr)
    fnameInput.value = ''
    ftemplateInput.value = ''
    await renderFormatsList()
    try {
      await buildFormatOptions(formatSel, await getFormat())
    } catch {}
  })
  // Wrap inputs with the same column containers as list rows for alignment
  const addNameCol = createEl('span', { class: 'uiu-fmt-name' })
  addNameCol.append(fnameInput)
  const addTplCol = createEl('span', { class: 'uiu-fmt-template' })
  addTplCol.append(ftemplateInput)
  formatsForm.append(addNameCol)
  formatsForm.append(addTplCol)
  formatsForm.append(addFmtBtn)
  const formatsList = createEl('div', { class: 'uiu-formats-list' })
  formats.append(formatsList)
  formats.append(formatsForm)
  // Example row: align under Format column using same grid
  const formatsExampleRow = createEl('div', {
    class: 'uiu-formats-row uiu-format-example-row',
  })
  formatsExampleRow.append(
    createEl('span', { class: 'uiu-fmt-name', text: '' })
  )
  formatsExampleRow.append(
    createEl('span', {
      class: 'uiu-fmt-template',
      text: t('example_format_template'),
    })
  )
  formatsExampleRow.append(createEl('span', { class: 'uiu-ops', text: '' }))
  formats.append(formatsExampleRow)
  settingsContainer.append(formats)

  async function renderFormatsList() {
    formatsList.textContent = ''
    const list = await getCustomFormats()
    for (const cf of list) {
      const row = createEl('div', { class: 'uiu-formats-row' })
      const nameEl = createEl('span', {
        class: 'uiu-fmt-name',
        text: cf.name,
      })
      const tplEl = createEl('span', {
        class: 'uiu-fmt-template',
        text: cf.template,
      })
      const editBtn = createEl('button', { text: t('btn_edit') })
      editBtn.addEventListener('click', () => {
        row.textContent = ''
        row.classList.add('uiu-editing')
        const colName = createEl('span', {
          class: 'uiu-settings-item uiu-fmt-name',
        })
        const eName = createEl('input', { type: 'text' })
        eName.value = cf.name
        const colTpl = createEl('span', {
          class: 'uiu-settings-item uiu-fmt-template',
        })
        const eTpl = createEl('input', { type: 'text' })
        eTpl.value = cf.template
        colName.append(eName)
        colTpl.append(eTpl)
        const ops = createEl('span', { class: 'uiu-ops' })
        const updateBtn = createEl('button', { text: t('btn_update') })
        updateBtn.addEventListener('click', async () => {
          const newName = (eName.value || '').trim()
          const newTpl = String(eTpl.value || '')
          if (!newName || !newTpl) return
          if (newName !== cf.name) await removeCustomFormat(cf.name)
          await upsertCustomFormat(newName, newTpl)
          // Update current format selection if renamed
          try {
            if ((await getFormat()) === cf.name) await setFormat(newName)
          } catch {}

          await renderFormatsList()
          try {
            await buildFormatOptions(formatSel, await getFormat())
          } catch {}
        })
        const cancelBtn = createEl('button', { text: t('btn_cancel') })
        cancelBtn.addEventListener('click', async () => {
          await renderFormatsList()
        })
        ops.append(updateBtn)
        ops.append(cancelBtn)
        row.append(colName)
        row.append(colTpl)
        row.append(ops)
      })
      const delBtn = createEl('button', { text: t('btn_delete') })
      delBtn.addEventListener('click', async () => {
        await removeCustomFormat(cf.name)
        // Reset site format if current selection removed
        try {
          if ((await getFormat()) === cf.name) await setFormat(DEFAULT_FORMAT)
        } catch {}

        await renderFormatsList()
        try {
          await buildFormatOptions(formatSel, await getFormat())
        } catch {}
      })
      const ops = createEl('span', { class: 'uiu-ops' })
      ops.append(editBtn)
      ops.append(delBtn)
      row.append(nameEl)
      row.append(tplEl)
      row.append(ops)
      formatsList.append(row)
    }
  }

  async function renderSettingsList() {
    // Avoid Trusted Types violation: clear without using innerHTML
    settingsList.textContent = ''
    const listData = await getSiteBtnSettingsList()
    for (const [idx, cfg] of listData.entries()) {
      const row = createEl('div', { class: 'uiu-settings-row' })
      const info = createEl('span', {
        class: 'uiu-settings-item',
        text: `${cfg.selector} [${cfg.position || DEFAULT_BUTTON_POSITION}] - ${cfg.text || t('insert_image_button_default')}`,
      })
      const editBtn = createEl('button', { text: t('btn_edit') })
      editBtn.addEventListener('click', () => {
        // Avoid Trusted Types violation: clear without using innerHTML
        row.textContent = ''
        row.classList.add('uiu-editing')
        const fields = createEl('span', { class: 'uiu-settings-item' })
        const eSel = createEl('input', { type: 'text' })
        eSel.value = cfg.selector || ''
        const ePos = createEl('select')
        buildPositionOptions(ePos, cfg.position)
        const eText = createEl('input', { type: 'text' })
        eText.value = cfg.text || t('insert_image_button_default')
        fields.append(eSel)
        fields.append(ePos)
        fields.append(eText)
        const ops = createEl('span', { class: 'uiu-ops' })
        const updateBtn = createEl('button', { text: t('btn_update') })
        updateBtn.addEventListener('click', async () => {
          await updateSiteBtnSetting(idx, {
            selector: eSel.value,
            position: ePos.value,
            text: eText.value,
          })
          await renderSettingsList()
          for (const el of document.querySelectorAll('.uiu-insert-btn'))
            el.remove()
          await applySiteButtons()
          try {
            await restartSiteButtonObserver()
          } catch {}
        })
        const cancelBtn = createEl('button', { text: t('btn_cancel') })
        cancelBtn.addEventListener('click', async () => {
          await renderSettingsList()
        })
        ops.append(updateBtn)
        ops.append(cancelBtn)
        row.append(fields)
        row.append(ops)
      })
      const delBtn = createEl('button', { text: t('btn_delete') })
      delBtn.addEventListener('click', async () => {
        await removeSiteBtnSetting(idx)
        await renderSettingsList()
        for (const el of document.querySelectorAll('.uiu-insert-btn'))
          el.remove()
        await applySiteButtons()
        try {
          await restartSiteButtonObserver()
        } catch {}
      })
      row.append(info)
      const ops = createEl('span', { class: 'uiu-ops' })
      ops.append(editBtn)
      ops.append(delBtn)
      row.append(ops)
      settingsList.append(row)
    }
  }

  async function refreshSettingsUI() {
    selInput.value = ''
    buildPositionOptions(posSel, undefined)
    textInput.value = t('insert_image_button_default')
    await renderSettingsList()
    try {
      fnameInput.value = ''
      ftemplateInput.value = ''
      await renderFormatsList()
    } catch {}
  }

  // Render into Shadow DOM root
  root.append(header)
  root.append(body)
  panel.style.display = 'none'
  document.documentElement.append(panel)

  // initialize pressed state
  try {
    toggleHistoryBtn.setAttribute('aria-pressed', 'false')
    settingsBtn.setAttribute('aria-pressed', 'false')
  } catch {}

  const showPanel = () => {
    panel.style.display = 'block'
    // Move to last element to ensure it's on top
    document.documentElement.append(panel)
  }

  globalThis.addEventListener('uiu:request-open-file-picker', () => {
    showPanel()
    try {
      openFilePicker()
    } catch {}
  })

  globalThis.addEventListener('message', async (event) => {
    const type = event.data?.type
    switch (type) {
      case 'iu:uploadFiles': {
        if (!isTopFrame()) break
        try {
          lastEditableFrame = event.source as Window
          const detail = event.data?.detail
          globalThis.dispatchEvent(
            new CustomEvent('iu:uploadFiles', { detail })
          )
        } catch {}

        break
      }

      case 'uiu:request-open-file-picker': {
        lastEditableFrame = event.source as Window
        globalThis.dispatchEvent(new CustomEvent(type))
        break
      }

      case 'uiu:focus-editable': {
        lastEditableFrame = event.source as Window
        break
      }

      case 'uiu:blur-editable': {
        if (lastEditableFrame === (event.source as Window)) {
          // lastEditableEl = undefined
          // lastEditableFrame = undefined
        }

        break
      }

      default: {
        break
      }
    }
  })

  type QueueItem = {
    file: File
    placeholder: string | undefined
    targetEl: Element | undefined
    targetFrame?: Window
  }

  const queue: QueueItem[] = []
  let running = 0
  let done = 0
  let total = 0
  const CONCURRENCY = 3

  function updateProgress() {
    progressEl.textContent = tpl(t('progress_done'), { done, total })
  }

  function addLog(text) {
    list.prepend(createEl('div', { class: 'uiu-log-item', text }))
  }

  async function processQueue() {
    while (running < CONCURRENCY && queue.length > 0) {
      const item = queue.shift()!
      running++
      addLog(`${t('log_uploading')}${item.file.name}`)
      try {
        const host = await getHost()
        const secondaryHost = await getSecondaryHost()
        const hasSecondaryHost = Boolean(
          secondaryHost && secondaryHost !== host
        )

        let primaryLink = ''
        let secondaryLink: string | undefined

        if (hasSecondaryHost) {
          const [primaryResult, secondaryResult] = await Promise.allSettled([
            uploadImageToHost(item.file, host),
            uploadImageToHost(item.file, secondaryHost),
          ])

          if (primaryResult.status === 'fulfilled') {
            primaryLink = primaryResult.value
            addLog(
              `${t('log_success')} [1/2] ${item.file.name} → ${primaryLink}（${t(
                'host_' + host
              )}）`
            )
          }

          if (primaryResult.status === 'rejected') {
            const error = primaryResult.reason
            addLog(
              `${t('log_failed')} [1/2] ${item.file.name}（${String(
                error?.message || error
              )}：${t('host_' + host)}）`
            )
          }

          if (secondaryResult.status === 'fulfilled') {
            secondaryLink = secondaryResult.value
            addLog(
              `${t('log_success')} [2/2] ${item.file.name} → ${secondaryLink}（${t(
                'host_' + secondaryHost
              )}）`
            )
          }

          if (secondaryResult.status === 'rejected') {
            const error = secondaryResult.reason
            addLog(
              `${t('log_failed')} [2/2] ${item.file.name}（${String(
                error?.message || error
              )}：${t('host_' + secondaryHost)}）`
            )
          }

          if (
            primaryResult.status === 'rejected' ||
            secondaryResult.status === 'rejected'
          ) {
            throw new Error(t('error_upload_failed'))
          }
        } else {
          primaryLink = await uploadImageToHost(item.file, host)
          addLog(`${t('log_success')}${item.file.name} → ${primaryLink}`)
        }

        const fmt = await getFormat()
        const proxied = await applyProxyForCurrentSite(
          primaryLink,
          host,
          item.file.name,
          undefined,
          secondaryLink
            ? { url: secondaryLink, providerKey: secondaryHost }
            : undefined
        )
        const out = await formatText(proxied, item.file.name, fmt)
        if (item.placeholder && item.targetEl && !item.targetFrame) {
          const ok = replacePlaceholder(
            item.targetEl,
            item.placeholder,
            `${out}`
          )
          if (!ok) copyAndInsert(out)
        } else if (item.placeholder && item.targetFrame) {
          try {
            item.targetFrame.postMessage(
              {
                type: 'uiu:replace-placeholder',
                placeholder: item.placeholder,
                replacement: `${out}`,
              },
              '*'
            )
          } catch {}
        } else {
          copyAndInsert(out)
        }

        const historyEntry: any = {
          link: primaryLink,
          name: item.file.name,
          ts: Date.now(),
          pageUrl: location.href,
          provider: host,
        }
        if (secondaryLink) {
          historyEntry.extra = [
            {
              link: secondaryLink,
              provider: secondaryHost,
            },
          ]
        }

        await addToHistory(historyEntry)
      } catch (error) {
        if (item.placeholder && item.targetEl && !item.targetFrame) {
          const failNote = `<!-- ${tpl(t('placeholder_upload_failed'), { name: item.file.name })} -->`
          try {
            replacePlaceholder(item.targetEl, item.placeholder, failNote)
          } catch {}
        } else if (item.placeholder && item.targetFrame) {
          const failNote = `<!-- ${tpl(t('placeholder_upload_failed'), { name: item.file.name })} -->`
          try {
            item.targetFrame.postMessage(
              {
                type: 'uiu:replace-placeholder',
                placeholder: item.placeholder,
                replacement: failNote,
              },
              '*'
            )
          } catch {}
        }

        addLog(
          `${t('log_failed')}${item.file.name}（${error?.message || error}）`
        )
      } finally {
        running--
        done++
        updateProgress()
      }
    }
  }

  function handleFiles(files: File[]): void {
    const imgs = files.filter((f) => f.type.includes('image'))
    if (imgs.length === 0) return
    total += imgs.length
    updateProgress()
    const targetEl = getActiveEditableTarget()
    const targetFrame =
      lastEditableFrame &&
      lastEditableFrame !== (globalThis as unknown as Window)
        ? lastEditableFrame
        : undefined
    for (const file of imgs) {
      let placeholder
      if (targetEl && !targetFrame) {
        try {
          targetEl.focus()
        } catch {}

        placeholder = createUploadPlaceholder(file.name)
        insertIntoFocused(`\n${placeholder}\n`)
      } else if (targetFrame) {
        placeholder = createUploadPlaceholder(file.name)
        try {
          targetFrame.postMessage(
            { type: 'uiu:insert-placeholder', placeholder },
            '*'
          )
        } catch {}
      }

      queue.push({ file, placeholder, targetEl, targetFrame })
    }

    void processQueue()
  }

  async function renderHistory() {
    if (!header.classList.contains('uiu-show-history')) return

    history.textContent = ''
    const historyControls = createEl('div', { class: 'uiu-controls' })
    const historyItems = await loadHistory()
    historyControls.append(
      createEl('span', {
        text: tpl(t('btn_history_count'), { count: historyItems.length }),
      })
    )
    const clearBtn = createEl('button', { text: t('btn_clear_history') })
    clearBtn.addEventListener('click', async () => {
      await saveHistory([])
      await renderHistory()
    })
    historyControls.append(clearBtn)
    history.append(historyControls)

    const hoverPreviewWrap = createEl('div', {
      style:
        'position:absolute;left:12px;top:8px;z-index:50;padding:4px;background:#020617;border:1px solid #475569;border-radius:8px;box-shadow:0 10px 40px rgba(15,23,42,.8);pointer-events:none;display:none;',
    })
    const hoverPreviewImg = createEl('img', {
      style:
        'max-width:256px;max-height:256px;object-fit:contain;display:block;border-radius:4px;',
    }) as HTMLImageElement
    hoverPreviewWrap.append(hoverPreviewImg)
    body.append(hoverPreviewWrap)

    const listWrap = createEl('div', { class: 'uiu-list' })
    for (const it of historyItems) {
      const row = createEl('div', { class: 'uiu-row' })

      const secondary = it.extra?.[0]
      const previewUrl = await applyProxyForCurrentSite(
        it.link,
        it.provider,
        it.name,
        undefined,
        secondary
          ? { url: secondary.link, providerKey: secondary.provider }
          : undefined
      )
      const preview = createEl('img', {
        src: previewUrl,
        loading: 'lazy',
        style:
          'width:72px;height:72px;object-fit:cover;border-radius:4px;border:1px solid #334155;',
      })
      preview.addEventListener('mouseenter', () => {
        hoverPreviewImg.src = previewUrl
        ;(hoverPreviewWrap as HTMLElement).style.display = 'block'
      })
      preview.addEventListener('mouseleave', () => {
        ;(hoverPreviewWrap as HTMLElement).style.display = 'none'
      })
      row.append(preview)

      const info = createEl('div', {
        style:
          'flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding:0 8px;',
      })
      info.append(
        createEl('span', {
          class: 'uiu-name',
          text: it.name || it.link,
          title: it.name || it.link,
        })
      )
      try {
        const primaryProviderKey = it.provider || 'imgur'
        const primaryProviderText = t('host_' + primaryProviderKey)
        const providerWrap = createEl('div', {
          style:
            'display:flex;flex-wrap:wrap;gap:4px;font-size:11px;color:#cbd5e1;',
        })
        providerWrap.append(
          createEl('span', {
            text: primaryProviderText,
            style:
              'border:1px solid #3b82f6;color:#93c5fd;border-radius:4px;padding:1px 6px;width:fit-content;',
          })
        )
        if (Array.isArray(it.extra)) {
          for (const extra of it.extra) {
            const key = extra?.provider || 'imgur'
            const text = t('host_' + key)
            providerWrap.append(
              createEl('span', {
                text,
                style:
                  'border:1px solid #a855f7;color:#e9d5ff;border-radius:4px;padding:1px 6px;width:fit-content;',
              })
            )
          }
        }

        info.append(providerWrap)
      } catch {}

      if (it.pageUrl) {
        let host = it.pageUrl
        try {
          host = new URL(it.pageUrl).hostname
        } catch {}

        const pageLink = createEl('a', {
          href: it.pageUrl,
          text: tpl(t('history_upload_page'), { host }),
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'color:#93c5fd;text-decoration:none;font-size:11px;',
        })
        info.append(pageLink)
      }

      row.append(info)

      const ops = createEl('div', { class: 'uiu-ops' })
      const copyBtn = createEl('button', { text: t('btn_copy') })
      copyBtn.addEventListener('click', () => {
        void handleCopyClick(it)
      })
      const openBtn = createEl('button', {
        text: t('btn_open'),
        style: 'border:1px solid #3b82f6;color:#93c5fd;',
      })
      // Primary provider fallback to secondary provider
      openBtn.addEventListener('click', async () => {
        const secondary = it.extra?.[0]
        const url = await applyProxyForCurrentSite(
          it.link,
          it.provider,
          it.name,
          undefined,
          secondary
            ? { url: secondary.link, providerKey: secondary.provider }
            : undefined
        )
        window.open(url, '_blank')
      })
      ops.append(copyBtn)
      ops.append(openBtn)
      if (Array.isArray(it.extra)) {
        for (const extra of it.extra) {
          if (!extra?.link) continue
          const openExtraBtn = createEl('button', {
            text: t('btn_open'),
            style: 'border:1px solid #a855f7;color:#e9d5ff;',
          })
          openExtraBtn.addEventListener('click', async () => {
            // Secondary provider fallback to primary provider
            const url = await applyProxyForCurrentSite(
              extra.link,
              extra.provider,
              it.name,
              undefined,
              { url: it.link, providerKey: it.provider }
            )
            window.open(url, '_blank')
          })
          ops.append(openExtraBtn)
        }
      }

      row.append(ops)
      listWrap.append(row)
    }

    history.append(listWrap)
  }

  void addValueChangeListener(
    HISTORY_KEY,
    (name, oldValue, newValue, remote) => {
      try {
        void renderHistory()
      } catch {}
    }
  )

  registerMenu(t('menu_open_panel'), () => {
    showPanel()
    try {
      toggleHistoryBtn.setAttribute(
        'aria-pressed',
        header.classList.contains('uiu-show-history') ? 'true' : 'false'
      )
      settingsBtn.setAttribute(
        'aria-pressed',
        header.classList.contains('uiu-show-settings') ? 'true' : 'false'
      )
    } catch {}
  })
  registerMenu(t('menu_select_images'), () => {
    showPanel()
    openFilePicker()
  })
  registerMenu(t('menu_settings'), async () => {
    showPanel()
    header.classList.add('uiu-show-settings')
    try {
      await refreshSettingsUI()
    } catch {}

    try {
      settingsBtn.setAttribute('aria-pressed', 'true')
      toggleHistoryBtn.setAttribute(
        'aria-pressed',
        header.classList.contains('uiu-show-history') ? 'true' : 'false'
      )
    } catch {}
  })

  void addValueChangeListener(
    SITE_SETTINGS_MAP_KEY,
    async (name, oldValue, newValue, remote) => {
      const oldMap = (oldValue as Record<string, any>) || {}
      const oldSite = oldMap[SITE_KEY] || {}
      const newMap = (newValue as Record<string, any>) || {}
      const s = newMap[SITE_KEY] || {}

      if (s.format && formatSel.value !== s.format) {
        formatSel.value = s.format
      }

      if (s.host && hostSel.value !== s.host) {
        hostSel.value = s.host
      }

      const storedSecondaryHost =
        typeof s.secondaryHost === 'string' ? s.secondaryHost : ''
      const secondaryHostValue =
        storedSecondaryHost && storedSecondaryHost !== hostSel.value
          ? storedSecondaryHost
          : ''

      buildSecondaryHostOptions(
        secondaryHostSel,
        secondaryHostValue,
        hostSel.value
      )

      buildProxyOptions(proxySel, s.proxy, Boolean(secondaryHostValue))

      webpChk.disabled = proxySel.value === 'none'

      const webpEnabled = s.webp === true
      if (webpChk.checked !== webpEnabled) {
        webpChk.checked = webpEnabled
      }

      const oldProxy = oldSite.proxy
      const newProxy = proxySel.value
      const oldWebpEnabled = oldSite.webp === true
      const proxyChanged = oldProxy !== newProxy
      const webpChanged = oldWebpEnabled !== webpEnabled

      if (proxyChanged || webpChanged) {
        try {
          await renderHistory()
        } catch {}
      }
    }
  )

  return { handleFiles }
}

;(async () => {
  try {
    await migrateLegacyStorage()
    await migrateToUnifiedSiteMap()
    await applyPresetConfig()

    const enabled = await getEnabled()

    if (enabled) {
      await restartSiteButtonObserver()
    }

    if (enabled) {
      const dragEnabled = await getDragAndDropEnabled()
      const pasteEnabled = await getPasteEnabled()
      const dragControls:
        | { enable: () => void; disable: () => void }
        | undefined = initDragAndDrop(dragEnabled)
      const pasteControls:
        | { enable: () => void; disable: () => void }
        | undefined = initPasteUpload(pasteEnabled)

      void addValueChangeListener(
        SITE_SETTINGS_MAP_KEY,
        (name, oldValue, newValue, remote) => {
          const oldMap = (oldValue as Record<string, any>) || {}
          const newMap = (newValue as Record<string, any>) || {}

          const oldDrag = oldMap[SITE_KEY]?.dragAndDropEnabled === true
          const newDrag = newMap[SITE_KEY]?.dragAndDropEnabled === true
          if (oldDrag !== newDrag) {
            if (newDrag) dragControls?.enable()
            else dragControls?.disable()
          }

          const oldPaste = oldMap[SITE_KEY]?.pasteEnabled === true
          const newPaste = newMap[SITE_KEY]?.pasteEnabled === true
          if (oldPaste !== newPaste) {
            if (newPaste) pasteControls?.enable()
            else pasteControls?.disable()
          }
        }
      )
    }

    if (enabled && isTopFrame() && !document.querySelector('#uiu-panel')) {
      const panelApi = await createPanel()
      if (panelApi) {
        const { handleFiles } = panelApi
        globalThis.addEventListener('iu:uploadFiles', (e: Event) => {
          const files = (e as CustomEvent<{ files?: File[] }>).detail?.files
          if (files?.length) handleFiles(files)
        })
      }
    }

    if (isTopFrame()) {
      registerMenu(
        enabled ? t('menu_disable_site') : t('menu_enable_site'),
        async () => {
          await setEnabled(!enabled)
          try {
            location.reload()
          } catch {}
        }
      )
    }

    //init while script loaded
    loadStarDotsConfig()
  } catch {}
})()
