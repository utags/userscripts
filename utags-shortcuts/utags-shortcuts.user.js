// ==UserScript==
// @name                 UTags Shortcuts
// @name:zh-CN           UTags 快捷导航
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.7.1
// @description          Floating or sidebar quick navigation with per-site groups, icons, JS script execution, and editable items.
// @description:zh-CN    悬浮或侧边栏快速导航，支持按站点分组、图标、执行JS脚本与可编辑导航项。
// @icon                 data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%2212%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%224%22/%3E%3Cpath%20d%3D%22M22%2032h20M22%2042h16M22%2022h12%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                *://*/*
// @connect              cdn.jsdelivr.net
// @connect              fastly.jsdelivr.net
// @connect              unpkg.com
// @connect              wsrv.nl
// @connect              raw.githubusercontent.com
// @run-at               document-start
// @grant                GM_registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @grant                GM.xmlHttpRequest
// @grant                GM_xmlhttpRequest
// @grant                GM_addStyle
// @grant                GM.addStyle
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
  var style_default =
    '/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-300:oklch(80.8% 0.114 19.571);--color-red-400:oklch(70.4% 0.191 22.216);--color-red-500:oklch(63.7% 0.237 25.331);--color-red-600:oklch(57.7% 0.245 27.325);--color-blue-50:oklch(97% 0.014 254.604);--color-blue-100:oklch(93.2% 0.032 255.585);--color-blue-300:oklch(80.9% 0.105 251.813);--color-blue-400:oklch(70.7% 0.165 254.624);--color-blue-500:oklch(62.3% 0.214 259.815);--color-blue-600:oklch(54.6% 0.245 262.881);--color-blue-700:oklch(48.8% 0.243 264.376);--color-blue-900:oklch(37.9% 0.146 265.522);--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-200:oklch(92.8% 0.006 264.531);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-800:oklch(27.8% 0.033 256.848);--color-gray-900:oklch(21% 0.034 264.665);--color-black:#000;--color-white:#fff;--spacing:4px;--text-xs:12px;--text-xs--line-height:1.33333;--text-sm:14px;--text-sm--line-height:1.42857;--text-base:16px;--text-base--line-height:1.5;--text-lg:18px;--text-lg--line-height:1.55556;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-wider:0.05em;--leading-snug:1.375;--leading-relaxed:1.625;--radius-md:6px;--radius-lg:8px;--radius-xl:12px;--radius-2xl:16px;--default-transition-duration:150ms;--default-transition-timing-function:cubic-bezier(0.4,0,0.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.container{width:100%;@media (width >= 40rem){max-width:640px}@media (width >= 48rem){max-width:768px}@media (width >= 64rem){max-width:1024px}@media (width >= 80rem){max-width:1280px}@media (width >= 96rem){max-width:1536px}}.mt-4{margin-top:calc(var(--spacing)*4)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline-flex{display:inline-flex}.table{display:table}.w-full{width:100%}.min-w-0{min-width:calc(var(--spacing)*0)}.flex-1{flex:1}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.gap-2{gap:calc(var(--spacing)*2)}.border{border-style:var(--tw-border-style);border-width:1px}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-red-600{color:var(--color-red-600)}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.transition{transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function))}}:host{all:initial}.ushortcuts{color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px;position:fixed;z-index:2147483647}.ushortcuts.dark{color:var(--color-gray-100)}.panel{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-xl);border-style:var(--tw-border-style);border-width:1px;display:flex;flex-direction:column;gap:calc(var(--spacing)*3);max-height:100vh;max-width:360px;overflow-y:auto;padding:calc(var(--spacing)*3);--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));-webkit-user-select:none;-moz-user-select:none;user-select:none}.panel,.ushortcuts.dark .panel{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ushortcuts.dark .panel{background-color:var(--color-gray-900);border-color:var(--color-gray-700);--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25))}.panel.sidebar-right{border-bottom-width:0;border-right-width:0;border-top-width:0;box-shadow:unset;width:360px}.panel.sidebar-left{border-bottom-width:0;border-left-width:0;border-top-width:0;box-shadow:unset;width:360px}@keyframes ushortcuts-slide-in-left{0%{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}@keyframes ushortcuts-slide-in-right{0%{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}@keyframes ushortcuts-slide-in-top{0%{opacity:0;transform:translateY(0)}to{opacity:1;transform:translateY(0)}}@keyframes ushortcuts-slide-in-bottom{0%{opacity:0;transform:translateY(0)}to{opacity:1;transform:translateY(0)}}@keyframes ushortcuts-slide-out-left{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-12px)}}@keyframes ushortcuts-slide-out-right{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(12px)}}@keyframes ushortcuts-slide-out-top{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(0)}}@keyframes ushortcuts-slide-out-bottom{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(0)}}.anim-in-left{animation:ushortcuts-slide-in-left .1s ease-out}.anim-in-right{animation:ushortcuts-slide-in-right .1s ease-out}.anim-in-top{animation:ushortcuts-slide-in-top .1s ease-out}.anim-in-bottom{animation:ushortcuts-slide-in-bottom .1s ease-out}.anim-out-left{animation:ushortcuts-slide-out-left 80ms ease-in forwards}.anim-out-right{animation:ushortcuts-slide-out-right 80ms ease-in forwards}.anim-out-top{animation:ushortcuts-slide-out-top 80ms ease-in forwards}.anim-out-bottom{animation:ushortcuts-slide-out-bottom 80ms ease-in forwards}.header{gap:calc(var(--spacing)*2);justify-content:space-between}.header,.header-actions{align-items:center;display:flex}.header-actions{gap:calc(var(--spacing)*1.5)}.header-actions .icon-btn{opacity:0;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s}.header-actions .icon-btn.toggle,.section .header:hover .header-actions .icon-btn:not(.toggle){opacity:100%}.section .header{margin-bottom:calc(var(--spacing)*0)}.section.drag-over{background-color:var(--color-blue-50);border-radius:var(--radius-lg);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-blue-500)}.ushortcuts.dark .section.drag-over{background-color:color-mix(in srgb,oklch(37.9% .146 265.522) 30%,transparent);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-blue-900) 30%,transparent)}--tw-ring-color:var(--color-blue-400)}.icon-btn{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.modal.dark .icon-btn,.ushortcuts.dark .icon-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.modal.dark .icon img.lucide-icon,.ushortcuts.dark .icon img.lucide-icon{filter:invert(1) brightness(1.15) saturate(1.1)}.icon-btn.active{background-color:var(--color-gray-200);color:var(--color-gray-900);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.icon-btn.active,.modal.dark .icon-btn.active,.ushortcuts.dark .icon-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal.dark .icon-btn.active,.ushortcuts.dark .icon-btn.active{background-color:var(--color-gray-700);color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.text-danger{color:var(--color-red-500)}.text-danger:hover{color:var(--color-red-600)}.modal.dark .text-danger,.ushortcuts.dark .text-danger{color:var(--color-red-400)}.modal.dark .text-danger:hover,.ushortcuts.dark .text-danger:hover{color:var(--color-red-300)}.title{align-items:center;display:flex;gap:calc(var(--spacing)*1.5);min-width:calc(var(--spacing)*0);--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-800);font-weight:var(--font-weight-semibold)}.title-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ushortcuts.dark .title{color:var(--color-gray-100)}.btn{align-items:center;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;display:inline-flex;gap:calc(var(--spacing)*1.5);justify-content:center;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2.5);--tw-font-weight:var(--font-weight-medium);color:var(--color-gray-800);font-weight:var(--font-weight-medium);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-300);--tw-outline-style:none;outline-style:none}&:active{scale:.99}}.ushortcuts.dark .btn{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:focus{--tw-ring-color:var(--color-gray-700)}}.btn-primary{background-color:var(--color-blue-600);border-color:var(--color-blue-600);color:var(--color-white);--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,rgba(0,0,0,.1)),0 2px 4px -2px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);&:hover{@media (hover:hover){border-color:var(--color-blue-700)}}&:hover{@media (hover:hover){background-color:var(--color-blue-700)}}}.modal.dark .btn-primary,.ushortcuts.dark .btn-primary{background-color:var(--color-blue-500);border-color:var(--color-blue-500);color:var(--color-white);&:hover{@media (hover:hover){border-color:var(--color-blue-600)}}&:hover{@media (hover:hover){background-color:var(--color-blue-600)}}}.btn-secondary{background-color:var(--color-gray-100);border-color:var(--color-gray-300);color:var(--color-gray-800);&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}}.modal.dark .btn-secondary,.ushortcuts.dark .btn-secondary{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.items{display:grid;gap:calc(var(--spacing)*1);grid-template-columns:repeat(var(--cols,1),minmax(0,1fr))}.items input[type=checkbox]{flex:none;height:14px;width:14px}.item{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-900);display:inline-flex;gap:calc(var(--spacing)*1.5);min-width:calc(var(--spacing)*0);overflow:hidden;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);text-decoration-line:none;text-overflow:ellipsis;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));white-space:nowrap;--tw-duration:150ms;transition-duration:.15s}.item-wrap{border-radius:var(--radius-md);position:relative;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s}.layout-list .item-wrap.drag-over-after:after,.layout-list .item-wrap.drag-over-before:before{background-color:var(--color-blue-500);content:"";height:2px;left:calc(var(--spacing)*0);pointer-events:none;position:absolute;right:calc(var(--spacing)*0);z-index:20}.layout-list .item-wrap.drag-over-before:before{top:0}.layout-list .item-wrap.drag-over-after:after{bottom:0}.layout-auto .item-wrap.drag-over-after:after,.layout-auto .item-wrap.drag-over-before:before,.layout-grid .item-wrap.drag-over-after:after,.layout-grid .item-wrap.drag-over-before:before{background-color:var(--color-blue-500);bottom:calc(var(--spacing)*0);content:"";pointer-events:none;position:absolute;top:calc(var(--spacing)*0);width:2px;z-index:20}.layout-auto .item-wrap.drag-over-before:before,.layout-grid .item-wrap.drag-over-before:before{left:0}.layout-auto .item-wrap.drag-over-after:after,.layout-grid .item-wrap.drag-over-after:after{right:0}.layout-grid.cols-1 .item-wrap.drag-over-after:after,.layout-grid.cols-1 .item-wrap.drag-over-before:before{bottom:auto;height:2px;left:calc(var(--spacing)*0);right:calc(var(--spacing)*0);top:auto;width:auto}.layout-grid.cols-1 .item-wrap.drag-over-before:before{top:0}.layout-grid.cols-1 .item-wrap.drag-over-after:after{bottom:0}.ushortcuts.dark .item-wrap.drag-over-after:after,.ushortcuts.dark .item-wrap.drag-over-before:before{background-color:var(--color-blue-400)}.section.drag-over-append .items{box-shadow:0 2px 0 0 #3b82f6}.ushortcuts.dark .section.drag-over-append .items{box-shadow:0 2px 0 0 #60a5fa}.item{width:100%}.item:hover{background-color:var(--color-gray-100)}.ushortcuts.dark .item:hover{background-color:var(--color-gray-800)}.ushortcuts.dark .item{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-100);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.icon{align-items:center;border-radius:4px;display:inline-flex;flex:none;height:calc(var(--spacing)*4);justify-content:center;overflow:hidden;width:calc(var(--spacing)*4);--tw-leading:1;line-height:1;white-space:nowrap}.collapsed-tab{background-color:var(--color-gray-700);border-radius:0;height:60px;opacity:40%;position:fixed;width:3px;z-index:2147483647}.ushortcuts.dark .collapsed-tab{background-color:var(--color-gray-400);opacity:40%}.collapsed-tab:hover{opacity:80%}.modal-mask{align-items:center;background-color:color-mix(in srgb,#000 40%,transparent);display:flex;inset:calc(var(--spacing)*0);justify-content:center;position:fixed;z-index:2147483647;@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-black) 40%,transparent)}}.modal{color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px}.modal h2:not(.section-title){font-size:16px;margin:calc(var(--spacing)*0);margin-bottom:calc(var(--spacing)*2.5)}.row{display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*2);margin-block:calc(var(--spacing)*1.5)}.modal .row{align-items:center}.modal .actions{justify-content:flex-end}.modal .check{align-items:center;display:inline-flex;gap:calc(var(--spacing)*2);height:32px;width:unset!important}.modal .check input[type=checkbox]{height:14px;width:14px}.segmented{align-items:center;background-color:var(--color-gray-100);border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;display:inline-flex;gap:calc(var(--spacing)*1);padding-block:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*1);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal .segmented{margin-bottom:calc(var(--spacing)*3)}.ushortcuts.dark .segmented{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.seg-item{align-items:center;border-radius:calc(infinity*1px);cursor:pointer;display:inline-flex;-webkit-user-select:none;-moz-user-select:none;user-select:none}.seg-radio{border-width:0;clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.seg-text{border-radius:calc(infinity*1px);color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);text-align:center;width:100%}.ushortcuts.dark .seg-text{color:var(--color-gray-300)}.seg-item .seg-radio:checked+.seg-text{background-color:var(--color-white);color:var(--color-gray-900);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.seg-item .seg-radio:checked+.seg-text,.ushortcuts.dark .seg-item .seg-radio:checked+.seg-text{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ushortcuts.dark .seg-item .seg-radio:checked+.seg-text{background-color:var(--color-gray-700);color:var(--color-gray-100);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.seg-item .seg-radio:focus+.seg-text{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-blue-500)}.segmented-compact{gap:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*.5)}.segmented.segmented-compact label.seg-item{min-width:40px}.segmented-compact .seg-text{padding-inline:calc(var(--spacing)*1.5)}.field-help{background-color:var(--color-gray-100);border-radius:var(--radius-md);display:block;flex-basis:100%;font-size:12px;margin-left:130px;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);width:100%;--tw-leading:var(--leading-snug);color:var(--color-gray-700);line-height:var(--leading-snug)}.modal.dark .field-help,.ushortcuts.dark .field-help{background-color:var(--color-gray-800);color:var(--color-gray-300)}.field-help-title{align-items:center;display:flex;gap:calc(var(--spacing)*1);margin-bottom:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.field-help a{color:var(--color-blue-600);text-decoration-line:underline}.modal.dark .field-help a,.ushortcuts.dark .field-help a{color:var(--color-blue-400);text-decoration-line:underline}input,select,textarea{border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;flex:1;font-size:13px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}textarea{min-height:80px}.grid{display:grid;gap:calc(var(--spacing)*2);grid-template-columns:repeat(2,minmax(0,1fr))}.group-list{display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*1.5);margin-top:calc(var(--spacing)*1.5)}.group-pill{border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.group-pill.active{background-color:var(--color-gray-900);border-color:var(--color-gray-900);color:var(--color-white)}.modal.dark .group-pill,.ushortcuts.dark .group-pill{border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.modal.dark .group-pill.active,.ushortcuts.dark .group-pill.active{background-color:var(--color-gray-100);border-color:var(--color-gray-100);color:var(--color-gray-900)}.mini{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*1.5)}.btn:disabled{cursor:not-allowed;opacity:50%}.divider{background-color:var(--color-gray-200);height:1px}.modal.dark .divider,.ushortcuts.dark .divider{background-color:var(--color-gray-700)}.section-title{background-color:var(--color-gray-100);border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));margin-bottom:calc(var(--spacing)*1);margin-top:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);--tw-tracking:var(--tracking-wider);color:var(--color-gray-600);letter-spacing:var(--tracking-wider);text-transform:uppercase}.modal.dark .section-title,.ushortcuts.dark .section-title{background-color:var(--color-gray-800);color:var(--color-gray-300)}.row label.mini{align-items:center;display:inline-flex;gap:calc(var(--spacing)*2)}.modal{background-color:var(--color-white);border-radius:var(--radius-2xl);max-width:92vw;padding:calc(var(--spacing)*3);width:720px;--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal.dark,.ushortcuts.dark .modal{background-color:var(--color-gray-900);color:var(--color-gray-100)}.modal.dark input,.modal.dark select,.modal.dark textarea,.ushortcuts.dark .modal input,.ushortcuts.dark .modal select,.ushortcuts.dark .modal textarea{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-100)}.ushortcuts.dark .modal input::-moz-placeholder,.ushortcuts.dark .modal textarea::-moz-placeholder{color:#9ca3af}.ushortcuts.dark .modal input::placeholder,.ushortcuts.dark .modal textarea::placeholder{color:#9ca3af}.modal.dark input::-moz-placeholder,.modal.dark textarea::-moz-placeholder{color:#9ca3af}.modal.dark input::placeholder,.modal.dark textarea::placeholder{color:#9ca3af}.modal.dark .row label{color:var(--color-gray-400)}.modal.dark .segmented{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.modal.dark .seg-item .seg-radio:checked+.seg-text{background-color:var(--color-gray-700);color:var(--color-gray-100);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-600)}.modal.dark .seg-text{color:var(--color-gray-300)}.editor{border-radius:var(--radius-2xl);max-height:72vh;overflow-y:auto;padding:calc(var(--spacing)*4)}.editor .grid,.editor .row{gap:calc(var(--spacing)*2)}.editor .row{align-items:center}.editor .row label{color:var(--color-gray-500);width:120px}.ushortcuts.dark .editor .row label{color:var(--color-gray-400)}.editor input,.editor select,.editor textarea{background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);&:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-300);--tw-outline-style:none;outline-style:none}}.ushortcuts.dark .editor input,.ushortcuts.dark .editor select,.ushortcuts.dark .editor textarea{background-color:var(--color-gray-800);border-color:var(--color-gray-700);&:focus{--tw-ring-color:var(--color-gray-700)}}input:disabled,select:disabled,textarea:disabled{background-color:var(--color-gray-100);cursor:not-allowed;opacity:60%}.dark input:disabled,.dark select:disabled,.dark textarea:disabled{background-color:var(--color-gray-700);cursor:not-allowed;opacity:60%}.editor .item-row{align-items:center;background-color:var(--color-gray-50);border-radius:var(--radius-md);display:grid;gap:8px;grid-template-columns:1.2fr 1.1fr .9fr 2fr 1fr .9fr 1.3fr auto auto;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}.editor .item-row:hover{background-color:var(--color-gray-100)}.modal.dark .item-row,.ushortcuts.dark .editor .item-row{background-color:var(--color-gray-800)}.modal.dark .item-row:hover,.ushortcuts.dark .editor .item-row:hover{background-color:var(--color-gray-700)}.editor .btn{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2)}.row label{color:var(--color-gray-500);width:120px}.ushortcuts.dark .row label{color:var(--color-gray-400)}.panel-actions,.panel-actions-left{align-items:center;display:flex;gap:calc(var(--spacing)*1.5)}.theme-switch{align-items:center;background-color:var(--color-gray-100);border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;display:inline-flex;gap:calc(var(--spacing)*1);padding-block:2px;padding-inline:calc(var(--spacing)*1);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal.dark .theme-switch,.ushortcuts.dark .theme-switch{background-color:var(--color-gray-800)}.theme-btn{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.modal.dark .theme-btn,.ushortcuts.dark .theme-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.theme-btn.active{background-color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.modal.dark .theme-btn.active,.theme-btn.active,.ushortcuts.dark .theme-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal.dark .theme-btn.active,.ushortcuts.dark .theme-btn.active{background-color:var(--color-gray-700);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.collapse-btn{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.ushortcuts.dark .collapse-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.item+.icon-btn{justify-self:flex-end}.items{align-items:center;margin-top:calc(var(--spacing)*1.5)}.item-wrap{align-items:center;display:flex;gap:8px;justify-content:space-between}.item-wrap .item{flex:1}.item-wrap .icon-btn{opacity:0;transition:opacity .15s ease-in-out}.item-wrap:hover .icon-btn{opacity:1}.item-wrap:focus-within .icon-btn{opacity:1}.quick-add-menu{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;font-family:var(--font-sans);font-size:13px;min-width:160px;padding:calc(var(--spacing)*1.5);position:fixed;z-index:2147483647;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ushortcuts.dark .quick-add-menu,.ushortcuts.dark~.quick-add-menu{background-color:var(--color-gray-900);border-color:var(--color-gray-700);color:var(--color-gray-100);--tw-shadow-color:color-mix(in srgb,#000 40%,transparent);@supports (color:color-mix(in lab,red,red)){--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-black) 40%,transparent) var(--tw-shadow-alpha),transparent)}}.quick-add-item{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-900);display:flex;gap:calc(var(--spacing)*1.5);padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);text-align:left;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:100%;--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.ushortcuts.dark .quick-add-menu .quick-add-item,.ushortcuts.dark~.quick-add-menu .quick-add-item{color:var(--color-gray-100);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}}.ushortcuts.dark .quick-add-menu .icon img.lucide-icon,.ushortcuts.dark~.quick-add-menu .icon img.lucide-icon{filter:invert(1) brightness(1.15) saturate(1.1)}.picker-highlight{cursor:pointer!important;outline:2px dashed #ef4444!important;outline-offset:2px!important}.picker-tip{background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,.1);color:#111827;font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;padding:6px 10px;position:fixed;right:12px;top:12px;z-index:2147483647}.ushortcuts.dark .picker-tip,.ushortcuts.dark~.picker-tip{background:#111827;border-color:#374151;color:#f9fafb}.panel.all-mode{height:100vh;max-width:100vw;overflow:hidden;width:100vw}.panel-scroll{height:calc(100% - 36px);overflow-x:auto;width:100%}.panel.all-mode .header{background-color:#fff;position:sticky;top:0;z-index:2147483647}.ushortcuts.dark .panel.all-mode .header{background-color:#111827}.panel-columns{-moz-column-gap:12px;column-gap:12px;-moz-column-width:360px;column-width:360px;height:100%}.divider,.section{-moz-column-break-inside:avoid;break-inside:avoid}.check{align-items:center;display:inline-flex;gap:calc(var(--spacing)*2);height:32px}.check input[type=checkbox]{height:14px;width:14px}.item-wrap,.section{transition:opacity .15s ease}@keyframes ushortcuts-fade-in{0%{opacity:.01}to{opacity:1}}.item-wrap.fade-in,.section.fade-in{animation:ushortcuts-fade-in .15s ease both}.section.is-hidden .header{opacity:60%}.section.is-hidden{background-color:var(--color-gray-50);border-radius:var(--radius-lg);outline-color:var(--color-gray-300);outline-style:var(--tw-outline-style);outline-width:1px;--tw-outline-style:dashed;outline-style:dashed}.ushortcuts.dark .section.is-hidden{background-color:var(--color-gray-800);outline-color:var(--color-gray-600)}.item-wrap.is-hidden .item{opacity:60%}.item-wrap.is-hidden{border-radius:var(--radius-md);outline-color:var(--color-gray-300);outline-style:var(--tw-outline-style);outline-width:1px;--tw-outline-style:dashed;outline-style:dashed}.ushortcuts.dark .item-wrap.is-hidden{outline-color:var(--color-gray-600)}.empty-msg{color:var(--color-gray-500);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2)}.ushortcuts.dark .empty-msg{color:var(--color-gray-400)}.segmented label.seg-item{min-width:50px;width:unset}.panel-split{border-color:var(--color-gray-200);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;display:flex;height:500px;max-height:70vh;overflow:hidden}.modal.dark .panel-split,.ushortcuts.dark .panel-split{border-color:var(--color-gray-700)}.panel-sidebar{background-color:var(--color-gray-50);border-color:var(--color-gray-200);border-right-style:var(--tw-border-style);border-right-width:1px;display:flex;flex:none;flex-direction:column;overflow-y:auto;width:160px}.modal.dark .panel-sidebar,.ushortcuts.dark .panel-sidebar{background-color:color-mix(in srgb,oklch(27.8% .033 256.848) 50%,transparent);border-color:var(--color-gray-700);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-gray-800) 50%,transparent)}}.sidebar-item{align-items:center;border-bottom-style:var(--tw-border-style);border-bottom-width:1px;border-color:var(--color-gray-100);cursor:pointer;display:flex;gap:calc(var(--spacing)*2);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:left;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.modal.dark .sidebar-item,.ushortcuts.dark .sidebar-item{border-color:color-mix(in srgb,oklch(37.3% .034 259.733) 50%,transparent);@supports (color:color-mix(in lab,red,red)){border-color:color-mix(in oklab,var(--color-gray-700) 50%,transparent)}&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.sidebar-item.active{background-color:var(--color-white);border-left:4px var(--tw-border-style) var(--color-blue-500);border-right-color:transparent;--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal.dark .sidebar-item.active,.ushortcuts.dark .sidebar-item.active{background-color:var(--color-gray-800);border-left-color:var(--color-blue-400)}.sidebar-item-name{display:block;font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));overflow:hidden;text-overflow:ellipsis;white-space:nowrap;--tw-font-weight:var(--font-weight-medium);color:var(--color-gray-900);font-weight:var(--font-weight-medium)}.modal.dark .sidebar-item-name,.ushortcuts.dark .sidebar-item-name{color:var(--color-gray-100)}.sidebar-item-desc{display:block;font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));margin-top:calc(var(--spacing)*.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;--tw-font-weight:var(--font-weight-normal);color:var(--color-gray-400);font-weight:var(--font-weight-normal)}.modal.dark .sidebar-item-desc,.ushortcuts.dark .sidebar-item-desc{color:var(--color-gray-500)}.sidebar-actions{background-color:var(--color-gray-50);border-color:var(--color-gray-200);border-top-style:var(--tw-border-style);border-top-width:1px;bottom:calc(var(--spacing)*0);display:flex;flex-direction:column;gap:calc(var(--spacing)*2);margin-top:auto;padding:calc(var(--spacing)*2);position:sticky}.modal.dark .sidebar-actions,.ushortcuts.dark .sidebar-actions{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.panel-content{background-color:var(--color-white);display:flex;flex:1;flex-direction:column;min-width:calc(var(--spacing)*0)}.modal.dark .panel-content,.ushortcuts.dark .panel-content{background-color:var(--color-gray-900)}.content-header{align-items:center;background-color:var(--color-white);border-bottom-style:var(--tw-border-style);border-bottom-width:1px;border-color:var(--color-gray-200);display:flex;justify-content:space-between;padding-block:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4);position:sticky;top:calc(var(--spacing)*0);z-index:10}.modal.dark .content-header,.ushortcuts.dark .content-header{background-color:var(--color-gray-900);border-color:var(--color-gray-700)}.content-title{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height));--tw-font-weight:var(--font-weight-bold);color:var(--color-gray-900);font-weight:var(--font-weight-bold)}.modal.dark .content-title,.ushortcuts.dark .content-title{color:var(--color-gray-100)}.content-tabs{background-color:color-mix(in srgb,oklch(98.5% .002 247.839) 50%,transparent);border-bottom-style:var(--tw-border-style);border-bottom-width:1px;border-color:var(--color-gray-200);display:flex;gap:calc(var(--spacing)*4);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-gray-50) 50%,transparent)}padding-inline:calc(var(--spacing)*4)}.modal.dark .content-tabs,.ushortcuts.dark .content-tabs{background-color:color-mix(in srgb,oklch(27.8% .033 256.848) 30%,transparent);border-color:var(--color-gray-700);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-gray-800) 30%,transparent)}}.tab-btn{border-bottom:2px var(--tw-border-style);border-color:transparent;cursor:pointer;font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));padding-block:calc(var(--spacing)*2);--tw-font-weight:var(--font-weight-medium);color:var(--color-gray-500);font-weight:var(--font-weight-medium);&:hover{@media (hover:hover){color:var(--color-gray-700)}}}.modal.dark .tab-btn,.ushortcuts.dark .tab-btn{color:var(--color-gray-400);&:hover{@media (hover:hover){color:var(--color-gray-200)}}}.tab-btn.active{border-color:var(--color-blue-500);color:var(--color-blue-600)}.modal.dark .tab-btn.active,.ushortcuts.dark .tab-btn.active{border-color:var(--color-blue-400);color:var(--color-blue-400)}.tab-pane{flex:1;overflow-y:auto;padding:calc(var(--spacing)*4)}.shortcut-list{display:flex;flex-direction:column;gap:calc(var(--spacing)*2)}.shortcut-item{align-items:center;background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;display:flex;gap:calc(var(--spacing)*3);padding:calc(var(--spacing)*2.5);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));&:hover{@media (hover:hover){border-color:var(--color-blue-300)}}&:hover{@media (hover:hover){--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}}.modal.dark .shortcut-item,.ushortcuts.dark .shortcut-item{background-color:var(--color-gray-800);border-color:var(--color-gray-700);&:hover{@media (hover:hover){border-color:var(--color-gray-600)}}}.shortcut-item.is-hidden{--tw-border-style:dashed;background-color:var(--color-gray-50);border-style:dashed;opacity:60%}.modal.dark .shortcut-item.is-hidden,.ushortcuts.dark .shortcut-item.is-hidden{background-color:color-mix(in srgb,oklch(27.8% .033 256.848) 50%,transparent);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-gray-800) 50%,transparent)}}.shortcut-icon{align-items:center;background-color:var(--color-gray-50);border-radius:var(--radius-md);color:var(--color-gray-500);display:flex;flex:none;height:calc(var(--spacing)*8);justify-content:center;overflow:hidden;width:calc(var(--spacing)*8)}.modal.dark .shortcut-icon,.ushortcuts.dark .shortcut-icon{background-color:var(--color-gray-700);color:var(--color-gray-400)}.shortcut-info{flex:1;min-width:calc(var(--spacing)*0)}.shortcut-name{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));overflow:hidden;text-overflow:ellipsis;white-space:nowrap;--tw-font-weight:var(--font-weight-medium);color:var(--color-gray-900);font-weight:var(--font-weight-medium)}.modal.dark .shortcut-name,.ushortcuts.dark .shortcut-name{color:var(--color-gray-100)}.shortcut-meta{align-items:center;color:var(--color-gray-400);display:flex;font-size:var(--text-xs);gap:calc(var(--spacing)*2);line-height:var(--tw-leading,var(--text-xs--line-height));margin-top:calc(var(--spacing)*.5)}.modal.dark .shortcut-meta,.ushortcuts.dark .shortcut-meta{color:var(--color-gray-500)}.shortcut-actions{align-items:center;display:flex;gap:calc(var(--spacing)*1);opacity:0;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function))}.group:hover .shortcut-actions{opacity:1}.shortcut-actions .icon-btn{height:calc(var(--spacing)*7);width:calc(var(--spacing)*7)}.items.mode-icon-only{display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*1.5);grid-template-columns:none}.items.mode-icon-only.layout-grid{display:grid;grid-template-columns:repeat(var(--cols,1),minmax(0,1fr))}.items.mode-icon-only .item{border-radius:var(--radius-lg);justify-content:center;padding:calc(var(--spacing)*1.5);width:auto;--tw-shadow:0 1px 2px 0 var(--tw-shadow-color,rgba(0,0,0,.05));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.items.mode-icon-only .title-text{display:none}.items.mode-icon-only.size-small .item{padding:calc(var(--spacing)*1)}.items.mode-icon-only.size-small .item .icon{height:calc(var(--spacing)*4);width:calc(var(--spacing)*4)}.items.mode-icon-only.size-medium .item{padding:calc(var(--spacing)*1.5)}.items.mode-icon-only.size-medium .item .icon{height:calc(var(--spacing)*5);width:calc(var(--spacing)*5)}.items.mode-icon-only.size-large .item{padding:calc(var(--spacing)*2)}.items.mode-icon-only.size-large .item .icon{height:calc(var(--spacing)*8);width:calc(var(--spacing)*8)}.items.mode-icon-only .item .icon img,.items.mode-icon-only .item .icon svg{height:100%;width:100%}.items.mode-title-only .icon{display:none}.dropdown-menu{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;font-family:var(--font-sans);font-size:13px;min-width:120px;padding-block:calc(var(--spacing)*1);position:fixed;z-index:2147483647;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ushortcuts.dark .dropdown-menu{background-color:var(--color-gray-900);border-color:var(--color-gray-700);--tw-shadow-color:color-mix(in srgb,#000 40%,transparent);@supports (color:color-mix(in lab,red,red)){--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-black) 40%,transparent) var(--tw-shadow-alpha),transparent)}}.dropdown-item{align-items:center;color:var(--color-gray-700);cursor:pointer;display:flex;gap:calc(var(--spacing)*2);padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*3);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.ushortcuts.dark .dropdown-item{color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}}.merge-options{display:flex;flex-direction:column;gap:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*4)}.merge-option{align-items:flex-start;border-color:var(--color-gray-200);border-radius:var(--radius-xl);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;display:flex;gap:calc(var(--spacing)*4);padding:calc(var(--spacing)*4);position:relative;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:200ms;transition-duration:.2s;&:hover{@media (hover:hover){border-color:var(--color-blue-500)}}&:hover{@media (hover:hover){background-color:color-mix(in srgb,oklch(97% .014 254.604) 50%,transparent);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-blue-50) 50%,transparent)}}}&:hover{@media (hover:hover){--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,rgba(0,0,0,.1)),0 2px 4px -2px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}&:active{scale:.98}}.ushortcuts.dark .merge-option{border-color:var(--color-gray-700);&:hover{@media (hover:hover){border-color:var(--color-blue-400)}}&:hover{@media (hover:hover){background-color:color-mix(in srgb,oklch(37.9% .146 265.522) 20%,transparent);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-blue-900) 20%,transparent)}}}}.merge-icon{background-color:var(--color-gray-100);border-radius:var(--radius-lg);color:var(--color-gray-500);flex:none;padding:calc(var(--spacing)*2);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function))}.ushortcuts.dark .merge-icon{background-color:var(--color-gray-800);color:var(--color-gray-400)}.merge-option:hover .merge-icon{background-color:var(--color-blue-100);color:var(--color-blue-600)}.ushortcuts.dark .merge-option:hover .merge-icon{background-color:color-mix(in srgb,oklch(37.9% .146 265.522) 40%,transparent);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-blue-900) 40%,transparent)}color:var(--color-blue-400)}.merge-content{display:flex;flex-direction:column;gap:calc(var(--spacing)*1);min-width:calc(var(--spacing)*0)}.merge-option strong{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height));--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-900);font-weight:var(--font-weight-semibold)}.ushortcuts.dark .merge-option strong{color:var(--color-gray-100)}.merge-option span{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));--tw-leading:var(--leading-relaxed);color:var(--color-gray-500);line-height:var(--leading-relaxed)}.ushortcuts.dark .merge-option span{color:var(--color-gray-400)}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-leading{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-duration:initial;--tw-font-weight:initial;--tw-leading:initial;--tw-tracking:initial}}'
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
  function xmlHttpRequest(options) {
    try {
      if (
        typeof GM !== 'undefined' &&
        typeof GM.xmlHttpRequest === 'function'
      ) {
        GM.xmlHttpRequest(options)
        return
      }
    } catch (e) {}
    try {
      if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest(options)
      }
    } catch (e) {}
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
  function shouldOpenInCurrentTab(e, target) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false
    if (target && target.target === '_blank') return false
    return true
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
  var originStatus = /* @__PURE__ */ new Map()
  var originQueue = /* @__PURE__ */ new Map()
  function getOrigin(url) {
    var _a
    try {
      return new URL(url, (_a = globalThis.location) == null ? void 0 : _a.href)
        .origin
    } catch (e) {
      return 'default'
    }
  }
  function flushOriginQueue(origin) {
    const queue = originQueue.get(origin) || []
    originQueue.delete(origin)
    for (const req of queue) {
      req()
    }
  }
  function fetchWithGmFallback(options) {
    const {
      method = 'GET',
      url,
      responseType,
      timeout,
      onload,
      onerror,
      ontimeout,
    } = options
    const origin = getOrigin(url)
    const status = originStatus.get(origin) || 'unknown'
    if (status === 'broken') {
      xmlHttpRequest(__spreadProps(__spreadValues({}, options), { method }))
      return
    }
    const performFetch = () => {
      void (async () => {
        const controller = new AbortController()
        let timeoutId
        if (timeout && timeout > 0) {
          timeoutId = setTimeout(() => {
            controller.abort()
          }, timeout)
        }
        try {
          const res = await fetch(url, { method, signal: controller.signal })
          if (timeoutId) clearTimeout(timeoutId)
          const currentStatus = originStatus.get(origin)
          if (currentStatus === 'testing') {
            originStatus.set(origin, 'working')
            flushOriginQueue(origin)
          }
          if (res.ok || res.status === 304) {
            let response
            let responseText
            switch (responseType) {
              case 'blob': {
                response = await res.blob()
                break
              }
              case 'json': {
                response = await res.json()
                responseText = JSON.stringify(response)
                break
              }
              case 'arraybuffer': {
                response = await res.arrayBuffer()
                break
              }
              default: {
                responseText = await res.text()
                response = responseText
                break
              }
            }
            onload == null
              ? void 0
              : onload({
                  status: res.status,
                  statusText: res.statusText,
                  response,
                  responseText,
                  finalUrl: res.url,
                })
            return
          }
          throw new Error('Fetch failed: '.concat(res.status))
        } catch (error) {
          if (timeoutId) clearTimeout(timeoutId)
          const isHttpError =
            error instanceof Error && error.message.startsWith('Fetch failed:')
          if (!isHttpError) {
            const currentStatus = originStatus.get(origin)
            if (currentStatus === 'testing') {
              originStatus.set(origin, 'broken')
              flushOriginQueue(origin)
            } else if (currentStatus === 'working') {
            }
          }
          xmlHttpRequest(__spreadProps(__spreadValues({}, options), { method }))
        }
      })()
    }
    if (status === 'working') {
      performFetch()
      return
    }
    if (status === 'testing') {
      const queue = originQueue.get(origin) || []
      queue.push(() => {
        fetchWithGmFallback(options)
      })
      originQueue.set(origin, queue)
      return
    }
    originStatus.set(origin, 'testing')
    performFetch()
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
  function getWrappedIconUrl(href, size = 64) {
    try {
      const url = new URL(href, location.origin).toString()
      if (url.startsWith('https://wsrv.nl/')) {
        return url
      }
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
  function getNewIconId() {
    return 0
  }
  function logIconPerf(id, icon, stage, extra) {}
  function createIconImage(src, className) {
    return c('img', {
      className,
      attrs: { width: '16', height: '16', src, loading: 'lazy' },
      style: { objectFit: 'contain' },
    })
  }
  var iconCache = /* @__PURE__ */ new Map()
  var STORAGE_KEY = 'utags_icon_cache'
  void (async () => {
    try {
      const stored = await getValue(STORAGE_KEY, {})
      if (stored) {
        for (const [key, value] of Object.entries(stored)) {
          if (!iconCache.has(key)) {
            iconCache.set(key, value)
          }
        }
      }
    } catch (e) {}
  })()
  var saveTimeoutId
  async function saveCache() {
    try {
      const stored = (await getValue(STORAGE_KEY, {})) || {}
      const merged = __spreadValues({}, stored)
      for (const [key, value] of iconCache) {
        merged[key] = value
      }
      await setValue(STORAGE_KEY, merged)
      for (const [key, value] of Object.entries(merged)) {
        if (!iconCache.has(key)) {
          iconCache.set(key, value)
        }
      }
    } catch (e) {}
  }
  function scheduleSaveCache() {
    if (saveTimeoutId) clearTimeout(saveTimeoutId)
    saveTimeoutId = setTimeout(() => {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(
          () => {
            void saveCache()
          },
          { timeout: 2e3 }
        )
      } else {
        void saveCache()
      }
    }, 3e3)
  }
  var lastSuccessfulCdnIndex = 0
  var cdnBases = [
    'https://cdn.jsdelivr.net/npm',
    'https://fastly.jsdelivr.net/npm',
    'https://unpkg.com',
  ]
  function injectLucideIcon(container, name, id) {
    try {
      const cached = iconCache.get(name)
      if (cached) {
        logIconPerf(id, name, 'cache-hit')
        const img = createIconImage(cached, 'lucide-icon')
        clearChildren(container)
        container.append(img)
        return
      }
    } catch (e) {}
    const orderedCdnIndices = [
      lastSuccessfulCdnIndex,
      ...[0, 1, 2].filter((i) => i !== lastSuccessfulCdnIndex),
    ]
    const tryFetch = (attempt) => {
      if (attempt >= orderedCdnIndices.length) {
        return
      }
      const cdnIndex = orderedCdnIndices[attempt]
      const cdnBase = cdnBases[cdnIndex]
      const url = ''
        .concat(cdnBase, '/lucide-static@latest/icons/')
        .concat(name, '.svg')
      logIconPerf(id, name, 'server-start', { url })
      try {
        fetchWithGmFallback({
          method: 'GET',
          url,
          timeout: 5e3,
          onload(res) {
            try {
              const svg = String(res.responseText || '')
              logIconPerf(id, name, 'server-end', { status: res.status, url })
              if (res.status >= 200 && res.status < 300 && svg) {
                const dataUrl =
                  'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
                iconCache.set(name, dataUrl)
                scheduleSaveCache()
                const img = createIconImage(dataUrl, 'lucide-icon')
                clearChildren(container)
                container.append(img)
                lastSuccessfulCdnIndex = cdnIndex
              } else {
                tryFetch(attempt + 1)
              }
            } catch (e) {
              tryFetch(attempt + 1)
            }
          },
          onerror() {
            tryFetch(attempt + 1)
          },
          ontimeout() {
            tryFetch(attempt + 1)
          },
        })
      } catch (e) {
        tryFetch(attempt + 1)
      }
    }
    tryFetch(0)
  }
  function injectImageAsData(container, url, id) {
    try {
      const cached = iconCache.get(url)
      if (cached) {
        logIconPerf(id, url, 'cache-hit')
        const img = createIconImage(cached)
        clearChildren(container)
        container.append(img)
        return
      }
      logIconPerf(id, url, 'server-start', { url })
      fetchWithGmFallback({
        method: 'GET',
        url,
        timeout: 5e3,
        responseType: 'blob',
        onload(res) {
          try {
            const blob = res.response
            if (!blob) return
            const reader = new FileReader()
            reader.addEventListener('load', () => {
              logIconPerf(id, url, 'server-end', { status: 200, url })
              const result = String(reader.result || '')
              iconCache.set(url, result)
              scheduleSaveCache()
              const img = createIconImage(result)
              clearChildren(container)
              container.append(img)
            })
            reader.readAsDataURL(blob)
          } catch (e) {}
        },
      })
    } catch (e) {}
  }
  function renderIcon(s) {
    const span = c('span', { className: 'icon' })
    let t = String(s || '').trim()
    if (!t) t = 'lucide:link'
    const id = getNewIconId()
    logIconPerf(id, t, 'start')
    if (t.startsWith('lucide:')) {
      const k = t.split(':')[1]
      injectLucideIcon(span, k, id)
      return span
    }
    if (t.startsWith('url:')) {
      const url = t.slice(4)
      injectImageAsData(span, getWrappedIconUrl(url), id)
      return span
    }
    if (t.startsWith('svg:')) {
      try {
        const svg = t.slice(4)
        const url =
          'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
        const img = createIconImage(url)
        clearChildren(span)
        span.append(img)
      } catch (e) {}
      logIconPerf(id, t, 'cache-hit')
      return span
    }
    span.textContent = t
    logIconPerf(id, t, 'cache-hit')
    return span
  }
  function setIcon(el, icon, title) {
    try {
      clearChildren(el)
      el.append(renderIcon(icon))
      if (title !== void 0) el.title = title
    } catch (e) {}
  }
  var win = globalThis
  function isTopFrame() {
    return win.self === win.top
  }
  var ProgressBar = class {
    constructor() {
      this.el = document.createElement('div')
      this.el.style.cssText =
        '\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 0%;\n      height: 3px;\n      background: #0969da;\n      z-index: 2147483647;\n      transition: width 0.2s, opacity 0.2s;\n      opacity: 0;\n      pointer-events: none;\n    '
      document.body.append(this.el)
    }
    start() {
      this.el.style.transition = 'width 0.2s, opacity 0.2s'
      this.el.style.opacity = '1'
      this.el.style.width = '0%'
      void this.el.getBoundingClientRect()
      this.el.style.width = '30%'
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        const w = Number.parseFloat(this.el.style.width) || 0
        if (w < 90) {
          this.el.style.width = w + (90 - w) * 0.1 + '%'
        }
      }, 200)
    }
    finish() {
      if (this.timer) clearInterval(this.timer)
      this.el.style.width = '100%'
      setTimeout(() => {
        this.el.style.opacity = '0'
        setTimeout(() => {
          this.el.style.width = '0%'
        }, 200)
      }, 200)
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
  function isSameOrigin(url, baseHref) {
    try {
      const base = baseHref != null ? baseHref : win.location.href
      const target = new URL(url, base)
      const baseUrl = new URL(base)
      return target.origin === baseUrl.origin
    } catch (e) {
      return false
    }
  }
  var progressBar
  function isVueApp() {
    return false
  }
  function isSpa() {
    return doc.querySelector('.ember-application') !== null || isVueApp()
  }
  function isForceLocationAssign(url) {
    const rules = [
      'https://linux.do/challenge?redirect=',
      'https://linux.do/?safe_mode=',
    ]
    return rules.some((rule) => url.includes(rule))
  }
  function navigateUrl(url) {
    if (!progressBar) {
      progressBar = new ProgressBar()
    }
    progressBar.start()
    try {
      if (isSameOrigin(url) && !isForceLocationAssign(url)) {
        if (
          document.querySelector('script[src*="/_next/"],link[href*="/_next/"]')
        ) {
          try {
            const key = 'ushortcutsNextNavigated'
            const code =
              "\n            try {\n            console.log('window.next', window.next)\n              if (window.next && window.next.router && typeof window.next.router.push === 'function') {\n                window.next.router.push("
                .concat(
                  JSON.stringify(url),
                  ");\n                document.documentElement.dataset['"
                )
                .concat(
                  key,
                  "'] = '1';\n              }\n            } catch (e) {}\n          "
                )
            const s = document.createElement('script')
            s.textContent = code
            document.documentElement.append(s)
            s.remove()
            if (document.documentElement.dataset[key] === '1') {
              delete document.documentElement.dataset[key]
              setTimeout(() => {
                progressBar == null ? void 0 : progressBar.finish()
              }, 800)
              return
            }
          } catch (e) {}
        }
        console.log('isSpa', isSpa())
        if (isSpa()) {
          win.history.pushState(null, '', url)
          win.dispatchEvent(new PopStateEvent('popstate'))
          win.scrollTo(0, 0)
          setTimeout(() => {
            progressBar == null ? void 0 : progressBar.finish()
          }, 800)
          return
        }
      }
    } catch (e) {}
    win.location.assign(url)
  }
  function uid() {
    return Math.random().toString(36).slice(2, 10)
  }
  function watchTitleChange(callback) {
    try {
      const titleObserver = new MutationObserver(() => {
        callback()
      })
      let currentTitle
      const updateTitleObserver = () => {
        var _a
        const titleEl =
          (_a = document.querySelector('title')) != null ? _a : void 0
        if (titleEl === currentTitle) return
        if (currentTitle) {
          titleObserver.disconnect()
        }
        currentTitle = titleEl
        if (currentTitle) {
          titleObserver.observe(currentTitle, {
            childList: true,
            subtree: true,
            characterData: true,
          })
          callback()
        }
      }
      updateTitleObserver()
      const headObserver = new MutationObserver(updateTitleObserver)
      if (document.head) {
        headObserver.observe(document.head, { childList: true })
      }
      return () => {
        titleObserver.disconnect()
        headObserver.disconnect()
      }
    } catch (e) {
      return () => {}
    }
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
  function createSegmentedRadios(initial, values, onChange, opts) {
    var _a, _b
    const wrap = document.createElement('div')
    wrap.className = 'segmented'
    const name =
      ((opts == null ? void 0 : opts.namePrefix) || 'ushortcuts-seg-') + uid()
    const labels = (_a = opts == null ? void 0 : opts.labels) != null ? _a : {}
    for (const m of values) {
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
      text.textContent = (_b = labels[m]) != null ? _b : String(m)
      label.append(input)
      label.append(text)
      wrap.append(label)
    }
    return wrap
  }
  function createOpenModeRadios(initial, onChange, opts) {
    var _a
    const labels =
      (_a = opts == null ? void 0 : opts.labels) != null
        ? _a
        : {
            'same-tab': '\u5F53\u524D\u9875',
            'new-tab': '\u65B0\u6807\u7B7E\u9875',
          }
    const hasInherit = Boolean(opts == null ? void 0 : opts.inheritLabel)
    const values = hasInherit
      ? ['inherit', 'same-tab', 'new-tab']
      : ['same-tab', 'new-tab']
    const current =
      initial === 'same-tab' || initial === 'new-tab'
        ? initial
        : hasInherit
          ? 'inherit'
          : 'same-tab'
    const labelMap = __spreadValues({}, labels)
    if (hasInherit && (opts == null ? void 0 : opts.inheritLabel)) {
      labelMap.inherit = opts.inheritLabel
    }
    return createSegmentedRadios(
      current,
      values,
      (v) => {
        if (v === 'inherit') onChange(void 0)
        else onChange(v)
      },
      {
        labels: labelMap,
        namePrefix: 'ushortcuts-open-',
      }
    )
  }
  function detectIconKind(v, kinds) {
    const s = String(v || '').trim()
    if (kinds.includes('favicon') && s.startsWith('favicon')) return 'favicon'
    if (s.startsWith('url:')) return 'url'
    if (s.includes(':')) return 'icon'
    if (s) return 'emoji'
    return 'icon'
  }
  function createIconInput(initialValue, kinds, opts) {
    var _a
    const wrap = document.createElement('div')
    wrap.style.flex = '1'
    const inputContainer = document.createElement('div')
    inputContainer.style.display = 'flex'
    inputContainer.style.alignItems = 'center'
    inputContainer.style.gap = '0.5em'
    const preview = document.createElement('span')
    preview.style.display = 'inline-flex'
    preview.style.alignItems = 'center'
    preview.style.justifyContent = 'center'
    preview.style.width = '1.5em'
    preview.style.height = '1.em'
    const input = document.createElement('input')
    try {
      input.style.width = '100%'
    } catch (e) {}
    inputContainer.append(preview)
    inputContainer.append(input)
    const help = document.createElement('div')
    help.className = 'field-help'
    try {
      help.style.marginLeft = '0'
      help.style.marginTop = '0.8em'
    } catch (e) {}
    let kind = detectIconKind(initialValue, kinds)
    const radios = createSegmentedRadios(
      kind,
      kinds,
      (v) => {
        kind = v
        syncPlaceholder()
        input.value = ''
        if (typeof (opts == null ? void 0 : opts.onKindChange) === 'function')
          opts.onKindChange(kind)
        updatePreview()
        syncHelp()
      },
      {
        labels: (_a = opts == null ? void 0 : opts.labels) != null ? _a : {},
        namePrefix: opts == null ? void 0 : opts.namePrefix,
      }
    )
    function syncPlaceholder() {
      var _a2, _b, _c, _d, _e
      const p =
        (_a2 = opts == null ? void 0 : opts.placeholders) != null ? _a2 : {}
      input.placeholder =
        kind === 'icon'
          ? (_b = p.icon) != null
            ? _b
            : 'home | search | folder | file | ...'
          : kind === 'favicon'
            ? (_c = p.favicon) != null
              ? _c
              : '16 | 32 | 64'
            : kind === 'url'
              ? (_d = p.url) != null
                ? _d
                : 'https://...'
              : (_e = p.emoji) != null
                ? _e
                : '\u{1F525} | \u{1F353} | \u{1F3BE} | ...'
    }
    {
      const raw = String(initialValue || '')
      let shown = raw
      switch (kind) {
        case 'icon': {
          shown = raw.includes(':') ? raw.split(':').pop() || '' : raw
          break
        }
        case 'favicon': {
          if (raw.startsWith('favicon')) {
            const param = raw.split(':')[1]
            shown = param || ''
          }
          break
        }
        case 'url': {
          shown = raw.startsWith('url:') ? raw.slice(4) : raw
          break
        }
        case 'emoji': {
          shown = raw
          break
        }
      }
      input.value = shown
    }
    const debouncedUpdatePreview = debounce(updatePreview, 500)
    input.addEventListener('change', () => {
      debouncedUpdatePreview()
      if (typeof (opts == null ? void 0 : opts.onValueChange) === 'function') {
        opts.onValueChange(input.value)
      }
    })
    input.addEventListener('input', () => {
      debouncedUpdatePreview()
    })
    syncPlaceholder()
    updatePreview()
    syncHelp()
    const br = document.createElement('div')
    br.style.flexBasis = '100%'
    wrap.append(radios)
    wrap.append(br)
    wrap.append(inputContainer)
    wrap.append(help)
    function updatePreview() {
      const finalValue = getFinalValue()
      clearChildren(preview)
      if (finalValue && !finalValue.startsWith('favicon')) {
        setIcon(preview, finalValue)
      }
    }
    function getFinalValue() {
      const raw = input.value.trim()
      if (!raw && kind !== 'favicon') return void 0
      switch (kind) {
        case 'icon': {
          return raw.includes(':') ? raw : 'lucide:' + raw
        }
        case 'favicon': {
          const sizeNum = Number.parseInt(raw, 10)
          const s =
            sizeNum === 16 ? 16 : sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
          return 'favicon' + (raw ? ':' + String(s) : '')
        }
        case 'url': {
          return raw.startsWith('url:') ? raw : 'url:' + raw
        }
        case 'emoji': {
          return raw
        }
      }
    }
    function syncHelp() {
      clearChildren(help)
      switch (kind) {
        case 'icon': {
          const line = document.createElement('div')
          line.append('\u67E5\u627E\u56FE\u6807\uFF1A ')
          const a = document.createElement('a')
          a.href = 'https://lucide.dev/icons/'
          a.target = '_blank'
          a.rel = 'noopener noreferrer'
          a.textContent = 'https://lucide.dev/icons/'
          line.append(a)
          help.append(line)
          break
        }
        case 'favicon': {
          const line = document.createElement('div')
          line.textContent = '\u65E0\u9884\u89C8\u6548\u679C'
          help.append(line)
          break
        }
        case 'url': {
          const line = document.createElement('div')
          line.textContent = '\u8BF7\u8F93\u5165\u56FE\u7247 URL'
          help.append(line)
          break
        }
        case 'emoji': {
          const line = document.createElement('div')
          line.textContent = '\u8BF7\u8F93\u5165\u4E00\u4E2A emoji'
          help.append(line)
          break
        }
      }
    }
    return {
      el: wrap,
      input,
      radios,
      getKind: () => kind,
      setKind(k) {
        kind = k
        syncPlaceholder()
      },
      getRaw: () => input.value,
      getFinal: getFinalValue,
    }
  }
  function renderVariableTable(container, options) {
    let variables = options.initialValue ? [...options.initialValue] : []
    if (variables.length === 0) {
      variables.push({ id: uid(), key: '', value: '' })
    }
    const notifyChange = () => {
      const valid = variables.length === 0 ? void 0 : [...variables]
      options.onChange(valid)
    }
    const host = c('div', { className: 'variable-table-host' })
    const shadow = host.attachShadow({ mode: 'open' })
    const style = c('style')
    style.textContent =
      '\n    :host {\n      display: block;\n      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n      font-size: 14px;\n      line-height: 1.5;\n      color: #374151;\n    }\n    *, *::before, *::after {\n      box-sizing: border-box;\n    }\n    .var-table {\n      display: flex;\n      flex-direction: column;\n      gap: 0.75rem;\n      width: 100%;\n    }\n    .var-table-body {\n      display: flex;\n      flex-direction: column;\n      gap: 0.75rem;\n    }\n    .row {\n      display: grid;\n      grid-template-columns: 1fr 1fr 32px;\n      gap: 0.75rem;\n      align-items: center;\n    }\n    .header {\n      font-size: 0.75rem;\n      text-transform: uppercase;\n      letter-spacing: 0.05em;\n      color: #6b7280;\n      font-weight: 600;\n      padding-bottom: 0.25rem;\n    }\n    .col-key, .col-val {\n      min-width: 0;\n    }\n    input {\n      display: block;\n      width: 100%;\n      padding: 0.5rem 0.75rem;\n      font-size: 0.875rem;\n      line-height: 1.25rem;\n      color: #1f2937;\n      background-color: #f9fafb;\n      border: 1px solid #e5e7eb;\n      border-radius: 0.5rem;\n      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n      transition: all 0.15s ease-in-out;\n    }\n    input:focus {\n      background-color: #fff;\n      outline: none;\n      border-color: #3b82f6;\n      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n    }\n    input::placeholder {\n      color: #9ca3af;\n    }\n    .icon-btn {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: 2rem;\n      height: 2rem;\n      padding: 0;\n      background-color: transparent;\n      border: 1px solid transparent;\n      border-radius: 0.375rem;\n      color: #9ca3af;\n      cursor: pointer;\n      transition: all 0.2s;\n    }\n    .icon-btn:hover {\n      background-color: #fee2e2;\n      color: #ef4444;\n    }\n    .add-btn {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      gap: 0.5rem;\n      width: 100%;\n      padding: 0.625rem;\n      margin-top: 0.5rem;\n      font-size: 0.875rem;\n      font-weight: 500;\n      color: #4b5563;\n      background-color: #fff;\n      border: 1px dashed #d1d5db;\n      border-radius: 0.5rem;\n      cursor: pointer;\n      transition: all 0.2s;\n    }\n    .add-btn:hover {\n      background-color: #f9fafb;\n      border-color: #9ca3af;\n      color: #111827;\n    }\n    /* Icon styling adjustments for inside shadow DOM */\n    .icon-btn img, .add-btn img {\n      display: block;\n      width: 16px;\n      height: 16px;\n    }\n  '
    shadow.append(style)
    const table = c('div', { className: 'var-table' })
    const body = c('div', { className: 'var-table-body' })
    const header = c('div', { className: 'row header' })
    header.append(
      c('div', { className: 'col-key', text: '\u53D8\u91CF\u540D (Name)' }),
      c('div', { className: 'col-val', text: '\u503C (Value)' }),
      c('div', { className: 'col-act', text: '' })
    )
    table.append(header)
    table.append(body)
    const rowMap = /* @__PURE__ */ new Map()
    const renderRow = (v) => {
      const row = c('div', { className: 'row' })
      row.dataset.id = v.id
      const keyInput = c('input', {
        type: 'text',
        className: 'input-key',
        value: v.key,
        placeholder: 'key (e.g. api_key)',
      })
      keyInput.addEventListener('change', () => {
        const current = variables.find((x) => x.id === v.id)
        if (current) {
          current.key = keyInput.value.trim()
          notifyChange()
        }
      })
      const valInput = c('input', {
        type: 'text',
        className: 'input-val',
        value: v.value,
        placeholder: 'value',
      })
      valInput.addEventListener('change', () => {
        const current = variables.find((x) => x.id === v.id)
        if (current) {
          current.value = valInput.value
          notifyChange()
        }
      })
      const delBtn = c('button', {
        className: 'icon-btn',
        attrs: { title: '\u5220\u9664\u53D8\u91CF' },
      })
      setIcon(delBtn, 'lucide:trash-2')
      delBtn.addEventListener('click', () => {
        variables = variables.filter((x) => x.id !== v.id)
        notifyChange()
        if (variables.length === 0) {
          variables.push({ id: uid(), key: '', value: '' })
          renderAll()
        } else {
          row.remove()
          rowMap.delete(v.id)
        }
      })
      row.append(
        c('div', { className: 'col-key', children: [keyInput] }),
        c('div', { className: 'col-val', children: [valInput] }),
        c('div', { className: 'col-act', children: [delBtn] })
      )
      return row
    }
    const renderAll = () => {
      const currentIds = new Set(variables.map((v) => v.id))
      for (const [id, row] of rowMap) {
        if (!currentIds.has(id)) {
          row.remove()
          rowMap.delete(id)
        }
      }
      let nextSibling = body.firstElementChild
      for (const v of variables) {
        let row = rowMap.get(v.id)
        if (row) {
          const keyInput = row.querySelector('.input-key')
          const valInput = row.querySelector('.input-val')
          if (keyInput && keyInput.value !== v.key) keyInput.value = v.key
          if (valInput && valInput.value !== v.value) valInput.value = v.value
        } else {
          row = renderRow(v)
          rowMap.set(v.id, row)
        }
        if (row === nextSibling) {
          nextSibling = nextSibling.nextElementSibling
        } else if (nextSibling) {
          nextSibling.before(row)
        } else {
          body.append(row)
        }
      }
    }
    renderAll()
    const addBtn = c('button', {
      className: 'add-btn',
      text: '\u6DFB\u52A0\u53D8\u91CF',
    })
    setIcon(addBtn, 'lucide:plus')
    addBtn.addEventListener('click', () => {
      setTimeout(() => {
        const newVar = { id: uid(), key: '', value: '' }
        variables.push(newVar)
        notifyChange()
        renderAll()
        const row = rowMap.get(newVar.id)
        if (!row) return
        const keyInput = row.querySelector('.input-key')
        keyInput.focus()
      }, 10)
    })
    table.append(addBtn)
    shadow.append(table)
    container.append(host)
    return {
      update(newValue) {
        variables = newValue ? [...newValue] : []
        if (variables.length === 0) {
          variables.push({ id: uid(), key: '', value: '' })
        }
        renderAll()
      },
    }
  }
  function renderGroupForm(container, data, options) {
    var _a
    const grid = document.createElement('div')
    grid.className = 'grid'
    try {
      grid.style.gridTemplateColumns = '1fr'
    } catch (e) {}
    const notifyChange = () => {
      if (options.onChange) options.onChange()
    }
    const nameRow = document.createElement('div')
    nameRow.className = 'row'
    const nameLabel = document.createElement('label')
    nameLabel.textContent = '\u7EC4\u540D'
    const nameInput = document.createElement('input')
    nameInput.value = data.name || ''
    nameInput.addEventListener('input', () => {
      data.name = nameInput.value
      if (!displayToggle.checked) {
        displayInput.value = nameInput.value
      }
      notifyChange()
    })
    nameRow.append(nameLabel)
    nameRow.append(nameInput)
    const displayRow = document.createElement('div')
    displayRow.className = 'row'
    const displayLabel = document.createElement('label')
    displayLabel.textContent = '\u663E\u793A\u7EC4\u540D'
    const displayInput = document.createElement('input')
    const displayCtrl = document.createElement('label')
    displayCtrl.className = 'check'
    const displayToggle = document.createElement('input')
    displayToggle.type = 'checkbox'
    const displayText = document.createElement('span')
    displayText.textContent = '\u81EA\u5B9A\u4E49'
    displayCtrl.append(displayToggle)
    displayCtrl.append(displayText)
    const hasCustomDisplay =
      typeof data.displayName === 'string' && data.displayName !== data.name
    displayToggle.checked = Boolean(hasCustomDisplay)
    displayInput.value = hasCustomDisplay
      ? data.displayName || ''
      : data.name || nameInput.value
    displayInput.disabled = !displayToggle.checked
    const updateDisplay = () => {
      if (displayToggle.checked) {
        data.displayName = displayInput.value
        displayInput.disabled = false
      } else {
        delete data.displayName
        displayInput.value = nameInput.value
        displayInput.disabled = true
      }
      notifyChange()
    }
    displayInput.addEventListener('input', updateDisplay)
    displayToggle.addEventListener('change', updateDisplay)
    displayRow.append(displayLabel)
    displayRow.append(displayInput)
    displayRow.append(displayCtrl)
    const iconRow = document.createElement('div')
    iconRow.className = 'row'
    const iconLabel = document.createElement('label')
    iconLabel.textContent = '\u56FE\u6807'
    const iconComp = createIconInput(
      data.icon || 'lucide:folder',
      ['icon', 'url', 'emoji'],
      {
        labels: { icon: '\u56FE\u6807', url: 'URL', emoji: 'Emoji' },
        namePrefix: 'ushortcuts-group-icon-kind-' + (data.id || Math.random()),
        onValueChange() {
          data.icon = iconComp.getFinal()
          notifyChange()
        },
        onKindChange() {
          data.icon = iconComp.getFinal()
          notifyChange()
        },
      }
    )
    iconRow.append(iconLabel)
    iconRow.append(iconComp.el)
    const ruleRow = document.createElement('div')
    ruleRow.className = 'row'
    const ruleLabel = document.createElement('label')
    ruleLabel.textContent = 'URL \u89C4\u5219'
    const ta = document.createElement('textarea')
    const host = location.hostname || ''
    const defaultMatch = ['*://' + host + '/*']
    ta.value = (
      data.match && data.match.length > 0 ? data.match : defaultMatch
    ).join('\n')
    const updateMatch = () => {
      data.match = ta.value
        .split(/\n+/)
        .map((v) => v.trim())
        .filter(Boolean)
      notifyChange()
    }
    ta.addEventListener('change', updateMatch)
    ruleRow.append(ruleLabel)
    ruleRow.append(ta)
    function escRe(s) {
      let out = ''
      const specials = '\\^$.*+?()[]{}|'
      for (const ch of s) out += specials.includes(ch) ? '\\' + ch : ch
      return out
    }
    function regexHostAll(h) {
      const hh = escRe(h)
      return '/.+://'.concat(hh, '/.*$/')
    }
    function regexHostDir(h, d) {
      const hh = escRe(h)
      const dd = escRe(d)
      return '/.+://'.concat(hh).concat(dd, '.*$/')
    }
    function regexHostPath(h, p) {
      const hh = escRe(h)
      const pp = escRe(p)
      return '/.+://'.concat(hh).concat(pp, '$/')
    }
    const tplRow = document.createElement('div')
    tplRow.className = 'row'
    const tplLabel = document.createElement('label')
    tplLabel.textContent = '\u89C4\u5219\u6A21\u677F'
    const tplSel = document.createElement('select')
    const pathname = location.pathname || '/'
    const dir = pathname.endsWith('/')
      ? pathname
      : pathname.replace(/[^/]+$/, '')
    const opts = [
      {
        v: '*://'.concat(host, '/*'),
        t: '\u5F53\u524D\u57DF\u540D\u6240\u6709\u9875\u9762',
      },
      {
        v: '*://'.concat(host).concat(dir, '*'),
        t: '\u5F53\u524D\u8DEF\u5F84\u524D\u7F00',
      },
      {
        v: '*://'.concat(host).concat(pathname),
        t: '\u5F53\u524D\u5B8C\u6574\u8DEF\u5F84',
      },
      { v: '*', t: '\u4EFB\u610F\u57DF\u540D\u6240\u6709\u9875\u9762' },
      {
        v: regexHostAll(host),
        t: '\u6B63\u5219\uFF1A\u5F53\u524D\u57DF\u540D\u6240\u6709\u9875\u9762',
      },
      {
        v: regexHostDir(host, dir),
        t: '\u6B63\u5219\uFF1A\u5F53\u524D\u8DEF\u5F84\u524D\u7F00',
      },
      {
        v: regexHostPath(host, pathname),
        t: '\u6B63\u5219\uFF1A\u5F53\u524D\u5B8C\u6574\u8DEF\u5F84',
      },
    ]
    for (const it of opts) {
      const o = document.createElement('option')
      o.value = it.v
      o.textContent = it.t
      tplSel.append(o)
    }
    tplSel.addEventListener('change', () => {
      ta.value = tplSel.value
      updateMatch()
    })
    tplRow.append(tplLabel)
    tplRow.append(tplSel)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F'
    const openRadios = createOpenModeRadios(
      data.defaultOpen,
      (m) => {
        data.defaultOpen = m
        notifyChange()
      },
      { inheritLabel: '\u8DDF\u968F\u7AD9\u70B9\u8BBE\u7F6E' }
    )
    openRow.append(openLabel)
    openRow.append(openRadios)
    const colsRow = document.createElement('div')
    colsRow.className = 'row'
    const colsLabel = document.createElement('label')
    colsLabel.textContent = '\u6BCF\u884C\u663E\u793A\u4E2A\u6570'
    let colVal = String((_a = data.itemsPerRow) != null ? _a : 1)
    const colsRadios = createSegmentedRadios(
      colVal,
      ['1', '2', '3', '4', '5', '6'],
      (v) => {
        colVal = v
        data.itemsPerRow = Number.parseInt(v, 10)
        notifyChange()
      },
      { namePrefix: 'ushortcuts-cols-' + (data.id || Math.random()) }
    )
    colsRow.append(colsLabel)
    colsRow.append(colsRadios)
    const displayStyleRow = document.createElement('div')
    displayStyleRow.className = 'row'
    const displayStyleLabel = document.createElement('label')
    displayStyleLabel.textContent = '\u663E\u793A\u98CE\u683C'
    const displayStyleRadios = createSegmentedRadios(
      data.displayStyle || 'icon-title',
      ['icon-title', 'icon-only', 'title-only'],
      (v) => {
        data.displayStyle = v
        updateVisibility()
        notifyChange()
      },
      {
        labels: {
          'icon-title': '\u56FE\u6807+\u6807\u9898',
          'icon-only': '\u4EC5\u56FE\u6807',
          'title-only': '\u4EC5\u6807\u9898',
        },
        namePrefix: 'ushortcuts-display-style-' + (data.id || Math.random()),
      }
    )
    displayStyleRow.append(displayStyleLabel)
    displayStyleRow.append(displayStyleRadios)
    const iconColsRow = document.createElement('div')
    iconColsRow.className = 'row'
    const iconColsLabel = document.createElement('label')
    iconColsLabel.textContent = '\u6BCF\u884C\u56FE\u6807\u6570'
    const iconColVal = String(data.iconItemsPerRow || 0)
    const iconColsRadios = createSegmentedRadios(
      iconColVal === '0' ? 'Auto' : iconColVal,
      ['Auto', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      (v) => {
        data.iconItemsPerRow = v === 'Auto' ? 0 : Number.parseInt(v, 10)
        notifyChange()
      },
      { namePrefix: 'ushortcuts-icon-cols-' + (data.id || Math.random()) }
    )
    iconColsRadios.classList.add('segmented-compact')
    iconColsRow.append(iconColsLabel)
    iconColsRow.append(iconColsRadios)
    const iconSizeRow = document.createElement('div')
    iconSizeRow.className = 'row'
    const iconSizeLabel = document.createElement('label')
    iconSizeLabel.textContent = '\u56FE\u6807\u5927\u5C0F'
    const iconSizeRadios = createSegmentedRadios(
      data.iconSize || 'medium',
      ['small', 'medium', 'large'],
      (v) => {
        data.iconSize = v
        notifyChange()
      },
      {
        labels: { small: '\u5C0F', medium: '\u4E2D', large: '\u5927' },
        namePrefix: 'ushortcuts-icon-size-' + (data.id || Math.random()),
      }
    )
    iconSizeRow.append(iconSizeLabel)
    iconSizeRow.append(iconSizeRadios)
    const updateVisibility = () => {
      const style = data.displayStyle || 'icon-title'
      const isIconOnly = style === 'icon-only'
      colsRow.style.display = isIconOnly ? 'none' : ''
      iconColsRow.style.display = isIconOnly ? '' : 'none'
      iconSizeRow.style.display = isIconOnly ? '' : 'none'
    }
    updateVisibility()
    const stateRow = document.createElement('div')
    stateRow.className = 'row'
    const stateLabel = document.createElement('label')
    stateLabel.textContent = '\u5206\u7EC4\u663E\u793A\u72B6\u6001'
    let groupState = data.hidden ? 'hidden' : 'visible'
    const stateRadios = createSegmentedRadios(
      groupState,
      ['visible', 'hidden'],
      (v) => {
        groupState = v
        data.hidden = v === 'hidden'
        notifyChange()
      },
      {
        labels: { visible: '\u663E\u793A', hidden: '\u9690\u85CF' },
        namePrefix: 'ushortcuts-state-' + (data.id || Math.random()),
      }
    )
    stateRow.append(stateLabel)
    stateRow.append(stateRadios)
    grid.append(nameRow)
    grid.append(displayRow)
    grid.append(iconRow)
    grid.append(tplRow)
    grid.append(ruleRow)
    grid.append(openRow)
    grid.append(colsRow)
    grid.append(displayStyleRow)
    grid.append(iconColsRow)
    grid.append(iconSizeRow)
    grid.append(stateRow)
    const varsRow = document.createElement('div')
    varsRow.className = 'row'
    const varsLabel = document.createElement('label')
    varsLabel.textContent = '\u5206\u7EC4\u53D8\u91CF'
    const varsContent = document.createElement('div')
    varsContent.style.width = '100%'
    varsContent.style.display = 'flex'
    varsContent.style.flexDirection = 'column'
    varsContent.style.gap = '0.5rem'
    const varsHelp = document.createElement('div')
    varsHelp.className = 'desc'
    varsHelp.textContent =
      '\u5B9A\u4E49\u5206\u7EC4\u53EF\u7528\u7684\u53D8\u91CF\uFF0C\u53EF\u5728 URL \u6216\u811A\u672C\u4E2D\u4F7F\u7528 {v:key} \u5F15\u7528\u3002\u4F18\u5148\u7EA7\u9AD8\u4E8E\u7AD9\u70B9\u53D8\u91CF\u4E0E\u5168\u5C40\u53D8\u91CF\u3002'
    varsHelp.style.fontSize = '12px'
    varsHelp.style.color = '#6b7280'
    const varsContainer = document.createElement('div')
    varsContainer.style.width = '100%'
    renderVariableTable(varsContainer, {
      initialValue: data.variables || [],
      onChange(val) {
        data.variables = val
        notifyChange()
      },
    })
    varsContent.append(varsHelp, varsContainer)
    varsRow.append(varsLabel)
    varsRow.append(varsContent)
    grid.append(varsRow)
    container.append(grid)
    return {
      nameInput,
    }
  }
  function createModalFrame(options) {
    const { root, title, onClose } = options
    const previousFocus = root.activeElement || document.activeElement
    for (const n of Array.from(root.querySelectorAll('.modal-mask'))) n.remove()
    const mask = document.createElement('div')
    mask.className = 'modal-mask'
    try {
      mask.style.zIndex = '2147483647'
    } catch (e) {}
    mask.addEventListener('keydown', (e) => {
      e.stopPropagation()
    })
    const modal = document.createElement('div')
    modal.className = 'modal'
    modal.style.overscrollBehavior = 'contain'
    modal.tabIndex = -1
    try {
      const panel = root.querySelector('.ushortcuts')
      const isDarkPanel =
        panel == null ? void 0 : panel.classList.contains('dark')
      const prefersDark = (() => {
        var _a, _b
        try {
          return (_b =
            (_a = globalThis.matchMedia) == null
              ? void 0
              : _a.call(globalThis, '(prefers-color-scheme: dark)')) == null
            ? void 0
            : _b.matches
        } catch (e) {
          return false
        }
      })()
      if (isDarkPanel || prefersDark) modal.classList.add('dark')
    } catch (e) {}
    const h2 = document.createElement('h2')
    h2.textContent = title
    modal.append(h2)
    const body = document.createElement('div')
    modal.append(body)
    const actions = document.createElement('div')
    actions.className = 'row actions'
    modal.append(actions)
    mask.append(modal)
    root.append(mask)
    const preventBackgroundScroll = (e) => {
      const path = e.composedPath()
      if (!path.includes(modal)) {
        e.preventDefault()
      }
    }
    document.addEventListener('wheel', preventBackgroundScroll, {
      passive: false,
    })
    document.addEventListener('touchmove', preventBackgroundScroll, {
      passive: false,
    })
    const close = () => {
      try {
        mask.remove()
      } catch (e) {}
      try {
        document.removeEventListener('keydown', onKey, true)
        document.removeEventListener('wheel', preventBackgroundScroll)
        document.removeEventListener('touchmove', preventBackgroundScroll)
      } catch (e) {}
      if (onClose) onClose()
      try {
        if (previousFocus && 'focus' in previousFocus) {
          previousFocus.focus()
        }
      } catch (e) {}
    }
    const onKey = (e) => {
      const visible = root.contains(mask) && modal.style.display !== 'none'
      if (!visible) return
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (!e.composedPath().includes(root)) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(
          modal.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'))
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const current = root.activeElement
        if (e.shiftKey) {
          if (current === first || !modal.contains(current)) {
            e.preventDefault()
            last.focus()
          }
        } else if (current === last || !modal.contains(current)) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)
    requestAnimationFrame(() => {
      const focusables = modal.querySelectorAll(
        'input, button, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length > 0) {
        focusables[0].focus()
      }
    })
    return {
      mask,
      modal,
      body,
      actions,
      close,
    }
  }
  function openAddGroupModal(root, cfg, helpers) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k
    const { modal, body, actions, close } = createModalFrame({
      root,
      title: helpers.existingGroup
        ? '\u7F16\u8F91\u5206\u7EC4'
        : '\u6DFB\u52A0\u5206\u7EC4',
    })
    modal.classList.add('editor')
    const initialData = {
      name:
        ((_a = helpers.existingGroup) == null ? void 0 : _a.name) ||
        '\u65B0\u5206\u7EC4',
      displayName:
        (_b = helpers.existingGroup) == null ? void 0 : _b.displayName,
      icon:
        ((_c = helpers.existingGroup) == null ? void 0 : _c.icon) ||
        'lucide:folder',
      match: ((_d = helpers.existingGroup) == null ? void 0 : _d.match) ||
        helpers.defaultMatch || ['*://' + (location.hostname || '') + '/*'],
      defaultOpen:
        (_e = helpers.existingGroup) == null ? void 0 : _e.defaultOpen,
      itemsPerRow:
        ((_f = helpers.existingGroup) == null ? void 0 : _f.itemsPerRow) || 1,
      hidden: (_g = helpers.existingGroup) == null ? void 0 : _g.hidden,
      displayStyle:
        ((_h = helpers.existingGroup) == null ? void 0 : _h.displayStyle) ||
        'icon-title',
      iconSize:
        ((_i = helpers.existingGroup) == null ? void 0 : _i.iconSize) ||
        'medium',
      iconItemsPerRow:
        ((_j = helpers.existingGroup) == null ? void 0 : _j.iconItemsPerRow) ||
        0,
      variables:
        ((_k = helpers.existingGroup) == null ? void 0 : _k.variables) ||
        void 0,
    }
    renderGroupForm(body, initialData, {
      onChange() {},
    })
    const saveBtn = document.createElement('button')
    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = helpers.existingGroup
      ? '\u786E\u8BA4'
      : '\u6DFB\u52A0'
    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'btn btn-secondary'
    cancelBtn.textContent = '\u53D6\u6D88'
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn btn-secondary'
    deleteBtn.textContent = '\u5220\u9664'
    saveBtn.addEventListener('click', () => {
      const res = initialData
      if (!res.name) {
        return
      }
      if (helpers.existingGroup) {
        const g = helpers.existingGroup
        Object.assign(g, res)
        if (!res.displayName) delete g.displayName
      } else {
        const g = __spreadValues(
          {
            id: uid(),
            items: [],
          },
          res
        )
        if (!res.displayName) delete g.displayName
        cfg.groups.push(g)
      }
      try {
        helpers.saveConfig(cfg)
      } catch (e) {}
      close()
    })
    cancelBtn.addEventListener('click', close)
    deleteBtn.addEventListener('click', () => {
      if (!helpers.existingGroup) return
      const ok = globalThis.confirm(
        '\u662F\u5426\u5220\u9664\u6B64\u5206\u7EC4\u53CA\u5176\u6240\u6709\u5185\u5BB9\uFF1F'
      )
      if (!ok) return
      const idx = cfg.groups.findIndex((g) => g.id === helpers.existingGroup.id)
      if (idx !== -1) {
        cfg.groups.splice(idx, 1)
        try {
          helpers.saveConfig(cfg)
        } catch (e) {}
        close()
      }
    })
    actions.append(saveBtn)
    actions.append(cancelBtn)
    if (helpers.existingGroup) {
      actions.append(deleteBtn)
    }
  }
  function ensurePickerStylesIn(r) {
    var _a
    const has =
      (_a = r.querySelector) == null
        ? void 0
        : _a.call(r, '#ushortcuts-picker-styles')
    if (has) return
    const st = document.createElement('style')
    st.id = 'ushortcuts-picker-styles'
    st.textContent =
      '.ushortcuts-picker-highlight{outline:2px dashed #ef4444!important;outline-offset:0!important;box-shadow:0 0 0 2px rgba(239,68,68,.35) inset!important;cursor:pointer!important;}.ushortcuts-picker-tip{position:fixed;top:12px;right:12px;z-index:2147483647;background:#fff;color:#111827;border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;box-shadow:0 10px 20px rgba(0,0,0,0.1);font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";}'
    if (r instanceof Document) {
      r.head.append(st)
    } else {
      r.append(st)
    }
  }
  function addCurrentPageLinkToGroup(root, cfg, helpers, groupId, openMode) {
    const grp = (cfg.groups || []).find((g) => g.id === groupId)
    if (!grp) return
    let nm = '\u5F53\u524D\u7F51\u9875'
    let href = location.href
    try {
      nm = document.title || nm
    } catch (e) {}
    try {
      href = location.href
    } catch (e) {}
    if (hasDuplicateInGroup(grp, 'url', String(href || '/'))) {
      const ok = globalThis.confirm(
        '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 URL\uFF0C\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\uFF1F'
      )
      if (!ok) return
    }
    const it = {
      id: uid(),
      name: String(nm || href),
      icon: 'favicon',
      type: 'url',
      data: String(href || '/'),
      openIn: openMode,
    }
    grp.items.push(it)
    try {
      helpers.saveConfig(cfg)
    } catch (e) {}
    try {
      helpers.rerender(root, cfg)
    } catch (e) {}
  }
  function pickLinkFromPageAndAdd(root, cfg, helpers, groupId, openMode, opts) {
    const grp = (cfg.groups || []).find((g) => g.id === groupId)
    if (!grp) return
    pickLinkFromPage(root, {
      beforeStart: opts == null ? void 0 : opts.beforeStart,
      afterFinish: opts == null ? void 0 : opts.afterFinish,
      onPicked(nm, href) {
        if (hasDuplicateInGroup(grp, 'url', String(href || '/'))) {
          const ok = globalThis.confirm(
            '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 URL\uFF0C\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\uFF1F'
          )
          if (!ok) return
        }
        const it = {
          id: uid(),
          name: nm,
          icon: 'favicon',
          type: 'url',
          data: href,
          openIn: openMode,
        }
        grp.items.push(it)
        try {
          helpers.saveConfig(cfg)
        } catch (e) {}
        try {
          helpers.rerender(root, cfg)
        } catch (e) {}
      },
    })
  }
  function pickLinkFromPage(root, opts) {
    ensurePickerStylesIn(document)
    if (opts.beforeStart) {
      try {
        opts.beforeStart()
      } catch (e) {}
    }
    const tip = document.createElement('div')
    tip.className = 'ushortcuts-picker-tip'
    tip.textContent =
      '\u70B9\u51FB\u7EA2\u6846\u94FE\u63A5\u6DFB\u52A0\uFF0CESC \u53D6\u6D88'
    document.body.append(tip)
    const anchors = querySelectorAllDeep(document, 'a[href]').filter((el) => {
      const href = (el.getAttribute('href') || '').trim()
      if (!href || href === '#') return false
      let u
      try {
        u = new URL(href, location.href)
      } catch (e) {
        return false
      }
      return u.protocol === 'http:' || u.protocol === 'https:'
    })
    const panelEl = root.querySelector('.ushortcuts')
    const prevPanelDisplay =
      panelEl instanceof HTMLDivElement ? panelEl.style.display || '' : ''
    if (panelEl instanceof HTMLDivElement) panelEl.style.display = 'none'
    const cleanup = () => {
      for (const a of anchors) a.classList.remove('ushortcuts-picker-highlight')
      try {
        tip.remove()
      } catch (e) {}
      if (panelEl instanceof HTMLDivElement)
        panelEl.style.display = prevPanelDisplay
      try {
        const ov = document.querySelector('#ushortcuts-picker-overlay')
        ov == null ? void 0 : ov.remove()
      } catch (e) {}
      if (opts.afterFinish) {
        try {
          opts.afterFinish()
        } catch (e) {}
      }
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
      a.classList.add('ushortcuts-picker-highlight')
    }
    const overlay = document.createElement('div')
    overlay.id = 'ushortcuts-picker-overlay'
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
          try {
            opts.onPicked(text, href)
          } catch (e) {}
        }
      } catch (e) {}
      if (picked) {
        document.removeEventListener('keydown', onEsc, true)
        cleanup()
      }
    }
    overlay.addEventListener('click', onOverlayClick, true)
    document.body.append(overlay)
  }
  function hasDuplicateInGroup(grp, type, data, excludeId) {
    const d = String(data || '').trim()
    return (grp.items || []).some((x) => {
      if (!x || x.type !== type) return false
      const xd = String(x.data || '').trim()
      if (excludeId && x.id === excludeId) return false
      return xd === d
    })
  }
  function renderLinkForm(container, data, options) {
    const grid = document.createElement('div')
    grid.className = 'grid'
    try {
      grid.style.gridTemplateColumns = '1fr'
    } catch (e) {}
    const notifyChange = () => {
      if (options.onChange) options.onChange()
    }
    if (options.groups && options.groups.length > 0) {
      const grpRow = document.createElement('div')
      grpRow.className = 'row'
      const grpLabel = document.createElement('label')
      grpLabel.textContent = '\u5206\u7EC4'
      const grpSel = document.createElement('select')
      for (const g of options.groups) {
        const o = document.createElement('option')
        o.value = g.id
        o.textContent = g.name
        if (g.id === data.groupId) o.selected = true
        grpSel.append(o)
      }
      grpSel.addEventListener('change', () => {
        data.groupId = grpSel.value
        notifyChange()
      })
      if (options.disableGroupSelector) {
        grpSel.disabled = true
      }
      grpRow.append(grpLabel)
      grpRow.append(grpSel)
      grid.append(grpRow)
    }
    const nameRow = document.createElement('div')
    nameRow.className = 'row'
    const nameLabel = document.createElement('label')
    nameLabel.textContent = '\u540D\u79F0'
    const nameInput = document.createElement('input')
    nameInput.value = data.name || ''
    nameInput.addEventListener('input', () => {
      data.name = nameInput.value
      notifyChange()
    })
    nameRow.append(nameLabel)
    nameRow.append(nameInput)
    grid.append(nameRow)
    const iconRow = document.createElement('div')
    iconRow.className = 'row'
    const iconLabel = document.createElement('label')
    iconLabel.textContent = '\u56FE\u6807'
    const updateIconData = () => {
      if (iconComp) {
        data.icon = iconComp.getFinal()
        notifyChange()
      }
    }
    const iconComp = createIconInput(
      data.icon || '',
      ['icon', 'favicon', 'url', 'emoji'],
      {
        labels: {
          icon: '\u56FE\u6807',
          favicon: 'Favicon',
          url: 'URL',
          emoji: 'Emoji',
        },
        namePrefix: 'ushortcuts-item-icon-kind-' + (data.id || 'new'),
        onValueChange: updateIconData,
        onKindChange: updateIconData,
      }
    )
    iconRow.append(iconLabel)
    iconRow.append(iconComp.el)
    grid.append(iconRow)
    const typeRow = document.createElement('div')
    typeRow.className = 'row'
    const typeLabel = document.createElement('label')
    typeLabel.textContent = '\u7C7B\u578B'
    const typeRadios = createSegmentedRadios(
      data.type,
      ['url', 'js'],
      (v) => {
        data.type = v
        syncTypeUi()
        notifyChange()
      },
      {
        labels: { url: 'URL', js: 'JS' },
        namePrefix: 'ushortcuts-item-type-' + (data.id || 'new'),
      }
    )
    typeRow.append(typeLabel)
    typeRow.append(typeRadios)
    grid.append(typeRow)
    const urlRow = document.createElement('div')
    urlRow.className = 'row'
    const urlLabel = document.createElement('label')
    urlLabel.textContent = 'URL'
    const urlInput = document.createElement('input')
    urlInput.placeholder = 'https://...'
    urlInput.value = data.type === 'url' ? data.data || '/' : '/'
    urlInput.addEventListener('input', () => {
      if (data.type === 'url') {
        data.data = urlInput.value
        notifyChange()
      }
    })
    urlRow.append(urlLabel)
    urlRow.append(urlInput)
    grid.append(urlRow)
    const urlHelpRow = document.createElement('div')
    urlHelpRow.className = 'row'
    const urlHelp = document.createElement('div')
    urlHelp.className = 'field-help'
    urlHelp.innerHTML =
      '\n    <div class="field-help-title">\u{1F517} URL \u53D8\u91CF\u4E0E\u793A\u4F8B</div>\n    <div><b>\u57FA\u7840\u53D8\u91CF\uFF1A</b>{hostname}\u3001{current_url}\u3001{current_title}\u3001{query}\u3001{selected}</div>\n    <div><b>\u9AD8\u7EA7\u53D8\u91CF\uFF1A</b>{q:key} (\u67E5\u8BE2\u53C2\u6570)\u3001{p:index} (\u8DEF\u5F84\u7247\u6BB5)\u3001{v:key} (\u81EA\u5B9A\u4E49\u53D8\u91CF)</div>\n    <div><b>\u5E38\u91CF\u6587\u672C\uFF1A</b>{t:text} (\u7F16\u7801\u540E\u7684\u6587\u672C)</div>\n    <div><b>\u7EC4\u5408\u903B\u8F91\uFF1A</b>{selected||q:wd||t:\u9ED8\u8BA4\u503C} (\u6309\u987A\u5E8F\u53D6\u975E\u7A7A\u503C)</div>\n    <div><b>\u793A\u4F8B\uFF1A</b>https://google.com/search?q={selected}</div>\n    <div>\u66F4\u591A\u8BF4\u660E\u53C2\u8003 <a href="https://greasyfork.org/scripts/558485-utags-shortcuts" target="_blank" rel="noopener noreferrer">GreasyFork</a></div>\n  '
    urlHelpRow.append(urlHelp)
    grid.append(urlHelpRow)
    const jsRow = document.createElement('div')
    jsRow.className = 'row'
    const jsLabel = document.createElement('label')
    jsLabel.textContent = 'JS'
    const jsInput = document.createElement('textarea')
    jsInput.placeholder =
      'console.log("hello")\n// \u6216\u8005\u7C98\u8D34\u811A\u672C\u5185\u5BB9'
    jsInput.value = data.type === 'js' ? data.data || '' : ''
    jsInput.addEventListener('input', () => {
      if (data.type === 'js') {
        data.data = jsInput.value
        notifyChange()
      }
    })
    jsRow.append(jsLabel)
    jsRow.append(jsInput)
    grid.append(jsRow)
    const jsHelpRow = document.createElement('div')
    jsHelpRow.className = 'row'
    const jsHelp = document.createElement('div')
    jsHelp.className = 'field-help'
    jsHelp.innerHTML =
      '\n    <div class="field-help-title">\u{1F9E9} JS \u8FD4\u56DE\u4E0E\u793A\u4F8B</div>\n    <div>JS\uFF1A\u8FD4\u56DE\u5B57\u7B26\u4E32\u6216 {url, mode} \u5BFC\u822A</div>\n    <div>\u793A\u4F8B\uFF1Areturn "http://example.com/search?query={selected||query}"</div>\n    <div>\u793A\u4F8B\uFF1Areturn { url: "http://example.com/?q={query}", mode: "new-tab" }</div>\n    <div>\u66F4\u591A\u4F7F\u7528\u8BF4\u660E\u53C2\u8003 <a href="https://github.com/utags/userscripts" target="_blank" rel="noopener noreferrer">https://github.com/utags/userscripts</a></div>\n  '
    jsHelpRow.append(jsHelp)
    grid.append(jsHelpRow)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u6253\u5F00\u65B9\u5F0F'
    const openRadios = createOpenModeRadios(
      data.openIn,
      (m) => {
        data.openIn = m
        notifyChange()
      },
      { inheritLabel: '\u8DDF\u968F\u5206\u7EC4\u8BBE\u7F6E' }
    )
    openRow.append(openLabel)
    openRow.append(openRadios)
    grid.append(openRow)
    const visibleRow = document.createElement('div')
    visibleRow.className = 'row'
    const visibleLabel = document.createElement('label')
    visibleLabel.textContent = '\u663E\u793A\u72B6\u6001'
    const stateRadios = createSegmentedRadios(
      data.hidden ? 'hidden' : 'visible',
      ['visible', 'hidden'],
      (v) => {
        data.hidden = v === 'hidden'
        notifyChange()
      },
      {
        labels: { visible: '\u663E\u793A', hidden: '\u9690\u85CF' },
        namePrefix: 'ushortcuts-item-state-' + (data.id || 'new'),
      }
    )
    visibleRow.append(visibleLabel)
    visibleRow.append(stateRadios)
    grid.append(visibleRow)
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
    grid.append(quickRow)
    addCurrentBtn.addEventListener('click', () => {
      try {
        nameInput.value = document.title || '\u5F53\u524D\u7F51\u9875'
        data.name = nameInput.value
        const currentUrl = location.href
        if (data.type === 'url') {
          urlInput.value = currentUrl
          data.data = currentUrl
        } else {
          const urlRadio = typeRadios.querySelector('input[value="url"]')
          if (urlRadio) {
            urlRadio.checked = true
            urlRadio.dispatchEvent(new Event('change'))
          }
          urlInput.value = currentUrl
          data.data = currentUrl
        }
        notifyChange()
      } catch (e) {}
    })
    pickLinksBtn.addEventListener('click', () => {
      try {
        pickLinkFromPage(options.root, {
          beforeStart() {
            if (options.onPickStart) options.onPickStart()
          },
          afterFinish() {
            if (options.onPickEnd) options.onPickEnd()
          },
          onPicked(nm, href) {
            nameInput.value = nm
            data.name = nm
            const urlRadio = typeRadios.querySelector('input[value="url"]')
            if (urlRadio) {
              urlRadio.checked = true
              urlRadio.dispatchEvent(new Event('change'))
            }
            urlInput.value = href
            data.data = href
            notifyChange()
          },
        })
      } catch (e) {}
    })
    function syncTypeUi() {
      if (data.type === 'url') {
        urlRow.style.display = ''
        jsRow.style.display = 'none'
        quickRow.style.display = ''
        urlHelpRow.style.display = ''
        jsHelpRow.style.display = 'none'
      } else {
        urlRow.style.display = 'none'
        jsRow.style.display = ''
        quickRow.style.display = 'none'
        urlHelpRow.style.display = 'none'
        jsHelpRow.style.display = ''
      }
    }
    syncTypeUi()
    container.append(grid)
  }
  function openAddLinkModal(root, cfg, helpers) {
    const { modal, body, actions, close, mask } = createModalFrame({
      root,
      title: helpers.existingItem
        ? '\u7F16\u8F91\u94FE\u63A5'
        : '\u6DFB\u52A0\u94FE\u63A5',
    })
    modal.classList.add('editor')
    const firstGroup = (cfg.groups && cfg.groups[0]) || void 0
    const defaultGroup =
      helpers.defaultGroupId || (firstGroup && firstGroup.id) || ''
    const currentGroupId = helpers.existingItem
      ? helpers.defaultGroupId || defaultGroup
      : defaultGroup
    const formData = helpers.existingItem
      ? {
          id: helpers.existingItem.id,
          groupId: currentGroupId,
          name: helpers.existingItem.name || '\u65B0\u9879',
          icon: helpers.existingItem.icon,
          type: helpers.existingItem.type || 'url',
          data:
            helpers.existingItem.data ||
            (helpers.existingItem.type === 'js' ? '' : '/'),
          openIn: helpers.existingItem.openIn,
          hidden: helpers.existingItem.hidden,
        }
      : {
          id: uid(),
          groupId: defaultGroup,
          name: '\u65B0\u9879',
          type: 'url',
          data: '/',
          openIn: void 0,
        }
    const formContainer = document.createElement('div')
    renderLinkForm(formContainer, formData, {
      root,
      groups: cfg.groups || [],
      disableGroupSelector: Boolean(helpers.existingItem),
      onChange() {},
      onPickStart() {
        modal.style.display = 'none'
        mask.remove()
      },
      onPickEnd() {
        modal.style.display = ''
        root.append(mask)
      },
    })
    body.append(formContainer)
    const saveBtn = document.createElement('button')
    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = helpers.existingItem ? '\u786E\u8BA4' : '\u6DFB\u52A0'
    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'btn btn-secondary'
    cancelBtn.textContent = '\u53D6\u6D88'
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn btn-secondary'
    deleteBtn.textContent = '\u5220\u9664'
    saveBtn.addEventListener('click', () => {
      var _a
      const gid = formData.groupId
      const grp = (cfg.groups || []).find((g) => g.id === gid)
      if (!grp) return
      const hasDup = hasDuplicateInGroup(
        grp,
        formData.type,
        formData.data,
        (_a = helpers.existingItem) == null ? void 0 : _a.id
      )
      if (hasDup) {
        const msg =
          formData.type === 'url'
            ? helpers.existingItem
              ? '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 URL\uFF0C\u662F\u5426\u7EE7\u7EED\u4FDD\u5B58\uFF1F'
              : '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 URL\uFF0C\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\uFF1F'
            : helpers.existingItem
              ? '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 JS\uFF0C\u662F\u5426\u7EE7\u7EED\u4FDD\u5B58\uFF1F'
              : '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 JS\uFF0C\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\uFF1F'
        const ok = globalThis.confirm(msg)
        if (!ok) return
      }
      if (helpers.existingItem) {
        const it = helpers.existingItem
        it.name = formData.name
        it.icon = formData.icon
        it.type = formData.type
        it.data = formData.data
        it.openIn = formData.openIn
        it.hidden = formData.hidden
      } else {
        const it = {
          id: formData.id || uid(),
          name: formData.name,
          icon: formData.icon,
          type: formData.type,
          data: formData.data,
          openIn: formData.openIn,
          hidden: formData.hidden,
        }
        grp.items.push(it)
      }
      try {
        helpers.saveConfig(cfg)
      } catch (e) {}
      close()
    })
    deleteBtn.addEventListener('click', () => {
      if (!helpers.existingItem) return
      const ok = globalThis.confirm(
        '\u662F\u5426\u5220\u9664\u6B64\u94FE\u63A5\uFF1F'
      )
      if (!ok) return
      const gid = formData.groupId
      const grp = (cfg.groups || []).find((g) => g.id === gid)
      if (!grp) return
      const idx = grp.items.findIndex(
        (x) => x && x.id === helpers.existingItem.id
      )
      if (idx !== -1) {
        try {
          grp.items.splice(idx, 1)
        } catch (e) {}
        try {
          helpers.saveConfig(cfg)
        } catch (e) {}
        close()
      }
    })
    cancelBtn.addEventListener('click', close)
    actions.append(saveBtn)
    actions.append(cancelBtn)
    if (helpers.existingItem) {
      actions.append(deleteBtn)
    }
  }
  function resolveUrlTemplate(s, extraResolvers) {
    const l = win.location || {}
    const href = l.href || ''
    let u
    try {
      u = new URL(href)
    } catch (e) {}
    const re = /{([^}]+)}/g
    return String(s || '').replaceAll(re, (_, body) => {
      var _a
      const parts = String(body || '')
        .split('||')
        .map((x) => x.trim())
        .filter(Boolean)
      const resolvers = {
        hostname() {
          return l.hostname || ''
        },
        hostname_without_www() {
          const h = l.hostname || ''
          return h.startsWith('www.') ? h.slice(4) : h
        },
        hostname_top_level() {
          return extractDomain(href)
        },
        query() {
          try {
            if (!u) return ''
            return encodeURIComponent(
              u.searchParams.get('query') ||
                u.searchParams.get('q') ||
                u.searchParams.get('kw') ||
                u.searchParams.get('wd') ||
                u.searchParams.get('keyword') ||
                u.searchParams.get('p') ||
                u.searchParams.get('s') ||
                u.searchParams.get('term') ||
                u.searchParams.get('text') ||
                u.searchParams.get('word') ||
                u.searchParams.get('search_query') ||
                u.searchParams.get('qw') ||
                ''
            )
          } catch (e) {}
          return ''
        },
        current_url() {
          return href
        },
        current_url_encoded() {
          return encodeURIComponent(href)
        },
        current_title() {
          return encodeURIComponent(doc.title.trim() || '')
        },
        selected() {
          try {
            const globalSelected = globalThis.__utags_shortcuts_selected_text__
            if (globalSelected) {
              return encodeURIComponent(globalSelected)
            }
            const text = (win.getSelection() || '').toString().trim()
            return encodeURIComponent(text)
          } catch (e) {}
          return ''
        },
      }
      for (const p of parts) {
        let v = String(
          ((_a = resolvers[p]) == null ? void 0 : _a.call(resolvers)) || ''
        ).trim()
        if (v) return v
        if (extraResolvers) {
          const extra = extraResolvers(p)
          if (extra !== void 0 && extra !== null)
            return encodeURIComponent(String(extra))
        }
        if (p.startsWith('q:')) {
          const key = p.slice(2)
          try {
            v = encodeURIComponent(
              (u == null ? void 0 : u.searchParams.get(key)) || ''
            )
          } catch (e) {}
        } else if (p.startsWith('p:')) {
          const index = Number.parseInt(p.slice(2), 10)
          if (!Number.isNaN(index) && index > 0) {
            try {
              const pathname = (u == null ? void 0 : u.pathname) || ''
              const segments = pathname.split('/').filter(Boolean)
              v = encodeURIComponent(segments[index - 1] || '')
            } catch (e) {}
          }
        } else if (p.startsWith('t:')) {
          v = encodeURIComponent(p.slice(2))
        }
        if (v) return v
      }
      return ''
    })
  }
  function mergeGroupsOverwrite(existing, imported) {
    const mergedGroups = [...(existing.groups || [])]
    const existingGroupMap = new Map(mergedGroups.map((g, i) => [g.id, i]))
    for (const importedGroup of imported.groups || []) {
      if (existingGroupMap.has(importedGroup.id)) {
        const index = existingGroupMap.get(importedGroup.id)
        mergedGroups[index] = importedGroup
      } else {
        mergedGroups.push(importedGroup)
      }
    }
    return { groups: mergedGroups }
  }
  function mergeGroupsMerge(existing, imported) {
    const mergedGroups = [...(existing.groups || [])]
    const existingGroupMap = new Map(mergedGroups.map((g, i) => [g.id, i]))
    for (const importedGroup of imported.groups || []) {
      if (existingGroupMap.has(importedGroup.id)) {
        const index = existingGroupMap.get(importedGroup.id)
        const existingGroup = mergedGroups[index]
        const newGroup = __spreadProps(
          __spreadValues(__spreadValues({}, existingGroup), importedGroup),
          {
            items: mergeItems(
              existingGroup.items || [],
              importedGroup.items || []
            ),
          }
        )
        mergedGroups[index] = newGroup
      } else {
        mergedGroups.push(importedGroup)
      }
    }
    return { groups: mergedGroups }
  }
  function mergeItems(existingItems, importedItems) {
    const mergedItems = [...existingItems]
    const existingItemMap = new Map(mergedItems.map((item, i) => [item.id, i]))
    for (const importedItem of importedItems) {
      if (existingItemMap.has(importedItem.id)) {
        const index = existingItemMap.get(importedItem.id)
        mergedItems[index] = importedItem
      } else {
        mergedItems.push(importedItem)
      }
    }
    return mergedItems
  }
  async function importAndSave(store2, data, mode, existingData) {
    let obj = data
    if (!Array.isArray(obj.groups) && Array.isArray(obj.items)) {
      obj = { groups: [obj] }
    }
    const existingObj =
      existingData != null ? existingData : await store2.load()
    const merged =
      mode === 'overwrite'
        ? mergeGroupsOverwrite(existingObj, obj)
        : mergeGroupsMerge(existingObj, obj)
    await store2.save(merged)
    return merged
  }
  var CONFIG_KEY = 'ushortcuts'
  var ShortcutsStore = class {
    constructor() {
      this.lastSaved = ''
    }
    async load() {
      try {
        const v = await getValue(CONFIG_KEY, '')
        if (v) {
          const raw = JSON.parse(String(v) || '{}')
          const ensureGroup = (gg) => ({
            id: String((gg == null ? void 0 : gg.id) || uid()),
            name: String(
              (gg == null ? void 0 : gg.name) || '\u9ED8\u8BA4\u7EC4'
            ),
            icon: String((gg == null ? void 0 : gg.icon) || 'lucide:folder'),
            match: Array.isArray(gg == null ? void 0 : gg.match)
              ? gg.match
              : ['*'],
            defaultOpen:
              (gg == null ? void 0 : gg.defaultOpen) === 'new-tab' ||
              (gg == null ? void 0 : gg.defaultOpen) === 'same-tab'
                ? gg.defaultOpen
                : void 0,
            items: Array.isArray(gg == null ? void 0 : gg.items)
              ? gg.items
              : [],
            collapsed: Boolean(gg == null ? void 0 : gg.collapsed),
            itemsPerRow: Number.isFinite(gg == null ? void 0 : gg.itemsPerRow)
              ? gg.itemsPerRow
              : 1,
            hidden: Boolean(gg == null ? void 0 : gg.hidden),
            displayName: (gg == null ? void 0 : gg.displayName)
              ? String(gg.displayName)
              : void 0,
            displayStyle:
              (gg == null ? void 0 : gg.displayStyle) === 'icon-only' ||
              (gg == null ? void 0 : gg.displayStyle) === 'title-only' ||
              (gg == null ? void 0 : gg.displayStyle) === 'icon-title'
                ? gg.displayStyle
                : 'icon-title',
            iconSize:
              (gg == null ? void 0 : gg.iconSize) === 'small' ||
              (gg == null ? void 0 : gg.iconSize) === 'medium' ||
              (gg == null ? void 0 : gg.iconSize) === 'large'
                ? gg.iconSize
                : 'medium',
            iconItemsPerRow: Number.isFinite(
              gg == null ? void 0 : gg.iconItemsPerRow
            )
              ? gg.iconItemsPerRow
              : 0,
            variables: Array.isArray(gg == null ? void 0 : gg.variables)
              ? gg.variables
              : void 0,
          })
          const groupsArr = Array.isArray(raw == null ? void 0 : raw.groups)
            ? raw.groups.map((x) => ensureGroup(x))
            : []
          if (groupsArr.length === 0) {
            const g = ensureGroup({})
            g.items = [
              {
                id: uid(),
                name: '\u9996\u9875',
                icon: 'lucide:home',
                type: 'url',
                data: '/',
                openIn: void 0,
                hidden: false,
              },
            ]
            groupsArr.push(g)
          }
          const cfg = {
            groups: groupsArr,
          }
          return cfg
        }
      } catch (e) {}
      void (async () => {
        try {
          const data = await new Promise((resolve, reject) => {
            fetchWithGmFallback({
              url: 'https://raw.githubusercontent.com/utags/utags-shared-shortcuts/main/zh-CN/collections/builtin_groups.json',
              method: 'GET',
              onload(response) {
                if (response.status === 200 && response.responseText) {
                  try {
                    resolve(JSON.parse(response.responseText))
                  } catch (error) {
                    reject(
                      error instanceof Error ? error : new Error(String(error))
                    )
                  }
                } else {
                  reject(new Error('Fetch failed '.concat(response.status)))
                }
              },
              onerror(error) {
                reject(
                  error instanceof Error ? error : new Error(String(error))
                )
              },
            })
          })
          await importAndSave(this, data, 'merge', { groups: [] })
        } catch (error) {
          console.error('Failed to init shortcuts', error)
        }
      })()
      return {
        groups: [],
      }
    }
    async save(cfg) {
      try {
        const s = JSON.stringify(cfg)
        if (s === this.lastSaved) return
        this.lastSaved = s
        await setValue(CONFIG_KEY, s)
      } catch (e) {}
    }
  }
  var shortcutsStore = new ShortcutsStore()
  function initDiscourseSidebar() {
    const root = document.querySelector('.discourse-root')
    if (root) {
      observeModal(root)
    } else {
      const observer = new MutationObserver(() => {
        const root2 = document.querySelector('.discourse-root')
        if (root2) {
          observer.disconnect()
          observeModal(root2)
        }
      })
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      })
    }
  }
  function observeModal(root) {
    const observer = new MutationObserver(() => {
      const form = document.querySelector('form.sidebar-section-form')
      if (form && !form.querySelector('.import-from-utags')) {
        injectImportButton(form)
      }
    })
    observer.observe(root || document.body || document.documentElement, {
      childList: true,
      subtree: true,
    })
  }
  function injectImportButton(form) {
    const addLinkBtn = form.querySelector('.btn.add-link')
    if (!addLinkBtn || !addLinkBtn.parentNode) return
    const importBtn = document.createElement('button')
    importBtn.className =
      'btn btn-icon-text btn-flat btn-text import-from-utags'
    importBtn.type = 'button'
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    icon.setAttribute('class', 'fa d-icon d-icon-download svg-icon svg-string')
    icon.setAttribute('aria-hidden', 'true')
    icon.style.width = '.75em'
    icon.style.height = '.75em'
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
    use.setAttribute('href', '#download')
    icon.append(use)
    const label = document.createElement('span')
    label.className = 'd-button-label'
    label.textContent = '\u4ECE UTags Shortcuts \u5BFC\u5165'
    importBtn.append(icon, label)
    importBtn.addEventListener('click', () => {
      void showImportDialog(form)
    })
    const importJsonBtn = document.createElement('button')
    importJsonBtn.className =
      'btn btn-icon-text btn-flat btn-text import-from-json'
    importJsonBtn.type = 'button'
    const iconJson = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    iconJson.setAttribute(
      'class',
      'fa d-icon d-icon-download svg-icon svg-string'
    )
    iconJson.setAttribute('aria-hidden', 'true')
    iconJson.style.width = '.75em'
    iconJson.style.height = '.75em'
    const useJson = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'use'
    )
    useJson.setAttribute('href', '#download')
    iconJson.append(useJson)
    const labelJson = document.createElement('span')
    labelJson.className = 'd-button-label'
    labelJson.textContent = '\u4ECE JSON \u6587\u4EF6\u5BFC\u5165'
    importJsonBtn.append(iconJson, labelJson)
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    fileInput.style.display = 'none'
    importJsonBtn.append(fileInput)
    importJsonBtn.addEventListener('click', () => {
      fileInput.click()
    })
    fileInput.addEventListener('change', async () => {
      var _a
      const file = (_a = fileInput.files) == null ? void 0 : _a[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (data && Array.isArray(data.items)) {
          showToast('\u6210\u529F\u8BFB\u53D6 JSON \u6587\u4EF6', form)
          importGroup(data, form)
        } else {
          alert(
            '\u65E0\u6548\u7684 JSON \u6587\u4EF6\u683C\u5F0F\uFF1A\u7F3A\u5C11 items \u6570\u7EC4'
          )
        }
      } catch (error) {
        console.error(error)
        alert('\u8BFB\u53D6\u6216\u89E3\u6790 JSON \u6587\u4EF6\u5931\u8D25')
      }
      fileInput.value = ''
    })
    const exportBtn = document.createElement('button')
    exportBtn.className = 'btn btn-icon-text btn-flat btn-text export-to-json'
    exportBtn.type = 'button'
    const iconExport = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    iconExport.setAttribute(
      'class',
      'fa d-icon d-icon-upload svg-icon svg-string'
    )
    iconExport.setAttribute('aria-hidden', 'true')
    iconExport.style.width = '.75em'
    iconExport.style.height = '.75em'
    const useExport = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'use'
    )
    useExport.setAttribute('href', '#upload')
    iconExport.append(useExport)
    const labelExport = document.createElement('span')
    labelExport.className = 'd-button-label'
    labelExport.textContent = '\u5BFC\u51FA\u4E3A JSON \u6587\u4EF6'
    exportBtn.append(iconExport, labelExport)
    exportBtn.addEventListener('click', () => {
      exportToJson(form)
    })
    const importRow = document.createElement('div')
    importRow.style.marginTop = '0.5rem'
    importRow.style.marginLeft = '-0.5rem'
    importRow.style.display = 'block'
    importRow.style.textAlign = 'left'
    importRow.append(importBtn)
    const importJsonRow = document.createElement('div')
    importJsonRow.style.marginTop = '0.5rem'
    importJsonRow.style.marginLeft = '-0.5rem'
    importJsonRow.style.display = 'block'
    importJsonRow.style.textAlign = 'left'
    importJsonRow.append(importJsonBtn)
    const exportRow = document.createElement('div')
    exportRow.style.marginTop = '0.5rem'
    exportRow.style.marginLeft = '-0.5rem'
    exportRow.style.display = 'block'
    exportRow.style.textAlign = 'left'
    exportRow.append(exportBtn)
    addLinkBtn.parentNode.insertBefore(importRow, addLinkBtn.nextSibling)
    importRow.after(importJsonRow)
    importJsonRow.after(exportRow)
  }
  function exportToJson(form) {
    const sectionNameInput = form.querySelector('#section-name')
    const sectionName =
      (sectionNameInput == null ? void 0 : sectionNameInput.value) ||
      'Discourse Sidebar'
    const items = []
    const rows = form.querySelectorAll('.sidebar-section-form-link')
    for (const row of rows) {
      const nameInput = row.querySelector('input[name="link-name"]')
      const urlInput = row.querySelector('input[name="link-url"]')
      if (nameInput && urlInput && nameInput.value && urlInput.value) {
        if (nameInput.value.includes('[\u9690\u85CF]')) continue
        items.push({
          id: uid(),
          name: nameInput.value,
          type: 'url',
          data: urlInput.value,
          openIn: getOpenInType(urlInput.value),
        })
      }
    }
    if (items.length === 0) {
      showToast('\u6CA1\u6709\u53EF\u5BFC\u51FA\u7684\u94FE\u63A5', form)
      return
    }
    const hostname = globalThis.location.hostname
    const exportData = {
      id: ''.concat(hostname.replaceAll('.', '_'), '_').concat(uid()),
      name: sectionName,
      icon: 'url:'.concat(getFaviconUrl(globalThis.location.origin)),
      match: ['*://'.concat(hostname, '/*')],
      defaultOpen: void 0,
      items,
      itemsPerRow: 1,
    }
    const date = /* @__PURE__ */ new Date()
    const timestamp = ''
      .concat(date.getFullYear())
      .concat(String(date.getMonth() + 1).padStart(2, '0'))
      .concat(String(date.getDate()).padStart(2, '0'), '_')
      .concat(String(date.getHours()).padStart(2, '0'))
      .concat(String(date.getMinutes()).padStart(2, '0'))
      .concat(String(date.getSeconds()).padStart(2, '0'))
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'utags-shortcuts-data-'.concat(timestamp, '.json')
    a.click()
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1e3)
    showToast('\u5DF2\u5BFC\u51FA '.concat(items.length, ' \u9879'), form)
  }
  function getOpenInType(url) {
    if (!isSameOrigin(url)) {
      return 'new-tab'
    }
    try {
      const u = new URL(url, globalThis.location.href)
      if (
        u.pathname.startsWith('/pub/') ||
        u.pathname.startsWith('/challenge')
      ) {
        return 'new-tab'
      }
    } catch (e) {}
    return void 0
  }
  async function showImportDialog(form) {
    const config = await shortcutsStore.load()
    if (!config.groups || config.groups.length === 0) {
      alert(
        'UTags Shortcuts \u4E2D\u6CA1\u6709\u53EF\u5BFC\u5165\u7684\u5206\u7EC4'
      )
      return
    }
    const dialog = document.createElement('dialog')
    dialog.style.padding = '20px'
    dialog.style.borderRadius = '8px'
    dialog.style.border = '1px solid #ccc'
    dialog.style.position = 'fixed'
    dialog.style.top = '50%'
    dialog.style.left = '50%'
    dialog.style.transform = 'translate(-50%, -50%)'
    dialog.style.zIndex = '9999'
    dialog.style.backgroundColor = 'var(--secondary)'
    dialog.style.color = 'var(--primary)'
    const title = document.createElement('h3')
    title.textContent = '\u9009\u62E9\u8981\u5BFC\u5165\u7684\u5206\u7EC4'
    dialog.append(title)
    const list = document.createElement('div')
    list.style.margin = '10px 0'
    list.style.maxHeight = '300px'
    list.style.overflowY = 'auto'
    for (const group of config.groups) {
      const item = document.createElement('div')
      item.style.padding = '5px'
      item.style.cursor = 'pointer'
      item.style.borderBottom = '1px solid #eee'
      item.textContent = ''
        .concat(group.name, ' (')
        .concat(group.items.length, ' \u9879)')
      item.addEventListener('click', () => {
        importGroup(group, form)
        dialog.close()
        dialog.remove()
      })
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#f0f0f0'
      })
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent'
      })
      list.append(item)
    }
    dialog.append(list)
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '\u53D6\u6D88'
    closeBtn.className = 'btn'
    closeBtn.addEventListener('click', () => {
      dialog.close()
      dialog.remove()
    })
    dialog.append(closeBtn)
    document.body.append(dialog)
    dialog.showModal()
  }
  function importGroup(group, form) {
    const nameInput = form.querySelector('#section-name')
    if (nameInput && !nameInput.value) {
      nameInput.value = group.name
      nameInput.dispatchEvent(new Event('input', { bubbles: true }))
      nameInput.dispatchEvent(new Event('change', { bubbles: true }))
    }
    const addLinkBtn = form.querySelector('.btn.add-link')
    if (!addLinkBtn) return
    void processItems(group.items, addLinkBtn, form)
  }
  function showToast(message, form) {
    let toast = form.querySelector('.utags-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.className = 'utags-toast'
      const style = toast.style
      style.background = '#e7f5ff'
      style.color = 'var(--primary)'
      style.padding = '8px 12px'
      style.borderRadius = '4px'
      style.fontSize = '12px'
      style.marginTop = '10px'
      style.border = '1px solid #b3d7ff'
      style.display = 'none'
      const addLinkBtn = form.querySelector('.btn.add-link')
      if (addLinkBtn) {
        addLinkBtn.before(toast)
      } else {
        form.append(toast)
      }
    }
    const timerId = toast.dataset.timerId
    if (timerId) {
      clearTimeout(Number(timerId))
    }
    toast.textContent = message
    toast.style.display = 'block'
    toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    const newTimerId = globalThis.setTimeout(() => {
      toast.style.display = 'none'
    }, 1e4)
    toast.dataset.timerId = String(newTimerId)
  }
  async function processItems(items, addBtn, form) {
    var _a, _b
    const existingUrls = /* @__PURE__ */ new Set()
    for (const input of form.querySelectorAll('input[name="link-url"]')) {
      if (input.value) existingUrls.add(input.value)
    }
    let countTotal = 0
    let countTypeFiltered = 0
    let countVarFiltered = 0
    let countDupFiltered = 0
    const urlItems = items
      .filter((item) => {
        countTotal++
        if (item.type !== 'url') {
          countTypeFiltered++
          return false
        }
        return true
      })
      .map((item) => {
        let processedUrl = processUrl(item.data)
        if (item.data.startsWith('https://linux.do/challenge')) {
          processedUrl = 'https://wsrv.nl/?url=&default='.concat(
            encodeURIComponent('https://linux.do/challenge')
          )
        } else if (item.data.includes('?safe_mode=no_themes%2Cno_plugins')) {
          processedUrl = 'https://wsrv.nl/?url=&default='.concat(
            encodeURIComponent(
              'https://linux.do/?safe_mode=no_themes%2Cno_plugins'
            )
          )
        } else if (item.data === 'https://linux.do/pub/resources') {
          processedUrl = 'https://wsrv.nl/?url=&default='.concat(
            encodeURIComponent('https://linux.do/pub/resources')
          )
        } else if (item.data === 'https://linux.do/cdn-cgi/trace') {
          processedUrl = 'https://wsrv.nl/?url=&default='.concat(
            encodeURIComponent('https://linux.do/cdn-cgi/trace')
          )
        }
        if (!processedUrl) {
          countVarFiltered++
          return void 0
        }
        if (isSameOrigin(processedUrl)) {
          try {
            const u = new URL(processedUrl)
            processedUrl = u.pathname + u.search + u.hash
          } catch (e) {}
        }
        if (processedUrl.startsWith('?')) {
          countVarFiltered++
          return void 0
        }
        return __spreadProps(__spreadValues({}, item), { url: processedUrl })
      })
      .filter((item) => {
        if (!item) return false
        if (existingUrls.has(item.url)) {
          countDupFiltered++
          return false
        }
        existingUrls.add(item.url)
        return true
      })
    if (urlItems.length === 0) {
      showToast(
        '\u65E0\u53EF\u7528\u5BFC\u5165\u9879 (\u603B\u6570: '
          .concat(countTotal, ', \u7C7B\u578B\u8FC7\u6EE4: ')
          .concat(countTypeFiltered, ', \u53D8\u91CF\u8FC7\u6EE4: ')
          .concat(countVarFiltered, ', \u91CD\u590D\u8FC7\u6EE4: ')
          .concat(countDupFiltered, ')'),
        form
      )
      return
    }
    for (let i = 0; i < urlItems.length; i++) {
      addBtn.click()
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
    const rows = form.querySelectorAll('.sidebar-section-form-link')
    const startIndex = Math.max(0, rows.length - urlItems.length)
    for (const [index, item] of urlItems.entries()) {
      const row = rows[startIndex + index]
      if (row) {
        fillRow(row, item)
      }
    }
    for (const row of form.querySelectorAll('.sidebar-section-form-link')) {
      const nameInput = row.querySelector('input[name="link-name"]')
      const urlInput = row.querySelector('input[name="link-url"]')
      const deleteBtn = row.querySelector('button.delete-link')
      const name =
        (_a = nameInput == null ? void 0 : nameInput.value.trim()) != null
          ? _a
          : ''
      const url =
        (_b = urlInput == null ? void 0 : urlInput.value.trim()) != null
          ? _b
          : ''
      if (!name && !url && deleteBtn) {
        deleteBtn.click()
      }
    }
    showToast(
      '\u5BFC\u5165 '
        .concat(urlItems.length, ' \u9879 (\u603B\u6570: ')
        .concat(countTotal, ', \u7C7B\u578B\u8FC7\u6EE4: ')
        .concat(countTypeFiltered, ', \u53D8\u91CF\u8FC7\u6EE4: ')
        .concat(countVarFiltered, ', \u91CD\u590D\u8FC7\u6EE4: ')
        .concat(countDupFiltered, ')'),
      form
    )
  }
  function processUrl(url) {
    if (!url) return void 0
    const allowedVars = /* @__PURE__ */ new Set([
      'hostname',
      'hostname_without_www',
      'hostname_top_level',
    ])
    const re = /{([^}]+)}/g
    let hasDisallowed = false
    const matches = url.match(re)
    if (matches) {
      for (const match of matches) {
        const content = match.slice(1, -1)
        const parts = content.split('||').map((p) => p.trim())
        if (!parts.every((p) => allowedVars.has(p))) {
          hasDisallowed = true
          break
        }
      }
    }
    if (hasDisallowed) return void 0
    return resolveUrlTemplate(url)
  }
  function fillRow(row, item) {
    const nameInput = row.querySelector('input[name="link-name"]')
    const urlInput = row.querySelector('input[name="link-url"]')
    if (nameInput) {
      nameInput.value = item.name
      nameInput.dispatchEvent(new Event('input', { bubbles: true }))
      nameInput.dispatchEvent(new Event('change', { bubbles: true }))
    }
    if (urlInput) {
      urlInput.value = item.url
      urlInput.dispatchEvent(new Event('input', { bubbles: true }))
      urlInput.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
  function showDropdownMenu(root, anchor, items, options) {
    for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
      n.remove()
    const menu = document.createElement('div')
    menu.className = 'quick-add-menu'
    menu.setAttribute('role', 'menu')
    const cleanup = () => {
      for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
        n.remove()
      if (options.onClose) options.onClose()
    }
    for (const it of items) {
      const btn = document.createElement('button')
      btn.className = 'quick-add-item'
      btn.setAttribute('role', 'menuitem')
      btn.setAttribute('tabindex', '0')
      btn.dataset.icon = it.icon
      btn.textContent = it.label
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        try {
          it.onClick(e)
        } finally {
          cleanup()
        }
      })
      menu.append(btn)
    }
    menu.style.visibility = 'hidden'
    root.append(menu)
    const r = anchor.getBoundingClientRect()
    const menuHeight = menu.offsetHeight
    const windowHeight = window.innerHeight
    let top = Math.round(r.bottom + 6)
    if (top + menuHeight > windowHeight) {
      const topAbove = Math.round(r.top - 6 - menuHeight)
      if (topAbove > 0) {
        top = topAbove
      }
    }
    menu.style.position = 'fixed'
    if (options.rightSide) {
      const right = Math.round(window.innerWidth - r.right)
      menu.style.top = ''.concat(top, 'px')
      menu.style.right = ''.concat(right, 'px')
    } else {
      const left = Math.round(r.left)
      menu.style.top = ''.concat(top, 'px')
      menu.style.left = ''.concat(left, 'px')
    }
    menu.style.visibility = ''
    setTimeout(() => {
      const onOutside = () => {
        cleanup()
      }
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
  function resolveTargetUrl(data, extraResolvers) {
    const path = String(data || '').trim() || '/'
    return new URL(resolveUrlTemplate(path, extraResolvers), location.href).href
  }
  function resolveIcon(icon, type, data, options) {
    const rawIcon = String(icon || '')
    let iconStr =
      rawIcon ||
      (options == null ? void 0 : options.defaultIcon) ||
      'lucide:link'
    if (rawIcon.startsWith('favicon')) {
      const param = rawIcon.split(':')[1]
      const sizeNum = param ? Number.parseInt(param, 10) : 64
      const size = sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
      if (type === 'url') {
        try {
          const targetUrl = resolveTargetUrl(
            data,
            options == null ? void 0 : options.extraResolvers
          )
          iconStr = 'url:' + getFaviconUrl(targetUrl, size)
        } catch (e) {}
      } else {
        iconStr =
          'url:https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png'
      }
    }
    return iconStr
  }
  function isEditableTarget(t) {
    const el = t
    if (!el) return false
    const tag = el.tagName ? el.tagName.toLowerCase() : ''
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
    const ce = el.isContentEditable
    return Boolean(ce)
  }
  function createGroupManagerPanel(root, cfg, helpers) {
    const wrap = document.createElement('div')
    wrap.className = 'panel-split'
    const sidebar = document.createElement('div')
    sidebar.className = 'panel-sidebar'
    const sidebarList = document.createElement('div')
    sidebarList.className = 'flex-1'
    const sidebarActions = document.createElement('div')
    sidebarActions.className = 'sidebar-actions'
    const content = document.createElement('div')
    content.className = 'panel-content'
    const contentHeader = document.createElement('div')
    contentHeader.className = 'content-header'
    const contentTabs = document.createElement('div')
    contentTabs.className = 'content-tabs'
    const contentBody = document.createElement('div')
    contentBody.className = 'tab-pane'
    content.append(contentHeader)
    content.append(contentTabs)
    content.append(contentBody)
    let activeGroup = (cfg.groups || [])[0]
    let activeTab = 'shortcuts'
    let isSettingsDirty = false
    let pendingGroupData
    let activeLinkItem
    let isLinkDirty = false
    let editingLinkOriginalId
    const savePendingSettings = () => {
      if (pendingGroupData && activeGroup) {
        Object.assign(activeGroup, pendingGroupData)
        if (!activeGroup.displayName) delete activeGroup.displayName
        if (!activeGroup.icon) delete activeGroup.icon
        if (activeGroup.hidden === false) delete activeGroup.hidden
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
        rebuildContentHeader()
        rebuildSidebar()
      }
      isSettingsDirty = false
      pendingGroupData = void 0
    }
    const checkUnsavedChanges = (callback) => {
      if (isSettingsDirty) {
        if (
          globalThis.confirm(
            '\u5F53\u524D\u5206\u7EC4\u8BBE\u7F6E\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\uFF0C\u662F\u5426\u4FDD\u5B58\uFF1F\n(\u786E\u5B9A\uFF1A\u4FDD\u5B58\u5E76\u7EE7\u7EED\uFF1B\u53D6\u6D88\uFF1A\u653E\u5F03\u4FEE\u6539\u5E76\u7EE7\u7EED)'
          )
        ) {
          savePendingSettings()
        } else {
          isSettingsDirty = false
          pendingGroupData = void 0
        }
      }
      if (isLinkDirty) {
        if (
          !globalThis.confirm(
            '\u5F53\u524D\u94FE\u63A5\u7F16\u8F91\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\uFF0C\u786E\u5B9A\u653E\u5F03\u4FEE\u6539\u5417\uFF1F'
          )
        ) {
          return
        }
        activeLinkItem = void 0
        isLinkDirty = false
        editingLinkOriginalId = void 0
      }
      callback()
    }
    const handleGroupClick = (g) => {
      checkUnsavedChanges(() => {
        activeGroup = g
        activeLinkItem = void 0
        isLinkDirty = false
        editingLinkOriginalId = void 0
        rebuildSidebar()
        rebuildContent()
      })
    }
    function rebuildSidebar() {
      clearChildren(sidebarList)
      for (const g of cfg.groups || []) {
        const item = document.createElement('div')
        item.className =
          'sidebar-item' + (g.id === activeGroup.id ? ' active' : '')
        item.addEventListener('click', () => {
          handleGroupClick(g)
        })
        const iconEl = document.createElement('div')
        iconEl.className = 'shortcut-icon'
        setIcon(iconEl, g.icon || 'lucide:folder')
        item.append(iconEl)
        const info = document.createElement('div')
        info.className = 'flex-1 min-w-0'
        item.append(info)
        const name = document.createElement('div')
        name.className = 'sidebar-item-name'
        name.textContent = g.name
        info.append(name)
        if (g.displayName) {
          const desc = document.createElement('div')
          desc.className = 'sidebar-item-desc'
          desc.textContent = g.displayName
          info.append(desc)
        }
        sidebarList.append(item)
      }
    }
    const addGroupBtn = document.createElement('button')
    addGroupBtn.className = 'btn btn-secondary w-full justify-center'
    addGroupBtn.textContent = '\u6DFB\u52A0\u5206\u7EC4'
    addGroupBtn.addEventListener('click', () => {
      checkUnsavedChanges(() => {
        const ng = {
          id: uid(),
          name: '\u65B0\u5206\u7EC4',
          icon: 'lucide:folder',
          match: ['*://' + (location.hostname || '') + '/*'],
          items: [],
          defaultOpen: void 0,
        }
        cfg.groups.push(ng)
        activeGroup = ng
        activeTab = 'settings'
        helpers.saveConfig(cfg)
        rebuildSidebar()
        const activeEl = sidebarList.querySelector('.sidebar-item.active')
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        rebuildContent()
        helpers.rerender(root, cfg)
      })
    })
    sidebarActions.append(addGroupBtn)
    const delEmptyGroupsBtn = document.createElement('button')
    delEmptyGroupsBtn.className =
      'btn btn-secondary w-full justify-center text-xs'
    delEmptyGroupsBtn.textContent = '\u6E05\u7406\u7A7A\u5206\u7EC4'
    delEmptyGroupsBtn.addEventListener('click', () => {
      checkUnsavedChanges(() => {
        const empties = (cfg.groups || []).filter(
          (g) => (g.items || []).length === 0
        )
        const n = empties.length
        if (n === 0) {
          globalThis.alert('\u6CA1\u6709\u53D1\u73B0\u7A7A\u5206\u7EC4')
          return
        }
        const ok = globalThis.confirm(
          '\u786E\u8BA4\u5220\u9664 ' +
            String(n) +
            ' \u4E2A\u7A7A\u5206\u7EC4\uFF1F'
        )
        if (!ok) return
        const kept = (cfg.groups || []).filter(
          (g) => (g.items || []).length > 0
        )
        if (kept.length === 0) {
          const ng = {
            id: uid(),
            name: '\u65B0\u5206\u7EC4',
            icon: 'lucide:folder',
            match: ['*://' + (location.hostname || '') + '/*'],
            items: [],
            defaultOpen: void 0,
          }
          kept.push(ng)
        }
        cfg.groups = kept
        activeGroup = cfg.groups[0]
        helpers.saveConfig(cfg)
        rebuildSidebar()
        rebuildContent()
        helpers.rerender(root, cfg)
      })
    })
    sidebarActions.append(delEmptyGroupsBtn)
    sidebar.append(sidebarList)
    sidebar.append(sidebarActions)
    function rebuildContentHeader() {
      clearChildren(contentHeader)
      const title = document.createElement('div')
      title.className = 'content-title'
      title.textContent = activeGroup.name
      contentHeader.append(title)
      const delBtn = document.createElement('button')
      delBtn.className = 'btn btn-secondary mini text-red-600'
      delBtn.textContent = '\u5220\u9664\u5206\u7EC4'
      delBtn.addEventListener('click', () => {
        if ((cfg.groups || []).length <= 1) return
        if (
          !globalThis.confirm(
            '\u786E\u8BA4\u5220\u9664\u5206\u7EC4 "' +
              String(activeGroup.name) +
              '" \u53CA\u5176\u6240\u6709\u5185\u5BB9\uFF1F'
          )
        )
          return
        isSettingsDirty = false
        pendingGroupData = void 0
        activeLinkItem = void 0
        isLinkDirty = false
        cfg.groups = (cfg.groups || []).filter((g) => g.id !== activeGroup.id)
        activeGroup = cfg.groups[0]
        helpers.saveConfig(cfg)
        rebuildSidebar()
        rebuildContent()
        helpers.rerender(root, cfg)
      })
      if ((cfg.groups || []).length <= 1) {
        delBtn.disabled = true
        delBtn.style.opacity = '0.5'
      }
      contentHeader.append(delBtn)
    }
    const handleTabClick = (k) => {
      checkUnsavedChanges(() => {
        activeTab = k
        rebuildTabs()
        rebuildTabContent()
      })
    }
    function rebuildTabs() {
      clearChildren(contentTabs)
      const tabs = [
        { key: 'shortcuts', label: '\u5FEB\u6377\u5BFC\u822A (Shortcuts)' },
        { key: 'settings', label: '\u5206\u7EC4\u8BBE\u7F6E' },
      ]
      for (const t of tabs) {
        const btn = document.createElement('div')
        btn.className = 'tab-btn' + (activeTab === t.key ? ' active' : '')
        btn.textContent = t.label
        btn.addEventListener('click', () => {
          handleTabClick(t.key)
        })
        contentTabs.append(btn)
      }
    }
    function rebuildTabContent() {
      clearChildren(contentBody)
      if (activeTab === 'settings') {
        renderSettingsTab(contentBody)
      } else {
        renderShortcutsTab(contentBody)
      }
    }
    function renderSettingsTab(container) {
      const initData = __spreadValues({}, activeGroup)
      pendingGroupData = initData
      if (activeGroup.match) pendingGroupData.match = [...activeGroup.match]
      isSettingsDirty = false
      const cancelBtn = document.createElement('button')
      const saveBtn = document.createElement('button')
      const formWrap = document.createElement('div')
      renderGroupForm(formWrap, pendingGroupData, {
        onChange() {
          isSettingsDirty = true
          cancelBtn.disabled = false
          saveBtn.disabled = false
        },
      })
      const actions = document.createElement('div')
      actions.className = 'row justify-end mt-4 gap-2'
      cancelBtn.className = 'btn btn-secondary'
      cancelBtn.textContent = '\u53D6\u6D88'
      cancelBtn.disabled = true
      cancelBtn.addEventListener('click', () => {
        if (
          isSettingsDirty &&
          !globalThis.confirm(
            '\u786E\u5B9A\u653E\u5F03\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\u5417\uFF1F'
          )
        ) {
          return
        }
        isSettingsDirty = false
        pendingGroupData = void 0
        renderSettingsTab(container)
      })
      saveBtn.className = 'btn btn-primary'
      saveBtn.textContent = '\u4FDD\u5B58\u8BBE\u7F6E'
      saveBtn.disabled = true
      saveBtn.addEventListener('click', () => {
        savePendingSettings()
        renderSettingsTab(container)
      })
      actions.append(cancelBtn)
      actions.append(saveBtn)
      clearChildren(container)
      container.append(formWrap)
      container.append(actions)
    }
    function renderShortcutsTab(container) {
      if (activeLinkItem) {
        renderLinkEditor(container)
      } else {
        renderLinkList(container)
      }
    }
    function renderLinkEditor(container) {
      if (!activeLinkItem) return
      const formWrap = document.createElement('div')
      const actions = document.createElement('div')
      actions.className = 'row justify-end mt-4 gap-2'
      const cancelBtn = document.createElement('button')
      const saveBtn = document.createElement('button')
      let tempMask
      let tempModal
      renderLinkForm(formWrap, activeLinkItem, {
        root,
        groups: cfg.groups || [],
        disableGroupSelector: Boolean(editingLinkOriginalId),
        onChange() {
          isLinkDirty = true
          saveBtn.disabled = false
        },
        onPickStart() {
          const mask = root.querySelector('.modal-mask')
          if (mask) {
            tempMask = mask
            tempModal = mask.querySelector('.modal')
            if (tempModal) tempModal.style.display = 'none'
            mask.remove()
          }
        },
        onPickEnd() {
          if (tempMask && tempModal) {
            tempModal.style.display = ''
            root.append(tempMask)
          }
        },
      })
      cancelBtn.className = 'btn btn-secondary'
      cancelBtn.textContent = '\u53D6\u6D88'
      cancelBtn.addEventListener('click', () => {
        if (
          isLinkDirty &&
          !globalThis.confirm(
            '\u786E\u5B9A\u653E\u5F03\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\u5417\uFF1F'
          )
        ) {
          return
        }
        activeLinkItem = void 0
        isLinkDirty = false
        editingLinkOriginalId = void 0
        renderShortcutsTab(container)
      })
      saveBtn.className = 'btn btn-primary'
      saveBtn.textContent = editingLinkOriginalId
        ? '\u786E\u8BA4'
        : '\u6DFB\u52A0'
      saveBtn.disabled = !isLinkDirty
      saveBtn.addEventListener('click', () => {
        const gid = activeLinkItem.groupId
        const grp = (cfg.groups || []).find((g) => g.id === gid)
        if (!grp) return
        const hasDup = hasDuplicateInGroup(
          grp,
          activeLinkItem.type,
          activeLinkItem.data,
          editingLinkOriginalId
        )
        if (hasDup) {
          const msg =
            activeLinkItem.type === 'url'
              ? editingLinkOriginalId
                ? '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 URL\uFF0C\u662F\u5426\u7EE7\u7EED\u4FDD\u5B58\uFF1F'
                : '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 URL\uFF0C\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\uFF1F'
              : editingLinkOriginalId
                ? '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 JS\uFF0C\u662F\u5426\u7EE7\u7EED\u4FDD\u5B58\uFF1F'
                : '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 JS\uFF0C\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\uFF1F'
          const ok = globalThis.confirm(msg)
          if (!ok) return
        }
        if (editingLinkOriginalId) {
          const it = grp.items.find((x) => x.id === editingLinkOriginalId)
          if (it) {
            it.name = activeLinkItem.name
            it.icon = activeLinkItem.icon
            it.type = activeLinkItem.type
            it.data = activeLinkItem.data
            it.openIn = activeLinkItem.openIn
            it.hidden = activeLinkItem.hidden
          }
        } else {
          const it = {
            id: activeLinkItem.id || uid(),
            name: activeLinkItem.name,
            icon: activeLinkItem.icon,
            type: activeLinkItem.type,
            data: activeLinkItem.data,
            openIn: activeLinkItem.openIn,
            hidden: activeLinkItem.hidden,
          }
          grp.items.push(it)
        }
        try {
          helpers.saveConfig(cfg)
        } catch (e) {}
        try {
          helpers.rerender(root, cfg)
        } catch (e) {}
        activeLinkItem = void 0
        isLinkDirty = false
        editingLinkOriginalId = void 0
        if (grp.id !== activeGroup.id) {
        }
        renderShortcutsTab(container)
      })
      actions.append(cancelBtn)
      actions.append(saveBtn)
      clearChildren(container)
      container.append(formWrap)
      container.append(actions)
    }
    function renderLinkList(container) {
      clearChildren(container)
      const list = document.createElement('div')
      list.className = 'shortcut-list'
      const grp = activeGroup
      const addRow = document.createElement('div')
      addRow.className = 'mb-3'
      const addBtn = document.createElement('button')
      addBtn.className = 'btn btn-primary w-full justify-center'
      addBtn.textContent = '+ \u6DFB\u52A0\u5FEB\u6377\u5BFC\u822A'
      addBtn.addEventListener('click', () => {
        activeLinkItem = {
          id: uid(),
          groupId: activeGroup.id,
          name: '\u65B0\u9879',
          type: 'url',
          data: '/',
          openIn: void 0,
        }
        isLinkDirty = false
        editingLinkOriginalId = void 0
        renderShortcutsTab(container)
      })
      addRow.append(addBtn)
      container.append(addRow)
      for (const it of grp.items || []) {
        const itemEl = document.createElement('div')
        itemEl.className = 'shortcut-item group'
        if (it.hidden) itemEl.classList.add('is-hidden')
        const iconEl = document.createElement('div')
        iconEl.className = 'shortcut-icon'
        {
          const iconStr = resolveIcon(it.icon, it.type, it.data, {
            defaultIcon: 'lucide:link',
          })
          setIcon(iconEl, iconStr)
        }
        itemEl.append(iconEl)
        const info = document.createElement('div')
        info.className = 'shortcut-info'
        const name = document.createElement('div')
        name.className = 'shortcut-name'
        name.textContent = it.name
        info.append(name)
        const meta = document.createElement('div')
        meta.className = 'shortcut-meta'
        meta.textContent =
          (it.type === 'js' ? 'JS' : 'URL') +
          ' \u2022 ' +
          String(it.openIn || '\u9ED8\u8BA4')
        if (it.hidden) meta.textContent += ' \u2022 \u5DF2\u9690\u85CF'
        info.append(meta)
        itemEl.append(info)
        const actions = document.createElement('div')
        actions.className = 'shortcut-actions'
        const editBtn = document.createElement('button')
        editBtn.className = 'icon-btn'
        setIcon(editBtn, 'lucide:edit-3', '\u7F16\u8F91')
        editBtn.addEventListener('click', () => {
          activeLinkItem = {
            id: it.id,
            groupId: activeGroup.id,
            name: it.name,
            icon: it.icon,
            type: it.type,
            data: it.data,
            openIn: it.openIn,
            hidden: it.hidden,
          }
          isLinkDirty = false
          editingLinkOriginalId = it.id
          renderShortcutsTab(container)
        })
        actions.append(editBtn)
        const hideBtn = document.createElement('button')
        hideBtn.className = 'icon-btn'
        setIcon(
          hideBtn,
          it.hidden ? 'lucide:eye' : 'lucide:eye-off',
          it.hidden ? '\u663E\u793A' : '\u9690\u85CF'
        )
        hideBtn.addEventListener('click', () => {
          it.hidden = !it.hidden
          helpers.saveConfig(cfg)
          rebuildTabContent()
          helpers.rerender(root, cfg)
        })
        actions.append(hideBtn)
        const delBtn = document.createElement('button')
        delBtn.className = 'icon-btn text-danger'
        setIcon(delBtn, 'lucide:trash-2', '\u5220\u9664')
        delBtn.addEventListener('click', () => {
          if (
            !globalThis.confirm(
              '\u786E\u5B9A\u5220\u9664 "' + String(it.name) + '" \u5417\uFF1F'
            )
          )
            return
          grp.items = (grp.items || []).filter((x) => x.id !== it.id)
          helpers.saveConfig(cfg)
          rebuildTabContent()
          helpers.rerender(root, cfg)
        })
        actions.append(delBtn)
        itemEl.append(actions)
        list.append(itemEl)
      }
      container.append(list)
    }
    function rebuildContent() {
      rebuildContentHeader()
      rebuildTabs()
      rebuildTabContent()
    }
    rebuildSidebar()
    rebuildContent()
    wrap.append(sidebar)
    wrap.append(content)
    return { el: wrap, checkUnsavedChanges }
  }
  function openEditorModal(root, cfg, helpers) {
    const { modal, body, actions, close } = createModalFrame({
      root,
      title: '\u5206\u7EC4\u7BA1\u7406',
    })
    modal.classList.add('editor')
    const groupsPanel = createGroupManagerPanel(root, cfg, helpers)
    body.append(groupsPanel.el)
    const closeBtn = document.createElement('button')
    closeBtn.className = 'btn btn-secondary'
    closeBtn.textContent = '\u5173\u95ED'
    closeBtn.addEventListener('click', () => {
      groupsPanel.checkUnsavedChanges(() => {
        close()
      })
    })
    actions.append(closeBtn)
  }
  var style_default2 =
    '/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-50:oklch(97.1% 0.013 17.38);--color-red-500:oklch(63.7% 0.237 25.331);--color-blue-300:oklch(80.9% 0.105 251.813);--color-blue-400:oklch(70.7% 0.165 254.624);--color-blue-600:oklch(54.6% 0.245 262.881);--color-blue-700:oklch(48.8% 0.243 264.376);--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-800:oklch(27.8% 0.033 256.848);--color-gray-900:oklch(21% 0.034 264.665);--color-white:#fff;--spacing:4px;--font-weight-semibold:600;--font-weight-bold:700;--radius-md:6px;--radius-xl:12px;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.container{width:100%;@media (width >= 40rem){max-width:640px}@media (width >= 48rem){max-width:768px}@media (width >= 64rem){max-width:1024px}@media (width >= 80rem){max-width:1280px}@media (width >= 96rem){max-width:1536px}}.grid{display:grid}}:host{all:initial}.user-settings{position:fixed;right:calc(var(--spacing)*3);top:calc(var(--spacing)*3);z-index:2147483647;--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .panel{background-color:var(--color-gray-100);border-bottom-left-radius:var(--radius-xl);border-bottom-right-radius:var(--radius-xl);color:var(--color-gray-900);font-family:var(--font-sans);font-size:14px;max-height:90vh;overflow-y:auto;padding-inline:calc(var(--spacing)*4);padding-bottom:calc(var(--spacing)*4);padding-top:calc(var(--spacing)*0);width:420px;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));background:#f2f2f7;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);box-shadow:0 10px 39px 10px #3e424238!important;scrollbar-color:rgba(156,163,175,.25) transparent;scrollbar-width:thin}.user-settings .grid{display:flex;flex-direction:column;gap:calc(var(--spacing)*3)}.user-settings .row{align-items:center;display:flex;gap:calc(var(--spacing)*3);justify-content:space-between;padding-block:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4)}.user-settings .group{background-color:var(--color-white);border-radius:var(--radius-xl);gap:calc(var(--spacing)*0);overflow:hidden}.user-settings .group .row{background-color:var(--color-white);border-radius:0;border-style:var(--tw-border-style);border-width:0;padding-block:calc(var(--spacing)*3);padding-inline:calc(var(--spacing)*4);position:relative}.user-settings .group .row:not(:last-child):after{background:#e5e7eb;bottom:0;content:"";height:1px;left:16px;position:absolute;right:0}.user-settings .header-row{align-items:center;border-radius:0;display:flex;justify-content:center;padding-inline:calc(var(--spacing)*0);padding-bottom:calc(var(--spacing)*3);padding-top:calc(var(--spacing)*0)}.user-settings .panel-stuck .header-row .panel-title{opacity:0;transform:translateY(-2px);transition:opacity .15s ease,transform .15s ease}.user-settings label{color:var(--color-gray-600)}.user-settings .label-wrap{display:flex;flex-direction:column;gap:calc(var(--spacing)*1);min-width:60px;text-align:left}.user-settings .btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);white-space:nowrap;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .btn-danger{border-color:var(--color-red-500);color:var(--color-red-500);&:hover{@media (hover:hover){background-color:var(--color-red-50)}}}.user-settings .btn-ghost{border-radius:var(--radius-md);color:var(--color-gray-500);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.user-settings input[type=text]{border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:180px;--tw-outline-style:none;outline-style:none}.user-settings input[type=text]:focus,.user-settings input[type=text]:hover{border-color:var(--color-gray-300)}.user-settings select{background-color:var(--color-white);border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:180px;--tw-outline-style:none;outline-style:none}.user-settings select:focus,.user-settings select:hover{border-color:var(--color-gray-300)}.user-settings input[type=color]{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;height:calc(var(--spacing)*8);padding:calc(var(--spacing)*0);width:80px}.user-settings textarea{border-color:transparent;border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);text-align:right;width:100%;--tw-outline-style:none;outline-style:none}.user-settings textarea:focus,.user-settings textarea:hover{border-color:var(--color-gray-300)}.user-settings .switch,.user-settings .toggle-wrap{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.user-settings .toggle-checkbox{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:#e5e5ea;border:1px solid #d1d1d6;border-radius:9999px;box-shadow:inset 0 1px 1px rgba(0,0,0,.1);cursor:pointer;display:inline-block;height:22px;position:relative;transition:background-color .2s ease,border-color .2s ease;width:42px}.user-settings .toggle-checkbox:before{background:#fff;border-radius:9999px;box-shadow:0 2px 4px rgba(0,0,0,.25);content:"";height:18px;left:2px;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease,background-color .2s ease,left .2s ease,right .2s ease;width:18px}.user-settings .toggle-checkbox:checked{background:var(--user-toggle-on-bg,#34c759);border-color:var(--user-toggle-on-bg,#34c759)}.user-settings .panel-title{font-size:20px;--tw-font-weight:var(--font-weight-bold);color:var(--color-gray-800);font-weight:var(--font-weight-bold)}.user-settings .outer-header{align-items:center;background-color:var(--color-gray-100);background:#f2f2f7;border-top-left-radius:var(--radius-xl);border-top-right-radius:var(--radius-xl);display:flex;font-family:var(--font-sans);height:calc(var(--spacing)*11);justify-content:center;position:relative}.user-settings .outer-header .outer-title{font-size:20px;opacity:0;transition:opacity .15s ease;--tw-font-weight:var(--font-weight-bold);color:var(--color-gray-800);font-weight:var(--font-weight-bold)}.user-settings .outer-header.stuck .outer-title{opacity:1}.user-settings .outer-header:after{background:#e5e7eb;bottom:0;content:"";height:1px;left:0;opacity:0;position:absolute;right:0;transition:opacity .15s ease}.user-settings .outer-header.stuck:after{opacity:1}.user-settings .group-title{font-size:13px;padding-inline:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-600);font-weight:var(--font-weight-semibold)}.user-settings .btn-ghost.icon{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-500);cursor:pointer;display:flex;font-size:16px;height:calc(var(--spacing)*9);justify-content:center;transition:background-color .15s ease,color .15s ease;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:calc(var(--spacing)*9);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:hover{@media (hover:hover){color:var(--color-gray-700)}}}.user-settings .close-btn:hover{background-color:var(--color-gray-300);box-shadow:0 0 0 1px rgba(0,0,0,.05);color:var(--color-gray-900);font-size:19px;transform:translateY(-50%)}.user-settings .close-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);transition:transform .15s ease,background-color .15s ease,color .15s ease,font-size .15s ease}.user-settings .toggle-checkbox:checked:before{background:#fff;left:auto;right:2px;transform:translateY(-50%)}.user-settings .color-row{align-items:center;display:flex;gap:calc(var(--spacing)*1.5)}.user-settings .color-swatch{border-radius:var(--radius-md);cursor:pointer;height:calc(var(--spacing)*6);width:calc(var(--spacing)*6)}.user-settings .color-swatch.active{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .seg{align-items:center;display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*2)}.user-settings .seg.vertical{align-items:flex-end;flex-direction:column}.user-settings .seg-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .seg-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .value-wrap{align-items:flex-end;display:flex;flex-direction:column;gap:calc(var(--spacing)*1);text-align:right}.user-settings .tabs{align-items:center;display:flex;gap:calc(var(--spacing)*2);margin-bottom:calc(var(--spacing)*2)}.user-settings .tab-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .tab-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .field-help{color:var(--color-gray-400);font-size:11px}.row.help-row .field-help{margin-left:calc(var(--spacing)*0)}.user-settings .field-help a{color:var(--color-blue-600);text-decoration:underline;text-decoration-style:dashed;text-underline-offset:2px;&:hover{@media (hover:hover){color:var(--color-blue-700)}}}@media (prefers-color-scheme:dark){.user-settings .panel{background-color:var(--color-gray-800);border-bottom-left-radius:var(--radius-xl);border-bottom-right-radius:var(--radius-xl);box-shadow:0 10px 39px 10px #00000040!important;color:var(--color-gray-100)}.user-settings .row{background-color:transparent;border-style:var(--tw-border-style);border-width:0}.user-settings .header-row{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.user-settings .outer-header{background-color:var(--color-gray-800);border-top-left-radius:var(--radius-xl);border-top-right-radius:var(--radius-xl)}.user-settings .outer-header:after{background:#4b5563}.user-settings .footer a.issue-link{color:var(--color-gray-300);&:hover{@media (hover:hover){color:var(--color-gray-100)}}}.user-settings .footer .brand{color:var(--color-gray-400)}.user-settings label{color:var(--color-gray-300)}.user-settings .field-help{color:var(--color-gray-400)}.user-settings .field-help a{color:var(--color-blue-400);&:hover{@media (hover:hover){color:var(--color-blue-300)}}}.user-settings .group{background-color:var(--color-gray-700)}.user-settings .group .row:not(:last-child):after{background:#4b5563}}.user-settings .panel::-webkit-scrollbar{width:4px}.user-settings .panel::-webkit-scrollbar-track{background:transparent}.user-settings .panel::-webkit-scrollbar-thumb{background:rgba(156,163,175,.25);border-radius:9999px;opacity:.25}.user-settings .footer{align-items:center;color:var(--color-gray-500);display:flex;flex-direction:column;font-size:12px;gap:calc(var(--spacing)*1);padding-bottom:calc(var(--spacing)*3);padding-top:calc(var(--spacing)*6)}.user-settings .footer a.issue-link{color:var(--color-gray-600);cursor:pointer;text-decoration-line:underline;text-underline-offset:2px;-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){color:var(--color-gray-800)}}}.user-settings .footer .brand{color:var(--color-gray-500);cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;&:hover{@media (hover:hover){color:var(--color-gray-700)}}}.user-settings button{-webkit-user-select:none;-moz-user-select:none;user-select:none}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-border-style:solid;--tw-font-weight:initial}}'
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
  function importJson(options) {
    const {
      validate,
      onSuccess,
      confirmMessage = '\u5BFC\u5165\u4F1A\u4E0E\u73B0\u6709\u6570\u636E\u5408\u5E76\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F',
      errorMessage = '\u5BFC\u5165\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E',
    } = options
    if (confirmMessage) {
      const ok = globalThis.confirm(confirmMessage)
      if (!ok) return
    }
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'application/json'
    fileInput.style.display = 'none'
    const cleanup = () => {
      fileInput.removeEventListener('change', onChange)
      fileInput.removeEventListener('cancel', cleanup)
      fileInput.remove()
    }
    const onChange = async () => {
      var _a
      try {
        const f = (_a = fileInput.files) == null ? void 0 : _a[0]
        if (!f) return
        const txt = await f.text()
        let obj
        try {
          obj = JSON.parse(txt)
        } catch (e) {
          alert('\u65E0\u6CD5\u89E3\u6790 JSON \u6587\u4EF6')
          return
        }
        if (validate && !validate(obj)) {
          alert(errorMessage)
          return
        }
        const result = await onSuccess(obj)
        if (result !== false) {
          alert('\u5BFC\u5165\u5B8C\u6210')
        }
      } catch (error) {
        console.error(error)
        alert('\u5BFC\u5165\u5931\u8D25')
      } finally {
        cleanup()
      }
    }
    fileInput.addEventListener('change', onChange)
    fileInput.addEventListener('cancel', cleanup)
    document.documentElement.append(fileInput)
    fileInput.click()
  }
  var SETTINGS_KEY = 'settings'
  var POSITION_OPTIONS = [
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
  ]
  var DEFAULTS = {
    hotkey: 'Alt+Shift+K',
    syncUrl: '',
    position: 'right-top',
    defaultOpen: 'same-tab',
    theme: 'system',
    panelBackgroundColor: 'default',
    pinned: false,
    enabled: true,
    layoutMode: 'floating',
    sidebarSide: 'right',
    sidebarUseIframe: false,
    edgeWidth: 3,
    edgeHeight: 60,
    edgeOpacity: 0.6,
    edgeColorLight: '#1A73E8',
    edgeColorDark: '#8AB4F8',
    edgeHidden: false,
    variables: [],
    siteVariables: [],
  }
  var COMMON_SETTINGS_FIELDS = [
    { type: 'toggle', key: 'enabled', label: '\u542F\u7528' },
    {
      type: 'input',
      key: 'hotkey',
      label: '\u5FEB\u6377\u952E',
      placeholder: DEFAULTS.hotkey,
      help: '\u6253\u5F00\u9762\u677F\u7684\u5FEB\u6377\u952E',
    },
    {
      type: 'radio',
      key: 'defaultOpen',
      label: '\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F',
      options: [
        { value: 'same-tab', label: '\u540C\u6807\u7B7E' },
        { value: 'new-tab', label: '\u65B0\u6807\u7B7E' },
      ],
      help: '\u9009\u62E9\u70B9\u51FB\u94FE\u63A5\u65F6\u7684\u9ED8\u8BA4\u6253\u5F00\u884C\u4E3A',
    },
    {
      type: 'radio',
      key: 'theme',
      label: '\u4E3B\u9898',
      options: [
        { value: 'system', label: '\u7CFB\u7EDF' },
        { value: 'light', label: '\u6D45\u8272' },
        { value: 'dark', label: '\u6DF1\u8272' },
      ],
      help: '\u5BFC\u822A\u9762\u677F\u4E3B\u9898\u504F\u597D',
    },
    {
      type: 'radio',
      key: 'panelBackgroundColor',
      label: '\u9762\u677F\u80CC\u666F',
      options: [
        { value: 'default', label: '\u9ED8\u8BA4' },
        { value: '#ffffff', label: '\u7EAF\u767D' },
        { value: '#fdf6e3', label: '\u6696\u8272' },
        { value: '#f0f9eb', label: '\u62A4\u773C' },
        { value: '#1f2937', label: '\u6697\u8272' },
        { value: '#000000', label: '\u7EAF\u9ED1' },
      ],
      help: '\u81EA\u5B9A\u4E49\u5BFC\u822A\u9762\u677F\u80CC\u666F\u989C\u8272',
    },
  ]
  var EDGE_SETTINGS_FIELDS = [
    {
      type: 'radio',
      key: 'layoutMode',
      label: '\u663E\u793A\u6A21\u5F0F',
      options: [
        { value: 'floating', label: '\u60AC\u6D6E' },
        { value: 'sidebar', label: '\u4FA7\u8FB9\u680F' },
      ],
    },
    {
      type: 'toggle',
      key: 'sidebarUseIframe',
      label: '\u4FA7\u8FB9\u680F\u4F7F\u7528 iframe \u52A0\u8F7D',
      renderHelp(el) {
        el.append(
          '\u542F\u7528\u540E\uFF0C\u5728\u4FA7\u8FB9\u680F\u6A21\u5F0F\u4E0B\uFF0C\u4F7F\u7528 iframe \u52A0\u8F7D\u9875\u9762\uFF0C\u907F\u514D\u906E\u6321\u5185\u5BB9\uFF08\u9700\u8981\u5237\u65B0\u9875\u9762\u624D\u4F1A\u751F\u6548\uFF09\u3002\u90E8\u5206\u7F51\u7AD9\u56E0\u5B89\u5168\u7B56\u7565\u4E0D\u652F\u6301 iframe\uFF0C\u5C06\u81EA\u52A8\u56DE\u9000\u5230\u666E\u901A\u6A21\u5F0F\u3002\u5982\u6709\u95EE\u9898\u8BF7\u53CD\u9988\uFF1A'
        )
        const a = document.createElement('a')
        a.href = 'https://github.com/utags/userscripts/issues'
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = 'utags/userscripts/issues'
        el.append(a)
      },
    },
    { type: 'toggle', key: 'pinned', label: '\u56FA\u5B9A\u9762\u677F' },
    {
      type: 'radio',
      key: 'sidebarSide',
      label: '\u4FA7\u8FB9\u680F\u4F4D\u7F6E',
      options: [
        { value: 'left', label: '\u5DE6\u4FA7' },
        { value: 'right', label: '\u53F3\u4FA7' },
      ],
    },
    {
      type: 'select',
      key: 'position',
      label: '\u4F4D\u7F6E',
      options: POSITION_OPTIONS.map((p) => ({ value: p, label: p })),
      help: '\u63A7\u5236\u60AC\u505C\u7AD6\u7EBF\u63D0\u793A\u7684\u4F4D\u7F6E',
    },
    {
      type: 'input',
      key: 'edgeWidth',
      label: '\u7AD6\u7EBF\u5BBD\u5EA6',
      help: '\u5355\u4F4D\u50CF\u7D20\uFF0C\u5EFA\u8BAE 2-4',
    },
    {
      type: 'input',
      key: 'edgeHeight',
      label: '\u7AD6\u7EBF\u9AD8\u5EA6',
      help: '\u5355\u4F4D\u50CF\u7D20\uFF0C\u5EFA\u8BAE 40-80',
    },
    {
      type: 'input',
      key: 'edgeOpacity',
      label: '\u4E0D\u900F\u660E\u5EA6',
      help: '0-1 \u4E4B\u95F4\u7684\u5C0F\u6570',
    },
    {
      type: 'colors',
      key: 'edgeColorLight',
      label: '\u6D45\u8272\u4E3B\u9898\u989C\u8272',
      options: [
        { value: '#1A73E8' },
        { value: '#2563EB' },
        { value: '#3B82F6' },
        { value: '#10B981' },
        { value: '#F59E0B' },
        { value: '#EF4444' },
        { value: '#6B7280' },
      ],
      help: '\u7528\u4E8E\u6D45\u8272\u4E3B\u9898\u7684\u7AD6\u7EBF\u989C\u8272',
    },
    {
      type: 'colors',
      key: 'edgeColorDark',
      label: '\u6DF1\u8272\u4E3B\u9898\u989C\u8272',
      options: [
        { value: '#8AB4F8' },
        { value: '#60A5FA' },
        { value: '#93C5FD' },
        { value: '#22C55E' },
        { value: '#F59E0B' },
        { value: '#EF4444' },
        { value: '#9CA3AF' },
      ],
      help: '\u7528\u4E8E\u6DF1\u8272\u4E3B\u9898\u7684\u7AD6\u7EBF\u989C\u8272',
    },
    { type: 'toggle', key: 'edgeHidden', label: '\u9690\u85CF\u7AD6\u7EBF' },
    {
      type: 'action',
      key: 'edge-reset',
      label: '\u7AD6\u7EBF\u8BBE\u7F6E',
      actions: [{ id: 'edgeReset', text: '\u91CD\u7F6E\u9ED8\u8BA4' }],
      help: '\u6062\u590D\u7AD6\u7EBF\u5BBD\u5EA6/\u9AD8\u5EA6/\u4E0D\u900F\u660E\u5EA6\u4E0E\u989C\u8272\u4E3A\u9ED8\u8BA4\u503C',
    },
  ]
  function createUshortcutsSettingsStore() {
    return createSettingsStore(SETTINGS_KEY, DEFAULTS, true)
  }
  function getShadowRoot() {
    const { root } = ensureShadowRoot({
      hostId: 'utags-shortcuts',
      hostDatasetKey: 'ushortcutsHost',
      style: style_default,
    })
    return root
  }
  function openSettingsPanel2(store2) {
    store2.onBeforeSet(async (values) => {
      if ('panelBackgroundColor' in values) {
        const v = values.panelBackgroundColor
        if (['#ffffff', '#fdf6e3', '#f0f9eb'].includes(v)) {
          values.theme = 'light'
        } else if (['#1f2937', '#000000'].includes(v)) {
          values.theme = 'dark'
        }
      }
      if ('theme' in values && !('panelBackgroundColor' in values)) {
        values.panelBackgroundColor = 'default'
      }
      return values
    })
    const schema = {
      type: 'tabs',
      title: '\u5FEB\u6377\u5BFC\u822A\u8BBE\u7F6E',
      tabs: [
        {
          id: 'global',
          title: '\u5168\u5C40\u8BBE\u7F6E',
          groups: [
            {
              id: 'global-basic',
              title: '',
              fields: COMMON_SETTINGS_FIELDS,
            },
            {
              id: 'global-edge',
              title: '\u9762\u677F\u4E0E\u7AD6\u7EBF',
              fields: EDGE_SETTINGS_FIELDS,
            },
            {
              id: 'global-variables',
              title: '\u5168\u5C40\u53D8\u91CF',
              fields: [
                {
                  type: 'custom',
                  key: 'variables',
                  render(container, options) {
                    const table = renderVariableTable(container, {
                      initialValue: [],
                      onChange: options.onChange,
                    })
                    return {
                      update(val) {
                        table.update(val)
                      },
                    }
                  },
                },
                {
                  type: 'help',
                  help: '\u5B9A\u4E49\u5168\u5C40\u53EF\u7528\u7684\u53D8\u91CF\uFF0C\u53EF\u5728 URL \u6216\u811A\u672C\u4E2D\u4F7F\u7528 {v:key} \u5F15\u7528',
                },
              ],
            },
            {
              id: 'global-reset',
              title: '',
              fields: [
                {
                  type: 'action',
                  key: 'global-reset',
                  label: '\u91CD\u7F6E',
                  actions: [
                    {
                      id: 'resetGlobal',
                      text: '\u91CD\u7F6E\u5168\u5C40\u8BBE\u7F6E',
                    },
                  ],
                  help: '\u6062\u590D\u5168\u5C40\u8BBE\u7F6E\u4E3A\u9ED8\u8BA4\u503C',
                },
              ],
            },
          ],
        },
        {
          id: 'site',
          title: '\u5F53\u524D\u7F51\u7AD9\u8BBE\u7F6E',
          groups: [
            {
              id: 'site-basic',
              title: '',
              fields: COMMON_SETTINGS_FIELDS.map((f) =>
                __spreadProps(__spreadValues({}, f), {
                  isSitePref: true,
                })
              ),
            },
            {
              id: 'site-edge',
              title: '\u9762\u677F\u4E0E\u7AD6\u7EBF',
              fields: EDGE_SETTINGS_FIELDS.map((f) =>
                __spreadProps(__spreadValues({}, f), {
                  isSitePref: true,
                })
              ),
            },
            {
              id: 'site-variables',
              title: '\u5F53\u524D\u7F51\u7AD9\u53D8\u91CF',
              fields: [
                {
                  type: 'custom',
                  key: 'siteVariables',
                  isSitePref: true,
                  render(container, options) {
                    const table = renderVariableTable(container, {
                      initialValue: [],
                      onChange(val) {
                        options.onChange(val)
                      },
                    })
                    return {
                      update(val) {
                        table.update(val)
                      },
                    }
                  },
                },
                {
                  type: 'help',
                  help: '\u4EC5\u5728\u5F53\u524D\u7F51\u7AD9\u751F\u6548\u7684\u53D8\u91CF\uFF0C\u4F18\u5148\u7EA7\u9AD8\u4E8E\u5168\u5C40\u53D8\u91CF',
                },
              ],
            },
            {
              id: 'site-reset',
              title: '',
              fields: [
                {
                  type: 'action',
                  key: 'site-reset',
                  label: '\u91CD\u7F6E',
                  actions: [
                    {
                      id: 'resetSite',
                      text: '\u91CD\u7F6E\u5F53\u524D\u7F51\u7AD9\u8BBE\u7F6E',
                    },
                  ],
                  help: '\u6062\u590D\u5F53\u524D\u7F51\u7AD9\u8BBE\u7F6E\u4E3A\u9ED8\u8BA4\u503C',
                },
              ],
            },
          ],
        },
        {
          id: 'actions',
          title: '\u6570\u636E\u7BA1\u7406',
          groups: [
            {
              id: 'data-group-manager',
              title: '\u5206\u7EC4\u4E0E\u5BFC\u822A\u9879',
              fields: [
                {
                  type: 'action',
                  key: 'group-management',
                  label: '\u5206\u7EC4\u7BA1\u7406',
                  actions: [
                    {
                      id: 'openGroupManager',
                      text: '\u6253\u5F00\u5206\u7EC4\u7BA1\u7406',
                    },
                  ],
                  help: '\u7BA1\u7406\u5BFC\u822A\u5206\u7EC4\u4E0E\u5BFC\u822A\u9879',
                },
                {
                  type: 'action',
                  key: 'export-import',
                  label: '\u6570\u636E\u5BFC\u51FA',
                  actions: [
                    {
                      id: 'exportShortcutsDataJson',
                      text: '\u5BFC\u51FA JSON \u6587\u4EF6',
                    },
                  ],
                  help: '\u5BFC\u51FA\u6240\u6709\u914D\u7F6E\uFF08\u5305\u542B\u5404\u5206\u7EC4\u3001\u5BFC\u822A\u9879\u8BBE\u7F6E\uFF09',
                },
                {
                  type: 'action',
                  key: 'import-data',
                  label: '\u6570\u636E\u5BFC\u5165',
                  actions: [
                    {
                      id: 'importShortcutsDataJson',
                      text: '\u4ECE JSON \u6587\u4EF6\u5BFC\u5165',
                    },
                    {
                      id: 'importShortcutsDataUrl',
                      text: '\u4ECE URL \u5BFC\u5165',
                    },
                    {
                      id: 'importShortcutsDataText',
                      text: '\u7C98\u8D34\u6587\u672C\u5BFC\u5165',
                    },
                  ],
                  renderHelp(el) {
                    el.append(
                      '\u5BFC\u5165\u4E4B\u524D\u5BFC\u51FA\u7684\u6587\u4EF6\u3002'
                    )
                    el.append(document.createElement('br'))
                    const span = document.createElement('span')
                    span.textContent = '\u4ECE '
                    const a = document.createElement('a')
                    a.href = 'https://github.com/utags/utags-shared-shortcuts'
                    a.target = '_blank'
                    a.rel = 'noopener noreferrer'
                    a.textContent = 'utags-shared-shortcuts'
                    span.append(a, ' \u53D1\u73B0\u66F4\u591A shortcuts')
                    el.append(span)
                  },
                  layout: 'vertical',
                },
                {
                  type: 'action',
                  key: 'clear-data',
                  label: '\u6E05\u7A7A\u6240\u6709\u6570\u636E',
                  actions: [
                    {
                      id: 'clearShortcutsData',
                      text: '\u6267\u884C',
                      kind: 'danger',
                    },
                  ],
                },
              ],
            },
            {
              id: 'data-settings',
              title: '\u8BBE\u7F6E',
              fields: [
                {
                  type: 'action',
                  key: 'export-import',
                  label: '\u6570\u636E\u5BFC\u51FA',
                  actions: [
                    {
                      id: 'exportSettingsJson',
                      text: '\u5BFC\u51FA JSON \u6587\u4EF6',
                    },
                  ],
                  help: '\u5BFC\u51FA\u6240\u6709\u8BBE\u7F6E',
                },
                {
                  type: 'action',
                  key: 'export-import',
                  label: '\u6570\u636E\u5BFC\u5165',
                  actions: [
                    {
                      id: 'importSettingsJson',
                      text: '\u4ECE JSON \u6587\u4EF6\u5BFC\u5165',
                    },
                  ],
                  help: '\u5BFC\u5165\u4E4B\u524D\u5BFC\u51FA\u7684\u6587\u4EF6',
                },
              ],
            },
          ],
        },
      ],
    }
    openSettingsPanel(schema, store2, {
      hostDatasetKey: 'ushortcutsHost',
      hostDatasetValue: 'ushortcuts-settings',
      theme: {
        activeBg: '#111827',
        activeFg: '#ffffff',
        colorRing: '#111827',
        toggleOnBg: '#111827',
      },
      onAction({ actionId }) {
        const handleImportSuccess = async (data) => {
          const root = getShadowRoot()
          const mode = await new Promise((resolve) => {
            const { body, actions, close } = createModalFrame({
              title: '\u9009\u62E9\u5408\u5E76\u6A21\u5F0F',
              root,
              onClose() {
                resolve(void 0)
              },
            })
            closeSettingsPanel()
            const container = document.createElement('div')
            container.className = 'merge-options'
            const btnOverwrite = document.createElement('div')
            btnOverwrite.className = 'merge-option'
            const iconOverwrite = document.createElement('div')
            iconOverwrite.className = 'merge-icon'
            setIcon(iconOverwrite, 'lucide:file-warning')
            const contentOverwrite = document.createElement('div')
            contentOverwrite.className = 'merge-content'
            const titleOverwrite = document.createElement('strong')
            titleOverwrite.textContent = '\u8986\u76D6\u6A21\u5F0F'
            const descOverwrite = document.createElement('span')
            descOverwrite.textContent =
              '\u4FDD\u7559\u6240\u6709\u5206\u7EC4\u3002\u82E5\u5206\u7EC4 ID \u76F8\u540C\uFF0C\u4F7F\u7528\u5BFC\u5165\u6587\u4EF6\u4E2D\u7684\u5BFC\u822A\u9879\u5217\u8868\uFF08\u5B8C\u5168\u66FF\u6362\uFF09\u3002'
            contentOverwrite.append(titleOverwrite, descOverwrite)
            btnOverwrite.append(iconOverwrite, contentOverwrite)
            btnOverwrite.addEventListener('click', () => {
              resolve('overwrite')
              close()
            })
            const btnMerge = document.createElement('div')
            btnMerge.className = 'merge-option'
            const iconMerge = document.createElement('div')
            iconMerge.className = 'merge-icon'
            setIcon(iconMerge, 'lucide:git-merge')
            const contentMerge = document.createElement('div')
            contentMerge.className = 'merge-content'
            const titleMerge = document.createElement('strong')
            titleMerge.textContent = '\u5408\u5E76\u6A21\u5F0F'
            const descMerge = document.createElement('span')
            descMerge.textContent =
              '\u4FDD\u7559\u6240\u6709\u5206\u7EC4\u3002\u82E5\u5206\u7EC4 ID \u76F8\u540C\uFF0C\u5408\u5E76\u5BFC\u822A\u9879\uFF08\u82E5 ID \u76F8\u540C\u5219\u4F7F\u7528\u5BFC\u5165\u7684\u6570\u636E\uFF09\u3002'
            contentMerge.append(titleMerge, descMerge)
            btnMerge.append(iconMerge, contentMerge)
            btnMerge.addEventListener('click', () => {
              resolve('merge')
              close()
            })
            container.append(btnMerge, btnOverwrite)
            body.append(container)
            const btnCancel = document.createElement('button')
            btnCancel.className = 'btn btn-secondary'
            btnCancel.textContent = '\u53D6\u6D88'
            btnCancel.addEventListener('click', () => {
              resolve(void 0)
              close()
            })
            actions.append(btnCancel)
          })
          if (!mode) return false
          await importAndSave(shortcutsStore, data, mode)
          return true
        }
        switch (actionId) {
          case 'importShortcutsDataUrl': {
            closeSettingsPanel()
            const root = getShadowRoot()
            const { body, actions, close } = createModalFrame({
              title: '\u4ECE URL \u5BFC\u5165',
              root,
            })
            const input = document.createElement('input')
            input.type = 'url'
            input.className = 'form-input'
            input.placeholder = 'https://example.com/shortcuts.json'
            input.style.width = '100%'
            input.style.marginBottom = '10px'
            input.style.padding = '8px'
            input.style.border = '1px solid #ccc'
            input.style.borderRadius = '4px'
            setTimeout(() => {
              input.focus()
            }, 100)
            body.append(input)
            const btnImport = document.createElement('button')
            btnImport.className = 'btn btn-primary'
            btnImport.textContent = '\u5BFC\u5165'
            const btnCancel = document.createElement('button')
            btnCancel.className = 'btn btn-secondary'
            btnCancel.textContent = '\u53D6\u6D88'
            const doImport = () => {
              const url = input.value.trim()
              if (!url) return
              btnImport.disabled = true
              btnImport.textContent = '\u4E0B\u8F7D\u4E2D...'
              fetchWithGmFallback({
                method: 'GET',
                url,
                async onload(res) {
                  try {
                    const data = JSON.parse(res.responseText)
                    if (
                      data &&
                      (Array.isArray(data.groups) || Array.isArray(data.items))
                    ) {
                      close()
                      const ok = await handleImportSuccess(data)
                      if (ok) {
                        globalThis.alert('\u5BFC\u5165\u6210\u529F')
                      }
                    } else {
                      globalThis.alert(
                        '\u65E0\u6548\u7684\u5BFC\u822A\u6570\u636E\u6587\u4EF6\uFF08\u7F3A\u5C11 groups \u6216 items \u5B57\u6BB5\uFF09'
                      )
                      btnImport.disabled = false
                      btnImport.textContent = '\u5BFC\u5165'
                    }
                  } catch (e) {
                    globalThis.alert('JSON \u89E3\u6790\u5931\u8D25')
                    btnImport.disabled = false
                    btnImport.textContent = '\u5BFC\u5165'
                  }
                },
                onerror() {
                  globalThis.alert('\u8BF7\u6C42\u5931\u8D25')
                  btnImport.disabled = false
                  btnImport.textContent = '\u5BFC\u5165'
                },
              })
            }
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') doImport()
            })
            btnImport.addEventListener('click', doImport)
            btnCancel.addEventListener('click', close)
            actions.append(btnImport, btnCancel)
            break
          }
          case 'importShortcutsDataText': {
            closeSettingsPanel()
            const root = getShadowRoot()
            const { body, actions, close } = createModalFrame({
              title: '\u7C98\u8D34\u6587\u672C\u5BFC\u5165',
              root,
            })
            const textarea = document.createElement('textarea')
            textarea.className = 'form-textarea'
            textarea.placeholder =
              '\u8BF7\u5728\u6B64\u7C98\u8D34 JSON \u5185\u5BB9...'
            textarea.style.width = '100%'
            textarea.style.height = '200px'
            textarea.style.marginBottom = '10px'
            textarea.style.padding = '8px'
            textarea.style.border = '1px solid #ccc'
            textarea.style.borderRadius = '4px'
            setTimeout(() => {
              textarea.focus()
            }, 100)
            body.append(textarea)
            const btnImport = document.createElement('button')
            btnImport.className = 'btn btn-primary'
            btnImport.textContent = '\u5BFC\u5165'
            const btnCancel = document.createElement('button')
            btnCancel.className = 'btn btn-secondary'
            btnCancel.textContent = '\u53D6\u6D88'
            const doImport = async () => {
              const text = textarea.value.trim()
              if (!text) return
              try {
                const data = JSON.parse(text)
                if (
                  data &&
                  (Array.isArray(data.groups) || Array.isArray(data.items))
                ) {
                  close()
                  const ok = await handleImportSuccess(data)
                  if (ok) {
                    globalThis.alert('\u5BFC\u5165\u6210\u529F')
                  }
                } else {
                  globalThis.alert(
                    '\u65E0\u6548\u7684\u5BFC\u822A\u6570\u636E\u6587\u4EF6\uFF08\u7F3A\u5C11 groups \u6216 items \u5B57\u6BB5\uFF09'
                  )
                }
              } catch (e) {
                globalThis.alert('JSON \u89E3\u6790\u5931\u8D25')
              }
            }
            btnImport.addEventListener('click', doImport)
            btnCancel.addEventListener('click', close)
            actions.append(btnImport, btnCancel)
            break
          }
          case 'openGroupManager': {
            ;(async () => {
              try {
                const root = getShadowRoot()
                let raw = {}
                try {
                  raw = await shortcutsStore.load()
                } catch (e) {}
                if (!Array.isArray(raw.groups) || raw.groups.length === 0) {
                  const g = {
                    id: uid(),
                    name: '\u9ED8\u8BA4\u7EC4',
                    icon: 'lucide:folder',
                    match: ['*'],
                    defaultOpen: void 0,
                    items: [
                      {
                        id: uid(),
                        name: '\u9996\u9875',
                        icon: 'lucide:home',
                        type: 'url',
                        data: '/',
                        openIn: void 0,
                        hidden: false,
                      },
                    ],
                    collapsed: false,
                    itemsPerRow: 1,
                    hidden: false,
                  }
                  raw.groups = [g]
                }
                openEditorModal(root, raw, {
                  async saveConfig(cfg) {
                    try {
                      await shortcutsStore.save(cfg)
                    } catch (e) {}
                  },
                  rerender() {},
                  updateThemeUI() {},
                  edgeDefaults: {
                    width: 3,
                    height: 60,
                    opacity: 0.6,
                    colorLight: '#1A73E8',
                    colorDark: '#8AB4F8',
                  },
                  tempOpenGetter() {
                    return false
                  },
                })
                try {
                  const modal = root.querySelector('.modal.editor')
                  const segs = Array.from(
                    modal.querySelectorAll('.segmented .seg-item')
                  )
                  for (const seg of segs) {
                    const textEl = seg.querySelector('.seg-text')
                    const inputEl = seg.querySelector('.seg-radio')
                    if (
                      textEl &&
                      textEl.textContent === '\u5206\u7EC4' &&
                      inputEl instanceof HTMLInputElement
                    ) {
                      inputEl.click()
                      break
                    }
                  }
                  closeSettingsPanel()
                } catch (e) {}
              } catch (e) {}
            })()
            break
          }
          case 'exportShortcutsDataJson': {
            ;(async () => {
              try {
                let raw = {}
                try {
                  raw = await shortcutsStore.load()
                } catch (e) {}
                const date = /* @__PURE__ */ new Date()
                const timestamp = ''
                  .concat(date.getFullYear())
                  .concat(String(date.getMonth() + 1).padStart(2, '0'))
                  .concat(String(date.getDate()).padStart(2, '0'), '_')
                  .concat(String(date.getHours()).padStart(2, '0'))
                  .concat(String(date.getMinutes()).padStart(2, '0'))
                  .concat(String(date.getSeconds()).padStart(2, '0'))
                const blob = new Blob([JSON.stringify(raw, null, 2)], {
                  type: 'application/json',
                })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'utags-shortcuts-data-'.concat(timestamp, '.json')
                a.click()
                setTimeout(() => {
                  URL.revokeObjectURL(url)
                }, 1e3)
              } catch (e) {}
            })()
            break
          }
          case 'exportSettingsJson': {
            ;(async () => {
              try {
                const raw = await getValue(SETTINGS_KEY, {})
                const date = /* @__PURE__ */ new Date()
                const timestamp = ''
                  .concat(date.getFullYear())
                  .concat(String(date.getMonth() + 1).padStart(2, '0'))
                  .concat(String(date.getDate()).padStart(2, '0'), '_')
                  .concat(String(date.getHours()).padStart(2, '0'))
                  .concat(String(date.getMinutes()).padStart(2, '0'))
                  .concat(String(date.getSeconds()).padStart(2, '0'))
                const blob = new Blob([JSON.stringify(raw, null, 2)], {
                  type: 'application/json',
                })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'utags-shortcuts-settings-'.concat(
                  timestamp,
                  '.json'
                )
                a.click()
                setTimeout(() => {
                  URL.revokeObjectURL(url)
                }, 1e3)
              } catch (e) {}
            })()
            break
          }
          case 'importShortcutsDataJson': {
            importJson({
              validate: (data) =>
                data &&
                (Array.isArray(data.groups) || Array.isArray(data.items)),
              errorMessage:
                '\u65E0\u6548\u7684\u5BFC\u822A\u6570\u636E\u6587\u4EF6\uFF08\u7F3A\u5C11 groups \u6216 items \u5B57\u6BB5\uFF09',
              confirmMessage: '',
              async onSuccess(data) {
                await handleImportSuccess(data)
              },
            })
            break
          }
          case 'importSettingsJson': {
            importJson({
              validate: (data) =>
                data && typeof data === 'object' && !Array.isArray(data),
              errorMessage:
                '\u65E0\u6548\u7684\u8BBE\u7F6E\u6587\u4EF6\uFF08\u683C\u5F0F\u5E94\u4E3A\u5BF9\u8C61\uFF09',
              async onSuccess(obj) {
                const existing = await getValue(SETTINGS_KEY, {})
                const merged = __spreadValues(__spreadValues({}, existing), obj)
                await setValue(SETTINGS_KEY, merged)
              },
            })
            break
          }
          case 'clearShortcutsData': {
            const ok = globalThis.confirm(
              '\u662F\u5426\u771F\u7684\u8981\u6E05\u7A7A\u6570\u636E\uFF1F\u4E0D\u53EF\u9006\uFF0C\u5EFA\u8BAE\u5148\u5BFC\u51FA\u5907\u4EFD\u3002'
            )
            if (!ok) break
            ;(async () => {
              try {
                await shortcutsStore.save({ groups: [] })
              } catch (e) {}
            })()
            break
          }
          case 'resetGlobal': {
            const ok = globalThis.confirm(
              '\u786E\u8BA4\u8981\u91CD\u7F6E\u5168\u5C40\u8BBE\u7F6E\u5417\uFF1F\uFF08\u4E0D\u5F71\u54CD\u5F53\u524D\u7F51\u7AD9\u8BBE\u7F6E\uFF09'
            )
            if (!ok) break
            ;(async () => {
              try {
                await store2.reset(true)
              } catch (e) {}
            })()
            break
          }
          case 'resetSite': {
            const ok = globalThis.confirm(
              '\u786E\u8BA4\u8981\u91CD\u7F6E\u5F53\u524D\u7F51\u7AD9\u8BBE\u7F6E\u5417\uFF1F'
            )
            if (!ok) break
            ;(async () => {
              try {
                await store2.reset(false)
              } catch (e) {}
            })()
            break
          }
          case 'edgeReset': {
            ;(async () => {
              try {
                await store2.set({
                  position: DEFAULTS.position,
                  edgeWidth: DEFAULTS.edgeWidth,
                  edgeHeight: DEFAULTS.edgeHeight,
                  edgeOpacity: DEFAULTS.edgeOpacity,
                  edgeColorLight: DEFAULTS.edgeColorLight,
                  edgeColorDark: DEFAULTS.edgeColorDark,
                  edgeHidden: DEFAULTS.edgeHidden,
                })
              } catch (e) {}
            })()
            break
          }
          default: {
            break
          }
        }
      },
    })
  }
  var DISABLE_IFRAME_KEY = 'utags_iframe_mode_disabled'
  var CHECK_IFRAME_KEY = 'utags_iframe_mode_checking'
  var RELOAD_COUNT_KEY = 'utags_iframe_reload_count'
  var LAST_LOAD_TIME_KEY = 'utags_iframe_last_load_time'
  var LAST_LOAD_URL_KEY = 'utags_iframe_last_load_url'
  var LAST_CLICK_URL_KEY = 'utags_iframe_last_click_url'
  var SUPPORTED_KEY = 'utags_iframe_supported'
  var isSupported = () => sessionStorage.getItem(SUPPORTED_KEY) === '1'
  function clearDetectionStorage() {
    sessionStorage.removeItem(RELOAD_COUNT_KEY)
    sessionStorage.removeItem(LAST_LOAD_URL_KEY)
    sessionStorage.removeItem(LAST_LOAD_TIME_KEY)
    sessionStorage.removeItem(LAST_CLICK_URL_KEY)
  }
  var BLACKLIST_DOMAINS = /* @__PURE__ */ new Set([
    'mail.google.com',
    'accounts.google.com',
    'gds.google.com',
    'gemini.google.com',
    'github.com',
    'developer.mozilla.org',
    'addons.mozilla.org',
    'www.threads.com',
    'x.com',
    'pro.x.com',
    'www.facebook.com',
    'www.instagram.com',
    'stackoverflow.com',
    'superuser.com',
    't.me',
  ])
  var BLACKLIST_URL_PATTERNS = /* @__PURE__ */ new Set([
    /^https:\/\/www\.google\.com\/search\?.*[&?]udm=50/,
    /^https:\/\/www\.google\.com\/search\?((?![?&]udm=).)*$/,
    /^https:\/\/(.+\.)?stackexchange\.com\//,
    /^https:\/\/(login|auth)[^.]*\./,
    /(login|auth|signin|signup)/i,
    /.+\.user\.js([?#].*)?$/,
  ])
  var progressBar2
  function isIframeModeDisabledUrl(url) {
    return Array.from(BLACKLIST_URL_PATTERNS).some((p) => p.test(url))
  }
  function isIframeModeDisabled() {
    if (BLACKLIST_DOMAINS.has(location.host)) {
      return true
    }
    if (isIframeModeDisabledUrl(location.href)) {
      return true
    }
    if (scriptHandler === 'tamp' || scriptHandler.includes('stay')) {
      return true
    }
    return (
      Boolean(localStorage.getItem(DISABLE_IFRAME_KEY)) ||
      Boolean(localStorage.getItem(CHECK_IFRAME_KEY))
    )
  }
  async function checkAndEnableIframeMode() {
    if (!isTopFrame() || document.documentElement.tagName !== 'HTML') return
    if (isIframeModeDisabled()) return
    const settings2 = await createUshortcutsSettingsStore().getAll()
    if (
      !settings2.enabled ||
      settings2.layoutMode !== 'sidebar' ||
      !settings2.sidebarUseIframe
    )
      return
    enableIframeMode(settings2.sidebarSide || 'right')
  }
  function enableIframeMode(side) {
    const currentUrl = location.href
    document.documentElement.replaceChildren()
    const newHead = document.createElement('head')
    document.documentElement.append(newHead)
    const newBody = document.createElement('body')
    document.documentElement.append(newBody)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLElement &&
            node.tagName === 'BODY' &&
            node !== newBody
          ) {
            node.remove()
          }
        }
      }
    })
    observer.observe(document.documentElement, { childList: true })
    document.documentElement.style.cssText =
      'height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden;'
    newBody.style.cssText =
      'height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden;'
    progressBar2 = new ProgressBar()
    const iframe = document.createElement('iframe')
    iframe.src = currentUrl
    iframe.style.cssText =
      '\n    border: none;\n    width: calc(100% - 360px);\n    height: 100%;\n    position: absolute;\n    top: 0;\n    '.concat(
        side === 'left' ? 'right: 0;' : 'left: 0;',
        '\n  '
      )
    iframe.name = 'utags-shortcuts-iframe'
    newBody.append(iframe)
    let isChildReady = false
    let failTimer
    iframe.addEventListener('load', () => {
      iframe.focus()
      progressBar2 == null ? void 0 : progressBar2.finish()
      try {
        if (!isChildReady) {
          failTimer = setTimeout(() => {
            if (!isChildReady) {
              console.warn(
                '[utags] Iframe mode script failed to start. Disabling for this site.'
              )
              localStorage.setItem(DISABLE_IFRAME_KEY, '1')
              localStorage.setItem(CHECK_IFRAME_KEY, '3')
              location.reload()
            }
          }, 5e3)
        }
        const win2 = iframe.contentWindow
        if (!win2) return
        syncState(win2.location.href, win2.document.title)
        syncFavicon(win2.document)
      } catch (error) {
        console.error('Failed to access iframe content', error)
        if (!isChildReady) {
          localStorage.setItem(DISABLE_IFRAME_KEY, '1')
          localStorage.setItem(CHECK_IFRAME_KEY, '2')
          location.reload()
        }
      }
    })
    globalThis.addEventListener('message', (e) => {
      if (e.source !== iframe.contentWindow) return
      const data = e.data
      if (!data || !data.type) return
      switch (data.type) {
        case 'USHORTCUTS_IFRAME_READY': {
          isChildReady = true
          setTimeout(() => {
            localStorage.removeItem(CHECK_IFRAME_KEY)
          }, 1e4)
          if (failTimer) clearTimeout(failTimer)
          break
        }
        case 'USHORTCUTS_IFRAME_FAILED': {
          console.warn('[utags] Iframe mode failed:', data.reason)
          localStorage.setItem(DISABLE_IFRAME_KEY, '1')
          localStorage.setItem(CHECK_IFRAME_KEY, '4')
          location.reload()
          break
        }
        case 'USHORTCUTS_URL_CHANGE': {
          syncState(data.url, data.title)
          progressBar2 == null ? void 0 : progressBar2.finish()
          break
        }
        case 'USHORTCUTS_LOADING_START': {
          progressBar2 == null ? void 0 : progressBar2.start()
          break
        }
        case 'USHORTCUTS_FORWARD_KEYDOWN': {
          const evt = data.event
          const event = new KeyboardEvent('keydown', {
            code: evt.code,
            key: evt.key || evt.code,
            ctrlKey: evt.ctrlKey,
            metaKey: evt.metaKey,
            altKey: evt.altKey,
            shiftKey: evt.shiftKey,
            bubbles: true,
            cancelable: true,
            composed: true,
          })
          document.dispatchEvent(event)
          break
        }
        default: {
          break
        }
      }
    })
  }
  function updateIframeLayout(sidebarVisible) {
    const iframe = document.querySelector(
      'iframe[name="utags-shortcuts-iframe"]'
    )
    if (!iframe) return
    iframe.style.width = sidebarVisible ? 'calc(100% - 360px)' : '100%'
  }
  function redirectToTop(url) {
    try {
      globalThis.top.location.href = url
      return true
    } catch (e) {}
    return false
  }
  function updateIframeUrl(url) {
    const iframe = document.querySelector(
      'iframe[name="utags-shortcuts-iframe"]'
    )
    if (isIframeModeDisabledUrl(url)) {
      redirectToTop(url)
      return true
    }
    if (iframe && iframe.contentWindow) {
      progressBar2 == null ? void 0 : progressBar2.start()
      iframe.contentWindow.postMessage(
        { type: 'USHORTCUTS_NAVIGATE', url },
        '*'
      )
      iframe.focus()
      return true
    }
    return false
  }
  function syncState(url, title) {
    if (location.href !== url) {
      try {
        history.replaceState(null, '', url)
      } catch (e) {
        location.href = url
      }
    }
    if (title && document.title !== title) {
      document.title = title
    }
  }
  function syncFavicon(doc2) {
    const links = doc2.querySelectorAll("link[rel*='icon']")
    for (const link of links) {
      const newLink = link.cloneNode()
      document.head.append(newLink)
    }
  }
  function initIframeChild() {
    if (globalThis.name !== 'utags-shortcuts-iframe') return
    let initialOrigin = 'http://unkownorigin.unknown'
    const initialLoadUrl = sessionStorage.getItem(LAST_LOAD_URL_KEY)
    if (!detectInfiniteReload()) return
    globalThis.parent.postMessage({ type: 'USHORTCUTS_IFRAME_READY' }, '*')
    verifyIframeSupport(initialLoadUrl != null ? initialLoadUrl : void 0)
    const notify = () => {
      verifyIframeSupport()
      const url = location.href
      if (
        isSameOrigin(url, initialOrigin) &&
        isIframeModeDisabledUrl(url) &&
        !redirectToTop(url)
      )
        return
      globalThis.parent.postMessage(
        {
          type: 'USHORTCUTS_URL_CHANGE',
          url,
          title: document.title,
        },
        '*'
      )
    }
    try {
      if (globalThis.top.location.origin !== location.origin) {
        notify()
        return
      }
    } catch (e) {
      notify()
      return
    }
    initialOrigin = location.origin
    watchTitleChange(() => {
      notify()
    })
    const originalPushState = history.pushState
    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      notify()
    }
    const originalReplaceState = history.replaceState
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      notify()
    }
    globalThis.addEventListener('popstate', notify)
    globalThis.addEventListener('hashchange', notify)
    globalThis.addEventListener('beforeunload', () => {
      globalThis.parent.postMessage({ type: 'USHORTCUTS_LOADING_START' }, '*')
    })
    document.addEventListener(
      'click',
      (e) => {
        const target = e.target.closest('a')
        if (!target) return
        const hrefAttr = target.getAttribute('href')
        if (!hrefAttr || hrefAttr.startsWith('#')) return
        const href = target.href
        if (isSameOrigin(href)) {
          if (!isSupported()) {
            sessionStorage.setItem(LAST_CLICK_URL_KEY, href)
          }
          if (shouldOpenInCurrentTab(e, target)) {
            if (isIframeModeDisabledUrl(href)) {
              e.preventDefault()
              redirectToTop(href)
            } else {
              globalThis.parent.postMessage(
                { type: 'USHORTCUTS_LOADING_START' },
                '*'
              )
            }
          }
        } else {
          if (!shouldOpenInCurrentTab(e, target)) return
          e.preventDefault()
          redirectToTop(href)
        }
      },
      false
    )
    if (globalThis.navigation) {
      globalThis.navigation.addEventListener('navigate', (e) => {
        if (e.hashChange || e.downloadRequest) return
        const url = e.destination.url
        if (!url) return
        if (!isSameOrigin(url)) {
          e.preventDefault()
          redirectToTop(url)
        } else if (isIframeModeDisabledUrl(url)) {
          e.preventDefault()
          redirectToTop(url)
        }
      })
    }
    document.addEventListener('keydown', (e) => {
      if (e.defaultPrevented) return
      if (isEditableTarget(e.target || void 0)) return
      globalThis.parent.postMessage(
        {
          type: 'USHORTCUTS_FORWARD_KEYDOWN',
          event: {
            code: e.code,
            key: e.key,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            altKey: e.altKey,
            shiftKey: e.shiftKey,
          },
        },
        '*'
      )
    })
    globalThis.addEventListener('message', (e) => {
      if (e.source !== globalThis.parent) return
      const data = e.data
      if (!data || !data.type) return
      if (data.type === 'USHORTCUTS_NAVIGATE') {
        navigateUrl(data.url)
      }
    })
  }
  function detectInfiniteReload() {
    try {
      if (isSupported()) return true
      const now = Date.now()
      const lastLoadTime = Number.parseInt(
        sessionStorage.getItem(LAST_LOAD_TIME_KEY) || '0',
        10
      )
      const lastLoadUrl = sessionStorage.getItem(LAST_LOAD_URL_KEY)
      let reloadCount = Number.parseInt(
        sessionStorage.getItem(RELOAD_COUNT_KEY) || '0',
        10
      )
      if (
        now - lastLoadTime < 5e3 &&
        (!lastLoadUrl || lastLoadUrl === location.href)
      ) {
        reloadCount++
      } else {
        reloadCount = 1
      }
      sessionStorage.setItem(LAST_LOAD_TIME_KEY, now.toString())
      sessionStorage.setItem(LAST_LOAD_URL_KEY, location.href)
      sessionStorage.setItem(RELOAD_COUNT_KEY, reloadCount.toString())
      if (reloadCount > 5) {
        clearDetectionStorage()
        globalThis.parent.postMessage(
          { type: 'USHORTCUTS_IFRAME_FAILED', reason: 'infinite_reload' },
          '*'
        )
        return false
      }
      return true
    } catch (e) {
      return true
    }
  }
  function verifyIframeSupport(previousUrl) {
    try {
      if (isSupported()) return
      const lastLoadUrl =
        previousUrl === void 0
          ? sessionStorage.getItem(LAST_LOAD_URL_KEY)
          : previousUrl
      const lastClickUrl = sessionStorage.getItem(LAST_CLICK_URL_KEY)
      if (
        lastLoadUrl &&
        lastLoadUrl !== location.href &&
        lastClickUrl === location.href
      ) {
        sessionStorage.setItem(SUPPORTED_KEY, '1')
        clearDetectionStorage()
      }
    } catch (e) {}
  }
  function getVariableValue(key, variables) {
    for (const list of variables) {
      if (list) {
        const v = list.find((v2) => v2.key === key)
        if (v) return v.value
      }
    }
    return void 0
  }
  function createVariableResolver(variables) {
    return (key) => {
      if (key.startsWith('v:')) {
        return getVariableValue(key.slice(2), variables)
      }
      return void 0
    }
  }
  var EDGE_DEFAULT_WIDTH = 3
  var EDGE_DEFAULT_HEIGHT = 60
  var EDGE_DEFAULT_OPACITY = 0.6
  var EDGE_DEFAULT_COLOR_LIGHT = '#1A73E8'
  var EDGE_DEFAULT_COLOR_DARK = '#8AB4F8'
  var THEME_DEFAULT = 'system'
  var HOTKEY_DEFAULT = 'Alt+Shift+K'
  var LAYOUT_DEFAULT = 'floating'
  var SIDEBAR_SIDE_DEFAULT = 'right'
  async function ensureGlobalStyles() {
    try {
      const existed = document.querySelector(
        'style[data-ushortcuts-style="sidebar"]'
      )
      if (existed) return
      const styleContent =
        '\nhtml[data-utags-shortcuts-sidebar="left-open"] body { width: calc(100% - 360px) !important; margin-left: 360px !important; margin-right: 0 !important; }\nhtml[data-utags-shortcuts-sidebar="right-open"] body { width: calc(100% - 360px) !important; margin-right: 360px !important; margin-left: 0 !important; }\n'
      const style = await addStyle(styleContent)
      style.dataset.ushortcutsStyle = 'sidebar'
    } catch (e) {}
  }
  void checkAndEnableIframeMode()
  initIframeChild()
  initDiscourseSidebar()
  var store = createUshortcutsSettingsStore()
  var settings = {}
  var isIframeMode = false
  var tempOpen = false
  var tempClosed = false
  var menuIds = []
  var showAllGroups = false
  var showHiddenGroups = false
  var showHiddenItems = false
  var editingGroups = /* @__PURE__ */ new Set()
  var selectedItemsByGroup = /* @__PURE__ */ new Map()
  var draggingItem
  var lastDragTarget
  var lastDragPos
  var hasSelectedVarInCurrentGroups = false
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
        .replaceAll(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replaceAll('*', '.*')
      const re = new RegExp('^' + esc + '$')
      return re.test(url)
    } catch (e) {
      return false
    }
  }
  function openItem(it, group, cfg, opts) {
    const mode = it.openIn || group.defaultOpen || settings.defaultOpen
    const resolver = createVariableResolver([
      group.variables,
      settings.siteVariables,
      settings.variables,
    ])
    const navigate = (url) => {
      if (isIframeMode) {
        try {
          if (isSameOrigin(url) && updateIframeUrl(url)) {
            return
          }
        } catch (e) {}
        location.assign(url)
      } else {
        navigateUrl(url)
      }
    }
    if (it.type === 'url') {
      const url = resolveTargetUrl(it.data, resolver)
      const finalMode = (opts == null ? void 0 : opts.forceNewTab)
        ? 'new-tab'
        : mode
      if (finalMode === 'new-tab') {
        window.open(url, '_blank', 'noopener')
      } else {
        navigate(url)
      }
      return
    }
    try {
      const onMsg = (ev) => {
        const d = (ev && ev.data) || null
        if (
          d &&
          typeof d.__ushortcuts_err__ === 'string' &&
          d.__ushortcuts_err__
        ) {
          try {
            if (typeof globalThis.alert === 'function') {
              globalThis.alert(
                '\u811A\u672C\u6267\u884C\u51FA\u9519\uFF1A' +
                  String(d.__ushortcuts_err__)
              )
            } else {
              console.error(
                '\u811A\u672C\u6267\u884C\u51FA\u9519\uFF1A' +
                  String(d.__ushortcuts_err__)
              )
            }
          } catch (e) {}
          return
        }
        const raw =
          d && typeof d.__ushortcuts_url__ === 'string'
            ? d.__ushortcuts_url__
            : ''
        if (!raw) return
        try {
          const url = resolveTargetUrl(raw)
          const overrideMode =
            d && typeof d.__ushortcuts_mode__ === 'string'
              ? d.__ushortcuts_mode__
              : void 0
          const finalMode = (opts == null ? void 0 : opts.forceNewTab)
            ? 'new-tab'
            : overrideMode || mode
          if (finalMode === 'new-tab') window.open(url, '_blank', 'noopener')
          else navigate(url)
        } catch (e) {}
      }
      window.addEventListener('message', onMsg, { once: true })
      const s = document.createElement('script')
      const codeSrc = JSON.stringify(String(it.data || ''))
      s.textContent = '(async function(){try{var __code='.concat(
        codeSrc,
        ";var __fn=new Function(__code);var __ret=__fn();if(__ret&&typeof __ret.then==='function'){__ret=await __ret;}var __url='';var __mode='';if(typeof __ret==='string'&&__ret.trim()){__url=__ret.trim();}else if(__ret&&typeof __ret==='object'){try{if(typeof __ret.error==='string'&&__ret.error){window.postMessage({__ushortcuts_err__:__ret.error},'*');return;}var __x=__ret.url||(__ret.href?String(__ret):'');if(typeof __x==='string'&&__x.trim()){__url=__x.trim();}var __m=__ret.mode; if(__m==='same-tab'||__m==='new-tab'){__mode=__m;} }catch{}}if(__url){window.postMessage({__ushortcuts_url__:__url,__ushortcuts_mode__:__mode},'*');}}catch(e){try{window.postMessage({__ushortcuts_err__:String(e&&(e.message||e))},'*');}catch{}}})()"
      )
      ;(document.documentElement || document.body).append(s)
      s.remove()
    } catch (e) {}
  }
  async function loadConfig() {
    return shortcutsStore.load()
  }
  async function saveConfig(cfg) {
    return shortcutsStore.save(cfg)
  }
  function createRoot() {
    if (!isTopFrame()) {
      const host2 = document.createElement('div')
      host2.style.display = 'none'
      const root2 = host2.attachShadow({ mode: 'open' })
      return { host: host2, root: root2 }
    }
    const { host, root } = ensureShadowRoot({
      hostId: 'utags-shortcuts',
      hostDatasetKey: 'ushortcutsHost',
      style: style_default,
    })
    return { host, root }
  }
  function place(el, cfg) {
    el.style.position = 'fixed'
    el.style.inset = 'auto'
    if (settings.layoutMode === 'sidebar') {
      el.style.top = '0'
      el.style.bottom = '0'
      el.style.left = 'auto'
      el.style.right = 'auto'
      el.style.transform = ''
      if ((settings.sidebarSide || SIDEBAR_SIDE_DEFAULT) === 'left') {
        el.style.left = '0'
      } else {
        el.style.right = '0'
      }
      return
    }
    const p = settings.position
    switch (p) {
      case 'left-top': {
        el.style.top = '0'
        el.style.left = '0'
        break
      }
      case 'left-center': {
        el.style.top = '50%'
        el.style.left = '0'
        el.style.transform = 'translateY(-50%)'
        break
      }
      case 'left-bottom': {
        el.style.bottom = '0'
        el.style.left = '0'
        break
      }
      case 'right-center': {
        el.style.top = '50%'
        el.style.right = '0'
        el.style.transform = 'translateY(-50%)'
        break
      }
      case 'right-bottom': {
        el.style.bottom = '0'
        el.style.right = '0'
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
      default: {
        el.style.top = '0'
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
    if (showAllGroups) {
      return cfg.groups.filter((g) => showHiddenGroups || !g.hidden)
    }
    const url = location.href
    return cfg.groups
      .map((g) => ({ g, s: groupScore(url, g) }))
      .filter((x) => x.s >= 0 && !x.g.hidden)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.g)
  }
  function preserveScroll(panel, cb) {
    const scroller = panel.querySelector('.panel-scroll') || panel
    const sx = scroller.scrollLeft
    const sy = scroller.scrollTop
    cb()
    const apply = () => {
      try {
        scroller.scrollLeft = sx
        scroller.scrollTop = sy
      } catch (e) {}
    }
    apply()
    try {
      requestAnimationFrame(apply)
    } catch (e) {}
  }
  function isDarkTheme(cfg) {
    const t = settings.theme || THEME_DEFAULT
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
  function parseHotkeySpec(spec) {
    const s = String(spec || '').trim()
    if (!s) return null
    const parts = s.split('+').map((x) => x.trim().toLowerCase())
    let key = ''
    const need = { ctrl: false, meta: false, alt: false, shift: false }
    for (const p of parts) {
      switch (p) {
        case 'ctrl':
        case 'control': {
          need.ctrl = true
          break
        }
        case 'meta':
        case 'cmd':
        case 'command': {
          need.meta = true
          break
        }
        case 'alt':
        case 'option': {
          need.alt = true
          break
        }
        case 'shift': {
          need.shift = true
          break
        }
        default: {
          key = p
          break
        }
      }
    }
    if (!key) return null
    let code = ''
    if (key.length === 1) code = 'Key' + key.toUpperCase()
    else if (key === 'space') code = 'Space'
    else code = key
    return {
      ctrl: need.ctrl,
      meta: need.meta,
      alt: need.alt,
      shift: need.shift,
      code,
    }
  }
  function registerHotkeys(root, cfg) {
    const check = (e) => {
      const spec = settings.hotkey || HOTKEY_DEFAULT
      const p = parseHotkeySpec(spec)
      if (!p) return
      if (!(p.ctrl || p.meta || p.alt)) return
      const hasCtrl = Boolean(e.ctrlKey)
      const hasMeta = Boolean(e.metaKey)
      const hasAlt = Boolean(e.altKey)
      const hasShift = Boolean(e.shiftKey)
      if (p.ctrl !== hasCtrl) return
      if (p.meta !== hasMeta) return
      if (p.alt !== hasAlt) return
      if (p.shift !== hasShift) return
      if (e.code !== p.code) return
      e.preventDefault()
      const visible = Boolean(root.querySelector('.ushortcuts .panel'))
      if (visible) {
        collapseWithAnim(root, cfg)
      } else {
        tempOpen = true
        rerender(root, cfg)
      }
    }
    document.addEventListener('keydown', (e) => {
      if (e.defaultPrevented) return
      if (isEditableTarget(e.target || void 0)) return
      check(e)
    })
  }
  function renderShortcutsItem(root, cfg, g, it, section, isEditing) {
    const wrap = document.createElement('div')
    wrap.className = 'item-wrap'
    wrap.dataset.itemId = it.id
    wrap.classList.add('fade-in')
    if (it.hidden) wrap.classList.add('is-hidden')
    wrap.addEventListener('dragover', (e) => {
      if (draggingItem && draggingItem.groupId === g.id) {
        e.preventDefault()
        e.stopPropagation()
        if (lastDragTarget && lastDragTarget !== wrap) {
          lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
        }
        lastDragTarget = wrap
        const itemsContainer = wrap.closest('.items')
        let isGrid =
          itemsContainer == null
            ? void 0
            : itemsContainer.classList.contains('layout-grid')
        if (
          itemsContainer == null
            ? void 0
            : itemsContainer.classList.contains('mode-icon-only')
        ) {
          const cols = itemsContainer.style.getPropertyValue('--cols')
          isGrid = cols !== '1'
        }
        const rect = wrap.getBoundingClientRect()
        const isSecondHalf = isGrid
          ? e.clientX - rect.left > rect.width / 2
          : e.clientY - rect.top > rect.height / 2
        lastDragPos = isSecondHalf ? 'after' : 'before'
        wrap.classList.toggle('drag-over-after', isSecondHalf)
        wrap.classList.toggle('drag-over-before', !isSecondHalf)
      }
    })
    wrap.addEventListener('dragleave', () => {})
    wrap.addEventListener('drop', (e) => {
      if (draggingItem && draggingItem.groupId === g.id) {
        e.preventDefault()
        e.stopPropagation()
        const isAfter = wrap.classList.contains('drag-over-after')
        if (lastDragTarget) {
          lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
          lastDragTarget = void 0
        }
        lastDragPos = void 0
        wrap.classList.remove('drag-over-before', 'drag-over-after')
        const srcIndex = g.items.findIndex((i) => i.id === draggingItem.itemId)
        let targetIndex = g.items.findIndex((i) => i.id === it.id)
        if (srcIndex !== -1 && targetIndex !== -1) {
          if (srcIndex === targetIndex) return
          if (isAfter) {
            targetIndex++
          }
          const insertIndex =
            srcIndex < targetIndex ? targetIndex - 1 : targetIndex
          if (srcIndex !== insertIndex) {
            const [movedItem] = g.items.splice(srcIndex, 1)
            g.items.splice(insertIndex, 0, movedItem)
            void saveConfig(cfg)
            rerender(root, cfg)
          }
        }
      }
    })
    const a = document.createElement('a')
    a.className = 'item'
    a.draggable = true
    a.addEventListener('dragstart', (e) => {
      var _a, _b
      draggingItem = { groupId: g.id, itemId: it.id }
      ;(_a = e.dataTransfer) == null
        ? void 0
        : _a.setData('text/plain', it.data)
      ;(_b = e.dataTransfer) == null
        ? void 0
        : _b.setData('text/uri-list', it.data)
    })
    a.addEventListener('dragend', () => {
      draggingItem = void 0
      if (lastDragTarget) {
        lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
        lastDragTarget = void 0
      }
      lastDragPos = void 0
    })
    if (isEditing) {
      a.href = '#'
      a.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
      })
    } else if (it.type === 'url') {
      const resolver = createVariableResolver([
        g.variables,
        settings.siteVariables,
        settings.variables,
      ])
      const url = resolveTargetUrl(it.data, resolver)
      a.href = url
      a.addEventListener('click', (e) => {
        e.preventDefault()
        const forceNew = Boolean(e.ctrlKey || e.metaKey)
        openItem(it, g, cfg, { forceNewTab: forceNew })
      })
      a.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
          e.preventDefault()
          openItem(it, g, cfg, { forceNewTab: true })
        }
      })
    } else {
      a.href = '#'
      a.addEventListener('click', (e) => {
        e.preventDefault()
        const forceNew = Boolean(e.ctrlKey || e.metaKey)
        openItem(it, g, cfg, { forceNewTab: forceNew })
      })
      a.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
          e.preventDefault()
          openItem(it, g, cfg, { forceNewTab: true })
        }
      })
    }
    {
      const resolver = createVariableResolver([
        g.variables,
        settings.siteVariables,
        settings.variables,
      ])
      const iconStr = resolveIcon(it.icon, it.type, it.data, {
        extraResolvers: resolver,
      })
      setIcon(a, iconStr)
    }
    if (isEditing) {
      const set = selectedItemsByGroup.get(g.id) || /* @__PURE__ */ new Set()
      selectedItemsByGroup.set(g.id, set)
      const sel = document.createElement('input')
      sel.type = 'checkbox'
      sel.checked = set.has(it.id)
      const updateDeleteBtnState = () => {
        var _a
        const btn = section.querySelector(
          '.header-actions .btn.mini:last-child'
        )
        if (btn instanceof HTMLButtonElement) {
          const count =
            ((_a = selectedItemsByGroup.get(g.id)) == null
              ? void 0
              : _a.size) || 0
          btn.disabled = !(count > 0)
        }
      }
      sel.addEventListener('change', () => {
        if (sel.checked) set.add(it.id)
        else set.delete(it.id)
        updateDeleteBtnState()
      })
      wrap.append(sel)
    }
    const t = document.createElement('span')
    t.textContent = it.name
    t.className = 'title-text'
    const style = g.displayStyle || 'icon-title'
    const isIconOnly = style === 'icon-only' && !isEditing
    if (isIconOnly) {
      a.title = it.name
    }
    a.append(t)
    wrap.append(a)
    if (isEditing) {
      const editItemBtn = document.createElement('button')
      editItemBtn.className = 'icon-btn'
      setIcon(editItemBtn, 'lucide:edit-3', '\u7F16\u8F91\u8BE5\u5BFC\u822A')
      editItemBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        openAddLinkModal(root, cfg, {
          saveConfig(c2) {
            void saveConfig(c2)
          },
          rerender(r, c2) {
            rerender(r, c2)
          },
          defaultGroupId: g.id,
          existingItem: it,
        })
      })
      const hideBtn = document.createElement('button')
      hideBtn.className = 'icon-btn'
      if (it.hidden) {
        setIcon(hideBtn, 'lucide:eye', '\u663E\u793A\u8BE5\u5BFC\u822A')
      } else {
        setIcon(hideBtn, 'lucide:eye-off', '\u9690\u85CF\u8BE5\u5BFC\u822A')
      }
      hideBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        it.hidden = !it.hidden
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      wrap.append(editItemBtn)
      wrap.append(hideBtn)
    }
    return wrap
  }
  async function handleDropOnGroup(e, g, cfg, root, section) {
    var _a, _b, _c
    e.preventDefault()
    section.classList.remove('drag-over')
    let url =
      ((_a = e.dataTransfer) == null ? void 0 : _a.getData('text/uri-list')) ||
      ((_b = e.dataTransfer) == null ? void 0 : _b.getData('text/plain'))
    if (url) {
      url = url.split('\n')[0].trim()
      try {
        url = decodeURI(url)
      } catch (e2) {}
    }
    if (
      !url ||
      (!(url.startsWith('http://') || url.startsWith('https://')) &&
        !url.startsWith('/'))
    )
      return
    if (hasDuplicateInGroup(g, 'url', url)) {
      const ok = globalThis.confirm(
        '\u8BE5\u5206\u7EC4\u5185\u5DF2\u5B58\u5728\u76F8\u540C\u7684 URL\uFF0C\u662F\u5426\u7EE7\u7EED\u6DFB\u52A0\uFF1F'
      )
      if (!ok) return
    }
    let name = ''
    const html =
      (_c = e.dataTransfer) == null ? void 0 : _c.getData('text/html')
    if (html) {
      try {
        const doc2 = new DOMParser().parseFromString(html, 'text/html')
        const a = doc2.querySelector('a')
        if (a && a.textContent) {
          name = a.textContent.trim()
        }
      } catch (e2) {}
    }
    if (!name) {
      try {
        const u = new URL(url)
        name = u.hostname
      } catch (e2) {
        name = 'New Link'
      }
    }
    const newItem = {
      id: uid(),
      name: name || 'New Link',
      type: 'url',
      data: url,
      openIn: void 0,
      icon: 'favicon',
    }
    g.items.push(newItem)
    if (g.collapsed) g.collapsed = false
    await saveConfig(cfg)
    rerender(root, cfg)
  }
  function hasSelectedVar(text) {
    return /{selected(?:\|\|.*?)?}/.test(text)
  }
  function hasSelectedVarInGroups(groups) {
    for (const g of groups) {
      const isEditing = editingGroups.has(g.id)
      for (const it of g.items) {
        if (it.hidden && !showHiddenItems && !isEditing) continue
        const val = String(it.data || '')
        if (hasSelectedVar(val)) return true
      }
    }
    return false
  }
  function renderGroupSection(root, cfg, g, body) {
    var _a
    const isEditing = editingGroups.has(g.id)
    const div = document.createElement('div')
    div.className = 'divider'
    body.append(div)
    const section = document.createElement('div')
    section.className = 'section'
    section.dataset.gid = g.id
    if (g.hidden) section.classList.add('is-hidden')
    section.addEventListener('dragover', (e) => {
      e.preventDefault()
      if (draggingItem && draggingItem.groupId === g.id) {
        if (lastDragTarget && section.contains(lastDragTarget)) {
          section.classList.remove('drag-over-append')
        } else {
          if (lastDragTarget) {
            lastDragTarget.classList.remove(
              'drag-over-before',
              'drag-over-after'
            )
            lastDragTarget = void 0
            lastDragPos = void 0
          }
          section.classList.add('drag-over-append')
        }
      } else {
        section.classList.add('drag-over')
      }
    })
    section.addEventListener('dragleave', (e) => {
      if (section.contains(e.relatedTarget)) return
      section.classList.remove('drag-over', 'drag-over-append')
      if (lastDragTarget && section.contains(lastDragTarget)) {
        lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
        lastDragTarget = void 0
        lastDragPos = void 0
      }
    })
    section.addEventListener('drop', (e) => {
      if (draggingItem && draggingItem.groupId === g.id) {
        if (lastDragTarget && section.contains(lastDragTarget)) {
          const targetId = lastDragTarget.dataset.itemId
          const targetIndex = g.items.findIndex((i) => i.id === targetId)
          const srcIndex2 = g.items.findIndex(
            (i) => i.id === draggingItem.itemId
          )
          if (srcIndex2 !== -1 && targetIndex !== -1) {
            lastDragTarget.classList.remove(
              'drag-over-before',
              'drag-over-after'
            )
            lastDragTarget = void 0
            const insertIndex =
              lastDragPos === 'after' ? targetIndex + 1 : targetIndex
            const finalIndex =
              srcIndex2 < insertIndex ? insertIndex - 1 : insertIndex
            if (srcIndex2 !== finalIndex) {
              const [movedItem] = g.items.splice(srcIndex2, 1)
              g.items.splice(finalIndex, 0, movedItem)
              void saveConfig(cfg)
              rerender(root, cfg)
            }
          }
          section.classList.remove('drag-over', 'drag-over-append')
          return
        }
        const srcIndex = g.items.findIndex((i) => i.id === draggingItem.itemId)
        if (srcIndex !== -1 && srcIndex !== g.items.length - 1) {
          const [movedItem] = g.items.splice(srcIndex, 1)
          g.items.push(movedItem)
          void saveConfig(cfg)
          rerender(root, cfg)
        }
        section.classList.remove('drag-over', 'drag-over-append')
        return
      }
      void handleDropOnGroup(e, g, cfg, root, section)
    })
    const header = document.createElement('div')
    header.className = 'header'
    const title = document.createElement('div')
    title.className = 'title'
    setIcon(title, g.icon || 'lucide:folder')
    const nameSpan = document.createElement('span')
    nameSpan.className = 'title-text'
    nameSpan.textContent = g.displayName || g.name
    title.append(nameSpan)
    header.append(title)
    title.addEventListener('click', () => {
      g.collapsed = !g.collapsed
      void saveConfig(cfg)
      const itemsDiv = section.querySelector('.items')
      if (itemsDiv) itemsDiv.style.display = g.collapsed ? 'none' : ''
      const btn = section.querySelector('.header .icon-btn.toggle')
      if (btn instanceof HTMLElement)
        setIcon(
          btn,
          g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down',
          g.collapsed ? '\u5C55\u5F00' : '\u6298\u53E0'
        )
    })
    const actions = document.createElement('div')
    actions.className = 'header-actions'
    const editMenuRightSide =
      isRightSide(settings.position) || settings.position.endsWith('-right')
    const groupMenuRightSide = editMenuRightSide
    if (isEditing) {
      const exitBtn = document.createElement('button')
      exitBtn.className = 'btn mini'
      exitBtn.textContent = '\u9000\u51FA\u7F16\u8F91'
      exitBtn.addEventListener('click', () => {
        editingGroups.delete(g.id)
        selectedItemsByGroup.delete(g.id)
        rerender(root, cfg)
      })
      const delBtn = document.createElement('button')
      delBtn.className = 'btn mini'
      delBtn.textContent = '\u5220\u9664'
      {
        const count =
          ((_a = selectedItemsByGroup.get(g.id)) == null ? void 0 : _a.size) ||
          0
        delBtn.disabled = !(count > 0)
      }
      delBtn.addEventListener('click', () => {
        const set = selectedItemsByGroup.get(g.id)
        if (!set || set.size === 0) return
        const ok = globalThis.confirm(
          '\u662F\u5426\u5220\u9664\u6240\u9009\u5BFC\u822A\u9879\uFF1F'
        )
        if (!ok) return
        const ids = new Set(Array.from(set))
        g.items = g.items.filter((x) => !ids.has(x.id))
        selectedItemsByGroup.delete(g.id)
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      actions.append(exitBtn)
      actions.append(delBtn)
    } else {
      const addLinkBtn = document.createElement('button')
      addLinkBtn.className = 'icon-btn'
      setIcon(
        addLinkBtn,
        'lucide:plus',
        '\u6DFB\u52A0\u94FE\u63A5\u5230\u6B64\u5206\u7EC4'
      )
      addLinkBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        suppressCollapse = true
        showDropdownMenu(
          root,
          addLinkBtn,
          [
            {
              icon: 'lucide:keyboard',
              label: '\u624B\u52A8\u8F93\u5165',
              onClick() {
                openAddLinkModal(root, cfg, {
                  saveConfig(c2) {
                    void saveConfig(c2)
                  },
                  rerender(r, c2) {
                    rerender(r, c2)
                  },
                  defaultGroupId: g.id,
                })
              },
            },
            {
              icon: 'lucide:globe',
              label: '\u6DFB\u52A0\u5F53\u524D\u7F51\u9875',
              onClick() {
                addCurrentPageLinkToGroup(
                  root,
                  cfg,
                  {
                    saveConfig(c2) {
                      void saveConfig(c2)
                    },
                    rerender(r, c2) {
                      rerender(r, c2)
                    },
                  },
                  g.id,
                  void 0
                )
              },
            },
            {
              icon: 'lucide:link',
              label: '\u4ECE\u5F53\u524D\u7F51\u9875\u91C7\u96C6\u94FE\u63A5',
              onClick() {
                pickLinkFromPageAndAdd(
                  root,
                  cfg,
                  {
                    saveConfig(c2) {
                      void saveConfig(c2)
                    },
                    rerender(r, c2) {
                      rerender(r, c2)
                    },
                  },
                  g.id,
                  void 0
                )
              },
            },
          ],
          {
            rightSide: groupMenuRightSide,
            onClose() {
              suppressCollapse = false
            },
          }
        )
      })
      const hideGroupBtn = document.createElement('button')
      hideGroupBtn.className = 'icon-btn'
      setIcon(
        hideGroupBtn,
        g.hidden ? 'lucide:eye' : 'lucide:eye-off',
        g.hidden ? '\u663E\u793A\u5206\u7EC4' : '\u9690\u85CF\u5206\u7EC4'
      )
      hideGroupBtn.addEventListener('click', () => {
        g.hidden = !g.hidden
        void saveConfig(cfg)
        rerender(root, cfg)
      })
      const editBtn = document.createElement('button')
      editBtn.className = 'icon-btn'
      setIcon(editBtn, 'lucide:edit-3', '\u7F16\u8F91')
      editBtn.addEventListener('click', (ev) => {
        ev.stopPropagation()
        suppressCollapse = true
        showDropdownMenu(
          root,
          editBtn,
          [
            {
              icon: 'lucide:edit-3',
              label: '\u7F16\u8F91\u5206\u7EC4',
              onClick() {
                openAddGroupModal(root, cfg, {
                  saveConfig(c2) {
                    void saveConfig(c2)
                  },
                  rerender(r, c2) {
                    rerender(r, c2)
                  },
                  defaultOpen: g.defaultOpen,
                  defaultMatch: g.match,
                  existingGroup: g,
                })
              },
            },
            {
              icon: 'lucide:list',
              label: '\u7F16\u8F91\u5BFC\u822A\u9879',
              onClick() {
                if (editingGroups.has(g.id)) editingGroups.delete(g.id)
                else editingGroups.add(g.id)
                rerender(root, cfg)
              },
            },
          ],
          {
            rightSide: editMenuRightSide,
            onClose() {
              suppressCollapse = false
            },
          }
        )
      })
      const toggleBtn = document.createElement('button')
      toggleBtn.className = 'icon-btn toggle'
      setIcon(
        toggleBtn,
        g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down',
        g.collapsed ? '\u5C55\u5F00' : '\u6298\u53E0'
      )
      toggleBtn.addEventListener('click', () => {
        g.collapsed = !g.collapsed
        void saveConfig(cfg)
        const itemsDiv = section.querySelector('.items')
        if (itemsDiv) itemsDiv.style.display = g.collapsed ? 'none' : ''
        setIcon(
          toggleBtn,
          g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down',
          g.collapsed ? '\u5C55\u5F00' : '\u6298\u53E0'
        )
      })
      actions.append(addLinkBtn)
      actions.append(editBtn)
      actions.append(hideGroupBtn)
      actions.append(toggleBtn)
    }
    header.append(actions)
    section.append(header)
    const items = document.createElement('div')
    items.className = 'items'
    const style = g.displayStyle || 'icon-title'
    const isIconOnly = style === 'icon-only' && !isEditing
    const isTitleOnly = style === 'title-only' && !isEditing
    if (isIconOnly) {
      items.classList.add('mode-icon-only')
      if (g.iconSize) items.classList.add('size-'.concat(g.iconSize))
      const iconCols = g.iconItemsPerRow || 0
      if (iconCols > 0) {
        items.classList.add('layout-grid')
        items.style.setProperty('--cols', String(iconCols))
        if (iconCols === 1) items.classList.add('cols-1')
      } else {
        items.classList.add('layout-auto')
      }
    } else {
      if (isTitleOnly) items.classList.add('mode-title-only')
      const cols = isEditing ? 1 : g.itemsPerRow || 1
      items.style.setProperty('--cols', String(cols))
      if (cols > 1) {
        items.classList.add('layout-grid')
      } else {
        items.classList.add('layout-list')
      }
    }
    items.style.display = g.collapsed ? 'none' : ''
    let visibleCount = 0
    const selectedText = globalThis.__utags_shortcuts_selected_text__
    const isSelectionFiltering = Boolean(selectedText)
    for (const it of g.items) {
      if (it.hidden && !showHiddenItems && !isEditing) continue
      if (isSelectionFiltering) {
        const val = String(it.data || '')
        if (!hasSelectedVar(val)) continue
      }
      visibleCount++
      const wrap = renderShortcutsItem(root, cfg, g, it, section, isEditing)
      items.append(wrap)
    }
    if (!isIconOnly) {
      items.style.setProperty(
        '--cols',
        String(
          isEditing
            ? 1
            : Math.max(1, Math.min(g.itemsPerRow || 1, visibleCount || 1))
        )
      )
    }
    if (visibleCount === 0) {
      if (isSelectionFiltering) {
        section.style.display = 'none'
        div.style.display = 'none'
      } else {
        const msg = document.createElement('div')
        msg.className = 'empty-msg'
        msg.textContent =
          g.items.length === 0
            ? '\u65E0\u9879\u76EE'
            : '\u9879\u76EE\u5DF2\u88AB\u9690\u85CF'
        items.append(msg)
      }
    }
    section.append(items)
    section.classList.add('fade-in')
    body.append(section)
  }
  function renderPanelHeader(root, cfg, panel) {
    const collapseRow = document.createElement('div')
    collapseRow.className = 'header'
    const leftActions = document.createElement('div')
    leftActions.className = 'panel-actions-left'
    const rightActions = document.createElement('div')
    rightActions.className = 'panel-actions'
    const closeBtn = document.createElement('button')
    closeBtn.className = 'collapse-btn'
    setIcon(closeBtn, 'lucide:x', '\u5173\u95ED')
    closeBtn.addEventListener('click', () => {
      collapseWithAnim(root, cfg)
    })
    const plusBtn = document.createElement('button')
    plusBtn.className = 'icon-btn'
    setIcon(plusBtn, 'lucide:plus', '\u6DFB\u52A0')
    plusBtn.addEventListener('click', (ev) => {
      ev.stopPropagation()
      openQuickAddMenu(root, cfg, plusBtn)
    })
    const showAllBtn = document.createElement('button')
    showAllBtn.className = 'icon-btn'
    setIcon(showAllBtn, 'lucide:layout-dashboard', '\u663E\u793A\u5168\u90E8')
    showAllBtn.classList.toggle('active', Boolean(showAllGroups))
    showAllBtn.addEventListener('click', () => {
      showAllGroups = !showAllGroups
      showAllBtn.classList.toggle('active', Boolean(showAllGroups))
      rerender(root, cfg)
    })
    const settingsBtn = document.createElement('button')
    settingsBtn.className = 'icon-btn'
    setIcon(settingsBtn, 'lucide:settings', '\u8BBE\u7F6E')
    settingsBtn.addEventListener('click', () => {
      openSettingsPanel2(store)
    })
    const pinBtn = document.createElement('button')
    pinBtn.className = 'icon-btn'
    setIcon(
      pinBtn,
      settings.pinned ? 'lucide:pin' : 'lucide:pin-off',
      settings.pinned ? '\u53D6\u6D88\u56FA\u5B9A' : '\u56FA\u5B9A\u663E\u793A'
    )
    pinBtn.classList.toggle('active', Boolean(settings.pinned))
    pinBtn.addEventListener('click', () => {
      void store.set({ pinned: !settings.pinned })
    })
    rightActions.append(plusBtn)
    rightActions.append(showAllBtn)
    if (showAllGroups) {
      const showHiddenGroupsLabel = document.createElement('label')
      showHiddenGroupsLabel.className = 'check'
      const showHiddenGroupsCb = document.createElement('input')
      showHiddenGroupsCb.type = 'checkbox'
      showHiddenGroupsCb.checked = Boolean(showHiddenGroups)
      const showHiddenGroupsSpan = document.createElement('span')
      showHiddenGroupsSpan.textContent =
        '\u663E\u793A\u9690\u85CF\u7684\u5206\u7EC4'
      showHiddenGroupsLabel.append(showHiddenGroupsCb)
      showHiddenGroupsLabel.append(showHiddenGroupsSpan)
      showHiddenGroupsCb.addEventListener('change', () => {
        showHiddenGroups = Boolean(showHiddenGroupsCb.checked)
        rerender(root, cfg)
      })
      const showHiddenItemsLabel = document.createElement('label')
      showHiddenItemsLabel.className = 'check'
      const showHiddenItemsCb = document.createElement('input')
      showHiddenItemsCb.type = 'checkbox'
      showHiddenItemsCb.checked = Boolean(showHiddenItems)
      const showHiddenItemsSpan = document.createElement('span')
      showHiddenItemsSpan.textContent =
        '\u663E\u793A\u9690\u85CF\u7684\u5BFC\u822A'
      showHiddenItemsLabel.append(showHiddenItemsCb)
      showHiddenItemsLabel.append(showHiddenItemsSpan)
      showHiddenItemsCb.addEventListener('change', () => {
        showHiddenItems = Boolean(showHiddenItemsCb.checked)
        rerender(root, cfg)
      })
      const expandAllBtn = document.createElement('button')
      expandAllBtn.className = 'btn mini'
      expandAllBtn.textContent = '\u5C55\u5F00\u6240\u6709\u5206\u7EC4'
      expandAllBtn.addEventListener('click', () => {
        preserveScroll(panel, () => {
          for (const g of cfg.groups) g.collapsed = false
          void saveConfig(cfg)
          for (const sec of Array.from(panel.querySelectorAll('.section'))) {
            const itemsDiv = sec.querySelector('.items')
            if (itemsDiv) itemsDiv.style.display = ''
            const gid = sec.dataset.gid
            const grp = cfg.groups.find((x) => x.id === gid)
            const btn = sec.querySelector('.header .icon-btn:nth-last-child(1)')
            if (grp && btn) setIcon(btn, 'lucide:chevron-down', '\u6298\u53E0')
          }
        })
      })
      const collapseAllBtn = document.createElement('button')
      collapseAllBtn.className = 'btn mini'
      collapseAllBtn.textContent = '\u6298\u53E0\u6240\u6709\u5206\u7EC4'
      collapseAllBtn.addEventListener('click', () => {
        preserveScroll(panel, () => {
          for (const g of cfg.groups) g.collapsed = true
          void saveConfig(cfg)
          for (const sec of Array.from(panel.querySelectorAll('.section'))) {
            const itemsDiv = sec.querySelector('.items')
            if (itemsDiv) itemsDiv.style.display = 'none'
            const gid = sec.dataset.gid
            const grp = cfg.groups.find((x) => x.id === gid)
            const btn = sec.querySelector('.header .icon-btn:nth-last-child(1)')
            if (grp && btn) setIcon(btn, 'lucide:chevron-right', '\u5C55\u5F00')
          }
        })
      })
      const manageGroupsBtn = document.createElement('button')
      manageGroupsBtn.className = 'btn mini'
      manageGroupsBtn.textContent = '\u7BA1\u7406\u5206\u7EC4'
      manageGroupsBtn.addEventListener('click', () => {
        openEditorModal(root, cfg, {
          saveConfig(c2) {
            void saveConfig(c2)
          },
          rerender(r, c2) {
            rerender(r, c2)
          },
          updateThemeUI,
          edgeDefaults: {
            width: EDGE_DEFAULT_WIDTH,
            height: EDGE_DEFAULT_HEIGHT,
            opacity: EDGE_DEFAULT_OPACITY,
            colorLight: EDGE_DEFAULT_COLOR_LIGHT,
            colorDark: EDGE_DEFAULT_COLOR_DARK,
          },
          tempOpenGetter: () => tempOpen,
        })
      })
      rightActions.append(showHiddenGroupsLabel)
      rightActions.append(showHiddenItemsLabel)
      rightActions.append(expandAllBtn)
      rightActions.append(collapseAllBtn)
      rightActions.append(manageGroupsBtn)
    }
    rightActions.append(settingsBtn)
    if ((settings.layoutMode || LAYOUT_DEFAULT) !== 'sidebar')
      rightActions.append(pinBtn)
    rightActions.append(closeBtn)
    collapseRow.append(leftActions)
    collapseRow.append(rightActions)
    panel.append(collapseRow)
    let body = panel
    if (showAllGroups) {
      panel.classList.add('all-mode')
      const scroller = document.createElement('div')
      scroller.className = 'panel-scroll'
      const columns = document.createElement('div')
      columns.className = 'panel-columns'
      scroller.append(columns)
      panel.append(scroller)
      body = columns
    } else {
      panel.classList.remove('all-mode')
    }
    return body
  }
  function renderPanel(root, cfg, animIn) {
    const wrapper = document.createElement('div')
    wrapper.className = 'ushortcuts' + (isDarkTheme(cfg) ? ' dark' : '')
    const panel = document.createElement('div')
    panel.className = 'panel'
    if (
      settings.panelBackgroundColor &&
      settings.panelBackgroundColor !== 'default'
    ) {
      panel.style.backgroundColor = settings.panelBackgroundColor
    }
    if (settings.layoutMode === 'sidebar') {
      try {
        panel.style.height = '100vh'
        panel.style.borderRadius = '0'
      } catch (e) {}
      try {
        const side =
          (settings.sidebarSide || SIDEBAR_SIDE_DEFAULT) === 'left'
            ? 'sidebar-left'
            : 'sidebar-right'
        panel.classList.add('sidebar', side)
      } catch (e) {}
    }
    const pos = settings.position
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
    const body = renderPanelHeader(root, cfg, panel)
    const groupsToShow = currentGroups(cfg)
    hasSelectedVarInCurrentGroups = hasSelectedVarInGroups(groupsToShow)
    for (const g of groupsToShow) renderGroupSection(root, cfg, g, body)
    wrapper.append(panel)
    wrapper.addEventListener('mouseenter', () => {
      try {
        if (collapseTimer) clearTimeout(collapseTimer)
      } catch (e) {}
    })
    wrapper.addEventListener('mouseleave', (e) => {
      if (!e.relatedTarget || e.relatedTarget === document.documentElement)
        return
      const pinnedFlag =
        (settings.layoutMode || LAYOUT_DEFAULT) === 'sidebar'
          ? true
          : Boolean(settings.pinned)
      if (!pinnedFlag && !suppressCollapse) scheduleAutoCollapse(root, cfg)
    })
    place(wrapper, cfg)
    return wrapper
  }
  function openQuickAddMenu(root, cfg, anchor) {
    suppressCollapse = true
    tempOpen = true
    const rightSide =
      isRightSide(settings.position) || settings.position.endsWith('-right')
    showDropdownMenu(
      root,
      anchor,
      [
        {
          icon: 'lucide:folder',
          label: '\u6DFB\u52A0\u5206\u7EC4',
          onClick() {
            openAddGroupModal(root, cfg, {
              saveConfig(c2) {
                void saveConfig(c2)
              },
              rerender(r, c2) {
                rerender(r, c2)
              },
              defaultOpen: void 0,
              defaultMatch: ['*://' + (location.hostname || '') + '/*'],
            })
          },
        },
        {
          icon: 'lucide:link',
          label: '\u6DFB\u52A0\u94FE\u63A5',
          onClick() {
            var _a
            const matched = currentGroups(cfg)
            openAddLinkModal(root, cfg, {
              saveConfig(c2) {
                void saveConfig(c2)
              },
              rerender(r, c2) {
                rerender(r, c2)
              },
              defaultGroupId:
                (_a = matched[0] || cfg.groups[0]) == null ? void 0 : _a.id,
            })
          },
        },
      ],
      {
        rightSide,
        onClose() {
          suppressCollapse = false
        },
      }
    )
  }
  var lastCollapsed = true
  var suppressCollapse = false
  var pendingUpdate = false
  function rerender(root, cfg) {
    var _a, _b, _c
    if (document.visibilityState !== 'visible') {
      pendingUpdate = true
      return
    }
    pendingUpdate = false
    suppressCollapse = true
    let sx = 0
    let sy = 0
    try {
      const cur =
        root.querySelector('.ushortcuts .panel-scroll') ||
        root.querySelector('.ushortcuts .panel')
      if (cur) {
        sx = cur.scrollLeft
        sy = cur.scrollTop
      }
    } catch (e) {}
    const nextNodes = []
    if (settings.enabled === false) {
      lastCollapsed = true
      suppressCollapse = false
      try {
        if (isIframeMode) {
          updateIframeLayout(false)
        }
        delete document.documentElement.dataset.utagsShortcutsSidebar
      } catch (e) {}
    } else {
      let isCollapsed = !tempOpen && (tempClosed || !settings.pinned)
      if ((settings.layoutMode || LAYOUT_DEFAULT) === 'sidebar')
        isCollapsed = !tempOpen && Boolean(tempClosed)
      if (isCollapsed) {
        const effectiveEdgeHidden =
          (settings.layoutMode || LAYOUT_DEFAULT) === 'sidebar'
            ? true
            : Boolean(settings.edgeHidden)
        if (!effectiveEdgeHidden) {
          const tab = document.createElement('div')
          tab.className = 'collapsed-tab'
          place(tab, cfg)
          try {
            const gw =
              (_a = settings.edgeWidth) != null ? _a : EDGE_DEFAULT_WIDTH
            const gh =
              (_b = settings.edgeHeight) != null ? _b : EDGE_DEFAULT_HEIGHT
            const go =
              (_c = settings.edgeOpacity) != null ? _c : EDGE_DEFAULT_OPACITY
            const horiz = isHorizontalPos(settings.position)
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
              ? String(settings.edgeColorDark || EDGE_DEFAULT_COLOR_DARK)
              : String(settings.edgeColorLight || EDGE_DEFAULT_COLOR_LIGHT)
          } catch (e) {}
          tab.addEventListener('mouseenter', () => {
            tempOpen = true
            rerender(root, cfg)
          })
          nextNodes.push(tab)
        }
        lastCollapsed = true
        suppressCollapse = false
        const groupsToShow = currentGroups(cfg)
        hasSelectedVarInCurrentGroups = hasSelectedVarInGroups(groupsToShow)
        try {
          if (isIframeMode) {
            updateIframeLayout(false)
          }
          delete document.documentElement.dataset.utagsShortcutsSidebar
        } catch (e) {}
      } else {
        nextNodes.push(renderPanel(root, cfg, lastCollapsed))
        updateSidebarClass()
        lastCollapsed = false
        suppressCollapse = false
      }
    }
    const toRemove = Array.from(
      root.querySelectorAll('.ushortcuts,.collapsed-tab,.quick-add-menu')
    )
    if (nextNodes.length > 0) {
      const firstChild = root.firstElementChild
      if (firstChild) {
        for (const n of nextNodes) firstChild.before(n)
      } else {
        root.append(...nextNodes)
      }
    }
    setTimeout(() => {
      for (const n of toRemove) n.remove()
    }, 100)
    if (!lastCollapsed) {
      try {
        const cur =
          root.querySelector('.ushortcuts .panel-scroll') ||
          root.querySelector('.ushortcuts .panel')
        if (cur) {
          cur.scrollLeft = sx
          cur.scrollTop = sy
          try {
            requestAnimationFrame(() => {
              cur.scrollLeft = sx
              cur.scrollTop = sy
            })
          } catch (e) {}
        }
      } catch (e) {}
    }
  }
  function registerMenus(root, cfg) {
    try {
      for (const id of menuIds) {
        try {
          unregisterMenu(id)
        } catch (e) {}
      }
      menuIds = []
      const text = settings.enabled
        ? '\u{1F6AB} \u7981\u7528\u5F53\u524D\u7F51\u7AD9\u5FEB\u6377\u5BFC\u822A'
        : '\u2705 \u542F\u7528\u5F53\u524D\u7F51\u7AD9\u5FEB\u6377\u5BFC\u822A'
      menuIds.push(
        registerMenu(
          '\u{1F9ED} \u6253\u5F00\u5FEB\u6377\u5BFC\u822A\u9762\u677F',
          () => {
            if (settings.enabled === false) {
              const ok = globalThis.confirm(
                '\u5F53\u524D\u7F51\u7AD9\u5DF2\u7981\u7528\uFF0C\u662F\u5426\u542F\u7528\u5E76\u6253\u5F00\u9762\u677F\uFF1F'
              )
              if (ok) {
                void store.set({ enabled: true })
                tempOpen = true
              }
              return
            }
            tempOpen = true
            rerender(root, cfg)
          }
        ),
        registerMenu('\u2699\uFE0F \u8BBE\u7F6E', () => {
          openSettingsPanel2(store)
        }),
        registerMenu(text, () => {
          void store.set({ enabled: !settings.enabled })
        })
      )
    } catch (e) {}
  }
  function registerStorageListener(root, cfg) {
    try {
      void addValueChangeListener(CONFIG_KEY, (_name, _old, nv, remote) => {
        try {
          const obj = JSON.parse(nv)
          if (obj && obj.groups) {
            cfg.groups = obj.groups
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
    }, 10)
  }
  function collapseWithAnim(root, cfg) {
    try {
      const p = settings.position
      const sel = root.querySelector('.ushortcuts .panel')
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
    const wrapper = root.querySelector('.ushortcuts')
    if (!wrapper) return
    wrapper.classList.toggle('dark', isDarkTheme(cfg))
    const curTheme = settings.theme || THEME_DEFAULT
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
    let rerenderTimer = null
    function scheduleRerender() {
      if (rerenderTimer) clearTimeout(rerenderTimer)
      rerenderTimer = setTimeout(() => {
        rerender(root, cfg)
      }, 200)
    }
    let lastTitle = document.title.trim()
    watchTitleChange(() => {
      const currentTitle = document.title.trim()
      if (currentTitle === lastTitle) return
      lastTitle = currentTitle
      scheduleRerender()
    })
    let lastSelectedText = ''
    document.addEventListener('selectionchange', () => {
      const selection = document.getSelection()
      if (!selection) return
      const anchorNode = selection.anchorNode
      if (anchorNode && anchorNode instanceof HTMLHtmlElement) {
        return
      }
      let text = (selection || '').toString().trim()
      if (!hasSelectedVarInCurrentGroups) {
        text = ''
      }
      if (text === lastSelectedText) return
      lastSelectedText = text
      globalThis.__utags_shortcuts_selected_text__ = text
      scheduleRerender()
    })
    window.addEventListener('message', (e) => {
      var _a
      if (
        ((_a = e.data) == null ? void 0 : _a.type) ===
        'USHORTCUTS_SELECTION_CHANGE'
      ) {
        let text = (e.data.text || '').trim()
        if (!hasSelectedVarInCurrentGroups) {
          text = ''
        }
        if (text === lastSelectedText) return
        lastSelectedText = text
        globalThis.__utags_shortcuts_selected_text__ = text
        scheduleRerender()
      }
    })
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
  function updateSidebarClass() {
    if (isIframeMode) {
      updateIframeLayout(
        settings.enabled !== false && settings.layoutMode === 'sidebar'
      )
      return
    }
    try {
      if (settings.enabled !== false && settings.layoutMode === 'sidebar') {
        void ensureGlobalStyles()
        document.documentElement.dataset.utagsShortcutsSidebar =
          (settings.sidebarSide || SIDEBAR_SIDE_DEFAULT) === 'left'
            ? 'left-open'
            : 'right-open'
      } else {
        delete document.documentElement.dataset.utagsShortcutsSidebar
      }
    } catch (e) {}
  }
  function registerHostAutofix(_root, cfg) {
    try {
      const mo = new MutationObserver(() => {
        const existing = document.querySelector(
          '[data-ushortcuts-host="utags-shortcuts"]'
        )
        if (!(existing instanceof HTMLElement)) {
          try {
            const host = _root == null ? void 0 : _root.host
            if (host) {
              if (!document.documentElement.contains(host)) {
                document.documentElement.append(host)
              }
              updateSidebarClass()
              return
            }
          } catch (e) {}
          const { root: newRoot } = createRoot()
          rerender(newRoot, cfg)
        }
      })
      mo.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
      })
    } catch (e) {}
  }
  function main() {
    try {
      const de = document.documentElement
      if (!de || de.tagName !== 'HTML') return
      if (de.dataset && de.dataset.utagsShortcuts === '1') return
      if (de.dataset) de.dataset.utagsShortcuts = '1'
    } catch (e) {}
    if (!isTopFrame()) {
      let timer
      document.addEventListener('selectionchange', () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          var _a
          const text = (document.getSelection() || '').toString()
          ;(_a = window.top) == null
            ? void 0
            : _a.postMessage({ type: 'USHORTCUTS_SELECTION_CHANGE', text }, '*')
        }, 200)
      })
      return
    }
    const { root } = createRoot()
    void (async () => {
      const cfg = await loadConfig()
      settings = await store.getAll()
      isIframeMode =
        settings.layoutMode === 'sidebar' &&
        settings.sidebarUseIframe &&
        !isIframeModeDisabled()
      const updateState = () => {
        rerender(root, cfg)
        registerMenus(root, cfg)
        updateSidebarClass()
      }
      store.onChange(async () => {
        settings = await store.getAll()
        isIframeMode =
          settings.layoutMode === 'sidebar' &&
          settings.sidebarUseIframe &&
          !isIframeModeDisabled()
        updateState()
      })
      void ensureGlobalStyles()
      registerHostAutofix(root, cfg)
      registerHotkeys(root, cfg)
      registerStorageListener(root, cfg)
      registerUrlChangeListener(root, cfg)
      try {
        const mq = globalThis.matchMedia('(prefers-color-scheme: dark)')
        mq.addEventListener('change', () => {
          if ((settings.theme || 'system') === 'system') rerender(root, cfg)
        })
      } catch (e) {}
      try {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && pendingUpdate) {
            rerender(root, cfg)
          }
        })
      } catch (e) {}
      updateState()
    })()
  }
  main()
})()
