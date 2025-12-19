import { getValue, setValue } from '../../common/gm'
import { uid } from '../../utils/uid'

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
}

export type ShortcutsConfig = {
  groups: ShortcutsGroup[]
}

export class ShortcutsStore {
  private lastSaved = ''

  async load(): Promise<ShortcutsConfig> {
    try {
      const v = await getValue<string>(CONFIG_KEY, '')
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

    const g: ShortcutsGroup = {
      id: uid(),
      name: '默认组',
      icon: 'lucide:folder',
      match: ['*'],
      defaultOpen: OPEN_DEFAULT,
      items: [
        {
          id: uid(),
          name: '首页',
          icon: 'lucide:home',
          type: 'url',
          data: '/',
          openIn: OPEN_DEFAULT,
          hidden: false,
        },
        {
          id: uid(),
          name: 'Google 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q={selected||query}',
          openIn: 'new-tab',
          hidden: false,
        },
        {
          id: uid(),
          name: 'Gemini',
          icon: 'favicon',
          type: 'url',
          data: 'https://gemini.google.com/app',
          openIn: 'new-tab',
          hidden: false,
        },
        {
          id: uid(),
          name: '站内搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q=site:{hostname}%20{selected||query}',
          openIn: 'new-tab',
          hidden: false,
        },
      ],
      collapsed: false,
      itemsPerRow: 1,
      hidden: false,
    }
    const readLater: ShortcutsGroup = {
      id: uid(),
      name: '稍后阅读',
      icon: 'lucide:clock',
      match: ['*'],
      defaultOpen: 'new-tab',
      items: [],
    }
    const community: ShortcutsGroup = {
      id: uid(),
      name: '社区',
      icon: 'lucide:users',
      match: ['*'],
      defaultOpen: 'new-tab',
      items: [
        {
          id: uid(),
          name: 'V2EX',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.v2ex.com/',
          openIn: 'new-tab',
          hidden: false,
        },
        {
          id: uid(),
          name: 'LINUX DO',
          icon: 'favicon',
          type: 'url',
          data: 'https://linux.do/',
          openIn: 'new-tab',
          hidden: false,
        },
        {
          id: uid(),
          name: '2Libra',
          icon: 'favicon',
          type: 'url',
          data: 'https://2libra.com/?ref=utags-shortcuts',
          openIn: 'new-tab',
          hidden: false,
        },
        {
          id: uid(),
          name: '小众软件',
          icon: 'favicon',
          type: 'url',
          data: 'https://meta.appinn.net/',
          openIn: 'new-tab',
          hidden: false,
        },
      ],
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _2libra_1: ShortcutsGroup = {
      id: 'k10czcms',
      name: '2Libra 邀请码',
      icon: 'url:https://2libra.com/favicon.ico',
      match: ['https://2libra.com/?ref=utags-shortcuts'],
      defaultOpen: 'same-tab',
      items: [
        {
          id: '1AeoTgXc',
          name: '注册后额外获得 1,000 金币',
          icon: 'favicon',
          type: 'url',
          data: 'https://2libra.com/auth/signup/1AeoTgXc',
        },
      ],
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _2libra_2: ShortcutsGroup = {
      id: 'k20czcms',
      name: '2libra',
      icon: 'lucide:folder',
      match: ['*://2libra.com/*'],
      defaultOpen: 'same-tab',
      items: [
        {
          id: 'zijgxywv',
          name: '首页',
          icon: 'favicon',
          type: 'url',
          data: '/',
          openIn: 'same-tab',
        },
        {
          id: 'g3p7kbzm',
          name: '今日热议',
          icon: '🔥',
          type: 'url',
          data: 'https://2libra.com/post/hot/today',
          openIn: 'same-tab',
        },
        {
          id: 'svoiq3sz',
          name: '近期热议',
          type: 'url',
          data: 'https://2libra.com/post/hot/recent',
          openIn: 'same-tab',
          icon: '🔥',
        },
        {
          id: 'aupy1kcr',
          name: '新发表',
          type: 'url',
          data: 'https://2libra.com/post/latest',
          openIn: 'same-tab',
          hidden: false,
        },
        {
          id: 'pivybx9n',
          name: '通知',
          type: 'url',
          data: 'https://2libra.com/notifications',
          openIn: 'same-tab',
          hidden: false,
          icon: 'lucide:bell',
        },
        {
          id: 'q0s43wxr',
          name: '金币',
          icon: 'lucide:bitcoin',
          type: 'url',
          data: 'https://2libra.com/coins',
          openIn: 'same-tab',
        },
      ],
      itemsPerRow: 2,
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _2libra_3: ShortcutsGroup = {
      id: '204999q7',
      name: '主题',
      icon: 'lucide:messages-square',
      match: [
        '!*://2libra.com/post/hot/*',
        '!*://2libra.com/post/latest',
        '*://2libra.com/post/*',
        '*://2libra.com/post-flat/*',
      ],
      defaultOpen: 'same-tab',
      items: [
        {
          id: '5bwly4kb',
          name: '切换评论模式',
          icon: 'lucide:refresh-cw',
          type: 'js',
          data: "return location.pathname.includes('/post/') ? location.pathname.replace('/post/', '/post-flat/') : location.pathname.replace('/post-flat/', '/post/')",
          openIn: 'same-tab',
        },
      ],
    }

    return {
      groups: [g, readLater, community, _2libra_1, _2libra_2, _2libra_3],
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
