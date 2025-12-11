import panelCss from 'css:./settings.css'

const MODE_KEY = 'read_helper_mode'
const STYLE_KEY = 'read_helper_style'
const COLOR_KEY = 'read_helper_color'
const ENABLED_KEY = 'read_helper_enabled'
const SCROLL_HIDE_KEY = 'read_helper_scroll_hide'

declare const GM: any

export function openSettingsPanel(): void {
  const existing = document.querySelector(
    '[data-rh-host="read-helper-settings"]'
  )
  let host = existing as HTMLDivElement | undefined
  let root: ShadowRoot
  if (host && (host as any).shadowRoot) {
    root = (host as any).shadowRoot as ShadowRoot
    for (const n of Array.from(root.childNodes)) (n as any).remove()
  } else {
    host = document.createElement('div')
    ;(host.dataset as any).rhHost = 'read-helper-settings'
    root = host.attachShadow({ mode: 'open' })
    document.documentElement.append(host)
  }

  const styleTag = document.createElement('style')
  styleTag.textContent = panelCss
  root.append(styleTag)

  const mask = document.createElement('div')
  mask.className = 'rh'
  const panel = document.createElement('div')
  panel.className = 'panel'
  const grid = document.createElement('div')
  grid.className = 'grid'

  const headerRow = document.createElement('div')
  headerRow.className = 'row'
  const title = document.createElement('label')
  title.textContent = '阅读助手设置'
  const closeBtn = document.createElement('button')
  closeBtn.className = 'btn-ghost'
  closeBtn.textContent = '关闭'
  headerRow.append(title)
  headerRow.append(closeBtn)

  const modeRow = document.createElement('div')
  modeRow.className = 'row'
  const modeLabel = document.createElement('label')
  modeLabel.textContent = '模式'
  const modeSeg = document.createElement('div')
  modeSeg.className = 'seg'
  for (const m of ['sentence', 'clause', 'line', 'paragraph']) {
    const b = document.createElement('button')
    b.className = 'seg-btn'
    ;(b.dataset as any).group = 'mode'
    ;(b.dataset as any).value = m
    b.textContent =
      m === 'sentence'
        ? '按句'
        : m === 'clause'
          ? '按段'
          : m === 'line'
            ? '按行'
            : '整段'
    modeSeg.append(b)
  }

  modeRow.append(modeLabel)
  modeRow.append(modeSeg)

  const styleRow = document.createElement('div')
  styleRow.className = 'row'
  const styleLabel = document.createElement('label')
  styleLabel.textContent = '样式'
  const styleSeg = document.createElement('div')
  styleSeg.className = 'seg'
  for (const s of ['box', 'underline']) {
    const b = document.createElement('button')
    b.className = 'seg-btn'
    ;(b.dataset as any).group = 'style'
    ;(b.dataset as any).value = s
    b.textContent = s === 'box' ? '虚线框' : '下划线'
    styleSeg.append(b)
  }

  styleRow.append(styleLabel)
  styleRow.append(styleSeg)

  const colorRow = document.createElement('div')
  colorRow.className = 'row color-row'
  const colorLabel = document.createElement('label')
  colorLabel.textContent = '颜色'
  const colorWrap = document.createElement('div')
  colorWrap.className = 'seg'
  for (const c of [
    '#ff4d4f',
    '#1A73E8',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#111827',
  ]) {
    const sw = document.createElement('div')
    sw.className = 'color-swatch'
    ;(sw.dataset as any).value = c
    sw.style.backgroundColor = c
    colorWrap.append(sw)
  }

  colorRow.append(colorLabel)
  colorRow.append(colorWrap)

  const enabledRow = document.createElement('div')
  enabledRow.className = 'row switch'
  const enabledLabel = document.createElement('label')
  enabledLabel.textContent = '启用'
  const enabledSeg = document.createElement('div')
  enabledSeg.className = 'seg'
  const enabledOn = document.createElement('button')
  enabledOn.className = 'switch-btn'
  ;(enabledOn.dataset as any).group = 'enabled'
  ;(enabledOn.dataset as any).value = 'on'
  enabledOn.textContent = '开'
  const enabledOff = document.createElement('button')
  enabledOff.className = 'switch-btn'
  ;(enabledOff.dataset as any).group = 'enabled'
  ;(enabledOff.dataset as any).value = 'off'
  enabledOff.textContent = '关'
  enabledSeg.append(enabledOn)
  enabledSeg.append(enabledOff)
  enabledRow.append(enabledLabel)
  enabledRow.append(enabledSeg)

  const scrollRow = document.createElement('div')
  scrollRow.className = 'row switch'
  const scrollLabel = document.createElement('label')
  scrollLabel.textContent = '滚动时隐藏'
  const scrollSeg = document.createElement('div')
  scrollSeg.className = 'seg'
  const scrollOn = document.createElement('button')
  scrollOn.className = 'switch-btn'
  ;(scrollOn.dataset as any).group = 'scroll'
  ;(scrollOn.dataset as any).value = 'on'
  scrollOn.textContent = '开'
  const scrollOff = document.createElement('button')
  scrollOff.className = 'switch-btn'
  ;(scrollOff.dataset as any).group = 'scroll'
  ;(scrollOff.dataset as any).value = 'off'
  scrollOff.textContent = '关'
  scrollSeg.append(scrollOn)
  scrollSeg.append(scrollOff)
  scrollRow.append(scrollLabel)
  scrollRow.append(scrollSeg)

  const arrowsRow = document.createElement('div')
  arrowsRow.className = 'row switch'
  const arrowsLabel = document.createElement('label')
  arrowsLabel.textContent = '用方向键移动'
  const arrowsSeg = document.createElement('div')
  arrowsSeg.className = 'seg'
  const arrowsOn = document.createElement('button')
  arrowsOn.className = 'switch-btn'
  ;(arrowsOn.dataset as any).group = 'arrows'
  ;(arrowsOn.dataset as any).value = 'on'
  arrowsOn.textContent = '开'
  const arrowsOff = document.createElement('button')
  arrowsOff.className = 'switch-btn'
  ;(arrowsOff.dataset as any).group = 'arrows'
  ;(arrowsOff.dataset as any).value = 'off'
  arrowsOff.textContent = '关'
  arrowsSeg.append(arrowsOn)
  arrowsSeg.append(arrowsOff)
  arrowsRow.append(arrowsLabel)
  arrowsRow.append(arrowsSeg)

  grid.append(headerRow)
  grid.append(enabledRow)
  grid.append(modeRow)
  grid.append(styleRow)
  grid.append(colorRow)
  grid.append(arrowsRow)
  grid.append(scrollRow)
  panel.append(grid)
  mask.append(panel)
  root.append(mask)

  async function updateModeUI() {
    try {
      const mv = await GM.getValue(MODE_KEY, 'sentence')
      for (const b of Array.from(modeSeg.querySelectorAll('.seg-btn'))) {
        const val = (b as any).dataset.value || ''
        if (val === String(mv)) b.classList.add('active')
        else b.classList.remove('active')
      }
    } catch {}
  }

  async function updateStyleUI() {
    try {
      const sv = await GM.getValue(STYLE_KEY, 'box')
      for (const b of Array.from(styleSeg.querySelectorAll('.seg-btn'))) {
        const val = (b as any).dataset.value || ''
        if (val === String(sv)) b.classList.add('active')
        else b.classList.remove('active')
      }
    } catch {}
  }

  async function updateColorUI() {
    try {
      const cv = await GM.getValue(COLOR_KEY, '#ff4d4f')
      let picked = false
      for (const sw of Array.from(
        colorWrap.querySelectorAll('.color-swatch')
      )) {
        const val = (sw as any).dataset.value || ''
        if (val === String(cv)) {
          sw.classList.add('active')
          picked = true
        } else sw.classList.remove('active')
      }

      if (!picked && typeof cv === 'string') {
        const extra = document.createElement('div')
        extra.className = 'color-swatch active'
        ;(extra.dataset as any).value = String(cv)
        extra.style.backgroundColor = String(cv)
        colorWrap.append(extra)
      }
    } catch {}
  }

  async function updateEnabledUI() {
    try {
      const ev = await GM.getValue(ENABLED_KEY, '1')
      const flag = typeof ev === 'string' ? ev === '1' : Boolean(ev)
      for (const b of Array.from(enabledSeg.querySelectorAll('.switch-btn'))) {
        const val = (b as any).dataset.value || ''
        const on = val === 'on'
        if ((on && flag) || (!on && !flag)) b.classList.add('on')
        else b.classList.remove('on')
      }
    } catch {}
  }

  async function updateScrollUI() {
    try {
      const sh = await GM.getValue(SCROLL_HIDE_KEY, true)
      const flag = Boolean(sh)
      for (const b of Array.from(scrollSeg.querySelectorAll('.switch-btn'))) {
        const val = (b as any).dataset.value || ''
        const on = val === 'on'
        if ((on && flag) || (!on && !flag)) b.classList.add('on')
        else b.classList.remove('on')
      }
    } catch {}
  }

  async function updateArrowsUI() {
    try {
      const mv = await GM.getValue('read_helper_move_by_arrows', false)
      const flag = Boolean(mv)
      for (const b of Array.from(arrowsSeg.querySelectorAll('.switch-btn'))) {
        const val = (b as any).dataset.value || ''
        const on = val === 'on'
        if ((on && flag) || (!on && !flag)) b.classList.add('on')
        else b.classList.remove('on')
      }
    } catch {}
  }

  void (async () => {
    await updateModeUI()
    await updateStyleUI()
    await updateColorUI()
    await updateEnabledUI()
    await updateScrollUI()
    await updateArrowsUI()
  })()

  function handleSeg(el: HTMLElement): boolean {
    const g = el.dataset.group || ''
    const v = el.dataset.value || ''
    if (g === 'mode') {
      GM.setValue(MODE_KEY, v)
      for (const b of Array.from(modeSeg.querySelectorAll('.seg-btn'))) {
        const h = b as any
        if ((h.dataset.value || '') === v)
          (h as HTMLElement).classList.add('active')
        else (h as HTMLElement).classList.remove('active')
      }

      return true
    }

    if (g === 'style') {
      GM.setValue(STYLE_KEY, v)
      for (const b of Array.from(styleSeg.querySelectorAll('.seg-btn'))) {
        const h = b as any
        if ((h.dataset.value || '') === v)
          (h as HTMLElement).classList.add('active')
        else (h as HTMLElement).classList.remove('active')
      }

      return true
    }

    return false
  }

  function handleColor(el: HTMLElement): boolean {
    const v = el.dataset.value || ''
    if (!v) return false
    GM.setValue(COLOR_KEY, v)
    for (const n of Array.from(colorWrap.querySelectorAll('.color-swatch'))) {
      const h = n as any
      if ((h.dataset.value || '') === v)
        (h as HTMLElement).classList.add('active')
      else (h as HTMLElement).classList.remove('active')
    }

    return true
  }

  function handleSwitch(el: HTMLElement): boolean {
    const g = el.dataset.group || ''
    const v = el.dataset.value || ''
    if (!g) return false
    if (g === 'enabled') {
      const flag = v === 'on'
      GM.setValue(ENABLED_KEY, flag)
      for (const b of Array.from(enabledSeg.querySelectorAll('.switch-btn'))) {
        const h = b as any
        const on = (h.dataset.value || '') === 'on'
        if ((on && flag) || (!on && !flag))
          (h as HTMLElement).classList.add('on')
        else (h as HTMLElement).classList.remove('on')
      }

      return true
    }

    if (g === 'scroll') {
      const flag = v === 'on'
      GM.setValue(SCROLL_HIDE_KEY, flag)
      for (const b of Array.from(scrollSeg.querySelectorAll('.switch-btn'))) {
        const h = b as any
        const on = (h.dataset.value || '') === 'on'
        if ((on && flag) || (!on && !flag))
          (h as HTMLElement).classList.add('on')
        else (h as HTMLElement).classList.remove('on')
      }

      return true
    }

    if (g === 'arrows') {
      const flag = v === 'on'
      GM.setValue('read_helper_move_by_arrows', flag)
      for (const b of Array.from(arrowsSeg.querySelectorAll('.switch-btn'))) {
        const h = b as any
        const on = (h.dataset.value || '') === 'on'
        if ((on && flag) || (!on && !flag))
          (h as HTMLElement).classList.add('on')
        else (h as HTMLElement).classList.remove('on')
      }

      return true
    }

    return false
  }

  function onPanelClick(e: MouseEvent) {
    const t = e.target as HTMLElement
    if (t === closeBtn) {
      host?.remove()
      globalThis.removeEventListener('keydown', onKeyDown, true)
      return
    }

    const segEl = t.closest('.seg-btn')
    if (segEl && segEl instanceof HTMLElement && handleSeg(segEl)) return

    const swEl = t.closest('.color-swatch')
    if (swEl && swEl instanceof HTMLElement && handleColor(swEl)) return

    const switchEl = t.closest('.switch-btn')
    if (switchEl && switchEl instanceof HTMLElement) void handleSwitch(switchEl)
  }

  panel.addEventListener('click', onPanelClick)

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      host?.remove()
      globalThis.removeEventListener('keydown', onKeyDown, true)
    }
  }

  globalThis.addEventListener('keydown', onKeyDown, true)
}
