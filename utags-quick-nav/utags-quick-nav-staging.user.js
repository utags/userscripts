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
// @connect              cdn.jsdelivr.net
// @connect              fastly.jsdelivr.net
// @connect              unpkg.com
// @connect              wsrv.nl
// @noframes
// @run-at               document-body
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
      injectImageAsData(span, getWrappedIconUrl(url))
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
  function setIcon(el, icon, title) {
    try {
      clearChildren(el)
      el.append(renderIcon(icon))
      if (title !== void 0) el.title = title
    } catch (e) {}
  }
  var lastSuccessfulCdnIndex = 0
  var cdnBases = [
    'https://cdn.jsdelivr.net/npm',
    'https://fastly.jsdelivr.net/npm',
    'https://unpkg.com',
  ]
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
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          onload(res) {
            try {
              const svg = String(res.responseText || '')
              if (res.status >= 200 && res.status < 300 && svg) {
                const dataUrl =
                  'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
                iconCache.set(name, dataUrl)
                const img = document.createElement('img')
                img.width = 16
                img.height = 16
                img.style.objectFit = 'contain'
                img.className = 'lucide-icon'
                img.src = dataUrl
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
        })
      } catch (e) {
        tryFetch(attempt + 1)
      }
    }
    tryFetch(0)
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
  function uid() {
    return Math.random().toString(36).slice(2, 10)
  }
  function resolveUrlTemplate(s) {
    const re = /{([^}]+)}/g
    return String(s || '').replaceAll(re, (_, body) => {
      var _a
      const parts = String(body || '')
        .split('||')
        .map((x) => x.trim())
        .filter(Boolean)
      const resolvers = {
        hostname() {
          var _a2
          return (
            ((_a2 = globalThis.location) == null ? void 0 : _a2.hostname) || ''
          )
        },
        hostname_without_www() {
          var _a2
          const h =
            ((_a2 = globalThis.location) == null ? void 0 : _a2.hostname) || ''
          return h.startsWith('www.') ? h.slice(4) : h
        },
        query() {
          var _a2
          try {
            const href =
              ((_a2 = globalThis.location) == null ? void 0 : _a2.href) || ''
            const u = new URL(href)
            return (
              u.searchParams.get('query') ||
              u.searchParams.get('q') ||
              u.searchParams.get('kw') ||
              u.searchParams.get('wd') ||
              u.searchParams.get('keyword') ||
              u.searchParams.get('p') ||
              u.searchParams.get('s') ||
              u.searchParams.get('term') ||
              ''
            )
          } catch (e) {}
          return ''
        },
        kw() {
          var _a2
          try {
            const href =
              ((_a2 = globalThis.location) == null ? void 0 : _a2.href) || ''
            const u = new URL(href)
            return u.searchParams.get('kw') || ''
          } catch (e) {}
          return ''
        },
        wd() {
          var _a2
          try {
            const href =
              ((_a2 = globalThis.location) == null ? void 0 : _a2.href) || ''
            const u = new URL(href)
            return u.searchParams.get('wd') || ''
          } catch (e) {}
          return ''
        },
        keyword() {
          var _a2
          try {
            const href =
              ((_a2 = globalThis.location) == null ? void 0 : _a2.href) || ''
            const u = new URL(href)
            return u.searchParams.get('keyword') || ''
          } catch (e) {}
          return ''
        },
        p() {
          var _a2
          try {
            const href =
              ((_a2 = globalThis.location) == null ? void 0 : _a2.href) || ''
            const u = new URL(href)
            return u.searchParams.get('p') || ''
          } catch (e) {}
          return ''
        },
        s() {
          var _a2
          try {
            const href =
              ((_a2 = globalThis.location) == null ? void 0 : _a2.href) || ''
            const u = new URL(href)
            return u.searchParams.get('s') || ''
          } catch (e) {}
          return ''
        },
        term() {
          var _a2
          try {
            const href =
              ((_a2 = globalThis.location) == null ? void 0 : _a2.href) || ''
            const u = new URL(href)
            return u.searchParams.get('term') || ''
          } catch (e) {}
          return ''
        },
        selected() {
          var _a2, _b
          try {
            return (
              ((_b =
                ((_a2 = globalThis.getSelection) == null
                  ? void 0
                  : _a2.call(globalThis)) || void 0) == null
                ? void 0
                : _b.toString()) || ''
            )
          } catch (e) {}
          return ''
        },
      }
      for (const p of parts) {
        const v = String(
          ((_a = resolvers[p]) == null ? void 0 : _a.call(resolvers)) || ''
        ).trim()
        if (v) return v
      }
      return ''
    })
  }
  var style_default =
    '/*! tailwindcss v4.1.17 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-blue-400:oklch(70.7% 0.165 254.624);--color-blue-500:oklch(62.3% 0.214 259.815);--color-blue-600:oklch(54.6% 0.245 262.881);--color-blue-700:oklch(48.8% 0.243 264.376);--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-200:oklch(92.8% 0.006 264.531);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-800:oklch(27.8% 0.033 256.848);--color-gray-900:oklch(21% 0.034 264.665);--color-black:#000;--color-white:#fff;--spacing:0.25rem;--text-xs:0.75rem;--text-xs--line-height:1.33333;--text-sm:0.875rem;--text-sm--line-height:1.42857;--text-base:1rem;--text-base--line-height:1.5;--font-weight-medium:500;--font-weight-semibold:600;--tracking-wider:0.05em;--leading-snug:1.375;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--ease-in:cubic-bezier(0.4,0,1,1);--blur-sm:8px;--default-transition-duration:150ms;--default-transition-timing-function:cubic-bezier(0.4,0,0.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.collapse{visibility:collapse}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.container{width:100%;@media (width >= 40rem){max-width:40rem}@media (width >= 48rem){max-width:48rem}@media (width >= 64rem){max-width:64rem}@media (width >= 80rem){max-width:80rem}@media (width >= 96rem){max-width:96rem}}.block{display:block}.contents{display:contents}.flex{display:flex}.flow-root{display:flow-root}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-flex{display:inline-flex}.list-item{display:list-item}.table{display:table}.table-cell{display:table-cell}.flex-shrink{flex-shrink:1}.flex-grow{flex-grow:1}.border-collapse{border-collapse:collapse}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.resize{resize:both}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:calc(var(--spacing)*3)}.border{border-style:var(--tw-border-style);border-width:1px}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.underline{text-decoration-line:underline}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-filter{backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function))}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}}:host{all:initial}div{line-height:normal}.utqn{color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px;position:fixed;z-index:21474836}.utqn.dark{color:var(--color-gray-100)}.panel{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-xl);border-style:var(--tw-border-style);border-width:1px;display:flex;flex-direction:column;gap:calc(var(--spacing)*3);max-height:100vh;max-width:360px;overflow-y:auto;padding:calc(var(--spacing)*3);--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1))}.panel,.utqn.dark .panel{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .panel{background-color:var(--color-gray-900);border-color:var(--color-gray-700);--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25))}@keyframes utqn-slide-in-left{0%{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}@keyframes utqn-slide-in-right{0%{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}@keyframes utqn-slide-in-top{0%{opacity:0;transform:translateY(0)}to{opacity:1;transform:translateY(0)}}@keyframes utqn-slide-in-bottom{0%{opacity:0;transform:translateY(0)}to{opacity:1;transform:translateY(0)}}@keyframes utqn-slide-out-left{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-12px)}}@keyframes utqn-slide-out-right{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(12px)}}@keyframes utqn-slide-out-top{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(0)}}@keyframes utqn-slide-out-bottom{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(0)}}.anim-in-left{animation:utqn-slide-in-left .2s ease-out}.anim-in-right{animation:utqn-slide-in-right .2s ease-out}.anim-in-top{animation:utqn-slide-in-top .2s ease-out}.anim-in-bottom{animation:utqn-slide-in-bottom .2s ease-out}.anim-out-left{animation:utqn-slide-out-left .18s ease-in forwards}.anim-out-right{animation:utqn-slide-out-right .18s ease-in forwards}.anim-out-top{animation:utqn-slide-out-top .18s ease-in forwards}.anim-out-bottom{animation:utqn-slide-out-bottom .18s ease-in forwards}.header{gap:calc(var(--spacing)*2);justify-content:space-between}.header,.header-actions{align-items:center;display:flex}.header-actions{gap:calc(var(--spacing)*1.5)}.header-actions .icon-btn{opacity:0;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s}.header-actions .icon-btn.toggle,.section .header:hover .header-actions .icon-btn:not(.toggle){opacity:100%}.section .header{margin-bottom:calc(var(--spacing)*0)}.icon-btn{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .icon-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.utqn.dark .icon img.lucide-icon{filter:invert(1) brightness(1.15) saturate(1.1)}.icon-btn.active{background-color:var(--color-gray-200);color:var(--color-gray-900);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.icon-btn.active,.utqn.dark .icon-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .icon-btn.active{background-color:var(--color-gray-700);color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.title{align-items:center;display:flex;gap:calc(var(--spacing)*1.5);--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-800);font-weight:var(--font-weight-semibold)}.utqn.dark .title{color:var(--color-gray-100)}.btn{align-items:center;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;display:inline-flex;gap:calc(var(--spacing)*1.5);justify-content:center;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2.5);--tw-font-weight:var(--font-weight-medium);color:var(--color-gray-800);font-weight:var(--font-weight-medium);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}&:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-300);--tw-outline-style:none;outline-style:none}&:active{scale:.99}}.utqn.dark .btn{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:focus{--tw-ring-color:var(--color-gray-700)}}.btn-primary{background-color:var(--color-blue-600);border-color:var(--color-blue-600);color:var(--color-white);--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,rgba(0,0,0,.1)),0 2px 4px -2px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);&:hover{@media (hover:hover){border-color:var(--color-blue-700)}}&:hover{@media (hover:hover){background-color:var(--color-blue-700)}}}.modal.dark .btn-primary,.utqn.dark .btn-primary{background-color:var(--color-blue-500);border-color:var(--color-blue-500);color:var(--color-white);&:hover{@media (hover:hover){border-color:var(--color-blue-600)}}&:hover{@media (hover:hover){background-color:var(--color-blue-600)}}}.btn-secondary{background-color:var(--color-gray-100);border-color:var(--color-gray-300);color:var(--color-gray-800);&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}}.modal.dark .btn-secondary,.utqn.dark .btn-secondary{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.items{display:grid;gap:calc(var(--spacing)*1);grid-template-columns:repeat(var(--cols,1),minmax(0,1fr))}.items input[type=checkbox]{flex:none;height:14px;width:14px}.item{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-900);display:inline-flex;gap:calc(var(--spacing)*1.5);min-width:calc(var(--spacing)*0);overflow:hidden;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);text-decoration-line:none;text-overflow:ellipsis;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));white-space:nowrap;--tw-duration:150ms;transition-duration:.15s;width:100%}.item:hover{background-color:var(--color-gray-100)}.utqn.dark .item:hover{background-color:var(--color-gray-800)}.utqn.dark .item{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-100);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.icon{align-items:center;display:inline-flex;flex:none;height:calc(var(--spacing)*4);justify-content:center;overflow:hidden;width:calc(var(--spacing)*4);--tw-leading:1;line-height:1;white-space:nowrap}.collapsed-tab{background-color:var(--color-gray-700);border-radius:0;height:60px;opacity:40%;position:fixed;width:3px;z-index:21474836}.utqn.dark .collapsed-tab{background-color:var(--color-gray-400);opacity:40%}.collapsed-tab:hover{opacity:80%}.modal-mask{align-items:center;background-color:color-mix(in srgb,#000 40%,transparent);display:flex;inset:calc(var(--spacing)*0);justify-content:center;position:fixed;z-index:2147483647;@supports (color:color-mix(in lab,red,red)){background-color:color-mix(in oklab,var(--color-black) 40%,transparent)}}.modal{color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px}.modal h2:not(.section-title){font-size:16px;margin:calc(var(--spacing)*0);margin-bottom:calc(var(--spacing)*2.5)}.row{display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*2);margin-block:calc(var(--spacing)*1.5)}.modal .row{align-items:center}.modal .actions{justify-content:flex-end}.modal .check{align-items:center;display:inline-flex;gap:calc(var(--spacing)*2);height:32px;width:unset}.modal .check input[type=checkbox]{height:14px;width:14px}.segmented{align-items:center;background-color:var(--color-gray-100);border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;display:inline-flex;gap:calc(var(--spacing)*1);padding-block:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*1);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal .segmented{margin-bottom:calc(var(--spacing)*3)}.utqn.dark .segmented{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.seg-item{align-items:center;border-radius:calc(infinity*1px);cursor:pointer;display:inline-flex;-webkit-user-select:none;-moz-user-select:none;user-select:none}.seg-radio{border-width:0;clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.seg-text{border-radius:calc(infinity*1px);color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);text-align:center;width:100%}.utqn.dark .seg-text{color:var(--color-gray-300)}.seg-item .seg-radio:checked+.seg-text{background-color:var(--color-white);color:var(--color-gray-900);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.seg-item .seg-radio:checked+.seg-text,.utqn.dark .seg-item .seg-radio:checked+.seg-text{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .seg-item .seg-radio:checked+.seg-text{background-color:var(--color-gray-700);color:var(--color-gray-100);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.seg-item .seg-radio:focus+.seg-text{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-blue-500)}.field-help{background-color:var(--color-gray-100);border-radius:var(--radius-md);display:block;flex-basis:100%;font-size:12px;margin-left:130px;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);width:100%;--tw-leading:var(--leading-snug);color:var(--color-gray-700);line-height:var(--leading-snug)}.modal.dark .field-help,.utqn.dark .field-help{background-color:var(--color-gray-800);color:var(--color-gray-300)}.field-help-title{align-items:center;display:flex;gap:calc(var(--spacing)*1);margin-bottom:calc(var(--spacing)*1);--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.field-help a{color:var(--color-blue-600);text-decoration-line:underline}.modal.dark .field-help a,.utqn.dark .field-help a{color:var(--color-blue-400);text-decoration-line:underline}input,select,textarea{border-color:var(--color-gray-300);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;flex:1;font-size:13px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}textarea{min-height:80px}.grid{display:grid;gap:calc(var(--spacing)*2);grid-template-columns:repeat(2,minmax(0,1fr))}.group-list{display:flex;flex-wrap:wrap;gap:calc(var(--spacing)*1.5);margin-top:calc(var(--spacing)*1.5)}.group-pill{border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;cursor:pointer;padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.group-pill.active{background-color:var(--color-gray-900);border-color:var(--color-gray-900);color:var(--color-white)}.utqn.dark .group-pill{border-color:var(--color-gray-700);color:var(--color-gray-200);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}}.utqn.dark .group-pill.active{background-color:var(--color-gray-100);border-color:var(--color-gray-100);color:var(--color-gray-900)}.mini{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*.5);padding-inline:calc(var(--spacing)*1.5)}.btn:disabled{cursor:not-allowed;opacity:50%}.divider{background-color:var(--color-gray-200);height:1px}.utqn.dark .divider{background-color:var(--color-gray-700)}.section-title{background-color:var(--color-gray-100);border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));margin-bottom:calc(var(--spacing)*1);margin-top:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);--tw-tracking:var(--tracking-wider);color:var(--color-gray-600);letter-spacing:var(--tracking-wider);text-transform:uppercase}.utqn.dark .section-title{background-color:var(--color-gray-800);color:var(--color-gray-300)}.row label.mini{align-items:center;display:inline-flex;gap:calc(var(--spacing)*2)}.modal{background-color:var(--color-white);border-radius:var(--radius-2xl);max-width:92vw;padding:calc(var(--spacing)*3);width:720px;--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,rgba(0,0,0,.25));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.modal.dark,.utqn.dark .modal{background-color:var(--color-gray-900);color:var(--color-gray-100)}.modal.dark input,.modal.dark select,.modal.dark textarea,.utqn.dark .modal input,.utqn.dark .modal select,.utqn.dark .modal textarea{background-color:var(--color-gray-800);border-color:var(--color-gray-700);color:var(--color-gray-100)}.utqn.dark .modal input::-moz-placeholder,.utqn.dark .modal textarea::-moz-placeholder{color:#9ca3af}.utqn.dark .modal input::placeholder,.utqn.dark .modal textarea::placeholder{color:#9ca3af}.modal.dark input::-moz-placeholder,.modal.dark textarea::-moz-placeholder{color:#9ca3af}.modal.dark input::placeholder,.modal.dark textarea::placeholder{color:#9ca3af}.modal.dark .row label{color:var(--color-gray-400)}.modal.dark .segmented{background-color:var(--color-gray-800);border-color:var(--color-gray-700)}.modal.dark .seg-item .seg-radio:checked+.seg-text{background-color:var(--color-gray-700);color:var(--color-gray-100);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-600)}.modal.dark .seg-text{color:var(--color-gray-300)}.editor{border-radius:var(--radius-2xl);max-height:72vh;overflow-y:auto;padding:calc(var(--spacing)*4)}.editor .grid,.editor .row{gap:calc(var(--spacing)*2)}.editor .row{align-items:center}.editor .row label{color:var(--color-gray-500);width:120px}.utqn.dark .editor .row label{color:var(--color-gray-400)}.editor input,.editor select,.editor textarea{background-color:var(--color-white);border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);&:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:var(--color-gray-300);--tw-outline-style:none;outline-style:none}}.utqn.dark .editor input,.utqn.dark .editor select,.utqn.dark .editor textarea{background-color:var(--color-gray-800);border-color:var(--color-gray-700);&:focus{--tw-ring-color:var(--color-gray-700)}}input:disabled,select:disabled,textarea:disabled{background-color:var(--color-gray-100);cursor:not-allowed;opacity:60%}.dark input:disabled,.dark select:disabled,.dark textarea:disabled{background-color:var(--color-gray-700);cursor:not-allowed;opacity:60%}.editor .item-row{align-items:center;background-color:var(--color-gray-50);border-radius:var(--radius-md);display:grid;gap:8px;grid-template-columns:1.2fr 1.1fr .9fr 2fr 1fr .9fr 1.3fr auto auto;padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2)}.editor .item-row:hover{background-color:var(--color-gray-100)}.utqn.dark .editor .item-row{background-color:var(--color-gray-800)}.utqn.dark .editor .item-row:hover{background-color:var(--color-gray-700)}.editor .btn{border-radius:var(--radius-md);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2)}.row label{color:var(--color-gray-500);width:120px}.utqn.dark .row label{color:var(--color-gray-400)}.panel-actions,.panel-actions-left{align-items:center;display:flex;gap:calc(var(--spacing)*1.5)}.theme-switch{align-items:center;background-color:var(--color-gray-100);border-color:var(--color-gray-200);border-radius:calc(infinity*1px);border-style:var(--tw-border-style);border-width:1px;display:inline-flex;gap:calc(var(--spacing)*1);padding-block:2px;padding-inline:calc(var(--spacing)*1);--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,rgba(0,0,0,.1)),0 1px 2px -1px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .theme-switch{background-color:var(--color-gray-800)}.theme-btn{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .theme-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.theme-btn.active{background-color:var(--color-white);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-300)}.theme-btn.active,.utqn.dark .theme-btn.active{box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .theme-btn.active{background-color:var(--color-gray-700);--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);--tw-ring-color:var(--color-gray-600)}.collapse-btn{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-600);display:flex;height:calc(var(--spacing)*6);justify-content:center;padding:calc(var(--spacing)*0);transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:calc(var(--spacing)*6);--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-200)}}&:hover{@media (hover:hover){color:var(--color-gray-900)}}}.utqn.dark .collapse-btn{color:var(--color-gray-300);&:hover{@media (hover:hover){background-color:var(--color-gray-700)}}&:hover{@media (hover:hover){color:var(--color-white)}}}.item+.icon-btn{justify-self:flex-end}.items{align-items:center;margin-top:calc(var(--spacing)*1.5)}.item-wrap{align-items:center;display:flex;gap:8px;justify-content:space-between}.item-wrap .item{flex:1}.item-wrap .icon-btn{opacity:0;transition:opacity .15s ease-in-out}.item-wrap:hover .icon-btn{opacity:1}.item-wrap:focus-within .icon-btn{opacity:1}.quick-add-menu{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;font-family:var(--font-sans);font-size:13px;min-width:160px;padding:calc(var(--spacing)*1.5);position:fixed;z-index:2147483647;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.utqn.dark .quick-add-menu,.utqn.dark~.quick-add-menu{background-color:var(--color-gray-900);border-color:var(--color-gray-700);color:var(--color-gray-100);--tw-shadow-color:color-mix(in srgb,#000 40%,transparent);@supports (color:color-mix(in lab,red,red)){--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-black) 40%,transparent) var(--tw-shadow-alpha),transparent)}}.quick-add-item{align-items:center;border-radius:var(--radius-md);color:var(--color-gray-900);display:flex;gap:calc(var(--spacing)*1.5);padding-block:calc(var(--spacing)*1.5);padding-inline:calc(var(--spacing)*2);text-align:left;transition-duration:var(--tw-duration,var(--default-transition-duration));transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));width:100%;--tw-duration:150ms;transition-duration:.15s;&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.utqn.dark .quick-add-menu .quick-add-item,.utqn.dark~.quick-add-menu .quick-add-item{color:var(--color-gray-100);&:hover{@media (hover:hover){background-color:var(--color-gray-800)}}}.utqn.dark .quick-add-menu .icon img.lucide-icon,.utqn.dark~.quick-add-menu .icon img.lucide-icon{filter:invert(1) brightness(1.15) saturate(1.1)}.picker-highlight{cursor:pointer!important;outline:2px dashed #ef4444!important;outline-offset:2px!important}.picker-tip{background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,.1);color:#111827;font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;padding:6px 10px;position:fixed;right:12px;top:12px;z-index:2147483647}.utqn.dark .picker-tip,.utqn.dark~.picker-tip{background:#111827;border-color:#374151;color:#f9fafb}.panel.all-mode{height:100vh;max-width:100vw;overflow:hidden;width:100vw}.panel-scroll{height:calc(100% - 36px);overflow-x:auto;width:100%}.panel.all-mode .header{background-color:#fff;position:sticky;top:0;z-index:21474836}.utqn.dark .panel.all-mode .header{background-color:#111827}.panel-columns{-moz-column-gap:12px;column-gap:12px;-moz-column-width:360px;column-width:360px;height:100%}.divider,.section{-moz-column-break-inside:avoid;break-inside:avoid}.check{align-items:center;display:inline-flex;gap:calc(var(--spacing)*2);height:32px}.check input[type=checkbox]{height:14px;width:14px}.item-wrap,.section{transition:opacity .15s ease}@keyframes utqn-fade-in{0%{opacity:.01}to{opacity:1}}.item-wrap.fade-in,.section.fade-in{animation:utqn-fade-in .15s ease both}.section.is-hidden .header{opacity:60%}.section.is-hidden{background-color:var(--color-gray-50);border-radius:var(--radius-lg);outline-color:var(--color-gray-300);outline-style:var(--tw-outline-style);outline-width:1px;--tw-outline-style:dashed;outline-style:dashed}.utqn.dark .section.is-hidden{background-color:var(--color-gray-800);outline-color:var(--color-gray-600)}.item-wrap.is-hidden .item{opacity:60%}.item-wrap.is-hidden{border-radius:var(--radius-md);outline-color:var(--color-gray-300);outline-style:var(--tw-outline-style);outline-width:1px;--tw-outline-style:dashed;outline-style:dashed}.utqn.dark .item-wrap.is-hidden{outline-color:var(--color-gray-600)}.empty-msg{color:var(--color-gray-500);font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height));padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2)}.utqn.dark .empty-msg{color:var(--color-gray-400)}.segmented label.seg-item{min-width:50px;width:unset}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-leading{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-font-weight:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-ease:initial;--tw-duration:initial;--tw-leading:initial;--tw-tracking:initial}}'
  function ensurePickerStylesIn(r) {
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
      icon: void 0,
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
          icon: void 0,
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
    tip.className = 'utqn-picker-tip'
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
    const panelEl = root.querySelector('.utqn')
    const prevPanelDisplay =
      panelEl instanceof HTMLElement ? panelEl.style.display || '' : ''
    if (panelEl instanceof HTMLElement) panelEl.style.display = 'none'
    const cleanup = () => {
      for (const a of anchors) a.classList.remove('utqn-picker-highlight')
      try {
        tip.remove()
      } catch (e) {}
      if (panelEl instanceof HTMLElement)
        panelEl.style.display = prevPanelDisplay
      try {
        const ov = document.querySelector('#utqn-picker-overlay')
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
  function createSegmentedRadios(initial, values, onChange, opts) {
    var _a, _b
    const wrap = document.createElement('div')
    wrap.className = 'segmented'
    const name =
      ((opts == null ? void 0 : opts.namePrefix) || 'utqn-seg-') + uid()
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
    return createSegmentedRadios(initial, ['same-tab', 'new-tab'], onChange, {
      labels,
      namePrefix: 'utqn-open-',
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
  function openAddLinkModal(root, cfg, helpers) {
    var _a, _b, _c
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
    h2.textContent = helpers.existingItem
      ? '\u7F16\u8F91\u94FE\u63A5'
      : '\u6DFB\u52A0\u94FE\u63A5'
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
    if (helpers.existingItem) {
      try {
        const gid = helpers.defaultGroupId || defaultGroup
        grpSel.value = gid
        grpSel.disabled = true
      } catch (e) {}
    }
    grpRow.append(grpLabel)
    grpRow.append(grpSel)
    const nameRow = document.createElement('div')
    nameRow.className = 'row'
    const nameLabel = document.createElement('label')
    nameLabel.textContent = '\u540D\u79F0'
    const nameInput = document.createElement('input')
    nameInput.value = helpers.existingItem
      ? String(helpers.existingItem.name || '\u65B0\u9879')
      : '\u65B0\u9879'
    nameRow.append(nameLabel)
    nameRow.append(nameInput)
    const iconRow = document.createElement('div')
    iconRow.className = 'row'
    const iconLabel = document.createElement('label')
    iconLabel.textContent = '\u56FE\u6807'
    const existingIcon = helpers.existingItem
      ? String(helpers.existingItem.icon || '')
      : ''
    const iconComp = createIconInput(
      existingIcon,
      ['icon', 'favicon', 'url', 'emoji'],
      {
        labels: {
          icon: '\u56FE\u6807',
          favicon: 'Favicon',
          url: 'URL',
          emoji: 'Emoji',
        },
        namePrefix: 'utqn-item-icon-kind-',
      }
    )
    iconRow.append(iconLabel)
    iconRow.append(iconComp.el)
    const urlRow = document.createElement('div')
    urlRow.className = 'row'
    const urlLabel = document.createElement('label')
    urlLabel.textContent = 'URL'
    const urlInput = document.createElement('input')
    urlInput.placeholder = 'https://...'
    urlInput.value = helpers.existingItem
      ? String(helpers.existingItem.data || '/')
      : '/'
    urlRow.append(urlLabel)
    urlRow.append(urlInput)
    const urlHelpRow = document.createElement('div')
    urlHelpRow.className = 'row'
    const urlHelp = document.createElement('div')
    urlHelp.className = 'field-help'
    const uTitle = document.createElement('div')
    uTitle.className = 'field-help-title'
    uTitle.textContent = '\u{1F517} URL \u53D8\u91CF\u4E0E\u793A\u4F8B'
    const uLine1 = document.createElement('div')
    uLine1.textContent =
      '\u53D8\u91CF\uFF1A{hostname}\u3001{hostname_without_www}\u3001{query}\u3001{selected}'
    const uLine2 = document.createElement('div')
    uLine2.textContent =
      '\u793A\u4F8B\uFF1Ahttp://example.com/search?query={selected||query}'
    const uLine3 = document.createElement('div')
    const uLink = document.createElement('a')
    uLink.href = 'https://github.com/utags/userscripts'
    uLink.target = '_blank'
    uLink.rel = 'noopener noreferrer'
    uLink.textContent = 'https://github.com/utags/userscripts'
    uLine3.append('\u66F4\u591A\u4F7F\u7528\u8BF4\u660E\u53C2\u8003 ')
    uLine3.append(uLink)
    urlHelp.append(uTitle)
    urlHelp.append(uLine1)
    urlHelp.append(uLine2)
    urlHelp.append(uLine3)
    urlHelpRow.append(urlHelp)
    const jsRow = document.createElement('div')
    jsRow.className = 'row'
    const jsLabel = document.createElement('label')
    jsLabel.textContent = 'JS'
    const jsInput = document.createElement('textarea')
    jsInput.placeholder =
      'console.log("hello")\n// \u6216\u8005\u7C98\u8D34\u811A\u672C\u5185\u5BB9'
    jsInput.value =
      helpers.existingItem && helpers.existingItem.type === 'js'
        ? String(helpers.existingItem.data || '')
        : ''
    jsRow.append(jsLabel)
    jsRow.append(jsInput)
    const jsHelpRow = document.createElement('div')
    jsHelpRow.className = 'row'
    const jsHelp = document.createElement('div')
    jsHelp.className = 'field-help'
    const jTitle = document.createElement('div')
    jTitle.className = 'field-help-title'
    jTitle.textContent = '\u{1F9E9} JS \u8FD4\u56DE\u4E0E\u793A\u4F8B'
    const jLine1 = document.createElement('div')
    jLine1.textContent =
      'JS\uFF1A\u8FD4\u56DE\u5B57\u7B26\u4E32\u6216 {url, mode} \u5BFC\u822A'
    const jLine2 = document.createElement('div')
    jLine2.textContent =
      '\u793A\u4F8B\uFF1Areturn "http://example.com/search?query={selected||query}"'
    const jLine3 = document.createElement('div')
    jLine3.textContent =
      '\u793A\u4F8B\uFF1Areturn { url: "http://example.com/?q={query}", mode: "new-tab" }'
    const jLine4 = document.createElement('div')
    const jLink = document.createElement('a')
    jLink.href = 'https://github.com/utags/userscripts'
    jLink.target = '_blank'
    jLink.rel = 'noopener noreferrer'
    jLink.textContent = 'https://github.com/utags/userscripts'
    jLine4.append('\u66F4\u591A\u4F7F\u7528\u8BF4\u660E\u53C2\u8003 ')
    jLine4.append(jLink)
    jsHelp.append(jTitle)
    jsHelp.append(jLine1)
    jsHelp.append(jLine2)
    jsHelp.append(jLine3)
    jsHelp.append(jLine4)
    jsHelpRow.append(jsHelp)
    const typeRow = document.createElement('div')
    typeRow.className = 'row'
    const typeLabel = document.createElement('label')
    typeLabel.textContent = '\u7C7B\u578B'
    let typeValue =
      ((_a = helpers.existingItem) == null ? void 0 : _a.type) || 'url'
    const quickRef = { el: void 0 }
    const typeRadios = createSegmentedRadios(
      typeValue,
      ['url', 'js'],
      (v) => {
        typeValue = v
        syncTypeUi()
      },
      { labels: { url: 'URL', js: 'JS' }, namePrefix: 'utqn-item-type-' }
    )
    const syncTypeUi = () => {
      if (typeValue === 'url') {
        urlRow.style.display = ''
        jsRow.style.display = 'none'
        if (quickRef.el) quickRef.el.style.display = ''
        urlHelpRow.style.display = ''
        jsHelpRow.style.display = 'none'
      } else {
        urlRow.style.display = 'none'
        jsRow.style.display = ''
        if (quickRef.el) quickRef.el.style.display = 'none'
        urlHelpRow.style.display = 'none'
        jsHelpRow.style.display = ''
      }
    }
    typeRow.append(typeLabel)
    typeRow.append(typeRadios)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u6253\u5F00\u65B9\u5F0F'
    let openValue =
      ((_b = helpers.existingItem) == null ? void 0 : _b.openIn) ||
      helpers.defaultOpen ||
      'same-tab'
    const openRadios = createOpenModeRadios(openValue, (m) => {
      openValue = m
    })
    openRow.append(openLabel)
    openRow.append(openRadios)
    const visibleRow = document.createElement('div')
    visibleRow.className = 'row'
    const visibleLabel = document.createElement('label')
    visibleLabel.textContent = '\u663E\u793A\u72B6\u6001'
    let itemState = ((_c = helpers.existingItem) == null ? void 0 : _c.hidden)
      ? 'hidden'
      : 'visible'
    const stateRadios = createSegmentedRadios(
      itemState,
      ['visible', 'hidden'],
      (v) => {
        itemState = v
      },
      {
        labels: { visible: '\u663E\u793A', hidden: '\u9690\u85CF' },
        namePrefix: 'utqn-item-state-',
      }
    )
    visibleRow.append(visibleLabel)
    visibleRow.append(stateRadios)
    const quickRow = document.createElement('div')
    quickRef.el = quickRow
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
    syncTypeUi()
    addCurrentBtn.addEventListener('click', () => {
      try {
        nameInput.value = document.title || '\u5F53\u524D\u7F51\u9875'
        urlInput.value = location.href
      } catch (e) {}
    })
    pickLinksBtn.addEventListener('click', () => {
      try {
        pickLinkFromPage(root, {
          beforeStart() {
            modal.style.display = 'none'
            mask.remove()
          },
          afterFinish() {
            modal.style.display = ''
            root.append(mask)
          },
          onPicked(nm, href) {
            nameInput.value = nm
            urlInput.value = href
          },
        })
      } catch (e) {}
    })
    const actions = document.createElement('div')
    actions.className = 'row actions'
    const saveBtn = document.createElement('button')
    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = helpers.existingItem ? '\u786E\u8BA4' : '\u6DFB\u52A0'
    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'btn btn-secondary'
    cancelBtn.textContent = '\u53D6\u6D88'
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn btn-secondary'
    deleteBtn.textContent = '\u5220\u9664'
    const isEditableTarget2 = (t) => {
      const el = t
      if (!el) return false
      const tag = el.tagName ? el.tagName.toLowerCase() : ''
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
      const ce = el.isContentEditable
      return Boolean(ce)
    }
    const close = () => {
      try {
        mask.remove()
      } catch (e) {}
      try {
        document.removeEventListener('keydown', onKey, true)
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
      if (e.key === 'Enter') {
        const ae = root.activeElement
        const inModal = ae ? Boolean(modal.contains(ae)) : false
        if (!inModal) return
        const tag = (ae == null ? void 0 : ae.tagName)
          ? ae.tagName.toLowerCase()
          : ''
        if (tag === 'textarea' || tag === 'button') return
        e.preventDefault()
        saveBtn.click()
      }
    }
    document.addEventListener('keydown', onKey, true)
    saveBtn.addEventListener('click', () => {
      var _a2
      const gid = grpSel.value
      const grp = (cfg.groups || []).find((g) => g.id === gid)
      if (!grp) return
      const finalIcon = iconComp.getFinal()
      const hiddenVal = itemState === 'hidden'
      const proposedData =
        typeValue === 'url' ? urlInput.value.trim() || '/' : jsInput.value
      const hasDup = hasDuplicateInGroup(
        grp,
        typeValue,
        proposedData,
        (_a2 = helpers.existingItem) == null ? void 0 : _a2.id
      )
      if (hasDup) {
        const msg =
          typeValue === 'url'
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
        it.name = nameInput.value.trim() || '\u65B0\u9879'
        it.icon = finalIcon
        it.type = typeValue
        it.data = proposedData
        it.openIn = openValue
        it.hidden = hiddenVal
      } else {
        const it = {
          id: uid(),
          name: nameInput.value.trim() || '\u65B0\u9879',
          icon: finalIcon,
          type: typeValue,
          data: proposedData,
          openIn: openValue,
          hidden: hiddenVal ? true : void 0,
        }
        grp.items.push(it)
      }
      try {
        helpers.saveConfig(cfg)
      } catch (e) {}
      try {
        helpers.rerender(root, cfg)
      } catch (e) {}
      close()
    })
    deleteBtn.addEventListener('click', () => {
      if (!helpers.existingItem) return
      const ok = globalThis.confirm(
        '\u662F\u5426\u5220\u9664\u6B64\u94FE\u63A5\uFF1F'
      )
      if (!ok) return
      const gid = grpSel.value
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
        try {
          helpers.rerender(root, cfg)
        } catch (e) {}
        close()
      }
    })
    cancelBtn.addEventListener('click', () => {
      close()
    })
    actions.append(saveBtn)
    actions.append(cancelBtn)
    grid.append(grpRow)
    grid.append(nameRow)
    grid.append(iconRow)
    grid.append(typeRow)
    grid.append(urlRow)
    grid.append(urlHelpRow)
    grid.append(jsRow)
    grid.append(jsHelpRow)
    grid.append(openRow)
    grid.append(visibleRow)
    grid.append(quickRow)
    modal.append(h2)
    modal.append(grid)
    modal.append(actions)
    mask.append(modal)
    root.append(mask)
    if (helpers.existingItem) {
      actions.append(deleteBtn)
    }
    syncTypeUi()
  }
  function openAddGroupModal(root, cfg, helpers) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m
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
      const prefersDark = (() => {
        var _a2, _b2
        try {
          return (_b2 =
            (_a2 = globalThis.matchMedia) == null
              ? void 0
              : _a2.call(globalThis, '(prefers-color-scheme: dark)')) == null
            ? void 0
            : _b2.matches
        } catch (e) {
          return false
        }
      })()
      if (isDarkPanel || prefersDark) modal.classList.add('dark')
    } catch (e) {}
    const h2 = document.createElement('h2')
    h2.textContent = helpers.existingGroup
      ? '\u7F16\u8F91\u5206\u7EC4'
      : '\u6DFB\u52A0\u5206\u7EC4'
    const grid = document.createElement('div')
    grid.className = 'grid'
    try {
      grid.style.gridTemplateColumns = '1fr'
    } catch (e) {}
    const nameRow = document.createElement('div')
    nameRow.className = 'row'
    const nameLabel = document.createElement('label')
    nameLabel.textContent = '\u7EC4\u540D'
    const nameInput = document.createElement('input')
    nameInput.value =
      (_b = (_a = helpers.existingGroup) == null ? void 0 : _a.name) != null
        ? _b
        : '\u65B0\u5206\u7EC4'
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
      typeof ((_c = helpers.existingGroup) == null
        ? void 0
        : _c.displayName) === 'string' &&
      helpers.existingGroup.displayName !== helpers.existingGroup.name
    displayToggle.checked = Boolean(hasCustomDisplay)
    displayInput.value = hasCustomDisplay
      ? ((_d = helpers.existingGroup) == null ? void 0 : _d.displayName) || ''
      : ((_e = helpers.existingGroup) == null ? void 0 : _e.name) ||
        nameInput.value
    displayInput.disabled = !displayToggle.checked
    nameInput.addEventListener('input', () => {
      if (!displayToggle.checked) displayInput.value = nameInput.value
    })
    displayToggle.addEventListener('change', () => {
      displayInput.disabled = !displayToggle.checked
      if (!displayToggle.checked) displayInput.value = nameInput.value
    })
    displayRow.append(displayLabel)
    displayRow.append(displayInput)
    displayRow.append(displayCtrl)
    const iconRow = document.createElement('div')
    iconRow.className = 'row'
    const iconLabel = document.createElement('label')
    iconLabel.textContent = '\u56FE\u6807'
    const iconComp = createIconInput(
      (_g = (_f = helpers.existingGroup) == null ? void 0 : _f.icon) != null
        ? _g
        : 'lucide:folder',
      ['icon', 'url', 'emoji'],
      {
        labels: { icon: '\u56FE\u6807', url: 'URL', emoji: 'Emoji' },
        namePrefix: 'utqn-group-icon-kind-',
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
    ta.value = (
      (_i = (_h = helpers.existingGroup) == null ? void 0 : _h.match) != null
        ? _i
        : helpers.defaultMatch && helpers.defaultMatch.length > 0
          ? helpers.defaultMatch
          : ['*://' + host + '/*']
    ).join('\n')
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
    })
    tplRow.append(tplLabel)
    tplRow.append(tplSel)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F'
    let openValue =
      ((_j = helpers.existingGroup) == null ? void 0 : _j.defaultOpen) ||
      helpers.defaultOpen ||
      'same-tab'
    const openRadios = createOpenModeRadios(openValue, (m) => {
      openValue = m
    })
    openRow.append(openLabel)
    openRow.append(openRadios)
    const colsRow = document.createElement('div')
    colsRow.className = 'row'
    const colsLabel = document.createElement('label')
    colsLabel.textContent = '\u6BCF\u884C\u663E\u793A\u4E2A\u6570'
    let colVal = String(
      (_l = (_k = helpers.existingGroup) == null ? void 0 : _k.itemsPerRow) !=
        null
        ? _l
        : 1
    )
    const colsRadios = createSegmentedRadios(
      colVal,
      ['1', '2', '3', '4', '5', '6'],
      (v) => {
        colVal = v
      },
      { namePrefix: 'utqn-cols-' }
    )
    colsRow.append(colsLabel)
    colsRow.append(colsRadios)
    const stateRow = document.createElement('div')
    stateRow.className = 'row'
    const stateLabel = document.createElement('label')
    stateLabel.textContent = '\u5206\u7EC4\u663E\u793A\u72B6\u6001'
    let groupState = ((_m = helpers.existingGroup) == null ? void 0 : _m.hidden)
      ? 'hidden'
      : 'visible'
    const stateRadios = createSegmentedRadios(
      groupState,
      ['visible', 'hidden'],
      (v) => {
        groupState = v
      },
      {
        labels: { visible: '\u663E\u793A', hidden: '\u9690\u85CF' },
        namePrefix: 'utqn-state-',
      }
    )
    stateRow.append(stateLabel)
    stateRow.append(stateRadios)
    const actions = document.createElement('div')
    actions.className = 'row actions'
    const saveBtn = document.createElement('button')
    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = helpers.existingGroup
      ? '\u786E\u8BA4'
      : '\u6DFB\u52A0'
    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'btn btn-secondary'
    cancelBtn.textContent = '\u53D6\u6D88'
    const isEditableTarget2 = (t) => {
      const el = t
      if (!el) return false
      const tag = el.tagName ? el.tagName.toLowerCase() : ''
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
      const ce = el.isContentEditable
      return Boolean(ce)
    }
    const close = () => {
      try {
        mask.remove()
      } catch (e) {}
      try {
        document.removeEventListener('keydown', onKey, true)
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
      if (e.key === 'Enter') {
        const ae = root.activeElement
        const inModal = ae ? Boolean(modal.contains(ae)) : false
        if (!inModal) return
        const tag = (ae == null ? void 0 : ae.tagName)
          ? ae.tagName.toLowerCase()
          : ''
        if (tag === 'textarea' || tag === 'button') return
        e.preventDefault()
        saveBtn.click()
      }
    }
    document.addEventListener('keydown', onKey, true)
    saveBtn.addEventListener('click', () => {
      const nm = nameInput.value.trim()
      if (!nm) {
        try {
          nameInput.focus()
        } catch (e) {}
        return
      }
      const toMatch = ta.value
        .split(/\n+/)
        .map((v) => v.trim())
        .filter(Boolean)
      const toCols = Math.max(1, Math.min(6, Number.parseInt(colVal, 10)))
      const toHidden = helpers.existingGroup ? groupState === 'hidden' : false
      if (helpers.existingGroup) {
        const g = helpers.existingGroup
        g.name = nm
        g.icon = iconComp.getFinal() || g.icon || 'lucide:folder'
        g.match = toMatch
        g.defaultOpen = openValue
        g.itemsPerRow = toCols
        g.hidden = Boolean(toHidden)
        if (displayToggle.checked) {
          g.displayName = displayInput.value
        } else {
          try {
            delete g.displayName
          } catch (e) {}
        }
      } else {
        const g = {
          id: uid(),
          name: nm,
          icon: iconComp.getFinal() || 'lucide:folder',
          match: toMatch,
          items: [],
          defaultOpen: openValue,
          itemsPerRow: toCols,
          hidden: Boolean(toHidden),
        }
        if (displayToggle.checked) {
          g.displayName = displayInput.value
        }
        cfg.groups.push(g)
      }
      try {
        helpers.saveConfig(cfg)
      } catch (e) {}
      try {
        helpers.rerender(root, cfg)
      } catch (e) {}
      close()
    })
    cancelBtn.addEventListener('click', () => {
      close()
    })
    actions.append(saveBtn)
    actions.append(cancelBtn)
    grid.append(nameRow)
    grid.append(displayRow)
    grid.append(iconRow)
    grid.append(tplRow)
    grid.append(ruleRow)
    grid.append(openRow)
    grid.append(colsRow)
    if (helpers.existingGroup) grid.append(stateRow)
    modal.append(h2)
    modal.append(grid)
    modal.append(actions)
    mask.append(modal)
    root.append(mask)
  }
  function showDropdownMenu(root, anchor, items, rightSide) {
    for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
      n.remove()
    const menu = document.createElement('div')
    menu.className = 'quick-add-menu'
    menu.setAttribute('role', 'menu')
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
          for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
            n.remove()
        }
      })
      menu.append(btn)
    }
    const r = anchor.getBoundingClientRect()
    menu.style.position = 'fixed'
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
    root.append(menu)
    setTimeout(() => {
      const onOutside = () => {
        for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
          n.remove()
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
  function createSettingsPanel(root, cfg, helpers) {
    var _a, _b, _c
    const wrap = document.createElement('div')
    const globalHeader = document.createElement('h2')
    globalHeader.className = 'section-title'
    globalHeader.textContent = '\u5168\u5C40\u8BBE\u7F6E'
    const globalGrid = document.createElement('div')
    globalGrid.className = 'grid'
    try {
      globalGrid.style.gridTemplateColumns = '1fr'
    } catch (e) {}
    const siteHeader = document.createElement('h2')
    siteHeader.className = 'section-title'
    siteHeader.textContent = '\u7AD9\u70B9\u8BBE\u7F6E'
    const siteGrid = document.createElement('div')
    siteGrid.className = 'grid'
    try {
      siteGrid.style.gridTemplateColumns = '1fr'
    } catch (e) {}
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
      if (helpers.sitePref.position === p) o.selected = true
      posSel.append(o)
    }
    posSel.addEventListener('change', () => {
      helpers.sitePref.position = posSel.value
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    })
    posRow.append(posLabel)
    posRow.append(posSel)
    const openRow = document.createElement('div')
    openRow.className = 'row'
    const openLabel = document.createElement('label')
    openLabel.textContent = '\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F'
    let siteOpen = helpers.sitePref.defaultOpen
    const openRadios1 = createOpenModeRadios(siteOpen, (m) => {
      siteOpen = m
      helpers.sitePref.defaultOpen = m
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    })
    openRow.append(openLabel)
    openRow.append(openRadios1)
    const themeRow = document.createElement('div')
    themeRow.className = 'row'
    const themeLabel = document.createElement('label')
    themeLabel.textContent = '\u4E3B\u9898'
    const themeRadios = createSegmentedRadios(
      helpers.sitePref.theme || 'system',
      ['system', 'light', 'dark'],
      (val) => {
        helpers.sitePref.theme = val
        helpers.saveConfig(cfg)
        helpers.updateThemeUI(root, cfg)
      },
      {
        labels: {
          system: '\u7CFB\u7EDF',
          light: '\u6D45\u8272',
          dark: '\u6DF1\u8272',
        },
        namePrefix: 'utqn-theme-',
      }
    )
    themeRow.append(themeLabel)
    themeRow.append(themeRadios)
    const hotkeyRow = document.createElement('div')
    hotkeyRow.className = 'row'
    const hotkeyLabel = document.createElement('label')
    hotkeyLabel.textContent = '\u5FEB\u6377\u952E'
    const hotkeyInput = document.createElement('input')
    hotkeyInput.placeholder = 'Alt+Shift+K'
    hotkeyInput.value = String(cfg.global.hotkey || 'Alt+Shift+K')
    hotkeyInput.addEventListener('change', () => {
      const v = hotkeyInput.value.trim()
      cfg.global.hotkey = v
      helpers.saveConfig(cfg)
    })
    hotkeyRow.append(hotkeyLabel)
    hotkeyRow.append(hotkeyInput)
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
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        }
      } catch (e) {}
    })
    syncInput.addEventListener('change', () => {
      cfg.global.syncUrl = syncInput.value.trim() || void 0
      helpers.saveConfig(cfg)
    })
    syncRow.append(syncLabel)
    syncRow.append(syncInput)
    syncRow.append(syncBtn)
    const widthRow = document.createElement('div')
    widthRow.className = 'row'
    const widthLabel = document.createElement('label')
    widthLabel.textContent = '\u7AD6\u7EBF\u5BBD\u5EA6'
    const widthInput = document.createElement('input')
    widthInput.type = 'number'
    widthInput.min = '1'
    widthInput.max = '24'
    widthInput.value = String(
      (_a = helpers.sitePref.edgeWidth) != null
        ? _a
        : helpers.edgeDefaults.width
    )
    const widthHelp = document.createElement('div')
    widthHelp.className = 'field-help'
    widthHelp.textContent = '\u5355\u4F4D\uFF1Apx\uFF0C\u8303\u56F4 1\u201324'
    widthRow.append(widthLabel)
    widthRow.append(widthInput)
    widthRow.append(widthHelp)
    const heightRow = document.createElement('div')
    heightRow.className = 'row'
    const heightLabel = document.createElement('label')
    heightLabel.textContent = '\u7AD6\u7EBF\u9AD8\u5EA6'
    const heightInput = document.createElement('input')
    heightInput.type = 'number'
    heightInput.min = '24'
    heightInput.max = '320'
    heightInput.value = String(
      (_b = helpers.sitePref.edgeHeight) != null
        ? _b
        : helpers.edgeDefaults.height
    )
    const heightHelp = document.createElement('div')
    heightHelp.className = 'field-help'
    heightHelp.textContent =
      '\u5355\u4F4D\uFF1Apx\uFF0C\u8303\u56F4 24\u2013320'
    heightRow.append(heightLabel)
    heightRow.append(heightInput)
    heightRow.append(heightHelp)
    const opacityRow = document.createElement('div')
    opacityRow.className = 'row'
    const opacityLabel = document.createElement('label')
    opacityLabel.textContent = '\u4E0D\u900F\u660E\u5EA6'
    const opacityInput = document.createElement('input')
    opacityInput.type = 'number'
    opacityInput.min = '0'
    opacityInput.max = '1'
    opacityInput.step = '0.05'
    opacityInput.value = String(
      (_c = helpers.sitePref.edgeOpacity) != null
        ? _c
        : helpers.edgeDefaults.opacity
    )
    const opacityHelp = document.createElement('div')
    opacityHelp.className = 'field-help'
    opacityHelp.textContent = '\u8303\u56F4 0\u20131\uFF0C\u6B65\u957F 0.05'
    opacityRow.append(opacityLabel)
    opacityRow.append(opacityInput)
    opacityRow.append(opacityHelp)
    const lightColorRow = document.createElement('div')
    lightColorRow.className = 'row'
    const lightColorLabel = document.createElement('label')
    lightColorLabel.textContent = '\u6D45\u8272\u4E3B\u9898\u989C\u8272'
    const lightColorInput = document.createElement('input')
    lightColorInput.type = 'color'
    lightColorInput.value = String(
      helpers.sitePref.edgeColorLight || helpers.edgeDefaults.colorLight
    )
    const lightColorHelp = document.createElement('div')
    lightColorHelp.className = 'field-help'
    lightColorHelp.textContent = '\u7528\u4E8E\u6D45\u8272\u4E3B\u9898'
    lightColorRow.append(lightColorLabel)
    lightColorRow.append(lightColorInput)
    lightColorRow.append(lightColorHelp)
    const darkColorRow = document.createElement('div')
    darkColorRow.className = 'row'
    const darkColorLabel = document.createElement('label')
    darkColorLabel.textContent = '\u6DF1\u8272\u4E3B\u9898\u989C\u8272'
    const darkColorInput = document.createElement('input')
    darkColorInput.type = 'color'
    darkColorInput.value = String(
      helpers.sitePref.edgeColorDark || helpers.edgeDefaults.colorDark
    )
    const darkColorHelp = document.createElement('div')
    darkColorHelp.className = 'field-help'
    darkColorHelp.textContent = '\u7528\u4E8E\u6DF1\u8272\u4E3B\u9898'
    darkColorRow.append(darkColorLabel)
    darkColorRow.append(darkColorInput)
    darkColorRow.append(darkColorHelp)
    widthInput.addEventListener('change', () => {
      const v = Math.max(1, Math.min(24, Number.parseInt(widthInput.value, 10)))
      helpers.sitePref.edgeWidth = v
      helpers.saveConfig(cfg)
      if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
        helpers.rerender(root, cfg)
    })
    heightInput.addEventListener('change', () => {
      const v = Math.max(
        24,
        Math.min(320, Number.parseInt(heightInput.value, 10))
      )
      helpers.sitePref.edgeHeight = v
      helpers.saveConfig(cfg)
      if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
        helpers.rerender(root, cfg)
    })
    opacityInput.addEventListener('change', () => {
      const v = Math.max(0, Math.min(1, Number.parseFloat(opacityInput.value)))
      helpers.sitePref.edgeOpacity = v
      helpers.saveConfig(cfg)
      if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
        helpers.rerender(root, cfg)
    })
    lightColorInput.addEventListener('change', () => {
      helpers.sitePref.edgeColorLight = lightColorInput.value
      helpers.saveConfig(cfg)
      if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
        helpers.rerender(root, cfg)
    })
    darkColorInput.addEventListener('change', () => {
      helpers.sitePref.edgeColorDark = darkColorInput.value
      helpers.saveConfig(cfg)
      if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
        helpers.rerender(root, cfg)
    })
    const resetRow = document.createElement('div')
    resetRow.className = 'row'
    const resetLabel = document.createElement('label')
    resetLabel.textContent = '\u7AD6\u7EBF\u5916\u89C2'
    const edgeReset = document.createElement('button')
    edgeReset.className = 'btn mini'
    edgeReset.textContent = '\u91CD\u7F6E\u9ED8\u8BA4'
    edgeReset.addEventListener('click', () => {
      helpers.sitePref.edgeWidth = helpers.edgeDefaults.width
      helpers.sitePref.edgeHeight = helpers.edgeDefaults.height
      helpers.sitePref.edgeOpacity = helpers.edgeDefaults.opacity
      helpers.sitePref.edgeColorLight = helpers.edgeDefaults.colorLight
      helpers.sitePref.edgeColorDark = helpers.edgeDefaults.colorDark
      widthInput.value = String(helpers.edgeDefaults.width)
      heightInput.value = String(helpers.edgeDefaults.height)
      opacityInput.value = String(helpers.edgeDefaults.opacity)
      lightColorInput.value = helpers.edgeDefaults.colorLight
      darkColorInput.value = helpers.edgeDefaults.colorDark
      helpers.saveConfig(cfg)
      if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
        helpers.rerender(root, cfg)
    })
    resetRow.append(resetLabel)
    resetRow.append(edgeReset)
    const panelCtrlRow = document.createElement('div')
    panelCtrlRow.className = 'row'
    const panelCtrlLabel = document.createElement('label')
    panelCtrlLabel.textContent = '\u9762\u677F\u63A7\u5236'
    const pinnedRadios = createSegmentedRadios(
      helpers.sitePref.pinned ? 'true' : 'false',
      ['true', 'false'],
      (val) => {
        helpers.sitePref.pinned = val === 'true'
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
      },
      {
        labels: { true: '\u56FA\u5B9A', false: '\u53D6\u6D88\u56FA\u5B9A' },
        namePrefix: 'utqn-pinned-',
      }
    )
    const hideEdgeWrap = document.createElement('label')
    hideEdgeWrap.className = 'mini'
    const hideEdgeChk = document.createElement('input')
    hideEdgeChk.type = 'checkbox'
    hideEdgeChk.checked = Boolean(helpers.sitePref.edgeHidden)
    const hideEdgeText = document.createElement('span')
    hideEdgeText.textContent = '\u9690\u85CF\u7AD6\u7EBF'
    hideEdgeWrap.append(hideEdgeChk)
    hideEdgeWrap.append(hideEdgeText)
    hideEdgeChk.addEventListener('change', () => {
      helpers.sitePref.edgeHidden = hideEdgeChk.checked
      helpers.saveConfig(cfg)
      if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
        helpers.rerender(root, cfg)
    })
    panelCtrlRow.append(panelCtrlLabel)
    panelCtrlRow.append(pinnedRadios)
    panelCtrlRow.append(hideEdgeWrap)
    const exportBtn = document.createElement('button')
    exportBtn.className = 'btn btn-secondary'
    exportBtn.textContent = '\u5BFC\u51FA\u914D\u7F6E'
    exportBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
      } catch (e) {}
    })
    globalGrid.append(hotkeyRow)
    globalGrid.append(syncRow)
    const ioRow = document.createElement('div')
    ioRow.className = 'row'
    const ioLabel = document.createElement('label')
    ioLabel.textContent = '\u6570\u636E\u5BFC\u5165\u4E0E\u5BFC\u51FA'
    const exportJsonBtn = document.createElement('button')
    exportJsonBtn.className = 'btn btn-secondary'
    exportJsonBtn.textContent = '\u5BFC\u51FA JSON \u6587\u4EF6'
    exportJsonBtn.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(cfg, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'utags-quick-nav-config.json'
      a.click()
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1e3)
    })
    const importJsonBtn = document.createElement('button')
    importJsonBtn.className = 'btn btn-secondary'
    importJsonBtn.textContent = '\u4ECE JSON \u6587\u4EF6\u5BFC\u5165'
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'application/json'
    fileInput.style.display = 'none'
    importJsonBtn.addEventListener('click', () => {
      fileInput.click()
    })
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files && fileInput.files[0]
      if (!f) return
      try {
        const text = await f.text()
        const obj = JSON.parse(text)
        if (obj && obj.global && obj.groups) {
          cfg.global = obj.global
          cfg.groups = obj.groups
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        }
      } catch (e) {}
    })
    ioRow.append(ioLabel)
    ioRow.append(exportJsonBtn)
    ioRow.append(importJsonBtn)
    ioRow.append(fileInput)
    const ioHelp = document.createElement('div')
    ioHelp.className = 'field-help'
    ioHelp.textContent =
      '\u5305\u542B\u5168\u5C40\u8BBE\u7F6E\u3001\u5206\u7EC4\u914D\u7F6E\u4E0E\u5BFC\u822A\u9879\u6570\u636E'
    ioRow.append(ioHelp)
    globalGrid.append(ioRow)
    siteGrid.append(posRow)
    siteGrid.append(openRow)
    siteGrid.append(themeRow)
    siteGrid.append(widthRow)
    siteGrid.append(heightRow)
    siteGrid.append(opacityRow)
    siteGrid.append(lightColorRow)
    siteGrid.append(darkColorRow)
    siteGrid.append(resetRow)
    siteGrid.append(panelCtrlRow)
    wrap.append(globalHeader)
    wrap.append(globalGrid)
    wrap.append(siteHeader)
    wrap.append(siteGrid)
    return wrap
  }
  function createGroupManagerPanel(root, cfg, helpers) {
    const wrap = document.createElement('div')
    const grpHeader = document.createElement('h2')
    grpHeader.className = 'section-title'
    grpHeader.textContent = '\u5206\u7EC4'
    const grpList = document.createElement('div')
    grpList.className = 'group-list'
    let active = (cfg.groups || [])[0]
    function rebuildGroupPills() {
      clearChildren(grpList)
      for (const g of cfg.groups || []) {
        const pill = document.createElement('button')
        pill.className = 'group-pill' + (g.id === active.id ? ' active' : '')
        pill.textContent = g.displayName || g.name
        pill.dataset.gid = g.id
        grpList.append(pill)
      }
    }
    grpList.addEventListener('click', (ev) => {
      var _a
      const target = ev.target
      const btn = target.closest('.group-pill')
      if (!btn) return
      const pill = btn
      const gid = ((_a = pill.dataset) == null ? void 0 : _a.gid) || ''
      const next = (cfg.groups || []).find((gg) => gg.id === gid)
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
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
      })
      row1.append(l1)
      row1.append(nameInput)
      const row2 = document.createElement('div')
      row2.className = 'row'
      const l2 = document.createElement('label')
      l2.textContent = '\u56FE\u6807'
      const iconComp = createIconInput(
        active.icon || '',
        ['icon', 'url', 'emoji'],
        {
          labels: { icon: '\u56FE\u6807', url: 'URL', emoji: 'Emoji' },
          namePrefix: 'utqn-group-icon-kind-',
          onValueChange() {
            const v = iconComp.getFinal()
            active.icon = v
            helpers.saveConfig(cfg)
            helpers.rerender(root, cfg)
          },
          onKindChange() {
            const v = iconComp.getFinal()
            active.icon = v
            helpers.saveConfig(cfg)
            helpers.rerender(root, cfg)
          },
        }
      )
      row2.append(l2)
      row2.append(iconComp.el)
      const row3 = document.createElement('div')
      row3.className = 'row'
      const l3 = document.createElement('label')
      l3.textContent = 'URL \u89C4\u5219'
      const ta = document.createElement('textarea')
      ta.value = (active.match || []).join('\n')
      ta.addEventListener('change', () => {
        const grp = (cfg.groups || []).find((g) => g.id === active.id)
        if (!grp) return
        grp.match = ta.value
          .split(/\n+/)
          .map((v) => v.trim())
          .filter(Boolean)
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
      })
      row3.append(l3)
      row3.append(ta)
      const row4 = document.createElement('div')
      row4.className = 'row'
      const l4 = document.createElement('label')
      l4.textContent = '\u7EC4\u9ED8\u8BA4\u6253\u5F00\u65B9\u5F0F'
      let grpOpen = active.defaultOpen || helpers.sitePref.defaultOpen
      const openRadios2 = createOpenModeRadios(grpOpen, (m) => {
        grpOpen = m
        active.defaultOpen = m
        helpers.saveConfig(cfg)
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
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
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
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
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
        for (const it of active.items || []) {
          const row = document.createElement('div')
          row.className = 'row item-row'
          const n = document.createElement('input')
          n.value = it.name
          n.addEventListener('change', () => {
            const grp = (cfg.groups || []).find((g) => g.id === groupId)
            if (!grp) return
            const item = (grp.items || []).find((x) => x.id === it.id)
            if (!item) return
            item.name = n.value
            helpers.saveConfig(cfg)
            helpers.rerender(root, cfg)
          })
          const iconComp2 = createIconInput(
            it.icon || '',
            ['icon', 'url', 'emoji'],
            {
              labels: { icon: '\u56FE\u6807', url: 'URL', emoji: 'Emoji' },
              namePrefix: 'utqn-item-icon-kind-',
              placeholders: {
                icon: 'home',
                url: 'https://...',
                emoji: 'emoji',
              },
              onValueChange() {
                const grp = (cfg.groups || []).find((g) => g.id === groupId)
                if (!grp) return
                const item = (grp.items || []).find((x) => x.id === it.id)
                if (!item) return
                item.icon = iconComp2.getFinal()
                helpers.saveConfig(cfg)
                helpers.rerender(root, cfg)
              },
              onKindChange() {
                const grp = (cfg.groups || []).find((g) => g.id === groupId)
                if (!grp) return
                const item = (grp.items || []).find((x) => x.id === it.id)
                if (!item) return
                item.icon = iconComp2.getFinal()
                helpers.saveConfig(cfg)
                helpers.rerender(root, cfg)
              },
            }
          )
          const t = document.createElement('select')
          for (const tp of ['url', 'js']) {
            const o = document.createElement('option')
            o.value = tp
            o.textContent = tp
            if (it.type === tp) o.selected = true
            t.append(o)
          }
          t.addEventListener('change', () => {
            const grp = (cfg.groups || []).find((g) => g.id === groupId)
            if (!grp) return
            const item = (grp.items || []).find((x) => x.id === it.id)
            if (!item) return
            item.type = t.value
            helpers.saveConfig(cfg)
          })
          const d = document.createElement('input')
          d.value = it.data
          d.addEventListener('change', () => {
            const grp = (cfg.groups || []).find((g) => g.id === groupId)
            if (!grp) return
            const item = (grp.items || []).find((x) => x.id === it.id)
            if (!item) return
            item.data = d.value
            helpers.saveConfig(cfg)
            helpers.rerender(root, cfg)
          })
          const m = document.createElement('select')
          for (const mm of ['same-tab', 'new-tab']) {
            const o = document.createElement('option')
            o.value = mm
            o.textContent = mm
            if (
              (it.openIn ||
                active.defaultOpen ||
                helpers.sitePref.defaultOpen) === mm
            )
              o.selected = true
            m.append(o)
          }
          m.addEventListener('change', () => {
            const grp = (cfg.groups || []).find((g) => g.id === groupId)
            if (!grp) return
            const item = (grp.items || []).find((x) => x.id === it.id)
            if (!item) return
            item.openIn = m.value
            helpers.saveConfig(cfg)
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
            const grp = (cfg.groups || []).find((g) => g.id === groupId)
            if (!grp) return
            const item = (grp.items || []).find((x) => x.id === it.id)
            if (!item) return
            item.hidden = visibleSel.value === '\u9690\u85CF'
            helpers.saveConfig(cfg)
            helpers.rerender(root, cfg)
          })
          const del = document.createElement('button')
          del.className = 'btn'
          del.textContent = '\u5220\u9664'
          del.addEventListener('click', () => {
            const grp = (cfg.groups || []).find((g) => g.id === groupId)
            if (!grp) return
            grp.items = (grp.items || []).filter((x) => x.id !== it.id)
            helpers.saveConfig(cfg)
            rebuildItems()
            helpers.rerender(root, cfg)
          })
          const moveToSel = document.createElement('select')
          for (const g of cfg.groups || []) {
            if (g.id === groupId) continue
            const o = document.createElement('option')
            o.value = g.id
            o.textContent = '\u590D\u5236\u5230 ' + String(g.name)
            moveToSel.append(o)
          }
          const moveBtn = document.createElement('button')
          moveBtn.className = 'btn mini'
          moveBtn.textContent = '\u590D\u5236\u5230\u5206\u7EC4'
          moveBtn.addEventListener('click', () => {
            const toId = moveToSel.value
            if (!toId) return
            copyItemToGroup(cfg, groupId, it.id, toId)
            helpers.saveConfig(cfg)
            rebuildItems()
            helpers.rerender(root, cfg)
          })
          row.append(n)
          row.append(iconComp2.el)
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
        var _a
        openAddLinkModal(root, cfg, {
          saveConfig(c) {
            helpers.saveConfig(c)
          },
          rerender(r, c) {
            helpers.rerender(r, c)
          },
          defaultOpen:
            (_a = active.defaultOpen) != null
              ? _a
              : helpers.sitePref.defaultOpen,
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
          defaultOpen: helpers.sitePref.defaultOpen,
        }
        cfg.groups.push(ng)
        active = ng
        helpers.saveConfig(cfg)
        rebuildGroupPills()
        rebuildGroupEditor()
        helpers.rerender(root, cfg)
      })
      const delGroup = document.createElement('button')
      delGroup.className = 'btn btn-secondary'
      delGroup.textContent = '\u5220\u9664\u5206\u7EC4'
      delGroup.addEventListener('click', () => {
        if ((cfg.groups || []).length <= 1) {
          return
        }
        cfg.groups = (cfg.groups || []).filter((g) => g.id !== active.id)
        active = cfg.groups[0]
        helpers.saveConfig(cfg)
        rebuildGroupPills()
        rebuildGroupEditor()
        helpers.rerender(root, cfg)
      })
      const delEmptyGroups = document.createElement('button')
      delEmptyGroups.className = 'btn btn-secondary'
      delEmptyGroups.textContent =
        '\u5220\u9664\u6240\u6709\u7A7A\u7684\u5206\u7EC4'
      delEmptyGroups.addEventListener('click', () => {
        const empties = (cfg.groups || []).filter(
          (g) => (g.items || []).length === 0
        )
        const n = empties.length
        if (n === 0) return
        const ok = globalThis.confirm(
          '\u786E\u8BA4\u5220\u9664 ' + String(n) + ' \u4E2A\u5206\u7EC4\uFF1F'
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
            defaultOpen: helpers.sitePref.defaultOpen,
          }
          kept.push(ng)
        }
        cfg.groups = kept
        active = cfg.groups[0]
        helpers.saveConfig(cfg)
        rebuildGroupPills()
        rebuildGroupEditor()
        helpers.rerender(root, cfg)
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
    wrap.append(grpHeader)
    wrap.append(grpList)
    wrap.append(groupEditor)
    return wrap
  }
  function copyItemToGroup(cfg, fromGroupId, itemId, toGroupId) {
    const from = (cfg.groups || []).find((g) => g.id === fromGroupId)
    const to = (cfg.groups || []).find((g) => g.id === toGroupId)
    if (!from || !to) return
    const it = (from.items || []).find((x) => x.id === itemId)
    if (!it) return
    const dup = __spreadProps(__spreadValues({}, it), { id: uid() })
    to.items.push(dup)
  }
  function openEditorModal(root, cfg, helpers) {
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
    let tab = 'settings'
    const tabs = createSegmentedRadios(
      tab,
      ['settings', 'groups'],
      (v) => {
        tab = v
        syncUi()
      },
      {
        labels: { settings: '\u8BBE\u7F6E', groups: '\u5206\u7EC4' },
        namePrefix: 'utqn-editor-tabs-',
      }
    )
    const settingsWrap = document.createElement('div')
    const groupsWrap = document.createElement('div')
    const settingsPanel = createSettingsPanel(root, cfg, helpers)
    const groupsPanel = createGroupManagerPanel(root, cfg, {
      saveConfig: helpers.saveConfig,
      rerender: helpers.rerender,
      sitePref: helpers.sitePref,
    })
    settingsWrap.append(settingsPanel)
    groupsWrap.append(groupsPanel)
    const actions = document.createElement('div')
    actions.className = 'row'
    const closeBtn = document.createElement('button')
    closeBtn.className = 'btn btn-secondary'
    closeBtn.textContent = '\u5173\u95ED'
    closeBtn.addEventListener('click', () => {
      mask.remove()
    })
    actions.append(closeBtn)
    const syncUi = () => {
      settingsWrap.style.display = tab === 'settings' ? '' : 'none'
      groupsWrap.style.display = tab === 'groups' ? '' : 'none'
    }
    syncUi()
    modal.append(h2)
    modal.append(tabs)
    modal.append(settingsWrap)
    modal.append(groupsWrap)
    modal.append(actions)
    mask.append(modal)
    root.append(mask)
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
  var HOTKEY_DEFAULT = 'Alt+Shift+K'
  var tempOpen = false
  var tempClosed = false
  var menuIds = []
  var showAllGroups = false
  var showHiddenGroups = false
  var showHiddenItems = false
  var editingGroups = /* @__PURE__ */ new Set()
  var selectedItemsByGroup = /* @__PURE__ */ new Map()
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
  function openItem(it, group, cfg, opts) {
    const mode = it.openIn || group.defaultOpen || sitePref.defaultOpen
    if (it.type === 'url') {
      const url = new URL(
        resolveUrlTemplate(String(it.data || '/')),
        location.href
      ).href
      const finalMode = (opts == null ? void 0 : opts.forceNewTab)
        ? 'new-tab'
        : mode
      if (finalMode === 'new-tab') {
        window.open(url, '_blank', 'noopener')
      } else {
        location.assign(url)
      }
      return
    }
    try {
      const onMsg = (ev) => {
        const d = (ev && ev.data) || null
        if (d && typeof d.__utqn_err__ === 'string' && d.__utqn_err__) {
          try {
            if (typeof globalThis.alert === 'function') {
              globalThis.alert(
                '\u811A\u672C\u6267\u884C\u51FA\u9519\uFF1A' +
                  String(d.__utqn_err__)
              )
            } else {
              console.error(
                '\u811A\u672C\u6267\u884C\u51FA\u9519\uFF1A' +
                  String(d.__utqn_err__)
              )
            }
          } catch (e) {}
          return
        }
        const raw =
          d && typeof d.__utqn_url__ === 'string' ? d.__utqn_url__ : ''
        if (!raw) return
        try {
          const url = new URL(
            resolveUrlTemplate(String(raw).trim()),
            location.href
          ).href
          const overrideMode =
            d && typeof d.__utqn_mode__ === 'string' ? d.__utqn_mode__ : void 0
          const finalMode = (opts == null ? void 0 : opts.forceNewTab)
            ? 'new-tab'
            : overrideMode || mode
          if (finalMode === 'new-tab') window.open(url, '_blank', 'noopener')
          else location.assign(url)
        } catch (e) {}
      }
      window.addEventListener('message', onMsg, { once: true })
      const s = document.createElement('script')
      const codeSrc = JSON.stringify(String(it.data || ''))
      s.textContent = '(async function(){try{var __code='.concat(
        codeSrc,
        ";var __fn=new Function(__code);var __ret=__fn();if(__ret&&typeof __ret.then==='function'){__ret=await __ret;}var __url='';var __mode='';if(typeof __ret==='string'&&__ret.trim()){__url=__ret.trim();}else if(__ret&&typeof __ret==='object'){try{if(typeof __ret.error==='string'&&__ret.error){window.postMessage({__utqn_err__:__ret.error},'*');return;}var __x=__ret.url||(__ret.href?String(__ret):'');if(typeof __x==='string'&&__x.trim()){__url=__x.trim();}var __m=__ret.mode; if(__m==='same-tab'||__m==='new-tab'){__mode=__m;} }catch{}}if(__url){window.postMessage({__utqn_url__:__url,__utqn_mode__:__mode},'*');}}catch(e){try{window.postMessage({__utqn_err__:String(e&&(e.message||e))},'*');}catch{}}})()"
      )
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
          name: String((gg == null ? void 0 : gg.name) || '\u9ED8\u8BA4\u7EC4'),
          icon: String((gg == null ? void 0 : gg.icon) || 'lucide:folder'),
          match: Array.isArray(gg == null ? void 0 : gg.match)
            ? gg.match
            : ['*'],
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
      name: '\u9ED8\u8BA4\u7EC4',
      icon: 'lucide:folder',
      match: ['*'],
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
        {
          id: uid(),
          name: '\u7AD9\u5185\u641C\u7D22',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q=site:{hostname}%20{selected||query}',
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
    const existing = document.querySelector(
      '[data-utqn-host="utags-quick-nav"]'
    )
    if (existing instanceof HTMLElement) {
      const root2 = existing.shadowRoot
      return { host: existing, root: root2 }
    }
    const host = document.createElement('div')
    host.dataset.utqnHost = 'utags-quick-nav'
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
  function isEditableTarget(t) {
    const el = t
    if (!el) return false
    const tag = el.tagName ? el.tagName.toLowerCase() : ''
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
    const ce = el.isContentEditable
    return Boolean(ce)
  }
  function registerHotkeys(root, cfg) {
    document.addEventListener('keydown', (e) => {
      if (e.defaultPrevented) return
      if (isEditableTarget(e.target || void 0)) return
      const spec = cfg.global.hotkey || HOTKEY_DEFAULT
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
      const visible = Boolean(root.querySelector('.utqn .panel'))
      if (visible) {
        collapseWithAnim(root, cfg)
      } else {
        tempOpen = true
        rerender(root, cfg)
      }
    })
  }
  function renderNavItem(
    root,
    cfg,
    g,
    it,
    section,
    isEditing,
    siteDefaultOpenConst,
    defOpen
  ) {
    var _a
    const wrap = document.createElement('div')
    wrap.className = 'item-wrap'
    wrap.dataset.itemId = it.id
    wrap.classList.add('fade-in')
    if (it.hidden) wrap.classList.add('is-hidden')
    const a = document.createElement('a')
    a.className = 'item'
    if (isEditing) {
      a.href = '#'
      a.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
      })
    } else if (it.type === 'url') {
      const url = new URL(
        resolveUrlTemplate(String(it.data || '/')),
        location.href
      ).href
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
      const rawIcon = String(it.icon || '')
      let iconStr = rawIcon
      if (rawIcon.startsWith('favicon')) {
        const param = rawIcon.split(':')[1]
        const sizeNum = param ? Number.parseInt(param, 10) : 64
        const size = sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
        const targetUrl =
          it.type === 'url'
            ? new URL(resolveUrlTemplate(String(it.data || '/')), location.href)
                .href
            : location.href
        try {
          iconStr = 'url:' + getFaviconUrl(targetUrl, size)
        } catch (e) {}
      }
      setIcon(a, iconStr)
    }
    const t = document.createElement('span')
    t.textContent = it.name
    a.append(t)
    if (isEditing) {
      const set = selectedItemsByGroup.get(g.id) || /* @__PURE__ */ new Set()
      selectedItemsByGroup.set(g.id, set)
      const sel = document.createElement('input')
      sel.type = 'checkbox'
      sel.checked = set.has(it.id)
      const updateDeleteBtnState = () => {
        var _a2
        const btn = section.querySelector(
          '.header-actions .btn.mini:last-child'
        )
        if (btn instanceof HTMLButtonElement) {
          const count =
            ((_a2 = selectedItemsByGroup.get(g.id)) == null
              ? void 0
              : _a2.size) || 0
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
    wrap.append(a)
    if (isEditing) {
      const editItemBtn = document.createElement('button')
      editItemBtn.className = 'icon-btn'
      setIcon(editItemBtn, 'lucide:edit-3', '\u7F16\u8F91\u8BE5\u5BFC\u822A')
      const defaultOpenForItems =
        (_a = g.defaultOpen) != null ? _a : siteDefaultOpenConst
      editItemBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        openAddLinkModal(root, cfg, {
          saveConfig(c) {
            void saveConfig(c)
          },
          rerender(r, c) {
            rerender(r, c)
          },
          defaultOpen: defaultOpenForItems,
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
    const header = document.createElement('div')
    header.className = 'header'
    const title = document.createElement('div')
    title.className = 'title'
    setIcon(title, g.icon || 'lucide:folder')
    const nameSpan = document.createElement('span')
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
    const siteDefaultOpenConst = sitePref.defaultOpen
    const editMenuRightSide =
      isRightSide(sitePref.position) || sitePref.position.endsWith('-right')
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
        showDropdownMenu(
          root,
          addLinkBtn,
          [
            {
              icon: 'lucide:keyboard',
              label: '\u624B\u52A8\u8F93\u5165',
              onClick() {
                var _a2
                openAddLinkModal(root, cfg, {
                  saveConfig(c) {
                    void saveConfig(c)
                  },
                  rerender(r, c) {
                    rerender(r, c)
                  },
                  defaultOpen:
                    (_a2 = g.defaultOpen) != null
                      ? _a2
                      : sitePref.defaultOpen || 'same-tab',
                  defaultGroupId: g.id,
                })
              },
            },
            {
              icon: 'lucide:globe',
              label: '\u6DFB\u52A0\u5F53\u524D\u7F51\u9875',
              onClick() {
                var _a2
                addCurrentPageLinkToGroup(
                  root,
                  cfg,
                  {
                    saveConfig(c) {
                      void saveConfig(c)
                    },
                    rerender(r, c) {
                      rerender(r, c)
                    },
                  },
                  g.id,
                  (_a2 = g.defaultOpen) != null
                    ? _a2
                    : sitePref.defaultOpen || 'same-tab'
                )
              },
            },
            {
              icon: 'lucide:link',
              label: '\u4ECE\u5F53\u524D\u7F51\u9875\u91C7\u96C6\u94FE\u63A5',
              onClick() {
                var _a2
                pickLinkFromPageAndAdd(
                  root,
                  cfg,
                  {
                    saveConfig(c) {
                      void saveConfig(c)
                    },
                    rerender(r, c) {
                      rerender(r, c)
                    },
                  },
                  g.id,
                  (_a2 = g.defaultOpen) != null
                    ? _a2
                    : sitePref.defaultOpen || 'same-tab'
                )
              },
            },
          ],
          groupMenuRightSide
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
        showDropdownMenu(
          root,
          editBtn,
          [
            {
              icon: 'lucide:edit-3',
              label: '\u7F16\u8F91\u5206\u7EC4',
              onClick() {
                openAddGroupModal(root, cfg, {
                  saveConfig(c) {
                    void saveConfig(c)
                  },
                  rerender(r, c) {
                    rerender(r, c)
                  },
                  defaultOpen: g.defaultOpen || siteDefaultOpenConst,
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
          editMenuRightSide
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
    items.style.setProperty(
      '--cols',
      String(isEditing ? 1 : g.itemsPerRow || 1)
    )
    items.style.display = g.collapsed ? 'none' : ''
    let visibleCount = 0
    const defOpen = sitePref.defaultOpen || 'same-tab'
    for (const it of g.items) {
      if (it.hidden && !showHiddenItems && !isEditing) continue
      visibleCount++
      const wrap = renderNavItem(
        root,
        cfg,
        g,
        it,
        section,
        isEditing,
        siteDefaultOpenConst,
        defOpen
      )
      items.append(wrap)
    }
    items.style.setProperty(
      '--cols',
      String(
        isEditing
          ? 1
          : Math.max(1, Math.min(g.itemsPerRow || 1, visibleCount || 1))
      )
    )
    if (visibleCount === 0) {
      const msg = document.createElement('div')
      msg.className = 'empty-msg'
      msg.textContent =
        g.items.length === 0
          ? '\u65E0\u9879\u76EE'
          : '\u9879\u76EE\u5DF2\u88AB\u9690\u85CF'
      items.append(msg)
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
      openEditor(root, cfg)
    })
    const pinBtn = document.createElement('button')
    pinBtn.className = 'icon-btn'
    setIcon(
      pinBtn,
      sitePref.pinned ? 'lucide:pin' : 'lucide:pin-off',
      sitePref.pinned ? '\u53D6\u6D88\u56FA\u5B9A' : '\u56FA\u5B9A\u663E\u793A'
    )
    pinBtn.classList.toggle('active', Boolean(sitePref.pinned))
    pinBtn.addEventListener('click', () => {
      sitePref.pinned = !sitePref.pinned
      void saveConfig(cfg)
      pinBtn.classList.toggle('active', Boolean(sitePref.pinned))
      setIcon(
        pinBtn,
        sitePref.pinned ? 'lucide:pin' : 'lucide:pin-off',
        sitePref.pinned
          ? '\u53D6\u6D88\u56FA\u5B9A'
          : '\u56FA\u5B9A\u663E\u793A'
      )
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
      rightActions.append(showHiddenGroupsLabel)
      rightActions.append(showHiddenItemsLabel)
      rightActions.append(expandAllBtn)
      rightActions.append(collapseAllBtn)
    }
    rightActions.append(settingsBtn)
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
    wrapper.className = 'utqn' + (isDarkTheme(cfg) ? ' dark' : '')
    const panel = document.createElement('div')
    panel.className = 'panel'
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
    const body = renderPanelHeader(root, cfg, panel)
    const groupsToShow = currentGroups(cfg)
    for (const g of groupsToShow) renderGroupSection(root, cfg, g, body)
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
  function openEditor(root, cfg) {
    openEditorModal(root, cfg, {
      saveConfig(c) {
        void saveConfig(c)
      },
      rerender(r, c) {
        rerender(r, c)
      },
      sitePref,
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
  }
  function openQuickAddMenu(root, cfg, anchor) {
    suppressCollapse = true
    tempOpen = true
    const rightSide =
      isRightSide(sitePref.position) || sitePref.position.endsWith('-right')
    showDropdownMenu(
      root,
      anchor,
      [
        {
          icon: 'lucide:folder',
          label: '\u6DFB\u52A0\u5206\u7EC4',
          onClick() {
            suppressCollapse = false
            openAddGroupModal(root, cfg, {
              saveConfig(c) {
                void saveConfig(c)
              },
              rerender(r, c) {
                rerender(r, c)
              },
              defaultOpen: sitePref.defaultOpen,
              defaultMatch: ['*://' + (location.hostname || '') + '/*'],
            })
          },
        },
        {
          icon: 'lucide:link',
          label: '\u6DFB\u52A0\u94FE\u63A5',
          onClick() {
            var _a
            suppressCollapse = false
            const matched = currentGroups(cfg)
            openAddLinkModal(root, cfg, {
              saveConfig(c) {
                void saveConfig(c)
              },
              rerender(r, c) {
                rerender(r, c)
              },
              defaultOpen: sitePref.defaultOpen || 'same-tab',
              defaultGroupId:
                (_a = matched[0] || cfg.groups[0]) == null ? void 0 : _a.id,
            })
          },
        },
      ],
      rightSide
    )
  }
  var lastCollapsed = true
  var suppressCollapse = false
  function rerender(root, cfg) {
    var _a, _b, _c
    suppressCollapse = true
    let sx = 0
    let sy = 0
    try {
      const cur =
        root.querySelector('.utqn .panel-scroll') ||
        root.querySelector('.utqn .panel')
      if (cur) {
        sx = cur.scrollLeft
        sy = cur.scrollTop
      }
    } catch (e) {}
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
    try {
      const cur =
        root.querySelector('.utqn .panel-scroll') ||
        root.querySelector('.utqn .panel')
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
    lastCollapsed = false
    suppressCollapse = false
  }
  function registerMenu(root, cfg) {
    if (typeof GM_registerMenuCommand !== 'function') {
      return
    }
    if (
      typeof GM_unregisterMenuCommand === 'function' &&
      Array.isArray(menuIds)
    ) {
      for (const id of menuIds) {
        try {
          GM_unregisterMenuCommand(id)
        } catch (e) {}
      }
      menuIds = []
    }
    try {
      const text = sitePref.enabled
        ? '\u{1F6AB} \u7981\u7528\u5F53\u524D\u7F51\u7AD9\u5FEB\u901F\u5BFC\u822A'
        : '\u2705 \u542F\u7528\u5F53\u524D\u7F51\u7AD9\u5FEB\u901F\u5BFC\u822A'
      menuIds.push(
        GM_registerMenuCommand(
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
        ),
        GM_registerMenuCommand(
          '\u2699\uFE0F \u8BBE\u7F6E\u5FEB\u901F\u5BFC\u822A',
          () => {
            openEditor(root, cfg)
          }
        ),
        GM_registerMenuCommand(text, () => {
          sitePref.enabled = !sitePref.enabled
          void saveConfig(cfg)
          rerender(root, cfg)
          registerMenu(root, cfg)
        })
      )
    } catch (e) {}
  }
  function registerStorageListener(root, cfg) {
    try {
      if (typeof GM_addValueChangeListener === 'function')
        GM_addValueChangeListener(KEY, (_name, _old, nv, remote) => {
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
    try {
      const de = document.documentElement
      if (de && de.dataset && de.dataset.utqn === '1') return
      if (de && de.dataset) de.dataset.utqn = '1'
    } catch (e) {}
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
      registerHotkeys(root, cfg)
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
