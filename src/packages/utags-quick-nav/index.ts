import { clearChildren } from '../../utils/dom'
import { createOpenModeRadios } from './open-mode-radio'
import styleText from 'css:./style.css'
import { openAddLinkModal } from './add-link-modal'
import { getFaviconUrl } from '../../utils/favicon'

type OpenMode = 'same-tab' | 'new-tab'
type Position =
  | 'right-top'
  | 'right-center'
  | 'right-bottom'
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
type ItemType = 'url' | 'js'

type NavItem = {
  id: string
  name: string
  icon?: string
  type: ItemType
  data: string
  openIn?: OpenMode
  hidden?: boolean
}

type NavGroup = {
  id: string
  name: string
  icon?: string
  match: string[]
  defaultOpen?: OpenMode
  items: NavItem[]
  collapsed?: boolean
  itemsPerRow?: number
  hidden?: boolean
}

type QuickNavConfig = {
  global: {
    syncUrl?: string
  }
  sitePrefs?: Record<string, Partial<SitePref>>
  groups: NavGroup[]
}

type SitePref = {
  position: Position
  defaultOpen: OpenMode
  theme?: 'light' | 'dark' | 'system'
  pinned?: boolean
  enabled?: boolean
  edgeWidth?: number
  edgeHeight?: number
  edgeOpacity?: number
  edgeColorLight?: string
  edgeColorDark?: string
  edgeHidden?: boolean
}

const KEY = 'utqn_config'
const SITE_KEY = location.hostname || ''
let sitePref: SitePref
let lastSaved = ''

const EDGE_DEFAULT_WIDTH = 3
const EDGE_DEFAULT_HEIGHT = 60
const EDGE_DEFAULT_OPACITY = 0.6
const EDGE_DEFAULT_COLOR_LIGHT = '#1A73E8'
const EDGE_DEFAULT_COLOR_DARK = '#8AB4F8'
const EDGE_DEFAULT_HIDDEN = false
const POSITION_DEFAULT: Position = 'right-top'
const OPEN_DEFAULT: OpenMode = 'same-tab'
const THEME_DEFAULT: 'light' | 'dark' | 'system' = 'system'
const PINNED_DEFAULT = false
const ENABLED_DEFAULT = true
let tempOpen = false
let tempClosed = false
let menuIds: any[] = []

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function matchPattern(url: string, pattern: string) {
  try {
    const t = String(pattern || '')
    if (t.startsWith('/') && t.lastIndexOf('/') > 0) {
      const last = t.lastIndexOf('/')
      const body = t.slice(1, last)
      const flags = t.slice(last + 1)
      const re = new RegExp(body, flags)
      return re.test(url)
    }

    const esc: string = t
      .replaceAll(/[.+^${}()|[\]\\]/g, '\\$&')
      .replaceAll('*', '.*')
    const re = new RegExp('^' + esc + '$')
    return re.test(url)
  } catch {
    return false
  }
}

function initSitePref(cfg: QuickNavConfig) {
  if (!cfg.sitePrefs) cfg.sitePrefs = {}
  const stored: Partial<SitePref> = cfg.sitePrefs[SITE_KEY] || {}
  const cur: SitePref = {
    position: stored.position ?? POSITION_DEFAULT,
    defaultOpen: stored.defaultOpen ?? OPEN_DEFAULT,
    theme: stored.theme ?? THEME_DEFAULT,
    pinned: stored.pinned ?? PINNED_DEFAULT,
    enabled: stored.enabled ?? ENABLED_DEFAULT,
    edgeWidth: stored.edgeWidth ?? EDGE_DEFAULT_WIDTH,
    edgeHeight: stored.edgeHeight ?? EDGE_DEFAULT_HEIGHT,
    edgeOpacity: stored.edgeOpacity ?? EDGE_DEFAULT_OPACITY,
    edgeColorLight: stored.edgeColorLight ?? EDGE_DEFAULT_COLOR_LIGHT,
    edgeColorDark: stored.edgeColorDark ?? EDGE_DEFAULT_COLOR_DARK,
    edgeHidden: stored.edgeHidden ?? EDGE_DEFAULT_HIDDEN,
  }
  sitePref = cur
  cfg.sitePrefs[SITE_KEY] = cur
}

function matchGroup(url: string, g: NavGroup) {
  let hit = false
  for (const p of g.match) {
    const neg = p.startsWith('!')
    const pat = neg ? p.slice(1) : p
    const m = matchPattern(url, pat)
    if (neg && m) return false
    if (!neg && m) hit = true
  }

  return hit
}

const iconCache = new Map<string, string>()

function renderIcon(s?: string) {
  const span = document.createElement('span')
  span.className = 'icon'
  let t = String(s || '').trim()
  if (!t) t = 'lucide:link'
  if (t.startsWith('lucide:')) {
    const k = t.split(':')[1]
    injectLucideIcon(span, k)
    return span
  }

  if (t.startsWith('url:')) {
    const url = t.slice(4)
    injectImageAsData(span, url)
    return span
  }

  if (t.startsWith('svg:')) {
    try {
      const svg = t.slice(4)
      const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
      const img = document.createElement('img')
      img.width = 16
      img.height = 16
      img.style.objectFit = 'contain'
      img.src = url
      clearChildren(span)
      span.append(img)
    } catch {}

    return span
  }

  span.textContent = t
  return span
}

function injectLucideIcon(container: HTMLElement, name: string) {
  try {
    const cached = iconCache.get(name)
    if (cached) {
      const img = document.createElement('img')
      img.width = 16
      img.height = 16
      img.style.objectFit = 'contain'
      img.className = 'lucide-icon'
      img.src = cached
      clearChildren(container)
      container.append(img)
      return
    }
  } catch {}

  try {
    const url = `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${name}.svg`
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload(res: any) {
        try {
          const svg = String(res.responseText || '')
          if (!svg) return
          const url =
            'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
          iconCache.set(name, url)
          const img = document.createElement('img')
          img.width = 16
          img.height = 16
          img.style.objectFit = 'contain'
          img.className = 'lucide-icon'
          img.src = url
          clearChildren(container)
          container.append(img)
        } catch {}
      },
    })
  } catch {}
}

function injectImageAsData(container: HTMLElement, url: string) {
  try {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob' as any,
      onload(res: any) {
        try {
          const blob = res.response as Blob
          if (!blob) return
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            const img = document.createElement('img')
            img.width = 16
            img.height = 16
            img.style.objectFit = 'contain'
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            img.src = String(reader.result || '')
            clearChildren(container)
            container.append(img)
          })
          reader.readAsDataURL(blob)
        } catch {}
      },
    })
  } catch {}
}

function openItem(it: NavItem, group: NavGroup, cfg: QuickNavConfig) {
  const mode: OpenMode = it.openIn || group.defaultOpen || sitePref.defaultOpen
  if (it.type === 'url') {
    const url = new URL(it.data, location.href).href
    if (mode === 'new-tab') {
      window.open(url, '_blank', 'noopener')
    } else {
      location.assign(url)
    }

    return
  }

  try {
    const s = document.createElement('script')
    s.textContent = `(function(){\n${it.data}\n})();`
    ;(document.documentElement || document.body).append(s)
    s.remove()
  } catch {}
}

async function loadConfig(): Promise<QuickNavConfig> {
  try {
    const v = await GM.getValue(KEY, '')
    if (v) {
      const raw = JSON.parse(String(v) || '{}')
      const host = location.hostname || ''
      const ensureGroup = (gg: any): NavGroup => ({
        id: String(gg?.id || uid()),
        name: String(gg?.name || host),
        icon: String(gg?.icon || 'lucide:folder'),
        match: Array.isArray(gg?.match) ? gg.match : ['*://' + host + '/*'],
        defaultOpen: gg?.defaultOpen === 'new-tab' ? 'new-tab' : 'same-tab',
        items: Array.isArray(gg?.items) ? gg.items : [],
        collapsed: Boolean(gg?.collapsed),
        itemsPerRow: Number.isFinite(gg?.itemsPerRow) ? gg.itemsPerRow : 1,
        hidden: Boolean(gg?.hidden),
      })

      const groupsArr: NavGroup[] = Array.isArray(raw?.groups)
        ? raw.groups.map((x: any) => ensureGroup(x))
        : []
      if (groupsArr.length === 0) {
        const g: NavGroup = ensureGroup({})
        g.items = [
          {
            id: uid(),
            name: '首页',
            icon: 'lucide:home',
            type: 'url',
            data: '/',
            openIn: 'same-tab',
            hidden: false,
          },
        ]
        groupsArr.push(g)
      }

      const cfg: QuickNavConfig = {
        global: raw?.global || {},
        sitePrefs: raw?.sitePrefs || {},
        groups: groupsArr,
      }
      return cfg
    }
  } catch {}

  const host = location.hostname || ''
  const g: NavGroup = {
    id: uid(),
    name: host,
    icon: 'lucide:folder',
    match: ['*://' + host + '/*'],
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
  return {
    global: {},
    groups: [g],
  }
}

async function saveConfig(cfg: QuickNavConfig) {
  try {
    const sp: Partial<SitePref> = {}
    if (sitePref.position !== POSITION_DEFAULT) sp.position = sitePref.position
    if (sitePref.defaultOpen !== OPEN_DEFAULT)
      sp.defaultOpen = sitePref.defaultOpen
    if ((sitePref.theme || THEME_DEFAULT) !== THEME_DEFAULT)
      sp.theme = sitePref.theme
    if (sitePref.pinned !== PINNED_DEFAULT) sp.pinned = sitePref.pinned
    if (sitePref.enabled !== ENABLED_DEFAULT) sp.enabled = sitePref.enabled
    if ((sitePref.edgeWidth ?? EDGE_DEFAULT_WIDTH) !== EDGE_DEFAULT_WIDTH)
      sp.edgeWidth = sitePref.edgeWidth
    if ((sitePref.edgeHeight ?? EDGE_DEFAULT_HEIGHT) !== EDGE_DEFAULT_HEIGHT)
      sp.edgeHeight = sitePref.edgeHeight
    if ((sitePref.edgeOpacity ?? EDGE_DEFAULT_OPACITY) !== EDGE_DEFAULT_OPACITY)
      sp.edgeOpacity = sitePref.edgeOpacity
    if (
      (sitePref.edgeColorLight ?? EDGE_DEFAULT_COLOR_LIGHT) !==
      EDGE_DEFAULT_COLOR_LIGHT
    )
      sp.edgeColorLight = sitePref.edgeColorLight
    if (
      (sitePref.edgeColorDark ?? EDGE_DEFAULT_COLOR_DARK) !==
      EDGE_DEFAULT_COLOR_DARK
    )
      sp.edgeColorDark = sitePref.edgeColorDark
    if ((sitePref.edgeHidden ?? EDGE_DEFAULT_HIDDEN) !== EDGE_DEFAULT_HIDDEN)
      sp.edgeHidden = sitePref.edgeHidden

    const nextSitePrefs: Record<string, Partial<SitePref>> = {
      ...cfg.sitePrefs,
    }
    if (Object.keys(sp).length > 0) nextSitePrefs[SITE_KEY] = sp
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    else delete nextSitePrefs[SITE_KEY]

    const next: QuickNavConfig = {
      ...cfg,
      sitePrefs: nextSitePrefs,
    }
    const s = JSON.stringify(next)
    if (s === lastSaved) return
    lastSaved = s
    await GM.setValue(KEY, s)
  } catch {}
}

function createRoot() {
  const host = document.createElement('div')
  const root = host.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  style.textContent = styleText
  root.append(style)
  document.documentElement.append(host)
  return { host, root }
}

function place(el: HTMLElement, cfg: QuickNavConfig) {
  const p = sitePref.position
  el.style.position = 'fixed'
  el.style.inset = 'auto'
  switch (p) {
    case 'right-top': {
      el.style.top = '0'
      el.style.right = '0'

      break
    }

    case 'left-top': {
      el.style.top = '0'
      el.style.left = '0'

      break
    }

    case 'left-bottom': {
      el.style.bottom = '0'
      el.style.left = '0'

      break
    }

    case 'right-bottom': {
      el.style.bottom = '0'
      el.style.right = '0'

      break
    }

    case 'left-center': {
      el.style.top = '50%'
      el.style.left = '0'
      el.style.transform = 'translateY(-50%)'

      break
    }

    case 'right-center': {
      el.style.top = '50%'
      el.style.right = '0'
      el.style.transform = 'translateY(-50%)'

      break
    }

    case 'top-left': {
      el.style.top = '0'
      el.style.left = '0'
      break
    }

    case 'top-center': {
      el.style.top = '0'
      el.style.left = '50%'
      el.style.transform = 'translateX(-50%)'
      break
    }

    case 'top-right': {
      el.style.top = '0'
      el.style.right = '0'
      break
    }

    case 'bottom-left': {
      el.style.bottom = '0'
      el.style.left = '0'
      break
    }

    case 'bottom-center': {
      el.style.bottom = '0'
      el.style.left = '50%'
      el.style.transform = 'translateX(-50%)'
      break
    }

    case 'bottom-right': {
      el.style.bottom = '0'
      el.style.right = '0'
      break
    }
  }
}

function isHorizontalPos(pos: Position): boolean {
  return pos.startsWith('top-') || pos.startsWith('bottom-')
}

function isRightSide(pos: Position): boolean {
  return pos.startsWith('right-')
}

function isTopSide(pos: Position): boolean {
  return pos.startsWith('top-')
}

function scorePattern(url: string, pattern: string) {
  const neg = pattern.startsWith('!')
  const pat = neg ? pattern.slice(1) : pattern
  if (!matchPattern(url, pat)) return -1
  if (pat.startsWith('/') && pat.lastIndexOf('/') > 0) {
    const last = pat.lastIndexOf('/')
    return pat.slice(1, last).length
  }

  return pat.replaceAll('*', '').length
}

function groupScore(url: string, g: NavGroup) {
  let max = -1
  for (const p of g.match) {
    const neg = p.startsWith('!')
    const pat = neg ? p.slice(1) : p
    if (neg) {
      if (matchPattern(url, pat)) return -1
      continue
    }

    const s = scorePattern(url, p)
    if (s > max) max = s
  }

  return max
}

function currentGroups(cfg: QuickNavConfig) {
  const url = location.href
  return cfg.groups
    .map((g) => ({ g, s: groupScore(url, g) }))
    .filter((x) => x.s >= 0 && !x.g.hidden)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.g)
}

function isDarkTheme(cfg: QuickNavConfig) {
  const t = sitePref.theme || THEME_DEFAULT
  if (t === 'dark') return true
  if (t === 'light') return false
  try {
    return (
      globalThis.window !== undefined &&
      Boolean(globalThis.matchMedia) &&
      globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    )
  } catch {
    return false
  }
}

function renderPanel(root: ShadowRoot, cfg: QuickNavConfig, animIn: boolean) {
  const wrapper = document.createElement('div')
  wrapper.className = 'utqn' + (isDarkTheme(cfg) ? ' dark' : '')
  const panel = document.createElement('div')
  panel.className = 'panel'
  const collapseRow = document.createElement('div')
  collapseRow.className = 'header'
  const leftActions = document.createElement('div')
  leftActions.className = 'panel-actions-left'
  const rightActions = document.createElement('div')
  rightActions.className = 'panel-actions'

  const pos = sitePref.position
  const isRight = isRightSide(pos)
  const isHoriz = isHorizontalPos(pos)
  const isTop = isTopSide(pos)
  if (animIn)
    panel.classList.add(
      isHoriz
        ? isTop
          ? 'anim-in-top'
          : 'anim-in-bottom'
        : isRight
          ? 'anim-in-right'
          : 'anim-in-left'
    )

  const closeBtn = document.createElement('button')
  closeBtn.className = 'collapse-btn'
  closeBtn.append(renderIcon('lucide:x'))
  closeBtn.title = '关闭'
  closeBtn.addEventListener('click', () => {
    collapseWithAnim(root, cfg)
  })

  const plusBtn = document.createElement('button')
  plusBtn.className = 'icon-btn'
  plusBtn.append(renderIcon('lucide:plus'))
  plusBtn.title = '添加'
  plusBtn.addEventListener('click', (ev) => {
    ev.stopPropagation()
    openQuickAddMenu(root, cfg, plusBtn)
  })

  const settingsBtn = document.createElement('button')
  settingsBtn.className = 'icon-btn'
  settingsBtn.append(renderIcon('lucide:settings'))
  settingsBtn.title = '设置'
  settingsBtn.addEventListener('click', () => {
    openEditor(root, cfg)
  })

  const pinBtn = document.createElement('button')
  pinBtn.className = 'icon-btn'
  pinBtn.append(renderIcon(sitePref.pinned ? 'lucide:pin' : 'lucide:pin-off'))
  pinBtn.title = sitePref.pinned ? '取消固定' : '固定显示'
  pinBtn.classList.toggle('active', Boolean(sitePref.pinned))
  pinBtn.addEventListener('click', () => {
    sitePref.pinned = !sitePref.pinned
    void saveConfig(cfg)
    pinBtn.classList.toggle('active', Boolean(sitePref.pinned))
    pinBtn.title = sitePref.pinned ? '取消固定' : '固定显示'
    clearChildren(pinBtn)
    pinBtn.append(renderIcon(sitePref.pinned ? 'lucide:pin' : 'lucide:pin-off'))
  })

  // Always on RIGHT
  rightActions.append(plusBtn)
  rightActions.append(settingsBtn)
  rightActions.append(pinBtn)
  rightActions.append(closeBtn)

  collapseRow.append(leftActions)
  collapseRow.append(rightActions)
  panel.append(collapseRow)

  const matched = currentGroups(cfg)
  const groupsToShow = matched
  const defOpen = (sitePref.defaultOpen || 'same-tab') as 'same-tab' | 'new-tab'
  for (const g of groupsToShow) {
    const div = document.createElement('div')
    div.className = 'divider'
    panel.append(div)

    const section = document.createElement('div')
    section.className = 'section'
    ;(section as HTMLElement).dataset.gid = g.id
    const header = document.createElement('div')
    header.className = 'header'
    const title = document.createElement('div')
    title.className = 'title'
    title.append(renderIcon(g.icon))
    const nameSpan = document.createElement('span')
    nameSpan.textContent = g.name
    title.append(nameSpan)
    header.append(title)

    title.addEventListener('click', () => {
      g.collapsed = !g.collapsed
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    const actions = document.createElement('div')
    actions.className = 'header-actions'
    const addLinkBtn = document.createElement('button')
    addLinkBtn.className = 'icon-btn'
    addLinkBtn.append(renderIcon('lucide:plus'))
    addLinkBtn.title = '添加链接到此分组'
    addLinkBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      openAddLinkModal(root, cfg, {
        saveConfig(c) {
          void saveConfig(c)
        },
        rerender(r, c) {
          rerender(r, c)
        },
        defaultOpen: (g.defaultOpen ?? defOpen) as 'same-tab' | 'new-tab',
        defaultGroupId: g.id,
      })
    })
    const hideGroupBtn = document.createElement('button')
    hideGroupBtn.className = 'icon-btn'
    hideGroupBtn.append(renderIcon('lucide:eye-off'))
    hideGroupBtn.title = '隐藏分组'
    hideGroupBtn.addEventListener('click', () => {
      g.hidden = true
      void saveConfig(cfg)
      const sec = panel.querySelector('.section[data-gid="' + g.id + '"]')
      if (sec) (sec as HTMLElement).style.display = 'none'
    })
    const editBtn = document.createElement('button')
    editBtn.className = 'icon-btn'
    editBtn.append(renderIcon('lucide:edit-3'))
    editBtn.title = '编辑'
    editBtn.addEventListener('click', () => {
      openEditor(root, cfg, g.id)
    })
    const toggleBtn = document.createElement('button')
    toggleBtn.className = 'icon-btn'
    toggleBtn.append(
      renderIcon(g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down')
    )
    toggleBtn.title = g.collapsed ? '展开' : '折叠'
    toggleBtn.addEventListener('click', () => {
      g.collapsed = !g.collapsed
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    actions.append(addLinkBtn)
    actions.append(editBtn)
    actions.append(hideGroupBtn)
    actions.append(toggleBtn)
    header.append(actions)
    section.append(header)

    if (!g.collapsed && g.items.length > 0) {
      const items = document.createElement('div')
      items.className = 'items'
      items.style.setProperty('--cols', String(g.itemsPerRow || 1))
      for (const it of g.items) {
        if (it.hidden) continue
        const wrap = document.createElement('div')
        wrap.className = 'item-wrap'
        ;(wrap as HTMLElement).dataset.itemId = it.id
        const a = document.createElement('a')
        a.className = 'item'
        if (it.type === 'url') {
          const url = new URL(it.data, location.href).href
          a.href = url
          const mode: OpenMode =
            it.openIn || g.defaultOpen || sitePref.defaultOpen
          if (mode === 'new-tab') {
            a.target = '_blank'
            a.rel = 'noopener'
          }
        } else {
          a.href = '#'
          a.addEventListener('click', (e) => {
            e.preventDefault()
            openItem(it, g, cfg)
          })
        }

        {
          const rawIcon = String(it.icon || '')
          let iconStr = rawIcon
          if (rawIcon.startsWith('favicon')) {
            const param = rawIcon.split(':')[1]
            const sizeNum = param ? Number.parseInt(param, 10) : 64
            const size: 16 | 32 | 64 =
              sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
            const targetUrl =
              it.type === 'url'
                ? new URL(it.data, location.href).href
                : location.href
            try {
              iconStr = 'url:' + getFaviconUrl(targetUrl, size)
            } catch {}
          }

          a.append(renderIcon(iconStr))
        }

        const t = document.createElement('span')
        t.textContent = it.name
        a.append(t)
        const hideBtn = document.createElement('button')
        hideBtn.className = 'icon-btn'
        hideBtn.append(renderIcon('lucide:eye-off'))
        hideBtn.title = '隐藏该导航'
        hideBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          it.hidden = true
          void saveConfig(cfg)
          const sec = panel.querySelector('.section[data-gid="' + g.id + '"]')
          const targetWrap = sec?.querySelector(
            '.item-wrap[data-item-id="' + it.id + '"]'
          )
          if (targetWrap) targetWrap.remove()
        })
        wrap.append(a)
        wrap.append(hideBtn)
        items.append(wrap)
      }

      section.append(items)
    }

    panel.append(section)
  }

  wrapper.append(panel)
  wrapper.addEventListener('mouseenter', () => {
    try {
      if (collapseTimer) clearTimeout(collapseTimer)
    } catch {}
  })
  wrapper.addEventListener('mouseleave', () => {
    if (!sitePref.pinned && !suppressCollapse) scheduleAutoCollapse(root, cfg)
  })
  place(wrapper, cfg)
  root.append(wrapper)
}

function copyItemToGroup(
  cfg: QuickNavConfig,
  fromGroupId: string,
  itemId: string,
  toGroupId: string
) {
  const from = cfg.groups.find((g) => g.id === fromGroupId)
  const to = cfg.groups.find((g) => g.id === toGroupId)
  if (!from || !to) return
  const it = from.items.find((x) => x.id === itemId)
  if (!it) return
  const dup: NavItem = { ...it, id: uid() }
  to.items.push(dup)
}

function openEditor(
  root: ShadowRoot,
  cfg: QuickNavConfig,
  activeGroupId?: string
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
  const grid = document.createElement('div')
  grid.className = 'grid'
  const posRow = document.createElement('div')
  posRow.className = 'row'
  const posLabel = document.createElement('label')
  posLabel.textContent = '位置'
  const posSel = document.createElement('select')
  for (const p of [
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
  ] as Position[]) {
    const o = document.createElement('option')
    o.value = p
    o.textContent = p
    if (sitePref.position === p) o.selected = true
    posSel.append(o)
  }

  posSel.addEventListener('change', () => {
    sitePref.position = posSel.value as Position
    void saveConfig(cfg)
    rerender(root, cfg)
  })
  posRow.append(posLabel)
  posRow.append(posSel)
  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '默认打开方式'
  let siteOpen: 'same-tab' | 'new-tab' = sitePref.defaultOpen
  const openRadios1 = createOpenModeRadios(siteOpen, (m) => {
    siteOpen = m
    sitePref.defaultOpen = m
    void saveConfig(cfg)
    rerender(root, cfg)
  })
  openRow.append(openLabel)
  openRow.append(openRadios1)
  grid.append(posRow)
  grid.append(openRow)
  const themeRow = document.createElement('div')
  themeRow.className = 'row'
  const themeLabel = document.createElement('label')
  themeLabel.textContent = '主题'
  const themeSel = document.createElement('select')
  for (const th of ['system', 'light', 'dark'] as Array<
    'system' | 'light' | 'dark'
  >) {
    const o = document.createElement('option')
    o.value = th
    o.textContent = th === 'system' ? '系统' : th === 'light' ? '浅色' : '深色'
    if ((sitePref.theme || THEME_DEFAULT) === th) o.selected = true
    themeSel.append(o)
  }

  themeSel.addEventListener('change', () => {
    sitePref.theme = themeSel.value as 'system' | 'light' | 'dark'
    void saveConfig(cfg)
    updateThemeUI(root, cfg)
  })
  themeRow.append(themeLabel)
  themeRow.append(themeSel)
  grid.append(themeRow)
  const syncRow = document.createElement('div')
  syncRow.className = 'row'
  const syncLabel = document.createElement('label')
  syncLabel.textContent = '同步 URL'
  const syncInput = document.createElement('input')
  syncInput.value = cfg.global.syncUrl || ''
  const syncBtn = document.createElement('button')
  syncBtn.className = 'btn'
  syncBtn.textContent = '从远程拉取'
  syncBtn.addEventListener('click', async () => {
    const u = syncInput.value.trim()
    if (!u) return
    try {
      const res = await fetch(u, { credentials: 'omit' })
      const text = await res.text()
      const obj = JSON.parse(text)
      if (obj && obj.global && obj.groups) {
        cfg.global = obj.global
        cfg.groups = obj.groups
        void saveConfig(cfg)
        rerender(root, cfg)
      }
    } catch {}
  })
  syncInput.addEventListener('change', () => {
    cfg.global.syncUrl = syncInput.value.trim() || undefined
    void saveConfig(cfg)
  })
  syncRow.append(syncLabel)
  syncRow.append(syncInput)
  syncRow.append(syncBtn)
  const edgeRow = document.createElement('div')
  edgeRow.className = 'row'
  const edgeLabel = document.createElement('label')
  edgeLabel.textContent = '竖线外观'
  const widthInput = document.createElement('input')
  widthInput.type = 'number'
  widthInput.min = '1'
  widthInput.max = '24'
  widthInput.value = String(sitePref.edgeWidth ?? EDGE_DEFAULT_WIDTH)
  const heightInput = document.createElement('input')
  heightInput.type = 'number'
  heightInput.min = '24'
  heightInput.max = '320'
  heightInput.value = String(sitePref.edgeHeight ?? EDGE_DEFAULT_HEIGHT)
  const opacityInput = document.createElement('input')
  opacityInput.type = 'number'
  opacityInput.min = '0'
  opacityInput.max = '1'
  opacityInput.step = '0.05'
  opacityInput.value = String(sitePref.edgeOpacity ?? EDGE_DEFAULT_OPACITY)
  const lightColorInput = document.createElement('input')
  lightColorInput.type = 'color'
  lightColorInput.value = String(
    sitePref.edgeColorLight || EDGE_DEFAULT_COLOR_LIGHT
  )
  const darkColorInput = document.createElement('input')
  darkColorInput.type = 'color'
  darkColorInput.value = String(
    sitePref.edgeColorDark || EDGE_DEFAULT_COLOR_DARK
  )

  widthInput.addEventListener('change', () => {
    const v = Math.max(1, Math.min(24, Number.parseInt(widthInput.value, 10)))
    const pref = sitePref
    pref.edgeWidth = v
    void saveConfig(cfg)
    if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
  })
  heightInput.addEventListener('change', () => {
    const v = Math.max(
      24,
      Math.min(320, Number.parseInt(heightInput.value, 10))
    )
    const pref = sitePref
    pref.edgeHeight = v
    void saveConfig(cfg)
    if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
  })
  opacityInput.addEventListener('change', () => {
    const v = Math.max(0, Math.min(1, Number.parseFloat(opacityInput.value)))
    const pref = sitePref
    pref.edgeOpacity = v
    void saveConfig(cfg)
    if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
  })
  lightColorInput.addEventListener('change', () => {
    const pref = sitePref
    pref.edgeColorLight = lightColorInput.value
    void saveConfig(cfg)
    if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
  })
  darkColorInput.addEventListener('change', () => {
    const pref = sitePref
    pref.edgeColorDark = darkColorInput.value
    void saveConfig(cfg)
    if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
  })

  edgeRow.append(edgeLabel)
  edgeRow.append(widthInput)
  edgeRow.append(heightInput)
  edgeRow.append(opacityInput)
  edgeRow.append(lightColorInput)
  edgeRow.append(darkColorInput)
  const edgeReset = document.createElement('button')
  edgeReset.className = 'btn mini'
  edgeReset.textContent = '重置默认'
  edgeReset.addEventListener('click', () => {
    const pref = sitePref
    pref.edgeWidth = EDGE_DEFAULT_WIDTH
    pref.edgeHeight = EDGE_DEFAULT_HEIGHT
    pref.edgeOpacity = EDGE_DEFAULT_OPACITY
    pref.edgeColorLight = EDGE_DEFAULT_COLOR_LIGHT
    pref.edgeColorDark = EDGE_DEFAULT_COLOR_DARK
    widthInput.value = String(EDGE_DEFAULT_WIDTH)
    heightInput.value = String(EDGE_DEFAULT_HEIGHT)
    opacityInput.value = String(EDGE_DEFAULT_OPACITY)
    lightColorInput.value = EDGE_DEFAULT_COLOR_LIGHT
    darkColorInput.value = EDGE_DEFAULT_COLOR_DARK
    void saveConfig(cfg)
    if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
  })
  edgeRow.append(edgeReset)

  const panelCtrlRow = document.createElement('div')
  panelCtrlRow.className = 'row'
  const panelCtrlLabel = document.createElement('label')
  panelCtrlLabel.textContent = '面板控制'
  const pinBtn2 = document.createElement('button')
  pinBtn2.className = 'btn mini'
  pinBtn2.textContent = '固定'
  const unpinBtn2 = document.createElement('button')
  unpinBtn2.className = 'btn mini'
  unpinBtn2.textContent = '取消固定'
  const hideEdgeWrap = document.createElement('label')
  hideEdgeWrap.className = 'mini'
  const hideEdgeChk = document.createElement('input')
  hideEdgeChk.type = 'checkbox'
  hideEdgeChk.checked = Boolean(sitePref.edgeHidden)
  const hideEdgeText = document.createElement('span')
  hideEdgeText.textContent = '隐藏竖线'
  hideEdgeWrap.append(hideEdgeChk)
  hideEdgeWrap.append(hideEdgeText)

  pinBtn2.addEventListener('click', () => {
    sitePref.pinned = true
    void saveConfig(cfg)
    rerender(root, cfg)
  })
  unpinBtn2.addEventListener('click', () => {
    sitePref.pinned = false
    void saveConfig(cfg)
    rerender(root, cfg)
  })
  hideEdgeChk.addEventListener('change', () => {
    sitePref.edgeHidden = hideEdgeChk.checked
    void saveConfig(cfg)
    if (!sitePref.pinned && !tempOpen) rerender(root, cfg)
  })

  panelCtrlRow.append(panelCtrlLabel)
  panelCtrlRow.append(pinBtn2)
  panelCtrlRow.append(unpinBtn2)
  panelCtrlRow.append(hideEdgeWrap)

  grid.append(panelCtrlRow)
  const grpHeader = document.createElement('h2')
  grpHeader.className = 'section-title'
  grpHeader.textContent = '分组'
  const grpList = document.createElement('div')
  grpList.className = 'group-list'
  let active = cfg.groups.find((g) => g.id === activeGroupId) || cfg.groups[0]
  function rebuildGroupPills() {
    clearChildren(grpList)
    for (const g of cfg.groups) {
      const pill = document.createElement('button')
      pill.className = 'group-pill' + (g.id === active.id ? ' active' : '')
      pill.textContent = g.name
      pill.dataset.gid = g.id
      grpList.append(pill)
    }
  }

  grpList.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement
    const btn = target.closest('.group-pill')
    if (!btn) return
    const pill = btn as HTMLElement
    const gid = pill.dataset && pill.dataset.gid ? pill.dataset.gid : ''
    const next = cfg.groups.find((gg) => gg.id === gid)
    if (!next) return
    active = next
    rebuildGroupPills()
    rebuildGroupEditor()
  })

  const groupEditor = document.createElement('div')
  function rebuildGroupEditor() {
    clearChildren(groupEditor)
    const row1 = document.createElement('div')
    row1.className = 'row'
    const l1 = document.createElement('label')
    l1.textContent = '组名'
    const nameInput = document.createElement('input')
    nameInput.value = active.name
    nameInput.addEventListener('change', () => {
      active.name = nameInput.value
      rebuildGroupPills()
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    row1.append(l1)
    row1.append(nameInput)
    const row2 = document.createElement('div')
    row2.className = 'row'
    const l2 = document.createElement('label')
    l2.textContent = '图标'
    const iconInput = document.createElement('input')
    iconInput.placeholder = 'lucide:home | url:https://... | emoji'
    iconInput.value = active.icon || ''
    iconInput.addEventListener('change', () => {
      active.icon = iconInput.value.trim() || undefined
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    row2.append(l2)
    row2.append(iconInput)
    const row3 = document.createElement('div')
    row3.className = 'row'
    const l3 = document.createElement('label')
    l3.textContent = 'URL 规则'
    const ta = document.createElement('textarea')
    ta.value = active.match.join('\n')
    ta.addEventListener('change', () => {
      const grp = cfg.groups.find((g) => g.id === active.id)
      if (!grp) return
      grp.match = ta.value
        .split(/\n+/)
        .map((v) => v.trim())
        .filter(Boolean)
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    row3.append(l3)
    row3.append(ta)
    const row4 = document.createElement('div')
    row4.className = 'row'
    const l4 = document.createElement('label')
    l4.textContent = '组默认打开方式'
    let grpOpen: 'same-tab' | 'new-tab' = (active.defaultOpen ||
      sitePref.defaultOpen) as 'same-tab' | 'new-tab'
    const openRadios2 = createOpenModeRadios(grpOpen, (m) => {
      grpOpen = m
      active.defaultOpen = m
      void saveConfig(cfg)
    })
    row4.append(l4)
    row4.append(openRadios2)

    const row5 = document.createElement('div')
    row5.className = 'row'
    const l5 = document.createElement('label')
    l5.textContent = '每行个数'
    const colsSel = document.createElement('select')
    for (const c of [1, 2, 3, 4, 5, 6]) {
      const o = document.createElement('option')
      o.value = String(c)
      o.textContent = String(c)
      if ((active.itemsPerRow || 1) === c) o.selected = true
      colsSel.append(o)
    }

    colsSel.addEventListener('change', () => {
      const v = Number.parseInt(colsSel.value, 10)
      active.itemsPerRow = Number.isNaN(v) ? 1 : Math.max(1, Math.min(6, v))
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    row5.append(l5)
    row5.append(colsSel)
    const row6 = document.createElement('div')
    row6.className = 'row'
    const l6 = document.createElement('label')
    l6.textContent = '分组显示状态'
    const visSel = document.createElement('select')
    for (const st of ['显示', '隐藏']) {
      const o = document.createElement('option')
      o.value = st
      o.textContent = st
      if ((active.hidden ? '隐藏' : '显示') === st) o.selected = true
      visSel.append(o)
    }

    visSel.addEventListener('change', () => {
      active.hidden = visSel.value === '隐藏'
      void saveConfig(cfg)
      rerender(root, cfg)
    })
    row6.append(l6)
    row6.append(visSel)
    const itemsHeader = document.createElement('h2')
    itemsHeader.className = 'section-title'
    itemsHeader.textContent = '导航项'
    const itemsList = document.createElement('div')
    function rebuildItems() {
      clearChildren(itemsList)
      const groupId = active.id
      for (const it of active.items) {
        const row = document.createElement('div')
        row.className = 'row item-row'
        const n = document.createElement('input')
        n.value = it.name
        n.addEventListener('change', () => {
          const grp = cfg.groups.find((g) => g.id === groupId)
          if (!grp) return
          const item = grp.items.find((x) => x.id === it.id)
          if (!item) return
          item.name = n.value
          void saveConfig(cfg)
          rerender(root, cfg)
        })
        const i = document.createElement('input')
        i.placeholder = 'lucide:home | url:https://... | emoji'
        i.value = it.icon || ''
        i.addEventListener('change', () => {
          const grp = cfg.groups.find((g) => g.id === groupId)
          if (!grp) return
          const item = grp.items.find((x) => x.id === it.id)
          if (!item) return
          item.icon = i.value.trim() || undefined
          void saveConfig(cfg)
          rerender(root, cfg)
        })
        const t = document.createElement('select')
        for (const tp of ['url', 'js'] as ItemType[]) {
          const o = document.createElement('option')
          o.value = tp
          o.textContent = tp
          if (it.type === tp) o.selected = true
          t.append(o)
        }

        t.addEventListener('change', () => {
          const grp = cfg.groups.find((g) => g.id === groupId)
          if (!grp) return
          const item = grp.items.find((x) => x.id === it.id)
          if (!item) return
          item.type = t.value as ItemType
          void saveConfig(cfg)
        })
        const d = document.createElement('input')
        d.value = it.data
        d.addEventListener('change', () => {
          const grp = cfg.groups.find((g) => g.id === groupId)
          if (!grp) return
          const item = grp.items.find((x) => x.id === it.id)
          if (!item) return
          item.data = d.value
          void saveConfig(cfg)
          rerender(root, cfg)
        })
        const m = document.createElement('select')
        for (const mm of ['same-tab', 'new-tab'] as OpenMode[]) {
          const o = document.createElement('option')
          o.value = mm
          o.textContent = mm
          if ((it.openIn || active.defaultOpen || sitePref.defaultOpen) === mm)
            o.selected = true
          m.append(o)
        }

        m.addEventListener('change', () => {
          const grp = cfg.groups.find((g) => g.id === groupId)
          if (!grp) return
          const item = grp.items.find((x) => x.id === it.id)
          if (!item) return
          item.openIn = m.value as OpenMode
          void saveConfig(cfg)
        })
        const visibleSel = document.createElement('select')
        for (const st of ['显示', '隐藏']) {
          const o = document.createElement('option')
          o.value = st
          o.textContent = st
          if ((it.hidden ? '隐藏' : '显示') === st) o.selected = true
          visibleSel.append(o)
        }

        visibleSel.addEventListener('change', () => {
          const grp = cfg.groups.find((g) => g.id === groupId)
          if (!grp) return
          const item = grp.items.find((x) => x.id === it.id)
          if (!item) return
          item.hidden = visibleSel.value === '隐藏'
          void saveConfig(cfg)
          rerender(root, cfg)
        })
        const del = document.createElement('button')
        del.className = 'btn'
        del.textContent = '删除'
        del.addEventListener('click', () => {
          const grp = cfg.groups.find((g) => g.id === groupId)
          if (!grp) return
          grp.items = grp.items.filter((x) => x.id !== it.id)
          void saveConfig(cfg)
          rebuildItems()
          rerender(root, cfg)
        })
        const moveToSel = document.createElement('select')
        for (const g of cfg.groups) {
          if (g.id === groupId) continue
          const o = document.createElement('option')
          o.value = g.id
          o.textContent = '复制到 ' + g.name
          moveToSel.append(o)
        }

        const moveBtn = document.createElement('button')
        moveBtn.className = 'btn mini'
        moveBtn.textContent = '复制到分组'
        moveBtn.addEventListener('click', () => {
          const toId = moveToSel.value
          if (!toId) return
          copyItemToGroup(cfg, groupId, it.id, toId)
          void saveConfig(cfg)
          rebuildItems()
          rerender(root, cfg)
        })
        row.append(n)
        row.append(i)
        row.append(t)
        row.append(d)
        row.append(m)
        row.append(visibleSel)
        row.append(moveToSel)
        row.append(moveBtn)
        row.append(del)
        itemsList.append(row)
      }
    }

    const addRow = document.createElement('div')
    addRow.className = 'row'
    const addBtn = document.createElement('button')
    addBtn.className = 'btn btn-secondary'
    addBtn.textContent = '添加导航项'
    addBtn.addEventListener('click', () => {
      openAddLinkModal(root, cfg, {
        saveConfig(c) {
          void saveConfig(c)
        },
        rerender(r, c) {
          rerender(r, c)
        },
        defaultOpen: (active.defaultOpen ?? sitePref.defaultOpen) as
          | 'same-tab'
          | 'new-tab',
        defaultGroupId: active.id,
      })
    })
    addRow.append(addBtn)
    const grpActions = document.createElement('div')
    grpActions.className = 'row'
    const addGroup = document.createElement('button')
    addGroup.className = 'btn btn-secondary'
    addGroup.textContent = '添加分组'
    addGroup.addEventListener('click', () => {
      const ng: NavGroup = {
        id: uid(),
        name: '新分组',
        icon: 'lucide:folder',
        match: ['*://' + (location.hostname || '') + '/*'],
        items: [],
        defaultOpen: sitePref.defaultOpen,
      }
      cfg.groups.push(ng)
      active = ng
      void saveConfig(cfg)
      rebuildGroupPills()
      rebuildGroupEditor()
      rerender(root, cfg)
    })
    const delGroup = document.createElement('button')
    delGroup.className = 'btn btn-secondary'
    delGroup.textContent = '删除分组'
    delGroup.addEventListener('click', () => {
      if (cfg.groups.length <= 1) {
        mask.remove()
        return
      }

      cfg.groups = cfg.groups.filter((g) => g.id !== active.id)
      active = cfg.groups[0]
      void saveConfig(cfg)
      rebuildGroupPills()
      rebuildGroupEditor()
      rerender(root, cfg)
    })
    const delEmptyGroups = document.createElement('button')
    delEmptyGroups.className = 'btn btn-secondary'
    delEmptyGroups.textContent = '删除所有空的分组'
    delEmptyGroups.addEventListener('click', () => {
      const empties = cfg.groups.filter((g) => (g.items || []).length === 0)
      const n = empties.length
      if (n === 0) return
      const ok = globalThis.confirm('确认删除 ' + n + ' 个分组？')
      if (!ok) return
      const kept = cfg.groups.filter((g) => (g.items || []).length > 0)
      if (kept.length === 0) {
        const ng: NavGroup = {
          id: uid(),
          name: '新分组',
          icon: 'lucide:folder',
          match: ['*://' + (location.hostname || '') + '/*'],
          items: [],
          defaultOpen: sitePref.defaultOpen,
        }
        kept.push(ng)
      }

      cfg.groups = kept
      active = cfg.groups[0]
      void saveConfig(cfg)
      rebuildGroupPills()
      rebuildGroupEditor()
      rerender(root, cfg)
    })
    grpActions.append(addGroup)
    grpActions.append(delGroup)
    grpActions.append(delEmptyGroups)
    groupEditor.append(row1)
    groupEditor.append(row2)
    groupEditor.append(row3)
    groupEditor.append(row4)
    groupEditor.append(row5)
    groupEditor.append(row6)
    groupEditor.append(itemsHeader)
    groupEditor.append(itemsList)
    groupEditor.append(addRow)
    groupEditor.append(grpActions)
    rebuildItems()
  }

  rebuildGroupPills()
  rebuildGroupEditor()
  const actions = document.createElement('div')
  actions.className = 'row'
  const exportBtn = document.createElement('button')
  exportBtn.className = 'btn btn-secondary'
  exportBtn.textContent = '导出配置'
  exportBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
    } catch {}
  })
  const closeBtn = document.createElement('button')
  closeBtn.className = 'btn btn-secondary'
  closeBtn.textContent = '关闭'
  closeBtn.addEventListener('click', () => {
    mask.remove()
  })
  actions.append(exportBtn)
  actions.append(closeBtn)
  modal.append(h2)
  modal.append(grid)
  modal.append(syncRow)
  modal.append(edgeRow)
  // panel control row is appended into grid to align with inputs
  modal.append(grpHeader)
  modal.append(grpList)
  modal.append(groupEditor)
  modal.append(actions)
  mask.append(modal)
  root.append(mask)
}

// quick add modal deprecated; replaced by inline dropdown

function openQuickAddMenu(
  root: ShadowRoot,
  cfg: QuickNavConfig,
  anchor: HTMLElement
) {
  for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
    n.remove()
  const menu = document.createElement('div')
  menu.className = 'quick-add-menu'
  menu.setAttribute('role', 'menu')
  const addGroupBtn = document.createElement('button')
  addGroupBtn.className = 'quick-add-item'
  addGroupBtn.append(renderIcon('lucide:folder'))
  addGroupBtn.append(document.createTextNode(' 添加分组'))
  addGroupBtn.setAttribute('role', 'menuitem')
  const addLinkBtn = document.createElement('button')
  addLinkBtn.className = 'quick-add-item'
  addLinkBtn.append(renderIcon('lucide:link'))
  addLinkBtn.append(document.createTextNode(' 添加链接'))
  addLinkBtn.setAttribute('role', 'menuitem')
  addGroupBtn.setAttribute('tabindex', '0')
  addLinkBtn.setAttribute('tabindex', '0')
  menu.append(addGroupBtn)
  menu.append(addLinkBtn)

  const r = anchor.getBoundingClientRect()
  menu.style.position = 'fixed'
  const rightSide = isRightSide(sitePref.position)
  const top = Math.round(r.bottom + 6)
  if (rightSide) {
    const right = Math.round(window.innerWidth - r.right)
    menu.style.top = `${top}px`
    menu.style.right = `${right}px`
  } else {
    const left = Math.round(r.left)
    menu.style.top = `${top}px`
    menu.style.left = `${left}px`
  }

  suppressCollapse = true
  tempOpen = true
  addGroupBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    const ng: NavGroup = {
      id: uid(),
      name: '新分组',
      icon: 'lucide:folder',
      match: ['*://' + (location.hostname || '') + '/*'],
      items: [],
      defaultOpen: sitePref.defaultOpen,
    }
    cfg.groups.push(ng)
    void saveConfig(cfg)
    rerender(root, cfg)
    for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
      n.remove()
    suppressCollapse = false
    openEditor(root, cfg, ng.id)
  })

  addLinkBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
      n.remove()
    suppressCollapse = false
    const matched = currentGroups(cfg)
    openAddLinkModal(root, cfg, {
      saveConfig(c) {
        void saveConfig(c)
      },
      rerender(r, c) {
        rerender(r, c)
      },
      defaultOpen: (sitePref.defaultOpen || 'same-tab') as
        | 'same-tab'
        | 'new-tab',
      defaultGroupId: (matched[0] || cfg.groups[0])?.id,
    })
  })

  menu.addEventListener('click', (e) => {
    e.stopPropagation()
  })
  menu.addEventListener('keydown', (e) => {
    const items = [addGroupBtn, addLinkBtn]
    const ae = root.activeElement
    const idx = items.indexOf(
      ae instanceof HTMLButtonElement ? ae : addGroupBtn
    )
    if (e.key === 'Escape') {
      for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
        n.remove()
      return
    }

    if (e.key === 'ArrowDown') {
      const next = items[(Math.max(0, idx) + 1) % items.length]
      next.focus()
      e.preventDefault()
    }

    if (e.key === 'ArrowUp') {
      const prev =
        items[
          (items.length + (idx <= 0 ? items.length - 1 : idx - 1)) %
            items.length
        ]
      prev.focus()
      e.preventDefault()
    }

    if (e.key === 'Enter') {
      const cur = items[Math.max(0, idx)]
      cur.click()
      e.preventDefault()
    }
  })
  root.append(menu)
  setTimeout(() => {
    try {
      addGroupBtn.focus()
    } catch {}
  }, 0)
  const onOutside = () => {
    for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
      n.remove()
    suppressCollapse = false
  }

  setTimeout(() => {
    root.addEventListener('click', onOutside, { once: true })
    document.addEventListener('click', onOutside, { once: true })
    document.addEventListener(
      'keydown',
      (ev) => {
        if (ev.key === 'Escape') onOutside()
      },
      { once: true }
    )
  }, 0)
}

let lastCollapsed = true
let suppressCollapse = false
function rerender(root: ShadowRoot, cfg: QuickNavConfig) {
  suppressCollapse = true
  for (const n of Array.from(
    root.querySelectorAll('.utqn,.collapsed-tab,.quick-add-menu')
  ))
    n.remove()

  if (sitePref.enabled === false) {
    lastCollapsed = true
    suppressCollapse = false
    return
  }

  const isCollapsed = !tempOpen && (tempClosed || !sitePref.pinned)
  if (isCollapsed) {
    if (!sitePref.edgeHidden) {
      const tab = document.createElement('div')
      tab.className = 'collapsed-tab'
      place(tab, cfg)
      try {
        const gw = sitePref.edgeWidth ?? EDGE_DEFAULT_WIDTH
        const gh = sitePref.edgeHeight ?? EDGE_DEFAULT_HEIGHT
        const go = sitePref.edgeOpacity ?? EDGE_DEFAULT_OPACITY
        const horiz = isHorizontalPos(sitePref.position)
        const thickness = Math.max(1, Math.min(24, gw))
        const length = Math.max(24, Math.min(320, gh))
        tab.style.width = horiz ? `${length}px` : `${thickness}px`
        tab.style.height = horiz ? `${thickness}px` : `${length}px`
        tab.style.opacity = String(Math.max(0, Math.min(1, go)))
        tab.style.backgroundColor = isDarkTheme(cfg)
          ? String(sitePref.edgeColorDark || EDGE_DEFAULT_COLOR_DARK)
          : String(sitePref.edgeColorLight || EDGE_DEFAULT_COLOR_LIGHT)
      } catch {}

      tab.addEventListener('mouseenter', () => {
        tempOpen = true
        rerender(root, cfg)
      })
      tab.addEventListener('mouseleave', () => {
        if (!sitePref.pinned && !suppressCollapse)
          scheduleAutoCollapse(root, cfg)
      })
      root.append(tab)
    }

    lastCollapsed = true
    suppressCollapse = false
    return
  }

  renderPanel(root, cfg, lastCollapsed)
  lastCollapsed = false
  suppressCollapse = false
}

function initEdgeExpand(root: ShadowRoot, cfg: QuickNavConfig) {
  let lastOpen = 0
  document.addEventListener('mousemove', (e) => {
    const now = Date.now()
    if (now - lastOpen < 500) return
    const w = window.innerWidth
    const nearLeft = e.clientX < 6
    const nearRight = e.clientX > w - 6
    const pref = sitePref
    if (
      (pref.position === 'left-center' && nearLeft) ||
      (pref.position === 'right-center' && nearRight)
    ) {
      tempOpen = true
      rerender(root, cfg)
      lastOpen = now
    }
  })
}

function registerMenu(root: ShadowRoot, cfg: QuickNavConfig) {
  try {
    const fn = (globalThis as any).GM_registerMenuCommand
    try {
      const unreg = (globalThis as any).GM_unregisterMenuCommand
      if (typeof unreg === 'function' && Array.isArray(menuIds)) {
        for (const id of menuIds) {
          try {
            unreg(id)
          } catch {}
        }

        menuIds = []
      }
    } catch {}

    if (typeof fn === 'function') {
      menuIds.push(
        fn('🧭 打开快速导航面板', () => {
          if (sitePref.enabled === false) {
            const ok =
              globalThis.confirm('当前网站已禁用，是否启用并打开面板？')
            if (ok) {
              sitePref.enabled = true
              void saveConfig(cfg)
              tempOpen = true
              rerender(root, cfg)
              registerMenu(root, cfg)
            }

            return
          }

          tempOpen = true
          rerender(root, cfg)
        })
      )
    }

    if (typeof fn === 'function')
      menuIds.push(
        fn('⚙️ 设置快速导航', () => {
          openEditor(root, cfg)
        })
      )
    if (typeof fn === 'function') {
      const text = sitePref.enabled
        ? '🚫 禁用当前网站快速导航'
        : '✅ 启用当前网站快速导航'
      menuIds.push(
        fn(text, () => {
          sitePref.enabled = !sitePref.enabled
          void saveConfig(cfg)
          rerender(root, cfg)
          registerMenu(root, cfg)
        })
      )
    }
  } catch {}
}

function registerStorageListener(root: ShadowRoot, cfg: QuickNavConfig) {
  try {
    const fn = (globalThis as any).GM_addValueChangeListener
    if (typeof fn === 'function')
      fn(KEY, (_name: string, _old: string, nv: string, remote: boolean) => {
        if (!remote) return
        try {
          const obj = JSON.parse(nv)
          if (obj && obj.global && obj.groups) {
            cfg.global = obj.global
            cfg.groups = obj.groups
            if (obj.sitePrefs) cfg.sitePrefs = obj.sitePrefs
            initSitePref(cfg)
            rerender(root, cfg)
          }
        } catch {}
      })
  } catch {}
}

let collapseTimer: number | undefined
function scheduleAutoCollapse(root: ShadowRoot, cfg: QuickNavConfig) {
  if (collapseTimer) clearTimeout(collapseTimer)
  collapseTimer = setTimeout(() => {
    collapseWithAnim(root, cfg)
  }, 500) as unknown as number
}

function collapseWithAnim(root: ShadowRoot, cfg: QuickNavConfig) {
  try {
    const p = sitePref.position
    const sel = root.querySelector('.utqn .panel')
    if (sel) {
      if (isHorizontalPos(p)) {
        const isTop = isTopSide(p)
        sel.classList.add(isTop ? 'anim-out-top' : 'anim-out-bottom')
      } else {
        const right = isRightSide(p)
        sel.classList.add(right ? 'anim-out-right' : 'anim-out-left')
      }

      sel.addEventListener(
        'animationend',
        () => {
          tempClosed = true
          tempOpen = false
          rerender(root, cfg)
        },
        { once: true }
      )
      return
    }
  } catch {}

  tempOpen = false
  rerender(root, cfg)
}

function updateThemeUI(root: ShadowRoot, cfg: QuickNavConfig) {
  const wrapper = root.querySelector('.utqn')
  if (!wrapper) return
  wrapper.classList.toggle('dark', isDarkTheme(cfg))
  const curTheme = sitePref.theme || THEME_DEFAULT
  const map: Record<string, string> = {
    系统: 'system',
    浅色: 'light',
    深色: 'dark',
  }
  const btns = wrapper.querySelectorAll('.theme-btn')
  for (const b of Array.from(btns)) {
    const key = (b as HTMLElement).title
    const val = map[key] || ''
    b.classList.toggle('active', val === curTheme)
  }
}

function registerUrlChangeListener(root: ShadowRoot, cfg: QuickNavConfig) {
  let last = location.href
  function onChange() {
    const now = location.href
    if (now === last) return
    last = now
    rerender(root, cfg)
  }

  try {
    const origPush = history.pushState.bind(history)
    history.pushState = function (...args: any[]) {
      const r = origPush(...args)
      try {
        onChange()
      } catch {}

      return r
    } as any
  } catch {}

  try {
    const origReplace = history.replaceState.bind(history)
    history.replaceState = function (...args: any[]) {
      const r = origReplace(...args)
      try {
        onChange()
      } catch {}

      return r
    } as any
  } catch {}

  globalThis.addEventListener('popstate', () => {
    onChange()
  })
  globalThis.addEventListener('hashchange', () => {
    onChange()
  })
}

function main() {
  const { root } = createRoot()
  void (async () => {
    const cfg = await loadConfig()
    initSitePref(cfg)
    if (sitePref.enabled === false) {
      registerMenu(root, cfg)
      registerStorageListener(root, cfg)
      registerUrlChangeListener(root, cfg)
      return
    }

    rerender(root, cfg)
    // initEdgeExpand(root, cfg)
    registerMenu(root, cfg)
    registerStorageListener(root, cfg)
    registerUrlChangeListener(root, cfg)
    try {
      const mq = globalThis.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', () => {
        if ((sitePref.theme || 'system') === 'system') rerender(root, cfg)
      })
    } catch {}

    try {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') rerender(root, cfg)
      })
    } catch {}
  })()
}

main()
