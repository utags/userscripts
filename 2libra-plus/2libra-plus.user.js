// ==UserScript==
// @name                 2Libra Plus
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.3.5
// @description          2Libra.com 增强工具
// @icon                 https://2libra.com/favicon.ico
// @author               Pipecraft
// @license              MIT
// @match                https://2libra.com/*
// @run-at               document-end
// @grant                GM_registerMenuCommand
// @grant                GM_addStyle
// @grant                GM.addStyle
// @grant                GM.info
// @grant                GM.addValueChangeListener
// @grant                GM.getValue
// @grant                GM.deleteValue
// @grant                GM.setValue
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
  var style_default =
    '[data-unread-mark="1"]{position:relative}[data-unread-mark="1"]:before{background-color:#f97316;border-radius:9999px;bottom:0;content:"";left:-1px;position:absolute;top:0;width:4px}[data-libra-plus-post-list-sort="1"] .breadcrumbs{flex-basis:28px;flex-grow:1;margin-right:16px;min-width:28px}[data-libra-plus-post-list-sort="1"] [data-libra-plus-sort]{display:flex;flex-basis:28px;flex-grow:1;justify-content:flex-end;margin-left:16px;min-width:28px}[data-libra-plus-post-list-sort="1"] [data-libra-plus-sort]>div{min-width:176px;top:22px}@media(max-width:480px){[data-libra-plus-post-list-sort="1"] .breadcrumbs ul{display:none}}'
  function registerMenu(caption, onClick, options) {
    if (typeof GM_registerMenuCommand === 'function') {
      return GM_registerMenuCommand(caption, onClick, options)
    }
    return 0
  }
  async function addStyle(css) {
    if (typeof GM_addStyle === 'function') {
      const style2 = GM_addStyle(css)
      if (style2 instanceof HTMLStyleElement) return style2
    }
    if (typeof GM !== 'undefined' && typeof GM.addStyle === 'function') {
      const style2 = await GM.addStyle(css)
      if (style2 instanceof HTMLStyleElement) return style2
    }
    const style = document.createElement('style')
    style.textContent = css
    ;(document.head || document.documentElement).append(style)
    return style
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
  var pollingEnabled = false
  function startPolling() {
    if (pollingIntervalId || isNativeListenerSupported() || !pollingEnabled)
      return
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
  async function addValueChangeListener(key, callback) {
    if (
      isNativeListenerSupported() &&
      typeof GM !== 'undefined' &&
      typeof GM.addValueChangeListener === 'function'
    ) {
      return GM.addValueChangeListener(key, callback)
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
  var style_default2 =
    '/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-50:oklch(97.1% 0.013 17.38);--color-red-500:oklch(63.7% 0.237 25.331);--color-blue-300:oklch(80.9% 0.105 251.813);--color-blue-400:oklch(70.7% 0.165 254.624);--color-blue-600:oklch(54.6% 0.245 262.881);--color-blue-700:oklch(48.8% 0.243 264.376);--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-800:oklch(27.8% 0.033 256.848);--color-gray-900:oklch(21% 0.034 264.665);--color-white:#fff;--spacing:4px;--font-weight-semibold:600;--font-weight-bold:700;--radius-md:6px;--radius-xl:12px;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.container{width:100%;@media (width >= 40rem){max-width:640px}@media (width >= 48rem){max-width:768px}@media (width >= 64rem){max-width:1024px}@media (width >= 80rem){max-width:1280px}@media (width >= 96rem){max-width:1536px}}.grid{display:grid}}:host{all:initial}.user-settings{position:fixed;right:calc(var(--spacing)*3);top:calc(var(--spacing)*3);z-index:2147483647;--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .panel{background-color:var(--color-gray-100);border-bottom-left-radius:var(--radius-xl);border-bottom-right-radius:var(--radius-xl);color:var(--color-gray-900);font-family:var(--font-sans);font-size:14px;max-height:90vh;overflow-y:auto;padding-inline:calc(var(--spacing)*4);padding-bottom:calc(var(--spacing)*4);padding-top:calc(var(--spacing)*0);width:420px;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));background:#f2f2f7;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);box-shadow:0 10px 39px 10px #3e424238!important;scrollbar-color:rgba(156,163,175,.25) transparent;scrollbar-width:thin}.user-settings .grid{display:flex;flex-direction:column;gap:calc(var(--spacing)*3)}.user-settings .row{align-items:center;display:flex;gap:calc(var(--spacing)*3);justify-content:space-between;padding-block:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4)}.user-settings .group{background-color:var(--color-white);border-radius:var(--radius-xl);gap:calc(var(--spacing)*0);overflow:hidden}.user-settings .group .row{background-color:var(--color-white);border-radius:0;border-style:var(--tw-border-style);border-width:0;padding-block:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4);position:relative}.user-settings .group .row:not(:last-child):after{background:#e5e7eb;bottom:0;content:"";height:1px;left:16px;position:absolute;right:0}.user-settings .header-row{align-items:center;border-radius:0;display:flex;justify-content:center;padding-inline:calc(var(--spacing)*0);padding-bottom:calc(var(--spacing)*3);padding-top:calc(var(--spacing)*0)}.user-settings .panel-stuck .header-row .panel-title{opacity:0;transform:translateY(-2px);transition:opacity .15s ease,transform .15s ease}.user-settings label{color:var(--color-gray-600)}.user-settings .label-wrap{display:flex;flex-direction:column;gap:calc(var(--spacing)*1);min-width:60px;text-align:left}.user-settings .btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);white-space:nowrap;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .btn-danger{border-color:var(--color-red-500);color:var(--color-red-500);&:hover{@media (hover:hover){background-color:var(--color-red-50)}}}.user-settings .btn-ghost{border-radius:var(--radius-md);color:var(--color-gray-500);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.user-settings input[type=text]{border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:180px;--tw-outline-style:none;outline-style:none}.user-settings input[type=text]:focus,.user-settings input[type=text]:hover{border-color:var(--color-gray-300)}.user-settings select{background-color:var(--color-white);border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:180px;--tw-outline-style:none;outline-style:none}.user-settings select:focus,.user-settings select:hover{border-color:var(--color-gray-300)}.user-settings input[type=color]{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;height:calc(var(--spacing)*8);padding:calc(var(--spacing)*0);width:80px}.user-settings textarea{border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:100%;--tw-outline-style:none;outline-style:none}.user-settings textarea:focus,.user-settings textarea:hover{border-color:var(--color-gray-300)}.user-settings .switch,.user-settings .toggle-wrap{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.user-settings .toggle-checkbox{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:#e5e5ea;border:1px solid #d1d1d6;border-radius:9999px;box-shadow:inset 0 1px 1px rgba(0,0,0,.1);cursor:pointer;display:inline-block;height:22px;position:relative;transition:background-color .2s ease,border-color .2s ease;width:42px}.user-settings .toggle-checkbox:before{background:#fff;border-radius:9999px;box-shadow:0 2px 4px rgba(0,0,0,.25);content:"";height:18px;left:2px;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease,background-color .2s ease,left .2s ease,right .2s ease;width:18px}.user-settings .toggle-checkbox:checked{background:var(--user-toggle-on-bg,#34c759);border-color:var(--user-toggle-on-bg,#34c759)}.user-settings .panel-title{font-size:20px;--tw-font-weight:var(--font-weight-bold);color:var(--color-gray-800);font-weight:var(--font-weight-bold)}.user-settings .outer-header{align-items:center;background-color:var(--color-gray-100);background:#f2f2f7;border-top-left-radius:var(--radius-xl);border-top-right-radius:var(--radius-xl);display:flex;font-family:var(--font-sans);height:calc(var(--spacing)*11);justify-content:center;position:relative}.user-settings .outer-header .outer-title{font-size:20px;opacity:0;transition:opacity .15s ease;--tw-font-weight:var(--font-weight-bold);color:var(--color-gray-800);font-weight:var(--font-weight-bold)}.user-settings .outer-header.stuck .outer-title{opacity:1}.user-settings .outer-header:after{background:#e5e7eb;bottom:0;content:"";height:1px;left:0;opacity:0;position:absolute;right:0;transition:opacity .15s ease}.user-settings .outer-header.stuck:after{opacity:1}.user-settings .group-title{font-size:13px;padding-inline:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-600);font-weight:var(--font-weight-semibold)}.user-settings .btn-ghost.icon{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-500);cursor:pointer;display:flex;font-size:16px;height:calc(var(--spacing)*9);justify-content:center;transition:background-color .15s ease,color .15s ease;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:calc(var(--spacing)*9);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:hover{@media (hover:hover){color:var(--color-gray-700)}}}.user-settings .close-btn:hover{background-color:var(--color-gray-300);box-shadow:0 0 0 1px rgba(0,0,0,.05);color:var(--color-gray-900);font-size:19px;transform:translateY(-50%)}.user-settings .close-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);transition:transform .15s ease,background-color .15s ease,color .15s ease,font-size .15s ease}.user-settings .toggle-checkbox:checked:before{background:#fff;left:auto;right:2px;transform:translateY(-50%)}.user-settings .color-row{align-items:center;display:flex;gap:calc(var(--spacing)*1.5)}.user-settings .color-swatch{border-radius:var(--radius-md);cursor:pointer;height:calc(var(--spacing)*6);width:calc(var(--spacing)*6)}.user-settings .color-swatch.active{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .seg{align-items:center;display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*2)}.user-settings .seg.vertical{align-items:flex-end;flex-direction:column}.user-settings .seg-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .seg-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .value-wrap{align-items:flex-end;display:flex;flex-direction:column;gap:calc(var(--spacing)*1);text-align:right}.user-settings .tabs{align-items:center;display:flex;gap:calc(var(--spacing)*2);margin-bottom:calc(var(--spacing)*2)}.user-settings .tab-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .tab-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .field-help{color:var(--color-gray-400);font-size:11px}.row.help-row .field-help{margin-left:calc(var(--spacing)*0)}.user-settings .field-help a{color:var(--color-blue-600);text-decoration:underline;text-decoration-style:dashed;text-underline-offset:2px;&:hover{@media (hover:hover){color:var(--color-blue-700)}}}@media (prefers-color-scheme:dark){.user-settings .panel{background-color:var(--color-gray-800);border-bottom-left-radius:var(--radius-xl);border-bottom-right-radius:var(--radius-xl);box-shadow:0 10px 39px 10px #00000040!important;color:var(--color-gray-100)}.user-settings .row{background-color:transparent;border-style:var(--tw-border-style);border-width:0}.user-settings .header-row{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.user-settings .outer-header{background-color:var(--color-gray-800);border-top-left-radius:var(--radius-xl);border-top-right-radius:var(--radius-xl)}.user-settings .outer-header:after{background:#4b5563}.user-settings .footer a.issue-link{color:var(--color-gray-300);&:hover{@media (hover:hover){color:var(--color-gray-100)}}}.user-settings .footer .brand{color:var(--color-gray-400)}.user-settings label{color:var(--color-gray-300)}.user-settings .field-help{color:var(--color-gray-400)}.user-settings .field-help a{color:var(--color-blue-400);&:hover{@media (hover:hover){color:var(--color-blue-300)}}}.user-settings .group{background-color:var(--color-gray-700)}.user-settings .group .row:not(:last-child):after{background:#4b5563}}.user-settings .panel::-webkit-scrollbar{width:4px}.user-settings .panel::-webkit-scrollbar-track{background:transparent}.user-settings .panel::-webkit-scrollbar-thumb{background:rgba(156,163,175,.25);border-radius:9999px;opacity:.25}.user-settings .footer{align-items:center;color:var(--color-gray-500);display:flex;flex-direction:column;font-size:12px;gap:calc(var(--spacing)*1);padding-bottom:calc(var(--spacing)*3);padding-top:calc(var(--spacing)*6)}.user-settings .footer a.issue-link{color:var(--color-gray-600);cursor:pointer;text-decoration-line:underline;text-underline-offset:2px;-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){color:var(--color-gray-800)}}}.user-settings .footer .brand{color:var(--color-gray-500);cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){color:var(--color-gray-700)}}}.user-settings button{-webkit-user-select:none;-moz-user-select:none;user-select:none}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-border-style:solid;--tw-font-weight:initial}}'
  var doc = document
  function c(tag, opts) {
    const el = doc.createElement(tag)
    if (!opts) return el
    if (opts.className) el.className = opts.className
    if (opts.classes) for (const cls of opts.classes) el.classList.add(cls)
    if (opts.dataset && el.dataset)
      for (const k of Object.keys(opts.dataset)) el.dataset[k] = opts.dataset[k]
    if (opts.attrs)
      for (const k of Object.keys(opts.attrs)) el.setAttribute(k, opts.attrs[k])
    if (opts.style)
      for (const k of Object.keys(opts.style)) el.style[k] = opts.style[k]
    if ('text' in opts) el.textContent = opts.text || ''
    if (opts.type && 'type' in el) el.type = opts.type
    if ('value' in opts && 'value' in el) el.value = opts.value || ''
    if (opts.rows && 'rows' in el) el.rows = opts.rows
    if (opts.placeholder && 'placeholder' in el)
      el.placeholder = opts.placeholder
    if (typeof opts.checked === 'boolean' && 'checked' in el)
      el.checked = opts.checked
    if (opts.children) {
      for (const ch of opts.children) {
        if (typeof ch === 'string') el.append(doc.createTextNode(ch))
        else el.append(ch)
      }
    }
    return el
  }
  function clearChildren(el) {
    try {
      el.textContent = ''
    } catch (e) {
      try {
        while (el.firstChild) el.firstChild.remove()
      } catch (e2) {}
    }
  }
  function addStyleToShadow(shadowRoot, css) {
    try {
      if (shadowRoot.adoptedStyleSheets) {
        const sheet = new CSSStyleSheet()
        sheet.replaceSync(css)
        shadowRoot.adoptedStyleSheets = [
          ...shadowRoot.adoptedStyleSheets,
          sheet,
        ]
        return
      }
    } catch (e) {}
    const s = c('style', { text: css })
    shadowRoot.append(s)
  }
  function camelToKebab(str) {
    return str.replaceAll(/[A-Z]/g, (letter) =>
      '-'.concat(letter.toLowerCase())
    )
  }
  function ensureShadowRoot(options) {
    const key = options.hostDatasetKey || 'userscriptHost'
    const val = options.hostId
    const attrKey = camelToKebab(key)
    const sel = '[data-'.concat(attrKey, '="').concat(val, '"]')
    const existing = doc.querySelector(sel)
    if (existing instanceof HTMLDivElement && existing.shadowRoot) {
      if (!existing.isConnected || options.moveToEnd) {
        try {
          doc.documentElement.append(existing)
        } catch (e) {}
      }
      return { host: existing, root: existing.shadowRoot, existed: true }
    }
    const host = c('div', { dataset: { [key]: val } })
    const root = host.attachShadow({ mode: 'open' })
    if (options.style) {
      addStyleToShadow(root, options.style)
    }
    doc.documentElement.append(host)
    return { host, root, existed: false }
  }
  var win = globalThis
  function isTopFrame() {
    return win.self === win.top
  }
  var normalizeToDefaultType = (val, dv) => {
    const t = typeof dv
    if (t === 'number') {
      const n = Number(val)
      return Number.isFinite(n) ? n : dv
    }
    if (t === 'object') {
      return val && typeof val === 'object' ? val : dv
    }
    return typeof val === t ? val : dv
  }
  function setOrDelete(obj, key, value, defaultValue) {
    const normalized = normalizeToDefaultType(value, defaultValue)
    const isEqual = (a, b) => {
      if (a === b) return true
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        try {
          return JSON.stringify(a) === JSON.stringify(b)
        } catch (e) {}
      }
      return false
    }
    if (isEqual(normalized, defaultValue)) {
      delete obj[key]
    } else {
      obj[key] = normalized
    }
  }
  function isObject(item) {
    return Boolean(item) && typeof item === 'object'
  }
  var currentHost
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      closeSettingsPanel()
    }
  }
  function closeSettingsPanel() {
    try {
      currentHost == null ? void 0 : currentHost.remove()
    } catch (e) {}
    try {
      globalThis.removeEventListener('keydown', onKeyDown, true)
    } catch (e) {}
    currentHost = void 0
  }
  function createFieldRow(opts, content) {
    const row = c('div', { className: 'row', dataset: { key: opts.key } })
    const labWrap = c('div', { className: 'label-wrap' })
    const lab = c('label', { text: opts.label })
    labWrap.append(lab)
    if (opts.help) {
      labWrap.append(c('div', { className: 'field-help', text: opts.help }))
    } else if (opts.renderHelp) {
      const helpEl = c('div', { className: 'field-help' })
      opts.renderHelp(helpEl)
      labWrap.append(helpEl)
    }
    const val = c('div', { className: 'value-wrap' })
    if (Array.isArray(content)) {
      val.append(...content)
    } else {
      val.append(content)
    }
    row.append(labWrap)
    row.append(val)
    return row
  }
  function createToggleRow(opts) {
    const seg = c('div', { className: 'toggle-wrap' })
    const chk = c('input', {
      type: 'checkbox',
      className: 'toggle-checkbox',
      dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
    })
    seg.append(chk)
    const row = createFieldRow(opts, seg)
    return { row, chk }
  }
  function createInputRow(opts) {
    const inp = c('input', {
      type: 'text',
      placeholder: opts.placeholder || '',
      dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
    })
    const row = createFieldRow(opts, inp)
    return { row, inp }
  }
  function createTextareaRow(opts) {
    const ta = c('textarea', {
      rows: opts.rows || 4,
      dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
    })
    const row = createFieldRow(opts, ta)
    return { row, ta }
  }
  function createRadioRow(opts) {
    const seg = c('div', { className: 'seg' })
    for (const o of opts.options) {
      const b = c('button', {
        className: 'seg-btn',
        dataset: {
          key: opts.key,
          value: o.value,
          isSitePref: opts.isSitePref ? '1' : '',
        },
        text: o.label,
      })
      seg.append(b)
    }
    const row = createFieldRow(opts, seg)
    return { row, seg }
  }
  function createColorRow(opts) {
    const seg = c('div', { className: 'color-row' })
    for (const o of opts.options) {
      const b = c('button', {
        className: 'color-swatch',
        dataset: {
          key: opts.key,
          value: o.value,
          isSitePref: opts.isSitePref ? '1' : '',
        },
        style: { backgroundColor: o.value },
      })
      seg.append(b)
    }
    const row = createFieldRow(opts, seg)
    return { row, seg }
  }
  function createSelectRow(opts) {
    const sel = c('select', {
      dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
    })
    for (const o of opts.options) {
      const opt = c('option', { value: o.value, text: o.label })
      sel.append(opt)
    }
    const row = createFieldRow(opts, sel)
    return { row, sel }
  }
  function createActionRow(opts) {
    const act = c('div', {
      className: 'seg'.concat(opts.layout === 'vertical' ? ' vertical' : ''),
    })
    for (const a of opts.actions) {
      const b = c('button', {
        className: 'btn action-btn'.concat(
          a.kind === 'danger' ? ' btn-danger' : ''
        ),
        dataset: { key: opts.key, action: a.id },
        text: a.text,
      })
      act.append(b)
    }
    const row = createFieldRow(opts, act)
    return { row }
  }
  function openSettingsPanel(schema, store2, options) {
    if (!isTopFrame()) {
      return
    }
    const { host, root, existed } = ensureShadowRoot({
      hostId:
        (options == null ? void 0 : options.hostDatasetValue) || 'settings',
      hostDatasetKey:
        (options == null ? void 0 : options.hostDatasetKey) || 'userHost',
      style: style_default2.concat(
        (options == null ? void 0 : options.styleText) || ''
      ),
      moveToEnd: true,
    })
    currentHost = host
    if (existed) return
    let lastValues = { global: {}, site: {} }
    const wrap = c('div', { className: 'user-settings' })
    applyThemeStyles(wrap, options == null ? void 0 : options.theme)
    const panel = c('div', { className: 'panel' })
    const grid = c('div', { className: 'grid' })
    const { row: headerRow } = buildHeader(schema.title)
    grid.append(headerRow)
    const fillers = {}
    const addFiller = (key, fn) => {
      if (!fillers[key]) fillers[key] = []
      fillers[key].push(fn)
    }
    function appendAndFill(container, row, key, filler) {
      container.append(row)
      addFiller(key, filler)
    }
    function appendField(container, f) {
      switch (f.type) {
        case 'toggle': {
          const { row, chk } = createToggleRow({
            label: f.label,
            key: f.key,
            help: f.help,
            renderHelp: f.renderHelp,
            isSitePref: f.isSitePref,
          })
          appendAndFill(container, row, f.key, () => {
            fillToggleUI(chk, f.key)
          })
          break
        }
        case 'input': {
          const { row, inp } = createInputRow({
            label: f.label,
            key: f.key,
            placeholder: f.placeholder,
            help: f.help,
            isSitePref: f.isSitePref,
          })
          appendAndFill(container, row, f.key, () => {
            fillInput(inp, f.key)
          })
          break
        }
        case 'textarea': {
          const { row, ta } = createTextareaRow({
            label: f.label,
            key: f.key,
            rows: f.rows,
            help: f.help,
            isSitePref: f.isSitePref,
          })
          appendAndFill(container, row, f.key, () => {
            fillTextarea(ta, f.key)
          })
          break
        }
        case 'radio': {
          const { row, seg } = createRadioRow({
            label: f.label,
            key: f.key,
            options: f.options,
            help: f.help,
            isSitePref: f.isSitePref,
          })
          appendAndFill(container, row, f.key, () => {
            fillRadioUI(seg, f.key)
          })
          break
        }
        case 'select': {
          const { row, sel } = createSelectRow({
            label: f.label,
            key: f.key,
            options: f.options,
            help: f.help,
            isSitePref: f.isSitePref,
          })
          appendAndFill(container, row, f.key, () => {
            fillSelect(sel, f.key)
          })
          break
        }
        case 'colors': {
          const { row, seg } = createColorRow({
            label: f.label,
            key: f.key,
            options: f.options,
            help: f.help,
            isSitePref: f.isSitePref,
          })
          appendAndFill(container, row, f.key, () => {
            fillColorUI(seg, f.key)
          })
          break
        }
        case 'action': {
          const { row } = createActionRow({
            label: f.label,
            key: f.key,
            actions: f.actions,
            help: f.help,
            renderHelp: f.renderHelp,
            layout: f.layout,
          })
          container.append(row)
          break
        }
        case 'custom': {
          const row = c('div', { className: 'row custom-row' })
          if (f.label) {
            const lab = c('label', { text: f.label })
            row.append(lab)
          }
          if (f.help) {
            const help = c('div', { className: 'field-help', text: f.help })
            row.append(help)
          }
          const { update } = f.render(row, {
            key: f.key,
            isSitePref: f.isSitePref,
            onChange(val) {
              void store2.set({ [f.key]: val }, !f.isSitePref)
            },
          })
          appendAndFill(container, row, f.key, () => {
            const value = getFieldValue(f.key, f.isSitePref)
            update(value)
          })
          break
        }
        case 'help': {
          const row = c('div', { className: 'row help-row' })
          const help = c('div', { className: 'field-help', text: f.help })
          row.append(help)
          container.append(row)
          break
        }
      }
    }
    function applyThemeStyles(wrap2, theme) {
      if (!theme) return
      const properties = []
      if (theme.activeBg)
        properties.push('--user-active-bg: '.concat(theme.activeBg, ';'))
      if (theme.activeFg)
        properties.push('--user-active-fg: '.concat(theme.activeFg, ';'))
      if (theme.colorRing)
        properties.push('--user-color-ring: '.concat(theme.colorRing, ';'))
      if (theme.toggleOnBg)
        properties.push('--user-toggle-on-bg: '.concat(theme.toggleOnBg, ';'))
      const accent = theme.activeBg || theme.colorRing
      if (accent) properties.push('--user-accent: '.concat(accent, ';'))
      if (properties.length > 0) wrap2.style.cssText = properties.join(' ')
    }
    function buildHeader(title) {
      const row = c('div', { className: 'row header-row' })
      const titleEl = c('label', { className: 'panel-title', text: title })
      row.append(titleEl)
      return { row }
    }
    function renderSimplePanel(container, data) {
      if (data.groups && Array.isArray(data.groups)) {
        renderGroupsPanel(container, data.groups)
        return
      }
      const fields = data.fields || []
      const body = c('div', { className: 'grid group' })
      container.append(body)
      for (const f of fields) appendField(body, f)
    }
    function renderTabsPanel(container, tabs) {
      var _a
      const tabsWrap = c('div', { className: 'tabs' })
      const panels = {}
      let active = ((_a = tabs[0]) == null ? void 0 : _a.id) || ''
      for (const t of tabs) {
        const b = c('button', {
          className: 'tab-btn',
          dataset: { tabId: t.id },
          text: t.title,
        })
        tabsWrap.append(b)
        const p = c('div', { className: 'grid' })
        panels[t.id] = p
        if (t.id !== active) p.style.display = 'none'
        if ('groups' in t && Array.isArray(t.groups)) {
          renderGroupsPanel(p, t.groups)
        } else if ('fields' in t && Array.isArray(t.fields)) {
          p.className = 'grid group'
          for (const f of t.fields) appendField(p, f)
        }
      }
      container.append(tabsWrap)
      for (const id of Object.keys(panels)) container.append(panels[id])
      function updateTabsUI() {
        for (const b of Array.from(tabsWrap.querySelectorAll('.tab-btn'))) {
          const id = b.dataset.tabId || ''
          if (id === active) b.classList.add('active')
          else b.classList.remove('active')
        }
        for (const id of Object.keys(panels)) {
          panels[id].style.display = id === active ? '' : 'none'
        }
      }
      function onTabsClick(e) {
        const t = e.target
        const b = t.closest('.tab-btn')
        if (b && b instanceof HTMLElement) {
          active = b.dataset.tabId || ''
          updateTabsUI()
        }
      }
      tabsWrap.addEventListener('click', onTabsClick)
      updateTabsUI()
    }
    function renderGroupsPanel(container, groups) {
      for (const g of groups) {
        const body = c('div', { className: 'grid group' })
        if (g.title) {
          const header = c('h2', { className: 'group-title', text: g.title })
          container.append(header)
        }
        container.append(body)
        for (const f of g.fields) appendField(body, f)
      }
    }
    const refreshAll = async () => {
      try {
        const g = await store2.getAll(true)
        const s = await store2.getAll(false)
        lastValues = { global: g, site: s }
      } catch (e) {}
      for (const k of Object.keys(fillers)) {
        for (const fn of fillers[k]) {
          try {
            fn()
          } catch (e) {}
        }
      }
    }
    function wireStoreChange(store3, fillers2) {
      var _a
      try {
        ;(_a = store3.onChange) == null
          ? void 0
          : _a.call(store3, (e) => {
              if (e.key === '*' || !fillers2[e.key]) {
                void refreshAll()
                return
              }
              for (const fn of fillers2[e.key]) {
                try {
                  fn()
                } catch (e2) {}
              }
            })
      } catch (e) {}
    }
    function getFieldValue(key, el) {
      const isSitePref =
        el instanceof HTMLElement ? Boolean(el.dataset.isSitePref) : Boolean(el)
      const values = isSitePref ? lastValues.site : lastValues.global
      return values[key]
    }
    function getFieldInfo(el) {
      const key = el.dataset.key
      if (!key) return null
      const isSitePref = Boolean(el.dataset.isSitePref)
      return { key, isSitePref }
    }
    function fillRadioUI(seg, key) {
      try {
        const btn = seg.querySelector('.seg-btn')
        if (!btn) return
        const v = getFieldValue(key, btn)
        for (const b of Array.from(seg.querySelectorAll('.seg-btn'))) {
          const val = b.dataset.value || ''
          if (val === String(v)) b.classList.add('active')
          else b.classList.remove('active')
        }
      } catch (e) {}
    }
    function fillColorUI(seg, key) {
      try {
        const btn = seg.querySelector('.color-swatch')
        if (!btn) return
        const v = getFieldValue(key, btn)
        for (const b of Array.from(seg.querySelectorAll('.color-swatch'))) {
          const val = b.dataset.value || ''
          if (val.toLowerCase() === String(v || '').toLowerCase())
            b.classList.add('active')
          else b.classList.remove('active')
        }
      } catch (e) {}
    }
    function fillToggleUI(onBtn, key) {
      try {
        if (onBtn instanceof HTMLInputElement && onBtn.type === 'checkbox') {
          const v = getFieldValue(key, onBtn)
          onBtn.checked = Boolean(v)
        }
      } catch (e) {}
    }
    function fillInput(inp, key) {
      try {
        const v = getFieldValue(key, inp)
        inp.value = String(v != null ? v : '')
      } catch (e) {}
    }
    function fillTextarea(ta, key) {
      try {
        const v = getFieldValue(key, ta)
        ta.value = String(v != null ? v : '')
      } catch (e) {}
    }
    function fillSelect(sel, key) {
      try {
        const v = getFieldValue(key, sel)
        for (const o of Array.from(sel.querySelectorAll('option'))) {
          o.selected = o.value === String(v)
        }
      } catch (e) {}
    }
    async function handleSegButton(rb) {
      const info = getFieldInfo(rb)
      if (!info) return
      const val = rb.dataset.value || ''
      try {
        await store2.set(info.key, val, !info.isSitePref)
      } catch (e) {}
    }
    async function handleColorSwatch(cs) {
      const info = getFieldInfo(cs)
      if (!info) return
      const val = cs.dataset.value || ''
      try {
        await store2.set(info.key, val, !info.isSitePref)
      } catch (e) {}
    }
    function handleActionBtn(ab) {
      var _a
      const key = ab.dataset.key || ''
      const actionId = ab.dataset.action || ''
      try {
        ;(_a = options == null ? void 0 : options.onAction) == null
          ? void 0
          : _a.call(options, { key, actionId, target: ab })
      } catch (e) {}
    }
    function onPanelClick(e) {
      const t = e.target
      if (t === topCloseBtn) {
        closeSettingsPanel()
        return
      }
      const rb = t.closest('.seg-btn')
      if (rb && rb instanceof HTMLElement) {
        void handleSegButton(rb)
        return
      }
      const cs = t.closest('.color-swatch')
      if (cs && cs instanceof HTMLElement) {
        void handleColorSwatch(cs)
        return
      }
      const ab = t.closest('.action-btn')
      if (ab && ab instanceof HTMLElement) handleActionBtn(ab)
    }
    function handleInputChange(inp) {
      const info = getFieldInfo(inp)
      if (!info) return
      const isCheckbox = (inp.type || '').toLowerCase() === 'checkbox'
      const v = isCheckbox ? Boolean(inp.checked) : inp.value
      void store2.set(info.key, v, !info.isSitePref)
    }
    function handleTextareaChange(ta) {
      const info = getFieldInfo(ta)
      if (!info) return
      void store2.set(info.key, ta.value, !info.isSitePref)
    }
    function handleSelectChange(sel) {
      const info = getFieldInfo(sel)
      if (!info) return
      void store2.set(info.key, sel.value, !info.isSitePref)
    }
    function onPanelChange(e) {
      const t = e.target
      const inp = t.closest('input')
      if (inp && inp instanceof HTMLInputElement) {
        handleInputChange(inp)
        return
      }
      const ta = t.closest('textarea')
      if (ta && ta instanceof HTMLTextAreaElement) {
        handleTextareaChange(ta)
        return
      }
      const sel = t.closest('select')
      if (sel && sel instanceof HTMLSelectElement) {
        handleSelectChange(sel)
      }
    }
    switch (schema.type) {
      case 'simple': {
        renderSimplePanel(grid, schema)
        break
      }
      case 'tabs': {
        renderTabsPanel(grid, schema.tabs)
        break
      }
    }
    panel.addEventListener('click', onPanelClick)
    panel.addEventListener('change', onPanelChange)
    const outerHeader = c('div', { className: 'outer-header' })
    const outerTitle = c('label', {
      className: 'outer-title',
      text: schema.title,
    })
    const topCloseBtn = c('button', {
      className: 'btn-ghost icon close-btn',
      text: '\xD7',
      attrs: { 'aria-label': '\u5173\u95ED' },
    })
    outerHeader.append(outerTitle)
    outerHeader.append(topCloseBtn)
    try {
      outerHeader.addEventListener('click', (e) => {
        const t = e.target
        if (t === topCloseBtn) {
          closeSettingsPanel()
        }
      })
    } catch (e) {}
    panel.append(grid)
    const footer = c('div', { className: 'footer' })
    const issueLink = c('a', {
      className: 'issue-link',
      text: 'Report an Issue\u2026',
      attrs: {
        href:
          (options == null ? void 0 : options.issuesUrl) ||
          'https://github.com/utags/userscripts/issues',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    })
    const brand = c('a', {
      className: 'brand',
      text: 'Made with \u2764\uFE0F by Pipecraft',
      attrs: {
        href: 'https://www.pipecraft.net/',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    })
    footer.append(issueLink)
    footer.append(brand)
    panel.append(footer)
    const stickyThreshold = 22
    let stickyTimer
    const stickyDebounceMs = 80
    function updateHeaderStickyCore() {
      try {
        const sc = panel.scrollTop || 0
        const stuck = sc > stickyThreshold
        if (stuck) {
          panel.classList.add('panel-stuck')
          outerHeader.classList.add('stuck')
        } else {
          panel.classList.remove('panel-stuck')
          outerHeader.classList.remove('stuck')
        }
      } catch (e) {}
    }
    function updateHeaderSticky() {
      try {
        if (stickyTimer !== void 0) globalThis.clearTimeout(stickyTimer)
        stickyTimer = globalThis.setTimeout(
          updateHeaderStickyCore,
          stickyDebounceMs
        )
      } catch (e) {}
    }
    try {
      panel.addEventListener('scroll', updateHeaderSticky)
      updateHeaderStickyCore()
    } catch (e) {}
    wrap.append(outerHeader)
    wrap.append(panel)
    root.append(wrap)
    wireStoreChange(store2, fillers)
    void refreshAll()
    globalThis.addEventListener('keydown', onKeyDown, true)
  }
  function createSettingsStore(
    storageKey2,
    defaults,
    isSupportSitePref = false
  ) {
    const rootKey = storageKey2 || 'settings'
    let cache
    let globalCache
    let siteCache
    let initPromise
    const changeCbs = []
    let listenerRegistered = false
    const getHostname = () => {
      var _a
      return (
        ((_a = globalThis.location) == null ? void 0 : _a.hostname) || 'unknown'
      )
    }
    let beforeSetHook
    function updateCache(obj) {
      if (isSupportSitePref) {
        const rootObj = isObject(obj) ? obj : {}
        const globalData = rootObj.global
        globalCache = __spreadValues({}, defaults)
        if (isObject(globalData)) {
          Object.assign(globalCache, globalData)
        }
        const hostname = getHostname()
        const siteData = rootObj[hostname]
        siteCache = __spreadValues({}, globalCache)
        if (isObject(siteData)) {
          Object.assign(siteCache, siteData)
        }
        cache = siteCache
      } else {
        cache = __spreadValues({}, defaults)
        if (isObject(obj)) Object.assign(cache, obj)
      }
    }
    function registerValueChangeListener() {
      if (listenerRegistered) return
      try {
        void addValueChangeListener(rootKey, (n, ov, nv, remote) => {
          try {
            updateCache(nv)
            for (const f of changeCbs) {
              f({ key: '*', oldValue: ov, newValue: nv, remote })
            }
          } catch (e) {}
        })
        listenerRegistered = true
      } catch (e) {}
    }
    registerValueChangeListener()
    async function ensure() {
      if (cache) return cache
      if (initPromise) return initPromise
      initPromise = (async () => {
        let obj
        try {
          obj = await getValue(rootKey, void 0)
        } catch (e) {}
        updateCache(obj)
        initPromise = void 0
        return cache
      })()
      return initPromise
    }
    return {
      async get(key, isGlobalPref) {
        await ensure()
        if (isSupportSitePref) {
          if (isGlobalPref) return globalCache[key]
          return siteCache[key]
        }
        return cache[key]
      },
      async getAll(isGlobalPref) {
        await ensure()
        if (isSupportSitePref) {
          if (isGlobalPref) return __spreadValues({}, globalCache)
          return __spreadValues({}, siteCache)
        }
        return __spreadValues({}, cache)
      },
      async set(...args) {
        let obj
        try {
          obj = await getValue(rootKey, {})
        } catch (e) {}
        if (!isObject(obj)) obj = {}
        let isGlobalPref = false
        let values = {}
        if (typeof args[0] === 'string') {
          values[args[0]] = args[1]
          isGlobalPref = Boolean(args[2])
        } else {
          values = __spreadValues({}, args[0])
          isGlobalPref = Boolean(args[1])
        }
        if (beforeSetHook) {
          try {
            values = await beforeSetHook(values, isGlobalPref)
          } catch (e) {}
        }
        let target
        let global
        if (isSupportSitePref) {
          const hostname = isGlobalPref ? 'global' : getHostname()
          if (!isObject(obj[hostname])) obj[hostname] = {}
          target = obj[hostname]
          global = isObject(obj.global) ? obj.global : {}
        } else {
          target = obj
        }
        const isSitePref = isSupportSitePref && !isGlobalPref
        const apply = (key, value) => {
          if (isSitePref && key in global) {
            const normalized = normalizeToDefaultType(value, defaults[key])
            target[key] = normalized
            return
          }
          setOrDelete(target, key, value, defaults[key])
        }
        if (values) {
          for (const k of Object.keys(values)) {
            const v = values[k]
            apply(k, v)
          }
        }
        if (isSupportSitePref && target && Object.keys(target).length === 0) {
          const hostname = isGlobalPref ? 'global' : getHostname()
          delete obj[hostname]
        }
        updateCache(obj)
        try {
          await setValue(rootKey, obj)
        } catch (e) {}
      },
      async reset(isGlobalPref) {
        let obj
        if (isSupportSitePref) {
          try {
            obj = await getValue(rootKey, {})
          } catch (e) {}
          if (!isObject(obj)) obj = {}
          const hostname = isGlobalPref ? 'global' : getHostname()
          delete obj[hostname]
        } else {
          obj = {}
        }
        updateCache(obj)
        try {
          await setValue(rootKey, obj)
        } catch (e) {}
      },
      defaults() {
        return __spreadValues({}, defaults)
      },
      onChange(cb) {
        changeCbs.push(cb)
      },
      onBeforeSet(cb) {
        beforeSetHook = cb
      },
    }
  }
  var urlCallbacks = /* @__PURE__ */ new Set()
  var urlWatcherInstalled = false
  function triggerUrlCallbacks() {
    for (const cb of urlCallbacks) {
      try {
        cb()
      } catch (error) {
        console.error(error)
      }
    }
  }
  function onUrlChange(callback) {
    urlCallbacks.add(callback)
    if (!urlWatcherInstalled) {
      installUrlWatcher()
      urlWatcherInstalled = true
    }
    return () => {
      urlCallbacks.delete(callback)
    }
  }
  function installUrlWatcher() {
    try {
      const origPush = history.pushState
      history.pushState = function (...args) {
        const ret = origPush.apply(history, args)
        triggerUrlCallbacks()
        return ret
      }
    } catch (e) {}
    try {
      const origReplace = history.replaceState
      history.replaceState = function (...args) {
        const ret = origReplace.apply(history, args)
        triggerUrlCallbacks()
        return ret
      }
    } catch (e) {}
    globalThis.addEventListener('popstate', triggerUrlCallbacks)
    globalThis.addEventListener('hashchange', triggerUrlCallbacks)
  }
  var domCallbacks = /* @__PURE__ */ new Set()
  var domObserver
  function triggerDomCallbacks() {
    for (const cb of domCallbacks) {
      try {
        cb()
      } catch (error) {
        console.error(error)
      }
    }
  }
  function onDomChange(callback) {
    domCallbacks.add(callback)
    ensureDomObserver()
    return () => {
      domCallbacks.delete(callback)
    }
  }
  function ensureDomObserver() {
    if (domObserver) return
    const root = document.body || document.documentElement
    if (!root) {
      if (document.readyState === 'loading') {
        document.addEventListener(
          'DOMContentLoaded',
          () => {
            ensureDomObserver()
          },
          { once: true }
        )
      }
      return
    }
    domObserver = new MutationObserver(() => {
      triggerDomCallbacks()
    })
    domObserver.observe(root, {
      childList: true,
      subtree: true,
    })
  }
  function debounce(fn, delay) {
    let timer
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  }
  var CHECK_INTERVAL = 30 * 1e3
  var LOCK_TIMEOUT = 20 * 1e3
  var KEY_LOCK = 'check_lock'
  var KEY_LAST_CHECK = 'last_check'
  var KEY_UNREAD_COUNT = 'unread_count'
  async function setUnreadCount(count) {
    return setValue(KEY_UNREAD_COUNT, count)
  }
  var initialized = false
  var currentUnreadCount = 0
  var utagsHostObserver
  var utagsShadowObserver
  function startUtagsObserver(getSettings2) {
    const onShadowMutation = (mutations) => {
      let shouldUpdate = false
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          shouldUpdate = true
          break
        }
      }
      if (shouldUpdate) {
        updateUtagsShortcuts(currentUnreadCount, getSettings2)
      }
    }
    const onDocumentMutation = (mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLElement &&
            node.dataset.ushortcutsHost === 'utags-shortcuts'
          ) {
            observeShadowRoot(node)
            updateUtagsShortcuts(currentUnreadCount, getSettings2)
          }
        }
      }
    }
    function observeShadowRoot(host2) {
      if (utagsShadowObserver) utagsShadowObserver.disconnect()
      if (!host2.shadowRoot) return
      utagsShadowObserver = new MutationObserver(onShadowMutation)
      utagsShadowObserver.observe(host2.shadowRoot, {
        childList: true,
        subtree: true,
      })
    }
    const host = document.querySelector(
      '[data-ushortcuts-host="utags-shortcuts"]'
    )
    if (host) {
      observeShadowRoot(host)
    }
    utagsHostObserver = new MutationObserver(onDocumentMutation)
    utagsHostObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  }
  async function fetchUnreadCount() {
    try {
      const res = await fetch(
        'https://2libra.com/api/notifications/unread-count'
      )
      const json = await res.json()
      if (json.c === 0 && json.d) {
        return json.d.unread_count
      }
    } catch (error) {
      console.error('[2libra-plus] Failed to fetch unread count', error)
    }
    return void 0
  }
  var originalFavicon
  var lastGeneratedFavicon
  var faviconObserver
  function updateFavicon(count) {
    const links = Array.from(document.querySelectorAll('link[rel~="icon"]'))
    const freshLinks = links.filter(
      (l) =>
        l.href !== lastGeneratedFavicon &&
        l.dataset.count === void 0 &&
        l.getAttribute('href')
    )
    if (freshLinks.length > 0) {
      originalFavicon = freshLinks[freshLinks.length - 1].href
    } else if (originalFavicon === void 0) {
      originalFavicon = '/favicon.ico'
    }
    let link = links[0]
    if (links.length > 1) {
      for (let i = 1; i < links.length; i++) {
        const l = links[i]
        l.removeAttribute('href')
        l.removeAttribute('rel')
        delete l.dataset.count
      }
    }
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.append(link)
    }
    if (count === 0) {
      if (link.href !== originalFavicon) {
        link.href = originalFavicon
        link.dataset.count = ''
        lastGeneratedFavicon = void 0
      }
      return
    }
    if (
      link.dataset.count === count.toString() &&
      link.href === lastGeneratedFavicon
    ) {
      return
    }
    link.type = 'image/png'
    link.dataset.count = count.toString()
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.addEventListener('load', () => {
      ctx.clearRect(0, 0, 32, 32)
      ctx.drawImage(img, 0, 0, 32, 32)
      ctx.beginPath()
      ctx.arc(22, 22, 10, 0, 2 * Math.PI)
      ctx.fillStyle = '#ff0000'
      ctx.fill()
      const text = count > 99 ? '99+' : count.toString()
      ctx.font = count > 99 ? 'bold 12px sans-serif' : 'bold 16px sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 22, 23)
      if (link) {
        const dataUrl = canvas.toDataURL('image/png')
        if (link.href === dataUrl) return
        lastGeneratedFavicon = dataUrl
        link.href = dataUrl
        if (link.parentNode === document.head) {
        }
      }
    })
    img.addEventListener('error', () => {})
    img.src = originalFavicon
  }
  function startFaviconObserver() {
    if (faviconObserver) return
    faviconObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLLinkElement && node.rel.includes('icon')) {
              if (node.href === lastGeneratedFavicon) continue
              shouldUpdate = true
            }
          }
        } else if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'href'
        ) {
          const target = mutation.target
          if (target.rel && target.rel.includes('icon')) {
            if (target.href === lastGeneratedFavicon) continue
            shouldUpdate = true
          }
        }
      }
      if (shouldUpdate) {
        updateFavicon(currentUnreadCount)
      }
    })
    faviconObserver.observe(document.head, {
      childList: true,
      attributes: true,
      attributeFilter: ['href'],
    })
  }
  var updateUtagsShortcuts = debounce((count, getSettings2) => {
    const settings = getSettings2()
    const displayCount = settings.checkUnreadNotificationsUtags ? count : 0
    const host = document.querySelector(
      '[data-ushortcuts-host="utags-shortcuts"]'
    )
    if (!host || !host.shadowRoot) return
    const links = host.shadowRoot.querySelectorAll('a')
    for (const link of links) {
      try {
        updateUtagsShortcutsLink(link, displayCount)
      } catch (e) {}
    }
  }, 200)
  function updateUtagsShortcutsLink(link, count) {
    const url = new URL(link.href)
    if (url.origin !== location.origin || url.pathname !== '/notifications')
      return
    const textSpan = link.querySelector('.title-text')
    if (!textSpan) return
    if (count > 0) {
      if (!textSpan.dataset.originalText) {
        textSpan.dataset.originalText = textSpan.textContent || '\u901A\u77E5'
      }
      const newText = ''
        .concat(textSpan.dataset.originalText, ' (')
        .concat(count, ' \u6761\u672A\u8BFB)')
      if (textSpan.textContent !== newText) {
        textSpan.textContent = newText
      }
      if (textSpan.style.fontWeight !== 'bold') {
        textSpan.style.fontWeight = 'bold'
      }
      if (textSpan.style.color !== 'red') {
        textSpan.style.color = 'red'
      }
    } else if (textSpan.dataset.originalText) {
      if (textSpan.textContent !== textSpan.dataset.originalText) {
        textSpan.textContent = textSpan.dataset.originalText
      }
      delete textSpan.dataset.originalText
      if (textSpan.style.fontWeight !== '') {
        textSpan.style.fontWeight = ''
      }
      if (textSpan.style.color !== '') {
        textSpan.style.color = ''
      }
    }
  }
  function updateUI(count, getSettings2) {
    currentUnreadCount = count
    const settings = getSettings2()
    const element = document.querySelector(
      '[data-right-sidebar="true"] .card-body a[href="/notifications"] > div'
    )
    if (element) {
      const newText = ''.concat(count, ' \u6761\u6D88\u606F')
      const className = count > 0 ? 'text-primary' : ''
      if (element.textContent !== newText) {
        element.textContent = newText
      }
      if (element.className !== className) {
        element.className = className
      }
    }
    const faviconCount = settings.checkUnreadNotificationsFavicon ? count : 0
    updateFavicon(faviconCount)
    updateUtagsShortcuts(count, getSettings2)
    const title = document.title
    const prefixRegex = /^\(\d+\) /
    let newTitle = title
    if (settings.checkUnreadNotificationsTitle && count > 0) {
      const newPrefix = '('.concat(count, ') ')
      newTitle = prefixRegex.test(title)
        ? title.replace(prefixRegex, newPrefix)
        : newPrefix + title
    } else {
      newTitle = title.replace(prefixRegex, '')
    }
    if (newTitle !== title) {
      document.title = newTitle
    }
  }
  async function check(getSettings2, force = false) {
    const settings = getSettings2()
    if (!settings.enabled || !settings.checkUnreadNotifications) return
    const now = Date.now()
    if (!force) {
      const lastCheck = await getValue(KEY_LAST_CHECK, 0)
      if (now - lastCheck < CHECK_INTERVAL) return
    }
    const lockTime = await getValue(KEY_LOCK, 0)
    if (now - lockTime < LOCK_TIMEOUT) return
    await setValue(KEY_LOCK, now)
    const currentLock = await getValue(KEY_LOCK, 0)
    if (currentLock !== now) return
    try {
      const count = await fetchUnreadCount()
      if (count !== void 0) {
        await setValue(KEY_UNREAD_COUNT, count)
        await setValue(KEY_LAST_CHECK, Date.now())
      }
    } finally {
      await setValue(KEY_LOCK, 0)
    }
  }
  function initCheckNotifications(getSettings2) {
    if (initialized) return
    initialized = true
    startUtagsObserver(getSettings2)
    startFaviconObserver()
    void addValueChangeListener(KEY_UNREAD_COUNT, (_key, _old, newValue) => {
      if (typeof newValue === 'number') {
        updateUI(newValue, getSettings2)
      }
    })
    void (async () => {
      const value = await getValue(KEY_UNREAD_COUNT)
      if (typeof value === 'number') {
        updateUI(value, getSettings2)
      }
    })()
    setInterval(() => {
      void check(getSettings2)
    }, 10 * 1e3)
    void check(getSettings2)
  }
  function runCheckNotifications(getSettings2) {
    void check(getSettings2)
    void (async () => {
      const value = await getValue(KEY_UNREAD_COUNT)
      if (typeof value === 'number') {
        updateUI(value, getSettings2)
      }
    })()
  }
  var initialized2 = false
  var clickTimer
  function isNotificationsPage() {
    const loc = globalThis.location
    if (!loc) return false
    return loc.pathname === '/notifications'
  }
  function markUnreadItems() {
    if (!isNotificationsPage()) return
    const items = document.querySelectorAll(
      'div[data-main-left] .card > div.flex'
    )
    for (const item of items) {
      if (item.dataset.unreadMark === '1') continue
      const spans = item.querySelectorAll('span')
      let isUnread = false
      for (const span of spans) {
        if (span.textContent && span.textContent.trim() === '\u672A\u8BFB') {
          isUnread = true
          break
        }
      }
      if (!isUnread) continue
      item.dataset.unreadMark = '1'
    }
  }
  function tryClickMarkButton(getSettings2) {
    const settings = getSettings2()
    if (!settings.enabled || !settings.autoMarkNotificationsRead) return
    if (!isNotificationsPage()) return
    markUnreadItems()
    const btn = document.querySelector(
      'div[data-main-left] button.btn-primary:not(.btn-disabled)'
    )
    if (!btn) return
    console.info(
      '[2libra-plus] \u{1F518} \u81EA\u52A8\u70B9\u51FB"\u5DF2\u8BFB\u5F53\u524D\u9875"\u6309\u94AE'
    )
    btn.click()
  }
  function bindMarkReadButton(getSettings2) {
    const settings = getSettings2()
    if (!settings.enabled) return
    if (!isNotificationsPage()) return
    const btn = document.querySelector(
      'div[data-main-left] button.btn-primary:not(.btn-disabled)'
    )
    if (!btn) return
    if (btn.dataset.listenClick === '1') return
    btn.dataset.listenClick = '1'
    btn.addEventListener('click', () => {
      void setUnreadCount(0)
      setTimeout(() => {
        void check(getSettings2, true)
      }, 1e3)
    })
  }
  function scheduleClick(getSettings2) {
    if (clickTimer !== void 0) {
      globalThis.clearTimeout(clickTimer)
    }
    clickTimer = globalThis.setTimeout(() => {
      clickTimer = void 0
      tryClickMarkButton(getSettings2)
    }, 800)
  }
  function runAutoMarkNotificationsRead(getSettings2) {
    scheduleClick(getSettings2)
  }
  function initAutoMarkNotificationsRead(getSettings2) {
    if (initialized2) return
    initialized2 = true
    const check2 = () => {
      bindMarkReadButton(getSettings2)
      scheduleClick(getSettings2)
    }
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          check2()
        },
        { once: true }
      )
    } else {
      check2()
    }
    onUrlChange(check2)
    onDomChange(check2)
  }
  var STORAGE_KEY_SORT_MODE = '2libra_plus_sort_mode'
  var sortState = {
    mode: 'default',
  }
  var initialized3 = false
  function saveSortMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY_SORT_MODE, mode)
    } catch (e) {}
  }
  function loadSortMode() {
    try {
      return localStorage.getItem(STORAGE_KEY_SORT_MODE) || void 0
    } catch (e) {
      return void 0
    }
  }
  function getListContainer() {
    const list = document.querySelector('[data-main-left="true"] ul.card')
    return list || void 0
  }
  function getItems(list) {
    var _a, _b
    const children = Array.from(list.children)
    const items = []
    let nextIndex = 0
    for (const child of children) {
      if (!(child instanceof HTMLLIElement)) continue
      let index
      const stored = child.dataset.replySortIndex
      if (stored) {
        const n = Number.parseInt(stored, 10)
        index = Number.isFinite(n) ? n : nextIndex
      } else {
        index = nextIndex
        child.dataset.replySortIndex = String(index)
      }
      nextIndex = index + 1
      const timeEl = child.querySelector('time[datetime]')
      let time
      if (timeEl) {
        const dt = timeEl.getAttribute('datetime')
        if (dt) {
          const t = Date.parse(dt)
          if (!Number.isNaN(t)) {
            time = t
          }
        }
      }
      let replyCount
      const badges = child.querySelectorAll('.badge')
      for (let i = badges.length - 1; i >= 0; i -= 1) {
        const text =
          (_b = (_a = badges[i].textContent) == null ? void 0 : _a.trim()) !=
          null
            ? _b
            : ''
        if (!text) continue
        const n = Number.parseInt(text, 10)
        if (Number.isFinite(n)) {
          replyCount = n
          break
        }
      }
      items.push({
        el: child,
        time,
        index,
        replyCount,
      })
    }
    return items
  }
  function applySort(list) {
    const items = getItems(list)
    if (items.length === 0) return
    let ordered
    if (sortState.mode === 'default') {
      ordered = [...items].sort((a, b) => a.index - b.index)
    } else if (sortState.mode === 'newToOld' || sortState.mode === 'oldToNew') {
      const withTime = items.filter((item) => typeof item.time === 'number')
      const withoutTime = items.filter((item) => typeof item.time !== 'number')
      withTime.sort((a, b) => {
        const ta = a.time
        const tb = b.time
        if (ta === tb) return a.index - b.index
        if (sortState.mode === 'newToOld') {
          return tb - ta
        }
        return ta - tb
      })
      withoutTime.sort((a, b) => a.index - b.index)
      ordered = [...withTime, ...withoutTime]
    } else {
      const withCount = items.filter(
        (item) => typeof item.replyCount === 'number'
      )
      const withoutCount = items.filter(
        (item) => typeof item.replyCount !== 'number'
      )
      withCount.sort((a, b) => {
        const ca = a.replyCount
        const cb = b.replyCount
        if (ca === cb) return a.index - b.index
        if (sortState.mode === 'replyDesc') {
          return cb - ca
        }
        return ca - cb
      })
      withoutCount.sort((a, b) => a.index - b.index)
      ordered = [...withCount, ...withoutCount]
    }
    let insertBeforeNode
    const children = Array.from(list.childNodes)
    for (let index = children.length - 1; index >= 0; index -= 1) {
      const node = children[index]
      if (
        !(node instanceof HTMLLIElement) &&
        node instanceof Element &&
        !node.querySelector('[data-libra-plus-sort="reply-time"]')
      ) {
        insertBeforeNode = node
        break
      }
    }
    if (insertBeforeNode) {
      for (const item of ordered) {
        list.insertBefore(item.el, insertBeforeNode)
      }
    } else {
      for (const item of ordered) {
        list.append(item.el)
      }
    }
  }
  function hasUnindexedItems(list) {
    for (const child of list.children) {
      if (child instanceof HTMLLIElement && !child.dataset.replySortIndex) {
        return true
      }
    }
    return false
  }
  function updateActiveButtons(container) {
    const buttons = Array.from(container.querySelectorAll('[data-sort-mode]'))
    for (const btn of buttons) {
      const mode = btn.dataset.sortMode
      if (mode && mode === sortState.mode) {
        btn.classList.add('btn-active')
      } else {
        btn.classList.remove('btn-active')
      }
    }
  }
  function createSortControls(getSettings2) {
    const list = getListContainer()
    if (!list || list.children.length === 0) return void 0
    const root = list
    const sortContainer = document.createElement('div')
    sortContainer.className = 'relative inline-block'
    sortContainer.dataset.libraPlusSort = 'reply-time'
    const toggleButton = document.createElement('button')
    toggleButton.type = 'button'
    toggleButton.className = 'btn btn-xs btn-ghost'
    toggleButton.title = '\u6392\u5E8F'
    toggleButton.textContent = '\u21C5'
    sortContainer.append(toggleButton)
    const menu = document.createElement('div')
    menu.className =
      'hidden absolute right-0 z-20 mt-1 flex flex-col gap-1 rounded bg-base-100 border border-base-content/10 shadow-xs p-1'
    sortContainer.append(menu)
    let menuOpen = false
    const openMenu = () => {
      if (menuOpen) return
      menuOpen = true
      menu.classList.remove('hidden')
    }
    const closeMenu = () => {
      if (!menuOpen) return
      menuOpen = false
      menu.classList.add('hidden')
    }
    toggleButton.addEventListener('click', (event) => {
      event.stopPropagation()
      if (menuOpen) {
        closeMenu()
      } else {
        openMenu()
      }
    })
    document.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!sortContainer.contains(target)) {
        closeMenu()
      }
    })
    const modes = [
      { mode: 'default', label: '\u6309\u9ED8\u8BA4\u987A\u5E8F' },
      {
        mode: 'newToOld',
        label: '\u6309\u56DE\u590D\u65F6\u95F4\uFF08\u65B0\u2192\u8001\uFF09',
      },
      {
        mode: 'oldToNew',
        label: '\u6309\u56DE\u590D\u65F6\u95F4\uFF08\u8001\u2192\u65B0\uFF09',
      },
      {
        mode: 'replyDesc',
        label: '\u6309\u56DE\u590D\u6570\u91CF\uFF08\u591A\u2192\u5C11\uFF09',
      },
      {
        mode: 'replyAsc',
        label: '\u6309\u56DE\u590D\u6570\u91CF\uFF08\u5C11\u2192\u591A\uFF09',
      },
    ]
    for (const { mode, label } of modes) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = label
      btn.className = 'btn btn-xs btn-ghost justify-start w-full'
      btn.dataset.sortMode = mode
      menu.append(btn)
    }
    sortContainer.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof HTMLButtonElement)) return
      const mode = target.dataset.sortMode
      if (!mode || mode === sortState.mode) return
      sortState.mode = mode
      updateActiveButtons(sortContainer)
      const listEl = getListContainer()
      if (listEl && listEl.children.length > 0) {
        applySort(listEl)
      }
      const settings = getSettings2()
      if (settings.rememberSortMode) {
        saveSortMode(mode)
      }
      closeMenu()
    })
    updateActiveButtons(sortContainer)
    let header = root.querySelector(
      ':scope > div.flex.items-center.justify-between'
    )
    if (header) {
      header.append(sortContainer)
    } else {
      header = document.createElement('div')
      header.className =
        'px-2 py-1 border-b border-base-content/10 flex items-center justify-between'
      header.append(sortContainer)
      list.firstChild.before(header)
    }
    ensureBreadcrumbs(header)
    return header
  }
  function ensureBreadcrumbs(header) {
    let isHome = false
    try {
      const loc = globalThis.location
      isHome = Boolean(loc && loc.pathname === '/')
    } catch (e) {}
    const fullTitle = document.title || ''
    const prefix = '2Libra \u203A '
    let pageTitle = fullTitle.startsWith(prefix)
      ? fullTitle.slice(prefix.length).trim()
      : fullTitle.trim()
    if (!pageTitle) {
      pageTitle = '\u9996\u9875'
    }
    let breadcrumbs = header.querySelector(':scope > .breadcrumbs')
    const breadcrumbsOutside = document.querySelector('.breadcrumbs')
    if (!breadcrumbs) {
      breadcrumbs = document.createElement('div')
      breadcrumbs.className = 'breadcrumbs text-sm'
      header.insertBefore(breadcrumbs, header.firstChild)
      if (breadcrumbsOutside) {
        return
      }
    }
    let ul = breadcrumbs.querySelector('ul')
    if (!ul) {
      ul = document.createElement('ul')
      breadcrumbs.append(ul)
    }
    clearChildren(ul)
    if (isHome) {
      const li = document.createElement('li')
      li.className = 'text-base-content/60'
      li.textContent = '\u9996\u9875'
      ul.append(li)
      return
    }
    const liHome = document.createElement('li')
    const a = document.createElement('a')
    a.href = '/'
    a.textContent = '\u9996\u9875'
    liHome.append(a)
    ul.append(liHome)
    const liTitle = document.createElement('li')
    liTitle.className = 'text-base-content/60'
    liTitle.textContent = pageTitle
    ul.append(liTitle)
  }
  function ensureControls(getSettings2) {
    const list = getListContainer()
    if (!list || list.children.length === 0) return
    list.dataset.libraPlusPostListSort = '1'
    const root = list.closest('section') || list.parentElement || list
    const existing = root.querySelector('[data-libra-plus-sort="reply-time"]')
    if (existing) {
      updateActiveButtons(existing)
      return
    }
    createSortControls(getSettings2)
  }
  var modeRestored = false
  function runInternal(getSettings2) {
    const settings = getSettings2()
    if (!settings.enabled || !settings.postListSort) return
    if (!modeRestored && settings.rememberSortMode) {
      const stored = loadSortMode()
      if (stored) {
        sortState.mode = stored
      }
      modeRestored = true
    }
    ensureControls(getSettings2)
    const list = getListContainer()
    if (!list || list.children.length === 0) return
    applySort(list)
  }
  function runPostListSort(getSettings2) {
    runInternal(getSettings2)
  }
  function initPostListSort(getSettings2) {
    if (initialized3) return
    initialized3 = true
    const run = () => {
      runInternal(getSettings2)
    }
    const handleUrlChange = () => {
      const currentSettings = getSettings2()
      if (currentSettings.rememberSortMode) {
        const stored = loadSortMode()
        sortState.mode = stored || 'default'
      } else {
        sortState.mode = 'default'
      }
      runInternal(getSettings2)
    }
    const handleDomChange = () => {
      const list = getListContainer()
      if (!list || list.children.length === 0) return
      if (!hasUnindexedItems(list)) return
      runInternal(getSettings2)
    }
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          run()
        },
        { once: true }
      )
    } else {
      run()
    }
    onUrlChange(handleUrlChange)
    onDomChange(handleDomChange)
  }
  var storageKey = '2libraPlus:lastHomeViewTime'
  var initialized4 = false
  var lastHomeViewBase
  function getListContainer2() {
    return document.querySelector('[data-main-left="true"] ul.card') || void 0
  }
  function getLastHomeViewTime() {
    try {
      const raw = globalThis.localStorage.getItem(storageKey)
      if (raw) {
        const n = Number.parseInt(raw, 10)
        if (Number.isFinite(n) && n > 0) {
          return n
        }
      }
    } catch (e) {}
    return void 0
  }
  function logLastHomeViewTime(base) {
    if (!base) return
    const now = Date.now()
    const diffSeconds = Math.max(0, Math.floor((now - base) / 1e3))
    const minute = 60
    const hour = 60 * minute
    const day = 24 * hour
    let unit = '\u79D2'
    let value = diffSeconds
    if (diffSeconds >= minute && diffSeconds < hour) {
      unit = '\u5206'
      value = Math.floor(diffSeconds / minute)
    } else if (diffSeconds >= hour && diffSeconds < day) {
      unit = '\u5C0F\u65F6'
      value = Math.floor(diffSeconds / hour)
    } else if (diffSeconds >= day) {
      unit = '\u5929'
      value = Math.floor(diffSeconds / day)
    }
    const date = new Date(base)
    const pad = (n) => String(n).padStart(2, '0')
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const dayOfMonth = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())
    const formatted = ''
      .concat(year, '-')
      .concat(month, '-')
      .concat(dayOfMonth, ' ')
      .concat(hours, ':')
      .concat(minutes, ':')
      .concat(seconds)
    console.log(
      '[2libra-plus] \u{1F559} \u4E0A\u6B21\u9996\u9875\u8BBF\u95EE\u65F6\u95F4\uFF1A'
        .concat(value, ' ')
        .concat(unit, ' \u524D\uFF08')
        .concat(formatted, '\uFF09')
    )
  }
  function updateReplyTimeColor(getSettings2) {
    var _a
    let lastHomeViewTime = lastHomeViewBase
    const settings = getSettings2()
    if (!settings.enabled || !settings.replyTimeColor) {
      const timeElements2 = Array.from(
        ((_a = getListContainer2()) == null
          ? void 0
          : _a.querySelectorAll('li time')) || []
      )
      for (const el of timeElements2) {
        el.style.removeProperty('color')
      }
      return
    }
    const list = getListContainer2()
    if (!list) return
    const timeElements = Array.from(list.querySelectorAll('li time'))
    if (timeElements.length === 0) return
    const now = Date.now()
    const timestamps = []
    if (lastHomeViewTime && lastHomeViewTime > now) {
      lastHomeViewTime = void 0
    }
    for (const el of timeElements) {
      const dt = el.getAttribute('datetime')
      if (!dt) continue
      const t = Date.parse(dt)
      if (Number.isNaN(t)) continue
      if (t > now) continue
      timestamps.push(t)
    }
    if (timestamps.length === 0) return
    const min = Math.min(...timestamps)
    const max = Math.max(...timestamps)
    if (!lastHomeViewTime) {
      lastHomeViewTime = min
    }
    if (lastHomeViewTime < min) {
      lastHomeViewTime = min
    } else if (lastHomeViewTime > max) {
      lastHomeViewTime = max
    }
    for (const el of timeElements) {
      const dt = el.getAttribute('datetime')
      if (!dt) continue
      const t = Date.parse(dt)
      if (Number.isNaN(t)) continue
      if (t > now) continue
      let opacity
      if (t >= lastHomeViewTime) {
        const rangeNew = now - lastHomeViewTime || 1
        const ageNew = now - t
        const ratioNew = Math.min(Math.max(ageNew / rangeNew, 0), 1)
        const eased = Math.sqrt(ratioNew)
        opacity = 1 - eased * 0.3
        const percent = Math.round(opacity * 100)
        el.style.color = 'color-mix(in oklab,var(--color-primary) '.concat(
          percent,
          '%,transparent)'
        )
      } else {
        const rangeOld = lastHomeViewTime - min || 1
        const ageOld = lastHomeViewTime - t
        const ratioOld = Math.min(Math.max(ageOld / rangeOld, 0), 1)
        const eased = Math.sqrt(ratioOld)
        const maxOld = 0.69
        const minOld = 0.3
        opacity = maxOld - eased * (maxOld - minOld)
        const percent = Math.round(opacity * 100)
        el.style.color = 'color-mix(in oklab,var(--color-base-content) '.concat(
          percent,
          '%,transparent)'
        )
      }
    }
  }
  function runReplyTimeColor(getSettings2) {
    updateReplyTimeColor(getSettings2)
  }
  function initReplyTimeColor(getSettings2) {
    if (initialized4) return
    initialized4 = true
    const runUpdateColor = () => {
      updateReplyTimeColor(getSettings2)
    }
    const handleHomeView = () => {
      const last = getLastHomeViewTime()
      lastHomeViewBase = last
      logLastHomeViewTime(last)
      runUpdateColor()
      if (globalThis.location.pathname === '/') {
        try {
          const now = Date.now()
          const fiveMinutes = 5 * 60 * 1e3
          if ((!last || now - last >= fiveMinutes) && getListContainer2()) {
            globalThis.localStorage.setItem(storageKey, String(now))
          }
        } catch (e) {}
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          handleHomeView()
        },
        { once: true }
      )
    } else {
      handleHomeView()
    }
    onUrlChange(() => {
      handleHomeView()
    })
    onDomChange(runUpdateColor)
  }
  var initialized5 = false
  function applyHideEmail(cardBody, settings) {
    const emailEl = cardBody.querySelector(':scope > h2 .text-gray-400')
    if (!emailEl) return
    if (settings.hideSidebarEmail) {
      emailEl.style.display = 'none'
    } else {
      emailEl.style.removeProperty('display')
    }
  }
  function applyHideExperience(h2, settings) {
    const experienceEl = h2.nextElementSibling
    if (!experienceEl) return
    if (settings.hideSidebarExperience) {
      experienceEl.style.display = 'none'
    } else {
      experienceEl.style.removeProperty('display')
    }
    return experienceEl
  }
  function applyHideActions(experienceEl, settings) {
    var _a
    const actionsContainer = experienceEl.nextElementSibling
    if (!actionsContainer) return
    const coinsLink = actionsContainer.querySelector('a[href="/coins"]')
    const checkinBtn =
      (_a = actionsContainer.querySelector('[data-tip*="\u7B7E\u5230"]')) ==
      null
        ? void 0
        : _a.parentElement
    const hideCoins = settings.hideSidebarCoins
    const hideCheckin = settings.hideSidebarCheckin
    const spans = Array.from(actionsContainer.querySelectorAll(':scope > span'))
    if (hideCoins || hideCheckin) {
      actionsContainer.style.justifyContent = 'space-between'
      for (const span of spans) {
        span.style.display = 'none'
      }
    } else {
      actionsContainer.style.removeProperty('justify-content')
      for (const span of spans) {
        span.style.removeProperty('display')
      }
    }
    if (coinsLink) {
      if (hideCoins) {
        coinsLink.style.display = 'none'
      } else {
        coinsLink.style.removeProperty('display')
      }
    }
    if (checkinBtn) {
      if (hideCheckin) {
        checkinBtn.style.display = 'none'
      } else {
        checkinBtn.style.removeProperty('display')
      }
    }
  }
  function applySidebarHidden(getSettings2) {
    const settings = getSettings2()
    const cardBody = document.querySelector(
      '[data-right-sidebar="true"] .card-body'
    )
    if (!cardBody) return
    applyHideEmail(cardBody, settings)
    const h2 = cardBody.querySelector(':scope > h2')
    if (h2) {
      const experienceEl = applyHideExperience(h2, settings)
      if (experienceEl) {
        applyHideActions(experienceEl, settings)
      }
    }
  }
  function runSidebarHidden(getSettings2) {
    applySidebarHidden(getSettings2)
  }
  function initSidebarHidden(getSettings2) {
    if (initialized5) return
    initialized5 = true
    const run = () => {
      applySidebarHidden(getSettings2)
    }
    onDomChange(run)
    onUrlChange(run)
    run()
  }
  var initialized6 = false
  function applyStickyHeader(getSettings2) {
    var _a, _b
    const settings = getSettings2()
    const target =
      (_b =
        (_a = document.querySelector('.node-parent-tabs')) == null
          ? void 0
          : _a.parentElement) == null
        ? void 0
        : _b.parentElement
    if (!target) return
    if (settings.enabled && settings.stickyHeader) {
      target.style.position = 'sticky'
      target.style.top = '0'
      target.style.zIndex = '1'
    } else {
      target.style.removeProperty('position')
      target.style.removeProperty('top')
      target.style.removeProperty('z-index')
    }
  }
  function runStickyHeader(getSettings2) {
    applyStickyHeader(getSettings2)
  }
  function initStickyHeader(getSettings2) {
    if (initialized6) return
    initialized6 = true
    const run = () => {
      applyStickyHeader(getSettings2)
    }
    onDomChange(run)
    onUrlChange(run)
    run()
  }
  var DEFAULT_SETTINGS = {
    enabled: true,
    autoMarkNotificationsRead: true,
    checkUnreadNotifications: true,
    checkUnreadNotificationsTitle: true,
    checkUnreadNotificationsFavicon: true,
    checkUnreadNotificationsUtags: true,
    replyTimeColor: true,
    postListSort: true,
    rememberSortMode: false,
    stickyHeader: false,
    hideSidebarEmail: false,
    hideSidebarExperience: false,
    hideSidebarCoins: false,
    hideSidebarCheckin: false,
  }
  var store = createSettingsStore('settings', DEFAULT_SETTINGS)
  var enabled = DEFAULT_SETTINGS.enabled
  var autoMarkNotificationsRead = DEFAULT_SETTINGS.autoMarkNotificationsRead
  var checkUnreadNotifications = DEFAULT_SETTINGS.checkUnreadNotifications
  var checkUnreadNotificationsTitle =
    DEFAULT_SETTINGS.checkUnreadNotificationsTitle
  var checkUnreadNotificationsFavicon =
    DEFAULT_SETTINGS.checkUnreadNotificationsFavicon
  var checkUnreadNotificationsUtags =
    DEFAULT_SETTINGS.checkUnreadNotificationsUtags
  var replyTimeColor = DEFAULT_SETTINGS.replyTimeColor
  var postListSort = DEFAULT_SETTINGS.postListSort
  var rememberSortMode = DEFAULT_SETTINGS.rememberSortMode
  var stickyHeader = DEFAULT_SETTINGS.stickyHeader
  var hideSidebarEmail = DEFAULT_SETTINGS.hideSidebarEmail
  var hideSidebarExperience = DEFAULT_SETTINGS.hideSidebarExperience
  var hideSidebarCoins = DEFAULT_SETTINGS.hideSidebarCoins
  var hideSidebarCheckin = DEFAULT_SETTINGS.hideSidebarCheckin
  function buildSettingsSchema() {
    const generalFields = [
      { type: 'toggle', key: 'enabled', label: '\u542F\u7528' },
      {
        type: 'toggle',
        key: 'replyTimeColor',
        label: '\u56DE\u590D\u65F6\u95F4\u989C\u8272\u6E10\u53D8',
      },
      {
        type: 'toggle',
        key: 'postListSort',
        label: '\u5F53\u524D\u9875\u5E16\u5B50\u5217\u8868\u6392\u5E8F',
      },
      {
        type: 'toggle',
        key: 'rememberSortMode',
        label:
          '\u8BB0\u4F4F\u6392\u5E8F\u9009\u9879\uFF0C\u6BCF\u6B21\u81EA\u52A8\u6392\u5E8F',
      },
      {
        type: 'toggle',
        key: 'stickyHeader',
        label: '\u9876\u90E8\u5BFC\u822A\u680F\u56FA\u5B9A\u663E\u793A',
      },
    ]
    const notificationFields = [
      {
        type: 'toggle',
        key: 'autoMarkNotificationsRead',
        label: '\u81EA\u52A8\u5C06\u901A\u77E5\u9875\u8BBE\u4E3A\u5DF2\u8BFB',
      },
      {
        type: 'toggle',
        key: 'checkUnreadNotifications',
        label: '\u5B9A\u65F6\u68C0\u67E5\u672A\u8BFB\u901A\u77E5',
      },
      {
        type: 'toggle',
        key: 'checkUnreadNotificationsTitle',
        label: '\u7F51\u9875\u6807\u9898\u663E\u793A\u901A\u77E5\u4E2A\u6570',
      },
      {
        type: 'toggle',
        key: 'checkUnreadNotificationsFavicon',
        label: 'Favicon Badge \u663E\u793A\u901A\u77E5\u4E2A\u6570',
      },
      {
        type: 'toggle',
        key: 'checkUnreadNotificationsUtags',
        label: 'UTags Shortcuts \u663E\u793A\u901A\u77E5\u4E2A\u6570',
      },
    ]
    const sidebarFields = [
      {
        type: 'toggle',
        key: 'hideSidebarEmail',
        label: '\u9690\u85CF\u90AE\u7BB1',
      },
      {
        type: 'toggle',
        key: 'hideSidebarExperience',
        label: '\u9690\u85CF\u7ECF\u9A8C\u503C',
      },
      {
        type: 'toggle',
        key: 'hideSidebarCoins',
        label: '\u9690\u85CF\u91D1\u5E01\u6570\u91CF',
      },
      {
        type: 'toggle',
        key: 'hideSidebarCheckin',
        label: '\u9690\u85CF\u7B7E\u5230',
      },
    ]
    return {
      type: 'simple',
      title: '2Libra Plus \u8BBE\u7F6E',
      groups: [
        {
          id: 'general',
          title: '\u901A\u7528\u8BBE\u7F6E',
          fields: generalFields,
        },
        {
          id: 'notifications',
          title: '\u901A\u77E5\u7BA1\u7406',
          fields: notificationFields,
        },
        {
          id: 'sidebar',
          title: '\u53F3\u4FA7\u680F\u4E2A\u4EBA\u5361\u7247\u8BBE\u7F6E',
          fields: sidebarFields,
        },
      ],
    }
  }
  function openSettings() {
    const schema = buildSettingsSchema()
    const s = store
    openSettingsPanel(schema, s, {
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
  function registerMenus() {
    try {
      registerMenu('\u8BBE\u7F6E', () => {
        try {
          openSettings()
        } catch (e) {}
      })
    } catch (e) {}
  }
  function listenSettings() {
    try {
      store.onChange(() => {
        void applySettingsFromStore()
      })
    } catch (e) {}
  }
  async function applySettingsFromStore() {
    try {
      const prevEnabled = enabled
      const obj = await store.getAll()
      enabled = Boolean(obj.enabled)
      autoMarkNotificationsRead =
        enabled && Boolean(obj.autoMarkNotificationsRead)
      checkUnreadNotifications =
        enabled && Boolean(obj.checkUnreadNotifications)
      checkUnreadNotificationsTitle =
        enabled && Boolean(obj.checkUnreadNotificationsTitle)
      checkUnreadNotificationsFavicon =
        enabled && Boolean(obj.checkUnreadNotificationsFavicon)
      checkUnreadNotificationsUtags =
        enabled && Boolean(obj.checkUnreadNotificationsUtags)
      replyTimeColor = enabled && Boolean(obj.replyTimeColor)
      postListSort = enabled && Boolean(obj.postListSort)
      rememberSortMode = enabled && Boolean(obj.rememberSortMode)
      stickyHeader = enabled && Boolean(obj.stickyHeader)
      hideSidebarEmail = enabled && Boolean(obj.hideSidebarEmail)
      hideSidebarExperience = enabled && Boolean(obj.hideSidebarExperience)
      hideSidebarCoins = enabled && Boolean(obj.hideSidebarCoins)
      hideSidebarCheckin = enabled && Boolean(obj.hideSidebarCheckin)
      if (enabled && !featuresInitialized) {
        initFeatures()
      } else if (featuresInitialized) {
        runAutoMarkNotificationsRead(getSettingsSnapshot)
        runCheckNotifications(getSettingsSnapshot)
        runReplyTimeColor(getSettingsSnapshot)
        runPostListSort(getSettingsSnapshot)
        runStickyHeader(getSettingsSnapshot)
        runSidebarHidden(getSettingsSnapshot)
      }
    } catch (e) {}
  }
  function getSettingsSnapshot() {
    return {
      enabled,
      autoMarkNotificationsRead,
      checkUnreadNotifications,
      checkUnreadNotificationsTitle,
      checkUnreadNotificationsFavicon,
      checkUnreadNotificationsUtags,
      replyTimeColor,
      postListSort,
      rememberSortMode,
      stickyHeader,
      hideSidebarEmail,
      hideSidebarExperience,
      hideSidebarCoins,
      hideSidebarCheckin,
    }
  }
  function getSettings() {
    return getSettingsSnapshot()
  }
  var featuresInitialized = false
  function initFeatures() {
    if (featuresInitialized) return
    featuresInitialized = true
    initAutoMarkNotificationsRead(getSettingsSnapshot)
    initCheckNotifications(getSettingsSnapshot)
    initReplyTimeColor(getSettingsSnapshot)
    initPostListSort(getSettingsSnapshot)
    initStickyHeader(getSettingsSnapshot)
    initSidebarHidden(getSettingsSnapshot)
  }
  function bootstrap() {
    const d = document.documentElement
    const ds = d.dataset
    if (ds.libraPlus === '1') return
    ds.libraPlus = '1'
    void addStyle(style_default)
    registerMenus()
    listenSettings()
    void applySettingsFromStore()
  }
  bootstrap()
})()
