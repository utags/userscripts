// ==UserScript==
// @name                 Read Helper
// @name:zh-CN           阅读助手
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.3
// @description          Floating quick navigation with per-site groups, icons, and editable items.
// @description:zh-CN    悬浮快速导航，支持按站点分组、图标与可编辑导航项。
// @icon                 data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%2212%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%224%22/%3E%3Cpath%20d%3D%22M22%2032h20M22%2042h16M22%2022h12%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                *://*/*
// @run-at               document-body
// @grant                GM_registerMenuCommand
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
  function registerMenu(caption, onClick2, options) {
    if (typeof GM_registerMenuCommand === 'function') {
      return GM_registerMenuCommand(caption, onClick2, options)
    }
    return 0
  }
  var style_default =
    '/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-50:oklch(97.1% 0.013 17.38);--color-red-500:oklch(63.7% 0.237 25.331);--color-blue-300:oklch(80.9% 0.105 251.813);--color-blue-400:oklch(70.7% 0.165 254.624);--color-blue-600:oklch(54.6% 0.245 262.881);--color-blue-700:oklch(48.8% 0.243 264.376);--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-800:oklch(27.8% 0.033 256.848);--color-gray-900:oklch(21% 0.034 264.665);--color-white:#fff;--spacing:4px;--font-weight-semibold:600;--font-weight-bold:700;--radius-md:6px;--radius-xl:12px;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.container{width:100%;@media (width >= 40rem){max-width:640px}@media (width >= 48rem){max-width:768px}@media (width >= 64rem){max-width:1024px}@media (width >= 80rem){max-width:1280px}@media (width >= 96rem){max-width:1536px}}.grid{display:grid}}:host{all:initial}.user-settings{position:fixed;right:calc(var(--spacing)*3);top:calc(var(--spacing)*3);z-index:2147483647;--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .panel{background-color:var(--color-gray-100);border-bottom-left-radius:var(--radius-xl);border-bottom-right-radius:var(--radius-xl);color:var(--color-gray-900);font-family:var(--font-sans);font-size:14px;max-height:90vh;overflow-y:auto;padding-inline:calc(var(--spacing)*4);padding-bottom:calc(var(--spacing)*4);padding-top:calc(var(--spacing)*0);width:420px;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));background:#f2f2f7;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);box-shadow:0 10px 39px 10px #3e424238!important;scrollbar-color:rgba(156,163,175,.25) transparent;scrollbar-width:thin}.user-settings .grid{display:flex;flex-direction:column;gap:calc(var(--spacing)*3)}.user-settings .row{align-items:center;display:flex;gap:calc(var(--spacing)*3);justify-content:space-between;padding-block:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4)}.user-settings .group{background-color:var(--color-white);border-radius:var(--radius-xl);gap:calc(var(--spacing)*0);overflow:hidden}.user-settings .group .row{background-color:var(--color-white);border-radius:0;border-style:var(--tw-border-style);border-width:0;padding-block:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4);position:relative}.user-settings .group .row:not(:last-child):after{background:#e5e7eb;bottom:0;content:"";height:1px;left:16px;position:absolute;right:0}.user-settings .header-row{align-items:center;border-radius:0;display:flex;justify-content:center;padding-inline:calc(var(--spacing)*0);padding-bottom:calc(var(--spacing)*3);padding-top:calc(var(--spacing)*0)}.user-settings .panel-stuck .header-row .panel-title{opacity:0;transform:translateY(-2px);transition:opacity .15s ease,transform .15s ease}.user-settings label{color:var(--color-gray-600)}.user-settings .label-wrap{display:flex;flex-direction:column;gap:calc(var(--spacing)*1);min-width:60px;text-align:left}.user-settings .btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);white-space:nowrap;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .btn-danger{border-color:var(--color-red-500);color:var(--color-red-500);&:hover{@media (hover:hover){background-color:var(--color-red-50)}}}.user-settings .btn-ghost{border-radius:var(--radius-md);color:var(--color-gray-500);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.user-settings input[type=text]{border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:180px;--tw-outline-style:none;outline-style:none}.user-settings input[type=text]:focus,.user-settings input[type=text]:hover{border-color:var(--color-gray-300)}.user-settings select{background-color:var(--color-white);border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:180px;--tw-outline-style:none;outline-style:none}.user-settings select:focus,.user-settings select:hover{border-color:var(--color-gray-300)}.user-settings input[type=color]{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;height:calc(var(--spacing)*8);padding:calc(var(--spacing)*0);width:80px}.user-settings textarea{border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:100%;--tw-outline-style:none;outline-style:none}.user-settings textarea:focus,.user-settings textarea:hover{border-color:var(--color-gray-300)}.user-settings .switch,.user-settings .toggle-wrap{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.user-settings .toggle-checkbox{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:#e5e5ea;border:1px solid #d1d1d6;border-radius:9999px;box-shadow:inset 0 1px 1px rgba(0,0,0,.1);cursor:pointer;display:inline-block;height:22px;position:relative;transition:background-color .2s ease,border-color .2s ease;width:42px}.user-settings .toggle-checkbox:before{background:#fff;border-radius:9999px;box-shadow:0 2px 4px rgba(0,0,0,.25);content:"";height:18px;left:2px;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease,background-color .2s ease,left .2s ease,right .2s ease;width:18px}.user-settings .toggle-checkbox:checked{background:var(--user-toggle-on-bg,#34c759);border-color:var(--user-toggle-on-bg,#34c759)}.user-settings .panel-title{font-size:20px;--tw-font-weight:var(--font-weight-bold);color:var(--color-gray-800);font-weight:var(--font-weight-bold)}.user-settings .outer-header{align-items:center;background-color:var(--color-gray-100);background:#f2f2f7;border-top-left-radius:var(--radius-xl);border-top-right-radius:var(--radius-xl);display:flex;font-family:var(--font-sans);height:calc(var(--spacing)*11);justify-content:center;position:relative}.user-settings .outer-header .outer-title{font-size:20px;opacity:0;transition:opacity .15s ease;--tw-font-weight:var(--font-weight-bold);color:var(--color-gray-800);font-weight:var(--font-weight-bold)}.user-settings .outer-header.stuck .outer-title{opacity:1}.user-settings .outer-header:after{background:#e5e7eb;bottom:0;content:"";height:1px;left:0;opacity:0;position:absolute;right:0;transition:opacity .15s ease}.user-settings .outer-header.stuck:after{opacity:1}.user-settings .group-title{font-size:13px;padding-inline:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-600);font-weight:var(--font-weight-semibold)}.user-settings .btn-ghost.icon{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-500);cursor:pointer;display:flex;font-size:16px;height:calc(var(--spacing)*9);justify-content:center;transition:background-color .15s ease,color .15s ease;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:calc(var(--spacing)*9);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:hover{@media (hover:hover){color:var(--color-gray-700)}}}.user-settings .close-btn:hover{background-color:var(--color-gray-300);box-shadow:0 0 0 1px rgba(0,0,0,.05);color:var(--color-gray-900);font-size:19px;transform:translateY(-50%)}.user-settings .close-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);transition:transform .15s ease,background-color .15s ease,color .15s ease,font-size .15s ease}.user-settings .toggle-checkbox:checked:before{background:#fff;left:auto;right:2px;transform:translateY(-50%)}.user-settings .color-row{align-items:center;display:flex;gap:calc(var(--spacing)*1.5)}.user-settings .color-swatch{border-radius:var(--radius-md);cursor:pointer;height:calc(var(--spacing)*6);width:calc(var(--spacing)*6)}.user-settings .color-swatch.active{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .seg{align-items:center;display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*2)}.user-settings .seg.vertical{align-items:flex-end;flex-direction:column}.user-settings .seg-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .seg-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .value-wrap{align-items:flex-end;display:flex;flex-direction:column;gap:calc(var(--spacing)*1);text-align:right}.user-settings .tabs{align-items:center;display:flex;gap:calc(var(--spacing)*2);margin-bottom:calc(var(--spacing)*2)}.user-settings .tab-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .tab-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .field-help{color:var(--color-gray-400);font-size:11px}.user-settings .field-help a{color:var(--color-blue-600);text-decoration:underline;text-decoration-style:dashed;text-underline-offset:2px;&:hover{@media (hover:hover){color:var(--color-blue-700)}}}@media (prefers-color-scheme:dark){.user-settings .panel{background-color:var(--color-gray-800);border-bottom-left-radius:var(--radius-xl);border-bottom-right-radius:var(--radius-xl);box-shadow:0 10px 39px 10px #00000040!important;color:var(--color-gray-100)}.user-settings .row{background-color:transparent;border-style:var(--tw-border-style);border-width:0}.user-settings .header-row{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.user-settings .outer-header{background-color:var(--color-gray-800);border-top-left-radius:var(--radius-xl);border-top-right-radius:var(--radius-xl)}.user-settings .outer-header:after{background:#4b5563}.user-settings .footer a.issue-link{color:var(--color-gray-300);&:hover{@media (hover:hover){color:var(--color-gray-100)}}}.user-settings .footer .brand{color:var(--color-gray-400)}.user-settings label{color:var(--color-gray-300)}.user-settings .field-help{color:var(--color-gray-400)}.user-settings .field-help a{color:var(--color-blue-400);&:hover{@media (hover:hover){color:var(--color-blue-300)}}}.user-settings .group{background-color:var(--color-gray-700)}.user-settings .group .row:not(:last-child):after{background:#4b5563}}.user-settings .panel::-webkit-scrollbar{width:4px}.user-settings .panel::-webkit-scrollbar-track{background:transparent}.user-settings .panel::-webkit-scrollbar-thumb{background:rgba(156,163,175,.25);border-radius:9999px;opacity:.25}.user-settings .footer{align-items:center;color:var(--color-gray-500);display:flex;flex-direction:column;font-size:12px;gap:calc(var(--spacing)*1);padding-bottom:calc(var(--spacing)*3);padding-top:calc(var(--spacing)*6)}.user-settings .footer a.issue-link{color:var(--color-gray-600);cursor:pointer;text-decoration-line:underline;text-underline-offset:2px;-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){color:var(--color-gray-800)}}}.user-settings .footer .brand{color:var(--color-gray-500);cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){color:var(--color-gray-700)}}}.user-settings button{-webkit-user-select:none;-moz-user-select:none;user-select:none}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-border-style:solid;--tw-font-weight:initial}}'
  var doc = document
  function c(tag, opts) {
    const el = doc.createElement(tag)
    if (!opts) return el
    if (opts.className) el.className = opts.className
    if (opts.classes) for (const cls of opts.classes) el.classList.add(cls)
    if (opts.dataset)
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
      if (he !== doc.body && he.parentElement && he.offsetParent === null)
        return false
      cur = cur.parentElement || void 0
    }
    return true
  }
  function isInteractive(el) {
    if (!el) return false
    const tag = (el.tagName || '').toLowerCase()
    if (['input', 'textarea', 'select', 'button'].includes(tag)) return true
    if (
      typeof el.hasAttribute === 'function' &&
      el.hasAttribute('contenteditable')
    )
      return true
    return false
  }
  function isBlockElement(el) {
    const cs = globalThis.getComputedStyle(el)
    const d = cs.display
    const tag = (el.tagName || '').toLowerCase()
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
        : node.parentElement || doc.body
    while (el && el !== doc.body) {
      if (isBlockElement(el)) return el
      el = el.parentElement || doc.body
    }
    return doc.body
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
        const r2 = doc.createRange()
        r2.setStart(pos.offsetNode, pos.offset)
        r2.collapse(true)
        return r2
      }
    }
    const sel = globalThis.getSelection()
    if (!sel) return void 0
    const r = sel.rangeCount
      ? sel.getRangeAt(0).cloneRange()
      : doc.createRange()
    return r
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
      const isSitePref = Boolean(el.dataset.isSitePref)
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
  function buildTextIndex(root) {
    const nodes = []
    const texts = []
    const tw = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT)
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
    const r = doc.createRange()
    r.selectNodeContents(block)
    return r
  }
  function rangeForLine(caret) {
    const block = closestBlockElement(caret.startContainer)
    const caretRect = caret.getBoundingClientRect()
    const r = doc.createRange()
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
    const out = doc.createRange()
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
    const r = doc.createRange()
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
  var DEFAULT_READ_HELPER_SETTINGS = {
    mode: 'sentence',
    style: 'underline',
    color: '#ff4d4f',
    enabled: true,
    hideOnScroll: false,
    moveByArrows: false,
    skipButtons: true,
    skipLinks: true,
  }
  var mode = DEFAULT_READ_HELPER_SETTINGS.mode
  var style = DEFAULT_READ_HELPER_SETTINGS.style
  var color = DEFAULT_READ_HELPER_SETTINGS.color
  var enabled = DEFAULT_READ_HELPER_SETTINGS.enabled
  var hideOnScroll = DEFAULT_READ_HELPER_SETTINGS.hideOnScroll
  var moveByArrows = DEFAULT_READ_HELPER_SETTINGS.moveByArrows
  var skipButtons = DEFAULT_READ_HELPER_SETTINGS.skipButtons
  var skipLinks = DEFAULT_READ_HELPER_SETTINGS.skipLinks
  var store = createSettingsStore('', DEFAULT_READ_HELPER_SETTINGS)
  var overlay
  var clickHandlerInstalled = false
  var selectionHandlerInstalled = false
  var dblClickHandlerInstalled = false
  var keyHandlerInstalled = false
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
      overlay = c('div', {
        attrs: { id: 'read-helper-overlay' },
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '0',
          height: '0',
          pointerEvents: 'none',
          zIndex: '2147483645',
        },
      })
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
    for (const c2 of tokens) {
      if (
        c2 === 'btn' ||
        c2.startsWith('btn') ||
        c2 === 'button' ||
        c2.startsWith('button')
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
        const d = c('div', {
          style: {
            position: 'fixed',
            left: ''.concat(g.left - BOX_PAD_X, 'px'),
            top: ''.concat(g.top - padY, 'px'),
            width: ''.concat(
              Math.max(0, g.right - g.left + BOX_PAD_X * 2),
              'px'
            ),
            height: ''.concat(Math.max(0, h + padY * 2), 'px'),
            border: '2px dashed '.concat(color),
            borderRadius: '4px',
            boxSizing: 'border-box',
          },
        })
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
        const d = c('div', {
          style: {
            position: 'fixed',
            left: ''.concat(g.left, 'px'),
            top: ''.concat(g.bottom + UNDERLINE_OFFSET, 'px'),
            width: ''.concat(Math.max(0, g.right - g.left), 'px'),
            height: '0px',
            borderBottom: '2px dashed '.concat(color),
          },
        })
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
    if (skipLinks && t && t.closest('a')) {
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
  function onKeyDown2(e) {
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
      document.addEventListener('keydown', onKeyDown2, true)
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
      document.removeEventListener('keydown', onKeyDown2, true)
      keyHandlerInstalled = false
    }
  }
  function openSettingsPanel2() {
    const schema = {
      type: 'simple',
      title: '\u9605\u8BFB\u52A9\u624B\u8BBE\u7F6E',
      fields: [
        { type: 'toggle', key: 'enabled', label: '\u542F\u7528' },
        {
          type: 'radio',
          key: 'mode',
          label: '\u6A21\u5F0F',
          options: [
            { value: 'sentence', label: '\u6309\u53E5' },
            { value: 'clause', label: '\u6309\u6BB5' },
            { value: 'line', label: '\u6309\u884C' },
            { value: 'paragraph', label: '\u6574\u6BB5' },
          ],
        },
        {
          type: 'radio',
          key: 'style',
          label: '\u6837\u5F0F',
          options: [
            { value: 'box', label: '\u865A\u7EBF\u6846' },
            { value: 'underline', label: '\u4E0B\u5212\u7EBF' },
          ],
        },
        {
          type: 'colors',
          key: 'color',
          label: '\u989C\u8272',
          options: [
            { value: '#ff4d4f' },
            { value: '#3b82f6' },
            { value: '#22c55e' },
            { value: '#f59e0b' },
            { value: '#8b5cf6' },
            { value: '#111827' },
          ],
        },
        {
          type: 'toggle',
          key: 'moveByArrows',
          label: '\u7528\u65B9\u5411\u952E\u79FB\u52A8',
        },
        {
          type: 'toggle',
          key: 'hideOnScroll',
          label: '\u6EDA\u52A8\u65F6\u9690\u85CF',
        },
        {
          type: 'toggle',
          key: 'skipButtons',
          label: '\u8DF3\u8FC7\u6309\u94AE',
        },
        { type: 'toggle', key: 'skipLinks', label: '\u8DF3\u8FC7\u94FE\u63A5' },
      ],
    }
    openSettingsPanel(schema, store, {
      hostDatasetKey: 'rhHost',
      hostDatasetValue: 'read-helper-settings',
      theme: {
        activeBg: '#111827',
        activeFg: '#ffffff',
        colorRing: '#111827',
      },
    })
  }
  function installUrlWatcher() {
    let lastUrl = globalThis.location.href
    const onUrlChanged = () => {
      const cur = globalThis.location.href
      if (cur === lastUrl) return
      lastUrl = cur
      if (!lastRange) return
      const sc = lastRange.startContainer
      const ec = lastRange.endContainer
      const stillConnected =
        Boolean(sc && sc.isConnected) && Boolean(ec && ec.isConnected)
      if (!stillConnected) {
        clearOverlay()
        return
      }
      const anc = lastRange.commonAncestorContainer
      const elem = anc instanceof Element ? anc : anc.parentElement || void 0
      const block = elem ? closestBlockElement(elem) || elem : void 0
      if (!block || !isElementVisible(block)) {
        clearOverlay()
      }
    }
    try {
      const origPush = history.pushState
      history.pushState = function (...args) {
        const ret = origPush.apply(history, args)
        onUrlChanged()
        return ret
      }
    } catch (e) {}
    try {
      const origReplace = history.replaceState
      history.replaceState = function (...args) {
        const ret = origReplace.apply(history, args)
        onUrlChanged()
        return ret
      }
    } catch (e) {}
    globalThis.addEventListener('popstate', onUrlChanged)
    globalThis.addEventListener('hashchange', onUrlChanged)
  }
  function registerMenus() {
    try {
      registerMenu('\u8BBE\u7F6E', () => {
        try {
          openSettingsPanel2()
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
      mode = obj.mode
      style = obj.style
      color = String(obj.color || '')
      enabled = Boolean(obj.enabled)
      hideOnScroll = Boolean(obj.hideOnScroll)
      moveByArrows = Boolean(obj.moveByArrows)
      skipButtons = Boolean(obj.skipButtons)
      skipLinks = Boolean(obj.skipLinks)
      const changed = prevEnabled !== enabled
      if (changed) {
        if (enabled) installEvents()
        else {
          clearOverlay()
          removeEvents()
        }
      } else if (lastRange) {
        drawRange(lastRange)
      } else {
        clearOverlay()
      }
    } catch (e) {}
  }
  function bootstrap() {
    const d = document.documentElement
    if (d.dataset.readHelper === '1') return
    d.dataset.readHelper = '1'
    if (enabled) installEvents()
    registerMenus()
    listenSettings()
    void applySettingsFromStore()
    installUrlWatcher()
  }
  bootstrap()
})()
