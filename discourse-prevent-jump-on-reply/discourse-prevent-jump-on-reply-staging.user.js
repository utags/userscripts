// ==UserScript==
// @name                 Discourse Prevent Jump on Reply - staging
// @name:zh-CN           Discourse 回复时防止跳转 - staging
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.3.1
// @description          Prevent Discourse from jumping after posting a reply by intercepting the reply button click and forcing shiftKey, keeping scroll position and context.
// @description:zh-CN    拦截回复按钮点击并强制 shiftKey，避免发帖后页面跳转，保持当前位置与上下文。
// @icon                 https://wsrv.nl/?w=64&h=64&url=https%3A%2F%2Ft3.gstatic.com%2FfaviconV2%3Fclient%3DSOCIAL%26type%3DFAVICON%26fallback_opts%3DTYPE%2CSIZE%2CURL%26url%3Dhttps%3A%2F%2Fmeta.discourse.org%26size%3D64
// @author               Pipecraft
// @license              MIT
// @match                https://meta.discourse.org/*
// @match                https://linux.do/*
// @match                https://idcflare.com/*
// @match                https://www.nodeloc.com/*
// @match                https://meta.appinn.net/*
// @run-at               document-idle
// @grant                GM.info
// @grant                GM.addValueChangeListener
// @grant                GM.getValue
// @grant                GM.deleteValue
// @grant                GM.setValue
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
  var lastKnownValues = /* @__PURE__ */ new Map()
  var getScriptHandler = () => {
    if (typeof GM !== 'undefined' && GM.info) {
      return GM.info.scriptHandler || ''
    }
    return ''
  }
  var scriptHandler = getScriptHandler().toLowerCase()
  var isIgnoredHandler =
    scriptHandler === 'tamp' || scriptHandler.includes('stay')
  var shouldCloneValue = () =>
    scriptHandler === 'tamp' || // ScriptCat support addValueChangeListener, don't need to clone
    scriptHandler.includes('stay')
  var isNativeListenerSupported = () =>
    !isIgnoredHandler &&
    typeof GM !== 'undefined' &&
    typeof GM.addValueChangeListener === 'function'
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
    if (shouldCloneValue()) {
      void setValue(key, newValue)
    } else {
      lastKnownValues.set(key, newValue)
      triggerValueChangeListeners(key, oldValue, newValue, true)
    }
  })
  async function getValue(key, defaultValue) {
    if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
      try {
        const value = await GM.getValue(key, defaultValue)
        if (value && typeof value === 'object' && shouldCloneValue()) {
          return JSON.parse(JSON.stringify(value))
        }
        return value
      } catch (error) {
        console.warn('GM.getValue failed', error)
      }
    }
    return defaultValue
  }
  async function updateValue(key, newValue, updater) {
    let oldValue
    if (!isNativeListenerSupported()) {
      oldValue = await getValue(key)
    }
    await updater()
    if (!isNativeListenerSupported()) {
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
      if (typeof GM !== 'undefined') {
        if (value === void 0 || value === null) {
          if (typeof GM.deleteValue === 'function') {
            await GM.deleteValue(key)
          }
        } else if (typeof GM.setValue === 'function') {
          await GM.setValue(key, value)
        }
      }
    })
  }
  var SELECTOR_REPLY_BUTTON =
    '.composer-action-reply .save-or-cancel button.create'
  var I18N_LABEL = {
    en: 'Prevent jump to latest post',
    'zh-CN': '\u9632\u6B62\u8DF3\u8F6C\u5230\u6700\u65B0\u5E16\u5B50',
  }
  function isReplySaving() {
    return Boolean(
      document.querySelector('#reply-control > div.saving-text > div.spinner')
    )
  }
  function waitForReplySent(onDone) {
    if (!isReplySaving()) {
      onDone()
      return
    }
    const start = Date.now()
    const maxWait = 3e4
    const check = () => {
      if (!isReplySaving()) {
        onDone()
        return
      }
      if (Date.now() - start >= maxWait) return
      setTimeout(check, 200)
    }
    setTimeout(check, 200)
  }
  function handleAfterPosting() {
    if (checkPermissionPlaceholder()) {
      setTimeout(() => {
        waitForReplySent(() => {
          location.reload()
        })
      }, 500)
    }
  }
  function checkPermissionPlaceholder() {
    return Boolean(document.querySelector('span.permission-reply-placeholder'))
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
        handleAfterPosting()
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
          handleAfterPosting()
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
