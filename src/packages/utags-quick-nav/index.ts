import styleText from 'css:./style.css'

type OpenMode = 'same-tab' | 'new-tab'
type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-edge'
  | 'right-edge'
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
    position: Position
    defaultOpen: OpenMode
    collapsed: boolean
    syncUrl?: string
    theme?: 'light' | 'dark' | 'system'
    pinned?: boolean
  }
  groups: NavGroup[]
}

const KEY = 'utqn_config'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function matchPattern(url: string, pattern: string) {
  try {
    const esc: string = pattern
      .replaceAll(/[.+^${}()|[\]\\]/g, '\\$&')
      .replaceAll('*', '.*')
    const re = new RegExp('^' + esc + '$')
    return re.test(url)
  } catch {
    return false
  }
}

function matchGroup(url: string, g: NavGroup) {
  for (const p of g.match) if (matchPattern(url, p)) return true
  return false
}

function renderIcon(s?: string) {
  const span = document.createElement('span')
  span.className = 'icon'
  const t = String(s || '').trim()
  if (!t) return span
  if (t.startsWith('lucide:')) {
    const k = t.split(':')[1]
    const img = document.createElement('img')
    img.src = `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${k}.svg`
    img.width = 16
    img.height = 16
    img.style.objectFit = 'contain'
    span.append(img)
    return span
  }

  if (t.startsWith('url:')) {
    const img = document.createElement('img')
    img.src = t.slice(4)
    img.width = 16
    img.height = 16
    img.style.objectFit = 'contain'
    span.append(img)
    return span
  }

  if (t.startsWith('svg:')) {
    span.innerHTML = t.slice(4)
    return span
  }

  span.textContent = t
  return span
}

function openItem(it: NavItem, group: NavGroup, cfg: QuickNavConfig) {
  const mode: OpenMode =
    it.openIn || group.defaultOpen || cfg.global.defaultOpen
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
    if (v) return JSON.parse(String(v))
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
    global: {
      position: 'top-right',
      defaultOpen: 'same-tab',
      collapsed: true,
      theme: 'system',
    },
    groups: [g],
  }
}

async function saveConfig(cfg: QuickNavConfig) {
  try {
    await GM.setValue(KEY, JSON.stringify(cfg))
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
  const p = cfg.global.position
  el.style.position = 'fixed'
  el.style.inset = 'auto'
  switch (p) {
    case 'top-right': {
      el.style.top = '12px'
      el.style.right = '12px'

      break
    }

    case 'top-left': {
      el.style.top = '12px'
      el.style.left = '12px'

      break
    }

    case 'bottom-left': {
      el.style.bottom = '12px'
      el.style.left = '12px'

      break
    }

    case 'bottom-right': {
      el.style.bottom = '12px'
      el.style.right = '12px'

      break
    }

    case 'left-edge': {
      el.style.top = '50%'
      el.style.left = '6px'
      el.style.transform = 'translateY(-50%)'

      break
    }

    case 'right-edge': {
      el.style.top = '50%'
      el.style.right = '6px'
      el.style.transform = 'translateY(-50%)'

      break
    }
  }
}

function scorePattern(url: string, pattern: string) {
  if (!matchPattern(url, pattern)) return -1
  return pattern.replaceAll('*', '').length
}

function groupScore(url: string, g: NavGroup) {
  let max = -1
  for (const p of g.match) {
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
  const t = cfg.global.theme || 'system'
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

  const pos = cfg.global.position
  const isRight =
    pos === 'top-right' || pos === 'bottom-right' || pos === 'right-edge'
  if (animIn) panel.classList.add(isRight ? 'anim-in-right' : 'anim-in-left')

  const collapseIconBtn = document.createElement('button')
  collapseIconBtn.className = 'collapse-btn'
  collapseIconBtn.append(
    renderIcon(isRight ? 'lucide:chevron-right' : 'lucide:chevron-left')
  )
  collapseIconBtn.title = cfg.global.collapsed ? '展开' : '折叠'
  collapseIconBtn.addEventListener('click', () => {
    const toCollapsed = !cfg.global.collapsed
    if (toCollapsed) {
      cfg.global.pinned = false
      collapseWithAnim(root, cfg)
      return
    }

    cfg.global.collapsed = false
    void saveConfig(cfg)
    rerender(root, cfg)
  })

  const themeSwitch = document.createElement('div')
  themeSwitch.className = 'theme-switch'
  const sysBtn = document.createElement('button')
  sysBtn.className = 'theme-btn'
  sysBtn.append(renderIcon('lucide:monitor'))
  sysBtn.title = '系统'
  sysBtn.addEventListener('click', () => {
    cfg.global.theme = 'system'
    void saveConfig(cfg)
    updateThemeUI(root, cfg)
  })
  const lightBtn = document.createElement('button')
  lightBtn.className = 'theme-btn'
  lightBtn.append(renderIcon('lucide:sun'))
  lightBtn.title = '浅色'
  lightBtn.addEventListener('click', () => {
    cfg.global.theme = 'light'
    void saveConfig(cfg)
    updateThemeUI(root, cfg)
  })
  const darkBtn = document.createElement('button')
  darkBtn.className = 'theme-btn'
  darkBtn.append(renderIcon('lucide:moon'))
  darkBtn.title = '深色'
  darkBtn.addEventListener('click', () => {
    cfg.global.theme = 'dark'
    void saveConfig(cfg)
    updateThemeUI(root, cfg)
  })
  const curTheme = cfg.global.theme || 'system'
  sysBtn.classList.toggle('active', curTheme === 'system')
  lightBtn.classList.toggle('active', curTheme === 'light')
  darkBtn.classList.toggle('active', curTheme === 'dark')
  themeSwitch.append(sysBtn)
  themeSwitch.append(lightBtn)
  themeSwitch.append(darkBtn)

  const settingsBtn = document.createElement('button')
  settingsBtn.className = 'icon-btn'
  settingsBtn.append(renderIcon('lucide:settings'))
  settingsBtn.title = '设置'
  settingsBtn.addEventListener('click', () => {
    openEditor(root, cfg)
  })

  const pinBtn = document.createElement('button')
  pinBtn.className = 'icon-btn'
  pinBtn.append(renderIcon(cfg.global.pinned ? 'lucide:pin' : 'lucide:pin-off'))
  pinBtn.title = cfg.global.pinned ? '取消固定' : '固定显示'
  pinBtn.classList.toggle('active', Boolean(cfg.global.pinned))
  pinBtn.addEventListener('click', () => {
    cfg.global.pinned = !cfg.global.pinned
    cfg.global.collapsed = !cfg.global.pinned
    void saveConfig(cfg)
    pinBtn.classList.toggle('active', Boolean(cfg.global.pinned))
    pinBtn.title = cfg.global.pinned ? '取消固定' : '固定显示'
    pinBtn.innerHTML = ''
    pinBtn.append(
      renderIcon(cfg.global.pinned ? 'lucide:pin' : 'lucide:pin-off')
    )
  })

  if (isRight) {
    // panel on right: collapse button on LEFT; settings + pin on RIGHT
    leftActions.append(collapseIconBtn)
    rightActions.append(themeSwitch)
    rightActions.append(settingsBtn)
    rightActions.append(pinBtn)
  } else {
    // panel on left: collapse button on RIGHT; settings + pin on LEFT
    leftActions.append(themeSwitch)
    leftActions.append(settingsBtn)
    leftActions.append(pinBtn)
    rightActions.append(collapseIconBtn)
  }

  collapseRow.append(leftActions)
  collapseRow.append(rightActions)
  panel.append(collapseRow)

  const matched = currentGroups(cfg)
  const groupsToShow = matched
  for (const g of groupsToShow) {
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
    const actions = document.createElement('div')
    actions.className = 'header-actions'
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
      const sec = panel.querySelector('.section[data-gid="' + g.id + '"]')
      if (sec) {
        const itemsEl = sec.querySelector('.items')
        if (itemsEl)
          (itemsEl as HTMLElement).style.display = g.collapsed ? 'none' : ''
        toggleBtn.title = g.collapsed ? '展开' : '折叠'
        toggleBtn.innerHTML = ''
        toggleBtn.append(
          renderIcon(
            g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down'
          )
        )
      }
    })
    actions.append(editBtn)
    actions.append(hideGroupBtn)
    actions.append(toggleBtn)
    header.append(actions)
    const items = document.createElement('div')
    items.className = 'items'
    items.style.setProperty('--cols', String(g.itemsPerRow || 1))
    if (!g.collapsed) {
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
            it.openIn || g.defaultOpen || cfg.global.defaultOpen
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

        a.append(renderIcon(it.icon))
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
    }

    section.append(header)
    section.append(items)
    panel.append(section)
  }

  wrapper.append(panel)
  wrapper.addEventListener('mouseleave', () => {
    if (!cfg.global.pinned && !suppressCollapse) scheduleAutoCollapse(root, cfg)
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
  const mask = document.createElement('div')
  mask.className = 'modal-mask'
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
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'left-edge',
    'right-edge',
  ] as Position[]) {
    const o = document.createElement('option')
    o.value = p
    o.textContent = p
    if (cfg.global.position === p) o.selected = true
    posSel.append(o)
  }

  posSel.addEventListener('change', () => {
    cfg.global.position = posSel.value as Position
    void saveConfig(cfg)
    rerender(root, cfg)
  })
  posRow.append(posLabel)
  posRow.append(posSel)
  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '默认打开方式'
  const openSel = document.createElement('select')
  for (const m of ['same-tab', 'new-tab'] as OpenMode[]) {
    const o = document.createElement('option')
    o.value = m
    o.textContent = m
    if (cfg.global.defaultOpen === m) o.selected = true
    openSel.append(o)
  }

  openSel.addEventListener('change', () => {
    const grp = cfg.groups.find((g) => g.id === active.id)
    if (!grp) return
    grp.defaultOpen = openSel.value as OpenMode
    void saveConfig(cfg)
    rerender(root, cfg)
  })
  openRow.append(openLabel)
  openRow.append(openSel)
  grid.append(posRow)
  grid.append(openRow)
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
  const grpHeader = document.createElement('h2')
  grpHeader.className = 'section-title'
  grpHeader.textContent = '分组'
  const grpList = document.createElement('div')
  grpList.className = 'group-list'
  let active = cfg.groups.find((g) => g.id === activeGroupId) || cfg.groups[0]
  function rebuildGroupPills() {
    grpList.innerHTML = ''
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
    groupEditor.innerHTML = ''
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
    const openSel = document.createElement('select')
    for (const m of ['same-tab', 'new-tab'] as OpenMode[]) {
      const o = document.createElement('option')
      o.value = m
      o.textContent = m
      if ((active.defaultOpen || cfg.global.defaultOpen) === m)
        o.selected = true
      openSel.append(o)
    }

    openSel.addEventListener('change', () => {
      active.defaultOpen = openSel.value as OpenMode
      void saveConfig(cfg)
    })
    row4.append(l4)
    row4.append(openSel)

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
      itemsList.innerHTML = ''
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
          if (
            (it.openIn || active.defaultOpen || cfg.global.defaultOpen) === mm
          )
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
    addBtn.className = 'btn'
    addBtn.textContent = '添加导航项'
    addBtn.addEventListener('click', () => {
      active.items.push({
        id: uid(),
        name: '新项',
        icon: 'lucide:link',
        type: 'url',
        data: '/',
        openIn: active.defaultOpen || cfg.global.defaultOpen,
      })
      void saveConfig(cfg)
      rebuildItems()
      rerender(root, cfg)
    })
    addRow.append(addBtn)
    const grpActions = document.createElement('div')
    grpActions.className = 'row'
    const addGroup = document.createElement('button')
    addGroup.className = 'btn'
    addGroup.textContent = '添加分组'
    addGroup.addEventListener('click', () => {
      const ng: NavGroup = {
        id: uid(),
        name: '新分组',
        icon: 'lucide:folder',
        match: ['*://' + (location.hostname || '') + '/*'],
        items: [],
        defaultOpen: cfg.global.defaultOpen,
      }
      cfg.groups.push(ng)
      active = ng
      void saveConfig(cfg)
      rebuildGroupPills()
      rebuildGroupEditor()
      rerender(root, cfg)
    })
    const delGroup = document.createElement('button')
    delGroup.className = 'btn'
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
    grpActions.append(addGroup)
    grpActions.append(delGroup)
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
  exportBtn.className = 'btn'
  exportBtn.textContent = '导出配置'
  exportBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cfg, null, 2))
    } catch {}
  })
  const closeBtn = document.createElement('button')
  closeBtn.className = 'btn'
  closeBtn.textContent = '关闭'
  closeBtn.addEventListener('click', () => {
    mask.remove()
  })
  actions.append(exportBtn)
  actions.append(closeBtn)
  modal.append(h2)
  modal.append(grid)
  modal.append(syncRow)
  modal.append(grpHeader)
  modal.append(grpList)
  modal.append(groupEditor)
  modal.append(actions)
  mask.append(modal)
  root.append(mask)
}

let lastCollapsed = true
let suppressCollapse = false
function rerender(root: ShadowRoot, cfg: QuickNavConfig) {
  suppressCollapse = true
  for (const n of Array.from(root.querySelectorAll('.utqn,.collapsed-tab')))
    n.remove()

  if (cfg.global.collapsed) {
    const tab = document.createElement('div')
    tab.className = 'collapsed-tab'
    tab.textContent = '≡'
    place(tab, cfg)
    tab.addEventListener('mouseenter', () => {
      cfg.global.collapsed = false
      rerender(root, cfg)
    })
    tab.addEventListener('mouseleave', () => {
      if (!cfg.global.pinned && !suppressCollapse)
        scheduleAutoCollapse(root, cfg)
    })
    root.append(tab)
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
    if (
      (cfg.global.position === 'left-edge' && nearLeft) ||
      (cfg.global.position === 'right-edge' && nearRight)
    ) {
      cfg.global.collapsed = false
      rerender(root, cfg)
      lastOpen = now
    }
  })
}

function registerMenu(root: ShadowRoot, cfg: QuickNavConfig) {
  try {
    const fn = (globalThis as any).GM_registerMenuCommand
    if (typeof fn === 'function')
      fn('⚙️ 设置快速导航', () => {
        openEditor(root, cfg)
      })
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
  }, 150) as unknown as number
}

function collapseWithAnim(root: ShadowRoot, cfg: QuickNavConfig) {
  try {
    const p = cfg.global.position
    const sel = root.querySelector('.utqn .panel')
    if (sel) {
      const right =
        p === 'top-right' || p === 'bottom-right' || p === 'right-edge'
      sel.classList.add(right ? 'anim-out-right' : 'anim-out-left')
      sel.addEventListener(
        'animationend',
        () => {
          cfg.global.collapsed = true
          void saveConfig(cfg)
          rerender(root, cfg)
        },
        { once: true }
      )
      return
    }
  } catch {}

  cfg.global.collapsed = true
  void saveConfig(cfg)
  rerender(root, cfg)
}

function main() {
  const { root } = createRoot()
  void (async () => {
    const cfg = await loadConfig()
    rerender(root, cfg)
    initEdgeExpand(root, cfg)
    registerMenu(root, cfg)
    registerStorageListener(root, cfg)
    registerUrlChangeListener(root, cfg)
    try {
      const mq = globalThis.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', () => {
        if ((cfg.global.theme || 'system') === 'system') rerender(root, cfg)
      })
    } catch {}
  })()
}

main()

function updateThemeUI(root: ShadowRoot, cfg: QuickNavConfig) {
  const wrapper = root.querySelector('.utqn')
  if (!wrapper) return
  wrapper.classList.toggle('dark', isDarkTheme(cfg))
  const cur = cfg.global.theme || 'system'
  const map: Record<string, string> = {
    系统: 'system',
    浅色: 'light',
    深色: 'dark',
  }
  const btns = wrapper.querySelectorAll('.theme-btn')
  for (const b of Array.from(btns)) {
    const key = (b as HTMLElement).title
    const val = map[key] || ''
    b.classList.toggle('active', val === cur)
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
