// ==UserScript==
// @name                 Discourse Prevent Jump on Reply - staging
// @name:zh-CN           Discourse 回复时防止跳转 - staging
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.2.0
// @description          Prevent Discourse from jumping after posting a reply by intercepting the reply button click and forcing shiftKey, keeping scroll position and context.
// @description:zh-CN    拦截回复按钮点击并强制 shiftKey，避免发帖后页面跳转，保持当前位置与上下文。
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=meta.discourse.org
// @author               Pipecraft
// @license              MIT
// @match                https://meta.discourse.org/*
// @match                https://linux.do/*
// @match                https://idcflare.com/*
// @match                https://www.nodeloc.com/*
// @match                https://meta.appinn.net/*
// @run-at               document-idle
// @grant                GM_info
// @grant                GM.info
// @grant                GM.addValueChangeListener
// @grant                GM_addValueChangeListener
// @grant                GM.getValue
// @grant                GM_getValue
// @grant                GM.setValue
// @grant                GM_setValue
// ==/UserScript==
//
;(() => {
  'use strict'
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
  var valueChangeBroadcastChannel = new BroadcastChannel(
    'gm_value_change_channel'
  )
  var getScriptHandler = () => {
    if (typeof GM_info !== 'undefined') {
      return GM_info.scriptHandler || ''
    }
    if (typeof GM !== 'undefined' && GM.info) {
      return GM.info.scriptHandler || ''
    }
    return ''
  }
  var scriptHandler = getScriptHandler()
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
  var SELECTOR_REPLY_BUTTON =
    '.composer-action-reply .save-or-cancel button.create'
  var I18N_LABEL = {
    en: 'Prevent jump to latest post',
    'zh-CN': '\u9632\u6B62\u8DF3\u8F6C\u5230\u6700\u65B0\u5E16\u5B50',
  }
  function getDiscourseLocale() {
    try {
      const htmlLang = (
        document.documentElement.getAttribute('lang') || ''
      ).toLowerCase()
      if (htmlLang) return htmlLang
      const bodyLang =
        (document.body && document.body.getAttribute('lang')) || ''
      if (bodyLang) return bodyLang.toLowerCase()
      const classes = (document.documentElement.className || '').toLowerCase()
      const m = /\blocale-([a-z-]+)/.exec(classes)
      if (m && m[1]) return m[1]
      const meta =
        document.querySelector('meta[name="language"]') ||
        document.querySelector('meta[http-equiv="content-language"]')
      const metaLang =
        meta && meta.getAttribute('content')
          ? meta.getAttribute('content').toLowerCase()
          : ''
      if (metaLang) return metaLang
    } catch (e) {}
    return ''
  }
  function getLang() {
    const l =
      getDiscourseLocale() || String(navigator.language || '').toLowerCase()
    return l.startsWith('zh') ? 'zh-CN' : 'en'
  }
  var inited = /* @__PURE__ */ new WeakSet()
  function register(button) {
    if (!button || inited.has(button)) return
    inited.add(button)
    ensureToggle(button)
    button.addEventListener(
      'click',
      (originalEvent) => {
        if (!getEnabled() || originalEvent.shiftKey || !originalEvent.target)
          return
        originalEvent.stopImmediatePropagation()
        originalEvent.preventDefault()
        const newEvent = new MouseEvent('click', {
          bubbles: originalEvent.bubbles,
          cancelable: originalEvent.cancelable,
          clientX: originalEvent.clientX,
          clientY: originalEvent.clientY,
          shiftKey: true,
          altKey: originalEvent.altKey,
          ctrlKey: originalEvent.ctrlKey,
          metaKey: originalEvent.metaKey,
          button: originalEvent.button,
          buttons: originalEvent.buttons,
        })
        originalEvent.target.dispatchEvent(newEvent)
      },
      true
    )
  }
  function scan() {
    const list = document.querySelectorAll(SELECTOR_REPLY_BUTTON)
    for (const b of list) register(b)
  }
  function getActiveReplyButton() {
    const list = document.querySelectorAll(SELECTOR_REPLY_BUTTON)
    return (
      Array.from(list).find((b) => Boolean(b.offsetParent)) || list[0] || null
    )
  }
  document.addEventListener(
    'keydown',
    (e) => {
      if (
        getEnabled() &&
        (e.metaKey || e.ctrlKey) &&
        (e.key === 'Enter' || e.code === 'Enter')
      ) {
        e.stopImmediatePropagation()
        e.preventDefault()
        const btn = getActiveReplyButton()
        if (btn) {
          const ev = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            shiftKey: true,
          })
          btn.dispatchEvent(ev)
        }
      }
    },
    true
  )
  var KEY = 'dpjor_enabled:' + (location.hostname || '')
  var enabledFlag = false
  function getEnabled() {
    return Boolean(enabledFlag)
  }
  async function loadEnabled() {
    try {
      const val = await getValue(KEY, '0')
      enabledFlag = val === '1'
      updateToggleUI()
    } catch (e) {
      enabledFlag = false
    }
  }
  async function setEnabled(v) {
    enabledFlag = Boolean(v)
    try {
      await setValue(KEY, v ? '1' : '0')
    } catch (e) {}
  }
  function updateToggleUI() {
    try {
      const cbs = document.querySelectorAll(
        '.dpjor-toggle input[type="checkbox"]'
      )
      for (const cb of Array.from(cbs)) cb.checked = getEnabled()
    } catch (e) {}
  }
  function ensureToggle(button) {
    const container = button.closest('.save-or-cancel') || button.parentElement
    if (!container || container.querySelector('.dpjor-toggle')) return
    const label = document.createElement('label')
    label.className = 'dpjor-toggle'
    label.style.marginLeft = '8px'
    label.style.display = 'inline-flex'
    label.style.alignItems = 'center'
    label.style.gap = '6px'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = getEnabled()
    const span = document.createElement('span')
    span.textContent = I18N_LABEL[getLang()] || I18N_LABEL.en
    cb.addEventListener('change', () => {
      void setEnabled(cb.checked)
    })
    label.append(cb)
    label.append(span)
    container.append(label)
  }
  void loadEnabled()
  scan()
  var mo = new MutationObserver(() => {
    scan()
  })
  mo.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  })
})()
