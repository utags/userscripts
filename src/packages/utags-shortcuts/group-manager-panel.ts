import { clearChildren, setIcon } from '../../utils/dom'
import { uid } from '../../utils/uid'
import { hasDuplicateInGroup } from './add-link-actions'
import { renderGroupForm, type GroupFormData } from './group-form'
import { renderLinkForm, type LinkFormData } from './link-form'
import { type OpenMode } from './types'
import { resolveIcon, resolveTargetUrl } from './utils'

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
  wrap.className = 'panel-split'

  // Sidebar
  const sidebar = document.createElement('div')
  sidebar.className = 'panel-sidebar'
  const sidebarList = document.createElement('div')
  sidebarList.className = 'flex-1'
  const sidebarActions = document.createElement('div')
  sidebarActions.className = 'sidebar-actions'

  // Content
  const content = document.createElement('div')
  content.className = 'panel-content'
  const contentHeader = document.createElement('div')
  contentHeader.className = 'content-header'
  const contentTabs = document.createElement('div')
  contentTabs.className = 'content-tabs'
  const contentBody = document.createElement('div')
  contentBody.className = 'tab-pane'

  content.append(contentHeader)
  content.append(contentTabs)
  content.append(contentBody)

  let activeGroup = (cfg.groups || [])[0]
  let activeTab: 'settings' | 'shortcuts' = 'shortcuts'

  // Settings Tab State
  let isSettingsDirty = false
  let pendingGroupData: GroupFormData | undefined

  // Shortcuts Tab State
  let activeLinkItem: LinkFormData | undefined
  let isLinkDirty = false
  let editingLinkOriginalId: string | undefined // To track if we are editing an existing item

  const savePendingSettings = () => {
    if (pendingGroupData && activeGroup) {
      Object.assign(activeGroup, pendingGroupData)
      // Cleanup undefined/empty
      if (!activeGroup.displayName) delete activeGroup.displayName
      if (!activeGroup.icon) delete activeGroup.icon
      if (activeGroup.hidden === false) delete activeGroup.hidden // visible is default

      helpers.saveConfig(cfg)
      helpers.rerender(root, cfg)
      rebuildContentHeader() // Name might change
      rebuildSidebar() // Name might change
    }

    isSettingsDirty = false
    pendingGroupData = undefined
  }

  const checkUnsavedChanges = (callback: () => void) => {
    if (isSettingsDirty) {
      if (
        globalThis.confirm(
          '当前分组设置有未保存的修改，是否保存？\n(确定：保存并继续；取消：放弃修改并继续)'
        )
      ) {
        savePendingSettings()
      } else {
        isSettingsDirty = false
        pendingGroupData = undefined
      }
    }

    if (isLinkDirty) {
      if (!globalThis.confirm('当前链接编辑有未保存的修改，确定放弃修改吗？')) {
        return
      }

      // Discard link changes
      activeLinkItem = undefined
      isLinkDirty = false
      editingLinkOriginalId = undefined
    }

    callback()
  }

  const handleGroupClick = (g: any) => {
    checkUnsavedChanges(() => {
      activeGroup = g
      // Reset states
      activeLinkItem = undefined
      isLinkDirty = false
      editingLinkOriginalId = undefined

      // Keep activeTab or reset? User usually expects to stay in context or reset.
      // Let's keep activeTab, but if it was settings, we need to re-init pending data for new group.
      // Rebuilding content will call renderSettingsTab again which inits pending data.
      rebuildSidebar()
      rebuildContent()
    })
  }

  // Helper to render sidebar items
  function rebuildSidebar() {
    clearChildren(sidebarList)
    for (const g of cfg.groups || []) {
      const item = document.createElement('div')
      item.className =
        'sidebar-item' + (g.id === activeGroup.id ? ' active' : '')
      item.addEventListener('click', () => {
        handleGroupClick(g)
      })

      const iconEl = document.createElement('div')
      iconEl.className = 'shortcut-icon'
      setIcon(iconEl, g.icon || 'lucide:folder')
      item.append(iconEl)

      const info = document.createElement('div')
      info.className = 'flex-1 min-w-0'
      item.append(info)

      const name = document.createElement('div')
      name.className = 'sidebar-item-name'
      name.textContent = g.name
      info.append(name)

      if (g.displayName) {
        const desc = document.createElement('div')
        desc.className = 'sidebar-item-desc'
        desc.textContent = g.displayName
        info.append(desc)
      }

      sidebarList.append(item)
    }
  }

  // Sidebar Actions
  const addGroupBtn = document.createElement('button')
  addGroupBtn.className = 'btn btn-secondary w-full justify-center'
  addGroupBtn.textContent = '添加分组'
  addGroupBtn.addEventListener('click', () => {
    checkUnsavedChanges(() => {
      const ng = {
        id: uid(),
        name: '新分组',
        icon: 'lucide:folder',
        match: ['*://' + (location.hostname || '') + '/*'],
        items: [],
        defaultOpen: helpers.sitePref.defaultOpen,
      }
      cfg.groups.push(ng)
      activeGroup = ng
      activeTab = 'settings'
      helpers.saveConfig(cfg)
      rebuildSidebar()
      rebuildContent()
      helpers.rerender(root, cfg)
    })
  })
  sidebarActions.append(addGroupBtn)

  const delEmptyGroupsBtn = document.createElement('button')
  delEmptyGroupsBtn.className =
    'btn btn-secondary w-full justify-center text-xs'
  delEmptyGroupsBtn.textContent = '清理空分组'
  delEmptyGroupsBtn.addEventListener('click', () => {
    checkUnsavedChanges(() => {
      const empties = (cfg.groups || []).filter(
        (g: any) => (g.items || []).length === 0
      )
      const n = empties.length
      if (n === 0) {
        globalThis.alert('没有发现空分组')
        return
      }

      const ok = globalThis.confirm('确认删除 ' + String(n) + ' 个空分组？')
      if (!ok) return
      const kept = (cfg.groups || []).filter(
        (g: any) => (g.items || []).length > 0
      )
      if (kept.length === 0) {
        // Create one if all deleted
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
      activeGroup = cfg.groups[0]
      helpers.saveConfig(cfg)
      rebuildSidebar()
      rebuildContent()
      helpers.rerender(root, cfg)
    })
  })
  sidebarActions.append(delEmptyGroupsBtn)

  sidebar.append(sidebarList)
  sidebar.append(sidebarActions)

  // Content Header
  function rebuildContentHeader() {
    clearChildren(contentHeader)
    const title = document.createElement('div')
    title.className = 'content-title'
    title.textContent = activeGroup.name
    contentHeader.append(title)

    // Header actions (Delete Group)
    const delBtn = document.createElement('button')
    delBtn.className = 'btn btn-secondary mini text-red-600'
    delBtn.textContent = '删除分组'
    delBtn.addEventListener('click', () => {
      if ((cfg.groups || []).length <= 1) return
      if (
        !globalThis.confirm(
          '确认删除分组 "' + String(activeGroup.name) + '" 及其所有内容？'
        )
      )
        return

      // No need to check unsaved changes for the group we are deleting
      isSettingsDirty = false
      pendingGroupData = undefined
      activeLinkItem = undefined
      isLinkDirty = false

      cfg.groups = (cfg.groups || []).filter(
        (g: any) => g.id !== activeGroup.id
      )
      activeGroup = cfg.groups[0]
      helpers.saveConfig(cfg)
      rebuildSidebar()
      rebuildContent()
      helpers.rerender(root, cfg)
    })
    if ((cfg.groups || []).length <= 1) {
      delBtn.disabled = true
      delBtn.style.opacity = '0.5'
    }

    contentHeader.append(delBtn)
  }

  const handleTabClick = (k: 'settings' | 'shortcuts') => {
    checkUnsavedChanges(() => {
      activeTab = k
      rebuildTabs()
      rebuildTabContent()
    })
  }

  // Content Tabs
  function rebuildTabs() {
    clearChildren(contentTabs)
    const tabs = [
      { key: 'shortcuts', label: '快捷导航 (Shortcuts)' },
      { key: 'settings', label: '分组设置' },
    ]
    for (const t of tabs) {
      const btn = document.createElement('div')
      btn.className = 'tab-btn' + (activeTab === t.key ? ' active' : '')
      btn.textContent = t.label
      btn.addEventListener('click', () => {
        handleTabClick(t.key as any)
      })
      contentTabs.append(btn)
    }
  }

  // Content Body
  function rebuildTabContent() {
    clearChildren(contentBody)
    if (activeTab === 'settings') {
      renderSettingsTab(contentBody)
    } else {
      renderShortcutsTab(contentBody)
    }
  }

  function renderSettingsTab(container: HTMLElement) {
    // Initialize pending data for the active group
    // We create a copy so changes aren't live
    const initData: GroupFormData = { ...activeGroup }
    pendingGroupData = initData
    // Deep copy match array to avoid reference issues
    if (activeGroup.match) pendingGroupData.match = [...activeGroup.match]

    isSettingsDirty = false

    // Pre-declare buttons to use in onChange
    const cancelBtn = document.createElement('button')
    const saveBtn = document.createElement('button')

    const formWrap = document.createElement('div')
    renderGroupForm(formWrap, pendingGroupData, {
      onChange() {
        isSettingsDirty = true
        cancelBtn.disabled = false
        saveBtn.disabled = false
      },
    })

    // Action Buttons
    const actions = document.createElement('div')
    actions.className = 'row justify-end mt-4 gap-2'

    cancelBtn.className = 'btn btn-secondary'
    cancelBtn.textContent = '取消'
    cancelBtn.disabled = true
    cancelBtn.addEventListener('click', () => {
      if (isSettingsDirty && !globalThis.confirm('确定放弃未保存的修改吗？')) {
        return
      }

      isSettingsDirty = false
      pendingGroupData = undefined
      // Re-render tab to reset form
      renderSettingsTab(container)
    })

    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = '保存设置'
    saveBtn.disabled = true
    saveBtn.addEventListener('click', () => {
      savePendingSettings()
      // Re-render tab to reflect "saved" state (not dirty)
      renderSettingsTab(container)
    })

    actions.append(cancelBtn)
    actions.append(saveBtn)

    clearChildren(container)
    container.append(formWrap)
    container.append(actions)
  }

  function renderShortcutsTab(container: HTMLElement) {
    if (activeLinkItem) {
      renderLinkEditor(container)
    } else {
      renderLinkList(container)
    }
  }

  function renderLinkEditor(container: HTMLElement) {
    if (!activeLinkItem) return

    const formWrap = document.createElement('div')

    // Action Buttons
    const actions = document.createElement('div')
    actions.className = 'row justify-end mt-4 gap-2'

    const cancelBtn = document.createElement('button')
    const saveBtn = document.createElement('button')

    let tempMask: HTMLElement | undefined
    let tempModal: HTMLElement | undefined

    renderLinkForm(formWrap, activeLinkItem, {
      root,
      groups: cfg.groups || [],
      disableGroupSelector: Boolean(editingLinkOriginalId),
      onChange() {
        isLinkDirty = true
        saveBtn.disabled = false
      },
      onPickStart() {
        const mask = root.querySelector<HTMLElement>('.modal-mask')
        if (mask) {
          tempMask = mask
          tempModal = mask.querySelector<HTMLElement>('.modal')!
          if (tempModal) tempModal.style.display = 'none'
          mask.remove()
        }
      },
      onPickEnd() {
        if (tempMask && tempModal) {
          tempModal.style.display = ''
          root.append(tempMask)
        }
      },
    })

    cancelBtn.className = 'btn btn-secondary'
    cancelBtn.textContent = '取消'
    cancelBtn.addEventListener('click', () => {
      if (isLinkDirty && !globalThis.confirm('确定放弃未保存的修改吗？')) {
        return
      }

      activeLinkItem = undefined
      isLinkDirty = false
      editingLinkOriginalId = undefined
      renderShortcutsTab(container)
    })

    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = editingLinkOriginalId ? '确认' : '添加'
    saveBtn.disabled = !isLinkDirty
    saveBtn.addEventListener('click', () => {
      const gid = activeLinkItem!.groupId
      const grp = (cfg.groups || []).find((g: any) => g.id === gid)
      if (!grp) return

      const hasDup = hasDuplicateInGroup(
        grp,
        activeLinkItem!.type,
        activeLinkItem!.data,
        editingLinkOriginalId
      )
      if (hasDup) {
        const msg =
          activeLinkItem!.type === 'url'
            ? editingLinkOriginalId
              ? '该分组内已存在相同的 URL，是否继续保存？'
              : '该分组内已存在相同的 URL，是否继续添加？'
            : editingLinkOriginalId
              ? '该分组内已存在相同的 JS，是否继续保存？'
              : '该分组内已存在相同的 JS，是否继续添加？'
        const ok = globalThis.confirm(msg)
        if (!ok) return
      }

      if (editingLinkOriginalId) {
        // Editing existing
        const it = grp.items.find((x: any) => x.id === editingLinkOriginalId)
        if (it) {
          it.name = activeLinkItem!.name
          it.icon = activeLinkItem!.icon
          it.type = activeLinkItem!.type
          it.data = activeLinkItem!.data
          it.openIn = activeLinkItem!.openIn
          it.hidden = activeLinkItem!.hidden
        }
      } else {
        // Adding new
        const it = {
          id: activeLinkItem!.id || uid(),
          name: activeLinkItem!.name,
          icon: activeLinkItem!.icon,
          type: activeLinkItem!.type,
          data: activeLinkItem!.data,
          openIn: activeLinkItem!.openIn,
          hidden: activeLinkItem!.hidden,
        }
        grp.items.push(it)
      }

      try {
        helpers.saveConfig(cfg)
      } catch {}

      try {
        helpers.rerender(root, cfg)
      } catch {}

      activeLinkItem = undefined
      isLinkDirty = false
      editingLinkOriginalId = undefined

      // If group changed (adding to different group), we might want to switch activeGroup?
      // For now, let's just stay on current group (or if we added to current group, it shows up)
      if (grp.id !== activeGroup.id) {
        // Maybe switch to that group?
        // activeGroup = grp
        // rebuildSidebar()
        // rebuildContent()
        // But let's stick to simple behavior first: return to list
      }

      renderShortcutsTab(container)
    })

    actions.append(cancelBtn)
    actions.append(saveBtn)

    clearChildren(container)
    container.append(formWrap)
    container.append(actions)
  }

  function renderLinkList(container: HTMLElement) {
    clearChildren(container)
    const list = document.createElement('div')
    list.className = 'shortcut-list'
    const grp = activeGroup // Alias for linter

    // Add Item Button
    const addRow = document.createElement('div')
    addRow.className = 'mb-3'
    const addBtn = document.createElement('button')
    addBtn.className = 'btn btn-primary w-full justify-center'
    addBtn.textContent = '+ 添加快捷导航'
    addBtn.addEventListener('click', () => {
      activeLinkItem = {
        id: uid(),
        groupId: activeGroup.id,
        name: '新项',
        type: 'url',
        data: '/',
        openIn: (activeGroup.defaultOpen ??
          helpers.sitePref.defaultOpen) as OpenMode,
      }
      isLinkDirty = false
      editingLinkOriginalId = undefined
      renderShortcutsTab(container)
    })
    addRow.append(addBtn)
    container.append(addRow)

    for (const it of grp.items || []) {
      const itemEl = document.createElement('div')
      itemEl.className = 'shortcut-item group'
      if (it.hidden) itemEl.classList.add('is-hidden')

      // Icon
      const iconEl = document.createElement('div')
      iconEl.className = 'shortcut-icon'
      {
        const iconStr = resolveIcon(it.icon, it.type, it.data, 'lucide:link')

        setIcon(iconEl, iconStr)
      }

      itemEl.append(iconEl)

      // Info
      const info = document.createElement('div')
      info.className = 'shortcut-info'
      const name = document.createElement('div')
      name.className = 'shortcut-name'
      name.textContent = it.name
      info.append(name)

      const meta = document.createElement('div')
      meta.className = 'shortcut-meta'
      meta.textContent =
        (it.type === 'js' ? 'JS' : 'URL') + ' • ' + String(it.openIn || '默认')
      if (it.hidden) meta.textContent += ' • 已隐藏'
      info.append(meta)
      itemEl.append(info)

      // Actions
      const actions = document.createElement('div')
      actions.className = 'shortcut-actions'

      // Edit
      const editBtn = document.createElement('button')
      editBtn.className = 'icon-btn'
      setIcon(editBtn, 'lucide:edit-3', '编辑')
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      editBtn.addEventListener('click', () => {
        activeLinkItem = {
          id: it.id,
          groupId: activeGroup.id,
          name: it.name,
          icon: it.icon,
          type: it.type,
          data: it.data,
          openIn: it.openIn,
          hidden: it.hidden,
        }
        isLinkDirty = false
        editingLinkOriginalId = it.id
        renderShortcutsTab(container)
      })
      actions.append(editBtn)

      // Toggle Hide
      const hideBtn = document.createElement('button')
      hideBtn.className = 'icon-btn'
      setIcon(
        hideBtn,
        it.hidden ? 'lucide:eye' : 'lucide:eye-off',
        it.hidden ? '显示' : '隐藏'
      )
      hideBtn.addEventListener('click', () => {
        it.hidden = !it.hidden
        helpers.saveConfig(cfg)
        rebuildTabContent()
        helpers.rerender(root, cfg)
      })
      actions.append(hideBtn)

      // Delete
      const delBtn = document.createElement('button')
      delBtn.className = 'icon-btn text-danger'
      setIcon(delBtn, 'lucide:trash-2', '删除')
      delBtn.addEventListener('click', () => {
        if (!globalThis.confirm('确定删除 "' + String(it.name) + '" 吗？'))
          return
        grp.items = (grp.items || []).filter((x: any) => x.id !== it.id)
        helpers.saveConfig(cfg)
        rebuildTabContent()
        helpers.rerender(root, cfg)
      })
      actions.append(delBtn)

      itemEl.append(actions)
      list.append(itemEl)
    }

    container.append(list)
  }

  function rebuildContent() {
    rebuildContentHeader()
    rebuildTabs()
    rebuildTabContent()
  }

  rebuildSidebar()
  rebuildContent()

  wrap.append(sidebar)
  wrap.append(content)

  return { el: wrap, checkUnsavedChanges }
}
