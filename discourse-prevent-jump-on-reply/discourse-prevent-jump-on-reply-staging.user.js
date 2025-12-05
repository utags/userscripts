// ==UserScript==
// @name                 Discourse Prevent Jump on Reply - staging
// @name:zh-CN           Discourse 回复时防止跳转 - staging
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.3
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
// @noframes
// @run-at               document-idle
// @grant                GM.getValue
// @grant                GM.setValue
// ==/UserScript==
//
;(() => {
  'use strict'
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
      const val = await GM.getValue(KEY, '0')
      enabledFlag = val === '1'
      updateToggleUI()
    } catch (e) {
      enabledFlag = false
    }
  }
  async function setEnabled(v) {
    enabledFlag = Boolean(v)
    try {
      await GM.setValue(KEY, v ? '1' : '0')
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
