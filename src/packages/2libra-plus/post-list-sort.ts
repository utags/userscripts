import { clearChildren } from '../../utils/dom'
import { onDomChange, onUrlChange } from '../../utils/dom-watcher'

type SettingsSnapshot = {
  enabled: boolean
  postListSort: boolean
  rememberSortMode: boolean
}

type GetSettings = () => SettingsSnapshot

type SortMode = 'default' | 'newToOld' | 'oldToNew' | 'replyDesc' | 'replyAsc'

type ItemInfo = {
  el: HTMLLIElement
  time: number | undefined
  index: number
  replyCount: number | undefined
}

const STORAGE_KEY_SORT_MODE = '2libra_plus_sort_mode'

const sortState: {
  mode: SortMode
} = {
  mode: 'default',
}

let initialized = false

function saveSortMode(mode: SortMode): void {
  try {
    localStorage.setItem(STORAGE_KEY_SORT_MODE, mode)
  } catch {}
}

function loadSortMode(): SortMode | undefined {
  try {
    return (
      (localStorage.getItem(STORAGE_KEY_SORT_MODE) as SortMode) || undefined
    )
  } catch {
    return undefined
  }
}

function getListContainer(): HTMLUListElement | undefined {
  const list = document.querySelector<HTMLUListElement>(
    '[data-main-left="true"] ul.card'
  )
  return list || undefined
}

function getItems(list: HTMLUListElement): ItemInfo[] {
  const children = Array.from(list.children)
  const items: ItemInfo[] = []
  let nextIndex = 0

  for (const child of children) {
    if (!(child instanceof HTMLLIElement)) continue
    let index: number
    const stored = child.dataset.replySortIndex
    if (stored) {
      const n = Number.parseInt(stored, 10)
      index = Number.isFinite(n) ? n : nextIndex
    } else {
      index = nextIndex
      child.dataset.replySortIndex = String(index)
    }

    nextIndex = index + 1

    const timeEl = child.querySelector<HTMLTimeElement>('time[datetime]')
    let time: number | undefined
    if (timeEl) {
      const dt = timeEl.getAttribute('datetime')
      if (dt) {
        const t = Date.parse(dt)
        if (!Number.isNaN(t)) {
          time = t
        }
      }
    }

    let replyCount: number | undefined
    const badges = child.querySelectorAll<HTMLElement>('.badge')
    for (let i = badges.length - 1; i >= 0; i -= 1) {
      const text = badges[i].textContent?.trim() ?? ''
      if (!text) continue
      const n = Number.parseInt(text, 10)
      if (Number.isFinite(n)) {
        replyCount = n
        break
      }
    }

    items.push({
      el: child,
      time,
      index,
      replyCount,
    })
  }

  return items
}

function applySort(list: HTMLUListElement): void {
  const items = getItems(list)
  if (items.length === 0) return

  let ordered: ItemInfo[]

  if (sortState.mode === 'default') {
    ordered = [...items].sort((a, b) => a.index - b.index)
  } else if (sortState.mode === 'newToOld' || sortState.mode === 'oldToNew') {
    const withTime: ItemInfo[] = items.filter(
      (item) => typeof item.time === 'number'
    )
    const withoutTime: ItemInfo[] = items.filter(
      (item) => typeof item.time !== 'number'
    )

    withTime.sort((a, b) => {
      const ta = a.time!
      const tb = b.time!
      if (ta === tb) return a.index - b.index
      if (sortState.mode === 'newToOld') {
        return tb - ta
      }

      return ta - tb
    })

    withoutTime.sort((a, b) => a.index - b.index)

    ordered = [...withTime, ...withoutTime]
  } else {
    const withCount: ItemInfo[] = items.filter(
      (item) => typeof item.replyCount === 'number'
    )
    const withoutCount: ItemInfo[] = items.filter(
      (item) => typeof item.replyCount !== 'number'
    )

    withCount.sort((a, b) => {
      const ca = a.replyCount!
      const cb = b.replyCount!
      if (ca === cb) return a.index - b.index
      if (sortState.mode === 'replyDesc') {
        return cb - ca
      }

      return ca - cb
    })

    withoutCount.sort((a, b) => a.index - b.index)

    ordered = [...withCount, ...withoutCount]
  }

  let insertBeforeNode: ChildNode | undefined
  const children = Array.from(list.childNodes)
  for (let index = children.length - 1; index >= 0; index -= 1) {
    const node = children[index]
    if (
      !(node instanceof HTMLLIElement) &&
      node instanceof Element &&
      !node.querySelector('[data-libra-plus-sort="reply-time"]')
    ) {
      insertBeforeNode = node
      break
    }
  }

  if (insertBeforeNode) {
    for (const item of ordered) {
      list.insertBefore(item.el, insertBeforeNode)
    }
  } else {
    for (const item of ordered) {
      list.append(item.el)
    }
  }
}

function hasUnindexedItems(list: HTMLUListElement): boolean {
  for (const child of list.children) {
    if (child instanceof HTMLLIElement && !child.dataset.replySortIndex) {
      return true
    }
  }

  return false
}

function updateActiveButtons(container: HTMLElement): void {
  const buttons = Array.from(
    container.querySelectorAll<HTMLButtonElement>('[data-sort-mode]')
  )
  for (const btn of buttons) {
    const mode = btn.dataset.sortMode as SortMode | undefined
    if (mode && mode === sortState.mode) {
      btn.classList.add('btn-active')
    } else {
      btn.classList.remove('btn-active')
    }
  }
}

function createSortControls(getSettings: GetSettings): HTMLElement | undefined {
  const list = getListContainer()
  if (!list || list.children.length === 0) return undefined
  const root = list

  const sortContainer = document.createElement('div')
  sortContainer.className = 'relative inline-block'
  sortContainer.dataset.libraPlusSort = 'reply-time'

  const toggleButton = document.createElement('button')
  toggleButton.type = 'button'
  toggleButton.className = 'btn btn-xs btn-ghost'
  toggleButton.title = '排序'
  toggleButton.textContent = '⇅'
  sortContainer.append(toggleButton)

  const menu = document.createElement('div')
  menu.className =
    'hidden absolute right-0 z-20 mt-1 flex flex-col gap-1 rounded bg-base-100 border border-base-content/10 shadow-xs p-1'
  sortContainer.append(menu)

  let menuOpen = false

  const openMenu = () => {
    if (menuOpen) return
    menuOpen = true
    menu.classList.remove('hidden')
  }

  const closeMenu = () => {
    if (!menuOpen) return
    menuOpen = false
    menu.classList.add('hidden')
  }

  toggleButton.addEventListener('click', (event) => {
    event.stopPropagation()
    if (menuOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Node)) return
    if (!sortContainer.contains(target)) {
      closeMenu()
    }
  })

  const modes: Array<{ mode: SortMode; label: string }> = [
    { mode: 'default', label: '按默认顺序' },
    { mode: 'newToOld', label: '按回复时间（新→老）' },
    { mode: 'oldToNew', label: '按回复时间（老→新）' },
    { mode: 'replyDesc', label: '按回复数量（多→少）' },
    { mode: 'replyAsc', label: '按回复数量（少→多）' },
  ]

  for (const { mode, label } of modes) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = label
    btn.className = 'btn btn-xs btn-ghost justify-start w-full'
    btn.dataset.sortMode = mode
    menu.append(btn)
  }

  sortContainer.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof HTMLButtonElement)) return
    const mode = target.dataset.sortMode as SortMode | undefined
    if (!mode || mode === sortState.mode) return
    sortState.mode = mode
    updateActiveButtons(sortContainer)
    const listEl = getListContainer()
    if (listEl && listEl.children.length > 0) {
      applySort(listEl)
    }

    const settings = getSettings()
    if (settings.rememberSortMode) {
      saveSortMode(mode)
    }

    closeMenu()
  })

  updateActiveButtons(sortContainer)

  let header = root.querySelector<HTMLElement>(
    ':scope > div.flex.items-center.justify-between'
  )

  if (header) {
    header.append(sortContainer)
  } else {
    header = document.createElement('div')
    header.className =
      'px-2 py-1 border-b border-base-content/10 flex items-center justify-between'

    header.append(sortContainer)

    list.firstChild!.before(header)
  }

  ensureBreadcrumbs(header)

  return header
}

function ensureBreadcrumbs(header: HTMLElement): void {
  let isHome = false
  try {
    const loc = globalThis.location
    isHome = Boolean(loc && loc.pathname === '/')
  } catch {}

  const fullTitle = document.title || ''
  const prefix = '2Libra › '
  let pageTitle = fullTitle.startsWith(prefix)
    ? fullTitle.slice(prefix.length).trim()
    : fullTitle.trim()
  if (!pageTitle) {
    pageTitle = '首页'
  }

  let breadcrumbs = header.querySelector<HTMLElement>(':scope > .breadcrumbs')
  const breadcrumbsOutside = document.querySelector<HTMLElement>('.breadcrumbs')

  if (!breadcrumbs) {
    breadcrumbs = document.createElement('div')
    breadcrumbs.className = 'breadcrumbs text-sm'
    header.insertBefore(breadcrumbs, header.firstChild)
    if (breadcrumbsOutside) {
      return
    }
  }

  let ul = breadcrumbs.querySelector<HTMLUListElement>('ul')
  if (!ul) {
    ul = document.createElement('ul')
    breadcrumbs.append(ul)
  }

  clearChildren(ul)

  if (isHome) {
    const li = document.createElement('li')
    li.className = 'text-base-content/60'
    li.textContent = '首页'
    ul.append(li)
    return
  }

  const liHome = document.createElement('li')
  const a = document.createElement('a')
  a.href = '/'
  a.textContent = '首页'
  liHome.append(a)
  ul.append(liHome)

  const liTitle = document.createElement('li')
  liTitle.className = 'text-base-content/60'
  liTitle.textContent = pageTitle
  ul.append(liTitle)
}

function ensureControls(getSettings: GetSettings): void {
  const list = getListContainer()
  if (!list || list.children.length === 0) return

  list.dataset.libraPlusPostListSort = '1'

  const root =
    list.closest<HTMLElement>('section') || list.parentElement || list
  const existing = root.querySelector<HTMLElement>(
    '[data-libra-plus-sort="reply-time"]'
  )
  if (existing) {
    updateActiveButtons(existing)
    return
  }

  createSortControls(getSettings)
}

let modeRestored = false

function runInternal(getSettings: GetSettings): void {
  const settings = getSettings()
  if (!settings.enabled || !settings.postListSort) return

  if (!modeRestored && settings.rememberSortMode) {
    const stored = loadSortMode()
    if (stored) {
      sortState.mode = stored
    }

    modeRestored = true
  }

  ensureControls(getSettings)
  const list = getListContainer()
  if (!list || list.children.length === 0) return
  applySort(list)
}

export function runPostListSort(getSettings: GetSettings): void {
  runInternal(getSettings)
}

export function initPostListSort(getSettings: GetSettings): void {
  if (initialized) return
  initialized = true

  const run = () => {
    runInternal(getSettings)
  }

  const handleUrlChange = () => {
    const currentSettings = getSettings()
    if (currentSettings.rememberSortMode) {
      const stored = loadSortMode()
      sortState.mode = stored || 'default'
    } else {
      sortState.mode = 'default'
    }

    runInternal(getSettings)
  }

  const handleDomChange = () => {
    const list = getListContainer()
    if (!list || list.children.length === 0) return
    if (!hasUnindexedItems(list)) return
    runInternal(getSettings)
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        run()
      },
      { once: true }
    )
  } else {
    run()
  }

  onUrlChange(handleUrlChange)
  onDomChange(handleDomChange)
}
