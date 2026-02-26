import { getValue, setValue } from 'browser-extension-storage'
import md5 from 'crypto-js/md5'

import {
  ALLOWED_FORMATS,
  CUSTOM_FORMATS_KEY,
  DEFAULT_FORMAT,
  I18N,
} from './constants'

export function detectLanguage(): string {
  try {
    const browserLang = (
      navigator.language ||
      (navigator as Navigator & { userLanguage?: string }).userLanguage ||
      'en'
    ).toLowerCase()
    const supported = Object.keys(I18N)
    if (supported.includes(browserLang)) return browserLang
    const base = browserLang.split('-')[0]
    const match = supported.find((l) => l.startsWith(base + '-'))
    return match || 'en'
  } catch {
    return 'en'
  }
}

export const USER_LANG = detectLanguage()

export function t(key: string): string {
  return (I18N[USER_LANG] && I18N[USER_LANG][key]) || I18N.en[key] || key
}

export function tpl(
  str: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  return String(str).replaceAll(
    /{(\w+)}/g,
    (_: string, k: string) => `${params?.[k] ?? ''}`
  )
}

// Utility: normalize a host string consistently (trim and strip leading 'www.')
export function normalizeHost(h: any) {
  try {
    h = String(h || '').trim()
    return h.startsWith('www.') ? h.slice(4) : h
  } catch {
    return h
  }
}

/**
 * ensureAllowedValue
 * Returns `value` if it is contained in `allowedValues`,
 * otherwise returns `defaultValue` (or `undefined` when omitted).
 *
 * - `allowedValues` may be any array; non-array or empty lists yield `defaultValue`/`undefined`.
 * - Optimizes lookups for larger lists via `Set`.
 * - Does not coerce types; comparison is strict equality against items in `allowedValues`.
 */
export function ensureAllowedValue(
  value: any,
  allowedValues: any[],
  defaultValue?: any
) {
  if (!Array.isArray(allowedValues) || allowedValues.length === 0) {
    return defaultValue
  }

  if (allowedValues.length < 8) {
    return allowedValues.includes(value) ? value : defaultValue
  }

  const set = new Set(allowedValues)
  return set.has(value) ? value : defaultValue
}

export type CustomFormat = { name: string; template: string }

export async function getCustomFormats() {
  try {
    const list = (await getValue<CustomFormat[]>(CUSTOM_FORMATS_KEY, [])) || []
    if (!Array.isArray(list)) return []
    return list
      .map((it) => ({
        name: String(it?.name || '').trim(),
        template: String(it?.template || ''),
      }))
      .filter((it) => it.name && it.template)
  } catch {
    return []
  }
}

export async function setCustomFormats(list: CustomFormat[]): Promise<void> {
  try {
    const arr = Array.isArray(list) ? list : []
    const normalized = arr
      .map((it) => ({
        name: String(it?.name || '').trim(),
        template: String(it?.template || ''),
      }))
      .filter((it) => it.name && it.template)
    // de-duplicate by name (last wins)
    const map = new Map()
    for (const it of normalized) map.set(it.name, it.template)
    const out = Array.from(map.entries()).map(([name, template]) => ({
      name,
      template,
    }))
    await setValue(CUSTOM_FORMATS_KEY, out)
  } catch {}
}

export async function upsertCustomFormat(
  name: string,
  template: string
): Promise<void> {
  try {
    name = String(name || '').trim()
    template = String(template || '')
    if (!name || !template) return
    const list = await getCustomFormats()
    const idx = list.findIndex((it) => it.name === name)
    if (idx === -1) {
      list.push({ name, template })
    } else {
      list[idx] = { name, template }
    }

    await setCustomFormats(list)
  } catch {}
}

export async function removeCustomFormat(name: string): Promise<void> {
  try {
    name = String(name || '').trim()
    if (!name) return
    const customFormats = await getCustomFormats()
    const list = customFormats.filter((it) => it.name !== name)
    await setCustomFormats(list)
  } catch {}
}

export async function getAllowedFormats() {
  try {
    const customFormats = await getCustomFormats()
    return [...ALLOWED_FORMATS, ...customFormats.map((f) => f.name)]
  } catch {
    return [...ALLOWED_FORMATS]
  }
}

export async function ensureAllowedFormat(fmt: any) {
  return ensureAllowedValue(fmt, await getAllowedFormats(), DEFAULT_FORMAT)
}

export const md5Encode = (str: string) => {
  return md5(str).toString()
}
