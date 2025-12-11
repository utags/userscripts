export function resolveUrlTemplate(s: string): string {
  const re = /{([^}]+)}/g
  return String(s || '').replaceAll(re, (_, body) => {
    const parts = String(body || '')
      .split('||')
      .map((x) => x.trim())
      .filter(Boolean)

    const resolvers: Record<string, () => string> = {
      hostname() {
        return (globalThis as any).location?.hostname || ''
      },
      hostname_without_www() {
        const h = (globalThis as any).location?.hostname || ''
        return h.startsWith('www.') ? h.slice(4) : h
      },
      query() {
        try {
          const href = (globalThis as any).location?.href || ''
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
        } catch {}

        return ''
      },
      kw() {
        try {
          const href = (globalThis as any).location?.href || ''
          const u = new URL(href)
          return u.searchParams.get('kw') || ''
        } catch {}

        return ''
      },
      wd() {
        try {
          const href = (globalThis as any).location?.href || ''
          const u = new URL(href)
          return u.searchParams.get('wd') || ''
        } catch {}

        return ''
      },
      keyword() {
        try {
          const href = (globalThis as any).location?.href || ''
          const u = new URL(href)
          return u.searchParams.get('keyword') || ''
        } catch {}

        return ''
      },
      p() {
        try {
          const href = (globalThis as any).location?.href || ''
          const u = new URL(href)
          return u.searchParams.get('p') || ''
        } catch {}

        return ''
      },
      s() {
        try {
          const href = (globalThis as any).location?.href || ''
          const u = new URL(href)
          return u.searchParams.get('s') || ''
        } catch {}

        return ''
      },
      term() {
        try {
          const href = (globalThis as any).location?.href || ''
          const u = new URL(href)
          return u.searchParams.get('term') || ''
        } catch {}

        return ''
      },
      selected() {
        try {
          return (globalThis.getSelection?.() || undefined)?.toString() || ''
        } catch {}

        return ''
      },
    }

    for (const p of parts) {
      const v = String(resolvers[p]?.() || '').trim()
      if (v) return v
    }

    return ''
  })
}
