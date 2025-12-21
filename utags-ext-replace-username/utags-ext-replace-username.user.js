// ==UserScript==
// @name                 UTags Ext - Replace Username
// @name:zh-CN           UTags 扩展 - 替换用户名
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
// @description          Replace username with UTags.
// @description:zh-CN    使用 UTags 标签替换用户名。
// @icon                 data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ff6361' class='bi bi-tags-fill' viewBox='0 0 16 16'%3E %3Cpath d='M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/%3E %3Cpath d='M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z'/%3E %3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                https://github.com/*
// @noframes
// @run-at               document-idle
// ==/UserScript==
//
;(() => {
  'use strict'
  var style_default =
    'a[data-hovercard-url][data-utags-replaced]:before{content:attr(data-utags)}a[data-hovercard-url][data-utags-replaced] span{display:none}:not(#a):not(#b):not(#c) a[data-hovercard-url][data-utags-replaced]+ul .utags_text_tag:not(.utags_captain_tag2),:not(#a):not(#b):not(#c) a[data-hovercard-url][data-utags-replaced]:not(:hover)+ul:not(:hover){display:none!important}'
  var style = document.createElement('style')
  style.textContent = style_default
  document.head.append(style)
  function processElements() {
    var _a
    const elements = document.querySelectorAll(
      'a[data-hovercard-url]:not([data-utags-replaced="true"])'
    )
    for (const element of elements) {
      if (!(element instanceof HTMLElement)) continue
      const utags = element.dataset.utags
      if (!utags) continue
      element.dataset.utagsReplaced = 'true'
      const childNodes = Array.from(element.childNodes)
      for (const node of childNodes) {
        if (
          node.nodeType === Node.TEXT_NODE &&
          ((_a = node.textContent) == null ? void 0 : _a.trim())
        ) {
          const span = document.createElement('span')
          span.textContent = node.textContent
          node.replaceWith(span)
        }
      }
    }
  }
  var timer
  function scheduleProcess() {
    if (timer) return
    timer = requestAnimationFrame(() => {
      processElements()
      timer = void 0
    })
  }
  var observer = new MutationObserver((mutations) => {
    let shouldProcess = false
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldProcess = true
        break
      }
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'data-utags'
      ) {
        shouldProcess = true
        break
      }
    }
    if (shouldProcess) {
      scheduleProcess()
    }
  })
  scheduleProcess()
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-utags'],
  })
})()
