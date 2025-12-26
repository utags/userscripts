// CONFIG: Preset site configuration
// - Key: site hostname without port; strip leading 'www.'
// - format: default text format for insertion
// - host: default image provider ('imgur' | 'tikolu')
// - proxy: default proxy for non-Imgur links ('none' | 'wsrv.nl')
// - buttons: site-specific button injection rules
const CONFIG = {
  // Examples: local preview page and common sites; add/remove as needed
  localhost: {
    enabled: true,
    pasteEnabled: true,
    dragAndDropEnabled: true,
    format: 'markdown',
    host: 'imgur',
    proxy: 'none',
    buttons: [{ selector: 'textarea', position: 'after', text: '插入图片' }],
  },
  'v2ex.com': {
    enabled: true,
    pasteEnabled: true,
    dragAndDropEnabled: true,
    format: 'link',
    host: 'imgur',
    proxy: 'none',
    buttons: [
      {
        selector: '#reply-box > div.cell.flex-one-row > div:nth-child(1)',
        position: 'inside',
        text: '<a style="padding-left: 10px;"> + 插入图片</a>',
      },
      {
        selector: '#tab-preview',
        position: 'after',
        text: '<a class="tab-alt"> + 插入图片</a>',
      },
      {
        selector: 'button[onclick^="previewTopicContent"]',
        position: 'before',
        text: `<button type="button" class="super normal button" style="margin-right: 12px;"><li class="fa fa-plus"></li> &nbsp;插入图片</button>`,
      },
    ],
  },
  'greasyfork.org': {
    enabled: true,
    pasteEnabled: true,
    dragAndDropEnabled: true,
    format: 'markdown',
    host: 'tikolu',
    proxy: 'wsrv.nl',
    buttons: [
      {
        selector: '.comment-screenshot-control',
        position: 'before',
      },
    ],
  },
  'nodeseek.com': {
    enabled: true,
    pasteEnabled: true,
    dragAndDropEnabled: true,
    format: 'markdown',
    host: 'tikolu',
    proxy: 'wsrv.nl',
    buttons: [
      {
        selector: '#editor-body > div.mde-toolbar > .toolbar-item:last-of-type',
        position: 'after',
        text: '插入图片',
      },
    ],
  },
  'deepflood.com': {
    enabled: true,
    pasteEnabled: true,
    dragAndDropEnabled: true,
    format: 'markdown',
    host: 'tikolu',
    proxy: 'wsrv.nl',
    buttons: [
      {
        selector: '#editor-body > div.mde-toolbar > .toolbar-item:last-of-type',
        position: 'after',
        text: '插入图片',
      },
    ],
  },
  '2libra.com': {
    enabled: true,
    pasteEnabled: true,
    dragAndDropEnabled: true,
    format: 'markdown',
    host: 'tikolu',
    proxy: 'wsrv.nl',
    buttons: [
      {
        selector:
          '.w-md-editor > div.w-md-editor-toolbar > ul:nth-child(1) > li:last-of-type',
        position: 'after',
        text: '插入图片',
      },
    ],
  },
  'meta.appinn.net': {
    enabled: true,
    pasteEnabled: false,
    dragAndDropEnabled: false,
    format: 'markdown',
    host: 'appinn',
    proxy: 'none',
    buttons: [
      {
        selector: '.toolbar__button.upload',
        position: 'after',
        text: `<button class="btn no-text btn-icon toolbar__button upload-extended" tabindex="-1" title="上传" type="button" style="display: inline-flex; color: orangered;">
<svg class="fa d-icon d-icon-far-image svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-image"></use></svg>      <span aria-hidden="true"></span>
    </button>`,
      },
    ],
  },
  'github.com': {
    enabled: true,
    pasteEnabled: false,
    dragAndDropEnabled: false,
    format: 'markdown',
    host: 'tikolu',
    proxy: 'wsrv.nl',
  },
}

// I18N: language detection and translations
const I18N = {
  en: {
    header_title: 'Universal Image Uploader',
    btn_history: 'History',
    btn_settings: 'Settings',
    btn_close: 'Close',
    format_markdown: 'Markdown',
    format_html: 'HTML',
    format_bbcode: 'BBCode',
    format_link: 'Link',
    host_imgur: 'Imgur',
    host_tikolu: 'Tikolu',
    host_mjj: 'MJJ.Today',
    host_appinn: 'Appinn',
    btn_select_images: 'Select Images',
    progress_initial: 'Done 0/0',
    progress_done: 'Done {done}/{total}',
    hint_text:
      'Paste or drag images onto the page, or click Select to batch upload',
    settings_section_title: 'Settings',
    settings_site_buttons: 'Site Button Settings',
    placeholder_css_selector: 'CSS Selector',
    pos_before: 'Before',
    pos_after: 'After',
    pos_inside: 'Inside',
    placeholder_button_content: 'Button content (HTML allowed)',
    insert_image_button_default: 'Insert image',
    btn_save_and_insert: 'Save & Insert',
    btn_remove_button_temp: 'Remove button (temporary)',
    btn_clear_settings: 'Clear settings',
    drop_overlay: 'Release to upload images',
    log_uploading: 'Uploading: ',
    log_success: '✅ Success: ',
    log_failed: '❌ Failed: ',
    btn_copy: 'Copy',
    btn_open: 'Open',
    btn_delete: 'Delete',
    btn_edit: 'Edit',
    btn_update: 'Update',
    btn_cancel: 'Cancel',
    menu_open_panel: 'Open upload panel',
    menu_select_images: 'Select images',
    menu_settings: 'Settings',
    menu_enable_site: 'Enable uploader for this site',
    menu_disable_site: 'Disable uploader for this site',
    toggle_paste_enabled: 'Enable paste upload',
    toggle_drag_enabled: 'Enable drag-and-drop upload',
    formats_section_title: 'Custom Formats',
    placeholder_format_name: 'Format name',
    placeholder_format_template: 'Format template',
    example_format_template: 'Example: {name} - {link}',
    btn_add_format: 'Add format',
    formats_col_name: 'Name',
    formats_col_template: 'Format',
    formats_col_ops: 'Actions',
    history_upload_page_prefix: 'Upload page: ',
    history_upload_page: 'Upload page: {host}',
    btn_history_count: 'History ({count})',
    btn_clear_history: 'Clear',
    default_image_name: 'image',
    proxy_none: 'No proxy',
    proxy_wsrv_nl: 'wsrv.nl',
    error_network: 'Network error',
    error_upload_failed: 'Upload failed',
    placeholder_uploading: 'Uploading "{name}"...',
    placeholder_upload_failed: 'Upload failed: {name}',
  },
  'zh-CN': {
    header_title: '通用图片上传助手',
    btn_history: '历史',
    btn_settings: '设置',
    btn_close: '关闭',
    format_markdown: 'Markdown',
    format_html: 'HTML',
    format_bbcode: 'BBCode',
    format_link: '链接',
    host_imgur: 'Imgur',
    host_tikolu: 'Tikolu',
    host_mjj: 'MJJ.Today',
    host_appinn: 'Appinn',
    btn_select_images: '选择图片',
    progress_initial: '完成 0/0',
    progress_done: '完成 {done}/{total}',
    hint_text: '支持粘贴图片、拖拽图片到页面或点击选择图片进行批量上传',
    settings_section_title: '设置',
    settings_site_buttons: '站点按钮设置',
    placeholder_css_selector: 'CSS 选择器',
    pos_before: '之前',
    pos_after: '之后',
    pos_inside: '里面',
    placeholder_button_content: '按钮内容（可为 HTML）',
    insert_image_button_default: '插入图片',
    btn_save_and_insert: '保存并插入',
    btn_remove_button_temp: '移除按钮（临时）',
    btn_clear_settings: '清空设置',
    drop_overlay: '释放以上传图片',
    log_uploading: '上传中：',
    log_success: '✅ 成功：',
    log_failed: '❌ 失败：',
    btn_copy: '复制',
    btn_open: '打开',
    btn_delete: '删除',
    btn_edit: '编辑',
    btn_update: '更新',
    btn_cancel: '取消',
    menu_open_panel: '打开图片上传面板',
    menu_select_images: '选择图片',
    menu_settings: '设置',
    menu_enable_site: '为此站点启用上传',
    menu_disable_site: '为此站点禁用上传',
    toggle_paste_enabled: '启用粘贴上传',
    toggle_drag_enabled: '启用拖拽上传',
    formats_section_title: '自定义格式',
    placeholder_format_name: '格式名称',
    placeholder_format_template: '格式内容',
    example_format_template: '示例：{name} - {link}',
    btn_add_format: '添加格式',
    formats_col_name: '名字',
    formats_col_template: '格式',
    formats_col_ops: '操作',
    history_upload_page_prefix: '上传页面：',
    history_upload_page: '上传页面：{host}',
    btn_history_count: '历史（{count}）',
    btn_clear_history: '清空',
    default_image_name: '图片',
    proxy_none: '无代理',
    proxy_wsrv_nl: 'wsrv.nl',
    error_network: '网络错误',
    error_upload_failed: '上传失败',
    placeholder_uploading: '正在上传「{name}」...',
    placeholder_upload_failed: '上传失败：{name}',
  },
  'zh-TW': {
    header_title: '通用圖片上傳助手',
    btn_history: '歷史',
    btn_settings: '設定',
    btn_close: '關閉',
    format_markdown: 'Markdown',
    format_html: 'HTML',
    format_bbcode: 'BBCode',
    format_link: '連結',
    host_imgur: 'Imgur',
    host_tikolu: 'Tikolu',
    host_mjj: 'MJJ.Today',
    host_appinn: 'Appinn',
    btn_select_images: '選擇圖片',
    progress_initial: '完成 0/0',
    progress_done: '完成 {done}/{total}',
    hint_text: '支援貼上、拖曳圖片到頁面或點擊選擇檔案進行批次上傳',
    settings_section_title: '設定',
    settings_site_buttons: '站點按鈕設定',
    placeholder_css_selector: 'CSS 選擇器',
    pos_before: '之前',
    pos_after: '之後',
    pos_inside: '裡面',
    placeholder_button_content: '按鈕內容（可為 HTML）',
    insert_image_button_default: '插入圖片',
    btn_save_and_insert: '保存並插入',
    btn_remove_button_temp: '移除按鈕（暫時）',
    btn_clear_settings: '清空設定',
    drop_overlay: '放開以上傳圖片',
    log_uploading: '上傳中：',
    log_success: '✅ 成功：',
    log_failed: '❌ 失敗：',
    btn_copy: '複製',
    btn_open: '打開',
    btn_delete: '刪除',
    btn_edit: '編輯',
    btn_update: '更新',
    btn_cancel: '取消',
    menu_open_panel: '打開圖片上傳面板',
    menu_select_images: '選擇圖片',
    menu_settings: '設定',
    menu_enable_site: '為此站點啟用上傳',
    menu_disable_site: '為此站點停用上傳',
    toggle_paste_enabled: '啟用貼上上傳',
    toggle_drag_enabled: '啟用拖曳上傳',
    formats_section_title: '自訂格式',
    placeholder_format_name: '格式名稱',
    placeholder_format_template: '格式內容',
    example_format_template: '範例：{name} - {link}',
    btn_add_format: '新增格式',
    formats_col_name: '名稱',
    formats_col_template: '格式',
    formats_col_ops: '操作',
    history_upload_page_prefix: '上傳頁面：',
    history_upload_page: '上傳頁面：{host}',
    btn_history_count: '歷史（{count}）',
    btn_clear_history: '清空',
    default_image_name: '圖片',
    proxy_none: '不使用代理',
    proxy_wsrv_nl: 'wsrv.nl',
    error_network: '網路錯誤',
    error_upload_failed: '上傳失敗',
    placeholder_uploading: '正在上傳「{name}」...',
    placeholder_upload_failed: '上傳失敗：{name}',
  },
}

function detectLanguage() {
  try {
    const browserLang = (
      navigator.language ||
      navigator.userLanguage ||
      'en'
    ).toLowerCase()
    const supported = Object.keys(I18N)
    if (supported.includes(browserLang)) return browserLang
    const base = browserLang.split('-')[0]
    const match = supported.find((l) => l.startsWith(base + '-'))
    return match || 'en'
  } catch {
    return 'en'
  }
}

const USER_LANG = detectLanguage()
function t(key) {
  return (I18N[USER_LANG] && I18N[USER_LANG][key]) || I18N.en[key] || key
}

function tpl(str, params) {
  return String(str).replaceAll(/{(\w+)}/g, (_, k) => `${params?.[k] ?? ''}`)
}

// Imgur Client ID pool (see upload-image.ts)
const IMGUR_CLIENT_IDS = [
  '3107b9ef8b316f3',
  '442b04f26eefc8a',
  '59cfebe717c09e4',
  '60605aad4a62882',
  '6c65ab1d3f5452a',
  '83e123737849aa9',
  '9311f6be1c10160',
  'c4a4a563f698595',
  '81be04b9e4a08ce',
]

const HISTORY_KEY = 'uiu_history'
const FORMAT_MAP_KEY = 'uiu_format_map' // legacy
const BTN_SETTINGS_MAP_KEY = 'uiu_site_btn_settings_map' // legacy
const HOST_MAP_KEY = 'uiu_host_map' // legacy
const PROXY_MAP_KEY = 'uiu_proxy_map' // legacy
const SITE_SETTINGS_MAP_KEY = 'uiu_site_settings_map'
const CUSTOM_FORMATS_KEY = 'uiu_custom_formats'
const DEFAULT_FORMAT = 'markdown'
const DEFAULT_HOST = 'tikolu'
const DEFAULT_PROXY = 'wsrv.nl'
// Global allowed value lists
const ALLOWED_FORMATS = ['markdown', 'html', 'bbcode', 'link']
const ALLOWED_HOSTS = ['imgur', 'tikolu', 'mjj', 'appinn']
const ALLOWED_PROXIES = ['none', 'wsrv.nl']
const ALLOWED_BUTTON_POSITIONS = ['before', 'inside', 'after']
const DEFAULT_BUTTON_POSITION = 'after'

const APPINN_UPLOAD_ENDPOINT = 'https://h1.appinn.me/upload'
const APPINN_UPLOAD_PARAMS = {
  authCode: 'appinn2',
  serverCompress: false,
  uploadChannel: 'telegram',
  uploadNameType: 'default',
  autoRetry: true,
}

// Migrate legacy storage keys from older versions (iu_*) to new (uiu_*) - v0.1 to v0.2
function migrateLegacyStorage() {
  try {
    const maybeMove = (oldKey, newKey) => {
      const hasNew = GM_getValue(newKey, undefined) !== undefined
      const oldVal = GM_getValue(oldKey, undefined)
      const hasOld = oldVal !== undefined
      if (!hasNew && hasOld) {
        GM_setValue(newKey, oldVal)
        try {
          if (typeof GM_deleteValue === 'function') GM_deleteValue(oldKey)
        } catch {}
      }
    }

    maybeMove('iu_history', HISTORY_KEY)
    maybeMove('iu_format_map', FORMAT_MAP_KEY)
    maybeMove('iu_site_btn_settings_map', BTN_SETTINGS_MAP_KEY)
  } catch {}
}

// Run migration early before any reads/writes
migrateLegacyStorage()

// Utility: normalize a host string consistently (trim and strip leading 'www.')
function normalizeHost(h) {
  try {
    h = String(h || '').trim()
    return h.startsWith('www.') ? h.slice(4) : h
  } catch {
    return h
  }
}

/**
 * ensureAllowedValue
 * Returns `value` if it is contained in `allowedValues`,
 * otherwise returns `defaultValue` (or `undefined` when omitted).
 *
 * - `allowedValues` may be any array; non-array or empty lists yield `defaultValue`/`undefined`.
 * - Optimizes lookups for larger lists via `Set`.
 * - Does not coerce types; comparison is strict equality against items in `allowedValues`.
 */
function ensureAllowedValue(value, allowedValues, defaultValue) {
  if (!Array.isArray(allowedValues) || allowedValues.length === 0) {
    return defaultValue
  }

  if (allowedValues.length < 8) {
    return allowedValues.includes(value) ? value : defaultValue
  }

  const set = new Set(allowedValues)
  return set.has(value) ? value : defaultValue
}

// Global custom formats: [{ name: string, template: string }]
function getCustomFormats() {
  try {
    const list = GM_getValue(CUSTOM_FORMATS_KEY, []) || []
    if (!Array.isArray(list)) return []
    return list
      .map((it) => ({
        name: String(it?.name || '').trim(),
        template: String(it?.template || ''),
      }))
      .filter((it) => it.name && it.template)
  } catch {
    return []
  }
}

function setCustomFormats(list) {
  try {
    const arr = Array.isArray(list) ? list : []
    const normalized = arr
      .map((it) => ({
        name: String(it?.name || '').trim(),
        template: String(it?.template || ''),
      }))
      .filter((it) => it.name && it.template)
    // de-duplicate by name (last wins)
    const map = new Map()
    for (const it of normalized) map.set(it.name, it.template)
    const out = Array.from(map.entries()).map(([name, template]) => ({
      name,
      template,
    }))
    GM_setValue(CUSTOM_FORMATS_KEY, out)
  } catch {}
}

function upsertCustomFormat(name, template) {
  try {
    name = String(name || '').trim()
    template = String(template || '')
    if (!name || !template) return
    const list = getCustomFormats()
    const idx = list.findIndex((it) => it.name === name)
    if (idx === -1) {
      list.push({ name, template })
    } else {
      list[idx] = { name, template }
    }

    setCustomFormats(list)
  } catch {}
}

function removeCustomFormat(name) {
  try {
    name = String(name || '').trim()
    if (!name) return
    const list = getCustomFormats().filter((it) => it.name !== name)
    setCustomFormats(list)
  } catch {}
}

function getAllowedFormats() {
  try {
    return [...ALLOWED_FORMATS, ...getCustomFormats().map((f) => f.name)]
  } catch {
    return [...ALLOWED_FORMATS]
  }
}

function ensureAllowedFormat(fmt) {
  return ensureAllowedValue(fmt, getAllowedFormats(), DEFAULT_FORMAT)
}

// Migrate existing separate maps (format/host/proxy/buttons) into unified per-domain map - v0.2 to v0.3 and later
function migrateToUnifiedSiteMap() {
  try {
    const existing = GM_getValue(SITE_SETTINGS_MAP_KEY, undefined)
    const siteMap = existing && typeof existing === 'object' ? existing : {}
    const isEmpty = !siteMap || Object.keys(siteMap).length === 0
    // Only migrate if the unified map is empty to avoid overwriting user settings
    if (!isEmpty) return

    const formatMap = GM_getValue(FORMAT_MAP_KEY, {}) || {}
    const hostMap = GM_getValue(HOST_MAP_KEY, {}) || {}
    const proxyMap = GM_getValue(PROXY_MAP_KEY, {}) || {}
    const btnMap = GM_getValue(BTN_SETTINGS_MAP_KEY, {}) || {}

    const rawKeys = new Set([
      ...Object.keys(formatMap),
      ...Object.keys(hostMap),
      ...Object.keys(proxyMap),
      ...Object.keys(btnMap),
      ...Object.keys(CONFIG || {}),
    ])
    const keys = new Set()
    for (const k of rawKeys) keys.add(normalizeHost(k))

    for (const key of keys) {
      if (!key) continue
      const preset = CONFIG?.[key] || {}
      const s = siteMap[key] || {}
      // Format
      if (s.format === undefined) {
        const fmt = formatMap[key] ?? preset.format
        const normalizedFormat = ensureAllowedFormat(fmt)
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
        if (list.length > 0) s.buttons = list
      }

      if (Object.keys(s).length > 0) siteMap[key] = s
    }

    GM_setValue(SITE_SETTINGS_MAP_KEY, siteMap)
    // Optionally clear legacy keys to avoid duplication
    try {
      if (typeof GM_deleteValue === 'function') {
        GM_deleteValue(FORMAT_MAP_KEY)
        GM_deleteValue(HOST_MAP_KEY)
        GM_deleteValue(PROXY_MAP_KEY)
        GM_deleteValue(BTN_SETTINGS_MAP_KEY)
      }
    } catch {}
  } catch {}
}

migrateToUnifiedSiteMap()

// Apply preset config to unified storage (only set missing fields)
function applyPresetConfig() {
  try {
    const siteMap = GM_getValue(SITE_SETTINGS_MAP_KEY, {}) || {}
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

    if (changed) GM_setValue(SITE_SETTINGS_MAP_KEY, siteMap)
  } catch {}
}

// Initialize once at runtime
applyPresetConfig()

const SITE_KEY = normalizeHost(location.hostname || '')
const getSiteSettingsMap = () => GM_getValue(SITE_SETTINGS_MAP_KEY, {})
const setSiteSettingsMap = (map) => {
  GM_setValue(SITE_SETTINGS_MAP_KEY, map)
}

const getCurrentSiteSettings = () => {
  const map = getSiteSettingsMap()
  return map[SITE_KEY] || {}
}

const updateCurrentSiteSettings = (updater) => {
  const map = getSiteSettingsMap()
  const key = SITE_KEY
  const current = map[key] || {}
  const partial =
    typeof updater === 'function' ? updater({ ...current }) : { ...updater }
  const next = { ...current, ...partial }
  // sanitize format (allow built-ins and user custom formats)
  if (Object.hasOwn(next, 'format')) {
    const resolvedFormat = ensureAllowedFormat(next.format)
    if (resolvedFormat) next.format = resolvedFormat
    else delete next.format
  }

  // sanitize host
  if (Object.hasOwn(next, 'host')) {
    const resolvedHost = ensureAllowedValue(next.host, ALLOWED_HOSTS)
    if (resolvedHost) next.host = resolvedHost
    else delete next.host
  }

  // sanitize proxy
  if (Object.hasOwn(next, 'proxy')) {
    const resolved = ensureAllowedValue(next.proxy, ALLOWED_PROXIES)
    if (resolved) next.proxy = resolved
    else delete next.proxy
  }

  // sanitize buttons (empty or falsy removes the field)
  if (Object.hasOwn(next, 'buttons')) {
    const list = next.buttons
    if (!list || !Array.isArray(list) || list.length === 0) {
      delete next.buttons
    }
  }

  // persist
  if (!next || Object.keys(next).length === 0) {
    if (map[key]) delete map[key]
  } else {
    map[key] = next
  }

  setSiteSettingsMap(map)
}

const getFormat = () => {
  const s = getCurrentSiteSettings()
  return s.format || DEFAULT_FORMAT
}

const setFormat = (format) => {
  updateCurrentSiteSettings({ format })
}

const getHost = () => {
  const s = getCurrentSiteSettings()
  return s.host || DEFAULT_HOST
}

const setHost = (host) => {
  updateCurrentSiteSettings({ host })
}

const getProxy = () => {
  const s = getCurrentSiteSettings()
  return s.proxy || DEFAULT_PROXY
}

const setProxy = (proxy) => {
  updateCurrentSiteSettings({ proxy })
}

const getEnabled = () => {
  const s = getCurrentSiteSettings()
  return s.enabled === true
}

const setEnabled = (val) => {
  updateCurrentSiteSettings({ enabled: Boolean(val) })
}

const getPasteEnabled = () => {
  const s = getCurrentSiteSettings()
  return s.pasteEnabled === true
}

const setPasteEnabled = (val) => {
  updateCurrentSiteSettings({ pasteEnabled: Boolean(val) })
}

const getDragAndDropEnabled = () => {
  const s = getCurrentSiteSettings()
  return s.dragAndDropEnabled === true
}

const setDragAndDropEnabled = (val) => {
  updateCurrentSiteSettings({ dragAndDropEnabled: Boolean(val) })
}

// Support multiple site button configurations
const getSiteBtnSettingsList = () => {
  const s = getCurrentSiteSettings()
  const val = s.buttons || []
  return Array.isArray(val) ? val : val?.selector ? [val] : []
}

const setSiteBtnSettingsList = (list) => {
  updateCurrentSiteSettings({ buttons: list })
}

const addSiteBtnSetting = (cfg) => {
  const selector = (cfg?.selector || '').trim()
  if (!selector) return
  const p = (cfg?.position || '').trim()
  const pos = ensureAllowedValue(
    p,
    ALLOWED_BUTTON_POSITIONS,
    DEFAULT_BUTTON_POSITION
  )
  const text = (cfg?.text || t('insert_image_button_default')).trim()
  const list = getSiteBtnSettingsList()
  list.push({ selector, position: pos, text })
  setSiteBtnSettingsList(list)
}

const removeSiteBtnSetting = (index) => {
  const list = getSiteBtnSettingsList()
  if (index >= 0 && index < list.length) {
    list.splice(index, 1)
    setSiteBtnSettingsList(list)
  }
}

const updateSiteBtnSetting = (index, cfg) => {
  const list = getSiteBtnSettingsList()
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
  setSiteBtnSettingsList(list)
}

const MAX_HISTORY = 50

const createEl = (tag, attrs = {}, children = []) => {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') el.textContent = v
    else if (k === 'class') el.className = v
    else el.setAttribute(k, v)
  }

  for (const c of children) el.append(c)
  return el
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
const buildFormatOptions = (selectEl, selectedValue) => {
  if (!selectEl) return
  // Avoid Trusted Types violation: clear without using innerHTML
  selectEl.textContent = ''
  const selected = selectedValue
    ? ensureAllowedFormat(selectedValue)
    : DEFAULT_FORMAT
  const builtins = ALLOWED_FORMATS
  const customs = getCustomFormats()
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
}

// Helper: build proxy options
const buildProxyOptions = (selectEl, selectedValue) => {
  if (!selectEl) return
  // Avoid Trusted Types violation: clear without using innerHTML
  selectEl.textContent = ''
  const selected = selectedValue
    ? ensureAllowedValue(selectedValue, ALLOWED_PROXIES, DEFAULT_PROXY)
    : DEFAULT_PROXY
  const proxyLabelKey = (val) =>
    val === 'wsrv.nl' ? 'proxy_wsrv_nl' : 'proxy_none'
  for (const val of ALLOWED_PROXIES) {
    const opt = createEl('option', {
      value: val,
      text: t(proxyLabelKey(val)),
    })
    if (val === selected) opt.selected = true
    selectEl.append(opt)
  }
}

const css = `
  #uiu-panel { position: fixed; right: 16px; bottom: 16px; z-index: 999999; width: 440px; max-height: calc(100vh - 32px); overflow: auto; background: #111827cc; color: #fff; backdrop-filter: blur(6px); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.25); font-family: system-ui, -apple-system, Segoe UI, Roboto; font-size: 13px; line-height: 1.5; }
  #uiu-panel header { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; font-weight: 600; font-size: 16px; background-color: unset; box-shadow: unset; transition: unset; }
  #uiu-panel header .uiu-actions { display:flex; gap:8px; }
  #uiu-panel header .uiu-actions button { font-size: 12px; }
  /* Active styles for toggles when sections are open */
  #uiu-panel header.uiu-show-history .uiu-actions .uiu-toggle-history { background:#2563eb; border-color:#1d4ed8; box-shadow: 0 0 0 1px #1d4ed8 inset; color:#fff; }
  #uiu-panel header.uiu-show-settings .uiu-actions .uiu-toggle-settings { background:#2563eb; border-color:#1d4ed8; box-shadow: 0 0 0 1px #1d4ed8 inset; color:#fff; }
  #uiu-panel .uiu-body { padding: 8px 12px; }
  #uiu-panel .uiu-controls { display:flex; align-items:center; gap:8px; flex-wrap: wrap; }
  #uiu-panel select, #uiu-panel button { font-size: 12px; padding: 6px 10px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; }
  #uiu-panel button.uiu-primary { background:#2563eb; border-color:#1d4ed8; }
  #uiu-panel .uiu-list { margin-top:8px; max-height: 140px; overflow-y:auto; overflow-x:hidden; font-size: 12px; }
  #uiu-panel .uiu-list .uiu-item { padding:6px 0; border-bottom: 1px dashed #334155; white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
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
  #uiu-drop { position: fixed; inset: 0; background: rgba(37,99,235,.12); border: 2px dashed #2563eb; display:none; align-items:center; justify-content:center; z-index: 999998; color:#2563eb; font-size: 18px; font-weight: 600; }
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

function loadHistory() {
  return GM_getValue(HISTORY_KEY, [])
}

function saveHistory(list) {
  GM_setValue(HISTORY_KEY, list.slice(0, MAX_HISTORY))
}

function addToHistory(entry) {
  const list = loadHistory()
  list.unshift(entry)
  saveHistory(list)
}

function basename(name) {
  const n = (name || '').trim()
  if (!n) return t('default_image_name')
  return n.replace(/\.[^.]+$/, '')
}

function formatText(link, name, fmt) {
  const alt = basename(name)
  // Custom format support: if fmt matches a user-defined template name
  try {
    const custom = getCustomFormats().find((cf) => cf.name === fmt)
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

function isImgurUrl(url) {
  try {
    const u = new URL(url)
    const h = u.hostname.toLowerCase()
    return h.includes('imgur.com')
  } catch {
    return false
  }
}

function applyProxy(url, providerKey) {
  try {
    const px = getProxy()
    if (px === 'none') return url
    const provider = providerKey || getHost()
    if (provider === 'imgur' || isImgurUrl(url)) return url
    if (px === 'wsrv.nl') {
      return `https://wsrv.nl/?url=${encodeURIComponent(url)}`
    }

    return url
  } catch {
    return url
  }
}

async function gmRequest(opts) {
  const req =
    typeof GM !== 'undefined' && GM?.xmlHttpRequest
      ? GM.xmlHttpRequest
      : typeof GM_xmlhttpRequest === 'undefined'
        ? null
        : GM_xmlhttpRequest
  if (!req) throw new Error('GM.xmlHttpRequest unavailable')
  return new Promise((resolve, reject) => {
    try {
      req({
        method: opts.method || 'GET',
        url: opts.url,
        headers: opts.headers,
        data: opts.data,
        responseType: opts.responseType || 'text',
        onload(res) {
          try {
            if ((opts.responseType || 'text') === 'json') {
              resolve(res.response ?? JSON.parse(res.responseText || '{}'))
            } else {
              resolve(res.responseText)
            }
          } catch (error) {
            reject(error)
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
      reject(error)
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

  throw lastError || new Error(t('error_upload_failed'))
}

async function uploadToTikolu(file) {
  // 8mb size limit (server also checks)
  if (Math.floor(file.size / 1000) > 8000) {
    throw new Error('8mb limit')
  }

  const formData = new FormData()
  formData.append('upload', true)
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

async function uploadImage(file) {
  const host = getHost()
  if (host === 'tikolu') return uploadToTikolu(file)
  if (host === 'mjj') return uploadToMjj(file)
  if (host === 'appinn') return uploadToAppinn(file)
  // Default
  return uploadToImgur(file)
}

// Track last visited editable element to support insertion after focus is lost
let lastEditableEl = null
// Helper: get deepest active element across Shadow DOM and same-origin iframes
function getDeepActiveElement() {
  let el = document.activeElement
  try {
    // Traverse into open shadow roots
    while (el && el.shadowRoot && el.shadowRoot.activeElement) {
      el = el.shadowRoot.activeElement
    }

    // Traverse into same-origin iframes
    while (
      el &&
      el.tagName === 'IFRAME' &&
      el.contentDocument &&
      el.contentDocument.activeElement
    ) {
      el = el.contentDocument.activeElement
    }
  } catch {}

  return el
}

// Helper: check if node is inside our UI panel (including its Shadow DOM)
function isInsideUIPanel(node) {
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

function isTextInput(el) {
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

function isEditable(el) {
  return (
    el instanceof HTMLTextAreaElement ||
    isTextInput(el) ||
    (el instanceof HTMLElement && el.isContentEditable)
  )
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
    }
  },
  true
)

function insertIntoFocused(text) {
  let el = getDeepActiveElement()
  // Fallback to last editable target if current focus is not usable (or inside our panel)
  if (!isEditable(el) || isInsideUIPanel(el)) {
    el = lastEditableEl
    try {
      if (el && typeof el.focus === 'function') el.focus()
    } catch {}
  }

  if (!isEditable(el) || isInsideUIPanel(el)) return false
  try {
    if (el instanceof HTMLTextAreaElement || isTextInput(el)) {
      const start = el.selectionStart ?? el.value.length
      const end = el.selectionEnd ?? el.value.length
      const v = el.value
      el.value = v.slice(0, start) + text + v.slice(end)
      el.dispatchEvent(new Event('input', { bubbles: true }))
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

      document.execCommand('insertText', false, text)
      return true
    }
  } catch {}

  return false
}

function copyAndInsert(text) {
  try {
    GM_setClipboard(text)
  } catch {}

  insertIntoFocused(`\n${text}\n`)
}

function getActiveEditableTarget() {
  let el = getDeepActiveElement()
  if (!isEditable(el) || isInsideUIPanel(el)) el = lastEditableEl
  return isEditable(el) && !isInsideUIPanel(el) ? el : null
}

function createUploadPlaceholder(name) {
  const safe = String(name || t('default_image_name'))
  return `<!-- ${tpl(t('placeholder_uploading'), { name: safe })} -->`
}

function replacePlaceholder(el, placeholder, replacement) {
  if (!el || !placeholder) return false
  try {
    if (el instanceof HTMLTextAreaElement || isTextInput(el)) {
      const v = el.value
      const idx = v.indexOf(placeholder)
      if (idx !== -1) {
        el.value =
          v.slice(0, idx) + replacement + v.slice(idx + placeholder.length)
        el.dispatchEvent(new Event('input', { bubbles: true }))
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

function createPanel() {
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
  toggleHistoryBtn.addEventListener('click', () => {
    header.classList.toggle('uiu-show-history')
    renderHistory()
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
  settingsBtn.addEventListener('click', () => {
    header.classList.toggle('uiu-show-settings')
    try {
      refreshSettingsUI()
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
  const controls = createEl('div', { class: 'uiu-controls' })

  const format = getFormat()
  const formatSel = createEl('select')
  buildFormatOptions(formatSel, format)
  formatSel.addEventListener('change', () => {
    setFormat(formatSel.value)
  })

  const host = getHost()
  const hostSel = createEl('select')
  buildHostOptions(hostSel, host)
  hostSel.addEventListener('change', () => {
    setHost(hostSel.value)
    updateProxyState()
  })

  const proxy = getProxy()
  const proxySel = createEl('select')
  buildProxyOptions(proxySel, proxy)
  function updateProxyState() {
    const currentHost = hostSel.value
    if (currentHost === 'imgur') {
      proxySel.value = 'none'
      proxySel.disabled = true
      setProxy('none')
      try {
        renderHistory()
      } catch {}
    } else {
      proxySel.disabled = false
    }
  }

  updateProxyState()
  proxySel.addEventListener('change', () => {
    setProxy(proxySel.value)
    try {
      renderHistory()
    } catch {}
  })

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

  controls.append(formatSel)
  controls.append(hostSel)
  controls.append(proxySel)
  controls.append(selectBtn)
  controls.append(progressEl)
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
    pasteChk.checked = getPasteEnabled()
  } catch {}

  pasteChk.addEventListener('change', () => {
    setPasteEnabled(Boolean(pasteChk.checked))
    if (pasteChk.checked) enablePaste()
    else disablePaste()
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
    dragChk.checked = getDragAndDropEnabled()
  } catch {}

  dragChk.addEventListener('change', () => {
    setDragAndDropEnabled(Boolean(dragChk.checked))
    if (dragChk.checked) enableDrag()
    else disableDrag()
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
  buildPositionOptions(posSel)
  const textInput = createEl('input', {
    type: 'text',
    placeholder: t('placeholder_button_content'),
  })
  textInput.value = t('insert_image_button_default')
  const saveBtn = createEl('button', { text: t('btn_save_and_insert') })
  saveBtn.addEventListener('click', () => {
    addSiteBtnSetting({
      selector: selInput.value,
      position: posSel.value,
      text: textInput.value,
    })

    selInput.value = ''
    buildPositionOptions(posSel)
    textInput.value = t('insert_image_button_default')
    renderSettingsList()

    for (const el of document.querySelectorAll('.uiu-insert-btn')) el.remove()
    applySiteButtons()
    try {
      restartSiteButtonObserver()
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
  clearBtn.addEventListener('click', () => {
    setSiteBtnSettingsList([])
    renderSettingsList()
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
  addFmtBtn.addEventListener('click', () => {
    const name = (fnameInput.value || '').trim()
    const tplStr = String(ftemplateInput.value || '')
    if (!name || !tplStr) return
    upsertCustomFormat(name, tplStr)
    fnameInput.value = ''
    ftemplateInput.value = ''
    renderFormatsList()
    try {
      buildFormatOptions(formatSel, getFormat())
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

  function renderFormatsList() {
    formatsList.textContent = ''
    const list = getCustomFormats()
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
        updateBtn.addEventListener('click', () => {
          const newName = (eName.value || '').trim()
          const newTpl = String(eTpl.value || '')
          if (!newName || !newTpl) return
          if (newName !== cf.name) removeCustomFormat(cf.name)
          upsertCustomFormat(newName, newTpl)
          // Update current format selection if renamed
          try {
            if (getFormat() === cf.name) setFormat(newName)
          } catch {}

          renderFormatsList()
          try {
            buildFormatOptions(formatSel, getFormat())
          } catch {}
        })
        const cancelBtn = createEl('button', { text: t('btn_cancel') })
        cancelBtn.addEventListener('click', () => {
          renderFormatsList()
        })
        ops.append(updateBtn)
        ops.append(cancelBtn)
        row.append(colName)
        row.append(colTpl)
        row.append(ops)
      })
      const delBtn = createEl('button', { text: t('btn_delete') })
      delBtn.addEventListener('click', () => {
        removeCustomFormat(cf.name)
        // Reset site format if current selection removed
        try {
          if (getFormat() === cf.name) setFormat(DEFAULT_FORMAT)
        } catch {}

        renderFormatsList()
        try {
          buildFormatOptions(formatSel, getFormat())
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

  function renderSettingsList() {
    // Avoid Trusted Types violation: clear without using innerHTML
    settingsList.textContent = ''
    const listData = getSiteBtnSettingsList()
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
        updateBtn.addEventListener('click', () => {
          updateSiteBtnSetting(idx, {
            selector: eSel.value,
            position: ePos.value,
            text: eText.value,
          })
          renderSettingsList()
          for (const el of document.querySelectorAll('.uiu-insert-btn'))
            el.remove()
          applySiteButtons()
          try {
            restartSiteButtonObserver()
          } catch {}
        })
        const cancelBtn = createEl('button', { text: t('btn_cancel') })
        cancelBtn.addEventListener('click', () => {
          renderSettingsList()
        })
        ops.append(updateBtn)
        ops.append(cancelBtn)
        row.append(fields)
        row.append(ops)
      })
      const delBtn = createEl('button', { text: t('btn_delete') })
      delBtn.addEventListener('click', () => {
        removeSiteBtnSetting(idx)
        renderSettingsList()
        for (const el of document.querySelectorAll('.uiu-insert-btn'))
          el.remove()
        applySiteButtons()
        try {
          restartSiteButtonObserver()
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

  function refreshSettingsUI() {
    selInput.value = ''
    buildPositionOptions(posSel)
    textInput.value = t('insert_image_button_default')
    renderSettingsList()
    try {
      fnameInput.value = ''
      ftemplateInput.value = ''
      renderFormatsList()
    } catch {}
  }

  // Render into Shadow DOM root
  root.append(header)
  root.append(body)
  document.body.append(panel)

  // initialize pressed state
  try {
    toggleHistoryBtn.setAttribute('aria-pressed', 'false')
    settingsBtn.setAttribute('aria-pressed', 'false')
  } catch {}

  panel.style.display = 'none'

  function applySingle(cfg) {
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
    for (const target of Array.from(targets)) {
      const exists =
        pos === 'inside'
          ? Boolean(target.querySelector('.uiu-insert-btn'))
          : pos === 'before'
            ? Boolean(
                target.previousElementSibling &&
                target.previousElementSibling.classList?.contains(
                  'uiu-insert-btn'
                )
              )
            : Boolean(
                target.nextElementSibling &&
                target.nextElementSibling.classList?.contains('uiu-insert-btn')
              )
      if (exists) continue
      let btn
      try {
        // Parse HTML without using innerHTML to comply with Trusted Types
        const range = document.createRange()
        const ctx = document.createElement('div')
        range.selectNodeContents(ctx)
        const frag = range.createContextualFragment(content)
        if (frag && frag.childElementCount === 1) {
          btn = frag.firstElementChild
        }
      } catch {}

      if (btn) {
        btn.classList.add('uiu-insert-btn')
      } else {
        btn = createEl('button', {
          class: 'uiu-insert-btn uiu-default',
          text: content,
        })
      }

      btn.addEventListener('click', (event) => {
        panel.style.display = 'block'
        event.preventDefault()
        try {
          openFilePicker()
        } catch {}
      })
      if (pos === 'before') {
        target.before(btn)
      } else if (pos === 'inside') {
        target.append(btn)
      } else {
        target.after(btn)
      }
    }
  }

  function applySiteButtons() {
    const list = getSiteBtnSettingsList()
    for (const cfg of list) {
      try {
        applySingle(cfg)
      } catch {}
    }
  }

  applySiteButtons()

  let siteBtnObserver
  function restartSiteButtonObserver() {
    try {
      if (siteBtnObserver) siteBtnObserver.disconnect()
    } catch {}

    const list = getSiteBtnSettingsList()
    if (list.length === 0) {
      siteBtnObserver = null
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

  restartSiteButtonObserver()

  let drop = null
  let pasteHandler = null
  let dragoverHandler = null
  let dragleaveHandler = null
  let dropHandler = null
  function enablePaste() {
    if (pasteHandler) return
    pasteHandler = (event) => {
      const cd = event.clipboardData
      if (!cd) return
      const list = []
      const seen = new Set()
      const addIfNew = (f) => {
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
        handleFiles(list)
      }
    }

    document.addEventListener('paste', pasteHandler, true)
  }

  function disablePaste() {
    if (!pasteHandler) return
    document.removeEventListener('paste', pasteHandler, true)
    pasteHandler = null
  }

  function enableDrag() {
    if (!drop) {
      drop = createEl('div', { id: 'uiu-drop', text: t('drop_overlay') })
      document.body.append(drop)
    }

    if (!dragoverHandler) {
      dragoverHandler = (e) => {
        const dt = e.dataTransfer
        const types = dt?.types ? Array.from(dt.types) : []
        const hasFileType =
          types.includes('Files') || dt?.types?.contains?.('Files')
        const hasFileItem = dt?.items
          ? Array.from(dt.items).some((it) => it.kind === 'file')
          : false
        if (hasFileType || hasFileItem) {
          drop && drop.classList.add('show')
          e.preventDefault()
        } else {
          drop && drop.classList.remove('show')
        }
      }

      document.addEventListener('dragover', dragoverHandler)
    }

    if (!dragleaveHandler) {
      dragleaveHandler = () => drop && drop.classList.remove('show')
      document.addEventListener('dragleave', dragleaveHandler)
    }

    if (!dropHandler) {
      dropHandler = (event) => {
        drop && drop.classList.remove('show')
        event.preventDefault()
        const files = event.dataTransfer?.files
        if (files?.length) handleFiles(Array.from(files))
      }

      document.addEventListener('drop', dropHandler)
    }
  }

  function disableDrag() {
    if (dragoverHandler) {
      document.removeEventListener('dragover', dragoverHandler)
      dragoverHandler = null
    }

    if (dragleaveHandler) {
      document.removeEventListener('dragleave', dragleaveHandler)
      dragleaveHandler = null
    }

    if (dropHandler) {
      document.removeEventListener('drop', dropHandler)
      dropHandler = null
    }

    if (drop) {
      try {
        drop.remove()
      } catch {}

      drop = null
    }
  }

  const queue = []
  let running = 0
  let done = 0
  let total = 0
  const CONCURRENCY = 3

  function updateProgress() {
    progressEl.textContent = tpl(t('progress_done'), { done, total })
  }

  function addLog(text) {
    list.prepend(createEl('div', { class: 'item', text }))
  }

  async function processQueue() {
    while (running < CONCURRENCY && queue.length > 0) {
      const item = queue.shift()
      running++
      addLog(`${t('log_uploading')}${item.file.name}`)
      try {
        const link = await uploadImage(item.file)
        const fmt = getFormat()
        const out = formatText(applyProxy(link, getHost()), item.file.name, fmt)
        if (item.placeholder && item.targetEl) {
          const ok = replacePlaceholder(
            item.targetEl,
            item.placeholder,
            `${out}`
          )
          if (!ok) copyAndInsert(out)
        } else {
          copyAndInsert(out)
        }

        addToHistory({
          link,
          name: item.file.name,
          ts: Date.now(),
          pageUrl: location.href,
          provider: getHost(),
        })
        addLog(`${t('log_success')}${item.file.name} → ${link}`)
      } catch (error) {
        if (item.placeholder && item.targetEl) {
          const failNote = `<!-- ${tpl(t('placeholder_upload_failed'), { name: item.file.name })} -->`
          try {
            replacePlaceholder(item.targetEl, item.placeholder, failNote)
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

  function handleFiles(files) {
    const imgs = files.filter((f) => f.type.includes('image'))
    if (imgs.length === 0) return
    total += imgs.length
    updateProgress()
    const targetEl = getActiveEditableTarget()
    for (const file of imgs) {
      let placeholder
      if (targetEl) {
        try {
          targetEl.focus()
        } catch {}

        placeholder = createUploadPlaceholder(file.name)
        insertIntoFocused(`\n${placeholder}\n`)
      }

      queue.push({ file, placeholder, targetEl })
    }

    processQueue()
  }

  const pasteEnabled = getPasteEnabled()
  if (pasteEnabled) enablePaste()

  const dragEnabled = getDragAndDropEnabled()
  if (dragEnabled) enableDrag()

  function renderHistory() {
    // Avoid Trusted Types violation: clear without using innerHTML
    history.textContent = ''
    const header = createEl('div', { class: 'uiu-controls' })
    header.append(
      createEl('span', {
        text: tpl(t('btn_history_count'), { count: loadHistory().length }),
      })
    )
    const clearBtn = createEl('button', { text: t('btn_clear_history') })
    clearBtn.addEventListener('click', () => {
      saveHistory([])
      renderHistory()
    })
    header.append(clearBtn)
    history.append(header)

    const listWrap = createEl('div', { class: 'uiu-list' })
    const items = loadHistory()
    for (const it of items) {
      const row = createEl('div', { class: 'uiu-row' })

      const preview = createEl('img', {
        src: applyProxy(
          it.link,
          it.provider || (isImgurUrl(it.link) ? 'imgur' : 'other')
        ),
        style:
          'width:48px;height:48px;object-fit:cover;border-radius:4px;border:1px solid #334155;',
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
        const providerKey = it.provider || 'imgur'
        const providerText = t('host_' + providerKey)
        info.append(
          createEl('span', {
            text: providerText,
            style:
              'font-size:11px;color:#cbd5e1;border:1px solid #334155;border-radius:4px;padding:1px 6px;width:fit-content;',
          })
        )
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
        const fmt = getFormat()
        const proxied = applyProxy(
          it.link,
          it.provider || (isImgurUrl(it.link) ? 'imgur' : 'other')
        )
        const out = formatText(proxied, it.name || t('default_image_name'), fmt)
        copyAndInsert(out)
      })
      const openBtn = createEl('button', { text: t('btn_open') })
      openBtn.addEventListener('click', () => {
        const url = applyProxy(
          it.link,
          it.provider || (isImgurUrl(it.link) ? 'imgur' : 'other')
        )
        window.open(url, '_blank')
      })
      ops.append(copyBtn)
      ops.append(openBtn)
      row.append(ops)
      listWrap.append(row)
    }

    history.append(listWrap)
  }

  try {
    if (typeof GM_addValueChangeListener === 'function') {
      GM_addValueChangeListener(
        HISTORY_KEY,
        (name, oldValue, newValue, remote) => {
          renderHistory()
        }
      )
    }
  } catch {}

  GM_registerMenuCommand(t('menu_open_panel'), () => {
    panel.style.display = 'block'
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
  GM_registerMenuCommand(t('menu_select_images'), () => {
    panel.style.display = 'block'
    openFilePicker()
  })
  GM_registerMenuCommand(t('menu_settings'), () => {
    panel.style.display = 'block'
    header.classList.add('uiu-show-settings')
    try {
      refreshSettingsUI()
    } catch {}

    try {
      settingsBtn.setAttribute('aria-pressed', 'true')
      toggleHistoryBtn.setAttribute(
        'aria-pressed',
        header.classList.contains('uiu-show-history') ? 'true' : 'false'
      )
    } catch {}
  })

  return { handleFiles }
}

try {
  const enabled = getEnabled()
  if (enabled && !document.querySelector('#uiu-panel')) {
    const { handleFiles } = createPanel()
    globalThis.addEventListener('iu:uploadFiles', (e) => {
      const files = e.detail?.files
      if (files?.length) handleFiles(files)
    })
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand(
      enabled ? t('menu_disable_site') : t('menu_enable_site'),
      () => {
        setEnabled(!enabled)
        try {
          location.reload()
        } catch {}
      }
    )
  }
} catch {}
