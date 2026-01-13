import { doc } from '../globals/doc'
import { win } from '../globals/win'
import { extractDomain } from './url'

export function resolveUrlTemplate(
  s: string,
  extraResolvers?: (key: string) => string | undefined
): string {
  const l = win.location || {}
  const href = l.href || ''
  let u: URL | undefined
  try {
    u = new URL(href)
  } catch {}

  const re = /{([^}]+)}/g
  return String(s || '').replaceAll(re, (_, body) => {
    const parts = String(body || '')
      .split('||')
      .map((x) => x.trim())
      .filter(Boolean)

    const resolvers: Record<string, () => string> = {
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
      // text:
      // - Yandex
      // - https://translate.google.com/
      // word:
      // - https://image.baidu.com/search/index?tn=baiduimage&word=
      // search_query:
      // - https://www.youtube.com/results?search_query=
      // qw:
      // - https://tieba.baidu.com/f/search/res?ie=utf-8&qw=
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
        } catch {}

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
          // Use global variable to store selected text from iframes
          // This variable is updated by the main script
          const globalSelected = (globalThis as any)
            .__utags_shortcuts_selected_text__
          if (globalSelected) {
            return encodeURIComponent(globalSelected)
          }

          const text = (win.getSelection() || '').toString().trim()

          return encodeURIComponent(text)
        } catch {}

        return ''
      },
    }

    for (const p of parts) {
      let v = String(resolvers[p]?.() || '').trim()
      if (v) return v

      if (extraResolvers) {
        const extra = extraResolvers(p)
        if (extra !== undefined && extra !== null)
          return encodeURIComponent(String(extra))
      }

      if (p.startsWith('q:')) {
        const key = p.slice(2)
        try {
          v = encodeURIComponent(u?.searchParams.get(key) || '')
        } catch {}
      } else if (p.startsWith('p:')) {
        const index = Number.parseInt(p.slice(2), 10)
        if (!Number.isNaN(index) && index > 0) {
          try {
            const pathname = u?.pathname || ''
            const segments = pathname.split('/').filter(Boolean)
            v = encodeURIComponent(segments[index - 1] || '')
          } catch {}
        }
      } else if (p.startsWith('t:')) {
        v = encodeURIComponent(p.slice(2))
      }

      if (v) return v
    }

    return ''
  })
}
