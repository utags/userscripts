import { querySelectorAllDeep } from '../../utils/dom'
import { pickLinkFromPage, hasDuplicateInGroup } from './add-link-actions'
import { uid } from '../../utils/uid'
import { createOpenModeRadios, createSegmentedRadios } from './segmented-radios'
import { createIconInput } from './icon-input'

export function openAddLinkModal(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
    defaultOpen: 'same-tab' | 'new-tab'
    defaultGroupId?: string
    existingItem?: any
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
  h2.textContent = helpers.existingItem ? '编辑链接' : '添加链接'

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

  if (helpers.existingItem) {
    try {
      const gid = helpers.defaultGroupId || defaultGroup
      grpSel.value = gid
      grpSel.disabled = true
    } catch {}
  }

  grpRow.append(grpLabel)
  grpRow.append(grpSel)

  const nameRow = document.createElement('div')
  nameRow.className = 'row'
  const nameLabel = document.createElement('label')
  nameLabel.textContent = '名称'
  const nameInput = document.createElement('input')
  nameInput.value = helpers.existingItem
    ? String(helpers.existingItem.name || '新项')
    : '新项'
  nameRow.append(nameLabel)
  nameRow.append(nameInput)

  const iconRow = document.createElement('div')
  iconRow.className = 'row'
  const iconLabel = document.createElement('label')
  iconLabel.textContent = '图标'
  const existingIcon = helpers.existingItem
    ? String(helpers.existingItem.icon || '')
    : ''
  const iconComp = createIconInput(
    existingIcon,
    ['icon', 'favicon', 'url', 'emoji'],
    {
      labels: { icon: '图标', favicon: 'Favicon', url: 'URL', emoji: 'Emoji' },
      namePrefix: 'utqn-item-icon-kind-',
    }
  )
  iconRow.append(iconLabel)
  iconRow.append(iconComp.el)

  const urlRow = document.createElement('div')
  urlRow.className = 'row'
  const urlLabel = document.createElement('label')
  urlLabel.textContent = 'URL'
  const urlInput = document.createElement('input')
  urlInput.placeholder = 'https://...'
  urlInput.value = helpers.existingItem
    ? String(helpers.existingItem.data || '/')
    : '/'
  urlRow.append(urlLabel)
  urlRow.append(urlInput)

  const urlHelpRow = document.createElement('div')
  urlHelpRow.className = 'row'
  const urlHelp = document.createElement('div')
  urlHelp.className = 'field-help'
  const uTitle = document.createElement('div')
  uTitle.className = 'field-help-title'
  uTitle.textContent = '🔗 URL 变量与示例'
  const uLine1 = document.createElement('div')
  uLine1.textContent =
    '变量：{hostname}、{hostname_without_www}、{query}、{selected}'
  const uLine2 = document.createElement('div')
  uLine2.textContent = '示例：http://example.com/search?query={selected||query}'
  const uLine3 = document.createElement('div')
  const uLink = document.createElement('a')
  uLink.href = 'https://github.com/utags/userscripts'
  uLink.target = '_blank'
  uLink.rel = 'noopener noreferrer'
  uLink.textContent = 'https://github.com/utags/userscripts'
  uLine3.append('更多使用说明参考 ')
  uLine3.append(uLink)
  urlHelp.append(uTitle)
  urlHelp.append(uLine1)
  urlHelp.append(uLine2)
  urlHelp.append(uLine3)
  urlHelpRow.append(urlHelp)

  const jsRow = document.createElement('div')
  jsRow.className = 'row'
  const jsLabel = document.createElement('label')
  jsLabel.textContent = 'JS'
  const jsInput = document.createElement('textarea')
  jsInput.placeholder = 'console.log("hello")\n// 或者粘贴脚本内容'
  jsInput.value =
    helpers.existingItem && helpers.existingItem.type === 'js'
      ? String(helpers.existingItem.data || '')
      : ''
  jsRow.append(jsLabel)
  jsRow.append(jsInput)

  const jsHelpRow = document.createElement('div')
  jsHelpRow.className = 'row'
  const jsHelp = document.createElement('div')
  jsHelp.className = 'field-help'
  const jTitle = document.createElement('div')
  jTitle.className = 'field-help-title'
  jTitle.textContent = '🧩 JS 返回与示例'
  const jLine1 = document.createElement('div')
  jLine1.textContent = 'JS：返回字符串或 {url, mode} 导航'
  const jLine2 = document.createElement('div')
  jLine2.textContent =
    '示例：return "http://example.com/search?query={selected||query}"'
  const jLine3 = document.createElement('div')
  jLine3.textContent =
    '示例：return { url: "http://example.com/?q={query}", mode: "new-tab" }'
  const jLine4 = document.createElement('div')
  const jLink = document.createElement('a')
  jLink.href = 'https://github.com/utags/userscripts'
  jLink.target = '_blank'
  jLink.rel = 'noopener noreferrer'
  jLink.textContent = 'https://github.com/utags/userscripts'
  jLine4.append('更多使用说明参考 ')
  jLine4.append(jLink)
  jsHelp.append(jTitle)
  jsHelp.append(jLine1)
  jsHelp.append(jLine2)
  jsHelp.append(jLine3)
  jsHelp.append(jLine4)
  jsHelpRow.append(jsHelp)

  const typeRow = document.createElement('div')
  typeRow.className = 'row'
  const typeLabel = document.createElement('label')
  typeLabel.textContent = '类型'
  let typeValue: 'url' | 'js' = helpers.existingItem?.type || 'url'
  const quickRef = { el: undefined as HTMLDivElement | undefined }
  const typeRadios = createSegmentedRadios(
    typeValue,
    ['url', 'js'] as const,
    (v) => {
      typeValue = v
      syncTypeUi()
    },
    { labels: { url: 'URL', js: 'JS' }, namePrefix: 'utqn-item-type-' }
  )
  const syncTypeUi = () => {
    if (typeValue === 'url') {
      urlRow.style.display = ''
      jsRow.style.display = 'none'
      if (quickRef.el) quickRef.el.style.display = ''
      urlHelpRow.style.display = ''
      jsHelpRow.style.display = 'none'
    } else {
      urlRow.style.display = 'none'
      jsRow.style.display = ''
      if (quickRef.el) quickRef.el.style.display = 'none'
      urlHelpRow.style.display = 'none'
      jsHelpRow.style.display = ''
    }
  }

  typeRow.append(typeLabel)
  typeRow.append(typeRadios)

  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '打开方式'
  let openValue: 'same-tab' | 'new-tab' = (helpers.existingItem?.openIn ||
    helpers.defaultOpen ||
    'same-tab') as 'same-tab' | 'new-tab'
  const openRadios = createOpenModeRadios(openValue, (m) => {
    openValue = m
  })

  openRow.append(openLabel)
  openRow.append(openRadios)

  const visibleRow = document.createElement('div')
  visibleRow.className = 'row'
  const visibleLabel = document.createElement('label')
  visibleLabel.textContent = '显示状态'
  let itemState: 'visible' | 'hidden' = helpers.existingItem?.hidden
    ? 'hidden'
    : 'visible'
  const stateRadios = createSegmentedRadios(
    itemState,
    ['visible', 'hidden'] as const,
    (v) => {
      itemState = v
    },
    {
      labels: { visible: '显示', hidden: '隐藏' },
      namePrefix: 'utqn-item-state-',
    }
  )
  visibleRow.append(visibleLabel)
  visibleRow.append(stateRadios)

  const quickRow = document.createElement('div')
  quickRef.el = quickRow
  quickRow.className = 'row'
  const addCurrentBtn = document.createElement('button')
  addCurrentBtn.className = 'btn btn-secondary'
  addCurrentBtn.textContent = '添加当前网页'
  const pickLinksBtn = document.createElement('button')
  pickLinksBtn.className = 'btn btn-secondary'
  pickLinksBtn.textContent = '从当前网页采集链接'
  quickRow.append(addCurrentBtn)
  quickRow.append(pickLinksBtn)
  syncTypeUi()

  addCurrentBtn.addEventListener('click', () => {
    try {
      nameInput.value = document.title || '当前网页'
      urlInput.value = location.href
    } catch {}
  })

  pickLinksBtn.addEventListener('click', () => {
    try {
      pickLinkFromPage(root, {
        beforeStart() {
          modal.style.display = 'none'
          mask.remove()
        },
        afterFinish() {
          modal.style.display = ''
          root.append(mask)
        },
        onPicked(nm, href) {
          nameInput.value = nm
          urlInput.value = href
        },
      })
    } catch {}
  })

  const actions = document.createElement('div')
  actions.className = 'row actions'
  const saveBtn = document.createElement('button')
  saveBtn.className = 'btn btn-primary'
  saveBtn.textContent = helpers.existingItem ? '确认' : '添加'
  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'btn btn-secondary'
  cancelBtn.textContent = '取消'
  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'btn btn-secondary'
  deleteBtn.textContent = '删除'

  const isEditableTarget = (t: EventTarget | undefined) => {
    const el = t as HTMLElement | undefined
    if (!el) return false
    const tag = el.tagName ? el.tagName.toLowerCase() : ''
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
    const ce = (el as any).isContentEditable as boolean | undefined
    return Boolean(ce)
  }

  const close = () => {
    try {
      mask.remove()
    } catch {}

    try {
      document.removeEventListener('keydown', onKey, true)
    } catch {}
  }

  const onKey = (e: KeyboardEvent) => {
    const visible = root.contains(mask) && modal.style.display !== 'none'
    if (!visible) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }

    if (e.key === 'Enter') {
      const ae = (root as any).activeElement as HTMLElement | undefined
      const inModal = ae ? Boolean(modal.contains(ae)) : false
      if (!inModal) return
      const tag = ae?.tagName ? ae.tagName.toLowerCase() : ''
      if (tag === 'textarea' || tag === 'button') return
      e.preventDefault()
      saveBtn.click()
    }
  }

  document.addEventListener('keydown', onKey, true)

  saveBtn.addEventListener('click', () => {
    const gid = grpSel.value
    const grp = (cfg.groups || []).find((g: any) => g.id === gid)
    if (!grp) return
    const finalIcon: string | undefined = iconComp.getFinal()
    const hiddenVal = itemState === 'hidden'

    const proposedData =
      typeValue === 'url' ? urlInput.value.trim() || '/' : jsInput.value
    const hasDup = hasDuplicateInGroup(
      grp,
      typeValue,
      proposedData,
      helpers.existingItem?.id
    )
    if (hasDup) {
      const msg =
        typeValue === 'url'
          ? helpers.existingItem
            ? '该分组内已存在相同的 URL，是否继续保存？'
            : '该分组内已存在相同的 URL，是否继续添加？'
          : helpers.existingItem
            ? '该分组内已存在相同的 JS，是否继续保存？'
            : '该分组内已存在相同的 JS，是否继续添加？'
      const ok = globalThis.confirm(msg)
      if (!ok) return
    }

    if (helpers.existingItem) {
      const it = helpers.existingItem
      it.name = nameInput.value.trim() || '新项'
      it.icon = finalIcon
      it.type = typeValue
      it.data = proposedData
      it.openIn = openValue
      it.hidden = hiddenVal
    } else {
      const it = {
        id: uid(),
        name: nameInput.value.trim() || '新项',
        icon: finalIcon,
        type: typeValue,
        data: proposedData,
        openIn: openValue,
        hidden: hiddenVal ? true : undefined,
      }
      grp.items.push(it)
    }

    try {
      helpers.saveConfig(cfg)
    } catch {}

    try {
      helpers.rerender(root, cfg)
    } catch {}

    close()
  })

  deleteBtn.addEventListener('click', () => {
    if (!helpers.existingItem) return
    const ok = globalThis.confirm('是否删除此链接？')
    if (!ok) return
    const gid = grpSel.value
    const grp = (cfg.groups || []).find((g: any) => g.id === gid)
    if (!grp) return
    const idx = grp.items.findIndex(
      (x: any) => x && x.id === helpers.existingItem.id
    )
    if (idx !== -1) {
      try {
        grp.items.splice(idx, 1)
      } catch {}

      try {
        helpers.saveConfig(cfg)
      } catch {}

      try {
        helpers.rerender(root, cfg)
      } catch {}

      close()
    }
  })

  cancelBtn.addEventListener('click', () => {
    close()
  })

  actions.append(saveBtn)
  actions.append(cancelBtn)

  grid.append(grpRow)
  grid.append(nameRow)
  grid.append(iconRow)
  grid.append(typeRow)
  grid.append(urlRow)
  grid.append(urlHelpRow)
  grid.append(jsRow)
  grid.append(jsHelpRow)
  grid.append(openRow)
  grid.append(visibleRow)
  grid.append(quickRow)
  modal.append(h2)
  modal.append(grid)
  modal.append(actions)
  mask.append(modal)
  root.append(mask)

  if (helpers.existingItem) {
    actions.append(deleteBtn)
  }

  syncTypeUi()
}
