// ==UserScript==
// @name                 Read Helper - staging
// @name:zh-CN           阅读助手 - staging
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
// @description          Floating quick navigation with per-site groups, icons, and editable items.
// @description:zh-CN    悬浮快速导航，支持按站点分组、图标与可编辑导航项。
// @icon                 data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%2212%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%224%22/%3E%3Cpath%20d%3D%22M22%2032h20M22%2042h16M22%2022h12%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                *://*/*
// @noframes
// @run-at               document-body
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM_unregisterMenuCommand
// @grant                GM_registerMenuCommand
// @grant                GM_addValueChangeListener
// ==/UserScript==
//
;(() => {
  'use strict'
  var __defProp = Object.defineProperty
  var __getOwnPropNames = Object.getOwnPropertyNames
  var __esm = (fn, res) =>
    function __init() {
      return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res)
    }
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true })
  }
  var settings_default
  var init_settings = __esm({
    'schemeImport-ns:/Volumes/SSD_T5/tmp/Development/workspace_pipes/userscripts/src/packages/read-helper/settings.css'() {
      settings_default =
        '/*! tailwindcss v4.1.17 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-200:oklch(92.8% 0.006 264.531);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-900:oklch(21% 0.034 264.665);--color-white:#fff;--spacing:0.25rem;--radius-md:0.375rem;--radius-xl:0.75rem;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.invisible{visibility:hidden}.visible{visibility:visible}.fixed{position:fixed}.block{display:block}.grid{display:grid}.hidden{display:none}.resize{resize:both}.border{border-style:var(--tw-border-style);border-width:1px}.underline{text-decoration-line:underline}}:host{all:initial}.rh{position:fixed;right:calc(var(--spacing)*3);top:calc(var(--spacing)*3);z-index:2147483649}.rh .panel{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-xl);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px;max-height:90vh;overflow-y:auto;padding:calc(var(--spacing)*4);width:360px;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.rh .btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.rh .btn-ghost{border-radius:var(--radius-md);color:var(--color-gray-500);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.rh .grid{flex-direction:column}.rh .grid,.rh .row{display:flex;gap:calc(var(--spacing)*3)}.rh .row{align-items:center;justify-content:space-between}.rh label{color:var(--color-gray-600)}.rh .seg{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.rh .seg-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.rh .seg-btn.active{background-color:var(--color-gray-900);border-color:var(--color-gray-900);color:var(--color-white)}.rh .color-row{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.rh .color-swatch{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;height:calc(var(--spacing)*6);width:calc(var(--spacing)*6)}.rh .color-swatch.active{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-900);--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.rh .switch .switch-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3)}.rh .switch .switch-btn.on{background-color:var(--color-gray-900);border-color:var(--color-gray-900);color:var(--color-white)}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@layer properties{*,::backdrop,:after,:before{--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000}}'
    },
  })
  var settings_panel_exports = {}
  __export(settings_panel_exports, {
    openSettingsPanel: () => openSettingsPanel,
  })
  function openSettingsPanel() {
    const existing = document.querySelector(
      '[data-rh-host="read-helper-settings"]'
    )
    let host = existing
    let root
    if (host && host.shadowRoot) {
      root = host.shadowRoot
      for (const n of Array.from(root.childNodes)) n.remove()
    } else {
      host = document.createElement('div')
      host.dataset.rhHost = 'read-helper-settings'
      root = host.attachShadow({ mode: 'open' })
      document.documentElement.append(host)
    }
    const styleTag = document.createElement('style')
    styleTag.textContent = settings_default
    root.append(styleTag)
    const mask = document.createElement('div')
    mask.className = 'rh'
    const panel = document.createElement('div')
    panel.className = 'panel'
    const grid = document.createElement('div')
    grid.className = 'grid'
    const headerRow = document.createElement('div')
    headerRow.className = 'row'
    const title = document.createElement('label')
    title.textContent = '\u9605\u8BFB\u52A9\u624B\u8BBE\u7F6E'
    const closeBtn = document.createElement('button')
    closeBtn.className = 'btn-ghost'
    closeBtn.textContent = '\u5173\u95ED'
    headerRow.append(title)
    headerRow.append(closeBtn)
    const modeRow = document.createElement('div')
    modeRow.className = 'row'
    const modeLabel = document.createElement('label')
    modeLabel.textContent = '\u6A21\u5F0F'
    const modeSeg = document.createElement('div')
    modeSeg.className = 'seg'
    for (const m of ['sentence', 'clause', 'line', 'paragraph']) {
      const b = document.createElement('button')
      b.className = 'seg-btn'
      b.dataset.group = 'mode'
      b.dataset.value = m
      b.textContent =
        m === 'sentence'
          ? '\u6309\u53E5'
          : m === 'clause'
            ? '\u6309\u6BB5'
            : m === 'line'
              ? '\u6309\u884C'
              : '\u6574\u6BB5'
      modeSeg.append(b)
    }
    modeRow.append(modeLabel)
    modeRow.append(modeSeg)
    const styleRow = document.createElement('div')
    styleRow.className = 'row'
    const styleLabel = document.createElement('label')
    styleLabel.textContent = '\u6837\u5F0F'
    const styleSeg = document.createElement('div')
    styleSeg.className = 'seg'
    for (const s of ['box', 'underline']) {
      const b = document.createElement('button')
      b.className = 'seg-btn'
      b.dataset.group = 'style'
      b.dataset.value = s
      b.textContent = s === 'box' ? '\u865A\u7EBF\u6846' : '\u4E0B\u5212\u7EBF'
      styleSeg.append(b)
    }
    styleRow.append(styleLabel)
    styleRow.append(styleSeg)
    const colorRow = document.createElement('div')
    colorRow.className = 'row color-row'
    const colorLabel = document.createElement('label')
    colorLabel.textContent = '\u989C\u8272'
    const colorWrap = document.createElement('div')
    colorWrap.className = 'seg'
    for (const c of [
      '#ff4d4f',
      '#1A73E8',
      '#10B981',
      '#F59E0B',
      '#8B5CF6',
      '#111827',
    ]) {
      const sw = document.createElement('div')
      sw.className = 'color-swatch'
      sw.dataset.value = c
      sw.style.backgroundColor = c
      colorWrap.append(sw)
    }
    colorRow.append(colorLabel)
    colorRow.append(colorWrap)
    const enabledRow = document.createElement('div')
    enabledRow.className = 'row switch'
    const enabledLabel = document.createElement('label')
    enabledLabel.textContent = '\u542F\u7528'
    const enabledSeg = document.createElement('div')
    enabledSeg.className = 'seg'
    const enabledOn = document.createElement('button')
    enabledOn.className = 'switch-btn'
    enabledOn.dataset.group = 'enabled'
    enabledOn.dataset.value = 'on'
    enabledOn.textContent = '\u5F00'
    const enabledOff = document.createElement('button')
    enabledOff.className = 'switch-btn'
    enabledOff.dataset.group = 'enabled'
    enabledOff.dataset.value = 'off'
    enabledOff.textContent = '\u5173'
    enabledSeg.append(enabledOn)
    enabledSeg.append(enabledOff)
    enabledRow.append(enabledLabel)
    enabledRow.append(enabledSeg)
    const scrollRow = document.createElement('div')
    scrollRow.className = 'row switch'
    const scrollLabel = document.createElement('label')
    scrollLabel.textContent = '\u6EDA\u52A8\u65F6\u9690\u85CF'
    const scrollSeg = document.createElement('div')
    scrollSeg.className = 'seg'
    const scrollOn = document.createElement('button')
    scrollOn.className = 'switch-btn'
    scrollOn.dataset.group = 'scroll'
    scrollOn.dataset.value = 'on'
    scrollOn.textContent = '\u5F00'
    const scrollOff = document.createElement('button')
    scrollOff.className = 'switch-btn'
    scrollOff.dataset.group = 'scroll'
    scrollOff.dataset.value = 'off'
    scrollOff.textContent = '\u5173'
    scrollSeg.append(scrollOn)
    scrollSeg.append(scrollOff)
    scrollRow.append(scrollLabel)
    scrollRow.append(scrollSeg)
    const arrowsRow = document.createElement('div')
    arrowsRow.className = 'row switch'
    const arrowsLabel = document.createElement('label')
    arrowsLabel.textContent = '\u7528\u65B9\u5411\u952E\u79FB\u52A8'
    const arrowsSeg = document.createElement('div')
    arrowsSeg.className = 'seg'
    const arrowsOn = document.createElement('button')
    arrowsOn.className = 'switch-btn'
    arrowsOn.dataset.group = 'arrows'
    arrowsOn.dataset.value = 'on'
    arrowsOn.textContent = '\u5F00'
    const arrowsOff = document.createElement('button')
    arrowsOff.className = 'switch-btn'
    arrowsOff.dataset.group = 'arrows'
    arrowsOff.dataset.value = 'off'
    arrowsOff.textContent = '\u5173'
    arrowsSeg.append(arrowsOn)
    arrowsSeg.append(arrowsOff)
    arrowsRow.append(arrowsLabel)
    arrowsRow.append(arrowsSeg)
    grid.append(headerRow)
    grid.append(enabledRow)
    grid.append(modeRow)
    grid.append(styleRow)
    grid.append(colorRow)
    grid.append(arrowsRow)
    grid.append(scrollRow)
    const skipButtonsRow = document.createElement('div')
    skipButtonsRow.className = 'row switch'
    const skipButtonsLabel = document.createElement('label')
    skipButtonsLabel.textContent = '\u8DF3\u8FC7\u6309\u94AE'
    const skipButtonsSeg = document.createElement('div')
    skipButtonsSeg.className = 'seg'
    const skipButtonsOn = document.createElement('button')
    skipButtonsOn.className = 'switch-btn'
    skipButtonsOn.dataset.group = 'skip_buttons'
    skipButtonsOn.dataset.value = 'on'
    skipButtonsOn.textContent = '\u5F00'
    const skipButtonsOff = document.createElement('button')
    skipButtonsOff.className = 'switch-btn'
    skipButtonsOff.dataset.group = 'skip_buttons'
    skipButtonsOff.dataset.value = 'off'
    skipButtonsOff.textContent = '\u5173'
    skipButtonsSeg.append(skipButtonsOn)
    skipButtonsSeg.append(skipButtonsOff)
    skipButtonsRow.append(skipButtonsLabel)
    skipButtonsRow.append(skipButtonsSeg)
    grid.append(skipButtonsRow)
    panel.append(grid)
    mask.append(panel)
    root.append(mask)
    async function updateModeUI() {
      try {
        const mv = await GM.getValue(MODE_KEY, 'sentence')
        for (const b of Array.from(modeSeg.querySelectorAll('.seg-btn'))) {
          const val = b.dataset.value || ''
          if (val === String(mv)) b.classList.add('active')
          else b.classList.remove('active')
        }
      } catch (e) {}
    }
    async function updateStyleUI() {
      try {
        const sv = await GM.getValue(STYLE_KEY, 'underline')
        for (const b of Array.from(styleSeg.querySelectorAll('.seg-btn'))) {
          const val = b.dataset.value || ''
          if (val === String(sv)) b.classList.add('active')
          else b.classList.remove('active')
        }
      } catch (e) {}
    }
    async function updateColorUI() {
      try {
        const cv = await GM.getValue(COLOR_KEY, '#ff4d4f')
        let picked = false
        for (const sw of Array.from(
          colorWrap.querySelectorAll('.color-swatch')
        )) {
          const val = sw.dataset.value || ''
          if (val === String(cv)) {
            sw.classList.add('active')
            picked = true
          } else sw.classList.remove('active')
        }
        if (!picked && typeof cv === 'string') {
          const extra = document.createElement('div')
          extra.className = 'color-swatch active'
          extra.dataset.value = String(cv)
          extra.style.backgroundColor = String(cv)
          colorWrap.append(extra)
        }
      } catch (e) {}
    }
    async function updateEnabledUI() {
      try {
        const ev = await GM.getValue(ENABLED_KEY, '1')
        const flag = typeof ev === 'string' ? ev === '1' : Boolean(ev)
        for (const b of Array.from(
          enabledSeg.querySelectorAll('.switch-btn')
        )) {
          const val = b.dataset.value || ''
          const on = val === 'on'
          if ((on && flag) || (!on && !flag)) b.classList.add('on')
          else b.classList.remove('on')
        }
      } catch (e) {}
    }
    async function updateScrollUI() {
      try {
        const sh = await GM.getValue(SCROLL_HIDE_KEY, false)
        const flag = Boolean(sh)
        for (const b of Array.from(scrollSeg.querySelectorAll('.switch-btn'))) {
          const val = b.dataset.value || ''
          const on = val === 'on'
          if ((on && flag) || (!on && !flag)) b.classList.add('on')
          else b.classList.remove('on')
        }
      } catch (e) {}
    }
    async function updateArrowsUI() {
      try {
        const mv = await GM.getValue('read_helper_move_by_arrows', false)
        const flag = Boolean(mv)
        for (const b of Array.from(arrowsSeg.querySelectorAll('.switch-btn'))) {
          const val = b.dataset.value || ''
          const on = val === 'on'
          if ((on && flag) || (!on && !flag)) b.classList.add('on')
          else b.classList.remove('on')
        }
      } catch (e) {}
    }
    async function updateSkipButtonsUI() {
      try {
        const mv = await GM.getValue(SKIP_BUTTONS_KEY, '1')
        const flag = typeof mv === 'string' ? mv === '1' : Boolean(mv)
        for (const b of Array.from(
          skipButtonsSeg.querySelectorAll('.switch-btn')
        )) {
          const val = b.dataset.value || ''
          const on = val === 'on'
          if ((on && flag) || (!on && !flag)) b.classList.add('on')
          else b.classList.remove('on')
        }
      } catch (e) {}
    }
    void (async () => {
      await updateModeUI()
      await updateStyleUI()
      await updateColorUI()
      await updateEnabledUI()
      await updateScrollUI()
      await updateArrowsUI()
      await updateSkipButtonsUI()
    })()
    function handleSeg(el) {
      const g = el.dataset.group || ''
      const v = el.dataset.value || ''
      if (g === 'mode') {
        GM.setValue(MODE_KEY, v)
        for (const b of Array.from(modeSeg.querySelectorAll('.seg-btn'))) {
          const h = b
          if ((h.dataset.value || '') === v) h.classList.add('active')
          else h.classList.remove('active')
        }
        return true
      }
      if (g === 'style') {
        GM.setValue(STYLE_KEY, v)
        for (const b of Array.from(styleSeg.querySelectorAll('.seg-btn'))) {
          const h = b
          if ((h.dataset.value || '') === v) h.classList.add('active')
          else h.classList.remove('active')
        }
        return true
      }
      return false
    }
    function handleColor(el) {
      const v = el.dataset.value || ''
      if (!v) return false
      GM.setValue(COLOR_KEY, v)
      for (const n of Array.from(colorWrap.querySelectorAll('.color-swatch'))) {
        const h = n
        if ((h.dataset.value || '') === v) h.classList.add('active')
        else h.classList.remove('active')
      }
      return true
    }
    function handleSwitch(el) {
      const g = el.dataset.group || ''
      const v = el.dataset.value || ''
      if (!g) return false
      if (g === 'enabled') {
        const flag = v === 'on'
        GM.setValue(ENABLED_KEY, flag)
        for (const b of Array.from(
          enabledSeg.querySelectorAll('.switch-btn')
        )) {
          const h = b
          const on = (h.dataset.value || '') === 'on'
          if ((on && flag) || (!on && !flag)) h.classList.add('on')
          else h.classList.remove('on')
        }
        return true
      }
      if (g === 'scroll') {
        const flag = v === 'on'
        GM.setValue(SCROLL_HIDE_KEY, flag)
        for (const b of Array.from(scrollSeg.querySelectorAll('.switch-btn'))) {
          const h = b
          const on = (h.dataset.value || '') === 'on'
          if ((on && flag) || (!on && !flag)) h.classList.add('on')
          else h.classList.remove('on')
        }
        return true
      }
      if (g === 'arrows') {
        const flag = v === 'on'
        GM.setValue('read_helper_move_by_arrows', flag)
        for (const b of Array.from(arrowsSeg.querySelectorAll('.switch-btn'))) {
          const h = b
          const on = (h.dataset.value || '') === 'on'
          if ((on && flag) || (!on && !flag)) h.classList.add('on')
          else h.classList.remove('on')
        }
        return true
      }
      if (g === 'skip_buttons') {
        const flag = v === 'on'
        GM.setValue(SKIP_BUTTONS_KEY, flag ? '1' : '0')
        for (const b of Array.from(
          skipButtonsSeg.querySelectorAll('.switch-btn')
        )) {
          const h = b
          const on = (h.dataset.value || '') === 'on'
          if ((on && flag) || (!on && !flag)) h.classList.add('on')
          else h.classList.remove('on')
        }
        return true
      }
      return false
    }
    function onPanelClick(e) {
      const t = e.target
      if (t === closeBtn) {
        host == null ? void 0 : host.remove()
        globalThis.removeEventListener('keydown', onKeyDown2, true)
        return
      }
      const segEl = t.closest('.seg-btn')
      if (segEl && segEl instanceof HTMLElement && handleSeg(segEl)) return
      const swEl = t.closest('.color-swatch')
      if (swEl && swEl instanceof HTMLElement && handleColor(swEl)) return
      const switchEl = t.closest('.switch-btn')
      if (switchEl && switchEl instanceof HTMLElement)
        void handleSwitch(switchEl)
    }
    panel.addEventListener('click', onPanelClick)
    function onKeyDown2(e) {
      if (e.key === 'Escape') {
        host == null ? void 0 : host.remove()
        globalThis.removeEventListener('keydown', onKeyDown2, true)
      }
    }
    globalThis.addEventListener('keydown', onKeyDown2, true)
  }
  var MODE_KEY,
    STYLE_KEY,
    COLOR_KEY,
    ENABLED_KEY,
    SCROLL_HIDE_KEY,
    SKIP_BUTTONS_KEY
  var init_settings_panel = __esm({
    'src/packages/read-helper/settings-panel.ts'() {
      init_settings()
      MODE_KEY = 'read_helper_mode'
      STYLE_KEY = 'read_helper_style'
      COLOR_KEY = 'read_helper_color'
      ENABLED_KEY = 'read_helper_enabled'
      SCROLL_HIDE_KEY = 'read_helper_scroll_hide'
      SKIP_BUTTONS_KEY = 'read_helper_skip_buttons'
    },
  })
  var defaultFavicon16 = encodeURIComponent(
    'https://wsrv.nl/?w=16&h=16&url=th.bing.com/th?id=ODLS.A2450BEC-5595-40BA-9F13-D9EC6AB74B9F'
  )
  var defaultFavicon32 = encodeURIComponent(
    'https://wsrv.nl/?w=32&h=32&url=th.bing.com/th?id=ODLS.A2450BEC-5595-40BA-9F13-D9EC6AB74B9F'
  )
  var defaultFavicon64 = encodeURIComponent(
    'https://wsrv.nl/?w=64&h=64&url=th.bing.com/th?id=ODLS.A2450BEC-5595-40BA-9F13-D9EC6AB74B9F'
  )
  function isElementVisible(el) {
    if (!el) return true
    try {
      const anyEl = el
      if (
        typeof anyEl.checkVisibility === 'function' &&
        anyEl.checkVisibility() === false
      )
        return false
    } catch (e) {}
    let cur = el
    while (cur) {
      const he = cur
      if (typeof he.hidden === 'boolean' && he.hidden) return false
      const cs = globalThis.getComputedStyle(cur)
      if (cs.display === 'none') return false
      if (cs.visibility === 'hidden') return false
      if (he !== document.body && he.parentElement && he.offsetParent === null)
        return false
      cur = cur.parentElement || void 0
    }
    return true
  }
  function isInteractive(el) {
    if (!el) return false
    const tag = el.tagName.toLowerCase()
    if (['input', 'textarea', 'select', 'button'].includes(tag)) return true
    if (el.hasAttribute('contenteditable')) return true
    return false
  }
  function isBlockElement(el) {
    const cs = globalThis.getComputedStyle(el)
    const d = cs.display
    const tag = el.tagName.toLowerCase()
    if (
      d === 'block' ||
      d === 'list-item' ||
      d === 'table' ||
      d === 'table-cell' ||
      d === 'flex' ||
      d === 'grid' ||
      d === 'flow-root'
    )
      return true
    if (
      tag === 'td' ||
      tag === 'th' ||
      tag === 'li' ||
      tag === 'section' ||
      tag === 'article'
    )
      return true
    return false
  }
  function closestBlockElement(node) {
    let el =
      node.nodeType === Node.ELEMENT_NODE
        ? node
        : node.parentElement || document.body
    while (el && el !== document.body) {
      if (isBlockElement(el)) return el
      el = el.parentElement || document.body
    }
    return document.body
  }
  function hasNestedBlock(root, t) {
    let el = t.parentElement || void 0
    while (el && el !== root) {
      if (isBlockElement(el)) return true
      el = el.parentElement || void 0
    }
    return false
  }
  function caretRangeFromPoint(x, y) {
    const anyDoc = document
    if (typeof anyDoc.caretRangeFromPoint === 'function') {
      const r2 = anyDoc.caretRangeFromPoint(x, y)
      if (r2) return r2
    }
    if (typeof anyDoc.caretPositionFromPoint === 'function') {
      const pos = anyDoc.caretPositionFromPoint(x, y)
      if (pos && pos.offsetNode !== void 0 && pos.offsetNode !== null) {
        const r2 = document.createRange()
        r2.setStart(pos.offsetNode, pos.offset)
        r2.collapse(true)
        return r2
      }
    }
    const sel = globalThis.getSelection()
    if (!sel) return void 0
    const r = sel.rangeCount
      ? sel.getRangeAt(0).cloneRange()
      : document.createRange()
    return r
  }
  function buildTextIndex(root) {
    const nodes = []
    const texts = []
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    while (tw.nextNode()) {
      const t = tw.currentNode
      if (hasNestedBlock(root, t)) continue
      if (!isElementVisible(t.parentElement || void 0)) continue
      nodes.push(t)
      texts.push(t.data)
    }
    const starts = []
    const ends = []
    let acc = 0
    for (let i = 0; i < nodes.length; i++) {
      starts.push(acc)
      acc += texts[i].length
      ends.push(acc)
      if (i < nodes.length - 1) acc += 1
    }
    return { nodes, starts, ends, text: texts.join(' ') }
  }
  var textIndexCache = /* @__PURE__ */ new WeakMap()
  function getTextIndex(root) {
    const tl = (root.textContent || '').length
    const cached = textIndexCache.get(root)
    if (cached && cached.textLength === tl) return cached.index
    const idx = buildTextIndex(root)
    textIndexCache.set(root, { index: idx, textLength: tl })
    return idx
  }
  function mapIndexToPosition(idx, index) {
    for (const [i, node] of index.nodes.entries()) {
      if (idx >= index.starts[i] && idx <= index.ends[i]) {
        return { node, offset: idx - index.starts[i] }
      }
    }
    return void 0
  }
  function adjustIndexToNode(idx, index, dir) {
    const starts = index.starts
    const ends = index.ends
    let lo = 0
    let hi = starts.length - 1
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (idx < starts[mid]) hi = mid - 1
      else if (idx > ends[mid]) lo = mid + 1
      else return idx
    }
    if (dir === 'forward') {
      const j2 = Math.min(starts.length - 1, Math.max(0, lo))
      return starts[j2]
    }
    const j = Math.max(0, Math.min(ends.length - 1, hi))
    return ends[j]
  }
  function mapPositionToIndex(node, offset, index) {
    const i = index.nodes.indexOf(node)
    if (i !== -1) return index.starts[i] + offset
    return void 0
  }
  function isSentenceTerminator(ch) {
    return /[。．｡.!?！？…]/.test(ch)
  }
  function isClauseTerminator(ch) {
    return /[，,、；;：:.。！？!?]/.test(ch)
  }
  function findPrevBoundary(text, pos, m) {
    for (let i = pos - 1; i >= 0; i--) {
      const ch = text[i]
      const hit =
        m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
      if (hit) {
        if (
          ch === '.' &&
          /[A-Za-z\d]/.test(text[i + 1] || '') &&
          /[A-Za-z\d]/.test(text[i - 1] || '')
        )
          continue
        return i
      }
    }
    return -1
  }
  function findNextBoundary(text, pos, m) {
    for (let i = pos; i < text.length; i++) {
      const ch = text[i]
      const hit =
        m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
      if (hit) {
        if (
          ch === '.' &&
          /[A-Za-z\d]/.test(text[i + 1] || '') &&
          /[A-Za-z\d]/.test(text[i - 1] || '')
        )
          continue
        return i
      }
    }
    return text.length
  }
  function rangeForParagraph(caret) {
    const block = closestBlockElement(caret.startContainer)
    const r = document.createRange()
    r.selectNodeContents(block)
    return r
  }
  function rangeForLine(caret) {
    const block = closestBlockElement(caret.startContainer)
    const caretRect = caret.getBoundingClientRect()
    const r = document.createRange()
    r.selectNodeContents(block)
    const rects = Array.from(r.getClientRects())
    let pick
    for (const rect of rects) {
      if (caretRect.top >= rect.top && caretRect.top <= rect.bottom) {
        pick = rect
        break
      }
    }
    if (!pick) return void 0
    if (pick.width <= 2) return void 0
    const out = document.createRange()
    out.setStart(block, 0)
    out.setEnd(block, block.childNodes.length)
    out.__singleLineRect = pick
    return out
  }
  function rangeForText(caret, m) {
    const block = closestBlockElement(caret.startContainer)
    const idx = getTextIndex(block)
    if (idx.nodes.length === 0) return void 0
    const startNode = caret.startContainer
    const startOffset = caret.startOffset
    const caretGlobal = mapPositionToIndex(startNode, startOffset, idx)
    if (caretGlobal === void 0) return void 0
    const text = idx.text
    let s = caretGlobal
    let e = caretGlobal
    for (let i = caretGlobal - 1; i >= 0; i--) {
      const ch = text[i]
      const hit =
        m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
      if (hit) {
        if (
          ch === '.' &&
          /[A-Za-z\d]/.test(text[i + 1] || '') &&
          /[A-Za-z\d]/.test(text[i - 1] || '')
        )
          continue
        s = i + 1
        break
      }
      s = i
    }
    while (s < text.length && /[，,、；;：:.。！？!?…\s\u00A0]/.test(text[s]))
      s++
    for (let i = caretGlobal; i < text.length; i++) {
      const ch = text[i]
      const hit =
        m === 'sentence' ? isSentenceTerminator(ch) : isClauseTerminator(ch)
      if (hit) {
        if (
          ch === '.' &&
          /[A-Za-z\d]/.test(text[i + 1] || '') &&
          /[A-Za-z\d]/.test(text[i - 1] || '')
        )
          continue
        e = i
        break
      }
      e = i + 1
    }
    const sAdj = adjustIndexToNode(s, idx, 'forward')
    const eAdj = adjustIndexToNode(e, idx, 'backward')
    const startPos = mapIndexToPosition(sAdj, idx)
    const endPos = mapIndexToPosition(eAdj, idx)
    if (!startPos || !endPos) return void 0
    const r = document.createRange()
    r.setStart(startPos.node, startPos.offset)
    r.setEnd(endPos.node, endPos.offset)
    return r
  }
  function isPunctuationRect(rect) {
    if (rect.width > 8) return false
    const x =
      rect.left + Math.max(1, Math.min(rect.width - 1, rect.width * 0.5))
    const y = rect.top + rect.height / 2
    const cr = caretRangeFromPoint(x, y)
    if (!cr) return false
    const n = cr.startContainer
    const o = cr.startOffset
    if (n.nodeType === Node.TEXT_NODE) {
      const t = n
      const s = t.data
      const i = Math.max(0, Math.min(o - 1, s.length - 1))
      const ch = s[i] || ''
      return /[，,、；;：:.。！？!?\s\u00A0]/.test(ch)
    }
    return false
  }
  var MODE_KEY2 = 'read_helper_mode'
  var STYLE_KEY2 = 'read_helper_style'
  var COLOR_KEY2 = 'read_helper_color'
  var ENABLED_KEY2 = 'read_helper_enabled'
  var SCROLL_HIDE_KEY2 = 'read_helper_scroll_hide'
  var MOVE_BY_ARROWS_KEY = 'read_helper_move_by_arrows'
  var SKIP_BUTTONS_KEY2 = 'read_helper_skip_buttons'
  var mode = 'sentence'
  var style = 'underline'
  var color = '#ff4d4f'
  var enabled = true
  var hideOnScroll = false
  var moveByArrows = false
  var skipButtons = true
  var overlay
  var clickHandlerInstalled = false
  var selectionHandlerInstalled = false
  var dblClickHandlerInstalled = false
  var keyHandlerInstalled = false
  var menuIds = []
  var selectStartInstalled = false
  var mouseUpInstalled = false
  var scrollHandlerInstalled = false
  var resizeHandlerInstalled = false
  var lastRange
  var redrawDebounceTimer
  var redrawDebounceMs = 200
  var MERGE_EPS = 2
  var MERGE_MIN_OVERLAP_RATIO = 0.5
  var scrollingActive = false
  function ensureOverlay() {
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'read-helper-overlay'
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '0'
      overlay.style.height = '0'
      overlay.style.pointerEvents = 'none'
      overlay.style.zIndex = '2147483647'
      document.documentElement.append(overlay)
    }
    return overlay
  }
  function clearOverlay() {
    if (!overlay) return
    overlay.replaceChildren()
    lastRange = void 0
    if (redrawDebounceTimer !== void 0) {
      globalThis.clearTimeout(redrawDebounceTimer)
      redrawDebounceTimer = void 0
    }
  }
  function caretAtBlockEdge(block, edge) {
    if (!isElementVisible(block)) return void 0
    const idx = getTextIndex(block)
    if (idx.nodes.length === 0) return void 0
    const r = document.createRange()
    if (edge === 'start') {
      r.setStart(idx.nodes[0], 0)
    } else {
      const nodes = idx.nodes
      const lastIndex = nodes.length - 1
      const last = nodes[lastIndex]
      r.setStart(last, last.data.length)
    }
    r.collapse(true)
    return r
  }
  function findAdjacentBlock(cur, dir) {
    const it = document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_ELEMENT
    )
    const blocks = []
    while (true) {
      const n = it.nextNode()
      if (!n) break
      const el = n
      if (isBlockElement(el)) {
        if (!isElementVisible(el)) continue
        const idx = getTextIndex(el)
        if (idx.nodes.length > 0) blocks.push(el)
      }
    }
    let i = blocks.indexOf(cur)
    if (i === -1) {
      for (const [j, b] of blocks.entries()) {
        if (b.contains(cur)) {
          i = j
          break
        }
      }
      if (i === -1) return void 0
    }
    if (dir === 'prev') return i > 0 ? blocks[i - 1] : void 0
    return i < blocks.length - 1 ? blocks[i + 1] : void 0
  }
  function findTextRangeFromAdjacentBlock(from, dir, m) {
    let cur = from
    let loops = 0
    while (loops < 64) {
      const adj = findAdjacentBlock(cur, dir)
      if (!adj) return void 0
      const caret = caretAtBlockEdge(adj, dir === 'prev' ? 'end' : 'start')
      if (!caret) return void 0
      const r =
        m === 'line'
          ? rangeForLine(caret)
          : rangeForText(caret, m === 'sentence' ? 'sentence' : 'clause')
      if (r && hasVisibleRects(r)) return r
      cur = adj
      loops++
    }
    return void 0
  }
  function rangeForNeighbor(ref, dir, m) {
    const block = closestBlockElement(ref.startContainer)
    if (!isElementVisible(block)) return void 0
    const idx = getTextIndex(block)
    if (idx.nodes.length === 0) return void 0
    const sIdx = mapPositionToIndex(ref.startContainer, ref.startOffset, idx)
    const eIdx = mapPositionToIndex(ref.endContainer, ref.endOffset, idx)
    if (sIdx === void 0 || eIdx === void 0) return void 0
    const text = idx.text
    let left = sIdx
    let right = eIdx
    const mm = m === 'sentence' ? 'sentence' : 'clause'
    if (dir === 'prev') {
      const lb = findPrevBoundary(text, left, mm)
      const plb = findPrevBoundary(text, Math.max(0, lb), mm)
      if (lb === -1) {
        const cross = findTextRangeFromAdjacentBlock(block, 'prev', m)
        if (cross) return cross
        left = plb === -1 ? 0 : plb + 1
        right = lb === -1 ? right : lb
      } else {
        left = plb === -1 ? 0 : plb + 1
        right = lb
      }
    } else {
      const rb = findNextBoundary(text, right, mm)
      const nrb = findNextBoundary(text, Math.min(text.length, rb + 1), mm)
      if (rb === text.length) {
        const cross = findTextRangeFromAdjacentBlock(block, 'next', m)
        if (cross) return cross
        left = rb === text.length ? left : rb + 1
        right = nrb === text.length ? text.length : nrb
      } else {
        left = rb + 1
        right = nrb === text.length ? text.length : nrb
      }
    }
    const leftAdj = adjustIndexToNode(left, idx, 'forward')
    const rightAdj = adjustIndexToNode(right, idx, 'backward')
    const startPos = mapIndexToPosition(leftAdj, idx)
    const endPos = mapIndexToPosition(rightAdj, idx)
    if (!startPos || !endPos) return void 0
    const out = document.createRange()
    out.setStart(startPos.node, startPos.offset)
    out.setEnd(endPos.node, endPos.offset)
    return out
  }
  function findNeighborByGeometry(ref, dir, m) {
    const rects = visibleRects(ref)
    if (rects.length === 0) return void 0
    let pick = rects[0]
    if (dir !== 'prev') {
      for (let i = 1; i < rects.length; i++) pick = rects[i]
    }
    const base =
      dir === 'prev'
        ? pick.left + Math.min(14, Math.max(4, Math.floor(pick.width * 0.1)))
        : pick.right - Math.min(14, Math.max(4, Math.floor(pick.width * 0.1)))
    const offsets = [0, -8, 8]
    const step = Math.max(
      1,
      Math.min(36, Math.floor((pick.height || 16) * 0.45))
    )
    for (const dx of offsets) {
      const x = base + dx
      let y = dir === 'prev' ? pick.top - 1 : pick.bottom + 1
      for (let i = 0; i < 48; i++) {
        const cr = caretRangeFromPoint(x, y)
        if (cr) {
          const sc = cr.startContainer
          const owner =
            sc.nodeType === Node.ELEMENT_NODE ? sc : sc.parentElement
          if (owner && !isElementVisible(owner)) {
          } else {
            const r = findSegmentRange(cr, m)
            if (r && hasVisibleRects(r)) return r
          }
        }
        y = dir === 'prev' ? y - step : y + step
      }
    }
    const block = closestBlockElement(ref.startContainer)
    const cross = findTextRangeFromAdjacentBlock(block, dir, m)
    if (cross && hasVisibleRects(cross)) return cross
    return void 0
  }
  function findSegmentRange(caret, m) {
    const sc = caret.startContainer
    const owner = sc.nodeType === Node.ELEMENT_NODE ? sc : sc.parentElement
    if (owner && !isElementVisible(owner)) return void 0
    if (m === 'paragraph') return rangeForParagraph(caret)
    if (m === 'line') return rangeForLine(caret)
    return rangeForText(caret, m === 'sentence' ? 'sentence' : 'clause')
  }
  function hasVisibleRects(r) {
    const rects = []
    const anyR = r
    if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect)
    else {
      const list = r.getClientRects()
      for (const rect of Array.from(list)) rects.push(rect)
    }
    const block = closestBlockElement(r.startContainer)
    if (!isElementVisible(block)) return false
    const clip = block.getBoundingClientRect()
    let count = 0
    for (const r0 of rects) {
      const left = Math.max(r0.left, clip.left)
      const right = Math.min(r0.right, clip.right)
      const top = Math.max(r0.top, clip.top)
      const bottom = Math.min(r0.bottom, clip.bottom)
      const w = right - left
      const h = bottom - top
      if (w <= 2 || h <= 0) continue
      const test = new DOMRect(left, top, w, h)
      if (isPunctuationRect(test)) continue
      count++
      if (count > 0) break
    }
    return count > 0
  }
  function visibleRects(r) {
    const rects = []
    const anyR = r
    if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect)
    else {
      const list = r.getClientRects()
      for (const rect of Array.from(list)) rects.push(rect)
    }
    const block = closestBlockElement(r.startContainer)
    if (!isElementVisible(block)) return []
    const clip = block.getBoundingClientRect()
    const out = []
    for (const r0 of rects) {
      const left = Math.max(r0.left, clip.left)
      const right = Math.min(r0.right, clip.right)
      const top = Math.max(r0.top, clip.top)
      const bottom = Math.min(r0.bottom, clip.bottom)
      const w = right - left
      const h = bottom - top
      if (w <= 2 || h <= 0) continue
      const rr = new DOMRect(left, top, w, h)
      if (isPunctuationRect(rr)) continue
      out.push(rr)
    }
    return out
  }
  function isButtonLikeElement(el) {
    if (!el) return false
    const tag = (el.tagName || '').toLowerCase()
    if (tag === 'button') return true
    const tokens = Array.from(el.classList || [])
    for (const c of tokens) {
      if (
        c === 'btn' ||
        c.startsWith('btn') ||
        c === 'button' ||
        c.startsWith('button')
      )
        return true
    }
    return false
  }
  function isButtonLikeRange(r) {
    const sc = r.startContainer
    const owner = sc.nodeType === Node.ELEMENT_NODE ? sc : sc.parentElement
    return isButtonLikeElement(owner)
  }
  function rangeVerticalBounds(r) {
    const rects = visibleRects(r)
    let top = Infinity
    let bottom = -Infinity
    for (const rr of rects) {
      if (rr.width <= 2) continue
      if (isPunctuationRect(rr)) continue
      top = Math.min(top, rr.top)
      bottom = Math.max(bottom, rr.bottom)
    }
    if (!Number.isFinite(top) || !Number.isFinite(bottom)) return void 0
    return { top, bottom }
  }
  function isSameVisualLine(a, b) {
    const va = rangeVerticalBounds(a)
    const vb = rangeVerticalBounds(b)
    if (!va || !vb) return false
    const overlap = Math.min(va.bottom, vb.bottom) - Math.max(va.top, vb.top)
    const minH = Math.min(va.bottom - va.top, vb.bottom - vb.top)
    return overlap >= Math.max(0, minH * MERGE_MIN_OVERLAP_RATIO - MERGE_EPS)
  }
  function scrollRangeIntoView(r, dir) {
    const rects = []
    const anyR = r
    if (anyR.__singleLineRect) rects.push(anyR.__singleLineRect)
    else {
      const list = r.getClientRects()
      for (const rect of Array.from(list)) rects.push(rect)
    }
    let top = Infinity
    let bottom = -Infinity
    for (const rr of rects) {
      if (rr.width <= 2) continue
      if (isPunctuationRect(rr)) continue
      top = Math.min(top, rr.top)
      bottom = Math.max(bottom, rr.bottom)
    }
    if (!Number.isFinite(top) || !Number.isFinite(bottom)) return
    const vh = globalThis.innerHeight || 0
    const margin = 80
    const center = (top + bottom) / 2
    const desired = vh * 0.5
    const tolerance = Math.max(120, Math.floor(vh * 0.18))
    const fullyVisible = top >= 0 && bottom <= vh
    const nearCenter = Math.abs(center - desired) <= tolerance
    let targetY
    if (!fullyVisible) {
      if (top < 0) targetY = globalThis.scrollY + top - margin
      else if (bottom > vh)
        targetY = globalThis.scrollY + (bottom - vh) + margin
    } else if (!nearCenter) {
      const h = bottom - top
      targetY =
        h >= vh * 0.8
          ? globalThis.scrollY + top - margin
          : globalThis.scrollY + (center - desired)
    }
    if (targetY === void 0) return
    const se = document.scrollingElement
    const maxY = ((se == null ? void 0 : se.scrollHeight) || 0) - vh
    const curY = se
      ? Number(se.scrollTop || 0)
      : Number(globalThis.scrollY || 0)
    let y = Math.max(0, Math.min(maxY, targetY))
    if (dir === 'next' && y < curY) y = curY
    else if (dir === 'prev' && y > curY) y = curY
    if (se && typeof se.scrollTo === 'function') {
      se.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      globalThis.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
  function drawRange(r) {
    const host = ensureOverlay()
    host.replaceChildren()
    const rects = visibleRects(r)
    const BOX_PAD_X = 6
    const DESIRED_PAD_Y = 2
    const UNDERLINE_OFFSET = 4
    const block = closestBlockElement(r.startContainer)
    let lineH = rects.length > 0 ? rects[0].height : 0
    if (block) {
      const cs = globalThis.getComputedStyle(block)
      const lh = Number.parseFloat(cs.lineHeight || '0')
      if (!Number.isNaN(lh) && lh > 0) lineH = lh
    }
    if (style === 'box') {
      const filtered = rects
      const groups = []
      const eps = MERGE_EPS
      for (const r0 of filtered) {
        const t0 = r0.top
        const b0 = r0.bottom
        let placed = false
        for (const g of groups) {
          const overlap = Math.min(b0, g.bottom) - Math.max(t0, g.top)
          const minH = Math.min(r0.height, g.height)
          if (overlap >= Math.max(0, minH * MERGE_MIN_OVERLAP_RATIO - eps)) {
            g.top = Math.min(g.top, t0)
            g.bottom = Math.max(g.bottom, b0)
            g.left = Math.min(g.left, r0.left)
            g.right = Math.max(g.right, r0.right)
            g.height = Math.max(g.height, r0.height)
            placed = true
            break
          }
        }
        if (!placed) {
          groups.push({
            top: t0,
            bottom: b0,
            left: r0.left,
            right: r0.right,
            height: r0.height,
          })
        }
      }
      const frag = document.createDocumentFragment()
      for (const g of groups) {
        const h = Math.min(g.height, lineH)
        const padY = Math.max(0, Math.min(DESIRED_PAD_Y, (lineH - h) / 2))
        const d = document.createElement('div')
        d.style.position = 'fixed'
        d.style.left = ''.concat(g.left - BOX_PAD_X, 'px')
        d.style.top = ''.concat(g.top - padY, 'px')
        d.style.width = ''.concat(
          Math.max(0, g.right - g.left + BOX_PAD_X * 2),
          'px'
        )
        d.style.height = ''.concat(Math.max(0, h + padY * 2), 'px')
        d.style.border = '2px dashed '.concat(color)
        d.style.borderRadius = '4px'
        d.style.boxSizing = 'border-box'
        frag.append(d)
      }
      host.append(frag)
    } else {
      const filtered = rects
      const groups = []
      const eps = MERGE_EPS
      for (const r0 of filtered) {
        const t0 = r0.top
        const b0 = r0.bottom
        let placed = false
        for (const g of groups) {
          const overlap = Math.min(b0, g.bottom) - Math.max(t0, g.top)
          const minH = Math.min(r0.height, g.bottom - g.top)
          if (overlap >= Math.max(0, minH * MERGE_MIN_OVERLAP_RATIO - eps)) {
            g.top = Math.min(g.top, t0)
            g.bottom = Math.max(g.bottom, b0)
            g.left = Math.min(g.left, r0.left)
            g.right = Math.max(g.right, r0.right)
            placed = true
            break
          }
        }
        if (!placed)
          groups.push({ top: t0, bottom: b0, left: r0.left, right: r0.right })
      }
      const frag = document.createDocumentFragment()
      for (const g of groups) {
        const d = document.createElement('div')
        d.style.position = 'fixed'
        d.style.left = ''.concat(g.left, 'px')
        d.style.top = ''.concat(g.bottom + UNDERLINE_OFFSET, 'px')
        d.style.width = ''.concat(Math.max(0, g.right - g.left), 'px')
        d.style.height = '0px'
        d.style.borderBottom = '2px dashed '.concat(color)
        frag.append(d)
      }
      host.append(frag)
    }
  }
  function onClick(e) {
    if (!enabled) return
    const t = e.target
    if (isInteractive(t)) {
      clearOverlay()
      return
    }
    const cr = caretRangeFromPoint(e.clientX, e.clientY)
    if (!cr) return
    const r = findSegmentRange(cr, mode)
    if (!r) return
    drawRange(r)
    lastRange = r
  }
  function onSelectionChange() {
    const sel = globalThis.getSelection()
    if (!sel) return
    if (!sel.isCollapsed) {
      clearOverlay()
    }
  }
  function onSelectStart() {
    try {
      clearOverlay()
    } catch (e) {}
  }
  function onMouseUp() {
    try {
      const sel = globalThis.getSelection()
      if (sel && !sel.isCollapsed) clearOverlay()
    } catch (e) {}
  }
  function redraw() {
    if (!lastRange) return
    drawRange(lastRange)
  }
  function onScroll() {
    try {
      if (hideOnScroll) {
        clearOverlay()
      } else {
        if (!scrollingActive) {
          scrollingActive = true
          if (overlay) overlay.replaceChildren()
        }
        if (redrawDebounceTimer !== void 0) {
          globalThis.clearTimeout(redrawDebounceTimer)
          redrawDebounceTimer = void 0
        }
        redrawDebounceTimer = globalThis.setTimeout(() => {
          scrollingActive = false
          redrawDebounceTimer = void 0
          redraw()
        }, redrawDebounceMs)
      }
    } catch (e) {}
  }
  function onResize() {
    try {
      if (hideOnScroll) return
      if (redrawDebounceTimer !== void 0) return
      redrawDebounceTimer = globalThis.setTimeout(() => {
        redrawDebounceTimer = void 0
        redraw()
      }, redrawDebounceMs)
    } catch (e) {}
  }
  function onDblClick() {
    clearOverlay()
  }
  function onKeyDown(e) {
    if (!enabled) return
    if (!moveByArrows) return
    const t = e.target
    if (isInteractive(t)) return
    if (e.ctrlKey || e.altKey || e.metaKey) return
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    const dir = e.key === 'ArrowUp' ? 'prev' : 'next'
    const r = lastRange
    if (!r) return
    if (mode !== 'sentence' && mode !== 'clause') return
    let next = rangeForNeighbor(r, dir, mode)
    let steps = 0
    while (next && !hasVisibleRects(next) && steps < 16) {
      next = rangeForNeighbor(next, dir, mode)
      steps++
    }
    if ((!next || !hasVisibleRects(next)) && r) {
      next = findNeighborByGeometry(r, dir, mode)
    }
    if (!next || !hasVisibleRects(next)) return
    e.preventDefault()
    drawRange(next)
    lastRange = next
    const rectsOk = hasVisibleRects(next)
    if (!rectsOk) return
    let sameLine = isSameVisualLine(r, next)
    if (skipButtons && isButtonLikeRange(next)) {
      let hop = 0
      let alt = next
      while (alt && hop < 32) {
        const nn = rangeForNeighbor(alt, dir, mode)
        alt = nn
        hop++
        if (!alt || !hasVisibleRects(alt)) {
          const gg = findNeighborByGeometry(next, dir, mode)
          alt = gg
        }
        if (alt && hasVisibleRects(alt) && !isButtonLikeRange(alt)) break
      }
      if (alt && hasVisibleRects(alt) && !isButtonLikeRange(alt)) {
        next = alt
        drawRange(next)
        lastRange = next
        sameLine = isSameVisualLine(r, next)
      }
    }
    const anyR = next
    const list = anyR.__singleLineRect
      ? [anyR.__singleLineRect]
      : Array.from(next.getClientRects())
    let fullyVisible = false
    for (const r0 of list) {
      const top = r0.top
      const bottom = r0.bottom
      if (top >= 0 && bottom <= globalThis.innerHeight) {
        fullyVisible = true
        break
      }
    }
    const vh2 = globalThis.innerHeight
    const center2 = globalThis.innerHeight ? globalThis.innerHeight / 2 : 0
    let nearCenter2 = false
    if (vh2) {
      const list2 = anyR.__singleLineRect
        ? [anyR.__singleLineRect]
        : Array.from(next.getClientRects())
      let t2 = Infinity
      let b2 = -Infinity
      for (const rr of list2) {
        if (rr.width <= 2) continue
        if (isPunctuationRect(rr)) continue
        t2 = Math.min(t2, rr.top)
        b2 = Math.max(b2, rr.bottom)
      }
      if (Number.isFinite(t2) && Number.isFinite(b2)) {
        const c2 = (t2 + b2) / 2
        const tol2 = Math.max(120, Math.floor(vh2 * 0.18))
        nearCenter2 = Math.abs(c2 - center2) <= tol2
      }
    }
    if (!sameLine && (!fullyVisible || !nearCenter2)) {
      scrollRangeIntoView(next, dir)
    }
  }
  function installEvents() {
    if (!clickHandlerInstalled) {
      document.addEventListener('click', onClick, true)
      clickHandlerInstalled = true
    }
    if (!selectionHandlerInstalled) {
      document.addEventListener('selectionchange', onSelectionChange)
      selectionHandlerInstalled = true
    }
    if (!dblClickHandlerInstalled) {
      document.addEventListener('dblclick', onDblClick, true)
      dblClickHandlerInstalled = true
    }
    if (!selectStartInstalled) {
      document.addEventListener('selectstart', onSelectStart, true)
      selectStartInstalled = true
    }
    if (!mouseUpInstalled) {
      document.addEventListener('mouseup', onMouseUp, true)
      mouseUpInstalled = true
    }
    if (!scrollHandlerInstalled) {
      globalThis.addEventListener('scroll', onScroll, true)
      scrollHandlerInstalled = true
    }
    if (!resizeHandlerInstalled) {
      globalThis.addEventListener('resize', onResize)
      resizeHandlerInstalled = true
    }
    if (!keyHandlerInstalled) {
      document.addEventListener('keydown', onKeyDown, true)
      keyHandlerInstalled = true
    }
  }
  function removeEvents() {
    if (clickHandlerInstalled) {
      document.removeEventListener('click', onClick, true)
      clickHandlerInstalled = false
    }
    if (selectionHandlerInstalled) {
      document.removeEventListener('selectionchange', onSelectionChange)
      selectionHandlerInstalled = false
    }
    if (dblClickHandlerInstalled) {
      document.removeEventListener('dblclick', onDblClick, true)
      dblClickHandlerInstalled = false
    }
    if (selectStartInstalled) {
      document.removeEventListener('selectstart', onSelectStart, true)
      selectStartInstalled = false
    }
    if (mouseUpInstalled) {
      document.removeEventListener('mouseup', onMouseUp, true)
      mouseUpInstalled = false
    }
    if (scrollHandlerInstalled) {
      globalThis.removeEventListener('scroll', onScroll, true)
      scrollHandlerInstalled = false
    }
    if (resizeHandlerInstalled) {
      globalThis.removeEventListener('resize', onResize)
      resizeHandlerInstalled = false
    }
    if (keyHandlerInstalled) {
      document.removeEventListener('keydown', onKeyDown, true)
      keyHandlerInstalled = false
    }
  }
  function registerMenus() {
    try {
      if (
        menuIds.length > 0 &&
        typeof GM_unregisterMenuCommand === 'function'
      ) {
        for (const id2 of menuIds) {
          try {
            GM_unregisterMenuCommand(id2)
          } catch (e) {}
        }
      }
      menuIds = []
    } catch (e) {}
    if (typeof GM_registerMenuCommand !== 'function') return
    const id = GM_registerMenuCommand('\u8BBE\u7F6E', () => {
      ;(async () => {
        try {
          const m = await Promise.resolve().then(
            () => (init_settings_panel(), settings_panel_exports)
          )
          if (typeof m.openSettingsPanel === 'function') m.openSettingsPanel()
        } catch (e) {}
      })()
    })
    try {
      menuIds.push(id)
    } catch (e) {}
  }
  function listenSettings() {
    if (typeof GM_addValueChangeListener !== 'function') return
    GM_addValueChangeListener(MODE_KEY2, (_, __, nv) => {
      mode = nv
      if (lastRange) {
        const caret = document.createRange()
        caret.setStart(lastRange.startContainer, lastRange.startOffset)
        caret.collapse(true)
        const r = findSegmentRange(caret, mode)
        if (r) {
          drawRange(r)
          lastRange = r
        } else {
          clearOverlay()
        }
      }
    })
    GM_addValueChangeListener(STYLE_KEY2, (_, __, nv) => {
      style = nv
      if (lastRange) drawRange(lastRange)
      else clearOverlay()
    })
    GM_addValueChangeListener(COLOR_KEY2, (_, __, nv) => {
      color = nv
      if (lastRange) drawRange(lastRange)
      else clearOverlay()
    })
    GM_addValueChangeListener(ENABLED_KEY2, (_, __, nv) => {
      enabled = typeof nv === 'string' ? nv === '1' : Boolean(nv)
      if (enabled) installEvents()
      else {
        clearOverlay()
        removeEvents()
      }
    })
    GM_addValueChangeListener(SCROLL_HIDE_KEY2, (_, __, nv) => {
      hideOnScroll = Boolean(nv)
      if (hideOnScroll) clearOverlay()
    })
    GM_addValueChangeListener(MOVE_BY_ARROWS_KEY, (_, __, nv) => {
      moveByArrows = Boolean(nv)
    })
    GM_addValueChangeListener(SKIP_BUTTONS_KEY2, (_, __, nv) => {
      skipButtons = nv === '1' ? true : Boolean(nv)
    })
  }
  function bootstrap() {
    const d = document.documentElement
    if (d.dataset.readHelper === '1') return
    d.dataset.readHelper = '1'
    if (enabled) installEvents()
    registerMenus()
    listenSettings()
    void (async () => {
      try {
        const mv = await GM.getValue(MODE_KEY2, mode)
        mode = mv
      } catch (e) {}
      try {
        const sv = await GM.getValue(STYLE_KEY2, style)
        style = sv
      } catch (e) {}
      try {
        const cv = await GM.getValue(COLOR_KEY2, color)
        color = String(cv || color)
      } catch (e) {}
      try {
        const ev = await GM.getValue(ENABLED_KEY2, enabled ? '1' : '0')
        const flag = typeof ev === 'string' ? ev === '1' : Boolean(ev)
        enabled = flag
        if (enabled) installEvents()
        else removeEvents()
      } catch (e) {}
      try {
        const sh = await GM.getValue(SCROLL_HIDE_KEY2, hideOnScroll)
        hideOnScroll = Boolean(sh)
      } catch (e) {}
      try {
        const ma = await GM.getValue(MOVE_BY_ARROWS_KEY, moveByArrows)
        moveByArrows = Boolean(ma)
      } catch (e) {}
      try {
        const sb = await GM.getValue(SKIP_BUTTONS_KEY2, skipButtons ? '1' : '0')
        skipButtons = typeof sb === 'string' ? sb === '1' : Boolean(sb)
      } catch (e) {}
    })()
  }
  bootstrap()
})()
