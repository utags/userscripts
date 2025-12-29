import { xmlHttpRequestWithFallback } from '../../common/gm'
import { getValue, setValue } from '../../common/gm/storage'
import { uid } from '../../utils/uid'
import { importAndSave } from './importer'

export const CONFIG_KEY = 'ushortcuts'

type OpenMode = 'same-tab' | 'new-tab'
const OPEN_DEFAULT: OpenMode = 'same-tab'

export type ShortcutsItem = {
  id: string
  name: string
  icon?: string
  type: 'url' | 'js'
  data: string
  openIn?: OpenMode
  hidden?: boolean
}

export type ShortcutsGroup = {
  id: string
  name: string
  icon?: string
  match: string[]
  defaultOpen?: OpenMode
  items: ShortcutsItem[]
  collapsed?: boolean
  itemsPerRow?: number
  hidden?: boolean
  displayName?: string
  displayStyle?: 'icon-title' | 'icon-only' | 'title-only'
  iconSize?: 'small' | 'medium' | 'large'
  iconItemsPerRow?: number
}

export type ShortcutsConfig = {
  groups: ShortcutsGroup[]
}

export class ShortcutsStore {
  private lastSaved = ''

  async load(): Promise<ShortcutsConfig> {
    try {
      const v = await getValue(CONFIG_KEY, '')
      if (v) {
        const raw = JSON.parse(String(v) || '{}')
        const ensureGroup = (gg: any): ShortcutsGroup => ({
          id: String(gg?.id || uid()),
          name: String(gg?.name || '默认组'),
          icon: String(gg?.icon || 'lucide:folder'),
          match: Array.isArray(gg?.match) ? gg.match : ['*'],
          defaultOpen: gg?.defaultOpen === 'new-tab' ? 'new-tab' : 'same-tab',
          items: Array.isArray(gg?.items) ? gg.items : [],
          collapsed: Boolean(gg?.collapsed),
          itemsPerRow: Number.isFinite(gg?.itemsPerRow) ? gg.itemsPerRow : 1,
          hidden: Boolean(gg?.hidden),
          displayName: gg?.displayName ? String(gg.displayName) : undefined,
          displayStyle:
            gg?.displayStyle === 'icon-only' ||
            gg?.displayStyle === 'title-only' ||
            gg?.displayStyle === 'icon-title'
              ? gg.displayStyle
              : 'icon-title',
          iconSize:
            gg?.iconSize === 'small' ||
            gg?.iconSize === 'medium' ||
            gg?.iconSize === 'large'
              ? gg.iconSize
              : 'medium',
          iconItemsPerRow: Number.isFinite(gg?.iconItemsPerRow)
            ? gg.iconItemsPerRow
            : 0,
        })

        const groupsArr: ShortcutsGroup[] = Array.isArray(raw?.groups)
          ? raw.groups.map((x: any) => ensureGroup(x))
          : []
        if (groupsArr.length === 0) {
          const g: ShortcutsGroup = ensureGroup({})
          g.items = [
            {
              id: uid(),
              name: '首页',
              icon: 'lucide:home',
              type: 'url',
              data: '/',
              openIn: OPEN_DEFAULT,
              hidden: false,
            },
          ]
          groupsArr.push(g)
        }

        const cfg: ShortcutsConfig = {
          groups: groupsArr,
        }
        return cfg
      }
    } catch {}

    // 初始化时，从 https://raw.githubusercontent.com/utags/utags-shared-shortcuts/main/zh-CN/collections/builtin_groups.json 导入数据
    // 使用 “合并模式” 策略。不询问用户是否确认合并。
    // 直接导入并持久化.
    void (async () => {
      try {
        const data = await new Promise<any>((resolve, reject) => {
          void xmlHttpRequestWithFallback({
            url: 'https://raw.githubusercontent.com/utags/utags-shared-shortcuts/main/zh-CN/collections/builtin_groups.json',
            method: 'GET',
            onload(response) {
              if (response.status === 200 && response.responseText) {
                try {
                  resolve(JSON.parse(response.responseText))
                } catch (error) {
                  reject(
                    error instanceof Error ? error : new Error(String(error))
                  )
                }
              } else {
                reject(new Error(`Fetch failed ${response.status}`))
              }
            },
            onerror(error) {
              reject(error instanceof Error ? error : new Error(String(error)))
            },
          })
        })

        await importAndSave(this, data, 'merge', { groups: [] })
      } catch (error) {
        console.error('Failed to init shortcuts', error)
      }
    })()

    return {
      groups: [],
    }
  }

  async save(cfg: ShortcutsConfig) {
    try {
      const s = JSON.stringify(cfg)
      if (s === this.lastSaved) return
      this.lastSaved = s
      await setValue(CONFIG_KEY, s)
    } catch {}
  }
}

export const shortcutsStore = new ShortcutsStore()
