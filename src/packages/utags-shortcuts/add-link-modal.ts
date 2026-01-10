import { uid } from '../../utils/uid'
import { hasDuplicateInGroup } from './add-link-actions'
import { renderLinkForm, type LinkFormData } from './link-form'
import { createModalFrame } from './modal-base'
import { type OpenMode } from './types'

export function openAddLinkModal(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
    defaultOpen: OpenMode
    defaultGroupId?: string
    existingItem?: any
  }
) {
  const { modal, body, actions, close, mask } = createModalFrame({
    root,
    title: helpers.existingItem ? '编辑链接' : '添加链接',
  })
  modal.classList.add('editor')

  // Prepare initial data
  const firstGroup = (cfg.groups && cfg.groups[0]) || undefined
  const defaultGroup =
    helpers.defaultGroupId || (firstGroup && firstGroup.id) || ''

  const currentGroupId = helpers.existingItem
    ? helpers.defaultGroupId || defaultGroup
    : defaultGroup

  const formData: LinkFormData = helpers.existingItem
    ? {
        id: helpers.existingItem.id,
        groupId: currentGroupId,
        name: helpers.existingItem.name || '新项',
        icon: helpers.existingItem.icon,
        type: helpers.existingItem.type || 'url',
        data:
          helpers.existingItem.data ||
          (helpers.existingItem.type === 'js' ? '' : '/'),
        openIn:
          helpers.existingItem.openIn || helpers.defaultOpen || 'same-tab',
        hidden: helpers.existingItem.hidden,
      }
    : {
        id: uid(),
        groupId: defaultGroup,
        name: '新项',
        type: 'url',
        data: '/',
        openIn: helpers.defaultOpen || 'same-tab',
      }

  const formContainer = document.createElement('div')

  renderLinkForm(formContainer, formData, {
    root,
    groups: cfg.groups || [],
    disableGroupSelector: Boolean(helpers.existingItem), // Disable group selector if editing existing item, matching original logic
    onChange() {
      // Form data is mutated directly, no specific action needed here unless we want to enable/disable buttons
    },
    onPickStart() {
      modal.style.display = 'none'
      mask.remove()
    },
    onPickEnd() {
      modal.style.display = ''
      root.append(mask)
    },
  })

  body.append(formContainer)

  const saveBtn = document.createElement('button')
  saveBtn.className = 'btn btn-primary'
  saveBtn.textContent = helpers.existingItem ? '确认' : '添加'
  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'btn btn-secondary'
  cancelBtn.textContent = '取消'
  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'btn btn-secondary'
  deleteBtn.textContent = '删除'

  saveBtn.addEventListener('click', () => {
    const gid = formData.groupId
    const grp = (cfg.groups || []).find((g: any) => g.id === gid)
    if (!grp) return

    const hasDup = hasDuplicateInGroup(
      grp,
      formData.type,
      formData.data,
      helpers.existingItem?.id
    )
    if (hasDup) {
      const msg =
        formData.type === 'url'
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
      it.name = formData.name
      it.icon = formData.icon
      it.type = formData.type
      it.data = formData.data
      it.openIn = formData.openIn
      it.hidden = formData.hidden
      // Note: We don't support moving groups in edit mode currently as selector is disabled,
      // but if we did, we'd need to remove from old group and add to new one.
      // The original code disabled the selector, so we keep it that way.
    } else {
      const it = {
        id: formData.id || uid(),
        name: formData.name,
        icon: formData.icon,
        type: formData.type,
        data: formData.data,
        openIn: formData.openIn,
        hidden: formData.hidden,
      }
      grp.items.push(it)
    }

    try {
      helpers.saveConfig(cfg)
    } catch {}

    close()
  })

  deleteBtn.addEventListener('click', () => {
    if (!helpers.existingItem) return
    const ok = globalThis.confirm('是否删除此链接？')
    if (!ok) return
    const gid = formData.groupId
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

      close()
    }
  })

  cancelBtn.addEventListener('click', close)

  actions.append(saveBtn)
  actions.append(cancelBtn)

  if (helpers.existingItem) {
    actions.append(deleteBtn)
  }
}
