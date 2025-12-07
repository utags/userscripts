// ==UserScript==
// @name                 UTags Quick Nav
// @name:zh-CN           UTags 快速导航
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
// @run-at               document-idle
// @grant                GM_xmlhttpRequest
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM_registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @grant                GM_addValueChangeListener
// ==/UserScript==
//
;(() => {
  'use strict'
  var __defProp = Object.defineProperty
  var __defProps = Object.defineProperties
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors
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
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b))
  function clearChildren(el) {
    try {
      el.textContent = ''
    } catch (e) {
      try {
        while (el.firstChild) el.firstChild.remove()
      } catch (e2) {}
    }
  }
  function querySelectorAllDeep(root, selector) {
    const result = []
    const visited = /* @__PURE__ */ new Set()
    const visit = (node) => {
      if (!node || visited.has(node)) return
      visited.add(node)
      const anyNode = node
      try {
        if (typeof anyNode.querySelectorAll === 'function') {
          const found = Array.from(anyNode.querySelectorAll(selector))
          for (const el of found) if (el instanceof Element) result.push(el)
        }
      } catch (e) {}
      try {
        const children = Array.from(anyNode.childNodes || [])
        for (const child of children) visit(child)
      } catch (e) {}
      try {
        const shadow = anyNode.shadowRoot
        if (shadow) visit(shadow)
      } catch (e) {}
    }
    visit(root)
    return Array.from(new Set(result))
  }
  function createOpenModeRadios(initial, onChange, opts) {
    var _a, _b
    const wrap = document.createElement('div')
    wrap.className = 'segmented'
    const name = 'utqn-open-' + Math.random().toString(36).slice(2, 8)
    const labels =
      (_a = opts == null ? void 0 : opts.labels) != null
        ? _a
        : {
            'same-tab': '\u5F53\u524D\u9875',
            'new-tab': '\u65B0\u6807\u7B7E\u9875',
          }
    for (const m of ['same-tab', 'new-tab']) {
      const label = document.createElement('label')
      label.className = 'seg-item'
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = name
      input.value = m
      input.className = 'seg-radio'
      input.checked = initial === m
      input.addEventListener('change', () => {
        if (input.checked) onChange(m)
      })
      const text = document.createElement('span')
      text.className = 'seg-text'
      text.textContent = (_b = labels[m]) != null ? _b : m
      label.append(input)
      label.append(text)
      wrap.append(label)
    }
    return wrap
  }
  var style_default =
    '/*! tailwindcss v4.1.17 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-blue-500:oklch(62.3% 0.214 259.815);--color-blue-600:oklch(54.6% 0.245 262.881);--color-blue-700:oklch(48.8% 0.243 264.376);--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-200:oklch(92.8% 0.006 264.531);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-800:oklch(27.8% 0.033 256.848);--color-gray-900:oklch(21% 0.034 264.665);--color-black:#000;--color-white:#fff;--spacing:0.25rem;--text-xs:0.75rem;--text-xs--line-height:1.33333;--text-sm:0.875rem;--text-sm--line-height:1.42857;--font-weight-medium:500;--font-weight-semibold:600;--tracking-wider:0.05em;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--ease-in:cubic-bezier(0.4,0,1,1);--blur-sm:8px;--default-transition-duration:150ms;--default-transition-timing-function:cubic-bezier(0.4,0,0.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.collapse{visibility:collapse}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.container{width:100%;@media (width >= 40rem){max-width:40rem}@media (width >= 48rem){max-width:48rem}@media (width >= 64rem){max-width:64rem}@media (width >= 80rem){max-width:80rem}@media (width >= 96rem){max-width:96rem}}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-flex{display:inline-flex}.table{display:table}.flex-shrink{flex-shrink:1}.flex-grow{flex-grow:1}.border-collapse{border-collapse:collapse}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.resize{resize:both}.flex-wrap{flex-wrap:wrap}.border{border-style:var(--tw-border-style);border-width:1px}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-filter{backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function))}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}}:host{all:initial}div{line-height:normal}.utqn{color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px;position:fixed;z-index:21474836}.utqn.dark{color:var(--color-gray-100)}.panel{background-color:color-mix(in oklab,var(--color-white) 85%,transparent);border-color:var(--color-gray-200);border-radius:var(--radius-xl);border-style:var(--tw-border-style);border-width:1px;display:flex;flex-direction:column;gap:calc(var(--spacing)*3);max-height:100vh;max-width:360px;overflow-y:auto;padding:calc(var(--spacing)*3);--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-backdrop-blur:blur(var(--blur-sm));--tw-backdrop-saturate:saturate(1.2);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.utqn.dark .panel{background-color:color-mix(in srgb,oklch(21% .034 264.665) 80%,transparent);border-color:var(--color-gray-700);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-gray-900) 80%,transparent)}--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}@keyframes utqn-slide-in-left{0%{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}@keyframes utqn-slide-in-right{0%{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}@keyframes utqn-slide-in-top{0%{opacity:0;transform:translateY(0)}to{opacity:1;transform:translateY(0)}}@keyframes utqn-slide-in-bottom{0%{opacity:0;transform:translateY(0)}to{opacity:1;transform:translateY(0)}}@keyframes utqn-slide-out-left{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-12px)}}@keyframes utqn-slide-out-right{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(12px)}}@keyframes utqn-slide-out-top{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(0)}}@keyframes utqn-slide-out-bottom{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(0)}}.anim-in-left{animation:utqn-slide-in-left .2s ease-out}.anim-in-right{animation:utqn-slide-in-right .2s ease-out}.anim-in-top{animation:utqn-slide-in-top .2s ease-out}.anim-in-bottom{animation:utqn-slide-in-bottom .2s ease-out}.anim-out-left{animation:utqn-slide-out-left .18s ease-in forwards}.anim-out-right{animation:utqn-slide-out-right .18s ease-in forwards}.anim-out-top{animation:utqn-slide-out-top .18s ease-in forwards}.anim-out-bottom{animation:utqn-slide-out-bottom .18s ease-in forwards}.header{align-items:center;display:flex;gap:calc(var(--spacing)*2);justify-content:space-between}.header-actions{align-items:center;display:flex;gap:calc(var(--spacing)*1.5);opacity:0;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s}.section .header:hover .header-actions{opacity:100%}.section .header{margin-bottom:calc(var(--spacing)*0)}.icon-btn{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .icon-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.utqn.dark .icon img.lucide-icon{filter:invert(1) brightness(1.15) saturate(1.1)}.icon-btn.active{background-color:var(--color-gray-200);color:var(--color-gray-900);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.icon-btn.active,.utqn.dark .icon-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .icon-btn.active{background-color:var(--color-gray-700);color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.title{align-items:center;display:flex;gap:calc(var(--spacing)*1.5);--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-800);font-weight:var(--font-weight-semibold)}.utqn.dark .title{color:var(--color-gray-100)}.btn{align-items:center;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;display:inline-flex;gap:calc(var(--spacing)*1.5);justify-content:center;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2.5);--tw-font-weight:var(--font-weight-medium);color:var(--color-gray-800);font-weight:var(--font-weight-medium);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-300);--tw-outline-style:none;outline-style:none}&:active{scale:.99}}.utqn.dark .btn{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:focus{--tw-ring-color:var(--color-gray-700)}}.btn-primary{background-color:var(--color-blue-600);border-color:var(--color-blue-600);color:var(--color-white);--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,rgba(0,0,0,.1)),0 2px 4px -2px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);&:hover{@media (hover:hover){border-color:var(--color-blue-700)}}&:hover{@media (hover:hover){background-color:var(--color-blue-700)}}}.modal.dark .btn-primary,.utqn.dark .btn-primary{background-color:var(--color-blue-500);border-color:var(--color-blue-500);color:var(--color-white);&:hover{@media (hover:hover){border-color:var(--color-blue-600)}}&:hover{@media (hover:hover){background-color:var(--color-blue-600)}}}.btn-secondary{background-color:var(--color-gray-100);border-color:var(--color-gray-300);color:var(--color-gray-800);&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}}.modal.dark .btn-secondary,.utqn.dark .btn-secondary{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.items{display:grid;gap:calc(var(--spacing)*1);grid-template-columns:repeat(var(--cols,1),minmax(0,1fr))}.item{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-900);display:inline-flex;gap:calc(var(--spacing)*1.5);min-width:calc(var(--spacing)*0);overflow:hidden;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);text-decoration-line:none;text-overflow:ellipsis;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));white-space:nowrap;--tw-duration:150ms;transition-duration:.15s;width:100%}.item:hover{background-color:var(--color-gray-100)}.utqn.dark .item:hover{background-color:var(--color-gray-800)}.utqn.dark .item{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-100);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.icon{align-items:center;display:inline-flex;height:calc(var(--spacing)*4);justify-content:center;overflow:hidden;width:calc(var(--spacing)*4);--tw-leading:1;line-height:1;white-space:nowrap}.collapsed-tab{background-color:var(--color-gray-700);border-radius:0;height:60px;opacity:40%;position:fixed;width:3px;z-index:21474836}.utqn.dark .collapsed-tab{background-color:var(--color-gray-400);opacity:40%}.collapsed-tab:hover{opacity:80%}.modal-mask{align-items:center;background-color:color-mix(in srgb,#000 40%,transparent);display:flex;inset:calc(var(--spacing)*0);justify-content:center;position:fixed;z-index:2147483647;@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-black) 40%,transparent)}}.modal{color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px}.modal h2{font-size:16px;margin:calc(var(--spacing)*0);margin-bottom:calc(var(--spacing)*2.5)}.row{display:flex;gap:calc(var(--spacing)*2);margin-block:calc(var(--spacing)*1.5)}.modal .row{align-items:center}.segmented{align-items:center;background-color:var(--color-gray-100);border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;display:inline-flex;gap:calc(var(--spacing)*1);padding-block:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*1);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .segmented{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.seg-item{align-items:center;border-radius:calc(infinity*1px);cursor:pointer;display:inline-flex;-webkit-user-select:none;-moz-user-select:none;user-select:none}.seg-radio{border-width:0;clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.seg-text{border-radius:calc(infinity*1px);color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);text-align:center;width:100%}.utqn.dark .seg-text{color:var(--color-gray-300)}.seg-item .seg-radio:checked+.seg-text{background-color:var(--color-white);color:var(--color-gray-900);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.seg-item .seg-radio:checked+.seg-text,.utqn.dark .seg-item .seg-radio:checked+.seg-text{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .seg-item .seg-radio:checked+.seg-text{background-color:var(--color-gray-700);color:var(--color-gray-100);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.seg-item .seg-radio:focus+.seg-text{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-blue-500)}input,select,textarea{border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;flex:1;font-size:13px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}textarea{min-height:80px}.grid{display:grid;gap:calc(var(--spacing)*2);grid-template-columns:repeat(2,minmax(0,1fr))}.group-list{display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*1.5);margin-top:calc(var(--spacing)*1.5)}.group-pill{border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.group-pill.active{background-color:var(--color-gray-900);border-color:var(--color-gray-900);color:var(--color-white)}.utqn.dark .group-pill{border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.utqn.dark .group-pill.active{background-color:var(--color-gray-100);border-color:var(--color-gray-100);color:var(--color-gray-900)}.mini{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*1.5)}.divider{background-color:var(--color-gray-200);height:1px}.utqn.dark .divider{background-color:var(--color-gray-700)}.section-title{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));margin-bottom:calc(var(--spacing)*1);--tw-tracking:var(--tracking-wider);color:var(--color-gray-500);letter-spacing:var(--tracking-wider);text-transform:uppercase}.utqn.dark .section-title{color:var(--color-gray-400)}.modal{background-color:var(--color-white);border-radius:var(--radius-2xl);max-width:92vw;padding:calc(var(--spacing)*3);width:720px;--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal.dark,.utqn.dark .modal{background-color:var(--color-gray-900);color:var(--color-gray-100)}.modal.dark input,.modal.dark select,.modal.dark textarea,.utqn.dark .modal input,.utqn.dark .modal select,.utqn.dark .modal textarea{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-100)}.utqn.dark .modal input::-moz-placeholder,.utqn.dark .modal textarea::-moz-placeholder{color:#9ca3af}.utqn.dark .modal input::placeholder,.utqn.dark .modal textarea::placeholder{color:#9ca3af}.modal.dark input::-moz-placeholder,.modal.dark textarea::-moz-placeholder{color:#9ca3af}.modal.dark input::placeholder,.modal.dark textarea::placeholder{color:#9ca3af}.modal.dark .row label{color:var(--color-gray-400)}.modal.dark .segmented{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.modal.dark .seg-item .seg-radio:checked+.seg-text{background-color:var(--color-gray-700);color:var(--color-gray-100);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-600)}.modal.dark .seg-text{color:var(--color-gray-300)}.editor{border-radius:var(--radius-2xl);max-height:72vh;overflow-y:auto;padding:calc(var(--spacing)*4)}.editor .grid,.editor .row{gap:calc(var(--spacing)*2)}.editor .row{align-items:center}.editor .row label{color:var(--color-gray-500);width:120px}.utqn.dark .editor .row label{color:var(--color-gray-400)}.editor input,.editor select,.editor textarea{background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);&:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-300);--tw-outline-style:none;outline-style:none}}.utqn.dark .editor input,.utqn.dark .editor select,.utqn.dark .editor textarea{background-color:var(--color-gray-800);border-color:var(--color-gray-700);&:focus{--tw-ring-color:var(--color-gray-700)}}.editor .item-row{align-items:center;background-color:var(--color-gray-50);border-radius:var(--radius-md);display:grid;gap:8px;grid-template-columns:1.2fr 1.1fr .9fr 2fr 1fr .9fr 1.3fr auto auto;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}.editor .item-row:hover{background-color:var(--color-gray-100)}.utqn.dark .editor .item-row{background-color:var(--color-gray-800)}.utqn.dark .editor .item-row:hover{background-color:var(--color-gray-700)}.editor .btn{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2)}.row label{color:var(--color-gray-500);width:120px}.utqn.dark .row label{color:var(--color-gray-400)}.panel-actions,.panel-actions-left{align-items:center;display:flex;gap:calc(var(--spacing)*1.5)}.theme-switch{align-items:center;background-color:var(--color-gray-100);border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;display:inline-flex;gap:calc(var(--spacing)*1);padding-block:2px;padding-inline:calc(var(--spacing)*1);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .theme-switch{background-color:var(--color-gray-800)}.theme-btn{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .theme-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.theme-btn.active{background-color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.theme-btn.active,.utqn.dark .theme-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .theme-btn.active{background-color:var(--color-gray-700);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.collapse-btn{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .collapse-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.item+.icon-btn{justify-self:flex-end}.items{align-items:center;margin-top:calc(var(--spacing)*1.5)}.item-wrap{align-items:center;display:flex;gap:8px;justify-content:space-between}.item-wrap .item{flex:1}.item-wrap .icon-btn{opacity:0;transition:opacity .15s ease-in-out}.item-wrap:hover .icon-btn{opacity:1}.item-wrap:focus-within .icon-btn{opacity:1}.quick-add-menu{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;font-family:var(--font-sans);font-size:13px;min-width:160px;padding:calc(var(--spacing)*1.5);position:fixed;z-index:2147483647;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .quick-add-menu,.utqn.dark~.quick-add-menu{background-color:var(--color-gray-900);border-color:var(--color-gray-700);color:var(--color-gray-100);--tw-shadow-color:color-mix(in srgb,#000 40%,transparent);@supports (color:color-mix(in lab,red,red)){--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-black) 40%,transparent) var(--tw-shadow-alpha),transparent)}}.quick-add-item{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-900);display:flex;gap:calc(var(--spacing)*1.5);padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);text-align:left;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:100%;--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.utqn.dark .quick-add-menu .quick-add-item,.utqn.dark~.quick-add-menu .quick-add-item{color:var(--color-gray-100);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}}.utqn.dark .quick-add-menu .icon img.lucide-icon,.utqn.dark~.quick-add-menu .icon img.lucide-icon{filter:invert(1) brightness(1.15) saturate(1.1)}.picker-highlight{cursor:pointer!important;outline:2px dashed #ef4444!important;outline-offset:2px!important}.picker-tip{background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,.1);color:#111827;font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;padding:6px 10px;position:fixed;right:12px;top:12px;z-index:2147483647}.utqn.dark .picker-tip,.utqn.dark~.picker-tip{background:#111827;border-color:#374151;color:#f9fafb}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-leading{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-ease:initial;--tw-duration:initial;--tw-font-weight:initial;--tw-leading:initial;--tw-tracking:initial}}'
  function openAddLinkModal(root, cfg, helpers) {
    for (const n of Array.from(root.querySelectorAll('.modal-mask'))) n.remove()
    const mask = document.createElement('div')
    mask.className = 'modal-mask'
    try {
      mask.style.zIndex = '2147483649'
    } catch (e) {}
    const modal = document.createElement('div')
    modal.className = 'modal'
    try {
      const panel = root.querySelector('.utqn')
      const isDarkPanel =
        panel == null ? void 0 : panel.classList.contains('dark')
      if (isDarkPanel) modal.classList.add('dark')
    } catch (e) {}
    const h2 = document.createElement('h2')
    h2.textContent = '\u6DFB\u52A0\u94FE\u63A5'
    const grid = document.createElement('div')
    grid.className = 'grid'
    try {
      grid.style.gridTemplateColumns = '1fr'
    } catch (e) {}
    const grpRow = document.createElement('div')
    grpRow.className = 'row'
    const grpLabel = document.createElement('label')
    grpLabel.textContent = '\u5206\u7EC4'
    const grpSel = document.createElement('select')
    const firstGroup = (cfg.groups && cfg.groups[0]) || void 0
    const defaultGroup =
      helpers.defaultGroupId || (firstGroup && firstGroup.id) || ''
    for (const g of cfg.groups || []) {
      const o = document.createElement('option')
      o.value = g.id
      o.textContent = g.name
      if (g.id === defaultGroup) o.selected = true
      grpSel.append(o)
    }
    grpRow.append(grpLabel)
    grpRow.append(grpSel)
    const nameRow = document.createElement('div')
    nameRow.className = 'row'
    const nameLabel = document.createElement('label')
    nameLabel.textContent = '\u540D\u79F0'
    const nameInput = document.createElement('input')
    nameInput.value = '\u65B0\u9879'
    nameRow.append(nameLabel)
    nameRow.append(nameInput)
    const iconRow = document.createElement('div')
    iconRow.className = 'row'
    const iconLabel = document.createElement('label')
    iconLabel.textContent = '\u56FE\u6807'
    const iconInput = document.createElement('input')
    iconInput.placeholder =
      'lucide:home | url:https://... | emoji | favicon[:16|32|64]'
    iconRow.append(iconLabel)
    iconRow.append(iconInput)
    const urlRow = document.createElement('div')
    urlRow.className = 'row'
    const urlLabel = document.createElement('label')
    urlLabel.textContent = 'URL'
    const urlInput = document.createElement('input')
    urlInput.placeholder = 'https://...'
    urlInput.value = '/'
    urlRow.append(urlLabel)
    urlRow.append(urlInput)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u6253\u5F00\u65B9\u5F0F'
    let openValue = helpers.defaultOpen || 'same-tab'
    const openRadios = createOpenModeRadios(openValue, (m) => {
      openValue = m
    })
    openRow.append(openLabel)
    openRow.append(openRadios)
    const quickRow = document.createElement('div')
    quickRow.className = 'row'
    const addCurrentBtn = document.createElement('button')
    addCurrentBtn.className = 'btn btn-secondary'
    addCurrentBtn.textContent = '\u6DFB\u52A0\u5F53\u524D\u7F51\u9875'
    const pickLinksBtn = document.createElement('button')
    pickLinksBtn.className = 'btn btn-secondary'
    pickLinksBtn.textContent =
      '\u4ECE\u5F53\u524D\u7F51\u9875\u91C7\u96C6\u94FE\u63A5'
    quickRow.append(addCurrentBtn)
    quickRow.append(pickLinksBtn)
    addCurrentBtn.addEventListener('click', () => {
      try {
        nameInput.value = document.title || '\u5F53\u524D\u7F51\u9875'
        urlInput.value = location.href
      } catch (e) {}
    })
    pickLinksBtn.addEventListener('click', () => {
      try {
        const ensurePickerStylesIn = (r) => {
          var _a
          const has =
            (_a = r.querySelector) == null
              ? void 0
              : _a.call(r, '#utqn-picker-styles')
          if (has) return
          const st = document.createElement('style')
          st.id = 'utqn-picker-styles'
          st.textContent =
            '.utqn-picker-highlight{outline:2px dashed #ef4444!important;outline-offset:0!important;box-shadow:0 0 0 2px rgba(239,68,68,.35) inset!important;cursor:pointer!important;}.utqn-picker-tip{position:fixed;top:12px;right:12px;z-index:2147483647;background:#fff;color:#111827;border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;box-shadow:0 10px 20px rgba(0,0,0,0.1);font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";}'
          if (r instanceof Document) {
            r.head.append(st)
          } else {
            r.append(st)
          }
        }
        ensurePickerStylesIn(document)
        modal.style.display = 'none'
        mask.remove()
        const tip = document.createElement('div')
        tip.className = 'utqn-picker-tip'
        tip.textContent =
          '\u70B9\u51FB\u7EA2\u6846\u94FE\u63A5\u6DFB\u52A0\uFF0CESC \u53D6\u6D88'
        document.body.append(tip)
        const anchors = querySelectorAllDeep(document, 'a[href]').filter(
          (el) => {
            const href = (el.getAttribute('href') || '').trim()
            if (!href || href === '#') return false
            let u
            try {
              u = new URL(href, location.href)
            } catch (e) {
              return false
            }
            return u.protocol === 'http:' || u.protocol === 'https:'
          }
        )
        const handlers = []
        const panelEl = root.querySelector('.utqn')
        const prevPanelDisplay =
          panelEl instanceof HTMLElement ? panelEl.style.display || '' : ''
        if (panelEl instanceof HTMLElement) panelEl.style.display = 'none'
        const cleanup = () => {
          for (const { el, fn } of handlers)
            el.removeEventListener('click', fn, true)
          for (const a of anchors) a.classList.remove('utqn-picker-highlight')
          try {
            tip.remove()
          } catch (e) {}
          modal.style.display = ''
          root.append(mask)
          if (panelEl instanceof HTMLElement)
            panelEl.style.display = prevPanelDisplay
          try {
            const ov = document.querySelector('#utqn-picker-overlay')
            ov == null ? void 0 : ov.remove()
          } catch (e) {}
        }
        const onEsc = (ev) => {
          if (ev.key === 'Escape') {
            document.removeEventListener('keydown', onEsc, true)
            cleanup()
          }
        }
        document.addEventListener('keydown', onEsc, true)
        for (const a of anchors) {
          const rn = a.getRootNode()
          if (rn instanceof Document || rn instanceof ShadowRoot)
            ensurePickerStylesIn(rn)
          a.classList.add('utqn-picker-highlight')
        }
        const overlay = document.createElement('div')
        overlay.id = 'utqn-picker-overlay'
        overlay.style.position = 'fixed'
        overlay.style.inset = '0'
        overlay.style.zIndex = '2147483647'
        overlay.style.background = 'transparent'
        overlay.style.cursor = 'crosshair'
        const onOverlayClick = (ev) => {
          var _a
          ev.preventDefault()
          ev.stopPropagation()
          ;(_a = ev.stopImmediatePropagation) == null ? void 0 : _a.call(ev)
          let picked
          try {
            const x = ev.clientX
            const y = ev.clientY
            const seen = /* @__PURE__ */ new Set()
            const search = (r) => {
              var _a2
              const arr = r.elementsFromPoint(x, y)
              for (const el of arr) {
                if (el === overlay) continue
                if (seen.has(el)) continue
                seen.add(el)
                const a =
                  (_a2 = el.closest) == null ? void 0 : _a2.call(el, 'a[href]')
                if (a instanceof HTMLAnchorElement) return a
                const sr = el.shadowRoot
                if (sr) {
                  const inner = search(sr)
                  if (inner) return inner
                }
              }
              return void 0
            }
            picked = search(document)
            if (picked) {
              const href = picked.href
              const text = (picked.textContent || '').trim() || href
              nameInput.value = text
              urlInput.value = href
            }
          } catch (e) {}
          if (picked) {
            document.removeEventListener('keydown', onEsc, true)
            cleanup()
          }
        }
        overlay.addEventListener('click', onOverlayClick, true)
        handlers.push({ el: overlay, fn: onOverlayClick })
        document.body.append(overlay)
      } catch (e) {}
    })
    const actions = document.createElement('div')
    actions.className = 'row'
    const saveBtn = document.createElement('button')
    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = '\u6DFB\u52A0'
    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'btn btn-secondary'
    cancelBtn.textContent = '\u53D6\u6D88'
    saveBtn.addEventListener('click', () => {
      const gid = grpSel.value
      const grp = (cfg.groups || []).find((g) => g.id === gid)
      if (!grp) return
      const rawIcon = iconInput.value.trim()
      const finalIcon = rawIcon || void 0
      const it = {
        id: Math.random().toString(36).slice(2, 10),
        name: nameInput.value.trim() || '\u65B0\u9879',
        icon: finalIcon,
        type: 'url',
        data: urlInput.value.trim() || '/',
        openIn: openValue,
      }
      grp.items.push(it)
      try {
        helpers.saveConfig(cfg)
      } catch (e) {}
      try {
        helpers.rerender(root, cfg)
      } catch (e) {}
      try {
        mask.remove()
      } catch (e) {}
    })
    cancelBtn.addEventListener('click', () => {
      try {
        mask.remove()
      } catch (e) {}
    })
    actions.append(saveBtn)
    actions.append(cancelBtn)
    grid.append(grpRow)
    grid.append(nameRow)
    grid.append(iconRow)
    grid.append(urlRow)
    grid.append(openRow)
    grid.append(quickRow)
    modal.append(h2)
    modal.append(grid)
    modal.append(actions)
    mask.append(modal)
    root.append(mask)
  }
  function getFaviconUrl(href, size = 64) {
    try {
      const domain = new URL(href, location.origin).origin
      const url =
        'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url='
          .concat(domain, '&size=')
          .concat(size)
      const wrapUrl = 'https://wsrv.nl/?w='
        .concat(size, '&h=')
        .concat(size, '&url=')
        .concat(encodeURIComponent(url), '&default=')
        .concat(defaultFavicons[size])
      return wrapUrl
    } catch (error) {
      console.error('Error generating favicon URL:', error)
      return decodeURIComponent(defaultFavicons[size])
    }
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
  var defaultFavicons = {
    16: defaultFavicon16,
    32: defaultFavicon32,
    64: defaultFavicon64,
  }
  var KEY = 'utqn_config'
  var SITE_KEY = location.hostname || ''
  var sitePref
  var lastSaved = ''
  var EDGE_DEFAULT_WIDTH = 3
  var EDGE_DEFAULT_HEIGHT = 60
  var EDGE_DEFAULT_OPACITY = 0.6
  var EDGE_DEFAULT_COLOR_LIGHT = '#1A73E8'
  var EDGE_DEFAULT_COLOR_DARK = '#8AB4F8'
  var EDGE_DEFAULT_HIDDEN = false
  var POSITION_DEFAULT = 'right-top'
  var OPEN_DEFAULT = 'same-tab'
  var THEME_DEFAULT = 'system'
  var PINNED_DEFAULT = false
  var ENABLED_DEFAULT = true
  var tempOpen = false
  var tempClosed = false
  var menuIds = []
  function uid() {
    return Math.random().toString(36).slice(2, 10)
  }
  function matchPattern(url, pattern) {
    try {
      const t = String(pattern || '')
      if (t.startsWith('/') && t.lastIndexOf('/') > 0) {
        const last = t.lastIndexOf('/')
        const body = t.slice(1, last)
        const flags = t.slice(last + 1)
        const re2 = new RegExp(body, flags)
        return re2.test(url)
      }
      const esc = t
        .replaceAll(/[.+^${}()|[\]\\]/g, '\\$&')
        .replaceAll('*', '.*')
      const re = new RegExp('^' + esc + '$')
      return re.test(url)
    } catch (e) {
      return false
    }
  }
  function initSitePref(cfg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k
    if (!cfg.sitePrefs) cfg.sitePrefs = {}
    const stored = cfg.sitePrefs[SITE_KEY] || {}
    const cur = {
      position: (_a = stored.position) != null ? _a : POSITION_DEFAULT,
      defaultOpen: (_b = stored.defaultOpen) != null ? _b : OPEN_DEFAULT,
      theme: (_c = stored.theme) != null ? _c : THEME_DEFAULT,
      pinned: (_d = stored.pinned) != null ? _d : PINNED_DEFAULT,
      enabled: (_e = stored.enabled) != null ? _e : ENABLED_DEFAULT,
      edgeWidth: (_f = stored.edgeWidth) != null ? _f : EDGE_DEFAULT_WIDTH,
      edgeHeight: (_g = stored.edgeHeight) != null ? _g : EDGE_DEFAULT_HEIGHT,
      edgeOpacity:
        (_h = stored.edgeOpacity) != null ? _h : EDGE_DEFAULT_OPACITY,
      edgeColorLight:
        (_i = stored.edgeColorLight) != null ? _i : EDGE_DEFAULT_COLOR_LIGHT,
      edgeColorDark:
        (_j = stored.edgeColorDark) != null ? _j : EDGE_DEFAULT_COLOR_DARK,
      edgeHidden: (_k = stored.edgeHidden) != null ? _k : EDGE_DEFAULT_HIDDEN,
    }
    sitePref = cur
    cfg.sitePrefs[SITE_KEY] = cur
  }
  var iconCache = /* @__PURE__ */ new Map()
  function renderIcon(s) {
    const span = document.createElement('span')
    span.className = 'icon'
    let t = String(s || '').trim()
    if (!t) t = 'lucide:link'
    if (t.startsWith('lucide:')) {
      const k = t.split(':')[1]
      injectLucideIcon(span, k)
      return span
    }
    if (t.startsWith('url:')) {
      const url = t.slice(4)
      injectImageAsData(span, url)
      return span
    }
    if (t.startsWith('svg:')) {
      try {
        const svg = t.slice(4)
        const url =
          'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
        const img = document.createElement('img')
        img.width = 16
        img.height = 16
        img.style.objectFit = 'contain'
        img.src = url
        clearChildren(span)
        span.append(img)
      } catch (e) {}
      return span
    }
    span.textContent = t
    return span
  }
  function injectLucideIcon(container, name) {
    try {
      const cached = iconCache.get(name)
      if (cached) {
        const img = document.createElement('img')
        img.width = 16
        img.height = 16
        img.style.objectFit = 'contain'
        img.className = 'lucide-icon'
        img.src = cached
        clearChildren(container)
        container.append(img)
        return
      }
    } catch (e) {}
    try {
      const url =
        'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/'.concat(
          name,
          '.svg'
        )
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload(res) {
          try {
            const svg = String(res.responseText || '')
            if (!svg) return
            const url2 =
              'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
            iconCache.set(name, url2)
            const img = document.createElement('img')
            img.width = 16
            img.height = 16
            img.style.objectFit = 'contain'
            img.className = 'lucide-icon'
            img.src = url2
            clearChildren(container)
            container.append(img)
          } catch (e) {}
        },
      })
    } catch (e) {}
  }
  function injectImageAsData(container, url) {
    try {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        onload(res) {
          try {
            const blob = res.response
            if (!blob) return
            const reader = new FileReader()
            reader.addEventListener('load', () => {
              const img = document.createElement('img')
              img.width = 16
              img.height = 16
              img.style.objectFit = 'contain'
              img.src = String(reader.result || '')
              clearChildren(container)
              container.append(img)
            })
            reader.readAsDataURL(blob)
          } catch (e) {}
        },
      })
    } catch (e) {}
  }
  function openItem(it, group, cfg) {
    const mode = it.openIn || group.defaultOpen || sitePref.defaultOpen
    if (it.type === 'url') {
      const url = new URL(it.data, location.href).href
      if (mode === 'new-tab') {
        window.open(url, '_blank', 'noopener')
      } else {
        location.assign(url)
      }
      return
    }
    try {
      const s = document.createElement('script')
      s.textContent = '(function(){\n'.concat(it.data, '\n})();')
      ;(document.documentElement || document.body).append(s)
      s.remove()
    } catch (e) {}
  }
  async function loadConfig() {
    try {
      const v = await GM.getValue(KEY, '')
      if (v) {
        const raw = JSON.parse(String(v) || '{}')
        const host2 = location.hostname || ''
        const ensureGroup = (gg) => ({
          id: String((gg == null ? void 0 : gg.id) || uid()),
          name: String((gg == null ? void 0 : gg.name) || host2),
          icon: String((gg == null ? void 0 : gg.icon) || 'lucide:folder'),
          match: Array.isArray(gg == null ? void 0 : gg.match)
            ? gg.match
            : ['*://' + host2 + '/*'],
          defaultOpen:
            (gg == null ? void 0 : gg.defaultOpen) === 'new-tab'
              ? 'new-tab'
              : 'same-tab',
          items: Array.isArray(gg == null ? void 0 : gg.items) ? gg.items : [],
          collapsed: Boolean(gg == null ? void 0 : gg.collapsed),
          itemsPerRow: Number.isFinite(gg == null ? void 0 : gg.itemsPerRow)
            ? gg.itemsPerRow
            : 1,
          hidden: Boolean(gg == null ? void 0 : gg.hidden),
        })
        const groupsArr = Array.isArray(raw == null ? void 0 : raw.groups)
          ? raw.groups.map((x) => ensureGroup(x))
          : []
        if (groupsArr.length === 0) {
          const g2 = ensureGroup({})
          g2.items = [
            {
              id: uid(),
              name: '\u9996\u9875',
              icon: 'lucide:home',
              type: 'url',
              data: '/',
              openIn: 'same-tab',
              hidden: false,
            },
          ]
          groupsArr.push(g2)
        }
        const cfg = {
          global: (raw == null ? void 0 : raw.global) || {},
          sitePrefs: (raw == null ? void 0 : raw.sitePrefs) || {},
          groups: groupsArr,
        }
        return cfg
      }
    } catch (e) {}
    const host = location.hostname || ''
    const g = {
      id: uid(),
      name: host,
      icon: 'lucide:folder',
      match: ['*://' + host + '/*'],
      defaultOpen: 'same-tab',
      items: [
        {
          id: uid(),
          name: '\u9996\u9875',
          icon: 'lucide:home',
          type: 'url',
          data: '/',
          openIn: 'same-tab',
          hidden: false,
        },
      ],
      collapsed: false,
      itemsPerRow: 1,
      hidden: false,
    }
    return {
      global: {},
      groups: [g],
    }
  }
  async function saveConfig(cfg) {
    var _a, _b, _c, _d, _e, _f
    try {
      const sp = {}
      if (sitePref.position !== POSITION_DEFAULT)
        sp.position = sitePref.position
      if (sitePref.defaultOpen !== OPEN_DEFAULT)
        sp.defaultOpen = sitePref.defaultOpen
      if ((sitePref.theme || THEME_DEFAULT) !== THEME_DEFAULT)
        sp.theme = sitePref.theme
      if (sitePref.pinned !== PINNED_DEFAULT) sp.pinned = sitePref.pinned
      if (sitePref.enabled !== ENABLED_DEFAULT) sp.enabled = sitePref.enabled
      if (
        ((_a = sitePref.edgeWidth) != null ? _a : EDGE_DEFAULT_WIDTH) !==
        EDGE_DEFAULT_WIDTH
      )
        sp.edgeWidth = sitePref.edgeWidth
      if (
        ((_b = sitePref.edgeHeight) != null ? _b : EDGE_DEFAULT_HEIGHT) !==
        EDGE_DEFAULT_HEIGHT
      )
        sp.edgeHeight = sitePref.edgeHeight
      if (
        ((_c = sitePref.edgeOpacity) != null ? _c : EDGE_DEFAULT_OPACITY) !==
        EDGE_DEFAULT_OPACITY
      )
        sp.edgeOpacity = sitePref.edgeOpacity
      if (
        ((_d = sitePref.edgeColorLight) != null
          ? _d
          : EDGE_DEFAULT_COLOR_LIGHT) !== EDGE_DEFAULT_COLOR_LIGHT
      )
        sp.edgeColorLight = sitePref.edgeColorLight
      if (
        ((_e = sitePref.edgeColorDark) != null
          ? _e
          : EDGE_DEFAULT_COLOR_DARK) !== EDGE_DEFAULT_COLOR_DARK
      )
        sp.edgeColorDark = sitePref.edgeColorDark
      if (
        ((_f = sitePref.edgeHidden) != null ? _f : EDGE_DEFAULT_HIDDEN) !==
        EDGE_DEFAULT_HIDDEN
      )
        sp.edgeHidden = sitePref.edgeHidden
      const nextSitePrefs = __spreadValues({}, cfg.sitePrefs)
      if (Object.keys(sp).length > 0) nextSitePrefs[SITE_KEY] = sp
      else delete nextSitePrefs[SITE_KEY]
      const next = __spreadProps(__spreadValues({}, cfg), {
        sitePrefs: nextSitePrefs,
      })
      const s = JSON.stringify(next)
      if (s === lastSaved) return
      lastSaved = s
      await GM.setValue(KEY, s)
    } catch (e) {}
  }
  function createRoot() {
    const host = document.createElement('div')
    const root = host.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = style_default
    root.append(style)
    document.documentElement.append(host)
    return { host, root }
  }
  function place(el, cfg) {
    const p = sitePref.position
    el.style.position = 'fixed'
    el.style.inset = 'auto'
    switch (p) {
      case 'right-top': {
        el.style.top = '0'
        el.style.right = '0'
        break
      }
      case 'left-top': {
        el.style.top = '0'
        el.style.left = '0'
        break
      }
      case 'left-bottom': {
        el.style.bottom = '0'
        el.style.left = '0'
        break
      }
      case 'right-bottom': {
        el.style.bottom = '0'
        el.style.right = '0'
        break
      }
      case 'left-center': {
        el.style.top = '50%'
        el.style.left = '0'
        el.style.transform = 'translateY(-50%)'
        break
      }
      case 'right-center': {
        el.style.top = '50%'
        el.style.right = '0'
        el.style.transform = 'translateY(-50%)'
        break
      }
      case 'top-left': {
        el.style.top = '0'
        el.style.left = '0'
        break
      }
      case 'top-center': {
        el.style.top = '0'
        el.style.left = '50%'
        el.style.transform = 'translateX(-50%)'
        break
      }
      case 'top-right': {
        el.style.top = '0'
        el.style.right = '0'
        break
      }
      case 'bottom-left': {
        el.style.bottom = '0'
        el.style.left = '0'
        break
      }
      case 'bottom-center': {
        el.style.bottom = '0'
        el.style.left = '50%'
        el.style.transform = 'translateX(-50%)'
        break
      }
      case 'bottom-right': {
        el.style.bottom = '0'
        el.style.right = '0'
        break
      }
    }
  }
  function isHorizontalPos(pos) {
    return pos.startsWith('top-') || pos.startsWith('bottom-')
  }
  function isRightSide(pos) {
    return pos.startsWith('right-')
  }
  function isTopSide(pos) {
    return pos.startsWith('top-')
  }
  function scorePattern(url, pattern) {
    const neg = pattern.startsWith('!')
    const pat = neg ? pattern.slice(1) : pattern
    if (!matchPattern(url, pat)) return -1
    if (pat.startsWith('/') && pat.lastIndexOf('/') > 0) {
      const last = pat.lastIndexOf('/')
      return pat.slice(1, last).length
    }
    return pat.replaceAll('*', '').length
  }
  function groupScore(url, g) {
    let max = -1
    for (const p of g.match) {
      const neg = p.startsWith('!')
      const pat = neg ? p.slice(1) : p
      if (neg) {
        if (matchPattern(url, pat)) return -1
        continue
      }
      const s = scorePattern(url, p)
      if (s > max) max = s
    }
    return max
  }
  function currentGroups(cfg) {
    const url = location.href
    return cfg.groups
      .map((g) => ({ g, s: groupScore(url, g) }))
      .filter((x) => x.s >= 0 && !x.g.hidden)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.g)
  }
  function isDarkTheme(cfg) {
    const t = sitePref.theme || THEME_DEFAULT
    if (t === 'dark') return true
    if (t === 'light') return false
    try {
      return (
        globalThis.window !== void 0 &&
        Boolean(globalThis.matchMedia) &&
        globalThis.matchMedia('(prefers-color-scheme: dark)').matches
      )
    } catch (e) {
      return false
    }
  }
  function renderPanel(root, cfg, animIn) {
    const wrapper = document.createElement('div')
    wrapper.className = 'utqn' + (isDarkTheme(cfg) ? ' dark' : '')
    const panel = document.createElement('div')
    panel.className = 'panel'
    const collapseRow = document.createElement('div')
    collapseRow.className = 'header'
    const leftActions = document.createElement('div')
    leftActions.className = 'panel-actions-left'
    const rightActions = document.createElement('div')
    rightActions.className = 'panel-actions'
    const pos = sitePref.position
    const isRight = isRightSide(pos)
    const isHoriz = isHorizontalPos(pos)
    const isTop = isTopSide(pos)
    if (animIn)
      panel.classList.add(
        isHoriz
          ? isTop
            ? 'anim-in-top'
            : 'anim-in-bottom'
          : isRight
            ? 'anim-in-right'
            : 'anim-in-left'
      )
    const closeBtn = document.createElement('button')
    closeBtn.className = 'collapse-btn'
    closeBtn.append(renderIcon('lucide:x'))
    closeBtn.title = '\u5173\u95ED'
    closeBtn.addEventListener('click', () => {
      collapseWithAnim(root, cfg)
    })
    const plusBtn = document.createElement('button')
    plusBtn.className = 'icon-btn'
    plusBtn.append(renderIcon('lucide:plus'))
    plusBtn.title = '\u6DFB\u52A0'
    plusBtn.addEventListener('click', (ev) => {
      ev.stopPropagation()
      openQuickAddMenu(root, cfg, plusBtn)
    })
    const settingsBtn = document.createElement('button')
    settingsBtn.className = 'icon-btn'
    settingsBtn.append(renderIcon('lucide:settings'))
    settingsBtn.title = '\u8BBE\u7F6E'
    settingsBtn.addEventListener('click', () => {
      openEditor(root, cfg)
    })
    const pinBtn = document.createElement('button')
    pinBtn.className = 'icon-btn'
    pinBtn.append(renderIcon(sitePref.pinned ? 'lucide:pin' : 'lucide:pin-off'))
    pinBtn.title = sitePref.pinned
      ? '\u53D6\u6D88\u56FA\u5B9A'
      : '\u56FA\u5B9A\u663E\u793A'
    pinBtn.classList.toggle('active', Boolean(sitePref.pinned))
    pinBtn.addEventListener('click', () => {
      sitePref.pinned = !sitePref.pinned
      void saveConfig(cfg)
      pinBtn.classList.toggle('active', Boolean(sitePref.pinned))
      pinBtn.title = sitePref.pinned
        ? '\u53D6\u6D88\u56FA\u5B9A'
        : '\u56FA\u5B9A\u663E\u793A'
      clearChildren(pinBtn)
      pinBtn.append(
        renderIcon(sitePref.pinned ? 'lucide:pin' : 'lucide:pin-off')
      )
    })
    rightActions.append(plusBtn)
    rightActions.append(settingsBtn)
    rightActions.append(pinBtn)
    rightActions.append(closeBtn)
    collapseRow.append(leftActions)
    collapseRow.append(rightActions)
    panel.append(collapseRow)
    const matched = currentGroups(cfg)
    const groupsToShow = matched
    const defOpen = sitePref.defaultOpen || 'same-tab'
    for (const g of groupsToShow) {
      const div = document.createElement('div')
      div.className = 'divider'
      panel.append(div)
      const section = document.createElement('div')
      section.className = 'section'
      section.dataset.gid = g.id
      const header = document.createElement('div')
      header.className = 'header'
      const title = document.createElement('div')
      title.className = 'title'
      title.append(renderIcon(g.icon))
      const nameSpan = document.createElement('span')
      nameSpan.textContent = g.name
      title.append(nameSpan)
      header.append(title)
      title.addEventListener('click', () => {
        g.collapsed = !g.collapsed
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      const actions = document.createElement('div')
      actions.className = 'header-actions'
      const addLinkBtn = document.createElement('button')
      addLinkBtn.className = 'icon-btn'
      addLinkBtn.append(renderIcon('lucide:plus'))
      addLinkBtn.title = '\u6DFB\u52A0\u94FE\u63A5\u5230\u6B64\u5206\u7EC4'
      addLinkBtn.addEventListener('click', (e) => {
        var _a
        e.stopPropagation()
        openAddLinkModal(root, cfg, {
          saveConfig(c) {
            void saveConfig(c)
          },
          rerender(r, c) {
            rerender(r, c)
          },
          defaultOpen: (_a = g.defaultOpen) != null ? _a : defOpen,
          defaultGroupId: g.id,
        })
      })
      const hideGroupBtn = document.createElement('button')
      hideGroupBtn.className = 'icon-btn'
      hideGroupBtn.append(renderIcon('lucide:eye-off'))
      hideGroupBtn.title = '\u9690\u85CF\u5206\u7EC4'
      hideGroupBtn.addEventListener('click', () => {
        g.hidden = true
        void saveConfig(cfg)
        const sec = panel.querySelector('.section[data-gid="' + g.id + '"]')
        if (sec) sec.style.display = 'none'
      })
      const editBtn = document.createElement('button')
      editBtn.className = 'icon-btn'
      editBtn.append(renderIcon('lucide:edit-3'))
      editBtn.title = '\u7F16\u8F91'
      editBtn.addEventListener('click', () => {
        openEditor(root, cfg, g.id)
      })
      const toggleBtn = document.createElement('button')
      toggleBtn.className = 'icon-btn'
      toggleBtn.append(
        renderIcon(g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down')
      )
      toggleBtn.title = g.collapsed ? '\u5C55\u5F00' : '\u6298\u53E0'
      toggleBtn.addEventListener('click', () => {
        g.collapsed = !g.collapsed
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      actions.append(addLinkBtn)
      actions.append(editBtn)
      actions.append(hideGroupBtn)
      actions.append(toggleBtn)
      header.append(actions)
      section.append(header)
      if (!g.collapsed && g.items.length > 0) {
        const items = document.createElement('div')
        items.className = 'items'
        items.style.setProperty('--cols', String(g.itemsPerRow || 1))
        for (const it of g.items) {
          if (it.hidden) continue
          const wrap = document.createElement('div')
          wrap.className = 'item-wrap'
          wrap.dataset.itemId = it.id
          const a = document.createElement('a')
          a.className = 'item'
          if (it.type === 'url') {
            const url = new URL(it.data, location.href).href
            a.href = url
            const mode = it.openIn || g.defaultOpen || sitePref.defaultOpen
            if (mode === 'new-tab') {
              a.target = '_blank'
              a.rel = 'noopener'
            }
          } else {
            a.href = '#'
            a.addEventListener('click', (e) => {
              e.preventDefault()
              openItem(it, g, cfg)
            })
          }
          {
            const rawIcon = String(it.icon || '')
            let iconStr = rawIcon
            if (rawIcon.startsWith('favicon')) {
              const param = rawIcon.split(':')[1]
              const sizeNum = param ? Number.parseInt(param, 10) : 64
              const size = sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
              const targetUrl =
                it.type === 'url'
                  ? new URL(it.data, location.href).href
                  : location.href
              try {
                iconStr = 'url:' + getFaviconUrl(targetUrl, size)
              } catch (e) {}
            }
            a.append(renderIcon(iconStr))
          }
          const t = document.createElement('span')
          t.textContent = it.name
          a.append(t)
          const hideBtn = document.createElement('button')
          hideBtn.className = 'icon-btn'
          hideBtn.append(renderIcon('lucide:eye-off'))
          hideBtn.title = '\u9690\u85CF\u8BE5\u5BFC\u822A'
          hideBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            it.hidden = true
            void saveConfig(cfg)
            const sec = panel.querySelector('.section[data-gid="' + g.id + '"]')
            const targetWrap =
              sec == null
                ? void 0
                : sec.querySelector('.item-wrap[data-item-id="' + it.id + '"]')
            if (targetWrap) targetWrap.remove()
          })
          wrap.append(a)
          wrap.append(hideBtn)
          items.append(wrap)
        }
        section.append(items)
      }
      panel.append(section)
    }
    wrapper.append(panel)
    wrapper.addEventListener('mouseenter', () => {
      try {
        if (collapseTimer) clearTimeout(collapseTimer)
      } catch (e) {}
    })
    wrapper.addEventListener('mouseleave', () => {
      if (!sitePref.pinned && !suppressCollapse) scheduleAutoCollapse(root, cfg)
    })
    place(wrapper, cfg)
    root.append(wrapper)
  }
  function copyItemToGroup(cfg, fromGroupId, itemId, toGroupId) {
    const from = cfg.groups.find((g) => g.id === fromGroupId)
    const to = cfg.groups.find((g) => g.id === toGroupId)
    if (!from || !to) return
    const it = from.items.find((x) => x.id === itemId)
    if (!it) return
    const dup = __spreadProps(__spreadValues({}, it), { id: uid() })
    to.items.push(dup)
  }
  function openEditor(root, cfg, activeGroupId) {
    var _a, _b, _c
    for (const n of Array.from(root.querySelectorAll('.modal-mask'))) n.remove()
    const mask = document.createElement('div')
    mask.className = 'modal-mask'
    try {
      mask.style.zIndex = '2147483648'
    } catch (e) {}
    const modal = document.createElement('div')
    modal.className = 'modal editor'
    const h2 = document.createElement('h2')
    h2.textContent = '\u5FEB\u901F\u5BFC\u822A\u8BBE\u7F6E'
    const grid = document.createElement('div')
    grid.className = 'grid'
    const posRow = document.createElement('div')
    posRow.className = 'row'
    const posLabel = document.createElement('label')
    posLabel.textContent = '\u4F4D\u7F6E'
    const posSel = document.createElement('select')
    for (const p of [
      'right-top',
      'right-center',
      'right-bottom',
      'left-top',
      'left-center',
      'left-bottom',
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ]) {
      const o = document.createElement('option')
      o.value = p
      o.textContent = p
      if (sitePref.position === p) o.selected = true
      posSel.append(o)
    }
    posSel.addEventListener('change', () => {
      sitePref.position = posSel.value
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    posRow.append(posLabel)
    posRow.append(posSel)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F'
    let siteOpen = sitePref.defaultOpen
    const openRadios1 = createOpenModeRadios(siteOpen, (m) => {
      siteOpen = m
      sitePref.defaultOpen = m
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    openRow.append(openLabel)
    openRow.append(openRadios1)
    grid.append(posRow)
    grid.append(openRow)
    const themeRow = document.createElement('div')
    themeRow.className = 'row'
    const themeLabel = document.createElement('label')
    themeLabel.textContent = '\u4E3B\u9898'
    const themeSel = document.createElement('select')
    for (const th of ['system', 'light', 'dark']) {
      const o = document.createElement('option')
      o.value = th
      o.textContent =
        th === 'system'
          ? '\u7CFB\u7EDF'
          : th === 'light'
            ? '\u6D45\u8272'
            : '\u6DF1\u8272'
      if ((sitePref.theme || THEME_DEFAULT) === th) o.selected = true
      themeSel.append(o)
    }
    themeSel.addEventListener('change', () => {
      sitePref.theme = themeSel.value
      void saveConfig(cfg)
      updateThemeUI(root, cfg)
    })
    themeRow.append(themeLabel)
    themeRow.append(themeSel)
    grid.append(themeRow)
    const syncRow = document.createElement('div')
    syncRow.className = 'row'
    const syncLabel = document.createElement('label')
    syncLabel.textContent = '\u540C\u6B65 URL'
    const syncInput = document.createElement('input')
    syncInput.value = cfg.global.syncUrl || ''
    const syncBtn = document.createElement('button')
    syncBtn.className = 'btn'
    syncBtn.textContent = '\u4ECE\u8FDC\u7A0B\u62C9\u53D6'
    syncBtn.addEventListener('click', async () => {
      const u = syncInput.value.trim()
      if (!u) return
      try {
        const res = await fetch(u, { credentials: 'omit' })
        const text = await res.text()
        const obj = JSON.parse(text)
        if (obj && obj.global && obj.groups) {
          cfg.global = obj.global
          cfg.groups = obj.groups
          void saveConfig(cfg)
          rerender(root, cfg)
        }
      } catch (e) {}
    })
    syncInput.addEventListener('change', () => {
      cfg.global.syncUrl = syncInput.value.trim() || void 0
      void saveConfig(cfg)
    })
    syncRow.append(syncLabel)
    syncRow.append(syncInput)
    syncRow.append(syncBtn)
    const edgeRow = document.createElement('div')
    edgeRow.className = 'row'
    const edgeLabel = document.createElement('label')
    edgeLabel.textContent = '\u7AD6\u7EBF\u5916\u89C2'
    const widthInput = document.createElement('input')
    widthInput.type = 'number'
    widthInput.min = '1'
    widthInput.max = '24'
    widthInput.value = String(
      (_a = sitePref.edgeWidth) != null ? _a : EDGE_DEFAULT_WIDTH
    )
    const heightInput = document.createElement('input')
    heightInput.type = 'number'
    heightInput.min = '24'
    heightInput.max = '320'
    heightInput.value = String(
      (_b = sitePref.edgeHeight) != null ? _b : EDGE_DEFAULT_HEIGHT
    )
    const opacityInput = document.createElement('input')
    opacityInput.type = 'number'
    opacityInput.min = '0'
    opacityInput.max = '1'
    opacityInput.step = '0.05'
    opacityInput.value = String(
      (_c = sitePref.edgeOpacity) != null ? _c : EDGE_DEFAULT_OPACITY
    )
    const lightColorInput = document.createElement('input')
    lightColorInput.type = 'color'
    lightColorInput.value = String(
      sitePref.edgeColorLight || EDGE_DEFAULT_COLOR_LIGHT
    )
    const darkColorInput = document.createElement('input')
    darkColorInput.type = 'color'
    darkColorInput.value = String(
      sitePref.edgeColorDark || EDGE_DEFAULT_COLOR_DARK
    )
    widthInput.addEventListener('change', () => {
      const v = Math.max(1, Math.min(24, Number.parseInt(widthInput.value, 10)))
      const pref = sitePref
      pref.edgeWidth = v
      void saveConfig(cfg)
      if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
    })
    heightInput.addEventListener('change', () => {
      const v = Math.max(
        24,
        Math.min(320, Number.parseInt(heightInput.value, 10))
      )
      const pref = sitePref
      pref.edgeHeight = v
      void saveConfig(cfg)
      if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
    })
    opacityInput.addEventListener('change', () => {
      const v = Math.max(0, Math.min(1, Number.parseFloat(opacityInput.value)))
      const pref = sitePref
      pref.edgeOpacity = v
      void saveConfig(cfg)
      if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
    })
    lightColorInput.addEventListener('change', () => {
      const pref = sitePref
      pref.edgeColorLight = lightColorInput.value
      void saveConfig(cfg)
      if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
    })
    darkColorInput.addEventListener('change', () => {
      const pref = sitePref
      pref.edgeColorDark = darkColorInput.value
      void saveConfig(cfg)
      if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
    })
    edgeRow.append(edgeLabel)
    edgeRow.append(widthInput)
    edgeRow.append(heightInput)
    edgeRow.append(opacityInput)
    edgeRow.append(lightColorInput)
    edgeRow.append(darkColorInput)
    const edgeReset = document.createElement('button')
    edgeReset.className = 'btn mini'
    edgeReset.textContent = '\u91CD\u7F6E\u9ED8\u8BA4'
    edgeReset.addEventListener('click', () => {
      const pref = sitePref
      pref.edgeWidth = EDGE_DEFAULT_WIDTH
      pref.edgeHeight = EDGE_DEFAULT_HEIGHT
      pref.edgeOpacity = EDGE_DEFAULT_OPACITY
      pref.edgeColorLight = EDGE_DEFAULT_COLOR_LIGHT
      pref.edgeColorDark = EDGE_DEFAULT_COLOR_DARK
      widthInput.value = String(EDGE_DEFAULT_WIDTH)
      heightInput.value = String(EDGE_DEFAULT_HEIGHT)
      opacityInput.value = String(EDGE_DEFAULT_OPACITY)
      lightColorInput.value = EDGE_DEFAULT_COLOR_LIGHT
      darkColorInput.value = EDGE_DEFAULT_COLOR_DARK
      void saveConfig(cfg)
      if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
    })
    edgeRow.append(edgeReset)
    const panelCtrlRow = document.createElement('div')
    panelCtrlRow.className = 'row'
    const panelCtrlLabel = document.createElement('label')
    panelCtrlLabel.textContent = '\u9762\u677F\u63A7\u5236'
    const pinBtn2 = document.createElement('button')
    pinBtn2.className = 'btn mini'
    pinBtn2.textContent = '\u56FA\u5B9A'
    const unpinBtn2 = document.createElement('button')
    unpinBtn2.className = 'btn mini'
    unpinBtn2.textContent = '\u53D6\u6D88\u56FA\u5B9A'
    const hideEdgeWrap = document.createElement('label')
    hideEdgeWrap.className = 'mini'
    const hideEdgeChk = document.createElement('input')
    hideEdgeChk.type = 'checkbox'
    hideEdgeChk.checked = Boolean(sitePref.edgeHidden)
    const hideEdgeText = document.createElement('span')
    hideEdgeText.textContent = '\u9690\u85CF\u7AD6\u7EBF'
    hideEdgeWrap.append(hideEdgeChk)
    hideEdgeWrap.append(hideEdgeText)
    pinBtn2.addEventListener('click', () => {
      sitePref.pinned = true
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    unpinBtn2.addEventListener('click', () => {
      sitePref.pinned = false
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    hideEdgeChk.addEventListener('change', () => {
      sitePref.edgeHidden = hideEdgeChk.checked
      void saveConfig(cfg)
      if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
    })
    panelCtrlRow.append(panelCtrlLabel)
    panelCtrlRow.append(pinBtn2)
    panelCtrlRow.append(unpinBtn2)
    panelCtrlRow.append(hideEdgeWrap)
    grid.append(panelCtrlRow)
    const grpHeader = document.createElement('h2')
    grpHeader.className = 'section-title'
    grpHeader.textContent = '\u5206\u7EC4'
    const grpList = document.createElement('div')
    grpList.className = 'group-list'
    let active = cfg.groups.find((g) => g.id === activeGroupId) || cfg.groups[0]
    function rebuildGroupPills() {
      clearChildren(grpList)
      for (const g of cfg.groups) {
        const pill = document.createElement('button')
        pill.className = 'group-pill' + (g.id === active.id ? ' active' : '')
        pill.textContent = g.name
        pill.dataset.gid = g.id
        grpList.append(pill)
      }
    }
    grpList.addEventListener('click', (ev) => {
      const target = ev.target
      const btn = target.closest('.group-pill')
      if (!btn) return
      const pill = btn
      const gid = pill.dataset && pill.dataset.gid ? pill.dataset.gid : ''
      const next = cfg.groups.find((gg) => gg.id === gid)
      if (!next) return
      active = next
      rebuildGroupPills()
      rebuildGroupEditor()
    })
    const groupEditor = document.createElement('div')
    function rebuildGroupEditor() {
      clearChildren(groupEditor)
      const row1 = document.createElement('div')
      row1.className = 'row'
      const l1 = document.createElement('label')
      l1.textContent = '\u7EC4\u540D'
      const nameInput = document.createElement('input')
      nameInput.value = active.name
      nameInput.addEventListener('change', () => {
        active.name = nameInput.value
        rebuildGroupPills()
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      row1.append(l1)
      row1.append(nameInput)
      const row2 = document.createElement('div')
      row2.className = 'row'
      const l2 = document.createElement('label')
      l2.textContent = '\u56FE\u6807'
      const iconInput = document.createElement('input')
      iconInput.placeholder = 'lucide:home | url:https://... | emoji'
      iconInput.value = active.icon || ''
      iconInput.addEventListener('change', () => {
        active.icon = iconInput.value.trim() || void 0
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      row2.append(l2)
      row2.append(iconInput)
      const row3 = document.createElement('div')
      row3.className = 'row'
      const l3 = document.createElement('label')
      l3.textContent = 'URL \u89C4\u5219'
      const ta = document.createElement('textarea')
      ta.value = active.match.join('\n')
      ta.addEventListener('change', () => {
        const grp = cfg.groups.find((g) => g.id === active.id)
        if (!grp) return
        grp.match = ta.value
          .split(/\n+/)
          .map((v) => v.trim())
          .filter(Boolean)
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      row3.append(l3)
      row3.append(ta)
      const row4 = document.createElement('div')
      row4.className = 'row'
      const l4 = document.createElement('label')
      l4.textContent = '\u7EC4\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F'
      let grpOpen = active.defaultOpen || sitePref.defaultOpen
      const openRadios2 = createOpenModeRadios(grpOpen, (m) => {
        grpOpen = m
        active.defaultOpen = m
        void saveConfig(cfg)
      })
      row4.append(l4)
      row4.append(openRadios2)
      const row5 = document.createElement('div')
      row5.className = 'row'
      const l5 = document.createElement('label')
      l5.textContent = '\u6BCF\u884C\u4E2A\u6570'
      const colsSel = document.createElement('select')
      for (const c of [1, 2, 3, 4, 5, 6]) {
        const o = document.createElement('option')
        o.value = String(c)
        o.textContent = String(c)
        if ((active.itemsPerRow || 1) === c) o.selected = true
        colsSel.append(o)
      }
      colsSel.addEventListener('change', () => {
        const v = Number.parseInt(colsSel.value, 10)
        active.itemsPerRow = Number.isNaN(v) ? 1 : Math.max(1, Math.min(6, v))
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      row5.append(l5)
      row5.append(colsSel)
      const row6 = document.createElement('div')
      row6.className = 'row'
      const l6 = document.createElement('label')
      l6.textContent = '\u5206\u7EC4\u663E\u793A\u72B6\u6001'
      const visSel = document.createElement('select')
      for (const st of ['\u663E\u793A', '\u9690\u85CF']) {
        const o = document.createElement('option')
        o.value = st
        o.textContent = st
        if ((active.hidden ? '\u9690\u85CF' : '\u663E\u793A') === st)
          o.selected = true
        visSel.append(o)
      }
      visSel.addEventListener('change', () => {
        active.hidden = visSel.value === '\u9690\u85CF'
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      row6.append(l6)
      row6.append(visSel)
      const itemsHeader = document.createElement('h2')
      itemsHeader.className = 'section-title'
      itemsHeader.textContent = '\u5BFC\u822A\u9879'
      const itemsList = document.createElement('div')
      function rebuildItems() {
        clearChildren(itemsList)
        const groupId = active.id
        for (const it of active.items) {
          const row = document.createElement('div')
          row.className = 'row item-row'
          const n = document.createElement('input')
          n.value = it.name
          n.addEventListener('change', () => {
            const grp = cfg.groups.find((g) => g.id === groupId)
            if (!grp) return
            const item = grp.items.find((x) => x.id === it.id)
            if (!item) return
            item.name = n.value
            void saveConfig(cfg)
            rerender(root, cfg)
          })
          const i = document.createElement('input')
          i.placeholder = 'lucide:home | url:https://... | emoji'
          i.value = it.icon || ''
          i.addEventListener('change', () => {
            const grp = cfg.groups.find((g) => g.id === groupId)
            if (!grp) return
            const item = grp.items.find((x) => x.id === it.id)
            if (!item) return
            item.icon = i.value.trim() || void 0
            void saveConfig(cfg)
            rerender(root, cfg)
          })
          const t = document.createElement('select')
          for (const tp of ['url', 'js']) {
            const o = document.createElement('option')
            o.value = tp
            o.textContent = tp
            if (it.type === tp) o.selected = true
            t.append(o)
          }
          t.addEventListener('change', () => {
            const grp = cfg.groups.find((g) => g.id === groupId)
            if (!grp) return
            const item = grp.items.find((x) => x.id === it.id)
            if (!item) return
            item.type = t.value
            void saveConfig(cfg)
          })
          const d = document.createElement('input')
          d.value = it.data
          d.addEventListener('change', () => {
            const grp = cfg.groups.find((g) => g.id === groupId)
            if (!grp) return
            const item = grp.items.find((x) => x.id === it.id)
            if (!item) return
            item.data = d.value
            void saveConfig(cfg)
            rerender(root, cfg)
          })
          const m = document.createElement('select')
          for (const mm of ['same-tab', 'new-tab']) {
            const o = document.createElement('option')
            o.value = mm
            o.textContent = mm
            if (
              (it.openIn || active.defaultOpen || sitePref.defaultOpen) === mm
            )
              o.selected = true
            m.append(o)
          }
          m.addEventListener('change', () => {
            const grp = cfg.groups.find((g) => g.id === groupId)
            if (!grp) return
            const item = grp.items.find((x) => x.id === it.id)
            if (!item) return
            item.openIn = m.value
            void saveConfig(cfg)
          })
          const visibleSel = document.createElement('select')
          for (const st of ['\u663E\u793A', '\u9690\u85CF']) {
            const o = document.createElement('option')
            o.value = st
            o.textContent = st
            if ((it.hidden ? '\u9690\u85CF' : '\u663E\u793A') === st)
              o.selected = true
            visibleSel.append(o)
          }
          visibleSel.addEventListener('change', () => {
            const grp = cfg.groups.find((g) => g.id === groupId)
            if (!grp) return
            const item = grp.items.find((x) => x.id === it.id)
            if (!item) return
            item.hidden = visibleSel.value === '\u9690\u85CF'
            void saveConfig(cfg)
            rerender(root, cfg)
          })
          const del = document.createElement('button')
          del.className = 'btn'
          del.textContent = '\u5220\u9664'
          del.addEventListener('click', () => {
            const grp = cfg.groups.find((g) => g.id === groupId)
            if (!grp) return
            grp.items = grp.items.filter((x) => x.id !== it.id)
            void saveConfig(cfg)
            rebuildItems()
            rerender(root, cfg)
          })
          const moveToSel = document.createElement('select')
          for (const g of cfg.groups) {
            if (g.id === groupId) continue
            const o = document.createElement('option')
            o.value = g.id
            o.textContent = '\u590D\u5236\u5230 ' + g.name
            moveToSel.append(o)
          }
          const moveBtn = document.createElement('button')
          moveBtn.className = 'btn mini'
          moveBtn.textContent = '\u590D\u5236\u5230\u5206\u7EC4'
          moveBtn.addEventListener('click', () => {
            const toId = moveToSel.value
            if (!toId) return
            copyItemToGroup(cfg, groupId, it.id, toId)
            void saveConfig(cfg)
            rebuildItems()
            rerender(root, cfg)
          })
          row.append(n)
          row.append(i)
          row.append(t)
          row.append(d)
          row.append(m)
          row.append(visibleSel)
          row.append(moveToSel)
          row.append(moveBtn)
          row.append(del)
          itemsList.append(row)
        }
      }
      const addRow = document.createElement('div')
      addRow.className = 'row'
      const addBtn = document.createElement('button')
      addBtn.className = 'btn btn-secondary'
      addBtn.textContent = '\u6DFB\u52A0\u5BFC\u822A\u9879'
      addBtn.addEventListener('click', () => {
        var _a2
        openAddLinkModal(root, cfg, {
          saveConfig(c) {
            void saveConfig(c)
          },
          rerender(r, c) {
            rerender(r, c)
          },
          defaultOpen:
            (_a2 = active.defaultOpen) != null ? _a2 : sitePref.defaultOpen,
          defaultGroupId: active.id,
        })
      })
      addRow.append(addBtn)
      const grpActions = document.createElement('div')
      grpActions.className = 'row'
      const addGroup = document.createElement('button')
      addGroup.className = 'btn btn-secondary'
      addGroup.textContent = '\u6DFB\u52A0\u5206\u7EC4'
      addGroup.addEventListener('click', () => {
        const ng = {
          id: uid(),
          name: '\u65B0\u5206\u7EC4',
          icon: 'lucide:folder',
          match: ['*://' + (location.hostname || '') + '/*'],
          items: [],
          defaultOpen: sitePref.defaultOpen,
        }
        cfg.groups.push(ng)
        active = ng
        void saveConfig(cfg)
        rebuildGroupPills()
        rebuildGroupEditor()
        rerender(root, cfg)
      })
      const delGroup = document.createElement('button')
      delGroup.className = 'btn btn-secondary'
      delGroup.textContent = '\u5220\u9664\u5206\u7EC4'
      delGroup.addEventListener('click', () => {
        if (cfg.groups.length <= 1) {
          mask.remove()
          return
        }
        cfg.groups = cfg.groups.filter((g) => g.id !== active.id)
        active = cfg.groups[0]
        void saveConfig(cfg)
        rebuildGroupPills()
        rebuildGroupEditor()
        rerender(root, cfg)
      })
      const delEmptyGroups = document.createElement('button')
      delEmptyGroups.className = 'btn btn-secondary'
      delEmptyGroups.textContent =
        '\u5220\u9664\u6240\u6709\u7A7A\u7684\u5206\u7EC4'
      delEmptyGroups.addEventListener('click', () => {
        const empties = cfg.groups.filter((g) => (g.items || []).length === 0)
        const n = empties.length
        if (n === 0) return
        const ok = globalThis.confirm(
          '\u786E\u8BA4\u5220\u9664 ' + n + ' \u4E2A\u5206\u7EC4\uFF1F'
        )
        if (!ok) return
        const kept = cfg.groups.filter((g) => (g.items || []).length > 0)
        if (kept.length === 0) {
          const ng = {
            id: uid(),
            name: '\u65B0\u5206\u7EC4',
            icon: 'lucide:folder',
            match: ['*://' + (location.hostname || '') + '/*'],
            items: [],
            defaultOpen: sitePref.defaultOpen,
          }
          kept.push(ng)
        }
        cfg.groups = kept
        active = cfg.groups[0]
        void saveConfig(cfg)
        rebuildGroupPills()
        rebuildGroupEditor()
        rerender(root, cfg)
      })
      grpActions.append(addGroup)
      grpActions.append(delGroup)
      grpActions.append(delEmptyGroups)
      groupEditor.append(row1)
      groupEditor.append(row2)
      groupEditor.append(row3)
      groupEditor.append(row4)
      groupEditor.append(row5)
      groupEditor.append(row6)
      groupEditor.append(itemsHeader)
      groupEditor.append(itemsList)
      groupEditor.append(addRow)
      groupEditor.append(grpActions)
      rebuildItems()
    }
    rebuildGroupPills()
    rebuildGroupEditor()
    const actions = document.createElement('div')
    actions.className = 'row'
    const exportBtn = document.createElement('button')
    exportBtn.className = 'btn btn-secondary'
    exportBtn.textContent = '\u5BFC\u51FA\u914D\u7F6E'
    exportBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
      } catch (e) {}
    })
    const closeBtn = document.createElement('button')
    closeBtn.className = 'btn btn-secondary'
    closeBtn.textContent = '\u5173\u95ED'
    closeBtn.addEventListener('click', () => {
      mask.remove()
    })
    actions.append(exportBtn)
    actions.append(closeBtn)
    modal.append(h2)
    modal.append(grid)
    modal.append(syncRow)
    modal.append(edgeRow)
    modal.append(grpHeader)
    modal.append(grpList)
    modal.append(groupEditor)
    modal.append(actions)
    mask.append(modal)
    root.append(mask)
  }
  function openQuickAddMenu(root, cfg, anchor) {
    for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
      n.remove()
    const menu = document.createElement('div')
    menu.className = 'quick-add-menu'
    menu.setAttribute('role', 'menu')
    const addGroupBtn = document.createElement('button')
    addGroupBtn.className = 'quick-add-item'
    addGroupBtn.append(renderIcon('lucide:folder'))
    addGroupBtn.append(document.createTextNode(' \u6DFB\u52A0\u5206\u7EC4'))
    addGroupBtn.setAttribute('role', 'menuitem')
    const addLinkBtn = document.createElement('button')
    addLinkBtn.className = 'quick-add-item'
    addLinkBtn.append(renderIcon('lucide:link'))
    addLinkBtn.append(document.createTextNode(' \u6DFB\u52A0\u94FE\u63A5'))
    addLinkBtn.setAttribute('role', 'menuitem')
    addGroupBtn.setAttribute('tabindex', '0')
    addLinkBtn.setAttribute('tabindex', '0')
    menu.append(addGroupBtn)
    menu.append(addLinkBtn)
    const r = anchor.getBoundingClientRect()
    menu.style.position = 'fixed'
    const rightSide = isRightSide(sitePref.position)
    const top = Math.round(r.bottom + 6)
    if (rightSide) {
      const right = Math.round(window.innerWidth - r.right)
      menu.style.top = ''.concat(top, 'px')
      menu.style.right = ''.concat(right, 'px')
    } else {
      const left = Math.round(r.left)
      menu.style.top = ''.concat(top, 'px')
      menu.style.left = ''.concat(left, 'px')
    }
    suppressCollapse = true
    tempOpen = true
    addGroupBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const ng = {
        id: uid(),
        name: '\u65B0\u5206\u7EC4',
        icon: 'lucide:folder',
        match: ['*://' + (location.hostname || '') + '/*'],
        items: [],
        defaultOpen: sitePref.defaultOpen,
      }
      cfg.groups.push(ng)
      void saveConfig(cfg)
      rerender(root, cfg)
      for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
        n.remove()
      suppressCollapse = false
      openEditor(root, cfg, ng.id)
    })
    addLinkBtn.addEventListener('click', (e) => {
      var _a
      e.stopPropagation()
      for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
        n.remove()
      suppressCollapse = false
      const matched = currentGroups(cfg)
      openAddLinkModal(root, cfg, {
        saveConfig(c) {
          void saveConfig(c)
        },
        rerender(r2, c) {
          rerender(r2, c)
        },
        defaultOpen: sitePref.defaultOpen || 'same-tab',
        defaultGroupId:
          (_a = matched[0] || cfg.groups[0]) == null ? void 0 : _a.id,
      })
    })
    menu.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    menu.addEventListener('keydown', (e) => {
      const items = [addGroupBtn, addLinkBtn]
      const ae = root.activeElement
      const idx = items.indexOf(
        ae instanceof HTMLButtonElement ? ae : addGroupBtn
      )
      if (e.key === 'Escape') {
        for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
          n.remove()
        return
      }
      if (e.key === 'ArrowDown') {
        const next = items[(Math.max(0, idx) + 1) % items.length]
        next.focus()
        e.preventDefault()
      }
      if (e.key === 'ArrowUp') {
        const prev =
          items[
            (items.length + (idx <= 0 ? items.length - 1 : idx - 1)) %
              items.length
          ]
        prev.focus()
        e.preventDefault()
      }
      if (e.key === 'Enter') {
        const cur = items[Math.max(0, idx)]
        cur.click()
        e.preventDefault()
      }
    })
    root.append(menu)
    setTimeout(() => {
      try {
        addGroupBtn.focus()
      } catch (e) {}
    }, 0)
    const onOutside = () => {
      for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
        n.remove()
      suppressCollapse = false
    }
    setTimeout(() => {
      root.addEventListener('click', onOutside, { once: true })
      document.addEventListener('click', onOutside, { once: true })
      document.addEventListener(
        'keydown',
        (ev) => {
          if (ev.key === 'Escape') onOutside()
        },
        { once: true }
      )
    }, 0)
  }
  var lastCollapsed = true
  var suppressCollapse = false
  function rerender(root, cfg) {
    var _a, _b, _c
    suppressCollapse = true
    for (const n of Array.from(
      root.querySelectorAll('.utqn,.collapsed-tab,.quick-add-menu')
    ))
      n.remove()
    if (sitePref.enabled === false) {
      lastCollapsed = true
      suppressCollapse = false
      return
    }
    const isCollapsed = !tempOpen && (tempClosed || !sitePref.pinned)
    if (isCollapsed) {
      if (!sitePref.edgeHidden) {
        const tab = document.createElement('div')
        tab.className = 'collapsed-tab'
        place(tab, cfg)
        try {
          const gw = (_a = sitePref.edgeWidth) != null ? _a : EDGE_DEFAULT_WIDTH
          const gh =
            (_b = sitePref.edgeHeight) != null ? _b : EDGE_DEFAULT_HEIGHT
          const go =
            (_c = sitePref.edgeOpacity) != null ? _c : EDGE_DEFAULT_OPACITY
          const horiz = isHorizontalPos(sitePref.position)
          const thickness = Math.max(1, Math.min(24, gw))
          const length = Math.max(24, Math.min(320, gh))
          tab.style.width = horiz
            ? ''.concat(length, 'px')
            : ''.concat(thickness, 'px')
          tab.style.height = horiz
            ? ''.concat(thickness, 'px')
            : ''.concat(length, 'px')
          tab.style.opacity = String(Math.max(0, Math.min(1, go)))
          tab.style.backgroundColor = isDarkTheme(cfg)
            ? String(sitePref.edgeColorDark || EDGE_DEFAULT_COLOR_DARK)
            : String(sitePref.edgeColorLight || EDGE_DEFAULT_COLOR_LIGHT)
        } catch (e) {}
        tab.addEventListener('mouseenter', () => {
          tempOpen = true
          rerender(root, cfg)
        })
        tab.addEventListener('mouseleave', () => {
          if (!sitePref.pinned && !suppressCollapse)
            scheduleAutoCollapse(root, cfg)
        })
        root.append(tab)
      }
      lastCollapsed = true
      suppressCollapse = false
      return
    }
    renderPanel(root, cfg, lastCollapsed)
    lastCollapsed = false
    suppressCollapse = false
  }
  function registerMenu(root, cfg) {
    try {
      const fn = globalThis.GM_registerMenuCommand
      try {
        const unreg = globalThis.GM_unregisterMenuCommand
        if (typeof unreg === 'function' && Array.isArray(menuIds)) {
          for (const id of menuIds) {
            try {
              unreg(id)
            } catch (e) {}
          }
          menuIds = []
        }
      } catch (e) {}
      if (typeof fn === 'function') {
        menuIds.push(
          fn(
            '\u{1F9ED} \u6253\u5F00\u5FEB\u901F\u5BFC\u822A\u9762\u677F',
            () => {
              if (sitePref.enabled === false) {
                const ok = globalThis.confirm(
                  '\u5F53\u524D\u7F51\u7AD9\u5DF2\u7981\u7528\uFF0C\u662F\u5426\u542F\u7528\u5E76\u6253\u5F00\u9762\u677F\uFF1F'
                )
                if (ok) {
                  sitePref.enabled = true
                  void saveConfig(cfg)
                  tempOpen = true
                  rerender(root, cfg)
                  registerMenu(root, cfg)
                }
                return
              }
              tempOpen = true
              rerender(root, cfg)
            }
          )
        )
      }
      if (typeof fn === 'function')
        menuIds.push(
          fn('\u2699\uFE0F \u8BBE\u7F6E\u5FEB\u901F\u5BFC\u822A', () => {
            openEditor(root, cfg)
          })
        )
      if (typeof fn === 'function') {
        const text = sitePref.enabled
          ? '\u{1F6AB} \u7981\u7528\u5F53\u524D\u7F51\u7AD9\u5FEB\u901F\u5BFC\u822A'
          : '\u2705 \u542F\u7528\u5F53\u524D\u7F51\u7AD9\u5FEB\u901F\u5BFC\u822A'
        menuIds.push(
          fn(text, () => {
            sitePref.enabled = !sitePref.enabled
            void saveConfig(cfg)
            rerender(root, cfg)
            registerMenu(root, cfg)
          })
        )
      }
    } catch (e) {}
  }
  function registerStorageListener(root, cfg) {
    try {
      const fn = globalThis.GM_addValueChangeListener
      if (typeof fn === 'function')
        fn(KEY, (_name, _old, nv, remote) => {
          if (!remote) return
          try {
            const obj = JSON.parse(nv)
            if (obj && obj.global && obj.groups) {
              cfg.global = obj.global
              cfg.groups = obj.groups
              if (obj.sitePrefs) cfg.sitePrefs = obj.sitePrefs
              initSitePref(cfg)
              rerender(root, cfg)
            }
          } catch (e) {}
        })
    } catch (e) {}
  }
  var collapseTimer
  function scheduleAutoCollapse(root, cfg) {
    if (collapseTimer) clearTimeout(collapseTimer)
    collapseTimer = setTimeout(() => {
      collapseWithAnim(root, cfg)
    }, 500)
  }
  function collapseWithAnim(root, cfg) {
    try {
      const p = sitePref.position
      const sel = root.querySelector('.utqn .panel')
      if (sel) {
        if (isHorizontalPos(p)) {
          const isTop = isTopSide(p)
          sel.classList.add(isTop ? 'anim-out-top' : 'anim-out-bottom')
        } else {
          const right = isRightSide(p)
          sel.classList.add(right ? 'anim-out-right' : 'anim-out-left')
        }
        sel.addEventListener(
          'animationend',
          () => {
            tempClosed = true
            tempOpen = false
            rerender(root, cfg)
          },
          { once: true }
        )
        return
      }
    } catch (e) {}
    tempOpen = false
    rerender(root, cfg)
  }
  function updateThemeUI(root, cfg) {
    const wrapper = root.querySelector('.utqn')
    if (!wrapper) return
    wrapper.classList.toggle('dark', isDarkTheme(cfg))
    const curTheme = sitePref.theme || THEME_DEFAULT
    const map = {
      系统: 'system',
      浅色: 'light',
      深色: 'dark',
    }
    const btns = wrapper.querySelectorAll('.theme-btn')
    for (const b of Array.from(btns)) {
      const key = b.title
      const val = map[key] || ''
      b.classList.toggle('active', val === curTheme)
    }
  }
  function registerUrlChangeListener(root, cfg) {
    let last = location.href
    function onChange() {
      const now = location.href
      if (now === last) return
      last = now
      rerender(root, cfg)
    }
    try {
      const origPush = history.pushState.bind(history)
      history.pushState = function (...args) {
        const r = origPush(...args)
        try {
          onChange()
        } catch (e) {}
        return r
      }
    } catch (e) {}
    try {
      const origReplace = history.replaceState.bind(history)
      history.replaceState = function (...args) {
        const r = origReplace(...args)
        try {
          onChange()
        } catch (e) {}
        return r
      }
    } catch (e) {}
    globalThis.addEventListener('popstate', () => {
      onChange()
    })
    globalThis.addEventListener('hashchange', () => {
      onChange()
    })
  }
  function main() {
    const { root } = createRoot()
    void (async () => {
      const cfg = await loadConfig()
      initSitePref(cfg)
      if (sitePref.enabled === false) {
        registerMenu(root, cfg)
        registerStorageListener(root, cfg)
        registerUrlChangeListener(root, cfg)
        return
      }
      rerender(root, cfg)
      registerMenu(root, cfg)
      registerStorageListener(root, cfg)
      registerUrlChangeListener(root, cfg)
      try {
        const mq = globalThis.matchMedia('(prefers-color-scheme: dark)')
        mq.addEventListener('change', () => {
          if ((sitePref.theme || 'system') === 'system') rerender(root, cfg)
        })
      } catch (e) {}
      try {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') rerender(root, cfg)
        })
      } catch (e) {}
    })()
  }
  main()
})()
