import { splitTags } from 'utags-utils'

import { registerMenu } from '../../common/gm'
import { isTopFrame } from '../../utils/is-top-frame'

type V2exNextTagsMap = Record<string, string[]>

type UTagsBookmark = {
  tags: string[]
  meta: {
    title: string
    updated: number
    created: number
  }
}

type UTagsBackup = {
  data: Record<string, UTagsBookmark>
  meta: {
    databaseVersion: 3
    exported: number
    stats: {
      bookmarksCount: number
      tagsCount: number
      totalTagsCount: number
      domainsCount: number
    }
    updated: number
    created: number
  }
}

const V2EX_NEXT_TAG_PREFIX = '--用户标签--'
const V2EX_POLISH_SETTINGS_PREFIX = 'V2EX_Polish_settings'

const MENU_NEXT_TEXT_ZH = '🏷️ 从 V2EX Next 导出为 UTags 备份'
const MENU_NEXT_TEXT_EN = '🏷️ Export V2EX Next tags to UTags backup'
const MENU_POLISH_TEXT_ZH = '🏷️ 从 V2EX Polish 导出为 UTags 备份'
const MENU_POLISH_TEXT_EN = '🏷️ Export V2EX Polish tags to UTags backup'

function isZhLikeLang(lang: string): boolean {
  const s = String(lang || '').toLowerCase()
  return s.startsWith('zh')
}

function getMenuText(next: boolean): string {
  const lang = globalThis.navigator?.language || ''
  if (next) return isZhLikeLang(lang) ? MENU_NEXT_TEXT_ZH : MENU_NEXT_TEXT_EN

  return isZhLikeLang(lang) ? MENU_POLISH_TEXT_ZH : MENU_POLISH_TEXT_EN
}

function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(String(html || ''), 'text/html')
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { credentials: 'same-origin' })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

  return res.text()
}

function extractNoteIdFromHref(href: string): string | undefined {
  try {
    const url = new URL(href, location.origin)
    const re = /(\d+)\/?$/
    const m = re.exec(url.pathname)
    if (m && m[1]) return m[1]
  } catch {}

  return undefined
}

async function findNoteIdByTitleContains(prefix: string): Promise<string> {
  const html = await fetchText(`${location.origin}/notes`)
  const doc = parseHtml(html)
  const links = Array.from(
    doc.querySelectorAll('#Main .box .note_item_title a')
  )
  for (const el of links) {
    const text = (el.textContent || '').trim()
    if (!text || !text.includes(prefix)) continue
    const href = (el as HTMLAnchorElement).getAttribute('href') || ''
    const id = extractNoteIdFromHref(href)
    if (id) return id
  }

  throw new Error(`未找到笔记：${prefix}（可能未开启或未登录）`)
}

async function getNoteJsonContent(
  id: string,
  prefix: string
): Promise<unknown> {
  const html = await fetchText(`${location.origin}/notes/edit/${id}`)
  const doc = parseHtml(html)
  const el = doc.querySelector('.note_editor')
  const raw =
    el instanceof HTMLTextAreaElement
      ? String(el.value || el.textContent || '')
      : String(el?.textContent || '')
  const text = raw.trim()
  if (!text) return {}
  if (text === prefix) return {}

  const idx = text.startsWith(prefix) ? prefix.length : text.indexOf(prefix)
  if (idx < 0) return {}
  const jsonText = text.slice(idx + (idx === prefix.length ? 0 : prefix.length))
  try {
    return JSON.parse(jsonText)
  } catch {
    return {}
  }
}

function normalizeTags(raw: unknown): string[] {
  if (typeof raw !== 'string' && !Array.isArray(raw)) return []

  return splitTags(raw)
}

function normalizeV2exNextTagsMap(raw: unknown): V2exNextTagsMap {
  if (!raw || typeof raw !== 'object') return {}

  const obj = raw as Record<string, unknown>
  const out: V2exNextTagsMap = {}
  for (const [usernameRaw, tagsRaw] of Object.entries(obj)) {
    const username = String(usernameRaw || '').trim()
    if (!username) continue
    const tags = normalizeTags(tagsRaw)
    if (tags.length === 0) continue
    out[username] = tags
  }

  return out
}

function normalizeV2exPolishTagsMap(raw: unknown): V2exNextTagsMap {
  if (!raw || typeof raw !== 'object') return {}

  const obj = raw as Record<string, unknown>
  const memberTag = obj['member-tag']
  if (!memberTag || typeof memberTag !== 'object') return {}

  const map = memberTag as Record<string, unknown>
  const out: V2exNextTagsMap = {}
  for (const [usernameRaw, dataRaw] of Object.entries(map)) {
    const username = String(usernameRaw || '').trim()
    if (!username) continue
    if (!dataRaw || typeof dataRaw !== 'object') continue
    const tagsRaw = (dataRaw as Record<string, unknown>).tags
    const tags = normalizeTags(tagsRaw)
    if (tags.length === 0) continue
    out[username] = tags
  }

  return out
}

function buildUtagsBackupFromUsernameTagsMap(
  tagsMap: V2exNextTagsMap,
  now: number
): UTagsBackup {
  const data: Record<string, UTagsBookmark> = {}
  const allTags = new Set<string>()
  let totalTagsCount = 0
  const domains = new Set<string>()

  for (const [username, tags] of Object.entries(tagsMap)) {
    const url = `https://www.v2ex.com/member/${encodeURIComponent(username)}`
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
    } catch {}
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

function formatTimeForFileName(ts: number): string {
  const d = new Date(ts)
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const mi = pad2(d.getMinutes())
  const ss = pad2(d.getSeconds())
  return `${yyyy}${mm}${dd}_${hh}${mi}${ss}`
}

function downloadTextFile(filename: string, text: string): void {
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
  }, 30_000)
}

function stringifyError(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

async function exportV2exNextAsUtagsBackup(): Promise<void> {
  const now = Date.now()
  const noteId = await findNoteIdByTitleContains(V2EX_NEXT_TAG_PREFIX)
  const raw = await getNoteJsonContent(noteId, V2EX_NEXT_TAG_PREFIX)
  const tagsMap = normalizeV2exNextTagsMap(raw)

  const backup = buildUtagsBackupFromUsernameTagsMap(tagsMap, now)
  const fileName = `utags-backup-v2ex-next-${formatTimeForFileName(now)}.json`
  const jsonText = `${JSON.stringify(backup, null, 2)}\n`
  downloadTextFile(fileName, jsonText)

  const msg = isZhLikeLang(globalThis.navigator?.language || '')
    ? `已导出：${backup.meta.stats.bookmarksCount} 个书签，${backup.meta.stats.tagsCount} 个标签`
    : `Exported: ${backup.meta.stats.bookmarksCount} bookmarks, ${backup.meta.stats.tagsCount} tags`
  try {
    if (typeof globalThis.alert === 'function') globalThis.alert(msg)
  } catch {}
}

async function exportV2exPolishAsUtagsBackup(): Promise<void> {
  const now = Date.now()
  const noteId = await findNoteIdByTitleContains(V2EX_POLISH_SETTINGS_PREFIX)
  const raw = await getNoteJsonContent(noteId, V2EX_POLISH_SETTINGS_PREFIX)
  const tagsMap = normalizeV2exPolishTagsMap(raw)

  const backup = buildUtagsBackupFromUsernameTagsMap(tagsMap, now)
  const fileName = `utags-backup-v2ex-polish-${formatTimeForFileName(now)}.json`
  const jsonText = `${JSON.stringify(backup, null, 2)}\n`
  downloadTextFile(fileName, jsonText)

  const msg = isZhLikeLang(globalThis.navigator?.language || '')
    ? `已导出：${backup.meta.stats.bookmarksCount} 个书签，${backup.meta.stats.tagsCount} 个标签`
    : `Exported: ${backup.meta.stats.bookmarksCount} bookmarks, ${backup.meta.stats.tagsCount} tags`
  try {
    if (typeof globalThis.alert === 'function') globalThis.alert(msg)
  } catch {}
}

function main(): void {
  try {
    if (document.contentType !== 'text/html') return
    const de = document.documentElement
    if (!(de instanceof HTMLElement) || de.tagName !== 'HTML') return
    if (de.dataset && de.dataset.utagsImportHelper === '1') return
    if (de.dataset) de.dataset.utagsImportHelper = '1'
  } catch {}

  if (!isTopFrame()) return

  registerMenu(getMenuText(true), async () => {
    try {
      await exportV2exNextAsUtagsBackup()
    } catch (error: unknown) {
      const msg = isZhLikeLang(globalThis.navigator?.language || '')
        ? `导出失败：${stringifyError(error)}`
        : `Export failed: ${stringifyError(error)}`
      try {
        if (typeof globalThis.alert === 'function') globalThis.alert(msg)
      } catch {}

      console.error(error)
    }
  })

  registerMenu(getMenuText(false), async () => {
    try {
      await exportV2exPolishAsUtagsBackup()
    } catch (error: unknown) {
      const msg = isZhLikeLang(globalThis.navigator?.language || '')
        ? `导出失败：${stringifyError(error)}`
        : `Export failed: ${stringifyError(error)}`
      try {
        if (typeof globalThis.alert === 'function') globalThis.alert(msg)
      } catch {}

      console.error(error)
    }
  })
}

main()
