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

    // Use fixed IDs to prevent duplicate data when importing backup data after reinstalling the script.
    const g: ShortcutsGroup = {
      id: 'default_group',
      name: '常用',
      icon: 'lucide:folder',
      match: ['*'],
      defaultOpen: OPEN_DEFAULT,
      items: [
        {
          id: 'default_home',
          name: '首页',
          icon: 'lucide:home',
          type: 'url',
          data: '/',
          openIn: OPEN_DEFAULT,
        },
        {
          id: 'default_google',
          name: 'Google 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q={selected||current_title||t:utags}',
          openIn: 'new-tab',
        },
        {
          id: 'default_gemini',
          name: 'Gemini',
          icon: 'favicon',
          type: 'url',
          data: 'https://gemini.google.com/app',
          openIn: 'new-tab',
        },
        {
          id: 'default_site_search',
          name: '站内搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q=site:{hostname_without_www}%20{selected||current_title}',
          openIn: 'new-tab',
        },
        {
          id: 'default_greasyfork_search',
          name: '搜索本站的油猴脚本',
          icon: 'favicon',
          type: 'url',
          data: 'https://greasyfork.org/scripts/by-site/{hostname_top_level}?filter_locale=0',
          openIn: 'new-tab',
        },
      ],
      collapsed: false,
      itemsPerRow: 1,
      hidden: false,
    }
    const readLater: ShortcutsGroup = {
      id: 'read_later_group',
      name: '稍后阅读',
      icon: 'lucide:clock',
      match: ['*'],
      defaultOpen: 'new-tab',
      items: [],
    }
    const searchGroup: ShortcutsGroup = {
      id: 'search_group',
      name: '搜索',
      icon: 'lucide:search',
      match: [
        '!https://www.google.com/search*',
        '!https://*.bing.com/search*',
        '!https://www.baidu.com/s?*',
        '!https://www.duckduckgo.com/*',
        '!https://duckduckgo.com/*',
        '*',
      ],
      defaultOpen: 'new-tab',
      collapsed: false,
      itemsPerRow: 1,
      items: [
        {
          id: 'google_search',
          name: 'Google 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q={selected||current_title||t:utags}',
        },
        {
          id: 'google_site_search',
          name: 'Google 站内搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q=site:{hostname_without_www}%20{selected||current_title}',
        },
        {
          id: 'bing_search',
          name: 'Bing 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.bing.com/search?q={selected||current_title||t:utags}',
        },
        {
          id: 'baidu_search',
          name: 'Baidu 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.baidu.com/s?wd={selected||current_title||t:utags}',
        },
        {
          id: 'baidu_site_search',
          name: 'Baidu 站内搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.baidu.com/s?wd=site:{hostname_without_www}%20{selected||current_title}',
        },
        {
          id: 'duckduckgo_search',
          name: 'DuckDuckGo 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://duckduckgo.com/?q={selected||current_title||t:utags}&ia=web',
        },
        {
          id: 'duckduckgo_site_search',
          name: 'DuckDuckGo 站内搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://duckduckgo.com/?q=site:{hostname_without_www}%20{selected||current_title}&ia=web',
        },
      ],
    }

    const searchSwitchGroup: ShortcutsGroup = {
      id: 'search_switch_group',
      name: '搜索切换',
      displayName: '搜索切换',
      icon: 'lucide:search',
      match: [
        'https://www.google.com/search*',
        'https://*.bing.com/search*',
        'https://www.baidu.com/s?*',
        'https://www.duckduckgo.com/*',
        'https://duckduckgo.com/*',
      ],
      defaultOpen: 'new-tab',
      collapsed: false,
      itemsPerRow: 1,
      items: [
        {
          id: 'google_search',
          name: 'Google 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q={selected||query||t:utags}',
        },
        {
          id: 'bing_search',
          name: 'Bing 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.bing.com/search?q={selected||query||t:utags}',
        },
        {
          id: 'baidu_search',
          name: 'Baidu 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.baidu.com/s?wd={selected||query||t:utags}',
        },
        {
          id: 'duckduckgo_search',
          name: 'DuckDuckGo 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://duckduckgo.com/?q={selected||query||t:utags}&ia=web',
        },
      ],
    }

    const community: ShortcutsGroup = {
      id: 'community_group',
      name: '社区',
      icon: 'lucide:users',
      match: ['*'],
      defaultOpen: 'new-tab',
      items: [
        {
          id: 'community_v2ex',
          name: 'V2EX',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.v2ex.com/',
          openIn: 'new-tab',
        },
        {
          id: 'community_linuxdo',
          name: 'LINUX DO',
          icon: 'favicon',
          type: 'url',
          data: 'https://linux.do/',
          openIn: 'new-tab',
        },
        {
          id: 'community_2libra',
          name: '2Libra',
          icon: 'favicon',
          type: 'url',
          data: 'https://2libra.com/?ref=utags-shortcuts',
          openIn: 'new-tab',
        },
        {
          id: 'community_appinn',
          name: '小众软件',
          icon: 'favicon',
          type: 'url',
          data: 'https://meta.appinn.net/',
          openIn: 'new-tab',
        },
      ],
    }

    const github: ShortcutsGroup = {
      id: 'github_repo',
      name: 'GitHub Repo',
      icon: 'url:https://github.com/favicon.ico',
      match: [
        '!/https://github\\.com/(topics|collections|trending|resources)/.*/',
        '/https://github\\.com/\\w+/\\w+(/.*)?$/',
      ],
      defaultOpen: 'same-tab',
      items: [
        {
          id: 'nkv2f0hp',
          name: 'Home',
          type: 'url',
          data: 'https://github.com/{p:1||t:utags}/{p:2||t:utags}',
          openIn: 'same-tab',
          icon: 'lucide:home',
        },
        {
          id: 'mw2j0leg',
          name: 'Issues',
          type: 'url',
          data: 'https://github.com/{p:1||t:utags}/{p:2||t:utags}/issues',
          openIn: 'same-tab',
        },
        {
          id: 'tuonitkh',
          name: 'Pull requests',
          type: 'url',
          data: 'https://github.com/{p:1||t:utags}/{p:2||t:utags}/pulls',
          openIn: 'same-tab',
        },
      ],
    }

    const v2ex: ShortcutsGroup = {
      id: 'v2ex_group',
      name: 'V2EX',
      icon: 'url:https://www.v2ex.com/favicon.ico',
      match: [
        '*://www.v2ex.com/*',
        '*://v2ex.com/*',
        '*://*.v2ex.com/*',
        '*://global.v2ex.co/*',
      ],
      defaultOpen: 'same-tab',
      items: [
        {
          id: 'rexmfgc5',
          name: '最热',
          icon: '🔥',
          type: 'url',
          data: '/?tab=hot',
          openIn: 'same-tab',
        },
        {
          id: '9hbsfrw1',
          name: '创意',
          icon: '💡',
          type: 'url',
          data: '/?tab=creative',
          openIn: 'same-tab',
        },
        {
          id: 'zr14ffbp',
          name: '全部',
          icon: 'lucide:link',
          type: 'url',
          data: '/?tab=all',
          openIn: 'same-tab',
        },
        {
          id: 'v0uxrv30',
          name: '全站最近更新列表',
          icon: 'lucide:link',
          type: 'url',
          data: '/changes',
          openIn: 'same-tab',
        },
        {
          id: 'w08vm9vt',
          name: '水深火热',
          icon: 'lucide:link',
          type: 'url',
          data: '/go/flamewar',
          openIn: 'same-tab',
          hidden: true,
        },
        {
          id: 'evev9l6r',
          name: '提醒',
          icon: 'lucide:bell',
          type: 'url',
          data: '/notifications',
          openIn: 'same-tab',
        },
        {
          id: 'v2ex_search',
          name: 'Google 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q=site:v2ex.com%20{selected||current_title}',
          openIn: 'new-tab',
        },
      ],
    }

    const linuxdo: ShortcutsGroup = {
      id: 'linuxdo_group',
      name: 'L站',
      icon: 'url:https://wsrv.nl/?w=64&h=64&url=https%3A%2F%2Ft3.gstatic.com%2FfaviconV2%3Fclient%3DSOCIAL%26type%3DFAVICON%26fallback_opts%3DTYPE%2CSIZE%2CURL%26url%3Dhttps%3A%2F%2Flinux.do%26size%3D64',
      match: ['*://linux.do/*'],
      defaultOpen: 'same-tab',
      items: [
        {
          id: 'fq7s1vg6',
          name: '最新话题',
          type: 'url',
          data: 'https://linux.do/latest',
          openIn: 'same-tab',
        },
        {
          id: 'empa8f6o',
          name: '创建日期排序',
          type: 'url',
          data: '?ascending=false&order=created',
          openIn: 'same-tab',
          icon: 'lucide:calendar-arrow-down',
        },

        {
          id: 'ghjguteh',
          name: '未读（Unread）',
          type: 'url',
          data: 'https://linux.do/unread',
          openIn: 'same-tab',
          icon: 'lucide:book-plus',
        },
        {
          id: 'fiahbsfb',
          name: '始皇',
          type: 'url',
          data: 'https://linux.do/u/neo/activity',
          openIn: 'same-tab',
          icon: 'lucide:crown',
        },
        {
          id: 'v7xfwc1x',
          name: '快问快答',
          type: 'url',
          data: 'https://linux.do/tag/%E5%BF%AB%E9%97%AE%E5%BF%AB%E7%AD%94',
          openIn: 'same-tab',
          icon: 'lucide:circle-question-mark',
        },
        {
          id: '03v787o2',
          name: '精华神帖',
          type: 'url',
          data: 'https://linux.do/tag/%E7%B2%BE%E5%8D%8E%E7%A5%9E%E5%B8%96',
          openIn: 'same-tab',
          icon: 'lucide:thumbs-up',
        },
        {
          id: 'linuxdo_search',
          name: '搜索',
          icon: 'lucide:search',
          type: 'url',
          data: 'https://linux.do/search?q={selected||current_title||t:默认值}%20order%3Alatest',
          openIn: 'new-tab',
        },
        {
          id: 'linuxdo_google_search',
          name: 'Google 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q=site:linux.do%20{selected||current_title}',
          openIn: 'new-tab',
        },
        {
          id: '0eybi3bv',
          name: 'leaderbooard',
          type: 'url',
          data: 'https://linux.do/leaderboard',
          openIn: 'new-tab',
          icon: 'lucide:trophy',
        },
        {
          id: 'oy4c2de9',
          name: 'Connect',
          type: 'url',
          data: 'https://connect.linux.do/',
          openIn: 'new-tab',
        },
        {
          id: 'tt9yac9m',
          name: 'IDC Flare',
          type: 'url',
          data: 'https://idcflare.com/',
          openIn: 'new-tab',
        },
        {
          id: 'vt4y2688',
          name: 'Challenge',
          type: 'url',
          data: 'https://linux.do/challenge?redirect={current_url_encoded}',
          openIn: 'same-tab',
          icon: 'lucide:swords',
        },
        {
          id: '20p30jnz',
          name: '分发站',
          type: 'url',
          data: 'https://cdk.linux.do/',
          openIn: 'new-tab',
          icon: 'lucide:ticket-check',
        },
        {
          id: 'q1df8ev8',
          name: '社区子系统和元宇宙',
          type: 'url',
          data: 'https://linux.do/pub/resources',
          openIn: 'new-tab',
          icon: 'lucide:infinity',
        },
      ],
      itemsPerRow: 2,
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _2libra_1: ShortcutsGroup = {
      id: '2libra_1',
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
          openIn: 'same-tab',
        },
      ],
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _2libra_2: ShortcutsGroup = {
      id: '2libra_2',
      name: '2libra',
      icon: 'url:https://2libra.com/favicon.ico',
      match: ['*://2libra.com/*'],
      defaultOpen: 'same-tab',
      items: [
        {
          id: 'zijgxywv',
          name: '首页',
          icon: 'favicon',
          type: 'url',
          data: 'https://2libra.com/',
          openIn: 'same-tab',
        },
        {
          id: 'aupy1kcr',
          name: '新发表',
          type: 'url',
          data: 'https://2libra.com/post/latest',
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
          icon: '🔥',
          type: 'url',
          data: 'https://2libra.com/post/hot/recent',
          openIn: 'same-tab',
        },
        {
          id: 'pivybx9n',
          name: '通知',
          icon: 'lucide:bell',
          type: 'url',
          data: 'https://2libra.com/notifications',
          openIn: 'same-tab',
        },
        {
          id: 'q0s43wxr',
          name: '金币',
          icon: 'lucide:bitcoin',
          type: 'url',
          data: 'https://2libra.com/coins',
          openIn: 'same-tab',
        },
        {
          id: '2libra_search',
          name: 'Google 搜索',
          icon: 'favicon',
          type: 'url',
          data: 'https://www.google.com/search?q=site:2libra.com%20{selected||current_title}',
          openIn: 'new-tab',
        },
      ],
      itemsPerRow: 2,
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _2libra_3: ShortcutsGroup = {
      id: '2libra_3',
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

    const other: ShortcutsGroup = {
      id: 'other',
      name: '其他',
      icon: 'lucide:hand-heart',
      match: ['*'],
      defaultOpen: 'new-tab',
      collapsed: true,
      items: [
        {
          id: 'issues',
          name: '问题反馈',
          type: 'url',
          data: 'https://github.com/utags/userscripts/issues',
          icon: 'lucide:bug',
        },
        {
          id: 'project',
          name: '项目地址',
          type: 'url',
          data: 'https://github.com/utags/userscripts',
          icon: 'lucide:github',
        },
        {
          id: 'more-scripts',
          name: '更多脚本',
          type: 'url',
          data: 'https://greasyfork.org/users/1030884-pipecraft?sort=total_installs',
          icon: 'lucide:package',
        },
      ],
    }

    return {
      groups: [
        g,
        readLater,
        searchGroup,
        searchSwitchGroup,
        community,
        github,
        v2ex,
        linuxdo,
        _2libra_1,
        _2libra_2,
        _2libra_3,
        other,
      ],
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
