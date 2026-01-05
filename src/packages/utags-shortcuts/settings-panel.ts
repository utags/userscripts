import styleText from 'css:./style.css'

import { xmlHttpRequestWithFallback } from '../../common/gm'
import { getValue, setValue } from '../../common/gm/storage'
import {
  closeSettingsPanel,
  createSettingsStore,
  openSettingsPanel as openPanel,
  type Field,
  type Group,
  type PanelSchema,
  type Store,
} from '../../common/settings'
import { ensureShadowRoot, setIcon } from '../../utils/dom'
import { importJson } from '../../utils/import-json'
import { deepMergeReplaceArrays } from '../../utils/obj'
import { uid } from '../../utils/uid'
import { openEditorModal } from './editor-modal-tabs'
import { importAndSave } from './importer'
import { createModalFrame } from './modal-base'
import { shortcutsStore, type ShortcutsConfig } from './store'

const SETTINGS_KEY = 'settings'

const POSITION_OPTIONS = [
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
]

const DEFAULTS = {
  hotkey: 'Alt+Shift+K',
  syncUrl: '',
  position: 'right-top',
  defaultOpen: 'same-tab',
  theme: 'system',
  panelBackgroundColor: 'default',
  pinned: false,
  enabled: true,
  layoutMode: 'floating',
  sidebarSide: 'right',
  sidebarUseIframe: false,
  edgeWidth: 3,
  edgeHeight: 60,
  edgeOpacity: 0.6,
  edgeColorLight: '#1A73E8',
  edgeColorDark: '#8AB4F8',
  edgeHidden: false,
} as const

const COMMON_SETTINGS_FIELDS: Field[] = [
  { type: 'toggle', key: 'enabled', label: '启用' },
  {
    type: 'input',
    key: 'hotkey',
    label: '快捷键',
    placeholder: DEFAULTS.hotkey,
    help: '打开面板的快捷键',
  },
  {
    type: 'radio',
    key: 'defaultOpen',
    label: '默认打开方式',
    options: [
      { value: 'same-tab', label: '同标签' },
      { value: 'new-tab', label: '新标签' },
    ],
    help: '选择点击链接时的默认打开行为',
  },
  {
    type: 'radio',
    key: 'theme',
    label: '主题',
    options: [
      { value: 'system', label: '系统' },
      { value: 'light', label: '浅色' },
      { value: 'dark', label: '深色' },
    ],
    help: '导航面板主题偏好',
  },
  {
    type: 'radio',
    key: 'panelBackgroundColor',
    label: '面板背景',
    options: [
      { value: 'default', label: '默认' },
      { value: '#ffffff', label: '纯白' },
      { value: '#fdf6e3', label: '暖色' },
      { value: '#f0f9eb', label: '护眼' },
      { value: '#1f2937', label: '暗色' },
      { value: '#000000', label: '纯黑' },
    ],
    help: '自定义导航面板背景颜色',
  },
]

const EDGE_SETTINGS_FIELDS: Field[] = [
  {
    type: 'radio',
    key: 'layoutMode',
    label: '显示模式',
    options: [
      { value: 'floating', label: '悬浮' },
      { value: 'sidebar', label: '侧边栏' },
    ],
  },
  {
    type: 'toggle',
    key: 'sidebarUseIframe',
    label: '侧边栏使用 iframe 加载',
    renderHelp(el) {
      el.append(
        '启用后，在侧边栏模式下，使用 iframe 加载页面，避免遮挡内容（需要刷新页面才会生效）。部分网站因安全策略不支持 iframe，将自动回退到普通模式。如有问题请反馈：'
      )
      const a = document.createElement('a')
      a.href = 'https://github.com/utags/userscripts/issues'
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.textContent = 'utags/userscripts/issues'
      el.append(a)
    },
  },
  { type: 'toggle', key: 'pinned', label: '固定面板' },
  {
    type: 'radio',
    key: 'sidebarSide',
    label: '侧边栏位置',
    options: [
      { value: 'left', label: '左侧' },
      { value: 'right', label: '右侧' },
    ],
  },
  {
    type: 'select',
    key: 'position',
    label: '位置',
    options: POSITION_OPTIONS.map((p) => ({ value: p, label: p })),
    help: '控制悬停竖线提示的位置',
  },
  {
    type: 'input',
    key: 'edgeWidth',
    label: '竖线宽度',
    help: '单位像素，建议 2-4',
  },
  {
    type: 'input',
    key: 'edgeHeight',
    label: '竖线高度',
    help: '单位像素，建议 40-80',
  },
  {
    type: 'input',
    key: 'edgeOpacity',
    label: '不透明度',
    help: '0-1 之间的小数',
  },
  {
    type: 'colors',
    key: 'edgeColorLight',
    label: '浅色主题颜色',
    options: [
      { value: '#1A73E8' },
      { value: '#2563EB' },
      { value: '#3B82F6' },
      { value: '#10B981' },
      { value: '#F59E0B' },
      { value: '#EF4444' },
      { value: '#6B7280' },
    ],
    help: '用于浅色主题的竖线颜色',
  },
  {
    type: 'colors',
    key: 'edgeColorDark',
    label: '深色主题颜色',
    options: [
      { value: '#8AB4F8' },
      { value: '#60A5FA' },
      { value: '#93C5FD' },
      { value: '#22C55E' },
      { value: '#F59E0B' },
      { value: '#EF4444' },
      { value: '#9CA3AF' },
    ],
    help: '用于深色主题的竖线颜色',
  },
  { type: 'toggle', key: 'edgeHidden', label: '隐藏竖线' },
  {
    type: 'action',
    key: 'edge-reset',
    label: '竖线设置',
    actions: [{ id: 'edgeReset', text: '重置默认' }],
    help: '恢复竖线宽度/高度/不透明度与颜色为默认值',
  },
]

export function createUshortcutsSettingsStore() {
  return createSettingsStore(SETTINGS_KEY, DEFAULTS, true)
}

function getShadowRoot() {
  const { root } = ensureShadowRoot({
    hostId: 'utags-shortcuts',
    hostDatasetKey: 'ushortcutsHost',
    style: styleText,
  })
  return root
}

export function openSettingsPanel(store: Store): void {
  store.onBeforeSet(async (values) => {
    if ('panelBackgroundColor' in values) {
      const v = values.panelBackgroundColor as string
      if (['#ffffff', '#fdf6e3', '#f0f9eb'].includes(v)) {
        values.theme = 'light'
      } else if (['#1f2937', '#000000'].includes(v)) {
        values.theme = 'dark'
      }
    }

    // Avoid resetting if we just set it above
    if ('theme' in values && !('panelBackgroundColor' in values)) {
      values.panelBackgroundColor = 'default'
    }

    return values
  })

  const schema: PanelSchema = {
    type: 'tabs',
    title: '快捷导航设置',
    tabs: [
      {
        id: 'global',
        title: '全局设置',
        groups: [
          {
            id: 'global-basic',
            title: '',
            fields: COMMON_SETTINGS_FIELDS,
          },
          {
            id: 'global-edge',
            title: '面板与竖线',
            fields: EDGE_SETTINGS_FIELDS,
          },
          {
            id: 'global-reset',
            title: '',
            fields: [
              {
                type: 'action',
                key: 'global-reset',
                label: '重置',
                actions: [{ id: 'resetGlobal', text: '重置全局设置' }],
                help: '恢复全局设置为默认值',
              },
            ] as Field[],
          },
        ] as Group[],
      },
      {
        id: 'site',
        title: '当前网站设置',
        groups: [
          {
            id: 'site-basic',
            title: '',
            fields: COMMON_SETTINGS_FIELDS.map((f) => ({
              ...f,
              isSitePref: true,
            })),
          },
          {
            id: 'site-edge',
            title: '面板与竖线',
            fields: EDGE_SETTINGS_FIELDS.map((f) => ({
              ...f,
              isSitePref: true,
            })),
          },
          {
            id: 'site-reset',
            title: '',
            fields: [
              {
                type: 'action',
                key: 'site-reset',
                label: '重置',
                actions: [{ id: 'resetSite', text: '重置当前网站设置' }],
                help: '恢复当前网站设置为默认值',
              },
            ] as Field[],
          },
        ] as Group[],
      },
      {
        id: 'actions',
        title: '数据管理',
        groups: [
          {
            id: 'data-group-manager',
            title: '分组与导航项',
            fields: [
              {
                type: 'action',
                key: 'group-management',
                label: '分组管理',
                actions: [{ id: 'openGroupManager', text: '打开分组管理' }],
                help: '管理导航分组与导航项',
              },
              {
                type: 'action',
                key: 'export-import',
                label: '数据导出',
                actions: [
                  { id: 'exportShortcutsDataJson', text: '导出 JSON 文件' },
                ],
                help: '导出所有配置（包含各分组、导航项设置）',
              },
              {
                type: 'action',
                key: 'import-data',
                label: '数据导入',
                actions: [
                  { id: 'importShortcutsDataJson', text: '从 JSON 文件导入' },
                  { id: 'importShortcutsDataUrl', text: '从 URL 导入' },
                  { id: 'importShortcutsDataText', text: '粘贴文本导入' },
                ],
                renderHelp(el) {
                  el.append('导入之前导出的文件。')
                  el.append(document.createElement('br'))
                  const span = document.createElement('span')
                  span.textContent = '从 '
                  const a = document.createElement('a')
                  a.href = 'https://github.com/utags/utags-shared-shortcuts'
                  a.target = '_blank'
                  a.rel = 'noopener noreferrer'
                  a.textContent = 'utags-shared-shortcuts'
                  span.append(a, ' 发现更多 shortcuts')
                  el.append(span)
                },
                layout: 'vertical',
              },
              {
                type: 'action',
                key: 'clear-data',
                label: '清空所有数据',
                actions: [
                  { id: 'clearShortcutsData', text: '执行', kind: 'danger' },
                ],
              },
            ] as Field[],
          },
          {
            id: 'data-settings',
            title: '设置',
            fields: [
              {
                type: 'action',
                key: 'export-import',
                label: '数据导出',
                actions: [{ id: 'exportSettingsJson', text: '导出 JSON 文件' }],
                help: '导出所有设置',
              },
              {
                type: 'action',
                key: 'export-import',
                label: '数据导入',
                actions: [
                  { id: 'importSettingsJson', text: '从 JSON 文件导入' },
                ],
                help: '导入之前导出的文件',
              },
            ] as Field[],
          },
        ] as Group[],
      },
    ],
  }

  openPanel(schema, store, {
    hostDatasetKey: 'ushortcutsHost',
    hostDatasetValue: 'ushortcuts-settings',
    theme: {
      activeBg: '#111827',
      activeFg: '#ffffff',
      colorRing: '#111827',
      toggleOnBg: '#111827',
    },
    onAction({ actionId }) {
      const handleImportSuccess = async (data: any): Promise<boolean> => {
        const root = getShadowRoot()

        const mode = await new Promise<'overwrite' | 'merge' | undefined>(
          (resolve) => {
            const { body, actions, close } = createModalFrame({
              title: '选择合并模式',
              root,
              onClose() {
                resolve(undefined)
              },
            })

            closeSettingsPanel()

            const container = document.createElement('div')
            container.className = 'merge-options'

            // Overwrite Option
            const btnOverwrite = document.createElement('div')
            btnOverwrite.className = 'merge-option'

            const iconOverwrite = document.createElement('div')
            iconOverwrite.className = 'merge-icon'
            setIcon(iconOverwrite, 'lucide:file-warning')

            const contentOverwrite = document.createElement('div')
            contentOverwrite.className = 'merge-content'

            const titleOverwrite = document.createElement('strong')
            titleOverwrite.textContent = '覆盖模式'
            const descOverwrite = document.createElement('span')
            descOverwrite.textContent =
              '保留所有分组。若分组 ID 相同，使用导入文件中的导航项列表（完全替换）。'

            contentOverwrite.append(titleOverwrite, descOverwrite)
            btnOverwrite.append(iconOverwrite, contentOverwrite)

            btnOverwrite.addEventListener('click', () => {
              resolve('overwrite')
              close()
            })

            // Merge Option
            const btnMerge = document.createElement('div')
            btnMerge.className = 'merge-option'

            const iconMerge = document.createElement('div')
            iconMerge.className = 'merge-icon'
            setIcon(iconMerge, 'lucide:git-merge')

            const contentMerge = document.createElement('div')
            contentMerge.className = 'merge-content'

            const titleMerge = document.createElement('strong')
            titleMerge.textContent = '合并模式'
            const descMerge = document.createElement('span')
            descMerge.textContent =
              '保留所有分组。若分组 ID 相同，合并导航项（若 ID 相同则使用导入的数据）。'

            contentMerge.append(titleMerge, descMerge)
            btnMerge.append(iconMerge, contentMerge)

            btnMerge.addEventListener('click', () => {
              resolve('merge')
              close()
            })

            container.append(btnMerge, btnOverwrite)
            body.append(container)

            const btnCancel = document.createElement('button')
            btnCancel.className = 'btn btn-secondary'
            btnCancel.textContent = '取消'
            btnCancel.addEventListener('click', () => {
              resolve(undefined)
              close()
            })
            actions.append(btnCancel)
          }
        )

        if (!mode) return false

        await importAndSave(shortcutsStore, data, mode)
        return true
      }

      switch (actionId) {
        case 'importShortcutsDataUrl': {
          closeSettingsPanel()

          const root = getShadowRoot()
          const { body, actions, close } = createModalFrame({
            title: '从 URL 导入',
            root,
          })

          const input = document.createElement('input')
          input.type = 'url'
          input.className = 'form-input'
          input.placeholder = 'https://example.com/shortcuts.json'
          input.style.width = '100%'
          input.style.marginBottom = '10px'
          input.style.padding = '8px'
          input.style.border = '1px solid #ccc'
          input.style.borderRadius = '4px'

          setTimeout(() => {
            input.focus()
          }, 100)

          body.append(input)

          const btnImport = document.createElement('button')
          btnImport.className = 'btn btn-primary'
          btnImport.textContent = '导入'

          const btnCancel = document.createElement('button')
          btnCancel.className = 'btn btn-secondary'
          btnCancel.textContent = '取消'

          const doImport = () => {
            const url = input.value.trim()
            if (!url) return

            btnImport.disabled = true
            btnImport.textContent = '下载中...'

            void xmlHttpRequestWithFallback({
              method: 'GET',
              url,
              async onload(res) {
                try {
                  const data = JSON.parse(res.responseText)
                  if (
                    data &&
                    (Array.isArray(data.groups) || Array.isArray(data.items))
                  ) {
                    close()
                    const ok = await handleImportSuccess(data)
                    if (ok) {
                      globalThis.alert('导入成功')
                    }
                  } else {
                    globalThis.alert(
                      '无效的导航数据文件（缺少 groups 或 items 字段）'
                    )
                    btnImport.disabled = false
                    btnImport.textContent = '导入'
                  }
                } catch {
                  globalThis.alert('JSON 解析失败')
                  btnImport.disabled = false
                  btnImport.textContent = '导入'
                }
              },
              onerror() {
                globalThis.alert('请求失败')
                btnImport.disabled = false
                btnImport.textContent = '导入'
              },
            })
          }

          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doImport()
          })

          btnImport.addEventListener('click', doImport)
          btnCancel.addEventListener('click', close)

          actions.append(btnImport, btnCancel)
          break
        }

        case 'importShortcutsDataText': {
          closeSettingsPanel()

          const root = getShadowRoot()
          const { body, actions, close } = createModalFrame({
            title: '粘贴文本导入',
            root,
          })

          const textarea = document.createElement('textarea')
          textarea.className = 'form-textarea'
          textarea.placeholder = '请在此粘贴 JSON 内容...'
          textarea.style.width = '100%'
          textarea.style.height = '200px'
          textarea.style.marginBottom = '10px'
          textarea.style.padding = '8px'
          textarea.style.border = '1px solid #ccc'
          textarea.style.borderRadius = '4px'

          setTimeout(() => {
            textarea.focus()
          }, 100)

          body.append(textarea)

          const btnImport = document.createElement('button')
          btnImport.className = 'btn btn-primary'
          btnImport.textContent = '导入'

          const btnCancel = document.createElement('button')
          btnCancel.className = 'btn btn-secondary'
          btnCancel.textContent = '取消'

          const doImport = async () => {
            const text = textarea.value.trim()
            if (!text) return

            try {
              const data = JSON.parse(text)
              if (
                data &&
                (Array.isArray(data.groups) || Array.isArray(data.items))
              ) {
                close()
                const ok = await handleImportSuccess(data)
                if (ok) {
                  globalThis.alert('导入成功')
                }
              } else {
                globalThis.alert(
                  '无效的导航数据文件（缺少 groups 或 items 字段）'
                )
              }
            } catch {
              globalThis.alert('JSON 解析失败')
            }
          }

          btnImport.addEventListener('click', doImport)
          btnCancel.addEventListener('click', close)

          actions.append(btnImport, btnCancel)
          break
        }

        case 'openGroupManager': {
          ;(async () => {
            try {
              const root = getShadowRoot()

              let raw: any = {}
              try {
                raw = await shortcutsStore.load()
              } catch {}

              if (!Array.isArray(raw.groups) || raw.groups.length === 0) {
                const g = {
                  id: uid(),
                  name: '默认组',
                  icon: 'lucide:folder',
                  match: ['*'],
                  defaultOpen: 'same-tab',
                  items: [
                    {
                      id: uid(),
                      name: '首页',
                      icon: 'lucide:home',
                      type: 'url',
                      data: '/',
                      openIn: 'same-tab',
                      hidden: false,
                    },
                  ],
                  collapsed: false,
                  itemsPerRow: 1,
                  hidden: false,
                }
                raw.groups = [g]
              }

              const sitePref = await store.getAll()

              openEditorModal(root, raw, {
                async saveConfig(cfg) {
                  try {
                    await shortcutsStore.save(cfg)
                  } catch {}
                },
                rerender() {
                  void 0
                },
                sitePref,
                updateThemeUI() {
                  void 0
                },
                edgeDefaults: {
                  width: 3,
                  height: 60,
                  opacity: 0.6,
                  colorLight: '#1A73E8',
                  colorDark: '#8AB4F8',
                },
                tempOpenGetter() {
                  return false
                },
              })

              try {
                const modal = root.querySelector('.modal.editor')!
                const segs = Array.from(
                  modal.querySelectorAll('.segmented .seg-item')
                )
                for (const seg of segs) {
                  const textEl = seg.querySelector('.seg-text')
                  const inputEl = seg.querySelector('.seg-radio')
                  if (
                    textEl &&
                    textEl.textContent === '分组' &&
                    inputEl instanceof HTMLInputElement
                  ) {
                    inputEl.click()
                    break
                  }
                }

                closeSettingsPanel()
              } catch {}
            } catch {}
          })()

          break
        }

        case 'exportShortcutsDataJson': {
          ;(async () => {
            try {
              let raw = {}
              try {
                raw = await shortcutsStore.load()
              } catch {}

              const date = new Date()
              const timestamp = `${date.getFullYear()}${String(
                date.getMonth() + 1
              ).padStart(
                2,
                '0'
              )}${String(date.getDate()).padStart(2, '0')}_${String(
                date.getHours()
              ).padStart(
                2,
                '0'
              )}${String(date.getMinutes()).padStart(2, '0')}${String(
                date.getSeconds()
              ).padStart(2, '0')}`
              const blob = new Blob([JSON.stringify(raw, null, 2)], {
                type: 'application/json',
              })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `utags-shortcuts-data-${timestamp}.json`
              a.click()
              setTimeout(() => {
                URL.revokeObjectURL(url)
              }, 1000)
            } catch {}
          })()

          break
        }

        case 'exportSettingsJson': {
          ;(async () => {
            try {
              const raw = await getValue(SETTINGS_KEY, {})
              const date = new Date()
              const timestamp = `${date.getFullYear()}${String(
                date.getMonth() + 1
              ).padStart(
                2,
                '0'
              )}${String(date.getDate()).padStart(2, '0')}_${String(
                date.getHours()
              ).padStart(
                2,
                '0'
              )}${String(date.getMinutes()).padStart(2, '0')}${String(
                date.getSeconds()
              ).padStart(2, '0')}`
              const blob = new Blob([JSON.stringify(raw, null, 2)], {
                type: 'application/json',
              })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `utags-shortcuts-settings-${timestamp}.json`
              a.click()
              setTimeout(() => {
                URL.revokeObjectURL(url)
              }, 1000)
            } catch {}
          })()

          break
        }

        case 'importShortcutsDataJson': {
          importJson({
            validate: (data: any) =>
              data && (Array.isArray(data.groups) || Array.isArray(data.items)),
            errorMessage: '无效的导航数据文件（缺少 groups 或 items 字段）',
            confirmMessage: '',
            async onSuccess(data) {
              await handleImportSuccess(data)
            },
          })

          break
        }

        case 'importSettingsJson': {
          importJson({
            validate: (data: any) =>
              data && typeof data === 'object' && !Array.isArray(data),
            errorMessage: '无效的设置文件（格式应为对象）',
            async onSuccess(obj) {
              const existing = await getValue(SETTINGS_KEY, {})
              // No deep merge, just simple object merge.
              const merged = { ...existing, ...obj }

              await setValue(SETTINGS_KEY, merged)
            },
          })

          break
        }

        case 'clearShortcutsData': {
          const ok = globalThis.confirm(
            '是否真的要清空数据？不可逆，建议先导出备份。'
          )
          if (!ok) break
          ;(async () => {
            try {
              await shortcutsStore.save({ groups: [] })
            } catch {}
          })()

          break
        }

        case 'resetGlobal': {
          const ok = globalThis.confirm(
            '确认要重置全局设置吗？（不影响当前网站设置）'
          )
          if (!ok) break
          ;(async () => {
            try {
              await store.reset(true)
            } catch {}
          })()

          break
        }

        case 'resetSite': {
          const ok = globalThis.confirm('确认要重置当前网站设置吗？')
          if (!ok) break
          ;(async () => {
            try {
              await store.reset(false)
            } catch {}
          })()

          break
        }

        case 'edgeReset': {
          ;(async () => {
            try {
              await store.set({
                position: DEFAULTS.position,
                edgeWidth: DEFAULTS.edgeWidth,
                edgeHeight: DEFAULTS.edgeHeight,
                edgeOpacity: DEFAULTS.edgeOpacity,
                edgeColorLight: DEFAULTS.edgeColorLight,
                edgeColorDark: DEFAULTS.edgeColorDark,
                edgeHidden: DEFAULTS.edgeHidden,
              })
            } catch {}
          })()

          break
        }

        default: {
          break
        }
      }
    },
  })
}
