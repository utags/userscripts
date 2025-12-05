// ==UserScript==
// @name                 UTags Quick Nav - staging
// @name:zh-CN           UTags 快速导航 - staging
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
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM_registerMenuCommand
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
  var style_default =
    '/*! tailwindcss v4.1.17 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-200:oklch(92.8% 0.006 264.531);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-800:oklch(27.8% 0.033 256.848);--color-gray-900:oklch(21% 0.034 264.665);--color-black:#000;--color-white:#fff;--spacing:0.25rem;--text-xs:0.75rem;--text-xs--line-height:1.33333;--font-weight-semibold:600;--tracking-wider:0.05em;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--ease-in:cubic-bezier(0.4,0,1,1);--blur-sm:8px;--default-transition-duration:150ms;--default-transition-timing-function:cubic-bezier(0.4,0,0.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.collapse{visibility:collapse}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.container{width:100%;@media (width >= 40rem){max-width:40rem}@media (width >= 48rem){max-width:48rem}@media (width >= 64rem){max-width:64rem}@media (width >= 80rem){max-width:80rem}@media (width >= 96rem){max-width:96rem}}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline-flex{display:inline-flex}.table{display:table}.flex-shrink{flex-shrink:1}.flex-grow{flex-grow:1}.border-collapse{border-collapse:collapse}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.resize{resize:both}.flex-wrap{flex-wrap:wrap}.border{border-style:var(--tw-border-style);border-width:1px}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-filter{backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function))}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}}:host{all:initial}.utqn{color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px;position:fixed;z-index:2147483647}.utqn.dark{color:var(--color-gray-100)}.panel{background-color:color-mix(in oklab,var(--color-white) 85%,transparent);border-color:var(--color-gray-200);border-radius:var(--radius-xl);border-style:var(--tw-border-style);border-width:1px;display:flex;flex-direction:column;gap:calc(var(--spacing)*3);max-width:360px;padding:calc(var(--spacing)*3);--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-backdrop-blur:blur(var(--blur-sm));--tw-backdrop-saturate:saturate(1.2);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.utqn.dark .panel{background-color:color-mix(in srgb,oklch(21% .034 264.665) 80%,transparent);border-color:var(--color-gray-700);@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-gray-900) 80%,transparent)}--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}@keyframes utqn-slide-in-left{0%{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}@keyframes utqn-slide-in-right{0%{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}@keyframes utqn-slide-out-left{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-12px)}}@keyframes utqn-slide-out-right{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(12px)}}.anim-in-left{animation:utqn-slide-in-left .2s ease-out}.anim-in-right{animation:utqn-slide-in-right .2s ease-out}.anim-out-left{animation:utqn-slide-out-left .18s ease-in forwards}.anim-out-right{animation:utqn-slide-out-right .18s ease-in forwards}.header{align-items:center;display:flex;gap:calc(var(--spacing)*2);justify-content:space-between}.header-actions{align-items:center;display:flex;gap:calc(var(--spacing)*1.5);opacity:0;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s}.section:hover .header-actions{opacity:100%}.icon-btn{border-radius:var(--radius-md);color:var(--color-gray-600);padding:calc(var(--spacing)*1);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .icon-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.icon-btn.active{background-color:var(--color-gray-200);color:var(--color-gray-900);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.icon-btn.active,.utqn.dark .icon-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .icon-btn.active{background-color:var(--color-gray-700);color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.title{align-items:center;display:flex;gap:calc(var(--spacing)*1.5);--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-800);font-weight:var(--font-weight-semibold)}.utqn.dark .title{color:var(--color-gray-100)}.btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}&:active{scale:.99}}.utqn.dark .btn{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.items{display:grid;gap:calc(var(--spacing)*1.5);grid-template-columns:repeat(var(--cols,1),minmax(0,1fr))}.item{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-900);display:inline-flex;gap:calc(var(--spacing)*1.5);padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);text-decoration-line:none;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;width:100%}.item:hover{background-color:var(--color-gray-100)}.utqn.dark .item:hover{background-color:var(--color-gray-800)}.utqn.dark .item{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-100);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.icon{display:inline-flex;height:calc(var(--spacing)*4);width:calc(var(--spacing)*4)}.collapsed-tab,.icon{align-items:center;justify-content:center}.collapsed-tab{background-color:var(--color-gray-900);border-radius:var(--radius-xl);color:var(--color-white);display:flex;height:48px;opacity:50%;position:fixed;width:22px;z-index:2147483647}.modal-mask{align-items:center;background-color:color-mix(in srgb,#000 40%,transparent);display:flex;inset:calc(var(--spacing)*0);justify-content:center;position:fixed;@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-black) 40%,transparent)}}.modal h2{font-size:16px;margin:calc(var(--spacing)*0);margin-bottom:calc(var(--spacing)*2.5)}.row{display:flex;gap:calc(var(--spacing)*2);margin-block:calc(var(--spacing)*1.5)}input,select,textarea{border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;flex:1;font-size:13px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}textarea{min-height:80px}.grid{display:grid;gap:calc(var(--spacing)*2);grid-template-columns:repeat(2,minmax(0,1fr))}.group-list{display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*1.5);margin-top:calc(var(--spacing)*1.5)}.group-pill{border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.group-pill.active{background-color:var(--color-gray-900);border-color:var(--color-gray-900);color:var(--color-white)}.utqn.dark .group-pill{border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.utqn.dark .group-pill.active{background-color:var(--color-gray-100);border-color:var(--color-gray-100);color:var(--color-gray-900)}.mini{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*1.5)}.section{border-color:var(--color-gray-200);border-top-style:var(--tw-border-style);border-top-width:1px;margin-top:calc(var(--spacing)*2);padding-top:calc(var(--spacing)*2)}.utqn.dark .section{border-color:var(--color-gray-700)}.section-title{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));margin-bottom:calc(var(--spacing)*1);--tw-tracking:var(--tracking-wider);color:var(--color-gray-500);letter-spacing:var(--tracking-wider);text-transform:uppercase}.utqn.dark .section-title{color:var(--color-gray-400)}.modal{background-color:var(--color-white);border-radius:var(--radius-2xl);max-width:92vw;padding:calc(var(--spacing)*3);width:720px;--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .modal{background-color:var(--color-gray-900);color:var(--color-gray-100)}.editor{border-radius:var(--radius-2xl);max-height:72vh;overflow-y:auto;padding:calc(var(--spacing)*4)}.editor .grid,.editor .row{gap:calc(var(--spacing)*2)}.editor .row{align-items:center}.editor .row label{color:var(--color-gray-500);width:120px}.utqn.dark .editor .row label{color:var(--color-gray-400)}.editor input,.editor select,.editor textarea{background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);&:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-300);--tw-outline-style:none;outline-style:none}}.utqn.dark .editor input,.utqn.dark .editor select,.utqn.dark .editor textarea{background-color:var(--color-gray-800);border-color:var(--color-gray-700);&:focus{--tw-ring-color:var(--color-gray-700)}}.editor .item-row{align-items:center;background-color:var(--color-gray-50);border-radius:var(--radius-md);display:grid;gap:8px;grid-template-columns:1.2fr 1.1fr .9fr 2fr 1fr .9fr 1.3fr auto auto;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}.editor .item-row:hover{background-color:var(--color-gray-100)}.utqn.dark .editor .item-row{background-color:var(--color-gray-800)}.utqn.dark .editor .item-row:hover{background-color:var(--color-gray-700)}.editor .btn{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2)}.row label{color:var(--color-gray-500);width:120px}.utqn.dark .row label{color:var(--color-gray-400)}.panel-actions,.panel-actions-left{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.theme-switch{align-items:center;background-color:var(--color-gray-100);border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;display:inline-flex;gap:calc(var(--spacing)*1);padding-block:2px;padding-inline:calc(var(--spacing)*1);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .theme-switch{background-color:var(--color-gray-800)}.theme-btn{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .theme-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.theme-btn.active{background-color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.theme-btn.active,.utqn.dark .theme-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .theme-btn.active{background-color:var(--color-gray-700);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.collapse-btn{border-radius:var(--radius-md);color:var(--color-gray-600);padding:calc(var(--spacing)*1);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .collapse-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.item+.icon-btn{justify-self:flex-end}.item-wrap,.items{align-items:center}.item-wrap{display:flex;gap:8px;justify-content:space-between}.item-wrap .item{flex:1}.item-wrap .icon-btn{opacity:0;transition:opacity .15s ease-in-out}.item-wrap:hover .icon-btn{opacity:1}.item-wrap:focus-within .icon-btn{opacity:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-ease:initial;--tw-duration:initial;--tw-font-weight:initial;--tw-tracking:initial}}'
  var KEY = 'utqn_config'
  function uid() {
    return Math.random().toString(36).slice(2, 10)
  }
  function matchPattern(url, pattern) {
    try {
      const esc = pattern
        .replaceAll(/[.+^${}()|[\]\\]/g, '\\$&')
        .replaceAll('*', '.*')
      const re = new RegExp('^' + esc + '$')
      return re.test(url)
    } catch (e) {
      return false
    }
  }
  function renderIcon(s) {
    const span = document.createElement('span')
    span.className = 'icon'
    const t = String(s || '').trim()
    if (!t) return span
    if (t.startsWith('lucide:')) {
      const k = t.split(':')[1]
      const img = document.createElement('img')
      img.src =
        'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/'.concat(
          k,
          '.svg'
        )
      img.width = 16
      img.height = 16
      img.style.objectFit = 'contain'
      span.append(img)
      return span
    }
    if (t.startsWith('url:')) {
      const img = document.createElement('img')
      img.src = t.slice(4)
      img.width = 16
      img.height = 16
      img.style.objectFit = 'contain'
      span.append(img)
      return span
    }
    if (t.startsWith('svg:')) {
      span.innerHTML = t.slice(4)
      return span
    }
    span.textContent = t
    return span
  }
  function openItem(it, group, cfg) {
    const mode = it.openIn || group.defaultOpen || cfg.global.defaultOpen
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
      if (v) return JSON.parse(String(v))
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
      global: {
        position: 'top-right',
        defaultOpen: 'same-tab',
        collapsed: true,
        theme: 'system',
      },
      groups: [g],
    }
  }
  async function saveConfig(cfg) {
    try {
      await GM.setValue(KEY, JSON.stringify(cfg))
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
    const p = cfg.global.position
    el.style.position = 'fixed'
    el.style.inset = 'auto'
    switch (p) {
      case 'top-right': {
        el.style.top = '12px'
        el.style.right = '12px'
        break
      }
      case 'top-left': {
        el.style.top = '12px'
        el.style.left = '12px'
        break
      }
      case 'bottom-left': {
        el.style.bottom = '12px'
        el.style.left = '12px'
        break
      }
      case 'bottom-right': {
        el.style.bottom = '12px'
        el.style.right = '12px'
        break
      }
      case 'left-edge': {
        el.style.top = '50%'
        el.style.left = '6px'
        el.style.transform = 'translateY(-50%)'
        break
      }
      case 'right-edge': {
        el.style.top = '50%'
        el.style.right = '6px'
        el.style.transform = 'translateY(-50%)'
        break
      }
    }
  }
  function scorePattern(url, pattern) {
    if (!matchPattern(url, pattern)) return -1
    return pattern.replaceAll('*', '').length
  }
  function groupScore(url, g) {
    let max = -1
    for (const p of g.match) {
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
    const t = cfg.global.theme || 'system'
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
    const pos = cfg.global.position
    const isRight =
      pos === 'top-right' || pos === 'bottom-right' || pos === 'right-edge'
    if (animIn) panel.classList.add(isRight ? 'anim-in-right' : 'anim-in-left')
    const collapseIconBtn = document.createElement('button')
    collapseIconBtn.className = 'collapse-btn'
    collapseIconBtn.append(
      renderIcon(isRight ? 'lucide:chevron-right' : 'lucide:chevron-left')
    )
    collapseIconBtn.title = cfg.global.collapsed
      ? '\u5C55\u5F00'
      : '\u6298\u53E0'
    collapseIconBtn.addEventListener('click', () => {
      const toCollapsed = !cfg.global.collapsed
      if (toCollapsed) {
        cfg.global.pinned = false
        collapseWithAnim(root, cfg)
        return
      }
      cfg.global.collapsed = false
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    const themeSwitch = document.createElement('div')
    themeSwitch.className = 'theme-switch'
    const sysBtn = document.createElement('button')
    sysBtn.className = 'theme-btn'
    sysBtn.append(renderIcon('lucide:monitor'))
    sysBtn.title = '\u7CFB\u7EDF'
    sysBtn.addEventListener('click', () => {
      cfg.global.theme = 'system'
      void saveConfig(cfg)
      updateThemeUI(root, cfg)
    })
    const lightBtn = document.createElement('button')
    lightBtn.className = 'theme-btn'
    lightBtn.append(renderIcon('lucide:sun'))
    lightBtn.title = '\u6D45\u8272'
    lightBtn.addEventListener('click', () => {
      cfg.global.theme = 'light'
      void saveConfig(cfg)
      updateThemeUI(root, cfg)
    })
    const darkBtn = document.createElement('button')
    darkBtn.className = 'theme-btn'
    darkBtn.append(renderIcon('lucide:moon'))
    darkBtn.title = '\u6DF1\u8272'
    darkBtn.addEventListener('click', () => {
      cfg.global.theme = 'dark'
      void saveConfig(cfg)
      updateThemeUI(root, cfg)
    })
    const curTheme = cfg.global.theme || 'system'
    sysBtn.classList.toggle('active', curTheme === 'system')
    lightBtn.classList.toggle('active', curTheme === 'light')
    darkBtn.classList.toggle('active', curTheme === 'dark')
    themeSwitch.append(sysBtn)
    themeSwitch.append(lightBtn)
    themeSwitch.append(darkBtn)
    const settingsBtn = document.createElement('button')
    settingsBtn.className = 'icon-btn'
    settingsBtn.append(renderIcon('lucide:settings'))
    settingsBtn.title = '\u8BBE\u7F6E'
    settingsBtn.addEventListener('click', () => {
      openEditor(root, cfg)
    })
    const pinBtn = document.createElement('button')
    pinBtn.className = 'icon-btn'
    pinBtn.append(
      renderIcon(cfg.global.pinned ? 'lucide:pin' : 'lucide:pin-off')
    )
    pinBtn.title = cfg.global.pinned
      ? '\u53D6\u6D88\u56FA\u5B9A'
      : '\u56FA\u5B9A\u663E\u793A'
    pinBtn.classList.toggle('active', Boolean(cfg.global.pinned))
    pinBtn.addEventListener('click', () => {
      cfg.global.pinned = !cfg.global.pinned
      cfg.global.collapsed = !cfg.global.pinned
      void saveConfig(cfg)
      pinBtn.classList.toggle('active', Boolean(cfg.global.pinned))
      pinBtn.title = cfg.global.pinned
        ? '\u53D6\u6D88\u56FA\u5B9A'
        : '\u56FA\u5B9A\u663E\u793A'
      pinBtn.innerHTML = ''
      pinBtn.append(
        renderIcon(cfg.global.pinned ? 'lucide:pin' : 'lucide:pin-off')
      )
    })
    if (isRight) {
      leftActions.append(collapseIconBtn)
      rightActions.append(themeSwitch)
      rightActions.append(settingsBtn)
      rightActions.append(pinBtn)
    } else {
      leftActions.append(themeSwitch)
      leftActions.append(settingsBtn)
      leftActions.append(pinBtn)
      rightActions.append(collapseIconBtn)
    }
    collapseRow.append(leftActions)
    collapseRow.append(rightActions)
    panel.append(collapseRow)
    const matched = currentGroups(cfg)
    const groupsToShow = matched
    for (const g of groupsToShow) {
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
      const actions = document.createElement('div')
      actions.className = 'header-actions'
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
        const sec = panel.querySelector('.section[data-gid="' + g.id + '"]')
        if (sec) {
          const itemsEl = sec.querySelector('.items')
          if (itemsEl) itemsEl.style.display = g.collapsed ? 'none' : ''
          toggleBtn.title = g.collapsed ? '\u5C55\u5F00' : '\u6298\u53E0'
          toggleBtn.innerHTML = ''
          toggleBtn.append(
            renderIcon(
              g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down'
            )
          )
        }
      })
      actions.append(editBtn)
      actions.append(hideGroupBtn)
      actions.append(toggleBtn)
      header.append(actions)
      const items = document.createElement('div')
      items.className = 'items'
      items.style.setProperty('--cols', String(g.itemsPerRow || 1))
      if (!g.collapsed) {
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
            const mode = it.openIn || g.defaultOpen || cfg.global.defaultOpen
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
          a.append(renderIcon(it.icon))
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
      }
      section.append(header)
      section.append(items)
      panel.append(section)
    }
    wrapper.append(panel)
    wrapper.addEventListener('mouseleave', () => {
      if (!cfg.global.pinned && !suppressCollapse)
        scheduleAutoCollapse(root, cfg)
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
    const mask = document.createElement('div')
    mask.className = 'modal-mask'
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
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'left-edge',
      'right-edge',
    ]) {
      const o = document.createElement('option')
      o.value = p
      o.textContent = p
      if (cfg.global.position === p) o.selected = true
      posSel.append(o)
    }
    posSel.addEventListener('change', () => {
      cfg.global.position = posSel.value
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    posRow.append(posLabel)
    posRow.append(posSel)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F'
    const openSel = document.createElement('select')
    for (const m of ['same-tab', 'new-tab']) {
      const o = document.createElement('option')
      o.value = m
      o.textContent = m
      if (cfg.global.defaultOpen === m) o.selected = true
      openSel.append(o)
    }
    openSel.addEventListener('change', () => {
      const grp = cfg.groups.find((g) => g.id === active.id)
      if (!grp) return
      grp.defaultOpen = openSel.value
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    openRow.append(openLabel)
    openRow.append(openSel)
    grid.append(posRow)
    grid.append(openRow)
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
    const grpHeader = document.createElement('h2')
    grpHeader.className = 'section-title'
    grpHeader.textContent = '\u5206\u7EC4'
    const grpList = document.createElement('div')
    grpList.className = 'group-list'
    let active = cfg.groups.find((g) => g.id === activeGroupId) || cfg.groups[0]
    function rebuildGroupPills() {
      grpList.innerHTML = ''
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
      groupEditor.innerHTML = ''
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
      const openSel2 = document.createElement('select')
      for (const m of ['same-tab', 'new-tab']) {
        const o = document.createElement('option')
        o.value = m
        o.textContent = m
        if ((active.defaultOpen || cfg.global.defaultOpen) === m)
          o.selected = true
        openSel2.append(o)
      }
      openSel2.addEventListener('change', () => {
        active.defaultOpen = openSel2.value
        void saveConfig(cfg)
      })
      row4.append(l4)
      row4.append(openSel2)
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
        itemsList.innerHTML = ''
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
              (it.openIn || active.defaultOpen || cfg.global.defaultOpen) === mm
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
      addBtn.className = 'btn'
      addBtn.textContent = '\u6DFB\u52A0\u5BFC\u822A\u9879'
      addBtn.addEventListener('click', () => {
        active.items.push({
          id: uid(),
          name: '\u65B0\u9879',
          icon: 'lucide:link',
          type: 'url',
          data: '/',
          openIn: active.defaultOpen || cfg.global.defaultOpen,
        })
        void saveConfig(cfg)
        rebuildItems()
        rerender(root, cfg)
      })
      addRow.append(addBtn)
      const grpActions = document.createElement('div')
      grpActions.className = 'row'
      const addGroup = document.createElement('button')
      addGroup.className = 'btn'
      addGroup.textContent = '\u6DFB\u52A0\u5206\u7EC4'
      addGroup.addEventListener('click', () => {
        const ng = {
          id: uid(),
          name: '\u65B0\u5206\u7EC4',
          icon: 'lucide:folder',
          match: ['*://' + (location.hostname || '') + '/*'],
          items: [],
          defaultOpen: cfg.global.defaultOpen,
        }
        cfg.groups.push(ng)
        active = ng
        void saveConfig(cfg)
        rebuildGroupPills()
        rebuildGroupEditor()
        rerender(root, cfg)
      })
      const delGroup = document.createElement('button')
      delGroup.className = 'btn'
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
      grpActions.append(addGroup)
      grpActions.append(delGroup)
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
    exportBtn.className = 'btn'
    exportBtn.textContent = '\u5BFC\u51FA\u914D\u7F6E'
    exportBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
      } catch (e) {}
    })
    const closeBtn = document.createElement('button')
    closeBtn.className = 'btn'
    closeBtn.textContent = '\u5173\u95ED'
    closeBtn.addEventListener('click', () => {
      mask.remove()
    })
    actions.append(exportBtn)
    actions.append(closeBtn)
    modal.append(h2)
    modal.append(grid)
    modal.append(syncRow)
    modal.append(grpHeader)
    modal.append(grpList)
    modal.append(groupEditor)
    modal.append(actions)
    mask.append(modal)
    root.append(mask)
  }
  var lastCollapsed = true
  var suppressCollapse = false
  function rerender(root, cfg) {
    suppressCollapse = true
    for (const n of Array.from(root.querySelectorAll('.utqn,.collapsed-tab')))
      n.remove()
    if (cfg.global.collapsed) {
      const tab = document.createElement('div')
      tab.className = 'collapsed-tab'
      tab.textContent = '\u2261'
      place(tab, cfg)
      tab.addEventListener('mouseenter', () => {
        cfg.global.collapsed = false
        rerender(root, cfg)
      })
      tab.addEventListener('mouseleave', () => {
        if (!cfg.global.pinned && !suppressCollapse)
          scheduleAutoCollapse(root, cfg)
      })
      root.append(tab)
      lastCollapsed = true
      suppressCollapse = false
      return
    }
    renderPanel(root, cfg, lastCollapsed)
    lastCollapsed = false
    suppressCollapse = false
  }
  function initEdgeExpand(root, cfg) {
    let lastOpen = 0
    document.addEventListener('mousemove', (e) => {
      const now = Date.now()
      if (now - lastOpen < 500) return
      const w = window.innerWidth
      const nearLeft = e.clientX < 6
      const nearRight = e.clientX > w - 6
      if (
        (cfg.global.position === 'left-edge' && nearLeft) ||
        (cfg.global.position === 'right-edge' && nearRight)
      ) {
        cfg.global.collapsed = false
        rerender(root, cfg)
        lastOpen = now
      }
    })
  }
  function registerMenu(root, cfg) {
    try {
      const fn = globalThis.GM_registerMenuCommand
      if (typeof fn === 'function')
        fn('\u2699\uFE0F \u8BBE\u7F6E\u5FEB\u901F\u5BFC\u822A', () => {
          openEditor(root, cfg)
        })
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
    }, 150)
  }
  function collapseWithAnim(root, cfg) {
    try {
      const p = cfg.global.position
      const sel = root.querySelector('.utqn .panel')
      if (sel) {
        const right =
          p === 'top-right' || p === 'bottom-right' || p === 'right-edge'
        sel.classList.add(right ? 'anim-out-right' : 'anim-out-left')
        sel.addEventListener(
          'animationend',
          () => {
            cfg.global.collapsed = true
            void saveConfig(cfg)
            rerender(root, cfg)
          },
          { once: true }
        )
        return
      }
    } catch (e) {}
    cfg.global.collapsed = true
    void saveConfig(cfg)
    rerender(root, cfg)
  }
  function main() {
    const { root } = createRoot()
    void (async () => {
      const cfg = await loadConfig()
      rerender(root, cfg)
      initEdgeExpand(root, cfg)
      registerMenu(root, cfg)
      registerStorageListener(root, cfg)
      registerUrlChangeListener(root, cfg)
      try {
        const mq = globalThis.matchMedia('(prefers-color-scheme: dark)')
        mq.addEventListener('change', () => {
          if ((cfg.global.theme || 'system') === 'system') rerender(root, cfg)
        })
      } catch (e) {}
    })()
  }
  main()
  function updateThemeUI(root, cfg) {
    const wrapper = root.querySelector('.utqn')
    if (!wrapper) return
    wrapper.classList.toggle('dark', isDarkTheme(cfg))
    const cur = cfg.global.theme || 'system'
    const map = {
      系统: 'system',
      浅色: 'light',
      深色: 'dark',
    }
    const btns = wrapper.querySelectorAll('.theme-btn')
    for (const b of Array.from(btns)) {
      const key = b.title
      const val = map[key] || ''
      b.classList.toggle('active', val === cur)
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
})()
