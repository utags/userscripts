// ==UserScript==
// @name                 Read Helper
// @name:zh-CN           阅读助手
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
// @grant                GM_addValueChangeListener
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM_registerMenuCommand
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
  function c(tag, opts) {
    const el = document.createElement(tag)
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
        if (typeof ch === 'string') el.append(document.createTextNode(ch))
        else el.append(ch)
      }
    }
    return el
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
  var READ_HELPER_SETTINGS_KEY = 'read_helper_settings'
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
  function setOrDelete(obj, key, value, defaultValue) {
    const normalizeToDefaultType = (val, dv) => {
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
  var style_default =
    '/*! tailwindcss v4.1.17 | MIT License | https://tailwindcss.com */@layer properties;@layer theme, base, components, utilities;@layer theme{:host,:root{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-50:oklch(97.1% 0.013 17.38);--color-red-500:oklch(63.7% 0.237 25.331);--color-gray-50:oklch(98.5% 0.002 247.839);--color-gray-100:oklch(96.7% 0.003 264.542);--color-gray-200:oklch(92.8% 0.006 264.531);--color-gray-300:oklch(87.2% 0.01 258.338);--color-gray-400:oklch(70.7% 0.022 261.325);--color-gray-500:oklch(55.1% 0.027 264.364);--color-gray-600:oklch(44.6% 0.03 256.802);--color-gray-700:oklch(37.3% 0.034 259.733);--color-gray-900:oklch(21% 0.034 264.665);--color-white:#fff;--spacing:0.25rem;--font-weight-semibold:600;--radius-md:0.375rem;--radius-xl:0.75rem;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,::backdrop,::file-selector-button,:after,:before{border:0 solid;box-sizing:border-box;margin:0;padding:0}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-size:1em;font-variation-settings:var(--default-mono-font-variation-settings,normal)}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}menu,ol,ul{list-style:none}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}::file-selector-button,button,input,optgroup,select,textarea{background-color:transparent;border-radius:0;color:inherit;font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;opacity:1}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::-moz-placeholder{opacity:1}::placeholder{opacity:1}@supports (not (-webkit-appearance:-apple-pay-button)) or (contain-intrinsic-size:1px){::-moz-placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}::placeholder{color:currentcolor;@supports (color:color-mix(in lab,red,red)){color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-meridiem-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}::file-selector-button,button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer utilities{.container{width:100%;@media (width >= 40rem){max-width:40rem}@media (width >= 48rem){max-width:48rem}@media (width >= 64rem){max-width:64rem}@media (width >= 80rem){max-width:80rem}@media (width >= 96rem){max-width:96rem}}.grid{display:grid}}:host{all:initial}.user-settings{position:fixed;right:calc(var(--spacing)*3);top:calc(var(--spacing)*3);z-index:2147483649;--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .panel{background-color:var(--color-white);border-color:var(--color-gray-200);border-radius:var(--radius-xl);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-900);font-family:var(--font-sans);font-size:13px;max-height:90vh;overflow-y:auto;padding:calc(var(--spacing)*4);width:380px;--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,rgba(0,0,0,.1)),0 8px 10px -6px var(--tw-shadow-color,rgba(0,0,0,.1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.user-settings .grid{display:flex;flex-direction:column;gap:calc(var(--spacing)*3)}.user-settings .row{align-items:center;display:flex;gap:calc(var(--spacing)*3);justify-content:space-between}.user-settings label{color:var(--color-gray-600)}.user-settings .btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .btn-danger{border-color:var(--color-red-500);color:var(--color-red-500);&:hover{@media (hover:hover){background-color:var(--color-red-50)}}}.user-settings .btn-ghost{border-radius:var(--radius-md);color:var(--color-gray-500);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*2);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.user-settings input[type=text],.user-settings select{color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);width:180px}.user-settings input[type=color],.user-settings input[type=text],.user-settings select{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px}.user-settings input[type=color]{height:calc(var(--spacing)*8);padding:calc(var(--spacing)*0);width:80px}.user-settings textarea{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);width:100%}.user-settings .switch,.user-settings .toggle-wrap{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.user-settings .toggle-checkbox{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:#fff;border:1px solid #9ca3af;border-radius:9999px;box-shadow:inset 0 1px 1px rgba(0,0,0,.1);cursor:pointer;display:inline-block;height:22px;position:relative;transition:background-color .2s ease,border-color .2s ease;width:42px}.user-settings .toggle-checkbox:before{background:#111827;border-radius:9999px;box-shadow:0 2px 4px rgba(0,0,0,.25);content:"";height:18px;left:2px;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease,background-color .2s ease;width:18px}.user-settings .toggle-checkbox:checked{background:var(--user-toggle-on-bg,#111827);border-color:var(--user-toggle-on-bg,#111827)}.user-settings .panel-title{font-size:16px;--tw-font-weight:var(--font-weight-semibold);color:var(--color-gray-700);font-weight:var(--font-weight-semibold)}.user-settings .btn-ghost.icon{align-items:center;border-radius:calc(infinity*1px);color:var(--color-gray-500);display:flex;height:calc(var(--spacing)*7);justify-content:center;width:calc(var(--spacing)*7);&:hover{@media (hover:hover){background-color:var(--color-gray-100)}}}.user-settings .toggle-checkbox:checked:before{background:#fff;transform:translate(20px,-50%)}.user-settings .color-row{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.user-settings .color-swatch{border-radius:var(--radius-md);cursor:pointer;height:calc(var(--spacing)*6);width:calc(var(--spacing)*6)}.user-settings .color-swatch.active{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-color:var(--user-color-ring,#111827)}.user-settings .seg{align-items:center;display:flex;gap:calc(var(--spacing)*2)}.user-settings .seg-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3);&:hover{@media (hover:hover){background-color:var(--color-gray-50)}}}.user-settings .seg-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .value-wrap{align-items:flex-end;display:flex;flex-direction:column;gap:calc(var(--spacing)*1);text-align:right}.user-settings .tabs{align-items:center;display:flex;gap:calc(var(--spacing)*2);margin-bottom:calc(var(--spacing)*2)}.user-settings .tab-btn{border-color:var(--color-gray-300);border-radius:var(--radius-md);border-style:var(--tw-border-style);border-width:1px;color:var(--color-gray-700);padding-block:calc(var(--spacing)*1);padding-inline:calc(var(--spacing)*3)}.user-settings .tab-btn.active{background:var(--user-active-bg,#111827);border-color:var(--user-active-bg,#111827);color:var(--user-active-fg,#fff)}.user-settings .field-help{color:var(--color-gray-400);font-size:12px}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-font-weight{syntax:"*";inherits:false}@layer properties{*,::backdrop,:after,:before{--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-font-weight:initial}}'
  function createToggleRow(label, key, help) {
    const row = c('div', { className: 'row' })
    const lab = c('label', { text: label })
    const seg = c('div', { className: 'toggle-wrap' })
    const chk = c('input', {
      type: 'checkbox',
      className: 'toggle-checkbox',
      dataset: { key },
    })
    const val = c('div', { className: 'value-wrap' })
    seg.append(chk)
    val.append(seg)
    if (help) val.append(c('div', { className: 'field-help', text: help }))
    row.append(lab)
    row.append(val)
    return { row, chk }
  }
  function createInputRow(label, key, placeholder, help) {
    const row = c('div', { className: 'row' })
    const lab = c('label', { text: label })
    const inp = c('input', {
      type: 'text',
      placeholder: placeholder || '',
      dataset: { key },
    })
    const val = c('div', { className: 'value-wrap' })
    val.append(inp)
    if (help) val.append(c('div', { className: 'field-help', text: help }))
    row.append(lab)
    row.append(val)
    return { row, inp }
  }
  function createTextareaRow(label, key, rows, help) {
    const row = c('div', { className: 'row' })
    const lab = c('label', { text: label })
    const ta = c('textarea', {
      rows: rows || 4,
      dataset: { key },
    })
    const val = c('div', { className: 'value-wrap' })
    val.append(ta)
    if (help) val.append(c('div', { className: 'field-help', text: help }))
    row.append(lab)
    row.append(val)
    return { row, ta }
  }
  function createRadioRow(label, key, opts, help) {
    const row = c('div', { className: 'row' })
    const lab = c('label', { text: label })
    const seg = c('div', { className: 'seg' })
    for (const o of opts) {
      const b = c('button', {
        className: 'seg-btn',
        dataset: { key, value: o.value },
        text: o.label,
      })
      seg.append(b)
    }
    const val = c('div', { className: 'value-wrap' })
    val.append(seg)
    if (help) val.append(c('div', { className: 'field-help', text: help }))
    row.append(lab)
    row.append(val)
    return { row, seg }
  }
  function createColorRow(label, key, opts, help) {
    const row = c('div', { className: 'row' })
    const lab = c('label', { text: label })
    const seg = c('div', { className: 'color-row' })
    for (const o of opts) {
      const b = c('button', {
        className: 'color-swatch',
        dataset: { key, value: o.value },
        style: { backgroundColor: o.value },
      })
      seg.append(b)
    }
    const val = c('div', { className: 'value-wrap' })
    val.append(seg)
    if (help) val.append(c('div', { className: 'field-help', text: help }))
    row.append(lab)
    row.append(val)
    return { row, seg }
  }
  function createSelectRow(label, key, opts, help) {
    const row = c('div', { className: 'row' })
    const lab = c('label', { text: label })
    const sel = c('select', { dataset: { key } })
    for (const o of opts) {
      const opt = c('option', { value: o.value, text: o.label })
      sel.append(opt)
    }
    const val = c('div', { className: 'value-wrap' })
    val.append(sel)
    if (help) val.append(c('div', { className: 'field-help', text: help }))
    row.append(lab)
    row.append(val)
    return { row, sel }
  }
  function createActionRow(label, key, actions, help) {
    const row = c('div', { className: 'row' })
    const lab = c('label', { text: label })
    const wrap = c('div', { className: 'value-wrap' })
    const act = c('div', { className: 'seg' })
    for (const a of actions) {
      const b = c('button', {
        className: 'btn action-btn'.concat(
          a.kind === 'danger' ? ' btn-danger' : ''
        ),
        dataset: { key, action: a.id },
        text: a.text,
      })
      act.append(b)
    }
    wrap.append(act)
    if (help) wrap.append(c('div', { className: 'field-help', text: help }))
    row.append(lab)
    row.append(wrap)
    return { row }
  }
  function openSettingsPanel(schema, store2, options) {
    const { host, root } = ensureHostAndRoot(options)
    let lastValues = {}
    const styleTag = c('style', {
      text: style_default.concat(
        (options == null ? void 0 : options.styleText) || ''
      ),
    })
    root.append(styleTag)
    const wrap = c('div', { className: 'user-settings' })
    applyThemeStyles(wrap, options == null ? void 0 : options.theme)
    const panel = c('div', { className: 'panel' })
    const grid = c('div', { className: 'grid' })
    const { row: headerRow, closeBtn } = buildHeader(schema.title)
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
          const { row, chk } = createToggleRow(f.label, f.key, f.help)
          appendAndFill(container, row, f.key, () => {
            fillToggleUI(chk, f.key)
          })
          break
        }
        case 'input': {
          const { row, inp } = createInputRow(
            f.label,
            f.key,
            f.placeholder,
            f.help
          )
          appendAndFill(container, row, f.key, () => {
            fillInput(inp, f.key)
          })
          break
        }
        case 'textarea': {
          const { row, ta } = createTextareaRow(f.label, f.key, f.rows, f.help)
          appendAndFill(container, row, f.key, () => {
            fillTextarea(ta, f.key)
          })
          break
        }
        case 'radio': {
          const { row, seg } = createRadioRow(f.label, f.key, f.options, f.help)
          appendAndFill(container, row, f.key, () => {
            fillRadioUI(seg, f.key)
          })
          break
        }
        case 'select': {
          const { row, sel } = createSelectRow(
            f.label,
            f.key,
            f.options,
            f.help
          )
          appendAndFill(container, row, f.key, () => {
            fillSelect(sel, f.key)
          })
          break
        }
        case 'colors': {
          const { row, seg } = createColorRow(f.label, f.key, f.options, f.help)
          appendAndFill(container, row, f.key, () => {
            fillColorUI(seg, f.key)
          })
          break
        }
        case 'action': {
          const { row } = createActionRow(f.label, f.key, f.actions, f.help)
          container.append(row)
          break
        }
      }
    }
    function sanitizeDatasetKey(rawKey) {
      let out = ''
      for (const ch of rawKey) {
        const code = ch.codePointAt(0) || 0
        out += code >= 65 && code <= 90 ? '-' + ch.toLowerCase() : ch
      }
      return out
    }
    function ensureHostAndRoot(options2) {
      const keySan = sanitizeDatasetKey(
        (options2 == null ? void 0 : options2.hostDatasetKey) || 'usrHost'
      )
      const sel = '[data-'
        .concat(keySan, '="')
        .concat(
          (options2 == null ? void 0 : options2.hostDatasetValue) || 'settings',
          '"]'
        )
      const existing = document.querySelector(sel)
      let root2
      let hostEl
      if (existing instanceof HTMLDivElement && existing.shadowRoot) {
        hostEl = existing
        root2 = existing.shadowRoot
        for (const n of Array.from(root2.childNodes)) n.remove()
      } else {
        const key =
          (options2 == null ? void 0 : options2.hostDatasetKey) || 'userHost'
        const val =
          (options2 == null ? void 0 : options2.hostDatasetValue) || 'settings'
        hostEl = c('div', { dataset: { [key]: val } })
        root2 = hostEl.attachShadow({ mode: 'open' })
        document.documentElement.append(hostEl)
      }
      return { host: hostEl, root: root2 }
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
      if (properties.length > 0) wrap2.style.cssText = properties.join(' ')
    }
    function buildHeader(title) {
      const row = c('div', { className: 'row' })
      const titleEl = c('label', { className: 'panel-title', text: title })
      const closeBtn2 = c('button', {
        className: 'btn-ghost icon',
        text: '\xD7',
        attrs: { 'aria-label': '\u5173\u95ED' },
      })
      row.append(titleEl)
      row.append(closeBtn2)
      return { row, closeBtn: closeBtn2 }
    }
    function renderSimplePanel(container, fields) {
      for (const f of fields) appendField(container, f)
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
        for (const f of t.fields) appendField(p, f)
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
    const refreshAll = async () => {
      try {
        lastValues = await store2.getAll()
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
    function fillRadioUI(seg, key) {
      try {
        const v = lastValues[key]
        for (const b of Array.from(seg.querySelectorAll('.seg-btn'))) {
          const val = b.dataset.value || ''
          if (val === String(v)) b.classList.add('active')
          else b.classList.remove('active')
        }
      } catch (e) {}
    }
    function fillColorUI(seg, key) {
      try {
        const v = lastValues[key]
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
        const v = lastValues[key]
        if (onBtn instanceof HTMLInputElement && onBtn.type === 'checkbox') {
          onBtn.checked = Boolean(v)
        }
      } catch (e) {}
    }
    function fillInput(inp, key) {
      try {
        const v = lastValues[key]
        inp.value = String(v != null ? v : '')
      } catch (e) {}
    }
    function fillTextarea(ta, key) {
      try {
        const v = lastValues[key]
        ta.value = String(v != null ? v : '')
      } catch (e) {}
    }
    function fillSelect(sel, key) {
      try {
        const v = lastValues[key]
        for (const o of Array.from(sel.querySelectorAll('option'))) {
          o.selected = o.value === String(v)
        }
      } catch (e) {}
    }
    async function handleSegButton(rb) {
      const key = rb.dataset.key || ''
      const val = rb.dataset.value || ''
      if (!key) return
      try {
        await store2.set(key, val)
      } catch (e) {}
    }
    async function handleColorSwatch(cs) {
      const key = cs.dataset.key || ''
      const val = cs.dataset.value || ''
      if (!key) return
      try {
        await store2.set(key, val)
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
      if (t === closeBtn) {
        host == null ? void 0 : host.remove()
        globalThis.removeEventListener('keydown', onKeyDown2, true)
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
      var _a
      const key = (_a = inp.dataset) == null ? void 0 : _a.key
      if (!key) return
      const isCheckbox = (inp.type || '').toLowerCase() === 'checkbox'
      const v = isCheckbox ? Boolean(inp.checked) : inp.value
      void store2.set(key, v)
    }
    function handleTextareaChange(ta) {
      var _a
      const key = (_a = ta.dataset) == null ? void 0 : _a.key
      if (!key) return
      void store2.set(key, ta.value)
    }
    function handleSelectChange(sel) {
      var _a
      const key = (_a = sel.dataset) == null ? void 0 : _a.key
      if (!key) return
      void store2.set(key, sel.value)
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
    if (schema.type === 'simple') renderSimplePanel(grid, schema.fields)
    else renderTabsPanel(grid, schema.tabs)
    panel.addEventListener('click', onPanelClick)
    panel.addEventListener('change', onPanelChange)
    panel.append(grid)
    wrap.append(panel)
    root.append(wrap)
    wireStoreChange(store2, fillers)
    void refreshAll()
    function onKeyDown2(e) {
      if (e.key === 'Escape') {
        host == null ? void 0 : host.remove()
        globalThis.removeEventListener('keydown', onKeyDown2, true)
      }
    }
    globalThis.addEventListener('keydown', onKeyDown2, true)
  }
  function createObjectSettingsStore(rootKey, defaults) {
    let cache
    let initPromise
    const changeCbs = []
    let listenerRegistered = false
    function registerValueChangeListener() {
      if (listenerRegistered) return
      if (typeof GM_addValueChangeListener !== 'function') return
      try {
        GM_addValueChangeListener(rootKey, (n, ov, nv, remote) => {
          console.log('GM_addValueChangeListener', n, ov, nv, remote)
          try {
            if (nv && typeof nv === 'object') {
              const merged = __spreadValues({}, defaults)
              Object.assign(merged, nv)
              cache = merged
            } else {
              cache = __spreadValues({}, defaults)
            }
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
          obj = await GM.getValue(rootKey, defaults)
        } catch (e) {}
        cache = __spreadValues({}, defaults)
        if (obj && typeof obj === 'object') Object.assign(cache, obj)
        initPromise = void 0
        return cache
      })()
      return initPromise
    }
    return {
      async get(key) {
        var _a
        const obj = await ensure()
        return (_a = obj[key]) != null ? _a : defaults[key]
      },
      async getAll() {
        const obj = await ensure()
        const out = __spreadValues({}, obj)
        return out
      },
      async set(...args) {
        let obj
        try {
          obj = await GM.getValue(rootKey, {})
        } catch (e) {}
        if (typeof args[0] === 'string') {
          const key = args[0]
          const value = args[1]
          const dv = defaults[key]
          setOrDelete(obj, key, value, dv)
        } else {
          const kvs = args[0]
          for (const k of Object.keys(kvs)) {
            const v = kvs[k]
            const dv = defaults[k]
            setOrDelete(obj, k, v, dv)
          }
        }
        cache = __spreadValues({}, defaults)
        if (obj && typeof obj === 'object') Object.assign(cache, obj)
        try {
          await GM.setValue(rootKey, obj)
        } catch (e) {}
      },
      defaults() {
        return __spreadValues({}, defaults)
      },
      onChange(cb) {
        changeCbs.push(cb)
      },
    }
  }
  var mode = DEFAULT_READ_HELPER_SETTINGS.mode
  var style = DEFAULT_READ_HELPER_SETTINGS.style
  var color = DEFAULT_READ_HELPER_SETTINGS.color
  var enabled = DEFAULT_READ_HELPER_SETTINGS.enabled
  var hideOnScroll = DEFAULT_READ_HELPER_SETTINGS.hideOnScroll
  var moveByArrows = DEFAULT_READ_HELPER_SETTINGS.moveByArrows
  var skipButtons = DEFAULT_READ_HELPER_SETTINGS.skipButtons
  var skipLinks = DEFAULT_READ_HELPER_SETTINGS.skipLinks
  var store = createObjectSettingsStore(
    READ_HELPER_SETTINGS_KEY,
    DEFAULT_READ_HELPER_SETTINGS
  )
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
          zIndex: '2147483647',
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
        toggleOnBg: '#111827',
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
    if (typeof GM_registerMenuCommand !== 'function') return
    GM_registerMenuCommand('\u8BBE\u7F6E', () => {
      ;(async () => {
        try {
          openSettingsPanel2()
        } catch (e) {}
      })()
    })
  }
  function listenSettings() {
    var _a
    try {
      ;(_a = store.onChange) == null
        ? void 0
        : _a.call(store, () => {
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
