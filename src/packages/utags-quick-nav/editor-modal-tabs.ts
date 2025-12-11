import { createSettingsPanel } from './settings-panel'
import { createGroupManagerPanel } from './group-manager-panel'
import { createSegmentedRadios } from './segmented-radios'

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

  let tab: 'settings' | 'groups' = 'settings'
  const tabs = createSegmentedRadios(
    tab,
    ['settings', 'groups'] as const,
    (v) => {
      tab = v
      syncUi()
    },
    {
      labels: { settings: '设置', groups: '分组' },
      namePrefix: 'utqn-editor-tabs-',
    }
  )

  const settingsWrap = document.createElement('div')
  const groupsWrap = document.createElement('div')
  const settingsPanel = createSettingsPanel(root, cfg, helpers)
  const groupsPanel = createGroupManagerPanel(root, cfg, {
    saveConfig: helpers.saveConfig,
    rerender: helpers.rerender,
    sitePref: helpers.sitePref,
  })
  settingsWrap.append(settingsPanel)
  groupsWrap.append(groupsPanel)

  const actions = document.createElement('div')
  actions.className = 'row'
  const closeBtn = document.createElement('button')
  closeBtn.className = 'btn btn-secondary'
  closeBtn.textContent = '关闭'
  closeBtn.addEventListener('click', () => {
    mask.remove()
  })
  actions.append(closeBtn)

  const syncUi = () => {
    settingsWrap.style.display = tab === 'settings' ? '' : 'none'
    groupsWrap.style.display = tab === 'groups' ? '' : 'none'
  }

  syncUi()

  modal.append(h2)
  modal.append(tabs)
  modal.append(settingsWrap)
  modal.append(groupsWrap)
  modal.append(actions)
  mask.append(modal)
  root.append(mask)
}
