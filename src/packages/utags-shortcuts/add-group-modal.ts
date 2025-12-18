import { uid } from '../../utils/uid'
import { createModalFrame } from './modal-base'
import { renderGroupForm } from './group-form'

export function openAddGroupModal(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
    defaultOpen: 'same-tab' | 'new-tab'
    defaultMatch?: string[]
    existingGroup?: any
  }
) {
  const { modal, body, actions, close } = createModalFrame({
    root,
    title: helpers.existingGroup ? '编辑分组' : '添加分组',
  })
  modal.classList.add('editor')

  // Prepare initial data
  const initialData = {
    name: helpers.existingGroup?.name || '新分组',
    displayName: helpers.existingGroup?.displayName,
    icon: helpers.existingGroup?.icon || 'lucide:folder',
    match: helpers.existingGroup?.match ||
      helpers.defaultMatch || ['*://' + (location.hostname || '') + '/*'],
    defaultOpen:
      helpers.existingGroup?.defaultOpen || helpers.defaultOpen || 'same-tab',
    itemsPerRow: helpers.existingGroup?.itemsPerRow || 1,
    hidden: helpers.existingGroup?.hidden,
  }

  // Render form
  renderGroupForm(body, initialData, {
    onChange() {
      // Optional: Handle live validation or preview if needed
    },
  })

  const saveBtn = document.createElement('button')
  saveBtn.className = 'btn btn-primary'
  saveBtn.textContent = helpers.existingGroup ? '确认' : '添加'
  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'btn btn-secondary'
  cancelBtn.textContent = '取消'

  saveBtn.addEventListener('click', () => {
    const res = initialData
    if (!res.name) {
      return
    }

    if (helpers.existingGroup) {
      const g = helpers.existingGroup
      Object.assign(g, res)
      if (!res.displayName) delete g.displayName
    } else {
      const g = {
        id: uid(),
        items: [],
        ...res,
      }
      if (!res.displayName) delete (g as any).displayName
      cfg.groups.push(g)
    }

    try {
      helpers.saveConfig(cfg)
    } catch {}

    try {
      helpers.rerender(root, cfg)
    } catch {}

    close()
  })

  cancelBtn.addEventListener('click', close)

  actions.append(saveBtn)
  actions.append(cancelBtn)
}
