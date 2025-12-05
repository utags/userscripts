// ==UserScript==
// @name                 Copy Selected Links as Markdown
// @name:zh-CN           复制选中链接为 Markdown
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.2
// @description          Copy selected link(s) on any page as Markdown: [text](url).
// @description:zh-CN    在任意页面将选中的链接复制为 Markdown 格式：[文本](链接)。
// @icon                 data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%2248%22%20height%3D%2248%22%20rx%3D%2210%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%224%22/%3E%3Cpath%20d%3D%22M18%2046V18l14%2022L46%2018v28%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                *://*/*
// @run-at               document-idle
// @grant                GM_registerMenuCommand
// ==/UserScript==
//
;(() => {
  'use strict'
  function escapeMD(s) {
    s = String(s || '')
    return s
      .replaceAll('|', '\\|')
      .replaceAll('[', '\\[')
      .replaceAll(']', '\\]')
  }
  function getSelectionAnchors() {
    const sel = globalThis.getSelection()
    if (!sel || sel.rangeCount === 0) return []
    const set = /* @__PURE__ */ new Set()
    for (let i = 0; i < sel.rangeCount; i++) {
      const range = sel.getRangeAt(i)
      const common = range.commonAncestorContainer
      const rootEl =
        common.nodeType === Node.TEXT_NODE ? common.parentElement : common
      if (rootEl) {
        const as = rootEl.querySelectorAll('a[href]')
        for (const a of Array.from(as)) {
          if (a instanceof HTMLAnchorElement) {
            try {
              if (range.intersectsNode(a)) set.add(a)
            } catch (e) {}
          }
        }
      }
      let startNode = range.startContainer
      if (startNode && startNode.nodeType === Node.TEXT_NODE)
        startNode = startNode.parentElement
      let cur = startNode instanceof HTMLElement ? startNode : void 0
      while (cur) {
        if (cur instanceof HTMLAnchorElement && cur.getAttribute('href')) {
          set.add(cur)
          break
        }
        cur = cur.parentElement
      }
    }
    return Array.from(set)
  }
  function buildMarkdown() {
    const sel = globalThis.getSelection()
    const textSel = sel ? sel.toString().trim() : ''
    const anchors = getSelectionAnchors()
    const origin = location.origin
    if (anchors.length === 1) {
      const a = anchors[0]
      const name = textSel || (a.textContent || '').trim() || a.href
      const url = new URL(a.getAttribute('href') || a.href, origin).href
      return '['.concat(escapeMD(name), '](').concat(escapeMD(url), ')')
    }
    if (anchors.length > 1) {
      return anchors
        .map((a) => {
          const name = (a.textContent || '').trim() || a.href
          const url = new URL(a.getAttribute('href') || a.href, origin).href
          return '- ['.concat(escapeMD(name), '](').concat(escapeMD(url), ')')
        })
        .join('\n')
    }
    if (textSel) {
      const m = /https?:\/\/[^\s)]+/.exec(textSel)
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
      document.body.append(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      ta.remove()
    } catch (e) {}
  }
  function run() {
    const md = buildMarkdown()
    void copyText(md)
  }
  try {
    const gmRegisterMenuCommand = globalThis.GM_registerMenuCommand
    if (typeof gmRegisterMenuCommand === 'function') {
      gmRegisterMenuCommand(
        '\u590D\u5236\u9009\u4E2D\u94FE\u63A5\u4E3A Markdown',
        run
      )
    }
  } catch (e) {}
  globalThis.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyM') {
      e.preventDefault()
      run()
    }
  })
})()
