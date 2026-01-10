import { querySelectorAllDeep } from '../../utils/dom'
import { uid } from '../../utils/uid'
import { type OpenMode } from './types'

function ensurePickerStylesIn(r: Document | ShadowRoot) {
  const has = (r as any).querySelector?.('#ushortcuts-picker-styles')
  if (has) return
  const st = document.createElement('style')
  st.id = 'ushortcuts-picker-styles'
  st.textContent =
    '.ushortcuts-picker-highlight{outline:2px dashed #ef4444!important;outline-offset:0!important;box-shadow:0 0 0 2px rgba(239,68,68,.35) inset!important;cursor:pointer!important;}' +
    '.ushortcuts-picker-tip{position:fixed;top:12px;right:12px;z-index:2147483647;background:#fff;color:#111827;border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;box-shadow:0 10px 20px rgba(0,0,0,0.1);font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";}'
  if (r instanceof Document) {
    r.head.append(st)
  } else {
    r.append(st)
  }
}

export function addCurrentPageLinkToGroup(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
  },
  groupId: string,
  openMode: OpenMode
) {
  const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
  if (!grp) return
  let nm = '当前网页'
  let href = location.href
  try {
    nm = document.title || nm
  } catch {}

  try {
    href = location.href
  } catch {}

  if (hasDuplicateInGroup(grp, 'url', String(href || '/'))) {
    const ok = globalThis.confirm('该分组内已存在相同的 URL，是否继续添加？')
    if (!ok) return
  }

  const it = {
    id: uid(),
    name: String(nm || href),
    icon: 'favicon',
    type: 'url',
    data: String(href || '/'),
    openIn: openMode,
  }
  grp.items.push(it)
  try {
    helpers.saveConfig(cfg)
  } catch {}

  try {
    helpers.rerender(root, cfg)
  } catch {}
}

export function pickLinkFromPageAndAdd(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
  },
  groupId: string,
  openMode: OpenMode,
  opts?: { beforeStart?: () => void; afterFinish?: () => void }
) {
  const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
  if (!grp) return

  pickLinkFromPage(root, {
    beforeStart: opts?.beforeStart,
    afterFinish: opts?.afterFinish,
    onPicked(nm, href) {
      if (hasDuplicateInGroup(grp, 'url', String(href || '/'))) {
        const ok = globalThis.confirm(
          '该分组内已存在相同的 URL，是否继续添加？'
        )
        if (!ok) return
      }

      const it = {
        id: uid(),
        name: nm,
        icon: 'favicon',
        type: 'url',
        data: href,
        openIn: openMode,
      }

      grp.items.push(it)

      try {
        helpers.saveConfig(cfg)
      } catch {}

      try {
        helpers.rerender(root, cfg)
      } catch {}
    },
  })
}

export function pickLinkFromPage(
  root: ShadowRoot,
  opts: {
    beforeStart?: () => void
    afterFinish?: () => void
    onPicked: (name: string, href: string) => void
  }
) {
  ensurePickerStylesIn(document)
  if (opts.beforeStart) {
    try {
      opts.beforeStart()
    } catch {}
  }

  const tip = document.createElement('div')
  tip.className = 'ushortcuts-picker-tip'
  tip.textContent = '点击红框链接添加，ESC 取消'
  document.body.append(tip)

  const anchors = querySelectorAllDeep(document, 'a[href]').filter((el) => {
    const href = (el.getAttribute('href') || '').trim()
    if (!href || href === '#') return false
    let u: URL
    try {
      u = new URL(href, location.href)
    } catch {
      return false
    }

    return u.protocol === 'http:' || u.protocol === 'https:'
  })

  const panelEl = root.querySelector<HTMLDivElement>('.ushortcuts')
  const prevPanelDisplay =
    panelEl instanceof HTMLDivElement ? panelEl.style.display || '' : ''
  if (panelEl instanceof HTMLDivElement) panelEl.style.display = 'none'

  const cleanup = () => {
    for (const a of anchors) a.classList.remove('ushortcuts-picker-highlight')
    try {
      tip.remove()
    } catch {}

    if (panelEl instanceof HTMLDivElement)
      panelEl.style.display = prevPanelDisplay
    try {
      const ov = document.querySelector('#ushortcuts-picker-overlay')
      ov?.remove()
    } catch {}

    if (opts.afterFinish) {
      try {
        opts.afterFinish()
      } catch {}
    }
  }

  const onEsc = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      document.removeEventListener('keydown', onEsc, true)
      cleanup()
    }
  }

  document.addEventListener('keydown', onEsc, true)

  for (const a of anchors) {
    const rn = a.getRootNode()
    if (rn instanceof Document || rn instanceof ShadowRoot)
      ensurePickerStylesIn(rn)
    a.classList.add('ushortcuts-picker-highlight')
  }

  const overlay = document.createElement('div')
  overlay.id = 'ushortcuts-picker-overlay'
  overlay.style.position = 'fixed'
  overlay.style.inset = '0'
  overlay.style.zIndex = '2147483647'
  overlay.style.background = 'transparent'
  overlay.style.cursor = 'crosshair'

  const onOverlayClick = (ev: MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    ev.stopImmediatePropagation?.()
    let picked: HTMLAnchorElement | undefined
    try {
      const x = ev.clientX
      const y = ev.clientY
      const seen = new Set<Element>()
      const search = (
        r: Document | ShadowRoot
      ): HTMLAnchorElement | undefined => {
        const arr = r.elementsFromPoint(x, y)
        for (const el of arr) {
          if (el === overlay) continue
          if (seen.has(el)) continue
          seen.add(el)
          const a = el.closest?.('a[href]')
          if (a instanceof HTMLAnchorElement) return a
          const sr = (el as any).shadowRoot as ShadowRoot | undefined
          if (sr) {
            const inner = search(sr)
            if (inner) return inner
          }
        }

        return undefined
      }

      picked = search(document)
      if (picked) {
        const href = picked.href
        const text = (picked.textContent || '').trim() || href
        try {
          opts.onPicked(text, href)
        } catch {}
      }
    } catch {}

    if (picked) {
      document.removeEventListener('keydown', onEsc, true)
      cleanup()
    }
  }

  overlay.addEventListener('click', onOverlayClick, true)
  document.body.append(overlay)
}

export function hasDuplicateInGroup(
  grp: any,
  type: 'url' | 'js',
  data: string,
  excludeId?: string
) {
  const d = String(data || '').trim()
  return (grp.items || []).some((x: any) => {
    if (!x || x.type !== type) return false
    const xd = String(x.data || '').trim()
    if (excludeId && x.id === excludeId) return false
    return xd === d
  })
}
