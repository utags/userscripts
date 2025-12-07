import { querySelectorAllDeep } from '../../utils/dom'
import { createOpenModeRadios } from './open-mode-radio'

export function openAddLinkModal(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
    defaultOpen: 'same-tab' | 'new-tab'
    defaultGroupId?: string
  }
) {
  for (const n of Array.from(root.querySelectorAll('.modal-mask'))) n.remove()

  const mask = document.createElement('div')
  mask.className = 'modal-mask'
  try {
    ;(mask.style as any).zIndex = '2147483649'
  } catch {}

  const modal = document.createElement('div')
  modal.className = 'modal'
  try {
    const panel = root.querySelector('.utqn')
    const isDarkPanel = panel?.classList.contains('dark')
    if (isDarkPanel) modal.classList.add('dark')
  } catch {}

  const h2 = document.createElement('h2')
  h2.textContent = '添加链接'

  const grid = document.createElement('div')
  grid.className = 'grid'
  try {
    ;(grid.style as any).gridTemplateColumns = '1fr'
  } catch {}

  const grpRow = document.createElement('div')
  grpRow.className = 'row'
  const grpLabel = document.createElement('label')
  grpLabel.textContent = '分组'
  const grpSel = document.createElement('select')
  const firstGroup = (cfg.groups && cfg.groups[0]) || undefined
  const defaultGroup =
    helpers.defaultGroupId || (firstGroup && firstGroup.id) || ''
  for (const g of cfg.groups || []) {
    const o = document.createElement('option')
    o.value = g.id
    o.textContent = g.name
    if (g.id === defaultGroup) o.selected = true
    grpSel.append(o)
  }

  grpRow.append(grpLabel)
  grpRow.append(grpSel)

  const nameRow = document.createElement('div')
  nameRow.className = 'row'
  const nameLabel = document.createElement('label')
  nameLabel.textContent = '名称'
  const nameInput = document.createElement('input')
  nameInput.value = '新项'
  nameRow.append(nameLabel)
  nameRow.append(nameInput)

  const iconRow = document.createElement('div')
  iconRow.className = 'row'
  const iconLabel = document.createElement('label')
  iconLabel.textContent = '图标'
  const iconInput = document.createElement('input')
  iconInput.placeholder =
    'lucide:home | url:https://... | emoji | favicon[:16|32|64]'
  iconRow.append(iconLabel)
  iconRow.append(iconInput)

  const urlRow = document.createElement('div')
  urlRow.className = 'row'
  const urlLabel = document.createElement('label')
  urlLabel.textContent = 'URL'
  const urlInput = document.createElement('input')
  urlInput.placeholder = 'https://...'
  urlInput.value = '/'
  urlRow.append(urlLabel)
  urlRow.append(urlInput)

  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '打开方式'
  let openValue: 'same-tab' | 'new-tab' = helpers.defaultOpen || 'same-tab'
  const openRadios = createOpenModeRadios(openValue, (m) => {
    openValue = m
  })

  openRow.append(openLabel)
  openRow.append(openRadios)

  const quickRow = document.createElement('div')
  quickRow.className = 'row'
  const addCurrentBtn = document.createElement('button')
  addCurrentBtn.className = 'btn btn-secondary'
  addCurrentBtn.textContent = '添加当前网页'
  const pickLinksBtn = document.createElement('button')
  pickLinksBtn.className = 'btn btn-secondary'
  pickLinksBtn.textContent = '从当前网页采集链接'
  quickRow.append(addCurrentBtn)
  quickRow.append(pickLinksBtn)

  addCurrentBtn.addEventListener('click', () => {
    try {
      nameInput.value = document.title || '当前网页'
      urlInput.value = location.href
    } catch {}
  })

  pickLinksBtn.addEventListener('click', () => {
    try {
      const ensurePickerStylesIn = (r: Document | ShadowRoot) => {
        const has = (r as any).querySelector?.('#utqn-picker-styles')
        if (has) return
        const st = document.createElement('style')
        st.id = 'utqn-picker-styles'
        st.textContent =
          '.utqn-picker-highlight{outline:2px dashed #ef4444!important;outline-offset:0!important;box-shadow:0 0 0 2px rgba(239,68,68,.35) inset!important;cursor:pointer!important;}' +
          '.utqn-picker-tip{position:fixed;top:12px;right:12px;z-index:2147483647;background:#fff;color:#111827;border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;box-shadow:0 10px 20px rgba(0,0,0,0.1);font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";}'
        if (r instanceof Document) {
          r.head.append(st)
        } else {
          r.append(st)
        }
      }

      ensurePickerStylesIn(document)
      modal.style.display = 'none'
      mask.remove()
      const tip = document.createElement('div')
      tip.className = 'utqn-picker-tip'
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

      const handlers: Array<{ el: Element; fn: (ev: Event) => void }> = []

      const panelEl = root.querySelector('.utqn')
      const prevPanelDisplay =
        panelEl instanceof HTMLElement ? panelEl.style.display || '' : ''
      if (panelEl instanceof HTMLElement) panelEl.style.display = 'none'

      const cleanup = () => {
        for (const { el, fn } of handlers)
          el.removeEventListener('click', fn, true)
        for (const a of anchors) a.classList.remove('utqn-picker-highlight')
        try {
          tip.remove()
        } catch {}

        modal.style.display = ''
        root.append(mask)
        if (panelEl instanceof HTMLElement)
          panelEl.style.display = prevPanelDisplay
        try {
          const ov = document.querySelector('#utqn-picker-overlay')
          ov?.remove()
        } catch {}
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
        a.classList.add('utqn-picker-highlight')
      }

      const overlay = document.createElement('div')
      overlay.id = 'utqn-picker-overlay'
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
            nameInput.value = text
            urlInput.value = href
          }
        } catch {}

        if (picked) {
          document.removeEventListener('keydown', onEsc, true)
          cleanup()
        }
      }

      overlay.addEventListener('click', onOverlayClick, true)
      handlers.push({ el: overlay, fn: onOverlayClick as any })
      document.body.append(overlay)
    } catch {}
  })

  const actions = document.createElement('div')
  actions.className = 'row'
  const saveBtn = document.createElement('button')
  saveBtn.className = 'btn btn-primary'
  saveBtn.textContent = '添加'
  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'btn btn-secondary'
  cancelBtn.textContent = '取消'

  saveBtn.addEventListener('click', () => {
    const gid = grpSel.value
    const grp = (cfg.groups || []).find((g: any) => g.id === gid)
    if (!grp) return
    const rawIcon = iconInput.value.trim()
    const finalIcon: string | undefined = rawIcon || undefined

    const it = {
      id: Math.random().toString(36).slice(2, 10),
      name: nameInput.value.trim() || '新项',
      icon: finalIcon,
      type: 'url',
      data: urlInput.value.trim() || '/',
      openIn: openValue,
    }
    grp.items.push(it)
    try {
      helpers.saveConfig(cfg)
    } catch {}

    try {
      helpers.rerender(root, cfg)
    } catch {}

    try {
      mask.remove()
    } catch {}
  })

  cancelBtn.addEventListener('click', () => {
    try {
      mask.remove()
    } catch {}
  })

  actions.append(saveBtn)
  actions.append(cancelBtn)

  grid.append(grpRow)
  grid.append(nameRow)
  grid.append(iconRow)
  grid.append(urlRow)
  grid.append(openRow)
  grid.append(quickRow)
  modal.append(h2)
  modal.append(grid)
  modal.append(actions)
  mask.append(modal)
  root.append(mask)
}
