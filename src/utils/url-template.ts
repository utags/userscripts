import { extractDomain } from './url'

export function resolveUrlTemplate(s: string): string {
  const l = (globalThis as any).location || {}
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
      query() {
        try {
          if (!u) return ''
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
        return document.title || ''
      },
      current_title_encoded() {
        return encodeURIComponent(document.title || '')
      },
      selected() {
        try {
          return (globalThis.getSelection?.() || undefined)?.toString() || ''
        } catch {}

        return ''
      },
    }

    for (const p of parts) {
      let v = String(resolvers[p]?.() || '').trim()
      if (v) return v

      if (p.startsWith('q:')) {
        const key = p.slice(2)
        try {
          v = u?.searchParams.get(key) || ''
        } catch {}
      } else if (p.startsWith('p:')) {
        const index = Number.parseInt(p.slice(2), 10)
        if (!Number.isNaN(index) && index > 0) {
          try {
            const pathname = u?.pathname || ''
            const segments = pathname.split('/').filter(Boolean)
            v = segments[index - 1] || ''
          } catch {}
        }
      } else if (p.startsWith('te:')) {
        v = encodeURIComponent(p.slice(3))
      } else if (p.startsWith('t:')) {
        v = p.slice(2)
      }

      if (v) return v
    }

    return ''
  })
}
