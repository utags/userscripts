import { createSettingsPanel } from './settings-panel'
import { createGroupManagerPanel } from './group-manager-panel'
import { uid } from '../../utils/uid'
import { clearChildren } from '../../utils/dom'
import { createOpenModeRadios } from './segmented-radios'
import { openAddLinkModal } from './add-link-modal'

type OpenMode = 'same-tab' | 'new-tab'

export function openEditorModal(
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
  for (const n of Array.from(root.querySelectorAll('.modal-mask'))) n.remove()

  const mask = document.createElement('div')
  mask.className = 'modal-mask'
  try {
    ;(mask.style as any).zIndex = '2147483648'
  } catch {}

  const modal = document.createElement('div')
  modal.className = 'modal editor'
  const h2 = document.createElement('h2')
  h2.textContent = '快速导航设置'
  const grid = document.createElement('div')
  grid.className = 'grid'

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
  grid.append(posRow)
  grid.append(openRow)

  const themeRow = document.createElement('div')
  themeRow.className = 'row'
  const themeLabel = document.createElement('label')
  themeLabel.textContent = '主题'
  const themeSel = document.createElement('select')
  for (const th of ['system', 'light', 'dark']) {
    const o = document.createElement('option')
    o.value = th
    o.textContent = th === 'system' ? '系统' : th === 'light' ? '浅色' : '深色'
    if ((helpers.sitePref.theme || 'system') === th) o.selected = true
    themeSel.append(o)
  }

  themeSel.addEventListener('change', () => {
    helpers.sitePref.theme = themeSel.value
    helpers.saveConfig(cfg)
    helpers.updateThemeUI(root, cfg)
  })
  themeRow.append(themeLabel)
  themeRow.append(themeSel)
  grid.append(themeRow)

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
  grid.append(hotkeyRow)

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

  const edgeRow = document.createElement('div')
  edgeRow.className = 'row'
  const edgeLabel = document.createElement('label')
  edgeLabel.textContent = '竖线外观'
  const widthInput = document.createElement('input')
  widthInput.type = 'number'
  widthInput.min = '1'
  widthInput.max = '24'
  widthInput.value = String(
    helpers.sitePref.edgeWidth ?? helpers.edgeDefaults.width
  )
  const heightInput = document.createElement('input')
  heightInput.type = 'number'
  heightInput.min = '24'
  heightInput.max = '320'
  heightInput.value = String(
    helpers.sitePref.edgeHeight ?? helpers.edgeDefaults.height
  )
  const opacityInput = document.createElement('input')
  opacityInput.type = 'number'
  opacityInput.min = '0'
  opacityInput.max = '1'
  opacityInput.step = '0.05'
  opacityInput.value = String(
    helpers.sitePref.edgeOpacity ?? helpers.edgeDefaults.opacity
  )
  const lightColorInput = document.createElement('input')
  lightColorInput.type = 'color'
  lightColorInput.value = String(
    helpers.sitePref.edgeColorLight || helpers.edgeDefaults.colorLight
  )
  const darkColorInput = document.createElement('input')
  darkColorInput.type = 'color'
  darkColorInput.value = String(
    helpers.sitePref.edgeColorDark || helpers.edgeDefaults.colorDark
  )

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

  edgeRow.append(edgeLabel)
  edgeRow.append(widthInput)
  edgeRow.append(heightInput)
  edgeRow.append(opacityInput)
  edgeRow.append(lightColorInput)
  edgeRow.append(darkColorInput)
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
  edgeRow.append(edgeReset)

  const panelCtrlRow = document.createElement('div')
  panelCtrlRow.className = 'row'
  const panelCtrlLabel = document.createElement('label')
  panelCtrlLabel.textContent = '面板控制'
  const pinBtn2 = document.createElement('button')
  pinBtn2.className = 'btn mini'
  pinBtn2.textContent = '固定'
  const unpinBtn2 = document.createElement('button')
  unpinBtn2.className = 'btn mini'
  unpinBtn2.textContent = '取消固定'
  const hideEdgeWrap = document.createElement('label')
  hideEdgeWrap.className = 'mini'
  const hideEdgeChk = document.createElement('input')
  hideEdgeChk.type = 'checkbox'
  hideEdgeChk.checked = Boolean(helpers.sitePref.edgeHidden)
  const hideEdgeText = document.createElement('span')
  hideEdgeText.textContent = '隐藏竖线'
  hideEdgeWrap.append(hideEdgeChk)
  hideEdgeWrap.append(hideEdgeText)

  pinBtn2.addEventListener('click', () => {
    helpers.sitePref.pinned = true
    helpers.saveConfig(cfg)
    helpers.rerender(root, cfg)
  })
  unpinBtn2.addEventListener('click', () => {
    helpers.sitePref.pinned = false
    helpers.saveConfig(cfg)
    helpers.rerender(root, cfg)
  })
  hideEdgeChk.addEventListener('change', () => {
    helpers.sitePref.edgeHidden = hideEdgeChk.checked
    helpers.saveConfig(cfg)
    if (!helpers.sitePref.pinned && !helpers.tempOpenGetter())
      helpers.rerender(root, cfg)
  })

  panelCtrlRow.append(panelCtrlLabel)
  panelCtrlRow.append(pinBtn2)
  panelCtrlRow.append(unpinBtn2)
  panelCtrlRow.append(hideEdgeWrap)
  grid.append(panelCtrlRow)

  const grpHeader = document.createElement('h2')
  grpHeader.className = 'section-title'
  grpHeader.textContent = '分组'
  const grpList = document.createElement('div')
  grpList.className = 'group-list'
  let active =
    cfg.groups.find((g: any) =>
      g.id === undefined ? false : g.id === undefined
    ) || cfg.groups[0]
  active = cfg.groups[0]
  function rebuildGroupPills() {
    clearChildren(grpList)
    for (const g of cfg.groups) {
      const pill = document.createElement('button')
      pill.className = 'group-pill' + (g.id === active.id ? ' active' : '')
      pill.textContent = g.displayName || g.name
      ;(pill as HTMLElement).dataset.gid = g.id
      grpList.append(pill)
    }
  }

  grpList.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement
    const btn = target.closest('.group-pill')
    if (!btn) return
    const pill = btn as HTMLElement
    const gid = (pill as any).dataset?.gid || ''
    const next = (cfg.groups || []).find((gg: any) => gg.id === gid)
    if (!next) return
    active = next
    rebuildGroupPills()
    rebuildGroupEditor()
  })

  const groupEditor = document.createElement('div')
  function rebuildGroupEditor() {
    clearChildren(groupEditor)
    const row1 = document.createElement('div')
    row1.className = 'row'
    const l1 = document.createElement('label')
    l1.textContent = '组名'
    const nameInput = document.createElement('input')
    nameInput.value = active.name
    nameInput.addEventListener('change', () => {
      active.name = nameInput.value
      rebuildGroupPills()
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    })
    row1.append(l1)
    row1.append(nameInput)

    const row2 = document.createElement('div')
    row2.className = 'row'
    const l2 = document.createElement('label')
    l2.textContent = '图标'
    const iconInput = document.createElement('input')
    iconInput.placeholder = 'lucide:home | url:https://... | emoji'
    iconInput.value = active.icon || ''
    iconInput.addEventListener('change', () => {
      active.icon = iconInput.value.trim() || undefined
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    })
    row2.append(l2)
    row2.append(iconInput)

    const row3 = document.createElement('div')
    row3.className = 'row'
    const l3 = document.createElement('label')
    l3.textContent = 'URL 规则'
    const ta = document.createElement('textarea')
    ta.value = (active.match || []).join('\n')
    ta.addEventListener('change', () => {
      const grp = (cfg.groups || []).find((g: any) => g.id === active.id)
      if (!grp) return
      grp.match = ta.value
        .split(/\n+/)
        .map((v) => v.trim())
        .filter(Boolean)
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    })
    row3.append(l3)
    row3.append(ta)

    const row4 = document.createElement('div')
    row4.className = 'row'
    const l4 = document.createElement('label')
    l4.textContent = '组默认打开方式'
    let grpOpen: OpenMode = (active.defaultOpen ||
      helpers.sitePref.defaultOpen) as OpenMode
    const openRadios2 = createOpenModeRadios(grpOpen, (m) => {
      grpOpen = m
      active.defaultOpen = m
      helpers.saveConfig(cfg)
    })
    row4.append(l4)
    row4.append(openRadios2)

    const row5 = document.createElement('div')
    row5.className = 'row'
    const l5 = document.createElement('label')
    l5.textContent = '每行个数'
    const colsSel = document.createElement('select')
    for (const c of [1, 2, 3, 4, 5, 6]) {
      const o = document.createElement('option')
      o.value = String(c)
      o.textContent = String(c)
      if ((active.itemsPerRow || 1) === c) o.selected = true
      colsSel.append(o)
    }

    colsSel.addEventListener('change', () => {
      const v = Number.parseInt(colsSel.value, 10)
      active.itemsPerRow = Number.isNaN(v) ? 1 : Math.max(1, Math.min(6, v))
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    })
    row5.append(l5)
    row5.append(colsSel)

    const row6 = document.createElement('div')
    row6.className = 'row'
    const l6 = document.createElement('label')
    l6.textContent = '分组显示状态'
    const visSel = document.createElement('select')
    for (const st of ['显示', '隐藏']) {
      const o = document.createElement('option')
      o.value = st
      o.textContent = st
      if ((active.hidden ? '隐藏' : '显示') === st) o.selected = true
      visSel.append(o)
    }

    visSel.addEventListener('change', () => {
      active.hidden = visSel.value === '隐藏'
      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
    })
    row6.append(l6)
    row6.append(visSel)

    const itemsHeader = document.createElement('h2')
    itemsHeader.className = 'section-title'
    itemsHeader.textContent = '导航项'
    const itemsList = document.createElement('div')
    function rebuildItems() {
      clearChildren(itemsList)
      const groupId = active.id
      for (const it of active.items || []) {
        const row = document.createElement('div')
        row.className = 'row item-row'
        const n = document.createElement('input')
        n.value = it.name
        n.addEventListener('change', () => {
          const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
          if (!grp) return
          const item = (grp.items || []).find((x: any) => x.id === it.id)
          if (!item) return
          item.name = n.value
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        })
        const i = document.createElement('input')
        i.placeholder = 'lucide:home | url:https://... | emoji'
        i.value = it.icon || ''
        i.addEventListener('change', () => {
          const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
          if (!grp) return
          const item = (grp.items || []).find((x: any) => x.id === it.id)
          if (!item) return
          item.icon = i.value.trim() || undefined
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        })
        const t = document.createElement('select')
        for (const tp of ['url', 'js']) {
          const o = document.createElement('option')
          o.value = tp
          o.textContent = tp
          if (it.type === tp) o.selected = true
          t.append(o)
        }

        t.addEventListener('change', () => {
          const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
          if (!grp) return
          const item = (grp.items || []).find((x: any) => x.id === it.id)
          if (!item) return
          item.type = t.value as 'url' | 'js'
          helpers.saveConfig(cfg)
        })
        const d = document.createElement('input')
        d.value = it.data
        d.addEventListener('change', () => {
          const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
          if (!grp) return
          const item = (grp.items || []).find((x: any) => x.id === it.id)
          if (!item) return
          item.data = d.value
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        })
        const m = document.createElement('select')
        for (const mm of ['same-tab', 'new-tab']) {
          const o = document.createElement('option')
          o.value = mm
          o.textContent = mm
          if (
            (it.openIn ||
              active.defaultOpen ||
              helpers.sitePref.defaultOpen) === mm
          )
            o.selected = true
          m.append(o)
        }

        m.addEventListener('change', () => {
          const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
          if (!grp) return
          const item = (grp.items || []).find((x: any) => x.id === it.id)
          if (!item) return
          item.openIn = m.value as OpenMode
          helpers.saveConfig(cfg)
        })
        const visibleSel = document.createElement('select')
        for (const st of ['显示', '隐藏']) {
          const o = document.createElement('option')
          o.value = st
          o.textContent = st
          if ((it.hidden ? '隐藏' : '显示') === st) o.selected = true
          visibleSel.append(o)
        }

        visibleSel.addEventListener('change', () => {
          const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
          if (!grp) return
          const item = (grp.items || []).find((x: any) => x.id === it.id)
          if (!item) return
          item.hidden = visibleSel.value === '隐藏'
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        })
        const del = document.createElement('button')
        del.className = 'btn'
        del.textContent = '删除'
        del.addEventListener('click', () => {
          const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
          if (!grp) return
          grp.items = (grp.items || []).filter((x: any) => x.id !== it.id)
          helpers.saveConfig(cfg)
          rebuildItems()
          helpers.rerender(root, cfg)
        })
        const moveToSel = document.createElement('select')
        for (const g of cfg.groups || []) {
          if (g.id === groupId) continue
          const o = document.createElement('option')
          o.value = g.id
          o.textContent = '复制到 ' + String(g.name)
          moveToSel.append(o)
        }

        const moveBtn = document.createElement('button')
        moveBtn.className = 'btn mini'
        moveBtn.textContent = '复制到分组'
        moveBtn.addEventListener('click', () => {
          const toId = moveToSel.value
          if (!toId) return
          copyItemToGroup(cfg, groupId, it.id, toId)
          helpers.saveConfig(cfg)
          rebuildItems()
          helpers.rerender(root, cfg)
        })
        row.append(n)
        row.append(i)
        row.append(t)
        row.append(d)
        row.append(m)
        row.append(visibleSel)
        row.append(moveToSel)
        row.append(moveBtn)
        row.append(del)
        itemsList.append(row)
      }
    }

    const addRow = document.createElement('div')
    addRow.className = 'row'
    const addBtn = document.createElement('button')
    addBtn.className = 'btn btn-secondary'
    addBtn.textContent = '添加导航项'
    addBtn.addEventListener('click', () => {
      openAddLinkModal(root, cfg, {
        saveConfig(c) {
          helpers.saveConfig(c)
        },
        rerender(r, c) {
          helpers.rerender(r, c)
        },
        defaultOpen: (active.defaultOpen ?? helpers.sitePref.defaultOpen) as
          | 'same-tab'
          | 'new-tab',
        defaultGroupId: active.id,
      })
    })
    addRow.append(addBtn)

    const grpActions = document.createElement('div')
    grpActions.className = 'row'
    const addGroup = document.createElement('button')
    addGroup.className = 'btn btn-secondary'
    addGroup.textContent = '添加分组'
    addGroup.addEventListener('click', () => {
      const ng = {
        id: uid(),
        name: '新分组',
        icon: 'lucide:folder',
        match: ['*://' + (location.hostname || '') + '/*'],
        items: [],
        defaultOpen: helpers.sitePref.defaultOpen,
      }
      cfg.groups.push(ng)
      active = ng
      helpers.saveConfig(cfg)
      rebuildGroupPills()
      rebuildGroupEditor()
      helpers.rerender(root, cfg)
    })
    const delGroup = document.createElement('button')
    delGroup.className = 'btn btn-secondary'
    delGroup.textContent = '删除分组'
    delGroup.addEventListener('click', () => {
      if ((cfg.groups || []).length <= 1) {
        mask.remove()
        return
      }

      cfg.groups = (cfg.groups || []).filter((g: any) => g.id !== active.id)
      active = cfg.groups[0]
      helpers.saveConfig(cfg)
      rebuildGroupPills()
      rebuildGroupEditor()
      helpers.rerender(root, cfg)
    })
    const delEmptyGroups = document.createElement('button')
    delEmptyGroups.className = 'btn btn-secondary'
    delEmptyGroups.textContent = '删除所有空的分组'
    delEmptyGroups.addEventListener('click', () => {
      const empties = (cfg.groups || []).filter(
        (g: any) => (g.items || []).length === 0
      )
      const n = empties.length
      if (n === 0) return
      const ok = globalThis.confirm('确认删除 ' + String(n) + ' 个分组？')
      if (!ok) return
      const kept = (cfg.groups || []).filter(
        (g: any) => (g.items || []).length > 0
      )
      if (kept.length === 0) {
        const ng = {
          id: uid(),
          name: '新分组',
          icon: 'lucide:folder',
          match: ['*://' + (location.hostname || '') + '/*'],
          items: [],
          defaultOpen: helpers.sitePref.defaultOpen,
        }
        kept.push(ng)
      }

      cfg.groups = kept
      active = cfg.groups[0]
      helpers.saveConfig(cfg)
      rebuildGroupPills()
      rebuildGroupEditor()
      helpers.rerender(root, cfg)
    })
    grpActions.append(addGroup)
    grpActions.append(delGroup)
    grpActions.append(delEmptyGroups)
    groupEditor.append(row1)
    groupEditor.append(row2)
    groupEditor.append(row3)
    groupEditor.append(row4)
    groupEditor.append(row5)
    groupEditor.append(row6)
    groupEditor.append(itemsHeader)
    groupEditor.append(itemsList)
    groupEditor.append(addRow)
    groupEditor.append(grpActions)
    rebuildItems()
  }

  rebuildGroupPills()
  rebuildGroupEditor()

  const actions = document.createElement('div')
  actions.className = 'row'
  const exportBtn = document.createElement('button')
  exportBtn.className = 'btn btn-secondary'
  exportBtn.textContent = '导出配置'
  exportBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
    } catch {}
  })
  const closeBtn = document.createElement('button')
  closeBtn.className = 'btn btn-secondary'
  closeBtn.textContent = '关闭'
  closeBtn.addEventListener('click', () => {
    mask.remove()
  })
  actions.append(exportBtn)
  actions.append(closeBtn)

  modal.append(h2)
  modal.append(grid)
  modal.append(syncRow)
  modal.append(edgeRow)
  modal.append(grpHeader)
  modal.append(grpList)
  modal.append(groupEditor)
  modal.append(actions)
  mask.append(modal)
  root.append(mask)
}

function copyItemToGroup(
  cfg: any,
  fromGroupId: string,
  itemId: string,
  toGroupId: string
) {
  const from = (cfg.groups || []).find((g: any) => g.id === fromGroupId)
  const to = (cfg.groups || []).find((g: any) => g.id === toGroupId)
  if (!from || !to) return
  const it = (from.items || []).find((x: any) => x.id === itemId)
  if (!it) return
  const dup = { ...it, id: uid() }
  to.items.push(dup)
}
