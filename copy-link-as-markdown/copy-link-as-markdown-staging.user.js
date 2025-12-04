// ==UserScript==
// @name                 Copy Selected Link as Markdown - staging
// @name:zh-CN           复制选中链接为 Markdown - staging
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
// @description          Copy selected link(s) on any page as Markdown: [text](url).
// @description:zh-CN    在任意页面将选中的链接复制为 Markdown 格式：[文本](链接)。
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @author               Pipecraft
// @license              MIT
// @match                *://*/*
// @noframes
// @run-at               document-idle
// @grant                GM_registerMenuCommand
// ==/UserScript==
//
;(() => {
  'use strict'
  function escapeMD(s) {
    s = String(s || '')
    return s.replace(/\|/g, '\\|').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
  }
  function getSelectionAnchors() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return []
    const set = /* @__PURE__ */ new Set()
    for (let i = 0; i < sel.rangeCount; i++) {
      const range = sel.getRangeAt(i)
      let root = range.commonAncestorContainer
      if (root && root.nodeType === Node.TEXT_NODE) root = root.parentElement
      if (root && root.querySelectorAll) {
        const as = root.querySelectorAll('a[href]')
        as.forEach((a) => {
          try {
            if (range.intersectsNode(a)) set.add(a)
          } catch (e) {}
        })
      }
      let node = range.startContainer
      if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement
      while (node && node instanceof HTMLElement) {
        if (node.tagName === 'A' && node.href) {
          set.add(node)
          break
        }
        node = node.parentElement
      }
    }
    return Array.from(set)
  }
  function buildMarkdown() {
    const sel = window.getSelection()
    const textSel = sel ? sel.toString().trim() : ''
    const anchors = getSelectionAnchors()
    const origin = location.origin
    if (anchors.length === 1) {
      const a = anchors[0]
      const name = textSel || a.textContent.trim() || a.href
      const url = new URL(a.getAttribute('href'), origin).href
      return '['.concat(escapeMD(name), '](').concat(escapeMD(url), ')')
    }
    if (anchors.length > 1) {
      return anchors
        .map((a) => {
          const name = a.textContent.trim() || a.href
          const url = new URL(a.getAttribute('href'), origin).href
          return '['.concat(escapeMD(name), '](').concat(escapeMD(url), ')')
        })
        .join('\n')
    }
    if (textSel) {
      const m = textSel.match(/https?:\/\/[^\s)]+/)
      if (m) {
        const url = m[0]
        const name = textSel.length > url.length ? textSel : url
        return '['.concat(escapeMD(name), '](').concat(escapeMD(url), ')')
      }
    }
    return '['
      .concat(escapeMD(document.title), '](')
      .concat(escapeMD(location.href), ')')
  }
  async function copyText(s) {
    try {
      await navigator.clipboard.writeText(s)
      return
    } catch (e) {}
    try {
      const ta = document.createElement('textarea')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      ta.value = s
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      ta.remove()
    } catch (e) {}
  }
  function run() {
    const md = buildMarkdown()
    copyText(md)
  }
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand(
        '\u590D\u5236\u9009\u4E2D\u94FE\u63A5\u4E3A Markdown',
        run
      )
    }
  } catch (e) {}
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyM') {
      e.preventDefault()
      run()
    }
  })
})()
