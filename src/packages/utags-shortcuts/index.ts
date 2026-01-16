import styleText from 'css:./style.css'

import { addStyle, registerMenu, unregisterMenu } from '../../common/gm'
import { addValueChangeListener } from '../../common/gm/storage'
import { ensureShadowRoot } from '../../utils/dom'
import { setIcon } from '../../utils/icon'
import { isTopFrame } from '../../utils/is-top-frame'
import { navigateUrl } from '../../utils/navigate'
import { uid } from '../../utils/uid'
import { isSameOrigin } from '../../utils/url'
import { watchTitleChange } from '../../utils/watch-title'
import { openAddGroupModal } from './add-group-modal'
import {
  addCurrentPageLinkToGroup,
  hasDuplicateInGroup,
  pickLinkFromPageAndAdd,
} from './add-link-actions'
import { openAddLinkModal } from './add-link-modal'
import { initDiscourseSidebar } from './discourse-sidebar'
import { showDropdownMenu } from './dropdown'
import { openEditorModal } from './editor-modal-tabs'
import {
  checkAndEnableIframeMode,
  initIframeChild,
  isIframeModeDisabled,
  updateIframeLayout,
  updateIframeUrl,
} from './iframe-mode'
import {
  createUshortcutsSettingsStore,
  openSettingsPanel,
} from './settings-panel'
import {
  CONFIG_KEY,
  shortcutsStore,
  type ShortcutsConfig,
  type ShortcutsGroup,
  type ShortcutsItem,
} from './store'
import { type OpenMode } from './types'
import { isEditableTarget, resolveIcon, resolveTargetUrl } from './utils'
import { createVariableResolver } from './variables'

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

const EDGE_DEFAULT_WIDTH = 3
const EDGE_DEFAULT_HEIGHT = 60
const EDGE_DEFAULT_OPACITY = 0.6
const EDGE_DEFAULT_COLOR_LIGHT = '#1A73E8'
const EDGE_DEFAULT_COLOR_DARK = '#8AB4F8'
const EDGE_DEFAULT_HIDDEN = false
const POSITION_DEFAULT: Position = 'right-top'
const THEME_DEFAULT: 'light' | 'dark' | 'system' = 'system'
const PINNED_DEFAULT = false
const ENABLED_DEFAULT = true
const HOTKEY_DEFAULT = 'Alt+Shift+K'
const LAYOUT_DEFAULT: 'floating' | 'sidebar' = 'floating'
const SIDEBAR_SIDE_DEFAULT: 'left' | 'right' = 'right'

async function ensureGlobalStyles() {
  try {
    const existed = document.querySelector(
      'style[data-ushortcuts-style="sidebar"]'
    )
    if (existed) return

    const styleContent = `
html[data-utags-shortcuts-sidebar="left-open"] body { width: calc(100% - 360px) !important; margin-left: 360px !important; margin-right: 0 !important; }
html[data-utags-shortcuts-sidebar="right-open"] body { width: calc(100% - 360px) !important; margin-right: 360px !important; margin-left: 0 !important; }
`
    const style = await addStyle(styleContent)
    style.dataset.ushortcutsStyle = 'sidebar'
  } catch {}
}

void checkAndEnableIframeMode()
initIframeChild()
initDiscourseSidebar()

const store = createUshortcutsSettingsStore()
let settings: any = {}
let isIframeMode = false
let tempOpen = false
let tempClosed = false
let menuIds: any[] = []
let showAllGroups = false
let showHiddenGroups = false
let showHiddenItems = false
const editingGroups = new Set<string>()
const selectedItemsByGroup = new Map<string, Set<string>>()
let draggingItem: { groupId: string; itemId: string } | undefined
let lastDragTarget: Element | undefined
let lastDragPos: 'before' | 'after' | undefined
let hasSelectedVarInCurrentGroups = false

function matchPattern(url: string, pattern: string) {
  try {
    const t = String(pattern || '')
    if (t.startsWith('/') && t.lastIndexOf('/') > 0) {
      const last = t.lastIndexOf('/')
      const body = t.slice(1, last)
      const flags = t.slice(last + 1)
      const re = new RegExp(body, flags)
      // console.log('matchPattern', url, pattern, re)
      return re.test(url)
    }

    const esc: string = t
      .replaceAll(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replaceAll('*', '.*')
    const re = new RegExp('^' + esc + '$')
    // console.log('matchPattern', url, pattern, re)
    return re.test(url)
  } catch {
    return false
  }
}

function matchGroup(url: string, g: ShortcutsGroup) {
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

function openItem(
  it: ShortcutsItem,
  group: ShortcutsGroup,
  cfg: ShortcutsConfig,
  opts?: { forceNewTab?: boolean }
) {
  const mode: OpenMode = it.openIn || group.defaultOpen || settings.defaultOpen
  const resolver = createVariableResolver([
    group.variables,
    settings.siteVariables,
    settings.variables,
  ])

  const navigate = (url: string) => {
    if (isIframeMode) {
      try {
        if (isSameOrigin(url) && updateIframeUrl(url)) {
          return
        }
      } catch {}

      location.assign(url)
    } else {
      navigateUrl(url)
    }
  }

  if (it.type === 'url') {
    const url = resolveTargetUrl(it.data, resolver)
    const finalMode: OpenMode = opts?.forceNewTab ? 'new-tab' : mode
    if (finalMode === 'new-tab') {
      window.open(url, '_blank', 'noopener')
    } else {
      navigate(url)
    }

    return
  }

  try {
    const onMsg = (ev: MessageEvent) => {
      const d: any = (ev && (ev as any).data) || null
      if (
        d &&
        typeof d.__ushortcuts_err__ === 'string' &&
        d.__ushortcuts_err__
      ) {
        try {
          if (typeof (globalThis as any).alert === 'function') {
            ;(globalThis as any).alert(
              '脚本执行出错：' + String(d.__ushortcuts_err__)
            )
          } else {
            console.error('脚本执行出错：' + String(d.__ushortcuts_err__))
          }
        } catch {}

        return
      }

      const raw =
        d && typeof d.__ushortcuts_url__ === 'string'
          ? d.__ushortcuts_url__
          : ''
      if (!raw) return
      try {
        const url = resolveTargetUrl(raw)
        const overrideMode =
          d && typeof d.__ushortcuts_mode__ === 'string'
            ? (d.__ushortcuts_mode__ as OpenMode)
            : undefined
        const finalMode: OpenMode = opts?.forceNewTab
          ? 'new-tab'
          : overrideMode || mode
        if (finalMode === 'new-tab') window.open(url, '_blank', 'noopener')
        else navigate(url)
      } catch {}
    }

    window.addEventListener('message', onMsg, { once: true } as any)

    const s = document.createElement('script')
    const codeSrc = JSON.stringify(String(it.data || ''))
    s.textContent = `(async function(){try{var __code=${codeSrc};var __fn=new Function(__code);var __ret=__fn();if(__ret&&typeof __ret.then==='function'){__ret=await __ret;}var __url='';var __mode='';if(typeof __ret==='string'&&__ret.trim()){__url=__ret.trim();}else if(__ret&&typeof __ret==='object'){try{if(typeof __ret.error==='string'&&__ret.error){window.postMessage({__ushortcuts_err__:__ret.error},'*');return;}var __x=__ret.url||(__ret.href?String(__ret):'');if(typeof __x==='string'&&__x.trim()){__url=__x.trim();}var __m=__ret.mode; if(__m==='same-tab'||__m==='new-tab'){__mode=__m;} }catch{}}if(__url){window.postMessage({__ushortcuts_url__:__url,__ushortcuts_mode__:__mode},'*');}}catch(e){try{window.postMessage({__ushortcuts_err__:String(e&&(e.message||e))},'*');}catch{}}})()`
    ;(document.documentElement || document.body).append(s)
    s.remove()
  } catch {}
}

async function loadConfig(): Promise<ShortcutsConfig> {
  return shortcutsStore.load()
}

async function saveConfig(cfg: ShortcutsConfig) {
  return shortcutsStore.save(cfg)
}

function createRoot() {
  if (!isTopFrame()) {
    // Return a dummy root or handle this gracefully.
    // In iframe mode or any other iframe (ads, etc.), we don't want to render the shortcuts panel.
    // However, the caller expects { host, root }.
    // We can create a hidden host.
    const host = document.createElement('div')
    host.style.display = 'none'
    const root = host.attachShadow({ mode: 'open' })
    return { host, root }
  }

  const { host, root } = ensureShadowRoot({
    hostId: 'utags-shortcuts',
    hostDatasetKey: 'ushortcutsHost',
    style: styleText,
  })
  return { host, root }
}

function getNormalizedPos() {
  const pos = settings.position

  if (settings.layoutMode !== 'sidebar') return pos

  const sidebarSide = settings.sidebarSide || SIDEBAR_SIDE_DEFAULT
  const posParts = pos.split('-')
  if (posParts.length !== 2) return ''

  let [p1, p2] = posParts
  if (p1 === 'top' || p1 === 'bottom') {
    p2 = p1
    p1 = sidebarSide
  } else {
    // left-xxx or right-xxx
    p1 = sidebarSide
  }

  return p1 + '-' + p2
}

function place(el: HTMLElement, cfg: ShortcutsConfig) {
  el.style.position = 'fixed'
  el.style.inset = 'auto'

  switch (getNormalizedPos()) {
    case 'left-top': {
      el.style.top = '0'
      el.style.left = '0'
      break
    }

    case 'left-center': {
      el.style.top = '50%'
      el.style.left = '0'
      el.style.transform = 'translateY(-50%)'
      break
    }

    case 'left-bottom': {
      el.style.bottom = '0'
      el.style.left = '0'
      break
    }

    case 'right-center': {
      el.style.top = '50%'
      el.style.right = '0'
      el.style.transform = 'translateY(-50%)'
      break
    }

    case 'right-bottom': {
      el.style.bottom = '0'
      el.style.right = '0'
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

    // 'right-top' and other cases
    default: {
      el.style.top = '0'
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

function groupScore(url: string, g: ShortcutsGroup) {
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

function currentGroups(cfg: ShortcutsConfig) {
  if (showAllGroups) {
    return cfg.groups.filter((g) => showHiddenGroups || !g.hidden)
  }

  const url = location.href
  return cfg.groups
    .map((g) => ({ g, s: groupScore(url, g) }))
    .filter((x) => x.s >= 0 && !x.g.hidden)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.g)
}

function preserveScroll(panel: HTMLElement, cb: () => void) {
  const scroller = panel.querySelector('.panel-scroll') || panel
  const sx = scroller.scrollLeft
  const sy = scroller.scrollTop
  cb()
  const apply = () => {
    try {
      scroller.scrollLeft = sx
      scroller.scrollTop = sy
    } catch {}
  }

  apply()
  try {
    requestAnimationFrame(apply)
  } catch {}
}

function isDarkTheme(cfg: ShortcutsConfig) {
  const t = settings.theme || THEME_DEFAULT
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

function parseHotkeySpec(spec: string) {
  const s = String(spec || '').trim()
  if (!s) return null as any
  const parts = s.split('+').map((x) => x.trim().toLowerCase())
  let key = ''
  const need = { ctrl: false, meta: false, alt: false, shift: false }
  for (const p of parts) {
    switch (p) {
      case 'ctrl':
      case 'control': {
        need.ctrl = true
        break
      }

      case 'meta':
      case 'cmd':
      case 'command': {
        need.meta = true
        break
      }

      case 'alt':
      case 'option': {
        need.alt = true
        break
      }

      case 'shift': {
        need.shift = true
        break
      }

      default: {
        key = p
        break
      }
    }
  }

  if (!key) return null as any

  let code = ''
  if (key.length === 1) code = 'Key' + key.toUpperCase()
  else if (key === 'space') code = 'Space'
  else code = key
  return {
    ctrl: need.ctrl,
    meta: need.meta,
    alt: need.alt,
    shift: need.shift,
    code,
  }
}

function registerHotkeys(root: ShadowRoot, cfg: ShortcutsConfig) {
  const check = (
    e:
      | KeyboardEvent
      | {
          code: string
          ctrlKey: boolean
          metaKey: boolean
          altKey: boolean
          shiftKey: boolean
          preventDefault: () => void
        }
  ) => {
    const spec = settings.hotkey || HOTKEY_DEFAULT
    const p = parseHotkeySpec(spec)
    if (!p) return
    if (!(p.ctrl || p.meta || p.alt)) return
    const hasCtrl = Boolean(e.ctrlKey)
    const hasMeta = Boolean(e.metaKey)
    const hasAlt = Boolean(e.altKey)
    const hasShift = Boolean(e.shiftKey)
    if (p.ctrl !== hasCtrl) return
    if (p.meta !== hasMeta) return
    if (p.alt !== hasAlt) return
    if (p.shift !== hasShift) return
    if (e.code !== p.code) return
    e.preventDefault()
    const visible = Boolean(root.querySelector('.ushortcuts .panel'))
    if (visible) {
      collapseWithAnim(root, cfg)
    } else {
      tempOpen = true
      rerender(root, cfg)
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return
    if (isEditableTarget((e as any).target || undefined)) return
    check(e)
  })
}

function renderShortcutsItem(
  root: ShadowRoot,
  cfg: ShortcutsConfig,
  g: ShortcutsGroup,
  it: ShortcutsItem,
  section: Element,
  isEditing: boolean
) {
  const wrap = document.createElement('div')
  wrap.className = 'item-wrap'
  wrap.dataset.itemId = it.id
  wrap.classList.add('fade-in')
  if (it.hidden) wrap.classList.add('is-hidden')

  // Drag and Drop Reordering
  wrap.addEventListener('dragover', (e) => {
    if (draggingItem && draggingItem.groupId === g.id) {
      e.preventDefault()
      e.stopPropagation()

      if (lastDragTarget && lastDragTarget !== wrap) {
        lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
      }

      lastDragTarget = wrap

      const itemsContainer = wrap.closest('.items')
      let isGrid = itemsContainer?.classList.contains('layout-grid')
      if (itemsContainer?.classList.contains('mode-icon-only')) {
        const cols = (itemsContainer as HTMLElement).style.getPropertyValue(
          '--cols'
        )
        isGrid = cols !== '1'
      }

      const rect = wrap.getBoundingClientRect()

      const isSecondHalf = isGrid
        ? e.clientX - rect.left > rect.width / 2
        : e.clientY - rect.top > rect.height / 2

      lastDragPos = isSecondHalf ? 'after' : 'before'

      wrap.classList.toggle('drag-over-after', isSecondHalf)
      wrap.classList.toggle('drag-over-before', !isSecondHalf)
    }
  })

  wrap.addEventListener('dragleave', () => {
    // Keep the visual state until we enter another item or drop
  })

  wrap.addEventListener('drop', (e) => {
    if (draggingItem && draggingItem.groupId === g.id) {
      e.preventDefault()
      e.stopPropagation()

      const isAfter = wrap.classList.contains('drag-over-after')

      if (lastDragTarget) {
        lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
        lastDragTarget = undefined
      }

      lastDragPos = undefined

      wrap.classList.remove('drag-over-before', 'drag-over-after')

      const srcIndex = g.items.findIndex((i) => i.id === draggingItem!.itemId)
      let targetIndex = g.items.findIndex((i) => i.id === it.id)

      if (srcIndex !== -1 && targetIndex !== -1) {
        if (srcIndex === targetIndex) return

        // If dropped on the right/bottom half, insert after
        if (isAfter) {
          targetIndex++
        }

        // Adjust index because removing the item shifts subsequent items
        const insertIndex =
          srcIndex < targetIndex ? targetIndex - 1 : targetIndex

        if (srcIndex !== insertIndex) {
          const [movedItem] = g.items.splice(srcIndex, 1)
          g.items.splice(insertIndex, 0, movedItem)
          void saveConfig(cfg)
          rerender(root, cfg)
        }
      }
    }
  })

  const a = document.createElement('a')
  a.className = 'item'
  a.draggable = true
  a.addEventListener('dragstart', (e) => {
    draggingItem = { groupId: g.id, itemId: it.id }
    e.dataTransfer?.setData('text/plain', it.data)
    e.dataTransfer?.setData('text/uri-list', it.data)
  })
  a.addEventListener('dragend', () => {
    draggingItem = undefined
    if (lastDragTarget) {
      lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
      lastDragTarget = undefined
    }

    lastDragPos = undefined
  })

  if (isEditing) {
    a.href = '#'
    a.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopImmediatePropagation()
    })
  } else if (it.type === 'url') {
    const resolver = createVariableResolver([
      g.variables,
      settings.siteVariables,
      settings.variables,
    ])
    const url = resolveTargetUrl(it.data, resolver)
    // This is not the final URL, just for mouse over to show the full URL
    a.href = url

    // To calculate the variables in the URL template
    a.addEventListener('click', (e) => {
      e.preventDefault()
      const forceNew = Boolean(e.ctrlKey || e.metaKey)
      openItem(it, g, cfg, { forceNewTab: forceNew })
    })
    a.addEventListener('auxclick', (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault()
        openItem(it, g, cfg, { forceNewTab: true })
      }
    })
  } else {
    a.href = '#'
    a.addEventListener('click', (e) => {
      e.preventDefault()
      const forceNew = Boolean(e.ctrlKey || e.metaKey)
      openItem(it, g, cfg, { forceNewTab: forceNew })
    })
    a.addEventListener('auxclick', (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault()
        openItem(it, g, cfg, { forceNewTab: true })
      }
    })
  }

  {
    const resolver = createVariableResolver([
      g.variables,
      settings.siteVariables,
      settings.variables,
    ])
    const iconStr = resolveIcon(it.icon, it.type, it.data, {
      extraResolvers: resolver,
    })

    setIcon(a as HTMLElement, iconStr)
  }

  if (isEditing) {
    const set = selectedItemsByGroup.get(g.id) || new Set<string>()
    selectedItemsByGroup.set(g.id, set)
    const sel = document.createElement('input')
    sel.type = 'checkbox'
    sel.checked = set.has(it.id)
    const updateDeleteBtnState = () => {
      const btn = section.querySelector('.header-actions .btn.mini:last-child')
      if (btn instanceof HTMLButtonElement) {
        const count = selectedItemsByGroup.get(g.id)?.size || 0
        btn.disabled = !(count > 0)
      }
    }

    sel.addEventListener('change', () => {
      if (sel.checked) set.add(it.id)
      else set.delete(it.id)
      updateDeleteBtnState()
    })
    wrap.append(sel)
  }

  const t = document.createElement('span')
  t.textContent = it.name
  t.className = 'title-text'
  const style = g.displayStyle || 'icon-title'
  const isIconOnly = style === 'icon-only' && !isEditing
  if (isIconOnly) {
    // Add tooltip on hover if icon-only mode
    a.title = it.name
  }

  a.append(t)

  wrap.append(a)
  if (isEditing) {
    const editItemBtn = document.createElement('button')
    editItemBtn.className = 'icon-btn'
    setIcon(editItemBtn, 'lucide:edit-3', '编辑该导航')

    editItemBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      openAddLinkModal(root, cfg, {
        saveConfig(c) {
          void saveConfig(c)
        },
        rerender(r, c) {
          rerender(r, c)
        },
        defaultGroupId: g.id,
        existingItem: it,
      })
    })

    const hideBtn = document.createElement('button')
    hideBtn.className = 'icon-btn'
    if (it.hidden) {
      setIcon(hideBtn, 'lucide:eye', '显示该导航')
    } else {
      setIcon(hideBtn, 'lucide:eye-off', '隐藏该导航')
    }

    hideBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      it.hidden = !it.hidden
      void saveConfig(cfg)
      rerender(root, cfg)
    })

    wrap.append(editItemBtn)
    wrap.append(hideBtn)
  }

  return wrap
}

async function handleDropOnGroup(
  e: DragEvent,
  g: ShortcutsGroup,
  cfg: ShortcutsConfig,
  root: ShadowRoot,
  section: HTMLElement
) {
  e.preventDefault()
  section.classList.remove('drag-over')

  let url =
    e.dataTransfer?.getData('text/uri-list') ||
    e.dataTransfer?.getData('text/plain')
  if (url) {
    url = url.split('\n')[0].trim()
    try {
      url = decodeURI(url)
    } catch {
      /* empty */
    }
  }

  if (
    !url ||
    (!(url.startsWith('http://') || url.startsWith('https://')) &&
      !url.startsWith('/'))
  )
    return

  if (hasDuplicateInGroup(g, 'url', url)) {
    const ok = globalThis.confirm('该分组内已存在相同的 URL，是否继续添加？')
    if (!ok) return
  }

  let name = ''
  const html = e.dataTransfer?.getData('text/html')
  if (html) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const a = doc.querySelector('a')
      if (a && a.textContent) {
        name = a.textContent.trim()
      }
    } catch {}
  }

  if (!name) {
    try {
      const u = new URL(url)
      name = u.hostname
    } catch {
      name = 'New Link'
    }
  }

  const newItem: ShortcutsItem = {
    id: uid(),
    name: name || 'New Link',
    type: 'url',
    data: url,
    openIn: undefined,
    icon: 'favicon',
  }

  g.items.push(newItem)
  if (g.collapsed) g.collapsed = false

  await saveConfig(cfg)
  rerender(root, cfg)
}

function hasSelectedVar(text: string) {
  return /{selected(?:\|\|.*?)?}/.test(text)
}

function hasSelectedVarInGroups(groups: ShortcutsGroup[]) {
  for (const g of groups) {
    const isEditing = editingGroups.has(g.id)
    for (const it of g.items) {
      if (it.hidden && !showHiddenItems && !isEditing) continue
      const val = String(it.data || '')
      if (hasSelectedVar(val)) return true
    }
  }

  return false
}

function renderGroupSection(
  root: ShadowRoot,
  cfg: ShortcutsConfig,
  g: ShortcutsGroup,
  body: HTMLElement
) {
  const isEditing = editingGroups.has(g.id)
  const div = document.createElement('div')
  div.className = 'divider'
  body.append(div)

  const section = document.createElement('div')
  section.className = 'section'
  section.dataset.gid = g.id
  if (g.hidden) section.classList.add('is-hidden')

  section.addEventListener('dragover', (e) => {
    e.preventDefault()
    if (draggingItem && draggingItem.groupId === g.id) {
      if (lastDragTarget && section.contains(lastDragTarget)) {
        section.classList.remove('drag-over-append')
      } else {
        if (lastDragTarget) {
          lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
          lastDragTarget = undefined
          lastDragPos = undefined
        }

        section.classList.add('drag-over-append')
      }
    } else {
      section.classList.add('drag-over')
    }
  })
  section.addEventListener('dragleave', (e) => {
    if (section.contains(e.relatedTarget as Node)) return

    section.classList.remove('drag-over', 'drag-over-append')

    if (lastDragTarget && section.contains(lastDragTarget)) {
      lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
      lastDragTarget = undefined
      lastDragPos = undefined
    }
  })
  section.addEventListener('drop', (e) => {
    if (draggingItem && draggingItem.groupId === g.id) {
      if (lastDragTarget && section.contains(lastDragTarget)) {
        const targetId = (lastDragTarget as HTMLElement).dataset.itemId
        const targetIndex = g.items.findIndex((i) => i.id === targetId)
        const srcIndex = g.items.findIndex((i) => i.id === draggingItem!.itemId)

        if (srcIndex !== -1 && targetIndex !== -1) {
          lastDragTarget.classList.remove('drag-over-before', 'drag-over-after')
          lastDragTarget = undefined

          const insertIndex =
            lastDragPos === 'after' ? targetIndex + 1 : targetIndex
          const finalIndex =
            srcIndex < insertIndex ? insertIndex - 1 : insertIndex

          if (srcIndex !== finalIndex) {
            const [movedItem] = g.items.splice(srcIndex, 1)
            g.items.splice(finalIndex, 0, movedItem)
            void saveConfig(cfg)
            rerender(root, cfg)
          }
        }

        section.classList.remove('drag-over', 'drag-over-append')
        return
      }

      // Move to the end
      const srcIndex = g.items.findIndex((i) => i.id === draggingItem!.itemId)
      if (srcIndex !== -1 && srcIndex !== g.items.length - 1) {
        const [movedItem] = g.items.splice(srcIndex, 1)
        g.items.push(movedItem)
        void saveConfig(cfg)
        rerender(root, cfg)
      }

      section.classList.remove('drag-over', 'drag-over-append')
      return
    }

    void handleDropOnGroup(e, g, cfg, root, section)
  })

  const header = document.createElement('div')
  header.className = 'header'
  const title = document.createElement('div')
  title.className = 'title'
  setIcon(title, g.icon || 'lucide:folder')
  const nameSpan = document.createElement('span')
  nameSpan.className = 'title-text'
  nameSpan.textContent = (g as any).displayName || g.name
  title.append(nameSpan)
  header.append(title)

  title.addEventListener('click', () => {
    g.collapsed = !g.collapsed
    void saveConfig(cfg)
    const itemsDiv = section.querySelector('.items')
    if (itemsDiv)
      (itemsDiv as HTMLElement).style.display = g.collapsed ? 'none' : ''
    const btn = section.querySelector('.header .icon-btn.toggle')
    if (btn instanceof HTMLElement)
      setIcon(
        btn,
        g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down',
        g.collapsed ? '展开' : '折叠'
      )
  })
  const actions = document.createElement('div')
  actions.className = 'header-actions'
  const pos = getNormalizedPos()
  const editMenuRightSide = isRightSide(pos) || pos.endsWith('-right')
  const groupMenuRightSide = editMenuRightSide

  if (isEditing) {
    const exitBtn = document.createElement('button')
    exitBtn.className = 'btn mini'
    exitBtn.textContent = '退出编辑'
    exitBtn.addEventListener('click', () => {
      editingGroups.delete(g.id)
      selectedItemsByGroup.delete(g.id)
      rerender(root, cfg)
    })

    const delBtn = document.createElement('button')
    delBtn.className = 'btn mini'
    delBtn.textContent = '删除'
    {
      const count = selectedItemsByGroup.get(g.id)?.size || 0
      delBtn.disabled = !(count > 0)
    }

    delBtn.addEventListener('click', () => {
      const set = selectedItemsByGroup.get(g.id)
      if (!set || set.size === 0) return
      const ok = globalThis.confirm('是否删除所选导航项？')
      if (!ok) return
      const ids = new Set(Array.from(set))
      g.items = g.items.filter((x) => !ids.has(x.id))
      selectedItemsByGroup.delete(g.id)
      void saveConfig(cfg)
      rerender(root, cfg)
    })

    actions.append(exitBtn)
    actions.append(delBtn)
  } else {
    const addLinkBtn = document.createElement('button')
    addLinkBtn.className = 'icon-btn'
    setIcon(addLinkBtn, 'lucide:plus', '添加链接到此分组')
    addLinkBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      suppressCollapse = true
      showDropdownMenu(
        root,
        addLinkBtn,
        [
          {
            icon: 'lucide:keyboard',
            label: '手动输入',
            onClick() {
              openAddLinkModal(root, cfg, {
                saveConfig(c) {
                  void saveConfig(c)
                },
                rerender(r, c) {
                  rerender(r, c)
                },
                defaultGroupId: g.id,
              })
            },
          },
          {
            icon: 'lucide:globe',
            label: '添加当前网页',
            onClick() {
              addCurrentPageLinkToGroup(
                root,
                cfg,
                {
                  saveConfig(c) {
                    void saveConfig(c)
                  },
                  rerender(r, c) {
                    rerender(r, c)
                  },
                },
                g.id,
                undefined
              )
            },
          },
          {
            icon: 'lucide:link',
            label: '从当前网页采集链接',
            onClick() {
              pickLinkFromPageAndAdd(
                root,
                cfg,
                {
                  saveConfig(c) {
                    void saveConfig(c)
                  },
                  rerender(r, c) {
                    rerender(r, c)
                  },
                },
                g.id,
                undefined
              )
            },
          },
        ],
        {
          rightSide: groupMenuRightSide,
          onClose() {
            suppressCollapse = false
          },
        }
      )
    })

    const hideGroupBtn = document.createElement('button')
    hideGroupBtn.className = 'icon-btn'
    setIcon(
      hideGroupBtn,
      g.hidden ? 'lucide:eye' : 'lucide:eye-off',
      g.hidden ? '显示分组' : '隐藏分组'
    )
    hideGroupBtn.addEventListener('click', () => {
      g.hidden = !g.hidden
      void saveConfig(cfg)
      rerender(root, cfg)
    })

    const editBtn = document.createElement('button')
    editBtn.className = 'icon-btn'
    setIcon(editBtn, 'lucide:edit-3', '编辑')
    editBtn.addEventListener('click', (ev) => {
      ev.stopPropagation()
      suppressCollapse = true
      showDropdownMenu(
        root,
        editBtn,
        [
          {
            icon: 'lucide:edit-3',
            label: '编辑分组',
            onClick() {
              openAddGroupModal(root, cfg, {
                saveConfig(c) {
                  void saveConfig(c)
                },
                rerender(r, c) {
                  rerender(r, c)
                },
                defaultOpen: g.defaultOpen,
                defaultMatch: g.match,
                existingGroup: g,
              })
            },
          },
          {
            icon: 'lucide:list',
            label: '编辑导航项',
            onClick() {
              if (editingGroups.has(g.id)) editingGroups.delete(g.id)
              else editingGroups.add(g.id)
              rerender(root, cfg)
            },
          },
        ],
        {
          rightSide: editMenuRightSide,
          onClose() {
            suppressCollapse = false
          },
        }
      )
    })

    const toggleBtn = document.createElement('button')
    toggleBtn.className = 'icon-btn toggle'
    setIcon(
      toggleBtn,
      g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down',
      g.collapsed ? '展开' : '折叠'
    )
    toggleBtn.addEventListener('click', () => {
      g.collapsed = !g.collapsed
      void saveConfig(cfg)
      const itemsDiv = section.querySelector('.items')
      if (itemsDiv)
        (itemsDiv as HTMLDivElement).style.display = g.collapsed ? 'none' : ''
      setIcon(
        toggleBtn,
        g.collapsed ? 'lucide:chevron-right' : 'lucide:chevron-down',
        g.collapsed ? '展开' : '折叠'
      )
    })

    actions.append(addLinkBtn)
    actions.append(editBtn)
    actions.append(hideGroupBtn)
    actions.append(toggleBtn)
  }

  header.append(actions)
  section.append(header)

  const items = document.createElement('div')
  items.className = 'items'
  const style = g.displayStyle || 'icon-title'
  const isIconOnly = style === 'icon-only' && !isEditing
  const isTitleOnly = style === 'title-only' && !isEditing

  if (isIconOnly) {
    items.classList.add('mode-icon-only')
    if (g.iconSize) items.classList.add(`size-${g.iconSize}`)
    const iconCols = g.iconItemsPerRow || 0
    if (iconCols > 0) {
      items.classList.add('layout-grid')
      items.style.setProperty('--cols', String(iconCols))
      if (iconCols === 1) items.classList.add('cols-1')
    } else {
      items.classList.add('layout-auto')
    }
  } else {
    if (isTitleOnly) items.classList.add('mode-title-only')
    const cols = isEditing ? 1 : g.itemsPerRow || 1
    items.style.setProperty('--cols', String(cols))
    if (cols > 1) {
      items.classList.add('layout-grid')
    } else {
      items.classList.add('layout-list')
    }
  }

  items.style.display = g.collapsed ? 'none' : ''
  let visibleCount = 0
  const selectedText = (globalThis as any).__utags_shortcuts_selected_text__
  const isSelectionFiltering = Boolean(selectedText)

  for (const it of g.items) {
    if (it.hidden && !showHiddenItems && !isEditing) continue

    if (isSelectionFiltering) {
      const val = String(it.data || '')
      if (!hasSelectedVar(val)) continue
    }

    visibleCount++
    const wrap = renderShortcutsItem(root, cfg, g, it, section, isEditing)
    items.append(wrap)
  }

  if (!isIconOnly) {
    items.style.setProperty(
      '--cols',
      String(
        isEditing
          ? 1
          : Math.max(1, Math.min(g.itemsPerRow || 1, visibleCount || 1))
      )
    )
  }

  if (visibleCount === 0) {
    if (isSelectionFiltering) {
      section.style.display = 'none'
      div.style.display = 'none'
    } else {
      const msg = document.createElement('div')
      msg.className = 'empty-msg'
      msg.textContent = g.items.length === 0 ? '无项目' : '项目已被隐藏'
      items.append(msg)
    }
  }

  section.append(items)
  section.classList.add('fade-in')
  body.append(section)
}

function renderPanelHeader(
  root: ShadowRoot,
  cfg: ShortcutsConfig,
  panel: HTMLElement
) {
  const collapseRow = document.createElement('div')
  collapseRow.className = 'header'
  const leftActions = document.createElement('div')
  leftActions.className = 'panel-actions-left'
  const rightActions = document.createElement('div')
  rightActions.className = 'panel-actions'

  const closeBtn = document.createElement('button')
  closeBtn.className = 'collapse-btn'
  setIcon(closeBtn, 'lucide:x', '关闭')
  closeBtn.addEventListener('click', () => {
    collapseWithAnim(root, cfg)
  })

  const plusBtn = document.createElement('button')
  plusBtn.className = 'icon-btn'
  setIcon(plusBtn, 'lucide:plus', '添加')
  plusBtn.addEventListener('click', (ev) => {
    ev.stopPropagation()
    openQuickAddMenu(root, cfg, plusBtn)
  })

  const showAllBtn = document.createElement('button')
  showAllBtn.className = 'icon-btn'
  setIcon(showAllBtn, 'lucide:layout-dashboard', '显示全部')
  showAllBtn.classList.toggle('active', Boolean(showAllGroups))
  showAllBtn.addEventListener('click', () => {
    showAllGroups = !showAllGroups
    showAllBtn.classList.toggle('active', Boolean(showAllGroups))
    rerender(root, cfg)
  })

  const settingsBtn = document.createElement('button')
  settingsBtn.className = 'icon-btn'
  setIcon(settingsBtn, 'lucide:settings', '设置')
  settingsBtn.addEventListener('click', () => {
    // openEditor(root, cfg)
    openSettingsPanel(store)
  })

  const pinBtn = document.createElement('button')
  pinBtn.className = 'icon-btn'
  setIcon(
    pinBtn,
    settings.pinned ? 'lucide:pin' : 'lucide:pin-off',
    settings.pinned ? '取消固定' : '固定显示'
  )
  pinBtn.classList.toggle('active', Boolean(settings.pinned))
  pinBtn.addEventListener('click', () => {
    void store.set({ pinned: !settings.pinned })
  })

  rightActions.append(plusBtn)
  rightActions.append(showAllBtn)
  if (showAllGroups) {
    const showHiddenGroupsLabel = document.createElement('label')
    showHiddenGroupsLabel.className = 'check'
    const showHiddenGroupsCb = document.createElement('input')
    showHiddenGroupsCb.type = 'checkbox'
    showHiddenGroupsCb.checked = Boolean(showHiddenGroups)
    const showHiddenGroupsSpan = document.createElement('span')
    showHiddenGroupsSpan.textContent = '显示隐藏的分组'
    showHiddenGroupsLabel.append(showHiddenGroupsCb)
    showHiddenGroupsLabel.append(showHiddenGroupsSpan)
    showHiddenGroupsCb.addEventListener('change', () => {
      showHiddenGroups = Boolean(showHiddenGroupsCb.checked)
      rerender(root, cfg)
    })

    const showHiddenItemsLabel = document.createElement('label')
    showHiddenItemsLabel.className = 'check'
    const showHiddenItemsCb = document.createElement('input')
    showHiddenItemsCb.type = 'checkbox'
    showHiddenItemsCb.checked = Boolean(showHiddenItems)
    const showHiddenItemsSpan = document.createElement('span')
    showHiddenItemsSpan.textContent = '显示隐藏的导航'
    showHiddenItemsLabel.append(showHiddenItemsCb)
    showHiddenItemsLabel.append(showHiddenItemsSpan)
    showHiddenItemsCb.addEventListener('change', () => {
      showHiddenItems = Boolean(showHiddenItemsCb.checked)
      rerender(root, cfg)
    })

    const expandAllBtn = document.createElement('button')
    expandAllBtn.className = 'btn mini'
    expandAllBtn.textContent = '展开所有分组'
    expandAllBtn.addEventListener('click', () => {
      preserveScroll(panel, () => {
        for (const g of cfg.groups) g.collapsed = false
        void saveConfig(cfg)
        for (const sec of Array.from(
          panel.querySelectorAll<HTMLElement>('.section')
        )) {
          const itemsDiv = sec.querySelector<HTMLDivElement>('.items')
          if (itemsDiv) itemsDiv.style.display = ''
          const gid = sec.dataset.gid
          const grp = cfg.groups.find((x) => x.id === gid)
          const btn = sec.querySelector<HTMLButtonElement>(
            '.header .icon-btn:nth-last-child(1)'
          )
          if (grp && btn) setIcon(btn, 'lucide:chevron-down', '折叠')
        }
      })
    })

    const collapseAllBtn = document.createElement('button')
    collapseAllBtn.className = 'btn mini'
    collapseAllBtn.textContent = '折叠所有分组'
    collapseAllBtn.addEventListener('click', () => {
      preserveScroll(panel, () => {
        for (const g of cfg.groups) g.collapsed = true
        void saveConfig(cfg)
        for (const sec of Array.from(
          panel.querySelectorAll<HTMLElement>('.section')
        )) {
          const itemsDiv = sec.querySelector<HTMLDivElement>('.items')
          if (itemsDiv) itemsDiv.style.display = 'none'
          const gid = sec.dataset.gid
          const grp = cfg.groups.find((x) => x.id === gid)
          const btn = sec.querySelector<HTMLButtonElement>(
            '.header .icon-btn:nth-last-child(1)'
          )
          if (grp && btn) setIcon(btn, 'lucide:chevron-right', '展开')
        }
      })
    })

    const manageGroupsBtn = document.createElement('button')
    manageGroupsBtn.className = 'btn mini'
    manageGroupsBtn.textContent = '管理分组'
    manageGroupsBtn.addEventListener('click', () => {
      openEditorModal(root, cfg, {
        saveConfig(c) {
          void saveConfig(c)
        },
        rerender(r, c) {
          rerender(r, c)
        },
        updateThemeUI,
        edgeDefaults: {
          width: EDGE_DEFAULT_WIDTH,
          height: EDGE_DEFAULT_HEIGHT,
          opacity: EDGE_DEFAULT_OPACITY,
          colorLight: EDGE_DEFAULT_COLOR_LIGHT,
          colorDark: EDGE_DEFAULT_COLOR_DARK,
        },
        tempOpenGetter: () => tempOpen,
      })
    })

    rightActions.append(showHiddenGroupsLabel)
    rightActions.append(showHiddenItemsLabel)
    rightActions.append(expandAllBtn)
    rightActions.append(collapseAllBtn)
    rightActions.append(manageGroupsBtn)
  }

  rightActions.append(settingsBtn)
  if ((settings.layoutMode || LAYOUT_DEFAULT) !== 'sidebar')
    rightActions.append(pinBtn)
  rightActions.append(closeBtn)

  collapseRow.append(leftActions)
  collapseRow.append(rightActions)
  panel.append(collapseRow)

  let body: HTMLElement = panel
  if (showAllGroups) {
    panel.classList.add('all-mode')
    const scroller = document.createElement('div')
    scroller.className = 'panel-scroll'
    const columns = document.createElement('div')
    columns.className = 'panel-columns'
    scroller.append(columns)
    panel.append(scroller)
    body = columns
  } else {
    panel.classList.remove('all-mode')
  }

  return body
}

function renderPanel(root: ShadowRoot, cfg: ShortcutsConfig, animIn: boolean) {
  const wrapper = document.createElement('div')
  wrapper.className = 'ushortcuts' + (isDarkTheme(cfg) ? ' dark' : '')
  const panel = document.createElement('div')
  panel.className = 'panel'
  if (
    settings.panelBackgroundColor &&
    settings.panelBackgroundColor !== 'default'
  ) {
    panel.style.backgroundColor = settings.panelBackgroundColor
  }

  if (settings.layoutMode === 'sidebar') {
    try {
      panel.style.height = '100vh'
      panel.style.borderRadius = '0'
    } catch {}

    try {
      const side =
        (settings.sidebarSide || SIDEBAR_SIDE_DEFAULT) === 'left'
          ? 'sidebar-left'
          : 'sidebar-right'
      panel.classList.add('sidebar', side)
    } catch {}
  }

  const pos = getNormalizedPos()
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

  const body = renderPanelHeader(root, cfg, panel)

  const groupsToShow = currentGroups(cfg)
  hasSelectedVarInCurrentGroups = hasSelectedVarInGroups(groupsToShow)

  for (const g of groupsToShow) renderGroupSection(root, cfg, g, body)

  wrapper.append(panel)
  wrapper.addEventListener('mouseenter', () => {
    try {
      if (collapseTimer) clearTimeout(collapseTimer)
    } catch {}
  })
  wrapper.addEventListener('mouseleave', (e) => {
    // If relatedTarget is null, the mouse has left the window (or moved to a UI part that doesn't trigger events, like scrollbar).
    // In this case, we keep the panel expanded as per user request.
    if (!e.relatedTarget || e.relatedTarget === document.documentElement) return

    const pinnedFlag =
      (settings.layoutMode || LAYOUT_DEFAULT) === 'sidebar'
        ? true
        : Boolean(settings.pinned)
    if (!pinnedFlag && !suppressCollapse) scheduleAutoCollapse(root, cfg)
  })
  place(wrapper, cfg)
  return wrapper
}

function openEditor(root: ShadowRoot, cfg: ShortcutsConfig) {
  openEditorModal(root, cfg, {
    saveConfig(c) {
      void saveConfig(c)
    },
    rerender(r, c) {
      rerender(r, c)
    },
    updateThemeUI,
    edgeDefaults: {
      width: EDGE_DEFAULT_WIDTH,
      height: EDGE_DEFAULT_HEIGHT,
      opacity: EDGE_DEFAULT_OPACITY,
      colorLight: EDGE_DEFAULT_COLOR_LIGHT,
      colorDark: EDGE_DEFAULT_COLOR_DARK,
    },
    tempOpenGetter: () => tempOpen,
  })
}

function openQuickAddMenu(
  root: ShadowRoot,
  cfg: ShortcutsConfig,
  anchor: HTMLElement
) {
  suppressCollapse = true
  tempOpen = true
  const pos = getNormalizedPos()
  const rightSide = isRightSide(pos) || pos.endsWith('-right')
  showDropdownMenu(
    root,
    anchor,
    [
      {
        icon: 'lucide:folder',
        label: '添加分组',
        onClick() {
          openAddGroupModal(root, cfg, {
            saveConfig(c) {
              void saveConfig(c)
            },
            rerender(r, c) {
              rerender(r, c)
            },
            defaultOpen: undefined,
            defaultMatch: ['*://' + (location.hostname || '') + '/*'],
          })
        },
      },
      {
        icon: 'lucide:link',
        label: '添加链接',
        onClick() {
          const matched = currentGroups(cfg)
          openAddLinkModal(root, cfg, {
            saveConfig(c) {
              void saveConfig(c)
            },
            rerender(r, c) {
              rerender(r, c)
            },
            defaultGroupId: (matched[0] || cfg.groups[0])?.id,
          })
        },
      },
    ],
    {
      rightSide,
      onClose() {
        suppressCollapse = false
      },
    }
  )
}

let lastCollapsed = true
let suppressCollapse = false
let pendingUpdate = false

function rerender(root: ShadowRoot, cfg: ShortcutsConfig) {
  if (document.visibilityState !== 'visible') {
    pendingUpdate = true
    return
  }

  pendingUpdate = false

  suppressCollapse = true
  let sx = 0
  let sy = 0
  try {
    const cur =
      root.querySelector<HTMLDivElement>('.ushortcuts .panel-scroll') ||
      root.querySelector<HTMLDivElement>('.ushortcuts .panel')
    if (cur) {
      sx = cur.scrollLeft
      sy = cur.scrollTop
    }
  } catch {}

  const nextNodes: Node[] = []

  if (settings.enabled === false) {
    lastCollapsed = true
    suppressCollapse = false
    try {
      if (isIframeMode) {
        updateIframeLayout(false)
      }

      delete (document.documentElement as any).dataset.utagsShortcutsSidebar
    } catch {}
  } else {
    let isCollapsed = !tempOpen && (tempClosed || !settings.pinned)
    if ((settings.layoutMode || LAYOUT_DEFAULT) === 'sidebar')
      isCollapsed = !tempOpen && Boolean(tempClosed)

    if (isCollapsed) {
      const effectiveEdgeHidden =
        // (settings.layoutMode || LAYOUT_DEFAULT) === 'sidebar'
        //   ? true
        // :
        Boolean(settings.edgeHidden)
      if (!effectiveEdgeHidden) {
        const tab = document.createElement('div')
        tab.className = 'collapsed-tab'
        place(tab, cfg)
        try {
          const gw = settings.edgeWidth ?? EDGE_DEFAULT_WIDTH
          const gh = settings.edgeHeight ?? EDGE_DEFAULT_HEIGHT
          const go = settings.edgeOpacity ?? EDGE_DEFAULT_OPACITY
          const horiz = isHorizontalPos(getNormalizedPos())
          const thickness = Math.max(1, Math.min(24, gw))
          const length = Math.max(24, Math.min(320, gh))
          tab.style.width = horiz ? `${length}px` : `${thickness}px`
          tab.style.height = horiz ? `${thickness}px` : `${length}px`
          tab.style.opacity = String(Math.max(0, Math.min(1, go)))
          tab.style.backgroundColor = isDarkTheme(cfg)
            ? String(settings.edgeColorDark || EDGE_DEFAULT_COLOR_DARK)
            : String(settings.edgeColorLight || EDGE_DEFAULT_COLOR_LIGHT)
        } catch {}

        tab.addEventListener('mouseenter', () => {
          tempOpen = true
          rerender(root, cfg)
        })
        nextNodes.push(tab)
      }

      lastCollapsed = true
      suppressCollapse = false

      // Check if there is any shortcuts which contains the `{selected}` variable in the current groups
      const groupsToShow = currentGroups(cfg)
      hasSelectedVarInCurrentGroups = hasSelectedVarInGroups(groupsToShow)

      try {
        if (isIframeMode) {
          updateIframeLayout(false)
        }

        delete (document.documentElement as any).dataset.utagsShortcutsSidebar
      } catch {}
    } else {
      nextNodes.push(renderPanel(root, cfg, lastCollapsed))
      updateSidebarClass()
      lastCollapsed = false
      suppressCollapse = false
    }
  }

  const toRemove = Array.from(
    root.querySelectorAll('.ushortcuts,.collapsed-tab,.quick-add-menu')
  )

  if (nextNodes.length > 0) {
    const firstChild = root.firstElementChild
    // Insert nextNodes before the first element for two purposes:
    // 1. Ensure insertion before the .modal-mask element to prevent the panel from displaying on top of the mask.
    // 2. Insert before the previously rendered panel elements (which share the same z-index) to ensure the old elements remain on top. We then delay their removal to prevent page jitter.
    if (firstChild) {
      for (const n of nextNodes) firstChild.before(n)
    } else {
      root.append(...nextNodes)
    }
  }

  setTimeout(() => {
    for (const n of toRemove) n.remove()
  }, 100)

  if (!lastCollapsed) {
    try {
      const cur =
        root.querySelector<HTMLDivElement>('.ushortcuts .panel-scroll') ||
        root.querySelector<HTMLDivElement>('.ushortcuts .panel')
      if (cur) {
        cur.scrollLeft = sx
        cur.scrollTop = sy
        try {
          requestAnimationFrame(() => {
            cur.scrollLeft = sx
            cur.scrollTop = sy
          })
        } catch {}
      }
    } catch {}
  }
}

function initEdgeExpand(root: ShadowRoot, cfg: ShortcutsConfig) {
  let lastOpen = 0
  document.addEventListener('mousemove', (e) => {
    const now = Date.now()
    if (now - lastOpen < 500) return
    const w = window.innerWidth
    const nearLeft = e.clientX < 6
    const nearRight = e.clientX > w - 6
    const pref = settings
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

function registerMenus(root: ShadowRoot, cfg: ShortcutsConfig) {
  try {
    for (const id of menuIds) {
      try {
        unregisterMenu(id)
      } catch {}
    }

    menuIds = []

    const text = settings.enabled
      ? '🚫 禁用当前网站快捷导航'
      : '✅ 启用当前网站快捷导航'

    menuIds.push(
      registerMenu('🧭 打开快捷导航面板', () => {
        if (settings.enabled === false) {
          const ok = globalThis.confirm('当前网站已禁用，是否启用并打开面板？')
          if (ok) {
            void store.set({ enabled: true })
            tempOpen = true
          }

          return
        }

        tempOpen = true
        rerender(root, cfg)
      }),
      registerMenu('⚙️ 设置', () => {
        openSettingsPanel(store)
      }),
      registerMenu(text, () => {
        void store.set({ enabled: !settings.enabled })
      })
    )
  } catch {}
}

function registerStorageListener(root: ShadowRoot, cfg: ShortcutsConfig) {
  try {
    void addValueChangeListener(
      CONFIG_KEY,
      (_name: string, _old: string, nv: string, remote: boolean) => {
        try {
          const obj = JSON.parse(nv)
          if (obj && obj.groups) {
            cfg.groups = obj.groups
            rerender(root, cfg)
          }
        } catch {}
      }
    )
  } catch {}
}

let collapseTimer: number | undefined
function scheduleAutoCollapse(root: ShadowRoot, cfg: ShortcutsConfig) {
  if (collapseTimer) clearTimeout(collapseTimer)
  collapseTimer = setTimeout(() => {
    collapseWithAnim(root, cfg)
  }, 10) as unknown as number
}

function collapseWithAnim(root: ShadowRoot, cfg: ShortcutsConfig) {
  try {
    const p = getNormalizedPos()
    const sel = root.querySelector('.ushortcuts .panel')
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

function updateThemeUI(root: ShadowRoot, cfg: ShortcutsConfig) {
  const wrapper = root.querySelector('.ushortcuts')
  if (!wrapper) return
  wrapper.classList.toggle('dark', isDarkTheme(cfg))
  const curTheme = settings.theme || THEME_DEFAULT
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

function registerUrlChangeListener(root: ShadowRoot, cfg: ShortcutsConfig) {
  let last = location.href
  function onChange() {
    const now = location.href
    if (now === last) return
    last = now
    rerender(root, cfg)
  }

  // Debounced rerender for title and selection changes
  let rerenderTimer: any = null
  function scheduleRerender() {
    if (rerenderTimer) clearTimeout(rerenderTimer)
    rerenderTimer = setTimeout(() => {
      rerender(root, cfg)
    }, 200)
  }

  let lastTitle = document.title.trim()
  // Watch for title changes
  watchTitleChange(() => {
    const currentTitle = document.title.trim()
    if (currentTitle === lastTitle) return
    lastTitle = currentTitle
    scheduleRerender()
  })

  let lastSelectedText = ''
  // Watch for selection changes
  document.addEventListener('selectionchange', () => {
    const selection = document.getSelection()
    if (!selection) return
    const anchorNode = selection.anchorNode
    // Ignore selection changes inside the shortcuts panel
    if (anchorNode && anchorNode instanceof HTMLHtmlElement) {
      return
    }

    let text = (selection || '').toString().trim()
    if (!hasSelectedVarInCurrentGroups) {
      text = ''
    }

    if (text === lastSelectedText) return
    lastSelectedText = text
    ;(globalThis as any).__utags_shortcuts_selected_text__ = text
    scheduleRerender()
  })

  // Watch for iframe selection changes
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'USHORTCUTS_SELECTION_CHANGE') {
      let text = (e.data.text || '').trim()
      if (!hasSelectedVarInCurrentGroups) {
        text = ''
      }

      if (text === lastSelectedText) return
      lastSelectedText = text
      ;(globalThis as any).__utags_shortcuts_selected_text__ = text
      scheduleRerender()
    }
  })

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

function updateSidebarClass() {
  if (isIframeMode) {
    updateIframeLayout(
      settings.enabled !== false && settings.layoutMode === 'sidebar'
    )
    return
  }

  try {
    if (settings.enabled !== false && settings.layoutMode === 'sidebar') {
      void ensureGlobalStyles()
      document.documentElement.dataset.utagsShortcutsSidebar =
        (settings.sidebarSide || SIDEBAR_SIDE_DEFAULT) === 'left'
          ? 'left-open'
          : 'right-open'
    } else {
      delete (document.documentElement as any).dataset.utagsShortcutsSidebar
    }
  } catch {}
}

function registerHostAutofix(_root: ShadowRoot, cfg: ShortcutsConfig) {
  try {
    const mo = new MutationObserver(() => {
      const existing = document.querySelector(
        '[data-ushortcuts-host="utags-shortcuts"]'
      )
      if (!(existing instanceof HTMLElement)) {
        try {
          const host = (_root as any)?.host as HTMLElement | undefined
          if (host) {
            // Some websites will remove the host element from the DOM
            // when document.body loads. (2libra.com)
            // We need to add it back to the DOM.
            if (!document.documentElement.contains(host)) {
              document.documentElement.append(host)
            }

            updateSidebarClass()
            return
          }
        } catch {}

        const { root: newRoot } = createRoot()
        rerender(newRoot, cfg)
      }
    })
    mo.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    })
  } catch {}
}

function main() {
  try {
    const de = document.documentElement as any
    if (!de || de.tagName !== 'HTML') return
    if (de.dataset && de.dataset.utagsShortcuts === '1') return
    if (de.dataset) de.dataset.utagsShortcuts = '1'
  } catch {}

  if (!isTopFrame()) {
    // Notify top frame about selection changes in iframes
    let timer: any
    document.addEventListener('selectionchange', () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const text = (document.getSelection() || '').toString()
        window.top?.postMessage(
          { type: 'USHORTCUTS_SELECTION_CHANGE', text },
          '*'
        )
      }, 200)
    })
    return
  }

  const { root } = createRoot()
  void (async () => {
    const cfg = await loadConfig()
    settings = await store.getAll()
    isIframeMode =
      settings.layoutMode === 'sidebar' &&
      settings.sidebarUseIframe &&
      !isIframeModeDisabled()

    const updateState = () => {
      rerender(root, cfg)
      registerMenus(root, cfg)
      updateSidebarClass()
    }

    store.onChange(async () => {
      settings = await store.getAll()
      isIframeMode =
        settings.layoutMode === 'sidebar' &&
        settings.sidebarUseIframe &&
        !isIframeModeDisabled()
      updateState()
    })

    void ensureGlobalStyles()
    registerHostAutofix(root, cfg)
    registerHotkeys(root, cfg)
    registerStorageListener(root, cfg)
    registerUrlChangeListener(root, cfg)

    try {
      const mq = globalThis.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', () => {
        if ((settings.theme || 'system') === 'system') rerender(root, cfg)
      })
    } catch {}

    try {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && pendingUpdate) {
          rerender(root, cfg)
        }
      })
    } catch {}

    // initEdgeExpand(root, cfg)
    updateState()
  })()
}

main()
