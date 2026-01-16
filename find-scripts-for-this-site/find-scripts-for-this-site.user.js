// ==UserScript==
// @name                 Find Scripts For This Site
// @name:zh-CN           查找适用于当前网站的脚本
// @name:zh-TW           查找適用於當前網站的腳本
// @name:ja              このサイト用のスクリプトを探す
// @name:ko              이 사이트용 스크립트 찾기
// @name:es              Buscar scripts para este sitio
// @name:fr              Trouver des scripts pour ce site
// @name:de              Skripte für diese Website finden
// @name:ru              Найти скрипты для этого сайта
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.4.2
// @description          Find userscripts for the current website from popular script repositories
// @description:zh-CN    查找适用于当前网站的用户脚本，支持多个脚本仓库
// @description:zh-TW    查找適用於當前網站的用戶腳本，支持多個腳本倉庫
// @description:ja       人気のスクリプトリポジトリから現在のウェブサイト用のユーザースクリプトを見つける
// @description:ko       인기 스크립트 저장소에서 현재 웹사이트용 사용자 스크립트 찾기
// @description:es       Encuentra userscripts para el sitio web actual desde repositorios populares
// @description:fr       Trouvez des scripts utilisateur pour le site Web actuel à partir de référentiels de scripts populaires
// @description:de       Finden Sie Benutzerskripte für die aktuelle Website aus beliebten Skript-Repositories
// @description:ru       Найдите пользовательские скрипты для текущего веб-сайта из популярных репозиториев скриптов
// @author               Pipecraft
// @license              MIT
// @match                *://*/*
// @icon                 data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%3E%3Ctext%20x%3D%2232%22%20y%3D%2232%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Menlo%2C%20Monaco%2C%20Consolas%2C%20Courier%20New%2C%20monospace%22%20font-size%3D%2242%22%20font-weight%3D%22700%22%20fill%3D%22%231f2937%22%3E%7B%7D%3C/text%3E%3C/svg%3E
// @noframes
// @grant                GM_registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @grant                GM_openInTab
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
  function registerMenu(caption, onClick, options) {
    if (typeof GM_registerMenuCommand === 'function') {
      return GM_registerMenuCommand(caption, onClick, options)
    }
    return 0
  }
  function unregisterMenu(menuId) {
    if (typeof GM_unregisterMenuCommand === 'function') {
      GM_unregisterMenuCommand(menuId)
    }
  }
  function openInTab(url, options) {
    if (typeof GM_openInTab === 'function') {
      GM_openInTab(url, options)
      return
    }
    globalThis.open(url, '_blank')
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
  var style_default =
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
    const t2 = typeof dv
    if (t2 === 'number') {
      const n = Number(val)
      return Number.isFinite(n) ? n : dv
    }
    if (t2 === 'object') {
      return val && typeof val === 'object' ? val : dv
    }
    return typeof val === t2 ? val : dv
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
  function openSettingsPanel(schema, store, options) {
    if (!isTopFrame()) {
      return
    }
    const { host, root, existed } = ensureShadowRoot({
      hostId:
        (options == null ? void 0 : options.hostDatasetValue) || 'settings',
      hostDatasetKey:
        (options == null ? void 0 : options.hostDatasetKey) || 'userHost',
      style: style_default.concat(
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
              void store.set({ [f.key]: val }, !f.isSitePref)
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
      for (const t2 of tabs) {
        const b = c('button', {
          className: 'tab-btn',
          dataset: { tabId: t2.id },
          text: t2.title,
        })
        tabsWrap.append(b)
        const p = c('div', { className: 'grid' })
        panels[t2.id] = p
        if (t2.id !== active) p.style.display = 'none'
        if ('groups' in t2 && Array.isArray(t2.groups)) {
          renderGroupsPanel(p, t2.groups)
        } else if ('fields' in t2 && Array.isArray(t2.fields)) {
          p.className = 'grid group'
          for (const f of t2.fields) appendField(p, f)
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
        const t2 = e.target
        const b = t2.closest('.tab-btn')
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
        const g = await store.getAll(true)
        const s = await store.getAll(false)
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
    function wireStoreChange(store2, fillers2) {
      var _a
      try {
        ;(_a = store2.onChange) == null
          ? void 0
          : _a.call(store2, (e) => {
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
        await store.set(info.key, val, !info.isSitePref)
      } catch (e) {}
    }
    async function handleColorSwatch(cs) {
      const info = getFieldInfo(cs)
      if (!info) return
      const val = cs.dataset.value || ''
      try {
        await store.set(info.key, val, !info.isSitePref)
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
      const t2 = e.target
      if (t2 === topCloseBtn) {
        closeSettingsPanel()
        return
      }
      const rb = t2.closest('.seg-btn')
      if (rb && rb instanceof HTMLElement) {
        void handleSegButton(rb)
        return
      }
      const cs = t2.closest('.color-swatch')
      if (cs && cs instanceof HTMLElement) {
        void handleColorSwatch(cs)
        return
      }
      const ab = t2.closest('.action-btn')
      if (ab && ab instanceof HTMLElement) handleActionBtn(ab)
    }
    function handleInputChange(inp) {
      const info = getFieldInfo(inp)
      if (!info) return
      const isCheckbox = (inp.type || '').toLowerCase() === 'checkbox'
      const v = isCheckbox ? Boolean(inp.checked) : inp.value
      void store.set(info.key, v, !info.isSitePref)
    }
    function handleTextareaChange(ta) {
      const info = getFieldInfo(ta)
      if (!info) return
      void store.set(info.key, ta.value, !info.isSitePref)
    }
    function handleSelectChange(sel) {
      const info = getFieldInfo(sel)
      if (!info) return
      void store.set(info.key, sel.value, !info.isSitePref)
    }
    function onPanelChange(e) {
      const t2 = e.target
      const inp = t2.closest('input')
      if (inp && inp instanceof HTMLInputElement) {
        handleInputChange(inp)
        return
      }
      const ta = t2.closest('textarea')
      if (ta && ta instanceof HTMLTextAreaElement) {
        handleTextareaChange(ta)
        return
      }
      const sel = t2.closest('select')
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
        const t2 = e.target
        if (t2 === topCloseBtn) {
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
    wireStoreChange(store, fillers)
    void refreshAll()
    globalThis.addEventListener('keydown', onKeyDown, true)
  }
  function createSettingsStore(
    storageKey,
    defaults,
    isSupportSitePref = false
  ) {
    const rootKey = storageKey || 'settings'
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
  function extractDomain(url) {
    try {
      let hostname
      if (url) {
        try {
          hostname = new URL(url).hostname
        } catch (e) {
          hostname = url
        }
      } else {
        hostname = win.location.hostname
      }
      let domain = hostname.replace(/^www\./, '')
      const parts = domain.split('.')
      if (parts.length > 2) {
        const secondLevelDomains = [
          'co',
          'com',
          'org',
          'net',
          'edu',
          'gov',
          'mil',
        ]
        const thirdLevelDomain = parts[parts.length - 2]
        domain =
          parts.length > 2 && secondLevelDomains.includes(thirdLevelDomain)
            ? parts.slice(-3).join('.')
            : parts.slice(-2).join('.')
      }
      return domain
    } catch (e) {
      return url || win.location.hostname || ''
    }
  }
  var CONFIG = {
    REPOSITORIES: [
      {
        id: 'greasy_fork',
        name: 'Greasy Fork',
        domainSearchUrl:
          'https://greasyfork.org/scripts/by-site/{domain}?filter_locale=0',
        domainSearchEnabled: true,
        keywordSearchUrl:
          'https://greasyfork.org/scripts?filter_locale=0&q={keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F374}',
      },
      {
        id: 'openuserjs',
        name: 'OpenUserJS',
        keywordSearchUrl: 'https://openuserjs.org/?q={keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F4DC}',
      },
      {
        id: 'scriptcat',
        name: 'ScriptCat',
        domainSearchUrl: 'https://scriptcat.org/search?domain={domain}',
        domainSearchEnabled: true,
        keywordSearchUrl: 'https://scriptcat.org/search?keyword={keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F431}',
      },
      {
        id: 'github',
        name: 'GitHub',
        keywordSearchUrl:
          'https://github.com/search?type=code&q=language%3AJavaScript+%22%3D%3DUserScript%3D%3D%22+{keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F419}',
      },
      {
        id: 'github_gist',
        name: 'GitHub Gist',
        keywordSearchUrl:
          'https://gist.github.com/search?l=JavaScript&q=%22%3D%3DUserScript%3D%3D%22+{keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F4DD}',
      },
      {
        id: 'sleazy_fork',
        name: 'Sleazy Fork',
        domainSearchUrl:
          'https://sleazyfork.org/scripts/by-site/{domain}?filter_locale=0',
        domainSearchEnabled: false,
        keywordSearchUrl:
          'https://sleazyfork.org/scripts?filter_locale=0&q={keyword}',
        keywordSearchEnabled: false,
        icon: '\u{1F51E}',
      },
    ],
    DEBUG: false,
  }
  var I18N = {
    en: {
      menu_domain: '{icon} Find scripts by domain on {name}',
      menu_keyword: '{icon} Find scripts by keyword on {name}',
      title_settings: 'Repository Settings',
      btn_save: 'Save',
      btn_cancel: 'Cancel',
      title_domain: 'Domain Search',
      title_keyword: 'Keyword Search',
      menu_settings: '\u2699\uFE0F Settings',
    },
    'zh-CN': {
      menu_domain:
        '{icon} \u5728 {name} \u4E0A\u6309\u57DF\u540D\u67E5\u627E\u811A\u672C',
      menu_keyword:
        '{icon} \u5728 {name} \u4E0A\u6309\u5173\u952E\u5B57\u67E5\u627E\u811A\u672C',
      title_settings: '\u4ED3\u5E93\u8BBE\u7F6E',
      btn_save: '\u4FDD\u5B58',
      btn_cancel: '\u53D6\u6D88',
      title_domain: '\u57DF\u540D\u641C\u7D22',
      title_keyword: '\u5173\u952E\u5B57\u641C\u7D22',
      menu_settings: '\u2699\uFE0F \u8BBE\u7F6E',
    },
    'zh-TW': {
      menu_domain:
        '{icon} \u5728 {name} \u4E0A\u6309\u57DF\u540D\u67E5\u627E\u8173\u672C',
      menu_keyword:
        '{icon} \u5728 {name} \u4E0A\u6309\u95DC\u9375\u5B57\u67E5\u627E\u8173\u672C',
      title_settings: '\u5009\u5EAB\u8A2D\u7F6E',
      btn_save: '\u4FDD\u5B58',
      btn_cancel: '\u53D6\u6D88',
      title_domain: '\u57DF\u540D\u641C\u7D22',
      title_keyword: '\u95DC\u9375\u5B57\u641C\u7D22',
      menu_settings: '\u2699\uFE0F \u8A2D\u7F6E',
    },
    ja: {
      menu_domain:
        '{icon} {name} \u3067\u30C9\u30E1\u30A4\u30F3\u304B\u3089\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u63A2\u3059',
      menu_keyword:
        '{icon} {name} \u3067\u30AD\u30FC\u30EF\u30FC\u30C9\u304B\u3089\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u63A2\u3059',
      title_settings: '\u30EA\u30DD\u30B8\u30C8\u30EA\u8A2D\u5B9A',
      btn_save: '\u4FDD\u5B58',
      btn_cancel: '\u30AD\u30E3\u30F3\u30BB\u30EB',
      title_domain: '\u30C9\u30E1\u30A4\u30F3\u691C\u7D22',
      title_keyword: '\u30AD\u30FC\u30EF\u30FC\u30C9\u691C\u7D22',
      menu_settings: '\u2699\uFE0F \u8A2D\u5B9A',
    },
    ko: {
      menu_domain:
        '{icon} {name}\uC5D0\uC11C \uB3C4\uBA54\uC778\uC73C\uB85C \uC2A4\uD06C\uB9BD\uD2B8 \uCC3E\uAE30',
      menu_keyword:
        '{icon} {name}\uC5D0\uC11C \uD0A4\uC6CC\uB4DC\uB85C \uC2A4\uD06C\uB9BD\uD2B8 \uCC3E\uAE30',
      title_settings: '\uC800\uC7A5\uC18C \uC124\uC815',
      btn_save: '\uC800\uC7A5',
      btn_cancel: '\uCDE8\uC18C',
      title_domain: '\uB3C4\uBA54\uC778 \uAC80\uC0C9',
      title_keyword: '\uD0A4\uC6CC\uB4DC \uAC80\uC0C9',
      menu_settings: '\u2699\uFE0F \uC124\uC815',
    },
    es: {
      menu_domain: '{icon} Buscar scripts por dominio en {name}',
      menu_keyword: '{icon} Buscar scripts por palabra clave en {name}',
      title_settings: 'Configuraci\xF3n de repositorios',
      btn_save: 'Guardar',
      btn_cancel: 'Cancelar',
      title_domain: 'B\xFAsqueda por dominio',
      title_keyword: 'B\xFAsqueda por palabra clave',
      menu_settings: '\u2699\uFE0F Configuraci\xF3n',
    },
    fr: {
      menu_domain: '{icon} Trouver des scripts par domaine sur {name}',
      menu_keyword: '{icon} Trouver des scripts par mot-cl\xE9 sur {name}',
      title_settings: 'Param\xE8tres des d\xE9p\xF4ts',
      btn_save: 'Enregistrer',
      btn_cancel: 'Annuler',
      title_domain: 'Recherche par domaine',
      title_keyword: 'Recherche par mot-cl\xE9',
      menu_settings: '\u2699\uFE0F Param\xE8tres',
    },
    de: {
      menu_domain: '{icon} Skripte nach Domain auf {name} finden',
      menu_keyword: '{icon} Skripte nach Stichwort auf {name} finden',
      title_settings: 'Repository-Einstellungen',
      btn_save: 'Speichern',
      btn_cancel: 'Abbrechen',
      title_domain: 'Domain-Suche',
      title_keyword: 'Stichwortsuche',
      menu_settings: '\u2699\uFE0F Einstellungen',
    },
    ru: {
      menu_domain:
        '{icon} \u041D\u0430\u0439\u0442\u0438 \u0441\u043A\u0440\u0438\u043F\u0442\u044B \u043F\u043E \u0434\u043E\u043C\u0435\u043D\u0443 \u043D\u0430 {name}',
      menu_keyword:
        '{icon} \u041D\u0430\u0439\u0442\u0438 \u0441\u043A\u0440\u0438\u043F\u0442\u044B \u043F\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u043C\u0443 \u0441\u043B\u043E\u0432\u0443 \u043D\u0430 {name}',
      title_settings:
        '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0435\u0432',
      btn_save: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C',
      btn_cancel: '\u041E\u0442\u043C\u0435\u043D\u0430',
      title_domain:
        '\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0434\u043E\u043C\u0435\u043D\u0443',
      title_keyword:
        '\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u043C\u0443 \u0441\u043B\u043E\u0432\u0443',
      menu_settings:
        '\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
    },
  }
  var USER_LANG = detectLanguage()
  var LANG_MAP =
    USER_LANG === 'en'
      ? I18N.en
      : __spreadValues(__spreadValues({}, I18N.en), I18N[USER_LANG])
  function t(key) {
    return LANG_MAP[key]
  }
  function detectLanguage() {
    try {
      const browserLang = (
        navigator.language ||
        navigator.userLanguage ||
        'en'
      ).toLowerCase()
      const supportedLangs = Object.keys(I18N)
      if (supportedLangs.includes(browserLang)) {
        return browserLang
      }
      const langBase = browserLang.split('-')[0]
      const matchingLang = supportedLangs.find((lang) =>
        lang.startsWith(langBase + '-')
      )
      if (matchingLang) {
        return matchingLang
      }
      return 'en'
    } catch (error) {
      debugLog('Error detecting language:', error)
      return 'en'
    }
  }
  function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log('[Find Scripts] '.concat(message), data || '')
    }
  }
  function getLocalizedMenuText(repo, isKeywordSearch = false) {
    const key = isKeywordSearch ? 'menu_keyword' : 'menu_domain'
    const template = t(key)
    return template.replace('{icon}', repo.icon).replace('{name}', repo.name)
  }
  var MENU_IDS = []
  var SETTINGS_MENU_ID
  function clearMenus() {
    for (const id of MENU_IDS) {
      unregisterMenu(id)
    }
    MENU_IDS = []
    if (SETTINGS_MENU_ID) {
      unregisterMenu(SETTINGS_MENU_ID)
      SETTINGS_MENU_ID = void 0
    }
  }
  function registerAllMenus() {
    const domain = extractDomain()
    registerMenuCommands(domain)
    registerSettingsMenu()
  }
  function registerMenuCommands(domain) {
    for (const repo of CONFIG.REPOSITORIES) {
      const domainEnabled = Boolean(CURRENT_SETTINGS['domain_'.concat(repo.id)])
      if (repo.domainSearchUrl && domainEnabled) {
        const url = repo.domainSearchUrl.replace('{domain}', domain)
        const menuText = getLocalizedMenuText(repo)
        const id = registerMenu(menuText, () => {
          debugLog('Opening '.concat(repo.name, ' for domain:'), domain)
          openInTab(url, { active: true, insert: true })
        })
        MENU_IDS.push(id)
      }
      const keywordEnabled = Boolean(
        CURRENT_SETTINGS['keyword_'.concat(repo.id)]
      )
      if (repo.keywordSearchUrl && keywordEnabled) {
        const keywordUrl = repo.keywordSearchUrl.replace('{keyword}', domain)
        const keywordMenuText = getLocalizedMenuText(repo, true)
        const id = registerMenu(keywordMenuText, () => {
          debugLog('Opening '.concat(repo.name, ' for keyword search:'), domain)
          openInTab(keywordUrl, { active: true, insert: true })
        })
        MENU_IDS.push(id)
      }
    }
  }
  var CURRENT_SETTINGS = {}
  function buildDefaults() {
    var _a, _b
    const out = {}
    for (const repo of CONFIG.REPOSITORIES) {
      if (repo.domainSearchUrl)
        out['domain_'.concat(repo.id)] =
          (_a = repo.domainSearchEnabled) != null ? _a : false
      if (repo.keywordSearchUrl)
        out['keyword_'.concat(repo.id)] =
          (_b = repo.keywordSearchEnabled) != null ? _b : false
    }
    return out
  }
  var SETTINGS_STORE = createSettingsStore('', buildDefaults())
  async function loadSettings() {
    try {
      const all = await SETTINGS_STORE.getAll()
      CURRENT_SETTINGS = all
      debugLog('Settings loaded:', all)
    } catch (error) {
      debugLog('Error loading settings:', error)
    }
  }
  function listenSettings() {
    try {
      SETTINGS_STORE.onChange(() => {
        void (async () => {
          await loadSettings()
          clearMenus()
          registerAllMenus()
        })()
      })
    } catch (e) {}
  }
  function showSettingsDialog() {
    const groupDomain = []
    const groupKeyword = []
    for (const repo of CONFIG.REPOSITORIES) {
      if (repo.domainSearchUrl) {
        groupDomain.push({
          type: 'toggle',
          key: 'domain_'.concat(repo.id),
          label: ''.concat(repo.icon, ' ').concat(repo.name),
        })
      }
      if (repo.keywordSearchUrl) {
        groupKeyword.push({
          type: 'toggle',
          key: 'keyword_'.concat(repo.id),
          label: ''.concat(repo.icon, ' ').concat(repo.name),
        })
      }
    }
    const schema = {
      type: 'simple',
      title: t('title_settings'),
      groups: [
        { id: 'domain', title: t('title_domain'), fields: groupDomain },
        { id: 'keyword', title: t('title_keyword'), fields: groupKeyword },
      ],
    }
    const store = SETTINGS_STORE
    openSettingsPanel(schema, store, {
      hostDatasetKey: 'fsftsHost',
      hostDatasetValue: 'find-scripts-settings',
      theme: {
        activeBg: '#7c3aed',
        activeFg: '#ffffff',
        colorRing: '#7c3aed',
        toggleOnBg: '#7c3aed',
      },
    })
  }
  function registerSettingsMenu() {
    const menuText = t('menu_settings')
    SETTINGS_MENU_ID = registerMenu(menuText, showSettingsDialog)
  }
  async function initialize() {
    await loadSettings()
    registerAllMenus()
    listenSettings()
  }
  void initialize()
})()
