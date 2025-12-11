import { uid } from '../../utils/uid'
import { clearChildren } from '../../utils/dom'
import { createIconInput } from './icon-input'
import { createOpenModeRadios } from './segmented-radios'
import { openAddLinkModal } from './add-link-modal'

type OpenMode = 'same-tab' | 'new-tab'

export function createGroupManagerPanel(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
    sitePref: any
  }
) {
  const wrap = document.createElement('div')

  const grpHeader = document.createElement('h2')
  grpHeader.className = 'section-title'
  grpHeader.textContent = '分组'
  const grpList = document.createElement('div')
  grpList.className = 'group-list'
  let active = (cfg.groups || [])[0]
  function rebuildGroupPills() {
    clearChildren(grpList)
    for (const g of cfg.groups || []) {
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
    const iconComp = createIconInput(
      active.icon || '',
      ['icon', 'url', 'emoji'],
      {
        labels: { icon: '图标', url: 'URL', emoji: 'Emoji' },
        namePrefix: 'utqn-group-icon-kind-',
        onValueChange() {
          const v = iconComp.getFinal()
          active.icon = v
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        },
        onKindChange() {
          const v = iconComp.getFinal()
          active.icon = v
          helpers.saveConfig(cfg)
          helpers.rerender(root, cfg)
        },
      }
    )
    row2.append(l2)
    row2.append(iconComp.el)

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
        const iconComp2 = createIconInput(
          it.icon || '',
          ['icon', 'url', 'emoji'],
          {
            labels: { icon: '图标', url: 'URL', emoji: 'Emoji' },
            namePrefix: 'utqn-item-icon-kind-',
            placeholders: { icon: 'home', url: 'https://...', emoji: 'emoji' },
            onValueChange() {
              const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
              if (!grp) return
              const item = (grp.items || []).find((x: any) => x.id === it.id)
              if (!item) return
              item.icon = iconComp2.getFinal()
              helpers.saveConfig(cfg)
              helpers.rerender(root, cfg)
            },
            onKindChange() {
              const grp = (cfg.groups || []).find((g: any) => g.id === groupId)
              if (!grp) return
              const item = (grp.items || []).find((x: any) => x.id === it.id)
              if (!item) return
              item.icon = iconComp2.getFinal()
              helpers.saveConfig(cfg)
              helpers.rerender(root, cfg)
            },
          }
        )
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
        row.append(iconComp2.el)
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

  wrap.append(grpHeader)
  wrap.append(grpList)
  wrap.append(groupEditor)
  return wrap
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
