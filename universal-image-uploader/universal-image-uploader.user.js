// ==UserScript==
// @name               Universal Image Uploader
// @name:zh-CN         通用图片上传助手
// @name:zh-TW         通用圖片上傳助手
// @namespace          https://github.com/utags
// @homepageURL        https://github.com/utags/userscripts#readme
// @supportURL         https://github.com/utags/userscripts/issues
// @version            0.2.1
// @description        Paste/drag/select images, batch upload to Imgur; auto-copy Markdown/HTML/BBCode/link; site button integration with SPA observer; local history.
// @description:zh-CN  通用图片上传与插入：支持粘贴/拖拽/选择，批量上传至 Imgur；自动复制 Markdown/HTML/BBCode/链接；可为各站点插入按钮并适配 SPA；保存本地历史。
// @description:zh-TW  通用圖片上傳與插入：支援貼上/拖曳/選擇，批次上傳至 Imgur；自動複製 Markdown/HTML/BBCode/連結；可為各站點插入按鈕並適配 SPA；保存本地歷史。
// @author             Pipecraft
// @license            MIT
// @icon               data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSI+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTAiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTMyIDIwbC0xMiAxMmg3djE4aDEwVjMyaDdsLTEyLTEyeiIgZmlsbD0iIzFmMjkzNyIvPjwvc3ZnPg==
// @noframes
// @match              https://*.v2ex.com/*
// @match              https://*.v2ex.co/*
// @match              https://greasyfork.org/*
// @match              https://www.nodeseek.com/*
// @match              https://www.deepflood.com/*
// @match              https://2libra.com/*
// @match              *://*/*remove-this-to-apply-to-all-sites
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_addStyle
// @grant              GM_registerMenuCommand
// @grant              GM_setClipboard
// @grant              GM_addValueChangeListener
// @grant              GM.xmlhttpRequest
// @grant              GM_xmlhttpRequest
// @connect            api.imgur.com
// @connect            tikolu.net
// ==/UserScript==

;(function () {
  'use strict'

  // CONFIG: Preset site configuration (host without port; strip leading 'www.')
  const CONFIG = {
    // Examples: local preview page and common sites; add/remove as needed
    localhost: {
      format: 'markdown',
      buttons: [{ selector: 'textarea', position: 'after', text: '插入图片' }],
    },
    'v2ex.com': {
      format: 'markdown',
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
      format: 'markdown',
      buttons: [
        {
          selector: '.comment-screenshot-control',
          position: 'before',
        },
      ],
    },
    'nodeseek.com': {
      format: 'markdown',
      buttons: [
        {
          selector:
            '#editor-body > div.mde-toolbar > .toolbar-item:last-of-type',
          position: 'after',
          text: '插入图片',
        },
      ],
    },
    'deepflood.com': {
      format: 'markdown',
      buttons: [
        {
          selector:
            '#editor-body > div.mde-toolbar > .toolbar-item:last-of-type',
          position: 'after',
          text: '插入图片',
        },
      ],
    },
    '2libra.com': {
      format: 'markdown',
      buttons: [
        {
          selector:
            '.w-md-editor > div.w-md-editor-toolbar > ul:nth-child(1) > li:last-of-type',
          position: 'after',
          text: '插入图片',
        },
      ],
    },
    'github.com': { format: 'markdown' },
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
      btn_select_images: 'Select Images',
      progress_initial: 'Done 0/0',
      progress_done: 'Done {done}/{total}',
      hint_text:
        'Paste or drag images onto the page, or click Select to batch upload',
      settings_section_title: 'Site Button Settings',
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
      history_upload_page_prefix: 'Upload page: ',
      history_upload_page: 'Upload page: {host}',
      btn_history_count: 'History ({count})',
      btn_clear_history: 'Clear',
      default_image_name: 'image',
      proxy_none: 'No proxy',
      proxy_wsrv_nl: 'wsrv.nl',
      error_network: 'Network error',
      error_upload_failed: 'Upload failed',
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
      btn_select_images: '选择图片',
      progress_initial: '完成 0/0',
      progress_done: '完成 {done}/{total}',
      hint_text: '支持粘贴图片、拖拽图片到页面或点击选择图片进行批量上传',
      settings_section_title: '站点按钮设置',
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
      history_upload_page_prefix: '上传页面：',
      history_upload_page: '上传页面：{host}',
      btn_history_count: '历史（{count}）',
      btn_clear_history: '清空',
      default_image_name: '图片',
      proxy_none: '无代理',
      proxy_wsrv_nl: 'wsrv.nl',
      error_network: '网络错误',
      error_upload_failed: '上传失败',
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
      btn_select_images: '選擇圖片',
      progress_initial: '完成 0/0',
      progress_done: '完成 {done}/{total}',
      hint_text: '支援貼上、拖曳圖片到頁面或點擊選擇檔案進行批次上傳',
      settings_section_title: '站點按鈕設定',
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
      history_upload_page_prefix: '上傳頁面：',
      history_upload_page: '上傳頁面：{host}',
      btn_history_count: '歷史（{count}）',
      btn_clear_history: '清空',
      default_image_name: '圖片',
      proxy_none: '不使用代理',
      proxy_wsrv_nl: 'wsrv.nl',
      error_network: '網路錯誤',
      error_upload_failed: '上傳失敗',
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
    return String(str).replace(/\{(\w+)\}/g, (_, k) => `${params?.[k] ?? ''}`)
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
  const FORMAT_MAP_KEY = 'uiu_format_map'
  const BTN_SETTINGS_MAP_KEY = 'uiu_site_btn_settings_map'
  const HOST_MAP_KEY = 'uiu_host_map'
  const PROXY_MAP_KEY = 'uiu_proxy_map'
  const DEFAULT_FORMAT = 'markdown'
  const DEFAULT_HOST = 'imgur'
  const DEFAULT_PROXY = 'none'

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

  // Apply preset config to storage (only if the site has no saved settings)
  function applyPresetConfig() {
    try {
      const normalize = (h) => {
        try {
          h = String(h || '')
            .trim()
            .toLowerCase()
          return h.startsWith('www.') ? h.slice(4) : h
        } catch {
          return h
        }
      }
      const formatMap = GM_getValue(FORMAT_MAP_KEY, {})
      const btnMap = GM_getValue(BTN_SETTINGS_MAP_KEY, {})
      const hostMap = GM_getValue(HOST_MAP_KEY, {})
      let changedFmt = false
      let changedBtn = false
      let changedHost = false
      Object.entries(CONFIG || {}).forEach(([host, preset]) => {
        const key = normalize(host)
        if (!key || typeof preset !== 'object') return
        // Preset format
        if (preset.format && !(key in formatMap)) {
          const allowed = ['markdown', 'html', 'bbcode', 'link']
          const fmt = allowed.includes(preset.format)
            ? preset.format
            : DEFAULT_FORMAT
          formatMap[key] = fmt
          changedFmt = true
        }
        // Preset host
        if (preset.host && !(key in hostMap)) {
          const allowedHosts = ['imgur', 'tikolu']
          const h = allowedHosts.includes(preset.host)
            ? preset.host
            : DEFAULT_HOST
          hostMap[key] = h
          changedHost = true
        }
        // Preset buttons (single or array)
        const raw = preset.buttons || preset.button || []
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : []
        if (arr.length && !(key in btnMap)) {
          const list = arr
            .map((c) => {
              const selector = String(c?.selector || '').trim()
              if (!selector) return null
              const p = String(c?.position || '').trim()
              const pos =
                p === 'before' ? 'before' : p === 'inside' ? 'inside' : 'after'
              const text = String(
                c?.text || t('insert_image_button_default')
              ).trim()
              return { selector, position: pos, text }
            })
            .filter(Boolean)
          if (list.length) {
            btnMap[key] = list
            changedBtn = true
          }
        }
      })
      if (changedFmt) GM_setValue(FORMAT_MAP_KEY, formatMap)
      if (changedBtn) GM_setValue(BTN_SETTINGS_MAP_KEY, btnMap)
      if (changedHost) GM_setValue(HOST_MAP_KEY, hostMap)
    } catch {}
  }

  // Initialize once at runtime
  applyPresetConfig()

  const siteKey = () => {
    let h = location.hostname || ''
    return h.startsWith('www.') ? h.slice(4) : h
  }
  const getFormat = () => {
    const map = GM_getValue(FORMAT_MAP_KEY, {})
    return map[siteKey()] || DEFAULT_FORMAT
  }
  const setFormat = (fmt) => {
    const map = GM_getValue(FORMAT_MAP_KEY, {})
    map[siteKey()] = fmt
    GM_setValue(FORMAT_MAP_KEY, map)
  }
  const getHost = () => {
    const map = GM_getValue(HOST_MAP_KEY, {})
    return map[siteKey()] || DEFAULT_HOST
  }
  const setHost = (host) => {
    const map = GM_getValue(HOST_MAP_KEY, {})
    map[siteKey()] = host
    GM_setValue(HOST_MAP_KEY, map)
  }
  const getProxy = () => {
    const map = GM_getValue(PROXY_MAP_KEY, {})
    return map[siteKey()] || DEFAULT_PROXY
  }
  const setProxy = (px) => {
    const map = GM_getValue(PROXY_MAP_KEY, {})
    map[siteKey()] = px
    GM_setValue(PROXY_MAP_KEY, map)
  }
  // Support multiple site button configurations
  const getSiteBtnSettingsList = () => {
    const map = GM_getValue(BTN_SETTINGS_MAP_KEY, {})
    const val = map[siteKey()]
    if (!val) return []
    return Array.isArray(val) ? val : val?.selector ? [val] : []
  }
  const setSiteBtnSettingsList = (list) => {
    const map = GM_getValue(BTN_SETTINGS_MAP_KEY, {})
    const key = siteKey()
    if (!list || !list.length) {
      delete map[key]
    } else {
      map[key] = list
    }
    GM_setValue(BTN_SETTINGS_MAP_KEY, map)
  }
  const addSiteBtnSetting = (cfg) => {
    const selector = (cfg?.selector || '').trim()
    if (!selector) return
    const p = (cfg?.position || '').trim()
    const pos = p === 'before' ? 'before' : p === 'inside' ? 'inside' : 'after'
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
    const pos = p === 'before' ? 'before' : p === 'inside' ? 'inside' : 'after'
    const text = (cfg?.text || t('insert_image_button_default')).trim()
    list[index] = { selector, position: pos, text }
    setSiteBtnSettingsList(list)
  }
  const MAX_HISTORY = 50

  const createEl = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag)
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'text') el.textContent = v
      else if (k === 'class') el.className = v
      else el.setAttribute(k, v)
    })
    children.forEach((c) => el.appendChild(c))
    return el
  }

  const css = `
  #uiu-panel { position: fixed; right: 16px; bottom: 16px; z-index: 999999; width: 440px; background: #111827cc; color: #fff; backdrop-filter: blur(6px); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.25); font-family: system-ui, -apple-system, Segoe UI, Roboto; font-size: 13px; line-height: 1.5; }
  #uiu-panel header { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; font-weight: 600; font-size: 16px; background-color: unset; box-shadow: unset; transition: unset; }
  #uiu-panel header .uiu-actions { display:flex; gap:8px; }
  #uiu-panel header .uiu-actions button { font-size: 12px; }
  #uiu-panel .uiu-body { padding: 8px 12px; }
  #uiu-panel .uiu-controls { display:flex; align-items:center; gap:8px; flex-wrap: wrap; }
  #uiu-panel select, #uiu-panel button { font-size: 12px; padding: 6px 10px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; }
  #uiu-panel button.uiu-primary { background:#2563eb; border-color:#1d4ed8; }
  #uiu-panel .uiu-list { margin-top:8px; max-height: 140px; overflow-y:auto; overflow-x:hidden; font-size: 12px; }
  #uiu-panel .uiu-list .uiu-item { padding:6px 0; border-bottom: 1px dashed #334155; white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
  #uiu-panel .uiu-history { display:none; margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }
  #uiu-panel.uiu-show-history .uiu-history { display:block; }
  #uiu-panel .uiu-history .uiu-controls > span { font-size: 16px; font-weight: 600;}
  #uiu-panel .uiu-history .uiu-list { max-height: 240px; }
  #uiu-panel .uiu-history .uiu-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; }
  #uiu-panel .uiu-history .uiu-row .uiu-ops { display:flex; gap:6px; }
  #uiu-panel .uiu-history .uiu-row .uiu-name { display:block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #uiu-panel .uiu-hint { font-size: 11px; opacity:.85; margin-top:6px; }
  #uiu-panel .uiu-settings { display:none; margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }
  #uiu-panel.uiu-show-settings .uiu-settings { display:block; }
  #uiu-panel .uiu-settings .uiu-controls > span { font-size: 16px; font-weight: 600;}
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
    switch (fmt) {
      case 'html':
        return `<img src="${link}" alt="${alt}" />`
      case 'bbcode':
        return `[img]${link}[/img]`
      case 'link':
        return link
      default:
        return `![${alt}](${link})`
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
        const res = await fetch('https://api.imgur.com/3/upload', {
          method: 'POST',
          headers: { Authorization: `Client-ID ${id}` },
          body: formData,
        })
        if (!res.ok) {
          lastError = new Error(t('error_network'))
          continue
        }
        const data = await res.json()
        if (data?.success && data?.data?.link) {
          return data.data.link
        }
        lastError = new Error(t('error_upload_failed'))
      } catch (e) {
        lastError = e
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
    return new Promise((resolve, reject) => {
      const req =
        typeof GM !== 'undefined' && GM?.xmlHttpRequest
          ? GM.xmlHttpRequest
          : typeof GM_xmlhttpRequest !== 'undefined'
            ? GM_xmlhttpRequest
            : null
      if (!req) {
        reject(new Error('GM.xmlHttpRequest unavailable'))
        return
      }
      try {
        req({
          method: 'POST',
          url: 'https://tikolu.net/i/',
          data: formData,
          responseType: 'json',
          onload: (res) => {
            try {
              const data = res.response ?? JSON.parse(res.responseText || '{}')
              if (data?.status === 'uploaded' && data?.id) {
                resolve(`https://tikolu.net/i/${data.id}`)
              } else {
                reject(new Error(t('error_upload_failed')))
              }
            } catch (e) {
              reject(e)
            }
          },
          onerror: () => reject(new Error(t('error_network'))),
          ontimeout: () => reject(new Error(t('error_network'))),
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  async function uploadImage(file) {
    const host = getHost()
    if (host === 'tikolu') return uploadToTikolu(file)
    // Default
    return uploadToImgur(file)
  }

  function insertIntoFocused(text) {
    const el = document.activeElement
    if (!el) return false
    try {
      if (
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLInputElement && el.type === 'text')
      ) {
        const start = el.selectionStart ?? el.value.length
        const end = el.selectionEnd ?? el.value.length
        const v = el.value
        el.value = v.slice(0, start) + text + v.slice(end)
        el.dispatchEvent(new Event('input', { bubbles: true }))
        return true
      }
      if (el instanceof HTMLElement && el.isContentEditable) {
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
    insertIntoFocused(text)
  }

  function createPanel() {
    const panel = createEl('div', { id: 'uiu-panel' })
    const header = createEl('header')
    header.appendChild(createEl('span', { text: t('header_title') }))
    const actions = createEl('div', { class: 'uiu-actions' })
    const toggleHistoryBtn = createEl('button', { text: t('btn_history') })
    toggleHistoryBtn.addEventListener('click', () => {
      panel.classList.toggle('uiu-show-history')
      renderHistory()
    })
    const settingsBtn = createEl('button', { text: t('btn_settings') })
    settingsBtn.addEventListener('click', () => {
      panel.classList.toggle('uiu-show-settings')
      try {
        refreshSettingsUI()
      } catch {}
    })
    const closeBtn = createEl('button', { text: t('btn_close') })
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none'
    })
    actions.appendChild(toggleHistoryBtn)
    actions.appendChild(settingsBtn)
    actions.appendChild(closeBtn)
    header.appendChild(actions)

    const body = createEl('div', { class: 'uiu-body' })
    const controls = createEl('div', { class: 'uiu-controls' })

    const format = getFormat()
    const formatSel = createEl('select')
    ;[
      ['markdown', t('format_markdown')],
      ['html', t('format_html')],
      ['bbcode', t('format_bbcode')],
      ['link', t('format_link')],
    ].forEach(([val, label]) => {
      const opt = createEl('option', { value: val, text: label })
      if (val === format) opt.selected = true
      formatSel.appendChild(opt)
    })
    formatSel.addEventListener('change', () => setFormat(formatSel.value))

    const host = getHost()
    const hostSel = createEl('select')
    ;[
      ['imgur', t('host_imgur')],
      ['tikolu', t('host_tikolu')],
    ].forEach(([val, label]) => {
      const optH = createEl('option', { value: val, text: label })
      if (val === host) optH.selected = true
      hostSel.appendChild(optH)
    })
    hostSel.addEventListener('change', () => {
      setHost(hostSel.value)
      updateProxyState()
    })

    const proxy = getProxy()
    const proxySel = createEl('select')
    ;[
      ['none', t('proxy_none')],
      ['wsrv.nl', t('proxy_wsrv_nl')],
    ].forEach(([val, label]) => {
      const optP = createEl('option', { value: val, text: label })
      if (val === proxy) optP.selected = true
      proxySel.appendChild(optP)
    })
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

    controls.appendChild(formatSel)
    controls.appendChild(hostSel)
    controls.appendChild(proxySel)
    controls.appendChild(selectBtn)
    controls.appendChild(progressEl)
    body.appendChild(controls)

    const list = createEl('div', { class: 'uiu-list' })
    body.appendChild(list)

    const hint = createEl('div', {
      class: 'uiu-hint',
      text: t('hint_text'),
    })
    body.appendChild(hint)

    const history = createEl('div', { class: 'uiu-history' })
    body.appendChild(history)

    const settings = createEl('div', { class: 'uiu-settings' })
    const settingsHeader = createEl('div', { class: 'uiu-controls' })
    settingsHeader.appendChild(
      createEl('span', { text: t('settings_section_title') })
    )
    settings.appendChild(settingsHeader)
    const settingsForm = createEl('div', { class: 'uiu-controls' })
    const selInput = createEl('input', {
      type: 'text',
      placeholder: t('placeholder_css_selector'),
    })
    const posSel = createEl('select')
    ;[
      { value: 'before', text: t('pos_before') },
      { value: 'after', text: t('pos_after') },
      { value: 'inside', text: t('pos_inside') },
    ].forEach(({ value, text }) => {
      const opt = createEl('option', { value, text })
      if (value === 'after') opt.selected = true
      posSel.appendChild(opt)
    })
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
      Array.from(posSel.options).forEach((opt) => {
        opt.selected = opt.value === 'after'
      })
      textInput.value = t('insert_image_button_default')
      renderSettingsList()

      document.querySelectorAll('.uiu-insert-btn').forEach((el) => el.remove())
      applySiteButtons()
      try {
        restartSiteButtonObserver()
      } catch {}
    })
    const removeBtn = createEl('button', { text: t('btn_remove_button_temp') })
    removeBtn.addEventListener('click', () => {
      document.querySelectorAll('.uiu-insert-btn').forEach((el) => el.remove())
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch {}
    })
    const clearBtn = createEl('button', { text: t('btn_clear_settings') })
    clearBtn.addEventListener('click', () => {
      setSiteBtnSettingsList([])
      renderSettingsList()
      document.querySelectorAll('.uiu-insert-btn').forEach((el) => el.remove())
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch {}
    })
    const settingsList = createEl('div', { class: 'uiu-settings-list' })
    settings.appendChild(settingsList)
    settingsForm.appendChild(selInput)
    settingsForm.appendChild(posSel)
    settingsForm.appendChild(textInput)
    settingsForm.appendChild(saveBtn)
    settingsForm.appendChild(removeBtn)
    settingsForm.appendChild(clearBtn)
    settings.appendChild(settingsForm)
    body.appendChild(settings)

    function renderSettingsList() {
      settingsList.innerHTML = ''
      const listData = getSiteBtnSettingsList()
      listData.forEach((cfg, idx) => {
        const row = createEl('div', { class: 'uiu-settings-row' })
        const info = createEl('span', {
          class: 'uiu-settings-item',
          text: `${cfg.selector} [${cfg.position || 'after'}] - ${cfg.text || t('insert_image_button_default')}`,
        })
        const editBtn = createEl('button', { text: t('btn_edit') })
        editBtn.addEventListener('click', () => {
          row.innerHTML = ''
          row.classList.add('uiu-editing')
          const fields = createEl('span', { class: 'uiu-settings-item' })
          const eSel = createEl('input', { type: 'text' })
          eSel.value = cfg.selector || ''
          const ePos = createEl('select')
          ;[
            { value: 'before', text: t('pos_before') },
            { value: 'after', text: t('pos_after') },
            { value: 'inside', text: t('pos_inside') },
          ].forEach(({ value, text }) => {
            const opt = createEl('option', { value, text })
            if (value === (cfg.position || 'after')) opt.selected = true
            ePos.appendChild(opt)
          })
          const eText = createEl('input', { type: 'text' })
          eText.value = cfg.text || t('insert_image_button_default')
          fields.appendChild(eSel)
          fields.appendChild(ePos)
          fields.appendChild(eText)
          const ops = createEl('span', { class: 'uiu-ops' })
          const updateBtn = createEl('button', { text: t('btn_update') })
          updateBtn.addEventListener('click', () => {
            updateSiteBtnSetting(idx, {
              selector: eSel.value,
              position: ePos.value,
              text: eText.value,
            })
            renderSettingsList()
            document
              .querySelectorAll('.uiu-insert-btn')
              .forEach((el) => el.remove())
            applySiteButtons()
            try {
              restartSiteButtonObserver()
            } catch {}
          })
          const cancelBtn = createEl('button', { text: t('btn_cancel') })
          cancelBtn.addEventListener('click', () => {
            renderSettingsList()
          })
          ops.appendChild(updateBtn)
          ops.appendChild(cancelBtn)
          row.appendChild(fields)
          row.appendChild(ops)
        })
        const delBtn = createEl('button', { text: t('btn_delete') })
        delBtn.addEventListener('click', () => {
          removeSiteBtnSetting(idx)
          renderSettingsList()
          document
            .querySelectorAll('.uiu-insert-btn')
            .forEach((el) => el.remove())
          applySiteButtons()
          try {
            restartSiteButtonObserver()
          } catch {}
        })
        row.appendChild(info)
        const ops = createEl('span', { class: 'uiu-ops' })
        ops.appendChild(editBtn)
        ops.appendChild(delBtn)
        row.appendChild(ops)
        settingsList.appendChild(row)
      })
    }

    function refreshSettingsUI() {
      selInput.value = ''
      Array.from(posSel.options).forEach((opt) => {
        opt.selected = opt.value === 'after'
      })
      textInput.value = t('insert_image_button_default')
      renderSettingsList()
    }

    panel.appendChild(header)
    panel.appendChild(body)
    document.body.appendChild(panel)

    panel.style.display = 'none'

    function applySingle(cfg) {
      if (!cfg?.selector) return
      let targets
      try {
        targets = document.querySelectorAll(cfg.selector)
      } catch (e) {
        return
      }
      if (!targets || !targets.length) return
      const posRaw = (cfg.position || '').trim()
      const pos =
        posRaw === 'before'
          ? 'before'
          : posRaw === 'inside'
            ? 'inside'
            : 'after'
      const content = (cfg.text || t('insert_image_button_default')).trim()
      Array.from(targets).forEach((target) => {
        const exists =
          pos === 'inside'
            ? !!target.querySelector('.uiu-insert-btn')
            : pos === 'before'
              ? !!(
                  target.previousElementSibling &&
                  target.previousElementSibling.classList?.contains(
                    'uiu-insert-btn'
                  )
                )
              : !!(
                  target.nextElementSibling &&
                  target.nextElementSibling.classList?.contains(
                    'uiu-insert-btn'
                  )
                )
        if (exists) return
        let btn
        try {
          const tEl = document.createElement('template')
          tEl.innerHTML = content
          if (tEl.content && tEl.content.childElementCount === 1) {
            btn = tEl.content.firstElementChild
          }
        } catch {}
        if (!btn) {
          btn = createEl('button', {
            class: 'uiu-insert-btn uiu-default',
            text: content,
          })
        } else {
          btn.classList.add('uiu-insert-btn')
        }
        btn.addEventListener('click', (event) => {
          panel.style.display = 'block'
          event.preventDefault()
          try {
            openFilePicker()
          } catch {}
        })
        if (pos === 'before') {
          target.insertAdjacentElement('beforebegin', btn)
        } else if (pos === 'inside') {
          target.insertAdjacentElement('beforeend', btn)
        } else {
          target.insertAdjacentElement('afterend', btn)
        }
      })
    }
    function applySiteButtons() {
      const list = getSiteBtnSettingsList()
      list.forEach((cfg) => {
        try {
          applySingle(cfg)
        } catch {}
      })
    }
    applySiteButtons()

    let siteBtnObserver
    function restartSiteButtonObserver() {
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch {}
      const list = getSiteBtnSettingsList()
      if (!list.length) {
        siteBtnObserver = null
        return
      }
      const checkAndInsertAll = () => {
        list.forEach((cfg) => {
          try {
            applySingle(cfg)
          } catch {}
        })
      }
      checkAndInsertAll()
      siteBtnObserver = new MutationObserver(() => checkAndInsertAll())
      siteBtnObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      })
    }
    restartSiteButtonObserver()

    const drop = createEl('div', { id: 'uiu-drop', text: t('drop_overlay') })
    document.body.appendChild(drop)

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
      while (running < CONCURRENCY && queue.length) {
        const item = queue.shift()
        running++
        addLog(`${t('log_uploading')}${item.file.name}`)
        try {
          const link = await uploadImage(item.file)
          const fmt = getFormat()
          const out = formatText(
            applyProxy(link, getHost()),
            item.file.name,
            fmt
          )
          copyAndInsert(out)
          addToHistory({
            link,
            name: item.file.name,
            ts: Date.now(),
            pageUrl: location.href,
            provider: getHost(),
          })
          addLog(`${t('log_success')}${item.file.name} → ${link}`)
        } catch (e) {
          addLog(`${t('log_failed')}${item.file.name}（${e?.message || e}）`)
        } finally {
          running--
          done++
          updateProgress()
        }
      }
    }

    function handleFiles(files) {
      const imgs = files.filter((f) => f.type.includes('image'))
      if (!imgs.length) return
      total += imgs.length
      updateProgress()
      imgs.forEach((file) => queue.push({ file }))
      processQueue()
    }

    document.addEventListener(
      'paste',
      (event) => {
        const items = event.clipboardData?.items
        if (!items) return
        const imageItem = Array.from(items).find((i) =>
          i.type.includes('image')
        )
        const file = imageItem?.getAsFile()
        if (file) handleFiles([file])
      },
      true
    )

    document.addEventListener('dragover', (e) => {
      const dt = e.dataTransfer
      const types = dt?.types ? Array.from(dt.types) : []
      const hasFileType =
        types.includes('Files') || dt?.types?.contains?.('Files')
      const hasFileItem = dt?.items
        ? Array.from(dt.items).some((it) => it.kind === 'file')
        : false
      if (hasFileType || hasFileItem) {
        drop.classList.add('show')
        e.preventDefault()
      } else {
        drop.classList.remove('show')
      }
    })
    document.addEventListener('dragleave', () => drop.classList.remove('show'))
    document.addEventListener('drop', (event) => {
      drop.classList.remove('show')
      event.preventDefault()
      const files = event.dataTransfer?.files
      if (files?.length) handleFiles(Array.from(files))
    })

    function renderHistory() {
      history.innerHTML = ''
      const header = createEl('div', { class: 'uiu-controls' })
      header.appendChild(
        createEl('span', {
          text: tpl(t('btn_history_count'), { count: loadHistory().length }),
        })
      )
      const clearBtn = createEl('button', { text: t('btn_clear_history') })
      clearBtn.addEventListener('click', () => {
        saveHistory([])
        renderHistory()
      })
      header.appendChild(clearBtn)
      history.appendChild(header)

      const listWrap = createEl('div', { class: 'uiu-list' })
      const items = loadHistory()
      items.forEach((it) => {
        const row = createEl('div', { class: 'uiu-row' })

        const preview = createEl('img', {
          src: applyProxy(
            it.link,
            it.provider || (isImgurUrl(it.link) ? 'imgur' : 'other')
          ),
          style:
            'width:48px;height:48px;object-fit:cover;border-radius:4px;border:1px solid #334155;',
        })
        row.appendChild(preview)

        const info = createEl('div', {
          style:
            'flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding:0 8px;',
        })
        info.appendChild(
          createEl('span', {
            class: 'uiu-name',
            text: it.name || it.link,
            title: it.name || it.link,
          })
        )
        try {
          const providerKey = it.provider || 'imgur'
          const providerText = t('host_' + providerKey)
          info.appendChild(
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
          info.appendChild(pageLink)
        }
        row.appendChild(info)

        const ops = createEl('div', { class: 'uiu-ops' })
        const copyBtn = createEl('button', { text: t('btn_copy') })
        copyBtn.addEventListener('click', () => {
          const fmt = getFormat()
          const proxied = applyProxy(
            it.link,
            it.provider || (isImgurUrl(it.link) ? 'imgur' : 'other')
          )
          const out = formatText(
            proxied,
            it.name || t('default_image_name'),
            fmt
          )
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
        ops.appendChild(copyBtn)
        ops.appendChild(openBtn)
        row.appendChild(ops)
        listWrap.appendChild(row)
      })
      history.appendChild(listWrap)
    }

    try {
      if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener(
          HISTORY_KEY,
          function (name, oldValue, newValue, remote) {
            renderHistory()
          }
        )
      }
    } catch {}

    GM_registerMenuCommand(t('menu_open_panel'), () => {
      panel.style.display = 'block'
    })
    GM_registerMenuCommand(t('menu_select_images'), () => {
      panel.style.display = 'block'
      openFilePicker()
    })
    GM_registerMenuCommand(t('menu_settings'), () => {
      panel.style.display = 'block'
      panel.classList.add('uiu-show-settings')
      try {
        refreshSettingsUI()
      } catch {}
    })

    return { handleFiles }
  }

  if (!document.getElementById('uiu-panel')) {
    const { handleFiles } = createPanel()

    window.addEventListener('iu:uploadFiles', (e) => {
      const files = e.detail?.files
      if (files?.length) handleFiles(files)
    })
  }
})()
