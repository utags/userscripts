// ==UserScript==
// @name                 🏷️ UTags Import Helper - staging
// @name:zh-CN           🏷️ 小鱼标签 (UTags) 导入助手 - staging
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
// @description          Export tags data from other scripts into UTags backup JSON.
// @description:zh-CN    将其他脚本的标签数据转换为小鱼标签 (UTags) 备份 JSON 并自动下载。
// @icon                 data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ff6361' class='bi bi-tags-fill' viewBox='0 0 16 16'%3E %3Cpath d='M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/%3E %3Cpath d='M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z'/%3E %3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                https://*.v2ex.com/*
// @match                https://*.v2ex.co/*
// @run-at               document-end
// @noframes
// @grant                GM_registerMenuCommand
// ==/UserScript==
//
;(() => {
  'use strict'
  function splitTags(text) {
    if (!text) {
      return []
    }
    let inputText
    if (Array.isArray(text)) {
      inputText = text.join(',')
    } else if (text instanceof Set) {
      inputText = [...text].join(',')
    } else {
      inputText = text
    }
    if (!inputText.trim()) {
      return []
    }
    return [
      ...new Set(
        inputText
          .replaceAll(
            /[ \t\f\v\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/g,
            ' '
          )
          .split(/[,，\n\r]+/)
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
    ]
  }
  function registerMenu(caption, onClick, options) {
    if (typeof GM_registerMenuCommand === 'function') {
      return GM_registerMenuCommand(caption, onClick, options)
    }
    return 0
  }
  var win = globalThis
  function isTopFrame() {
    return win.self === win.top
  }
  var V2EX_NEXT_TAG_PREFIX = '--\u7528\u6237\u6807\u7B7E--'
  var V2EX_POLISH_SETTINGS_PREFIX = 'V2EX_Polish_settings'
  var MENU_NEXT_TEXT_ZH =
    '\u{1F3F7}\uFE0F \u4ECE V2EX Next \u5BFC\u51FA\u4E3A UTags \u5907\u4EFD'
  var MENU_NEXT_TEXT_EN =
    '\u{1F3F7}\uFE0F Export V2EX Next tags to UTags backup'
  var MENU_POLISH_TEXT_ZH =
    '\u{1F3F7}\uFE0F \u4ECE V2EX Polish \u5BFC\u51FA\u4E3A UTags \u5907\u4EFD'
  var MENU_POLISH_TEXT_EN =
    '\u{1F3F7}\uFE0F Export V2EX Polish tags to UTags backup'
  function isZhLikeLang(lang) {
    const s = String(lang || '').toLowerCase()
    return s.startsWith('zh')
  }
  function getMenuText(next) {
    var _a
    const lang =
      ((_a = globalThis.navigator) == null ? void 0 : _a.language) || ''
    if (next) return isZhLikeLang(lang) ? MENU_NEXT_TEXT_ZH : MENU_NEXT_TEXT_EN
    return isZhLikeLang(lang) ? MENU_POLISH_TEXT_ZH : MENU_POLISH_TEXT_EN
  }
  function parseHtml(html) {
    return new DOMParser().parseFromString(String(html || ''), 'text/html')
  }
  async function fetchText(url) {
    const res = await fetch(url, { credentials: 'same-origin' })
    if (!res.ok)
      throw new Error('HTTP '.concat(res.status, ' ').concat(res.statusText))
    return res.text()
  }
  function extractNoteIdFromHref(href) {
    try {
      const url = new URL(href, location.origin)
      const re = /(\d+)\/?$/
      const m = re.exec(url.pathname)
      if (m && m[1]) return m[1]
    } catch (e) {}
    return void 0
  }
  async function findNoteIdByTitleContains(prefix) {
    const html = await fetchText(''.concat(location.origin, '/notes'))
    const doc = parseHtml(html)
    const links = Array.from(
      doc.querySelectorAll('#Main .box .note_item_title a')
    )
    for (const el of links) {
      const text = (el.textContent || '').trim()
      if (!text || !text.includes(prefix)) continue
      const href = el.getAttribute('href') || ''
      const id = extractNoteIdFromHref(href)
      if (id) return id
    }
    throw new Error(
      '\u672A\u627E\u5230\u7B14\u8BB0\uFF1A'.concat(
        prefix,
        '\uFF08\u53EF\u80FD\u672A\u5F00\u542F\u6216\u672A\u767B\u5F55\uFF09'
      )
    )
  }
  async function getNoteJsonContent(id, prefix) {
    const html = await fetchText(
      ''.concat(location.origin, '/notes/edit/').concat(id)
    )
    const doc = parseHtml(html)
    const el = doc.querySelector('.note_editor')
    const raw =
      el instanceof HTMLTextAreaElement
        ? String(el.value || el.textContent || '')
        : String((el == null ? void 0 : el.textContent) || '')
    const text = raw.trim()
    if (!text) return {}
    if (text === prefix) return {}
    const idx = text.startsWith(prefix) ? prefix.length : text.indexOf(prefix)
    if (idx < 0) return {}
    const jsonText = text.slice(
      idx + (idx === prefix.length ? 0 : prefix.length)
    )
    try {
      return JSON.parse(jsonText)
    } catch (e) {
      return {}
    }
  }
  function normalizeTags(raw) {
    if (typeof raw !== 'string' && !Array.isArray(raw)) return []
    return splitTags(raw)
  }
  function normalizeV2exNextTagsMap(raw) {
    if (!raw || typeof raw !== 'object') return {}
    const obj = raw
    const out = {}
    for (const [usernameRaw, tagsRaw] of Object.entries(obj)) {
      const username = String(usernameRaw || '').trim()
      if (!username) continue
      const tags = normalizeTags(tagsRaw)
      if (tags.length === 0) continue
      out[username] = tags
    }
    return out
  }
  function normalizeV2exPolishTagsMap(raw) {
    if (!raw || typeof raw !== 'object') return {}
    const obj = raw
    const memberTag = obj['member-tag']
    if (!memberTag || typeof memberTag !== 'object') return {}
    const map = memberTag
    const out = {}
    for (const [usernameRaw, dataRaw] of Object.entries(map)) {
      const username = String(usernameRaw || '').trim()
      if (!username) continue
      if (!dataRaw || typeof dataRaw !== 'object') continue
      const tagsRaw = dataRaw.tags
      const tags = normalizeTags(tagsRaw)
      if (tags.length === 0) continue
      out[username] = tags
    }
    return out
  }
  function buildUtagsBackupFromUsernameTagsMap(tagsMap, now) {
    const data = {}
    const allTags = /* @__PURE__ */ new Set()
    let totalTagsCount = 0
    const domains = /* @__PURE__ */ new Set()
    for (const [username, tags] of Object.entries(tagsMap)) {
      const url = 'https://www.v2ex.com/member/'.concat(
        encodeURIComponent(username)
      )
      data[url] = {
        tags,
        meta: {
          title: username,
          updated: now,
          created: now,
        },
      }
      for (const t of tags) allTags.add(t)
      totalTagsCount += tags.length
      try {
        domains.add(new URL(url).hostname)
      } catch (e) {}
    }
    return {
      data,
      meta: {
        databaseVersion: 3,
        exported: now,
        stats: {
          bookmarksCount: Object.keys(data).length,
          tagsCount: allTags.size,
          totalTagsCount,
          domainsCount: domains.size,
        },
        updated: now,
        created: now,
      },
    }
  }
  function formatTimeForFileName(ts) {
    const d = new Date(ts)
    const pad2 = (n) => String(n).padStart(2, '0')
    const yyyy = d.getFullYear()
    const mm = pad2(d.getMonth() + 1)
    const dd = pad2(d.getDate())
    const hh = pad2(d.getHours())
    const mi = pad2(d.getMinutes())
    const ss = pad2(d.getSeconds())
    return ''
      .concat(yyyy)
      .concat(mm)
      .concat(dd, '_')
      .concat(hh)
      .concat(mi)
      .concat(ss)
  }
  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    ;(document.body || document.documentElement).append(a)
    a.click()
    a.remove()
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 3e4)
  }
  function stringifyError(error) {
    if (error instanceof Error) return error.message
    return String(error)
  }
  async function exportV2exNextAsUtagsBackup() {
    var _a
    const now = Date.now()
    const noteId = await findNoteIdByTitleContains(V2EX_NEXT_TAG_PREFIX)
    const raw = await getNoteJsonContent(noteId, V2EX_NEXT_TAG_PREFIX)
    const tagsMap = normalizeV2exNextTagsMap(raw)
    const backup = buildUtagsBackupFromUsernameTagsMap(tagsMap, now)
    const fileName = 'utags-backup-v2ex-next-'.concat(
      formatTimeForFileName(now),
      '.json'
    )
    const jsonText = ''.concat(JSON.stringify(backup, null, 2), '\n')
    downloadTextFile(fileName, jsonText)
    const msg = isZhLikeLang(
      ((_a = globalThis.navigator) == null ? void 0 : _a.language) || ''
    )
      ? '\u5DF2\u5BFC\u51FA\uFF1A'
          .concat(backup.meta.stats.bookmarksCount, ' \u4E2A\u4E66\u7B7E\uFF0C')
          .concat(backup.meta.stats.tagsCount, ' \u4E2A\u6807\u7B7E')
      : 'Exported: '
          .concat(backup.meta.stats.bookmarksCount, ' bookmarks, ')
          .concat(backup.meta.stats.tagsCount, ' tags')
    try {
      if (typeof globalThis.alert === 'function') globalThis.alert(msg)
    } catch (e) {}
  }
  async function exportV2exPolishAsUtagsBackup() {
    var _a
    const now = Date.now()
    const noteId = await findNoteIdByTitleContains(V2EX_POLISH_SETTINGS_PREFIX)
    const raw = await getNoteJsonContent(noteId, V2EX_POLISH_SETTINGS_PREFIX)
    const tagsMap = normalizeV2exPolishTagsMap(raw)
    const backup = buildUtagsBackupFromUsernameTagsMap(tagsMap, now)
    const fileName = 'utags-backup-v2ex-polish-'.concat(
      formatTimeForFileName(now),
      '.json'
    )
    const jsonText = ''.concat(JSON.stringify(backup, null, 2), '\n')
    downloadTextFile(fileName, jsonText)
    const msg = isZhLikeLang(
      ((_a = globalThis.navigator) == null ? void 0 : _a.language) || ''
    )
      ? '\u5DF2\u5BFC\u51FA\uFF1A'
          .concat(backup.meta.stats.bookmarksCount, ' \u4E2A\u4E66\u7B7E\uFF0C')
          .concat(backup.meta.stats.tagsCount, ' \u4E2A\u6807\u7B7E')
      : 'Exported: '
          .concat(backup.meta.stats.bookmarksCount, ' bookmarks, ')
          .concat(backup.meta.stats.tagsCount, ' tags')
    try {
      if (typeof globalThis.alert === 'function') globalThis.alert(msg)
    } catch (e) {}
  }
  function main() {
    try {
      if (document.contentType !== 'text/html') return
      const de = document.documentElement
      if (!(de instanceof HTMLElement) || de.tagName !== 'HTML') return
      if (de.dataset && de.dataset.utagsImportHelper === '1') return
      if (de.dataset) de.dataset.utagsImportHelper = '1'
    } catch (e) {}
    if (!isTopFrame()) return
    registerMenu(getMenuText(true), async () => {
      var _a
      try {
        await exportV2exNextAsUtagsBackup()
      } catch (error) {
        const msg = isZhLikeLang(
          ((_a = globalThis.navigator) == null ? void 0 : _a.language) || ''
        )
          ? '\u5BFC\u51FA\u5931\u8D25\uFF1A'.concat(stringifyError(error))
          : 'Export failed: '.concat(stringifyError(error))
        try {
          if (typeof globalThis.alert === 'function') globalThis.alert(msg)
        } catch (e) {}
        console.error(error)
      }
    })
    registerMenu(getMenuText(false), async () => {
      var _a
      try {
        await exportV2exPolishAsUtagsBackup()
      } catch (error) {
        const msg = isZhLikeLang(
          ((_a = globalThis.navigator) == null ? void 0 : _a.language) || ''
        )
          ? '\u5BFC\u51FA\u5931\u8D25\uFF1A'.concat(stringifyError(error))
          : 'Export failed: '.concat(stringifyError(error))
        try {
          if (typeof globalThis.alert === 'function') globalThis.alert(msg)
        } catch (e) {}
        console.error(error)
      }
    })
  }
  main()
})()
