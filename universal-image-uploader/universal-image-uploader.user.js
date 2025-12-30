// ==UserScript==
// @name                 Universal Image Uploader
// @name:zh-CN           通用图片上传助手
// @name:zh-TW           通用圖片上傳助手
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.8.2
// @description          Paste/drag/select images, batch upload to Imgur/Tikolu/MJJ.Today/Appinn; auto-copy Markdown/HTML/BBCode/link; site button integration with SPA observer; local history.
// @description:zh-CN    通用图片上传与插入：支持粘贴/拖拽/选择，批量上传至 Imgur/Tikolu/MJJ.Today/Appinn；自动复制 Markdown/HTML/BBCode/链接；可为各站点插入按钮并适配 SPA；保存本地历史。
// @description:zh-TW    通用圖片上傳與插入：支援貼上/拖曳/選擇，批次上傳至 Imgur/Tikolu/MJJ.Today/Appinn；自動複製 Markdown/HTML/BBCode/連結；可為各站點插入按鈕並適配 SPA；保存本地歷史。
// @author               Pipecraft
// @license              MIT
// @icon                 data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSI+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTAiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTMyIDIwbC0xMiAxMmg3djE4aDEwVjMyaDdsLTEyLTEyeiIgZmlsbD0iIzFmMjkzNyIvPjwvc3ZnPg==
// @match                https://*.v2ex.com/*
// @match                https://*.v2ex.co/*
// @match                https://greasyfork.org/*
// @match                https://www.nodeseek.com/*
// @match                https://www.deepflood.com/*
// @match                https://2libra.com/*
// @match                *://*/*
// @connect              api.imgur.com
// @connect              tikolu.net
// @connect              mjj.today
// @connect              h1.appinn.me
// @grant                GM_registerMenuCommand
// @grant                GM_info
// @grant                GM.info
// @grant                GM.addValueChangeListener
// @grant                GM_addValueChangeListener
// @grant                GM.getValue
// @grant                GM_getValue
// @grant                GM.setValue
// @grant                GM_setValue
// @grant                GM.deleteValue
// @grant                GM_deleteValue
// @grant                GM_addStyle
// @grant                GM.xmlHttpRequest
// @grant                GM_xmlhttpRequest
// @grant                GM_setClipboard
// ==/UserScript==
//
;(() => {
  'use strict'
  var __defProp = Object.defineProperty
  var __getOwnPropSymbols = Object.getOwnPropertySymbols
  var __hasOwnProp = Object.prototype.hasOwnProperty
  var __propIsEnum = Object.prototype.propertyIsEnumerable
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value)
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop])
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop])
      }
    return a
  }
  var win = globalThis
  function isTopFrame() {
    return win.self === win.top
  }
  function registerMenu(caption, onClick, options) {
    if (typeof GM_registerMenuCommand === 'function') {
      return GM_registerMenuCommand(caption, onClick, options)
    }
    return 0
  }
  function deepEqual(a, b) {
    if (a === b) {
      return true
    }
    if (
      typeof a !== 'object' ||
      a === null ||
      typeof b !== 'object' ||
      b === null
    ) {
      return false
    }
    if (Array.isArray(a) !== Array.isArray(b)) {
      return false
    }
    if (Array.isArray(a)) {
      if (a.length !== b.length) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) {
          return false
        }
      }
      return true
    }
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) {
      return false
    }
    for (const key of keysA) {
      if (
        !Object.prototype.hasOwnProperty.call(b, key) ||
        !deepEqual(a[key], b[key])
      ) {
        return false
      }
    }
    return true
  }
  var valueChangeListeners = /* @__PURE__ */ new Map()
  var valueChangeListenerIdCounter = 0
  var valueChangeBroadcastChannel = new BroadcastChannel(
    'gm_value_change_channel'
  )
  var lastKnownValues = /* @__PURE__ */ new Map()
  var pollingIntervalId = null
  function startPolling() {
    if (pollingIntervalId || isNativeListenerSupported) return
    pollingIntervalId = setInterval(async () => {
      const keys = new Set(
        Array.from(valueChangeListeners.values()).map((l) => l.key)
      )
      for (const key of keys) {
        const newValue = await getValue(key)
        if (!lastKnownValues.has(key)) {
          lastKnownValues.set(key, newValue)
          continue
        }
        const oldValue = lastKnownValues.get(key)
        if (!deepEqual(oldValue, newValue)) {
          lastKnownValues.set(key, newValue)
          triggerValueChangeListeners(key, oldValue, newValue, true)
          valueChangeBroadcastChannel.postMessage({ key, oldValue, newValue })
        }
      }
    }, 1500)
  }
  var getScriptHandler = () => {
    if (typeof GM_info !== 'undefined') {
      return GM_info.scriptHandler || ''
    }
    if (typeof GM !== 'undefined' && GM.info) {
      return GM.info.scriptHandler || ''
    }
    return ''
  }
  var scriptHandler = getScriptHandler().toLowerCase()
  var isIgnoredHandler =
    scriptHandler === 'tamp' || scriptHandler.includes('stay')
  var isNativeListenerSupported =
    !isIgnoredHandler &&
    ((typeof GM !== 'undefined' &&
      typeof GM.addValueChangeListener === 'function') ||
      typeof GM_addValueChangeListener === 'function')
  function triggerValueChangeListeners(key, oldValue, newValue, remote) {
    const list = Array.from(valueChangeListeners.values()).filter(
      (l) => l.key === key
    )
    for (const l of list) {
      l.callback(key, oldValue, newValue, remote)
    }
  }
  valueChangeBroadcastChannel.addEventListener('message', (event) => {
    const { key, oldValue, newValue } = event.data
    lastKnownValues.set(key, newValue)
    triggerValueChangeListeners(key, oldValue, newValue, true)
  })
  async function getValue(key, defaultValue) {
    if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
      return GM.getValue(key, defaultValue)
    }
    if (typeof GM_getValue === 'function') {
      return GM_getValue(key, defaultValue)
    }
    return defaultValue
  }
  async function updateValue(key, newValue, updater) {
    let oldValue
    if (!isNativeListenerSupported) {
      oldValue = await getValue(key)
    }
    await updater()
    if (!isNativeListenerSupported) {
      if (deepEqual(oldValue, newValue)) {
        return
      }
      lastKnownValues.set(key, newValue)
      triggerValueChangeListeners(key, oldValue, newValue, false)
      valueChangeBroadcastChannel.postMessage({ key, oldValue, newValue })
    }
  }
  async function setValue(key, value) {
    await updateValue(key, value, async () => {
      if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
        await GM.setValue(key, value)
      } else if (typeof GM_setValue === 'function') {
        GM_setValue(key, value)
      }
    })
  }
  async function deleteValue(key) {
    await updateValue(key, void 0, async () => {
      if (typeof GM !== 'undefined' && typeof GM.deleteValue === 'function') {
        await GM.deleteValue(key)
      } else if (typeof GM_deleteValue === 'function') {
        GM_deleteValue(key)
      }
    })
  }
  async function addValueChangeListener(key, callback) {
    if (isNativeListenerSupported) {
      if (
        typeof GM !== 'undefined' &&
        typeof GM.addValueChangeListener === 'function'
      ) {
        return GM.addValueChangeListener(key, callback)
      }
      if (typeof GM_addValueChangeListener === 'function') {
        return GM_addValueChangeListener(key, callback)
      }
    }
    const id = ++valueChangeListenerIdCounter
    valueChangeListeners.set(id, { key, callback })
    if (!lastKnownValues.has(key)) {
      void getValue(key).then((v) => {
        lastKnownValues.set(key, v)
      })
    }
    startPolling()
    return id
  }
  var CONFIG = {
    localhost: {
      enabled: true,
      pasteEnabled: true,
      dragAndDropEnabled: true,
      format: 'markdown',
      host: 'imgur',
      proxy: 'none',
      buttons: [
        {
          selector: 'textarea',
          position: 'after',
          text: '\u63D2\u5165\u56FE\u7247',
        },
      ],
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
          text: '<a style="padding-left: 10px;"> + \u63D2\u5165\u56FE\u7247</a>',
        },
        {
          selector: '#tab-preview',
          position: 'after',
          text: '<a class="tab-alt"> + \u63D2\u5165\u56FE\u7247</a>',
        },
        {
          selector: 'button[onclick^="previewTopicContent"]',
          position: 'before',
          text: '<button type="button" class="super normal button" style="margin-right: 12px;"><li class="fa fa-plus"></li> &nbsp;\u63D2\u5165\u56FE\u7247</button>',
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
          selector:
            '#editor-body > div.mde-toolbar > .toolbar-item:last-of-type',
          position: 'after',
          text: '\u63D2\u5165\u56FE\u7247',
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
          selector:
            '#editor-body > div.mde-toolbar > .toolbar-item:last-of-type',
          position: 'after',
          text: '\u63D2\u5165\u56FE\u7247',
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
          text: '\u63D2\u5165\u56FE\u7247',
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
          text: '<button class="btn no-text btn-icon toolbar__button upload-extended" tabindex="-1" title="\u4E0A\u4F20" type="button" style="display: inline-flex; color: orangered;">\n<svg class="fa d-icon d-icon-far-image svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-image"></use></svg>      <span aria-hidden="true"></span>\n    </button>',
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
  var I18N = {
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
      log_success: '\u2705 Success: ',
      log_failed: '\u274C Failed: ',
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
      header_title: '\u901A\u7528\u56FE\u7247\u4E0A\u4F20\u52A9\u624B',
      btn_history: '\u5386\u53F2',
      btn_settings: '\u8BBE\u7F6E',
      btn_close: '\u5173\u95ED',
      format_markdown: 'Markdown',
      format_html: 'HTML',
      format_bbcode: 'BBCode',
      format_link: '\u94FE\u63A5',
      host_imgur: 'Imgur',
      host_tikolu: 'Tikolu',
      host_mjj: 'MJJ.Today',
      host_appinn: 'Appinn',
      btn_select_images: '\u9009\u62E9\u56FE\u7247',
      progress_initial: '\u5B8C\u6210 0/0',
      progress_done: '\u5B8C\u6210 {done}/{total}',
      hint_text:
        '\u652F\u6301\u7C98\u8D34\u56FE\u7247\u3001\u62D6\u62FD\u56FE\u7247\u5230\u9875\u9762\u6216\u70B9\u51FB\u9009\u62E9\u56FE\u7247\u8FDB\u884C\u6279\u91CF\u4E0A\u4F20',
      settings_section_title: '\u8BBE\u7F6E',
      settings_site_buttons: '\u7AD9\u70B9\u6309\u94AE\u8BBE\u7F6E',
      placeholder_css_selector: 'CSS \u9009\u62E9\u5668',
      pos_before: '\u4E4B\u524D',
      pos_after: '\u4E4B\u540E',
      pos_inside: '\u91CC\u9762',
      placeholder_button_content:
        '\u6309\u94AE\u5185\u5BB9\uFF08\u53EF\u4E3A HTML\uFF09',
      insert_image_button_default: '\u63D2\u5165\u56FE\u7247',
      btn_save_and_insert: '\u4FDD\u5B58\u5E76\u63D2\u5165',
      btn_remove_button_temp:
        '\u79FB\u9664\u6309\u94AE\uFF08\u4E34\u65F6\uFF09',
      btn_clear_settings: '\u6E05\u7A7A\u8BBE\u7F6E',
      drop_overlay: '\u91CA\u653E\u4EE5\u4E0A\u4F20\u56FE\u7247',
      log_uploading: '\u4E0A\u4F20\u4E2D\uFF1A',
      log_success: '\u2705 \u6210\u529F\uFF1A',
      log_failed: '\u274C \u5931\u8D25\uFF1A',
      btn_copy: '\u590D\u5236',
      btn_open: '\u6253\u5F00',
      btn_delete: '\u5220\u9664',
      btn_edit: '\u7F16\u8F91',
      btn_update: '\u66F4\u65B0',
      btn_cancel: '\u53D6\u6D88',
      menu_open_panel: '\u6253\u5F00\u56FE\u7247\u4E0A\u4F20\u9762\u677F',
      menu_select_images: '\u9009\u62E9\u56FE\u7247',
      menu_settings: '\u8BBE\u7F6E',
      menu_enable_site: '\u4E3A\u6B64\u7AD9\u70B9\u542F\u7528\u4E0A\u4F20',
      menu_disable_site: '\u4E3A\u6B64\u7AD9\u70B9\u7981\u7528\u4E0A\u4F20',
      toggle_paste_enabled: '\u542F\u7528\u7C98\u8D34\u4E0A\u4F20',
      toggle_drag_enabled: '\u542F\u7528\u62D6\u62FD\u4E0A\u4F20',
      formats_section_title: '\u81EA\u5B9A\u4E49\u683C\u5F0F',
      placeholder_format_name: '\u683C\u5F0F\u540D\u79F0',
      placeholder_format_template: '\u683C\u5F0F\u5185\u5BB9',
      example_format_template: '\u793A\u4F8B\uFF1A{name} - {link}',
      btn_add_format: '\u6DFB\u52A0\u683C\u5F0F',
      formats_col_name: '\u540D\u5B57',
      formats_col_template: '\u683C\u5F0F',
      formats_col_ops: '\u64CD\u4F5C',
      history_upload_page_prefix: '\u4E0A\u4F20\u9875\u9762\uFF1A',
      history_upload_page: '\u4E0A\u4F20\u9875\u9762\uFF1A{host}',
      btn_history_count: '\u5386\u53F2\uFF08{count}\uFF09',
      btn_clear_history: '\u6E05\u7A7A',
      default_image_name: '\u56FE\u7247',
      proxy_none: '\u65E0\u4EE3\u7406',
      proxy_wsrv_nl: 'wsrv.nl',
      error_network: '\u7F51\u7EDC\u9519\u8BEF',
      error_upload_failed: '\u4E0A\u4F20\u5931\u8D25',
      placeholder_uploading: '\u6B63\u5728\u4E0A\u4F20\u300C{name}\u300D...',
      placeholder_upload_failed: '\u4E0A\u4F20\u5931\u8D25\uFF1A{name}',
    },
    'zh-TW': {
      header_title: '\u901A\u7528\u5716\u7247\u4E0A\u50B3\u52A9\u624B',
      btn_history: '\u6B77\u53F2',
      btn_settings: '\u8A2D\u5B9A',
      btn_close: '\u95DC\u9589',
      format_markdown: 'Markdown',
      format_html: 'HTML',
      format_bbcode: 'BBCode',
      format_link: '\u9023\u7D50',
      host_imgur: 'Imgur',
      host_tikolu: 'Tikolu',
      host_mjj: 'MJJ.Today',
      host_appinn: 'Appinn',
      btn_select_images: '\u9078\u64C7\u5716\u7247',
      progress_initial: '\u5B8C\u6210 0/0',
      progress_done: '\u5B8C\u6210 {done}/{total}',
      hint_text:
        '\u652F\u63F4\u8CBC\u4E0A\u3001\u62D6\u66F3\u5716\u7247\u5230\u9801\u9762\u6216\u9EDE\u64CA\u9078\u64C7\u6A94\u6848\u9032\u884C\u6279\u6B21\u4E0A\u50B3',
      settings_section_title: '\u8A2D\u5B9A',
      settings_site_buttons: '\u7AD9\u9EDE\u6309\u9215\u8A2D\u5B9A',
      placeholder_css_selector: 'CSS \u9078\u64C7\u5668',
      pos_before: '\u4E4B\u524D',
      pos_after: '\u4E4B\u5F8C',
      pos_inside: '\u88E1\u9762',
      placeholder_button_content:
        '\u6309\u9215\u5167\u5BB9\uFF08\u53EF\u70BA HTML\uFF09',
      insert_image_button_default: '\u63D2\u5165\u5716\u7247',
      btn_save_and_insert: '\u4FDD\u5B58\u4E26\u63D2\u5165',
      btn_remove_button_temp:
        '\u79FB\u9664\u6309\u9215\uFF08\u66AB\u6642\uFF09',
      btn_clear_settings: '\u6E05\u7A7A\u8A2D\u5B9A',
      drop_overlay: '\u653E\u958B\u4EE5\u4E0A\u50B3\u5716\u7247',
      log_uploading: '\u4E0A\u50B3\u4E2D\uFF1A',
      log_success: '\u2705 \u6210\u529F\uFF1A',
      log_failed: '\u274C \u5931\u6557\uFF1A',
      btn_copy: '\u8907\u88FD',
      btn_open: '\u6253\u958B',
      btn_delete: '\u522A\u9664',
      btn_edit: '\u7DE8\u8F2F',
      btn_update: '\u66F4\u65B0',
      btn_cancel: '\u53D6\u6D88',
      menu_open_panel: '\u6253\u958B\u5716\u7247\u4E0A\u50B3\u9762\u677F',
      menu_select_images: '\u9078\u64C7\u5716\u7247',
      menu_settings: '\u8A2D\u5B9A',
      menu_enable_site: '\u70BA\u6B64\u7AD9\u9EDE\u555F\u7528\u4E0A\u50B3',
      menu_disable_site: '\u70BA\u6B64\u7AD9\u9EDE\u505C\u7528\u4E0A\u50B3',
      toggle_paste_enabled: '\u555F\u7528\u8CBC\u4E0A\u4E0A\u50B3',
      toggle_drag_enabled: '\u555F\u7528\u62D6\u66F3\u4E0A\u50B3',
      formats_section_title: '\u81EA\u8A02\u683C\u5F0F',
      placeholder_format_name: '\u683C\u5F0F\u540D\u7A31',
      placeholder_format_template: '\u683C\u5F0F\u5167\u5BB9',
      example_format_template: '\u7BC4\u4F8B\uFF1A{name} - {link}',
      btn_add_format: '\u65B0\u589E\u683C\u5F0F',
      formats_col_name: '\u540D\u7A31',
      formats_col_template: '\u683C\u5F0F',
      formats_col_ops: '\u64CD\u4F5C',
      history_upload_page_prefix: '\u4E0A\u50B3\u9801\u9762\uFF1A',
      history_upload_page: '\u4E0A\u50B3\u9801\u9762\uFF1A{host}',
      btn_history_count: '\u6B77\u53F2\uFF08{count}\uFF09',
      btn_clear_history: '\u6E05\u7A7A',
      default_image_name: '\u5716\u7247',
      proxy_none: '\u4E0D\u4F7F\u7528\u4EE3\u7406',
      proxy_wsrv_nl: 'wsrv.nl',
      error_network: '\u7DB2\u8DEF\u932F\u8AA4',
      error_upload_failed: '\u4E0A\u50B3\u5931\u6557',
      placeholder_uploading: '\u6B63\u5728\u4E0A\u50B3\u300C{name}\u300D...',
      placeholder_upload_failed: '\u4E0A\u50B3\u5931\u6557\uFF1A{name}',
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
    } catch (e) {
      return 'en'
    }
  }
  var USER_LANG = detectLanguage()
  function t(key) {
    return (I18N[USER_LANG] && I18N[USER_LANG][key]) || I18N.en[key] || key
  }
  function tpl(str, params) {
    return String(str).replaceAll(/{(\w+)}/g, (_, k) => {
      var _a
      return ''.concat(
        (_a = params == null ? void 0 : params[k]) != null ? _a : ''
      )
    })
  }
  var IMGUR_CLIENT_IDS = [
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
  var HISTORY_KEY = 'uiu_history'
  var FORMAT_MAP_KEY = 'uiu_format_map'
  var BTN_SETTINGS_MAP_KEY = 'uiu_site_btn_settings_map'
  var HOST_MAP_KEY = 'uiu_host_map'
  var PROXY_MAP_KEY = 'uiu_proxy_map'
  var SITE_SETTINGS_MAP_KEY = 'uiu_site_settings_map'
  var CUSTOM_FORMATS_KEY = 'uiu_custom_formats'
  var DEFAULT_FORMAT = 'markdown'
  var DEFAULT_HOST = 'tikolu'
  var DEFAULT_PROXY = 'wsrv.nl'
  var ALLOWED_FORMATS = ['markdown', 'html', 'bbcode', 'link']
  var ALLOWED_HOSTS = ['imgur', 'tikolu', 'mjj', 'appinn']
  var ALLOWED_PROXIES = ['none', 'wsrv.nl']
  var ALLOWED_BUTTON_POSITIONS = ['before', 'inside', 'after']
  var DEFAULT_BUTTON_POSITION = 'after'
  var APPINN_UPLOAD_ENDPOINT = 'https://h1.appinn.me/upload'
  var APPINN_UPLOAD_PARAMS = {
    authCode: 'appinn2',
    serverCompress: false,
    uploadChannel: 'telegram',
    uploadNameType: 'default',
    autoRetry: true,
  }
  async function migrateLegacyStorage() {
    try {
      const maybeMove = async (oldKey, newKey) => {
        const newVal = await getValue(newKey)
        const hasNew = newVal !== void 0
        const oldVal = await getValue(oldKey)
        const hasOld = oldVal !== void 0
        if (!hasNew && hasOld) {
          await setValue(newKey, oldVal)
          try {
            await deleteValue(oldKey)
          } catch (e) {}
        }
      }
      await maybeMove('iu_history', HISTORY_KEY)
      await maybeMove('iu_format_map', FORMAT_MAP_KEY)
      await maybeMove('iu_site_btn_settings_map', BTN_SETTINGS_MAP_KEY)
    } catch (e) {}
  }
  function normalizeHost(h) {
    try {
      h = String(h || '').trim()
      return h.startsWith('www.') ? h.slice(4) : h
    } catch (e) {
      return h
    }
  }
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
  async function getCustomFormats() {
    try {
      const list = (await getValue(CUSTOM_FORMATS_KEY, [])) || []
      if (!Array.isArray(list)) return []
      return list
        .map((it) => ({
          name: String((it == null ? void 0 : it.name) || '').trim(),
          template: String((it == null ? void 0 : it.template) || ''),
        }))
        .filter((it) => it.name && it.template)
    } catch (e) {
      return []
    }
  }
  async function setCustomFormats(list) {
    try {
      const arr = Array.isArray(list) ? list : []
      const normalized = arr
        .map((it) => ({
          name: String((it == null ? void 0 : it.name) || '').trim(),
          template: String((it == null ? void 0 : it.template) || ''),
        }))
        .filter((it) => it.name && it.template)
      const map = /* @__PURE__ */ new Map()
      for (const it of normalized) map.set(it.name, it.template)
      const out = Array.from(map.entries()).map(([name, template]) => ({
        name,
        template,
      }))
      await setValue(CUSTOM_FORMATS_KEY, out)
    } catch (e) {}
  }
  async function upsertCustomFormat(name, template) {
    try {
      name = String(name || '').trim()
      template = String(template || '')
      if (!name || !template) return
      const list = await getCustomFormats()
      const idx = list.findIndex((it) => it.name === name)
      if (idx === -1) {
        list.push({ name, template })
      } else {
        list[idx] = { name, template }
      }
      await setCustomFormats(list)
    } catch (e) {}
  }
  async function removeCustomFormat(name) {
    try {
      name = String(name || '').trim()
      if (!name) return
      const customFormats = await getCustomFormats()
      const list = customFormats.filter((it) => it.name !== name)
      await setCustomFormats(list)
    } catch (e) {}
  }
  async function getAllowedFormats() {
    try {
      const customFormats = await getCustomFormats()
      return [...ALLOWED_FORMATS, ...customFormats.map((f) => f.name)]
    } catch (e) {
      return [...ALLOWED_FORMATS]
    }
  }
  async function ensureAllowedFormat(fmt) {
    return ensureAllowedValue(fmt, await getAllowedFormats(), DEFAULT_FORMAT)
  }
  async function migrateToUnifiedSiteMap() {
    var _a, _b, _c, _d, _e, _f
    try {
      const existing = await getValue(SITE_SETTINGS_MAP_KEY, void 0)
      const siteMap = existing && typeof existing === 'object' ? existing : {}
      const isEmpty = !siteMap || Object.keys(siteMap).length === 0
      if (!isEmpty) return
      const formatMap = (await getValue(FORMAT_MAP_KEY, {})) || {}
      const hostMap = (await getValue(HOST_MAP_KEY, {})) || {}
      const proxyMap = (await getValue(PROXY_MAP_KEY, {})) || {}
      const btnMap = (await getValue(BTN_SETTINGS_MAP_KEY, {})) || {}
      const rawKeys = /* @__PURE__ */ new Set([
        ...Object.keys(formatMap),
        ...Object.keys(hostMap),
        ...Object.keys(proxyMap),
        ...Object.keys(btnMap),
        ...Object.keys(CONFIG || {}),
      ])
      const keys = /* @__PURE__ */ new Set()
      for (const k of rawKeys) keys.add(normalizeHost(k))
      for (const key of keys) {
        if (!key) continue
        const preset = (CONFIG == null ? void 0 : CONFIG[key]) || {}
        const s = siteMap[key] || {}
        if (s.format === void 0) {
          const fmt = (_a = formatMap[key]) != null ? _a : preset.format
          const normalizedFormat = await ensureAllowedFormat(fmt)
          if (normalizedFormat) s.format = normalizedFormat
        }
        if (s.host === void 0) {
          const h = (_b = hostMap[key]) != null ? _b : preset.host
          const normalizedHost = ensureAllowedValue(h, ALLOWED_HOSTS)
          if (normalizedHost) s.host = normalizedHost
        }
        if (s.proxy === void 0) {
          const px = (_c = proxyMap[key]) != null ? _c : preset.proxy
          const resolved = ensureAllowedValue(px, ALLOWED_PROXIES)
          if (resolved && resolved !== 'none') s.proxy = resolved
        }
        if (s.buttons === void 0) {
          const raw =
            (_f =
              (_e = (_d = btnMap[key]) != null ? _d : preset.buttons) != null
                ? _e
                : preset.button) != null
              ? _f
              : []
          const arr = Array.isArray(raw) ? raw : raw ? [raw] : []
          const list = arr
            .map((c) => {
              const selector = String(
                (c == null ? void 0 : c.selector) || ''
              ).trim()
              if (!selector) return null
              const p = String((c == null ? void 0 : c.position) || '').trim()
              const pos = ensureAllowedValue(
                p,
                ALLOWED_BUTTON_POSITIONS,
                DEFAULT_BUTTON_POSITION
              )
              const text = String(
                (c == null ? void 0 : c.text) ||
                  t('insert_image_button_default')
              ).trim()
              return { selector, position: pos, text }
            })
            .filter(Boolean)
          if (list.length > 0) s.buttons = list
        }
        if (Object.keys(s).length > 0) siteMap[key] = s
      }
      await setValue(SITE_SETTINGS_MAP_KEY, siteMap)
      try {
        await deleteValue(FORMAT_MAP_KEY)
        await deleteValue(HOST_MAP_KEY)
        await deleteValue(PROXY_MAP_KEY)
        await deleteValue(BTN_SETTINGS_MAP_KEY)
      } catch (e) {}
    } catch (e) {}
  }
  async function applyPresetConfig() {
    try {
      const siteMap = (await getValue(SITE_SETTINGS_MAP_KEY, {})) || {}
      let changed = false
      for (const [host, preset] of Object.entries(CONFIG || {})) {
        const key = normalizeHost(host)
        if (!key || typeof preset !== 'object') continue
        const s = siteMap[key] || {}
        if (s.format === void 0 && preset.format) {
          const normalizedFormat = ensureAllowedValue(
            preset.format,
            ALLOWED_FORMATS
          )
          if (normalizedFormat) {
            s.format = normalizedFormat
            changed = true
          }
        }
        if (s.host === void 0 && preset.host) {
          const normalizedHost = ensureAllowedValue(preset.host, ALLOWED_HOSTS)
          if (normalizedHost) {
            s.host = normalizedHost
            changed = true
          }
        }
        if (s.proxy === void 0 && preset.proxy) {
          const resolved = ensureAllowedValue(preset.proxy, ALLOWED_PROXIES)
          if (resolved) {
            s.proxy = resolved
            changed = true
          }
        }
        if (s.buttons === void 0) {
          const raw = preset.buttons || preset.button || []
          const arr = Array.isArray(raw) ? raw : raw ? [raw] : []
          const list = arr
            .map((c) => {
              const selector = String(
                (c == null ? void 0 : c.selector) || ''
              ).trim()
              if (!selector) return null
              const p = String((c == null ? void 0 : c.position) || '').trim()
              const pos = ensureAllowedValue(
                p,
                ALLOWED_BUTTON_POSITIONS,
                DEFAULT_BUTTON_POSITION
              )
              const text = String(
                (c == null ? void 0 : c.text) ||
                  t('insert_image_button_default')
              ).trim()
              return { selector, position: pos, text }
            })
            .filter(Boolean)
          if (list.length > 0) {
            s.buttons = list
            changed = true
          }
        }
        if (s.enabled === void 0 && typeof preset.enabled === 'boolean') {
          s.enabled = preset.enabled
          changed = true
        }
        if (
          s.pasteEnabled === void 0 &&
          typeof preset.pasteEnabled === 'boolean'
        ) {
          s.pasteEnabled = preset.pasteEnabled
          changed = true
        }
        if (
          s.dragAndDropEnabled === void 0 &&
          typeof preset.dragAndDropEnabled === 'boolean'
        ) {
          s.dragAndDropEnabled = preset.dragAndDropEnabled
          changed = true
        }
        if (changed) siteMap[key] = s
      }
      if (changed) await setValue(SITE_SETTINGS_MAP_KEY, siteMap)
    } catch (e) {}
  }
  var SITE_KEY = normalizeHost(location.hostname || '')
  var getSiteSettingsMap = async () => getValue(SITE_SETTINGS_MAP_KEY, {})
  var setSiteSettingsMap = async (map) => {
    await setValue(SITE_SETTINGS_MAP_KEY, map)
  }
  var getCurrentSiteSettings = async () => {
    const map = await getSiteSettingsMap()
    return map[SITE_KEY] || {}
  }
  var updateCurrentSiteSettings = async (updater) => {
    const map = await getSiteSettingsMap()
    const key = SITE_KEY
    const current = map[key] || {}
    const partial =
      typeof updater === 'function'
        ? updater(__spreadValues({}, current))
        : __spreadValues({}, updater)
    const next = __spreadValues(__spreadValues({}, current), partial)
    if (Object.prototype.hasOwnProperty.call(next, 'format')) {
      const resolvedFormat = await ensureAllowedFormat(next.format)
      if (resolvedFormat) next.format = resolvedFormat
      else delete next.format
    }
    if (Object.prototype.hasOwnProperty.call(next, 'host')) {
      const resolvedHost = ensureAllowedValue(next.host, ALLOWED_HOSTS)
      if (resolvedHost) next.host = resolvedHost
      else delete next.host
    }
    if (Object.prototype.hasOwnProperty.call(next, 'proxy')) {
      const resolved = ensureAllowedValue(next.proxy, ALLOWED_PROXIES)
      if (resolved) next.proxy = resolved
      else delete next.proxy
    }
    if (Object.prototype.hasOwnProperty.call(next, 'buttons')) {
      const list = next.buttons
      if (!list || !Array.isArray(list) || list.length === 0) {
        delete next.buttons
      }
    }
    if (!next || Object.keys(next).length === 0) {
      if (map[key]) delete map[key]
    } else {
      map[key] = next
    }
    await setSiteSettingsMap(map)
  }
  var getFormat = async () => {
    const s = await getCurrentSiteSettings()
    return s.format || DEFAULT_FORMAT
  }
  var setFormat = async (format) => {
    await updateCurrentSiteSettings({ format })
  }
  var getHost = async () => {
    const s = await getCurrentSiteSettings()
    return s.host || DEFAULT_HOST
  }
  var setHost = async (host) => {
    await updateCurrentSiteSettings({ host })
  }
  var getProxy = async () => {
    const s = await getCurrentSiteSettings()
    return s.proxy || DEFAULT_PROXY
  }
  var setProxy = async (proxy) => {
    await updateCurrentSiteSettings({ proxy })
  }
  var getEnabled = async () => {
    const s = await getCurrentSiteSettings()
    return s.enabled === true
  }
  var setEnabled = async (val) => {
    await updateCurrentSiteSettings({ enabled: Boolean(val) })
  }
  var getPasteEnabled = async () => {
    const s = await getCurrentSiteSettings()
    return s.pasteEnabled === true
  }
  var setPasteEnabled = async (val) => {
    await updateCurrentSiteSettings({ pasteEnabled: Boolean(val) })
  }
  var getDragAndDropEnabled = async () => {
    const s = await getCurrentSiteSettings()
    return s.dragAndDropEnabled === true
  }
  var setDragAndDropEnabled = async (val) => {
    await updateCurrentSiteSettings({ dragAndDropEnabled: Boolean(val) })
  }
  var getSiteBtnSettingsList = async () => {
    const s = await getCurrentSiteSettings()
    const val = s.buttons || []
    return Array.isArray(val)
      ? val
      : (val == null ? void 0 : val.selector)
        ? [val]
        : []
  }
  var setSiteBtnSettingsList = async (list) => {
    await updateCurrentSiteSettings({ buttons: list })
  }
  var addSiteBtnSetting = async (cfg) => {
    const selector = ((cfg == null ? void 0 : cfg.selector) || '').trim()
    if (!selector) return
    const p = ((cfg == null ? void 0 : cfg.position) || '').trim()
    const pos = ensureAllowedValue(
      p,
      ALLOWED_BUTTON_POSITIONS,
      DEFAULT_BUTTON_POSITION
    )
    const text = (
      (cfg == null ? void 0 : cfg.text) || t('insert_image_button_default')
    ).trim()
    const list = await getSiteBtnSettingsList()
    list.push({ selector, position: pos, text })
    await setSiteBtnSettingsList(list)
  }
  var removeSiteBtnSetting = async (index) => {
    const list = await getSiteBtnSettingsList()
    if (index >= 0 && index < list.length) {
      list.splice(index, 1)
      await setSiteBtnSettingsList(list)
    }
  }
  var updateSiteBtnSetting = async (index, cfg) => {
    const list = await getSiteBtnSettingsList()
    if (!list || index < 0 || index >= list.length) return
    const selector = ((cfg == null ? void 0 : cfg.selector) || '').trim()
    if (!selector) return
    const p = ((cfg == null ? void 0 : cfg.position) || '').trim()
    const pos = ensureAllowedValue(
      p,
      ALLOWED_BUTTON_POSITIONS,
      DEFAULT_BUTTON_POSITION
    )
    const text = (
      (cfg == null ? void 0 : cfg.text) || t('insert_image_button_default')
    ).trim()
    list[index] = { selector, position: pos, text }
    await setSiteBtnSettingsList(list)
  }
  var MAX_HISTORY = 50
  var createEl = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag)
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') el.textContent = v
      else if (k === 'class') el.className = v
      else el.setAttribute(k, v)
    }
    for (const c of children) el.append(c)
    return el
  }
  var buildPositionOptions = (selectEl, selectedValue) => {
    if (!selectEl) return
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
  var buildFormatOptions = async (selectEl, selectedValue) => {
    if (!selectEl) return
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
  var buildHostOptions = (selectEl, selectedValue) => {
    if (!selectEl) return
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
  var buildProxyOptions = (selectEl, selectedValue) => {
    if (!selectEl) return
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
  var css =
    '\n  #uiu-panel { position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; width: 440px; max-height: calc(100vh - 32px); overflow: auto; background: #111827cc; color: #fff; backdrop-filter: blur(6px); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.25); font-family: system-ui, -apple-system, Segoe UI, Roboto; font-size: 13px; line-height: 1.5; }\n  #uiu-panel header { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; font-weight: 600; font-size: 16px; background-color: unset; box-shadow: unset; transition: unset; }\n  #uiu-panel header .uiu-actions { display:flex; gap:8px; }\n  #uiu-panel header .uiu-actions button { font-size: 12px; }\n  /* Active styles for toggles when sections are open */\n  #uiu-panel header.uiu-show-history .uiu-actions .uiu-toggle-history { background:#2563eb; border-color:#1d4ed8; box-shadow: 0 0 0 1px #1d4ed8 inset; color:#fff; }\n  #uiu-panel header.uiu-show-settings .uiu-actions .uiu-toggle-settings { background:#2563eb; border-color:#1d4ed8; box-shadow: 0 0 0 1px #1d4ed8 inset; color:#fff; }\n  #uiu-panel .uiu-body { padding: 8px 12px; }\n  #uiu-panel .uiu-controls { display:flex; align-items:center; gap:8px; flex-wrap: wrap; }\n  #uiu-panel select, #uiu-panel button { font-size: 12px; padding: 6px 10px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; }\n  #uiu-panel button.uiu-primary { background:#2563eb; border-color:#1d4ed8; }\n  #uiu-panel .uiu-list { margin-top:8px; max-height: 140px; overflow-y:auto; overflow-x:hidden; font-size: 12px; }\n  #uiu-panel .uiu-list .uiu-item { padding:6px 0; border-bottom: 1px dashed #334155; white-space: normal; word-break: break-word; overflow-wrap: anywhere; }\n  #uiu-panel .uiu-history { display:none; margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }\n  #uiu-panel header.uiu-show-history + .uiu-body .uiu-history { display:block; }\n  #uiu-panel .uiu-history .uiu-controls > span { font-size: 16px; font-weight: 600;}\n  #uiu-panel .uiu-history .uiu-list { max-height: 240px; }\n  #uiu-panel .uiu-history .uiu-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; }\n  #uiu-panel .uiu-history .uiu-row .uiu-ops { display:flex; gap:6px; }\n  #uiu-panel .uiu-history .uiu-row .uiu-name { display:block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n  #uiu-panel .uiu-hint { font-size: 11px; opacity:.85; margin-top:6px; }\n  /* Settings container toggling */\n  #uiu-panel .uiu-settings-container { display:none; margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }\n  #uiu-panel header.uiu-show-settings + .uiu-body .uiu-settings-container { display:block; }\n  #uiu-panel .uiu-settings .uiu-controls > span { font-size: 16px; font-weight: 600;}\n  #uiu-panel .uiu-settings .uiu-controls > .uiu-subtitle { font-size: 13px; font-weight: 600; }\n  #uiu-panel .uiu-settings .uiu-settings-list { margin-top:6px; max-height: 240px; overflow-y:auto; overflow-x:hidden; }\n  #uiu-panel .uiu-settings .uiu-settings-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; font-size: 12px; flex-wrap: nowrap; }\n  #uiu-panel .uiu-settings .uiu-settings-row .uiu-settings-item { flex:1; display:flex; align-items:center; gap:6px; min-width:0; }\n  #uiu-panel .uiu-settings .uiu-settings-row .uiu-settings-item input[type="text"] { flex:1; min-width:0; }\n  #uiu-panel .uiu-settings .uiu-settings-row .uiu-settings-item select { flex:0 0 auto; }\n  #uiu-panel .uiu-settings .uiu-settings-row .uiu-ops { display:flex; gap:6px; flex-shrink:0; white-space:nowrap; }\n  #uiu-drop { position: fixed; inset: 0; background: rgba(37,99,235,.12); border: 2px dashed #2563eb; display:none; align-items:center; justify-content:center; z-index: 999998; color:#2563eb; font-size: 18px; font-weight: 600; }\n  #uiu-drop.show { display:flex; }\n  .uiu-insert-btn { cursor:pointer; }\n  .uiu-insert-btn.uiu-default { font-size: 12px; padding: 4px 8px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; cursor:pointer; }\n  /* Hover effects for all buttons */\n  #uiu-panel button { transition: background-color .12s ease, box-shadow .12s ease, transform .06s ease, opacity .12s ease, border-color .12s ease; }\n  #uiu-panel button:hover { background:#334155; border-color:#475569; box-shadow: 0 0 0 1px #475569 inset; transform: translateY(-0.5px); }\n  #uiu-panel button.uiu-primary:hover { background:#1d4ed8; border-color:#1e40af; }\n  #uiu-panel button:active { transform: translateY(0); }\n  /* Disabled style for proxy selector */\n  #uiu-panel select:disabled { opacity:.55; cursor:not-allowed; filter: grayscale(80%); background:#111827; color:#9ca3af; border-color:#475569; }\n  /* Custom Formats layout */\n  #uiu-panel .uiu-formats { margin-top:12px; border-top: 2px solid #475569; padding-top: 8px; }\n  #uiu-panel .uiu-formats .uiu-controls > span { font-size: 16px; font-weight: 600; }\n  #uiu-panel .uiu-formats .uiu-controls > .uiu-subtitle { font-size: 13px; font-weight: 600; }\n  #uiu-panel .uiu-formats .uiu-formats-list { margin-top:6px; max-height: 200px; overflow-y:auto; overflow-x:hidden; }\n  #uiu-panel .uiu-formats .uiu-formats-row { display:grid; grid-template-columns: 1fr 2fr 180px; align-items:center; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; }\n  #uiu-panel .uiu-formats .uiu-formats-row .uiu-ops { display:flex; gap:6px; justify-content:flex-end; }\n  #uiu-panel .uiu-formats .uiu-formats-row:not(.uiu-editing) .uiu-fmt-name, #uiu-panel .uiu-formats .uiu-formats-row:not(.uiu-editing) .uiu-fmt-template { display:block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n  #uiu-panel .uiu-formats .uiu-formats-row.uiu-editing .uiu-fmt-name, #uiu-panel .uiu-formats .uiu-formats-row.uiu-editing .uiu-fmt-template { overflow: visible; text-overflow: clip; white-space: normal; }\n  #uiu-panel .uiu-formats .uiu-form-add { display:grid; grid-template-columns: 1fr 2fr 180px; align-items:center; gap:8px; }\n  #uiu-panel .uiu-formats .uiu-formats-row input[type="text"] { width:100%; }\n  #uiu-panel .uiu-formats .uiu-form-add input[type="text"] { width:100%; }\n  #uiu-panel .uiu-formats .uiu-form-add button { justify-self: end; }\n  #uiu-panel .uiu-formats .uiu-formats-header { font-weight: 600; color:#e5e7eb; }\n  #uiu-panel .uiu-formats .uiu-form-add .uiu-fmt-name, #uiu-panel .uiu-formats .uiu-form-add .uiu-fmt-template { display:block; min-width:0; }\n  #uiu-panel .uiu-formats .uiu-format-example-row { padding-top:4px; border-bottom: none; }\n  #uiu-panel .uiu-formats .uiu-format-example-row .uiu-fmt-template { font-size:12px; color:#cbd5e1; white-space: normal; overflow: visible; text-overflow: clip; }\n  '
  GM_addStyle(css)
  async function loadHistory() {
    return (await getValue(HISTORY_KEY, [])) || []
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
    try {
      const formats = await getCustomFormats()
      const custom = formats.find((cf) => cf.name === fmt)
      if (custom) {
        return tpl(custom.template, { link, name: alt })
      }
    } catch (e) {}
    switch (fmt) {
      case 'html': {
        return '<img src="'.concat(link, '" alt="').concat(alt, '" />')
      }
      case 'bbcode': {
        return '[img]'.concat(link, '[/img]')
      }
      case 'link': {
        return link
      }
      default: {
        return '!['.concat(alt, '](').concat(link, ')')
      }
    }
  }
  function isImgurUrl(url) {
    try {
      const u = new URL(url)
      const h = u.hostname.toLowerCase()
      return h.includes('imgur.com')
    } catch (e) {
      return false
    }
  }
  async function applyProxy(url, providerKey) {
    try {
      const px = await getProxy()
      if (px === 'none') return url
      const provider = providerKey || (await getHost())
      if (provider === 'imgur' || isImgurUrl(url)) return url
      if (px === 'wsrv.nl') {
        return 'https://wsrv.nl/?url='.concat(encodeURIComponent(url))
      }
      return url
    } catch (e) {
      return url
    }
  }
  async function gmRequest(opts) {
    const req =
      typeof GM !== 'undefined' && (GM == null ? void 0 : GM.xmlHttpRequest)
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
            var _a
            try {
              if ((opts.responseType || 'text') === 'json') {
                resolve(
                  (_a = res.response) != null
                    ? _a
                    : JSON.parse(res.responseText || '{}')
                )
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
    var _a
    if (Math.floor(file.size / 1e3) > 1e4) {
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
    if (
      (data == null ? void 0 : data.status_code) === 200 &&
      ((_a = data == null ? void 0 : data.image) == null ? void 0 : _a.url)
    ) {
      const url = String(data.image.url)
      return url.includes('i.mji.rip')
        ? url.replace('i.mji.rip', 'i.mij.rip')
        : url
    }
    throw new Error(t('error_upload_failed'))
  }
  async function uploadToAppinn(file) {
    var _a
    if (Math.floor(file.size / 1e3) > 2e4) {
      throw new Error('20mb limit')
    }
    const filename =
      (file == null ? void 0 : file.name) || 'file_'.concat(Date.now())
    const formData = new FormData()
    formData.append('filename', filename)
    formData.append('file', file)
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(APPINN_UPLOAD_PARAMS))
      qs.append(k, String(v))
    const uploadUrl = ''
      .concat(APPINN_UPLOAD_ENDPOINT, '?')
      .concat(qs.toString())
    const data = await gmRequest({
      method: 'POST',
      url: uploadUrl,
      data: formData,
      responseType: 'json',
    })
    if (Array.isArray(data) && ((_a = data[0]) == null ? void 0 : _a.src)) {
      const src = String(data[0].src)
      const abs = /^https?:\/\//i.test(src)
        ? src
        : new URL(src, APPINN_UPLOAD_ENDPOINT).href
      return abs
    }
    throw new Error(t('error_upload_failed'))
  }
  async function uploadToImgur(file) {
    var _a
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
          headers: { Authorization: 'Client-ID '.concat(id) },
          data: formData,
          responseType: 'json',
        })
        if (
          (data == null ? void 0 : data.success) &&
          ((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.link)
        ) {
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
    if (Math.floor(file.size / 1e3) > 8e3) {
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
    if (
      (data == null ? void 0 : data.status) === 'uploaded' &&
      (data == null ? void 0 : data.id)
    ) {
      return 'https://tikolu.net/i/'.concat(data.id)
    }
    throw new Error(t('error_upload_failed'))
  }
  async function uploadImage(file) {
    const host = await getHost()
    if (host === 'tikolu') return uploadToTikolu(file)
    if (host === 'mjj') return uploadToMjj(file)
    if (host === 'appinn') return uploadToAppinn(file)
    return uploadToImgur(file)
  }
  var lastEditableEl = null
  function getDeepActiveElement() {
    let el = document.activeElement
    try {
      while (el && el.shadowRoot && el.shadowRoot.activeElement) {
        el = el.shadowRoot.activeElement
      }
      while (
        el &&
        el.tagName === 'IFRAME' &&
        el.contentDocument &&
        el.contentDocument.activeElement
      ) {
        el = el.contentDocument.activeElement
      }
    } catch (e) {}
    return el
  }
  function isInsideUIPanel(node) {
    try {
      const host = document.querySelector('#uiu-panel')
      if (!host || !node) return false
      if (host === node) return true
      if (host.contains(node)) return true
      const root = host.shadowRoot
      return root ? root.contains(node) : false
    } catch (e) {}
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
      const deepTarget =
        getDeepActiveElement() ||
        (typeof e.composedPath === 'function' ? e.composedPath()[0] : e.target)
      if (
        deepTarget &&
        isEditable(deepTarget) &&
        !isInsideUIPanel(deepTarget)
      ) {
        lastEditableEl = deepTarget
      }
    },
    true
  )
  function insertIntoFocused(text) {
    var _a, _b
    let el = getDeepActiveElement()
    if (!isEditable(el) || isInsideUIPanel(el)) {
      el = lastEditableEl
      try {
        if (el && typeof el.focus === 'function') el.focus()
      } catch (e) {}
    }
    if (!isEditable(el) || isInsideUIPanel(el)) return false
    try {
      if (el instanceof HTMLTextAreaElement || isTextInput(el)) {
        const start = (_a = el.selectionStart) != null ? _a : el.value.length
        const end = (_b = el.selectionEnd) != null ? _b : el.value.length
        const v = el.value
        el.value = v.slice(0, start) + text + v.slice(end)
        el.dispatchEvent(new Event('input', { bubbles: true }))
        return true
      }
      if (el instanceof HTMLElement && el.isContentEditable) {
        try {
          const sel = globalThis.getSelection()
          if (sel) {
            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        } catch (e) {}
        document.execCommand('insertText', false, text)
        return true
      }
    } catch (e) {}
    return false
  }
  function copyAndInsert(text) {
    try {
      GM_setClipboard(text)
    } catch (e) {}
    insertIntoFocused('\n'.concat(text, '\n'))
  }
  function getActiveEditableTarget() {
    let el = getDeepActiveElement()
    if (!isEditable(el) || isInsideUIPanel(el)) el = lastEditableEl
    return isEditable(el) && !isInsideUIPanel(el) ? el : null
  }
  function createUploadPlaceholder(name) {
    const safe = String(name || t('default_image_name'))
    return '<!-- '.concat(
      tpl(t('placeholder_uploading'), { name: safe }),
      ' -->'
    )
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
    } catch (e) {}
    return false
  }
  async function createPanel() {
    if (!isTopFrame()) {
      return
    }
    const panel = createEl('div', { id: 'uiu-panel' })
    const root = panel.attachShadow({ mode: 'open' })
    try {
      const styleEl = document.createElement('style')
      styleEl.textContent = css.replaceAll(/#uiu-panel\b/g, ':host')
      root.append(styleEl)
    } catch (e) {}
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
      } catch (e) {}
    })
    const settingsBtn = createEl('button', {
      text: t('btn_settings'),
      class: 'uiu-toggle-settings',
    })
    settingsBtn.addEventListener('click', async () => {
      header.classList.toggle('uiu-show-settings')
      try {
        await refreshSettingsUI()
      } catch (e) {}
      try {
        settingsBtn.setAttribute(
          'aria-pressed',
          header.classList.contains('uiu-show-settings') ? 'true' : 'false'
        )
      } catch (e) {}
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
    const format = await getFormat()
    const formatSel = createEl('select')
    await buildFormatOptions(formatSel, format)
    formatSel.addEventListener('change', async () => {
      await setFormat(formatSel.value)
    })
    const host = await getHost()
    const hostSel = createEl('select')
    buildHostOptions(hostSel, host)
    hostSel.addEventListener('change', async () => {
      await setHost(hostSel.value)
      await updateProxyState()
    })
    const proxy = await getProxy()
    const proxySel = createEl('select')
    buildProxyOptions(proxySel, proxy)
    async function updateProxyState() {
      const currentHost = hostSel.value
      if (currentHost === 'imgur') {
        proxySel.value = 'none'
        proxySel.disabled = true
        await setProxy('none')
        try {
          await renderHistory()
        } catch (e) {}
      } else {
        proxySel.disabled = false
      }
    }
    await updateProxyState()
    proxySel.addEventListener('change', async () => {
      await setProxy(proxySel.value)
      try {
        await renderHistory()
      } catch (e) {}
    })
    function openFilePicker() {
      const input = createEl('input', {
        type: 'file',
        accept: 'image/*',
        multiple: 'true',
        style: 'display:none',
      })
      input.addEventListener('change', () => {
        var _a
        if ((_a = input.files) == null ? void 0 : _a.length)
          handleFiles(Array.from(input.files))
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
    const settingsContainer = createEl('div', {
      class: 'uiu-settings-container',
    })
    body.append(settingsContainer)
    const settings = createEl('div', { class: 'uiu-settings' })
    const settingsHeader = createEl('div', {
      class: 'uiu-controls',
      style: 'margin-bottom:8px;',
    })
    settingsHeader.append(
      createEl('span', { text: t('settings_section_title') })
    )
    settings.append(settingsHeader)
    const togglesRow = createEl('div', { class: 'uiu-controls' })
    const pasteLabel = createEl('label')
    const pasteChk = createEl('input', { type: 'checkbox' })
    try {
      pasteChk.checked = await getPasteEnabled()
    } catch (e) {}
    pasteChk.addEventListener('change', async () => {
      await setPasteEnabled(Boolean(pasteChk.checked))
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
      dragChk.checked = await getDragAndDropEnabled()
    } catch (e) {}
    dragChk.addEventListener('change', async () => {
      await setDragAndDropEnabled(Boolean(dragChk.checked))
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
    saveBtn.addEventListener('click', async () => {
      await addSiteBtnSetting({
        selector: selInput.value,
        position: posSel.value,
        text: textInput.value,
      })
      selInput.value = ''
      buildPositionOptions(posSel)
      textInput.value = t('insert_image_button_default')
      await renderSettingsList()
      for (const el of document.querySelectorAll('.uiu-insert-btn')) el.remove()
      await applySiteButtons()
      try {
        await restartSiteButtonObserver()
      } catch (e) {}
    })
    const removeBtn = createEl('button', { text: t('btn_remove_button_temp') })
    removeBtn.addEventListener('click', () => {
      for (const el of document.querySelectorAll('.uiu-insert-btn')) el.remove()
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch (e) {}
    })
    const clearBtn = createEl('button', { text: t('btn_clear_settings') })
    clearBtn.addEventListener('click', async () => {
      await setSiteBtnSettingsList([])
      await renderSettingsList()
      for (const el of document.querySelectorAll('.uiu-insert-btn')) el.remove()
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch (e) {}
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
    const formats = createEl('div', { class: 'uiu-formats' })
    const formatsHeader = createEl('div', { class: 'uiu-controls' })
    formatsHeader.append(
      createEl('span', {
        class: 'uiu-subtitle',
        text: t('formats_section_title'),
      })
    )
    formats.append(formatsHeader)
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
      } catch (e) {}
    })
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
      const list2 = await getCustomFormats()
      for (const cf of list2) {
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
          const ops2 = createEl('span', { class: 'uiu-ops' })
          const updateBtn = createEl('button', { text: t('btn_update') })
          updateBtn.addEventListener('click', async () => {
            const newName = (eName.value || '').trim()
            const newTpl = String(eTpl.value || '')
            if (!newName || !newTpl) return
            if (newName !== cf.name) await removeCustomFormat(cf.name)
            await upsertCustomFormat(newName, newTpl)
            try {
              if ((await getFormat()) === cf.name) await setFormat(newName)
            } catch (e) {}
            await renderFormatsList()
            try {
              await buildFormatOptions(formatSel, await getFormat())
            } catch (e) {}
          })
          const cancelBtn = createEl('button', { text: t('btn_cancel') })
          cancelBtn.addEventListener('click', async () => {
            await renderFormatsList()
          })
          ops2.append(updateBtn)
          ops2.append(cancelBtn)
          row.append(colName)
          row.append(colTpl)
          row.append(ops2)
        })
        const delBtn = createEl('button', { text: t('btn_delete') })
        delBtn.addEventListener('click', async () => {
          await removeCustomFormat(cf.name)
          try {
            if ((await getFormat()) === cf.name) await setFormat(DEFAULT_FORMAT)
          } catch (e) {}
          await renderFormatsList()
          try {
            await buildFormatOptions(formatSel, await getFormat())
          } catch (e) {}
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
      settingsList.textContent = ''
      const listData = await getSiteBtnSettingsList()
      for (const [idx, cfg] of listData.entries()) {
        const row = createEl('div', { class: 'uiu-settings-row' })
        const info = createEl('span', {
          class: 'uiu-settings-item',
          text: ''
            .concat(cfg.selector, ' [')
            .concat(cfg.position || DEFAULT_BUTTON_POSITION, '] - ')
            .concat(cfg.text || t('insert_image_button_default')),
        })
        const editBtn = createEl('button', { text: t('btn_edit') })
        editBtn.addEventListener('click', () => {
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
          const ops2 = createEl('span', { class: 'uiu-ops' })
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
            } catch (e) {}
          })
          const cancelBtn = createEl('button', { text: t('btn_cancel') })
          cancelBtn.addEventListener('click', async () => {
            await renderSettingsList()
          })
          ops2.append(updateBtn)
          ops2.append(cancelBtn)
          row.append(fields)
          row.append(ops2)
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
          } catch (e) {}
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
      buildPositionOptions(posSel)
      textInput.value = t('insert_image_button_default')
      await renderSettingsList()
      try {
        fnameInput.value = ''
        ftemplateInput.value = ''
        await renderFormatsList()
      } catch (e) {}
    }
    root.append(header)
    root.append(body)
    panel.style.display = 'none'
    document.documentElement.append(panel)
    try {
      toggleHistoryBtn.setAttribute('aria-pressed', 'false')
      settingsBtn.setAttribute('aria-pressed', 'false')
    } catch (e) {}
    const showPanel = () => {
      panel.style.display = 'block'
      document.documentElement.append(panel)
    }
    function applySingle(cfg) {
      var _a, _b
      if (!(cfg == null ? void 0 : cfg.selector)) return
      let targets
      try {
        targets = document.querySelectorAll(cfg.selector)
      } catch (e) {
        return
      }
      if (!targets || targets.length === 0) return
      const posRaw = (cfg.position || '').trim()
      const pos =
        posRaw === 'before'
          ? 'before'
          : posRaw === 'inside'
            ? 'inside'
            : 'after'
      const content = (cfg.text || t('insert_image_button_default')).trim()
      for (const target of Array.from(targets)) {
        const exists =
          pos === 'inside'
            ? Boolean(target.querySelector('.uiu-insert-btn'))
            : pos === 'before'
              ? Boolean(
                  target.previousElementSibling &&
                  ((_a = target.previousElementSibling.classList) == null
                    ? void 0
                    : _a.contains('uiu-insert-btn'))
                )
              : Boolean(
                  target.nextElementSibling &&
                  ((_b = target.nextElementSibling.classList) == null
                    ? void 0
                    : _b.contains('uiu-insert-btn'))
                )
        if (exists) continue
        let btn
        try {
          const range = document.createRange()
          const ctx = document.createElement('div')
          range.selectNodeContents(ctx)
          const frag = range.createContextualFragment(content)
          if (frag && frag.childElementCount === 1) {
            btn = frag.firstElementChild
          }
        } catch (e) {}
        if (btn) {
          btn.classList.add('uiu-insert-btn')
        } else {
          btn = createEl('button', {
            class: 'uiu-insert-btn uiu-default',
            text: content,
          })
        }
        btn.addEventListener('click', (event) => {
          showPanel()
          event.preventDefault()
          try {
            openFilePicker()
          } catch (e) {}
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
    async function applySiteButtons() {
      const list2 = await getSiteBtnSettingsList()
      for (const cfg of list2) {
        try {
          applySingle(cfg)
        } catch (e) {}
      }
    }
    await applySiteButtons()
    let siteBtnObserver
    async function restartSiteButtonObserver() {
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch (e) {}
      const list2 = await getSiteBtnSettingsList()
      if (list2.length === 0) {
        siteBtnObserver = null
        return
      }
      const checkAndInsertAll = () => {
        for (const cfg of list2) {
          try {
            applySingle(cfg)
          } catch (e) {}
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
    await restartSiteButtonObserver()
    let drop = null
    let pasteHandler = null
    let dragoverHandler = null
    let dragleaveHandler = null
    let dropHandler = null
    function enablePaste() {
      if (pasteHandler) return
      pasteHandler = (event) => {
        var _a
        const cd = event.clipboardData
        if (!cd) return
        const list2 = []
        const seen = /* @__PURE__ */ new Set()
        const addIfNew = (f) => {
          const sig = ''
            .concat(f.name, '|')
            .concat(f.size, '|')
            .concat(f.type, '|')
            .concat(f.lastModified || 0)
          if (!seen.has(sig)) {
            seen.add(sig)
            list2.push(f)
          }
        }
        const items = cd.items ? Array.from(cd.items) : []
        for (const i of items) {
          if (i && i.type && i.type.includes('image')) {
            const f = (_a = i.getAsFile) == null ? void 0 : _a.call(i)
            if (f) addIfNew(f)
          }
        }
        const files = cd.files ? Array.from(cd.files) : []
        for (const f of files) {
          if (f && f.type && f.type.includes('image')) addIfNew(f)
        }
        if (list2.length > 0) {
          event.preventDefault()
          event.stopPropagation()
          handleFiles(list2)
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
          var _a, _b
          const dt = e.dataTransfer
          const types = (dt == null ? void 0 : dt.types)
            ? Array.from(dt.types)
            : []
          const hasFileType =
            types.includes('Files') ||
            ((_b =
              (_a = dt == null ? void 0 : dt.types) == null
                ? void 0
                : _a.contains) == null
              ? void 0
              : _b.call(_a, 'Files'))
          const hasFileItem = (dt == null ? void 0 : dt.items)
            ? Array.from(dt.items).some((it) => it.kind === 'file')
            : false
          if (hasFileType || hasFileItem) {
            if (drop) drop.classList.add('show')
            e.preventDefault()
          } else if (drop) drop.classList.remove('show')
        }
        document.addEventListener('dragover', dragoverHandler)
      }
      if (!dragleaveHandler) {
        dragleaveHandler = () => {
          if (drop) drop.classList.remove('show')
        }
        document.addEventListener('dragleave', dragleaveHandler)
      }
      if (!dropHandler) {
        dropHandler = (event) => {
          var _a
          if (drop) drop.classList.remove('show')
          event.preventDefault()
          const files = (_a = event.dataTransfer) == null ? void 0 : _a.files
          if (files == null ? void 0 : files.length)
            handleFiles(Array.from(files))
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
        } catch (e) {}
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
        addLog(''.concat(t('log_uploading')).concat(item.file.name))
        try {
          const link = await uploadImage(item.file)
          const fmt = await getFormat()
          const host2 = await getHost()
          const proxied = await applyProxy(link, host2)
          const out = await formatText(proxied, item.file.name, fmt)
          if (item.placeholder && item.targetEl) {
            const ok = replacePlaceholder(
              item.targetEl,
              item.placeholder,
              ''.concat(out)
            )
            if (!ok) copyAndInsert(out)
          } else {
            copyAndInsert(out)
          }
          await addToHistory({
            link,
            name: item.file.name,
            ts: Date.now(),
            pageUrl: location.href,
            provider: host2,
          })
          addLog(
            ''
              .concat(t('log_success'))
              .concat(item.file.name, ' \u2192 ')
              .concat(link)
          )
        } catch (error) {
          if (item.placeholder && item.targetEl) {
            const failNote = '<!-- '.concat(
              tpl(t('placeholder_upload_failed'), { name: item.file.name }),
              ' -->'
            )
            try {
              replacePlaceholder(item.targetEl, item.placeholder, failNote)
            } catch (e) {}
          }
          addLog(
            ''
              .concat(t('log_failed'))
              .concat(item.file.name, '\uFF08')
              .concat(
                (error == null ? void 0 : error.message) || error,
                '\uFF09'
              )
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
          } catch (e) {}
          placeholder = createUploadPlaceholder(file.name)
          insertIntoFocused('\n'.concat(placeholder, '\n'))
        }
        queue.push({ file, placeholder, targetEl })
      }
      void processQueue()
    }
    const pasteEnabled = await getPasteEnabled()
    if (pasteEnabled) enablePaste()
    const dragEnabled = await getDragAndDropEnabled()
    if (dragEnabled) enableDrag()
    async function renderHistory() {
      history.textContent = ''
      const header2 = createEl('div', { class: 'uiu-controls' })
      const historyItems = await loadHistory()
      header2.append(
        createEl('span', {
          text: tpl(t('btn_history_count'), { count: historyItems.length }),
        })
      )
      const clearBtn2 = createEl('button', { text: t('btn_clear_history') })
      clearBtn2.addEventListener('click', async () => {
        await saveHistory([])
        await renderHistory()
      })
      header2.append(clearBtn2)
      history.append(header2)
      const listWrap = createEl('div', { class: 'uiu-list' })
      for (const it of historyItems) {
        const row = createEl('div', { class: 'uiu-row' })
        const previewUrl = await applyProxy(
          it.link,
          it.provider || (isImgurUrl(it.link) ? 'imgur' : 'other')
        )
        const preview = createEl('img', {
          src: previewUrl,
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
        } catch (e) {}
        if (it.pageUrl) {
          let host2 = it.pageUrl
          try {
            host2 = new URL(it.pageUrl).hostname
          } catch (e) {}
          const pageLink = createEl('a', {
            href: it.pageUrl,
            text: tpl(t('history_upload_page'), { host: host2 }),
            target: '_blank',
            rel: 'noopener noreferrer',
            style: 'color:#93c5fd;text-decoration:none;font-size:11px;',
          })
          info.append(pageLink)
        }
        row.append(info)
        const ops = createEl('div', { class: 'uiu-ops' })
        const copyBtn = createEl('button', { text: t('btn_copy') })
        copyBtn.addEventListener('click', async () => {
          const fmt = await getFormat()
          const proxied = await applyProxy(
            it.link,
            it.provider || (isImgurUrl(it.link) ? 'imgur' : 'other')
          )
          const out = await formatText(
            proxied,
            it.name || t('default_image_name'),
            fmt
          )
          copyAndInsert(out)
        })
        const openBtn = createEl('button', { text: t('btn_open') })
        openBtn.addEventListener('click', async () => {
          const url = await applyProxy(
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
    void addValueChangeListener(
      HISTORY_KEY,
      (name, oldValue, newValue, remote) => {
        try {
          void renderHistory()
        } catch (e) {}
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
      } catch (e) {}
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
      } catch (e) {}
      try {
        settingsBtn.setAttribute('aria-pressed', 'true')
        toggleHistoryBtn.setAttribute(
          'aria-pressed',
          header.classList.contains('uiu-show-history') ? 'true' : 'false'
        )
      } catch (e) {}
    })
    return { handleFiles }
  }
  ;(async () => {
    try {
      await migrateLegacyStorage()
      await migrateToUnifiedSiteMap()
      await applyPresetConfig()
      const enabled = await getEnabled()
      if (enabled && !document.querySelector('#uiu-panel')) {
        const { handleFiles } = await createPanel()
        globalThis.addEventListener('iu:uploadFiles', (e) => {
          var _a
          const files = (_a = e.detail) == null ? void 0 : _a.files
          if (files == null ? void 0 : files.length) handleFiles(files)
        })
      }
      registerMenu(
        enabled ? t('menu_disable_site') : t('menu_enable_site'),
        async () => {
          await setEnabled(!enabled)
          try {
            location.reload()
          } catch (e) {}
        }
      )
    } catch (e) {}
  })()
})()
