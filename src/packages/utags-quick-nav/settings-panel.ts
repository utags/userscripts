import { createOpenModeRadios, createSegmentedRadios } from './segmented-radios'

type OpenMode = 'same-tab' | 'new-tab'

export function createSettingsPanel(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
    sitePref: any
    updateThemeUI: (root: ShadowRoot, cfg: any) => void
    edgeDefaults: {
      width: number
      height: number
      opacity: number
      colorLight: string
      colorDark: string
    }
    tempOpenGetter: () => boolean
  }
) {
  const wrap = document.createElement('div')
  const globalHeader = document.createElement('h2')
  globalHeader.className = 'section-title'
  globalHeader.textContent = '全局设置'
  const globalGrid = document.createElement('div')
  globalGrid.className = 'grid'
  try {
    ;(globalGrid.style as any).gridTemplateColumns = '1fr'
  } catch {}

  const siteHeader = document.createElement('h2')
  siteHeader.className = 'section-title'
  siteHeader.textContent = '站点设置'
  const siteGrid = document.createElement('div')
  siteGrid.className = 'grid'
  try {
    ;(siteGrid.style as any).gridTemplateColumns = '1fr'
  } catch {}

  const posRow = document.createElement('div')
  posRow.className = 'row'
  const posLabel = document.createElement('label')
  posLabel.textContent = '位置'
  const posSel = document.createElement('select')
  for (const p of [
    'right-top',
    'right-center',
    'right-bottom',
    'left-top',
    'left-center',
    'left-bottom',
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ]) {
    const o = document.createElement('option')
    o.value = p
    o.textContent = p
    if (helpers.sitePref.position === p) o.selected = true
    posSel.append(o)
  }

  posSel.addEventListener('change', () => {
    helpers.sitePref.position = posSel.value
    helpers.saveConfig(cfg)
    helpers.rerender(root, cfg)
  })
  posRow.append(posLabel)
  posRow.append(posSel)

  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '默认打开方式'
  let siteOpen: OpenMode = helpers.sitePref.defaultOpen
  const openRadios1 = createOpenModeRadios(siteOpen, (m) => {
    siteOpen = m
    helpers.sitePref.defaultOpen = m
    helpers.saveConfig(cfg)
    helpers.rerender(root, cfg)
  })
  openRow.append(openLabel)
  openRow.append(openRadios1)

  const themeRow = document.createElement('div')
  themeRow.className = 'row'
  const themeLabel = document.createElement('label')
  themeLabel.textContent = '主题'
  const themeRadios = createSegmentedRadios(
    (helpers.sitePref.theme || 'system') as 'system' | 'light' | 'dark',
    ['system', 'light', 'dark'] as const,
    (val) => {
      helpers.sitePref.theme = val
      helpers.saveConfig(cfg)
      helpers.updateThemeUI(root, cfg)
    },
    {
      labels: { system: '系统', light: '浅色', dark: '深色' },
      namePrefix: 'utqn-theme-',
    }
  )
  themeRow.append(themeLabel)
  themeRow.append(themeRadios)

  const hotkeyRow = document.createElement('div')
  hotkeyRow.className = 'row'
  const hotkeyLabel = document.createElement('label')
  hotkeyLabel.textContent = '快捷键'
  const hotkeyInput = document.createElement('input')
  hotkeyInput.placeholder = 'Alt+Shift+K'
  hotkeyInput.value = String(cfg.global.hotkey || 'Alt+Shift+K')
  hotkeyInput.addEventListener('change', () => {
    const v = hotkeyInput.value.trim()
    cfg.global.hotkey = v
    helpers.saveConfig(cfg)
  })
  hotkeyRow.append(hotkeyLabel)
  hotkeyRow.append(hotkeyInput)

  const syncRow = document.createElement('div')
  syncRow.className = 'row'
  const syncLabel = document.createElement('label')
  syncLabel.textContent = '同步 URL'
  const syncInput = document.createElement('input')
  syncInput.value = cfg.global.syncUrl || ''
  const syncBtn = document.createElement('button')
  syncBtn.className = 'btn'
  syncBtn.textContent = '从远程拉取'
  syncBtn.addEventListener('click', async () => {
    const u = syncInput.value.trim()
    if (!u) return
    try {
      const res = await fetch(u, { credentials: 'omit' })
      const text = await res.text()
      const obj = JSON.parse(text)
      if (obj && obj.global && obj.groups) {
        cfg.global = obj.global
        cfg.groups = obj.groups
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
      }
    } catch {}
  })
  syncInput.addEventListener('change', () => {
    cfg.global.syncUrl = syncInput.value.trim() || undefined
    helpers.saveConfig(cfg)
  })
  syncRow.append(syncLabel)
  syncRow.append(syncInput)
  syncRow.append(syncBtn)

  const widthRow = document.createElement('div')
  widthRow.className = 'row'
  const widthLabel = document.createElement('label')
  widthLabel.textContent = '竖线宽度'
  const widthInput = document.createElement('input')
  widthInput.type = 'number'
  widthInput.min = '1'
  widthInput.max = '24'
  widthInput.value = String(
    helpers.sitePref.edgeWidth ?? helpers.edgeDefaults.width
  )
  const widthHelp = document.createElement('div')
  widthHelp.className = 'field-help'
  widthHelp.textContent = '单位：px，范围 1–24'
  widthRow.append(widthLabel)
  widthRow.append(widthInput)
  widthRow.append(widthHelp)

  const heightRow = document.createElement('div')
  heightRow.className = 'row'
  const heightLabel = document.createElement('label')
  heightLabel.textContent = '竖线高度'
  const heightInput = document.createElement('input')
  heightInput.type = 'number'
  heightInput.min = '24'
  heightInput.max = '320'
  heightInput.value = String(
    helpers.sitePref.edgeHeight ?? helpers.edgeDefaults.height
  )
  const heightHelp = document.createElement('div')
  heightHelp.className = 'field-help'
  heightHelp.textContent = '单位：px，范围 24–320'
  heightRow.append(heightLabel)
  heightRow.append(heightInput)
  heightRow.append(heightHelp)

  const opacityRow = document.createElement('div')
  opacityRow.className = 'row'
  const opacityLabel = document.createElement('label')
  opacityLabel.textContent = '不透明度'
  const opacityInput = document.createElement('input')
  opacityInput.type = 'number'
  opacityInput.min = '0'
  opacityInput.max = '1'
  opacityInput.step = '0.05'
  opacityInput.value = String(
    helpers.sitePref.edgeOpacity ?? helpers.edgeDefaults.opacity
  )
  const opacityHelp = document.createElement('div')
  opacityHelp.className = 'field-help'
  opacityHelp.textContent = '范围 0–1，步长 0.05'
  opacityRow.append(opacityLabel)
  opacityRow.append(opacityInput)
  opacityRow.append(opacityHelp)

  const lightColorRow = document.createElement('div')
  lightColorRow.className = 'row'
  const lightColorLabel = document.createElement('label')
  lightColorLabel.textContent = '浅色主题颜色'
  const lightColorInput = document.createElement('input')
  lightColorInput.type = 'color'
  lightColorInput.value = String(
    helpers.sitePref.edgeColorLight || helpers.edgeDefaults.colorLight
  )
  const lightColorHelp = document.createElement('div')
  lightColorHelp.className = 'field-help'
  lightColorHelp.textContent = '用于浅色主题'
  lightColorRow.append(lightColorLabel)
  lightColorRow.append(lightColorInput)
  lightColorRow.append(lightColorHelp)

  const darkColorRow = document.createElement('div')
  darkColorRow.className = 'row'
  const darkColorLabel = document.createElement('label')
  darkColorLabel.textContent = '深色主题颜色'
  const darkColorInput = document.createElement('input')
  darkColorInput.type = 'color'
  darkColorInput.value = String(
    helpers.sitePref.edgeColorDark || helpers.edgeDefaults.colorDark
  )
  const darkColorHelp = document.createElement('div')
  darkColorHelp.className = 'field-help'
  darkColorHelp.textContent = '用于深色主题'
  darkColorRow.append(darkColorLabel)
  darkColorRow.append(darkColorInput)
  darkColorRow.append(darkColorHelp)

  widthInput.addEventListener('change', () => {
    const v = Math.max(1, Math.min(24, Number.parseInt(widthInput.value, 10)))
    helpers.sitePref.edgeWidth = v
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })
  heightInput.addEventListener('change', () => {
    const v = Math.max(
      24,
      Math.min(320, Number.parseInt(heightInput.value, 10))
    )
    helpers.sitePref.edgeHeight = v
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })
  opacityInput.addEventListener('change', () => {
    const v = Math.max(0, Math.min(1, Number.parseFloat(opacityInput.value)))
    helpers.sitePref.edgeOpacity = v
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })
  lightColorInput.addEventListener('change', () => {
    helpers.sitePref.edgeColorLight = lightColorInput.value
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })
  darkColorInput.addEventListener('change', () => {
    helpers.sitePref.edgeColorDark = darkColorInput.value
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })

  const resetRow = document.createElement('div')
  resetRow.className = 'row'
  const resetLabel = document.createElement('label')
  resetLabel.textContent = '竖线外观'
  const edgeReset = document.createElement('button')
  edgeReset.className = 'btn mini'
  edgeReset.textContent = '重置默认'
  edgeReset.addEventListener('click', () => {
    helpers.sitePref.edgeWidth = helpers.edgeDefaults.width
    helpers.sitePref.edgeHeight = helpers.edgeDefaults.height
    helpers.sitePref.edgeOpacity = helpers.edgeDefaults.opacity
    helpers.sitePref.edgeColorLight = helpers.edgeDefaults.colorLight
    helpers.sitePref.edgeColorDark = helpers.edgeDefaults.colorDark
    widthInput.value = String(helpers.edgeDefaults.width)
    heightInput.value = String(helpers.edgeDefaults.height)
    opacityInput.value = String(helpers.edgeDefaults.opacity)
    lightColorInput.value = helpers.edgeDefaults.colorLight
    darkColorInput.value = helpers.edgeDefaults.colorDark
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })
  resetRow.append(resetLabel)
  resetRow.append(edgeReset)

  const panelCtrlRow = document.createElement('div')
  panelCtrlRow.className = 'row'
  const panelCtrlLabel = document.createElement('label')
  panelCtrlLabel.textContent = '面板控制'
  const pinnedRadios = createSegmentedRadios(
    helpers.sitePref.pinned ? 'true' : 'false',
    ['true', 'false'] as const,
    (val) => {
      helpers.sitePref.pinned = val === 'true'
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    },
    { labels: { true: '固定', false: '取消固定' }, namePrefix: 'utqn-pinned-' }
  )
  const hideEdgeWrap = document.createElement('label')
  hideEdgeWrap.className = 'mini'
  const hideEdgeChk = document.createElement('input')
  hideEdgeChk.type = 'checkbox'
  hideEdgeChk.checked = Boolean(helpers.sitePref.edgeHidden)
  const hideEdgeText = document.createElement('span')
  hideEdgeText.textContent = '隐藏竖线'
  hideEdgeWrap.append(hideEdgeChk)
  hideEdgeWrap.append(hideEdgeText)

  hideEdgeChk.addEventListener('change', () => {
    helpers.sitePref.edgeHidden = hideEdgeChk.checked
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })

  panelCtrlRow.append(panelCtrlLabel)
  panelCtrlRow.append(pinnedRadios)
  panelCtrlRow.append(hideEdgeWrap)

  const exportBtn = document.createElement('button')
  exportBtn.className = 'btn btn-secondary'
  exportBtn.textContent = '导出配置'
  exportBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
    } catch {}
  })

  // Assemble sections
  globalGrid.append(hotkeyRow)
  globalGrid.append(syncRow)
  const ioRow = document.createElement('div')
  ioRow.className = 'row'
  const ioLabel = document.createElement('label')
  ioLabel.textContent = '数据导入与导出'
  const exportJsonBtn = document.createElement('button')
  exportJsonBtn.className = 'btn btn-secondary'
  exportJsonBtn.textContent = '导出 JSON 文件'
  exportJsonBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'utags-quick-nav-config.json'
    a.click()
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  })
  const importJsonBtn = document.createElement('button')
  importJsonBtn.className = 'btn btn-secondary'
  importJsonBtn.textContent = '从 JSON 文件导入'
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'application/json'
  fileInput.style.display = 'none'
  importJsonBtn.addEventListener('click', () => {
    fileInput.click()
  })
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files && fileInput.files[0]
    if (!f) return
    try {
      const text = await f.text()
      const obj = JSON.parse(text)
      if (obj && obj.global && obj.groups) {
        cfg.global = obj.global
        cfg.groups = obj.groups
        helpers.saveConfig(cfg)
        helpers.rerender(root, cfg)
      }
    } catch {}
  })
  ioRow.append(ioLabel)
  ioRow.append(exportJsonBtn)
  ioRow.append(importJsonBtn)
  ioRow.append(fileInput)
  const ioHelp = document.createElement('div')
  ioHelp.className = 'field-help'
  ioHelp.textContent = '包含全局设置、分组配置与导航项数据'
  ioRow.append(ioHelp)
  globalGrid.append(ioRow)

  siteGrid.append(posRow)
  siteGrid.append(openRow)
  siteGrid.append(themeRow)
  siteGrid.append(widthRow)
  siteGrid.append(heightRow)
  siteGrid.append(opacityRow)
  siteGrid.append(lightColorRow)
  siteGrid.append(darkColorRow)
  siteGrid.append(resetRow)
  siteGrid.append(panelCtrlRow)

  wrap.append(globalHeader)
  wrap.append(globalGrid)
  wrap.append(siteHeader)
  wrap.append(siteGrid)
  return wrap
}
