import { deepMergeReplaceArrays } from '../../utils/obj'
import {
  createSettingsStore,
  openSettingsPanel as openPanel,
  closeSettingsPanel,
  type Field,
  type Group,
  type PanelSchema,
  type Store,
} from '../../common/settings'
import { getValue, setValue } from '../../common/gm'
import { openEditorModal } from './editor-modal-tabs'
import styleText from 'css:./style.css'
import { uid } from '../../utils/uid'
import { importJson } from '../../utils/import-json'

const SETTINGS_KEY = 'settings'
export const CONFIG_KEY = 'ushortcuts'

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
  pinned: false,
  enabled: true,
  layoutMode: 'floating',
  sidebarSide: 'right',
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
    help: '站点级主题偏好',
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

export function openSettingsPanel(store: Store): void {
  const schema: PanelSchema = {
    type: 'tabs',
    title: '快速导航设置',
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
        title: '站点设置',
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
                actions: [{ id: 'resetSite', text: '重置站点设置' }],
                help: '恢复当前站点设置为默认值',
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
                key: 'export-import',
                label: '数据导入',
                actions: [
                  { id: 'importShortcutsDataJson', text: '从 JSON 文件导入' },
                ],
                help: '导入之前导出的文件',
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
      switch (actionId) {
        case 'openGroupManager': {
          ;(async () => {
            try {
              const existing = document.querySelector(
                '[data-ushortcuts-host="ushortcuts"]'
              )
              const root =
                existing instanceof HTMLElement && existing.shadowRoot
                  ? existing.shadowRoot
                  : (() => {
                      const host = document.createElement('div')
                      host.dataset.ushortcutsHost = 'ushortcuts'
                      const r = host.attachShadow({ mode: 'open' })
                      const style = document.createElement('style')
                      style.textContent = styleText
                      r.append(style)
                      document.documentElement.append(host)
                      return r
                    })()

              let raw: any = {}
              try {
                const s = await getValue(CONFIG_KEY, '')
                raw = s ? JSON.parse(String(s) || '{}') || {} : {}
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
                    await setValue(CONFIG_KEY, JSON.stringify(cfg))
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
              const s = await getValue(CONFIG_KEY, '')
              const raw = s ? JSON.parse(String(s) || '{}') || {} : {}
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
            validate: (data: any) => data && Array.isArray(data.groups),
            errorMessage: '无效的导航数据文件（缺少 groups 字段）',
            async onSuccess(obj) {
              const existing = await getValue(CONFIG_KEY, '')
              const existingObj = existing
                ? JSON.parse(String(existing) || '{}') || {}
                : {}
              // Deep merge (arrays replaced).
              const merged = deepMergeReplaceArrays(existingObj, obj)

              await setValue(CONFIG_KEY, JSON.stringify(merged))
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
              await setValue(CONFIG_KEY, JSON.stringify({}))
            } catch {}
          })()

          break
        }

        case 'resetGlobal': {
          const ok = globalThis.confirm(
            '确认要重置全局设置吗？（不影响站点设置）'
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
          const ok = globalThis.confirm('确认要重置当前站点设置吗？')
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
