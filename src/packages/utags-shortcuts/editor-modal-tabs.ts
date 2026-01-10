import { createGroupManagerPanel } from './group-manager-panel'
import { createModalFrame } from './modal-base'

export function openEditorModal(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    [key: string]: any
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
  }
) {
  const { modal, body, actions, close } = createModalFrame({
    root,
    title: '分组管理',
  })
  modal.classList.add('editor')

  const groupsPanel = createGroupManagerPanel(root, cfg, helpers)

  body.append(groupsPanel.el)

  const closeBtn = document.createElement('button')
  closeBtn.className = 'btn btn-secondary'
  closeBtn.textContent = '关闭'
  closeBtn.addEventListener('click', () => {
    // Check for unsaved changes in the group panel
    groupsPanel.checkUnsavedChanges(() => {
      close()
    })
  })
  actions.append(closeBtn)
}
