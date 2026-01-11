import styleText from 'css:./style.css'

import { c } from '../../utils/c'
import { ensureShadowRoot } from '../../utils/dom'
import { isTopFrame } from '../../utils/is-top-frame'
import { normalizeToDefaultType, setOrDelete } from '../../utils/obj'
import { addValueChangeListener, getValue, setValue } from '../gm/storage'

export type FieldOption = { value: string; label: string }
type FieldToggle = {
  type: 'toggle'
  key: string
  label: string
  help?: string
  renderHelp?: (el: HTMLElement) => void
  isSitePref?: boolean
}
type FieldInput = {
  type: 'input'
  key: string
  label: string
  placeholder?: string
  help?: string
  isSitePref?: boolean
}
type FieldColors = {
  type: 'colors'
  key: string
  label: string
  options: Array<{ value: string }>
  help?: string
  isSitePref?: boolean
}
type FieldTextarea = {
  type: 'textarea'
  key: string
  label: string
  rows?: number
  help?: string
  isSitePref?: boolean
}
type FieldRadio = {
  type: 'radio'
  key: string
  label: string
  options: FieldOption[]
  help?: string
  isSitePref?: boolean
}
type FieldSelect = {
  type: 'select'
  key: string
  label: string
  options: FieldOption[]
  help?: string
  isSitePref?: boolean
}
type FieldAction = {
  type: 'action'
  key: string
  label: string
  actions: Array<{ id: string; text: string; kind?: 'danger' }>
  help?: string
  renderHelp?: (el: HTMLElement) => void
  isSitePref?: boolean
  layout?: 'vertical'
}
export type FieldCustom = {
  type: 'custom'
  key: string
  label?: string
  render: (
    container: HTMLElement,
    options: {
      key: string
      isSitePref?: boolean
      onChange: (val: unknown) => void
    }
  ) => { update: (val: unknown) => void }
  isSitePref?: boolean
  help?: string
}
export type FieldHelp = {
  type: 'help'
  help: string
}
export type Field =
  | FieldToggle
  | FieldInput
  | FieldTextarea
  | FieldRadio
  | FieldSelect
  | FieldColors
  | FieldAction
  | FieldCustom
  | FieldHelp

export type Group = { id: string; title: string; fields: Field[] }
export type Tab =
  | { id: string; title: string; fields: Field[] }
  | { id: string; title: string; groups: Group[] }
export type PanelSchema =
  | { type: 'simple'; title: string; fields: Field[] }
  | { type: 'simple'; title: string; groups: Group[] }
  | { type: 'tabs'; title: string; tabs: Tab[] }

export type Store = {
  onChange: (
    cb: (e: {
      key: string
      oldValue: unknown
      newValue: unknown
      remote: boolean
    }) => void
  ) => void
  get<T = unknown>(key: string, isGlobalPref?: boolean): Promise<T>
  getAll<T extends Record<string, unknown> = Record<string, unknown>>(
    isGlobalPref?: boolean
  ): Promise<T>
  /**
   * Set settings values.
   * @param args - Arguments for setting values.
   * If the last argument is a boolean, it indicates whether to set global preferences (isGlobalPref).
   */
  set(
    ...args:
      | [string, unknown]
      | [string, unknown, boolean]
      | [Record<string, unknown>]
      | [Record<string, unknown>, boolean]
  ): Promise<void>
  reset(isGlobalPref?: boolean): Promise<void>
  defaults(): Record<string, unknown>
  onBeforeSet(
    cb: (
      values: Record<string, unknown>,
      isGlobalPref: boolean
    ) => Promise<Record<string, unknown>> | Record<string, unknown>
  ): void
}

function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item) && typeof item === 'object'
}

type PanelOptions = {
  hostDatasetKey?: string
  hostDatasetValue?: string
  theme?: {
    activeBg?: string
    activeFg?: string
    colorRing?: string
    toggleOnBg?: string
  }
  issuesUrl?: string
  styleText?: string
  onAction?: (info: {
    key: string
    actionId: string
    target: HTMLElement
  }) => void
}

let currentHost: HTMLDivElement | undefined

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeSettingsPanel()
  }
}

export function closeSettingsPanel(): void {
  try {
    currentHost?.remove()
  } catch {}

  try {
    globalThis.removeEventListener('keydown', onKeyDown, true)
  } catch {}

  currentHost = undefined
}

type BaseFieldRowOptions = {
  label: string
  key: string
  help?: string
  renderHelp?: (el: HTMLElement) => void
  isSitePref?: boolean
}

function createFieldRow(
  opts: BaseFieldRowOptions,
  content: HTMLElement | HTMLElement[]
) {
  const row = c('div', { className: 'row', dataset: { key: opts.key } })
  const labWrap = c('div', { className: 'label-wrap' })
  const lab = c('label', { text: opts.label })
  labWrap.append(lab)

  if (opts.help) {
    labWrap.append(c('div', { className: 'field-help', text: opts.help }))
  } else if (opts.renderHelp) {
    const helpEl = c('div', { className: 'field-help' })
    opts.renderHelp(helpEl)
    labWrap.append(helpEl)
  }

  const val = c('div', { className: 'value-wrap' })
  if (Array.isArray(content)) {
    val.append(...content)
  } else {
    val.append(content)
  }

  row.append(labWrap)
  row.append(val)
  return row
}

function createToggleRow(opts: BaseFieldRowOptions) {
  const seg = c('div', { className: 'toggle-wrap' })
  const chk = c('input', {
    type: 'checkbox',
    className: 'toggle-checkbox',
    dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
  })
  seg.append(chk)
  const row = createFieldRow(opts, seg)
  return { row, chk }
}

function createInputRow(opts: BaseFieldRowOptions & { placeholder?: string }) {
  const inp = c('input', {
    type: 'text',
    placeholder: opts.placeholder || '',
    dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
  })
  const row = createFieldRow(opts, inp)
  return { row, inp }
}

function createTextareaRow(opts: BaseFieldRowOptions & { rows?: number }) {
  const ta = c('textarea', {
    rows: opts.rows || 4,
    dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
  })
  const row = createFieldRow(opts, ta)
  return { row, ta }
}

function createRadioRow(
  opts: BaseFieldRowOptions & { options: FieldOption[] }
) {
  const seg = c('div', { className: 'seg' })
  for (const o of opts.options) {
    const b = c('button', {
      className: 'seg-btn',
      dataset: {
        key: opts.key,
        value: o.value,
        isSitePref: opts.isSitePref ? '1' : '',
      },
      text: o.label,
    })
    seg.append(b)
  }

  const row = createFieldRow(opts, seg)
  return { row, seg }
}

function createColorRow(
  opts: BaseFieldRowOptions & { options: Array<{ value: string }> }
) {
  const seg = c('div', { className: 'color-row' })
  for (const o of opts.options) {
    const b = c('button', {
      className: 'color-swatch',
      dataset: {
        key: opts.key,
        value: o.value,
        isSitePref: opts.isSitePref ? '1' : '',
      },
      style: { backgroundColor: o.value },
    })
    seg.append(b)
  }

  const row = createFieldRow(opts, seg)
  return { row, seg }
}

function createSelectRow(
  opts: BaseFieldRowOptions & { options: FieldOption[] }
) {
  const sel = c('select', {
    dataset: { key: opts.key, isSitePref: opts.isSitePref ? '1' : '' },
  })
  for (const o of opts.options) {
    const opt = c('option', { value: o.value, text: o.label })
    sel.append(opt)
  }

  const row = createFieldRow(opts, sel)
  return { row, sel }
}

function createActionRow(
  opts: BaseFieldRowOptions & {
    actions: Array<{ id: string; text: string; kind?: 'danger' }>
    layout?: 'vertical'
  }
) {
  const act = c('div', {
    className: `seg${opts.layout === 'vertical' ? ' vertical' : ''}`,
  })
  for (const a of opts.actions) {
    const b = c('button', {
      className: `btn action-btn${a.kind === 'danger' ? ' btn-danger' : ''}`,
      dataset: { key: opts.key, action: a.id },
      text: a.text,
    })
    act.append(b)
  }

  const row = createFieldRow(opts, act)
  return { row }
}

export function openSettingsPanel(
  schema: PanelSchema,
  store: Store,
  options?: PanelOptions
): void {
  if (!isTopFrame()) {
    return
  }

  const { host, root, existed } = ensureShadowRoot({
    hostId: options?.hostDatasetValue || 'settings',
    hostDatasetKey: options?.hostDatasetKey || 'userHost',
    style: styleText.concat(options?.styleText || ''),
    moveToEnd: true,
  })

  currentHost = host

  if (existed) return

  let lastValues: {
    global: Record<string, unknown>
    site: Record<string, unknown>
  } = { global: {}, site: {} }

  const wrap = c('div', { className: 'user-settings' })
  applyThemeStyles(wrap, options?.theme)

  const panel = c('div', { className: 'panel' })
  const grid = c('div', { className: 'grid' })

  const { row: headerRow } = buildHeader(schema.title)
  grid.append(headerRow)

  const fillers: Record<string, Array<() => void>> = {}
  const addFiller = (key: string, fn: () => void) => {
    if (!fillers[key]) fillers[key] = []
    fillers[key].push(fn)
  }

  function appendAndFill(
    container: HTMLElement,
    row: HTMLElement,
    key: string,
    filler: () => void
  ) {
    container.append(row)
    addFiller(key, filler)
  }

  function appendField(container: HTMLElement, f: Field) {
    switch (f.type) {
      case 'toggle': {
        const { row, chk } = createToggleRow({
          label: f.label,
          key: f.key,
          help: f.help,
          renderHelp: f.renderHelp,
          isSitePref: f.isSitePref,
        })
        appendAndFill(container, row, f.key, () => {
          fillToggleUI(chk, f.key)
        })
        break
      }

      case 'input': {
        const { row, inp } = createInputRow({
          label: f.label,
          key: f.key,
          placeholder: f.placeholder,
          help: f.help,
          isSitePref: f.isSitePref,
        })
        appendAndFill(container, row, f.key, () => {
          fillInput(inp, f.key)
        })
        break
      }

      case 'textarea': {
        const { row, ta } = createTextareaRow({
          label: f.label,
          key: f.key,
          rows: f.rows,
          help: f.help,
          isSitePref: f.isSitePref,
        })
        appendAndFill(container, row, f.key, () => {
          fillTextarea(ta, f.key)
        })
        break
      }

      case 'radio': {
        const { row, seg } = createRadioRow({
          label: f.label,
          key: f.key,
          options: f.options,
          help: f.help,
          isSitePref: f.isSitePref,
        })
        appendAndFill(container, row, f.key, () => {
          fillRadioUI(seg, f.key)
        })
        break
      }

      case 'select': {
        const { row, sel } = createSelectRow({
          label: f.label,
          key: f.key,
          options: f.options,
          help: f.help,
          isSitePref: f.isSitePref,
        })
        appendAndFill(container, row, f.key, () => {
          fillSelect(sel, f.key)
        })
        break
      }

      case 'colors': {
        const { row, seg } = createColorRow({
          label: f.label,
          key: f.key,
          options: f.options,
          help: f.help,
          isSitePref: f.isSitePref,
        })
        appendAndFill(container, row, f.key, () => {
          fillColorUI(seg, f.key)
        })
        break
      }

      case 'action': {
        const { row } = createActionRow({
          label: f.label,
          key: f.key,
          actions: f.actions,
          help: f.help,
          renderHelp: f.renderHelp,
          layout: f.layout,
        })
        container.append(row)
        break
      }

      case 'custom': {
        const row = c('div', { className: 'row custom-row' })
        if (f.label) {
          const lab = c('label', { text: f.label })
          row.append(lab)
        }

        if (f.help) {
          const help = c('div', { className: 'field-help', text: f.help })
          row.append(help)
        }

        const { update } = f.render(row, {
          key: f.key,
          isSitePref: f.isSitePref,
          onChange(val) {
            void store.set({ [f.key]: val }, !f.isSitePref)
          },
        })

        appendAndFill(container, row, f.key, () => {
          const value = getFieldValue(f.key, f.isSitePref)
          update(value)
        })
        break
      }

      case 'help': {
        const row = c('div', { className: 'row help-row' })
        const help = c('div', { className: 'field-help', text: f.help })
        row.append(help)
        container.append(row)
        break
      }
    }
  }

  function applyThemeStyles(wrap: HTMLElement, theme?: PanelOptions['theme']) {
    if (!theme) return
    const properties: string[] = []
    if (theme.activeBg) properties.push(`--user-active-bg: ${theme.activeBg};`)
    if (theme.activeFg) properties.push(`--user-active-fg: ${theme.activeFg};`)
    if (theme.colorRing)
      properties.push(`--user-color-ring: ${theme.colorRing};`)
    if (theme.toggleOnBg)
      properties.push(`--user-toggle-on-bg: ${theme.toggleOnBg};`)
    const accent = theme.activeBg || theme.colorRing
    if (accent) properties.push(`--user-accent: ${accent};`)
    if (properties.length > 0) wrap.style.cssText = properties.join(' ')
  }

  function buildHeader(title: string): { row: HTMLElement } {
    const row = c('div', { className: 'row header-row' })
    const titleEl = c('label', { className: 'panel-title', text: title })
    row.append(titleEl)
    return { row }
  }

  function renderSimplePanel(
    container: HTMLElement,
    data: { fields?: Field[]; groups?: Group[] }
  ) {
    if (data.groups && Array.isArray(data.groups)) {
      renderGroupsPanel(container, data.groups)
      return
    }

    const fields = data.fields || []
    const body = c('div', { className: 'grid group' })
    container.append(body)
    for (const f of fields) appendField(body, f)
  }

  function renderTabsPanel(container: HTMLElement, tabs: Tab[]) {
    const tabsWrap = c('div', { className: 'tabs' })
    const panels: Record<string, HTMLElement> = {}
    let active = tabs[0]?.id || ''
    for (const t of tabs) {
      const b = c('button', {
        className: 'tab-btn',
        dataset: { tabId: t.id },
        text: t.title,
      })
      tabsWrap.append(b)
      const p = c('div', { className: 'grid' })
      panels[t.id] = p
      if (t.id !== active) p.style.display = 'none'
      if ('groups' in t && Array.isArray((t as any).groups)) {
        renderGroupsPanel(p, (t as any).groups as Group[])
      } else if ('fields' in t && Array.isArray((t as any).fields)) {
        p.className = 'grid group'
        for (const f of (t as any).fields as Field[]) appendField(p, f)
      }
    }

    container.append(tabsWrap)
    for (const id of Object.keys(panels)) container.append(panels[id])

    function updateTabsUI() {
      for (const b of Array.from(tabsWrap.querySelectorAll('.tab-btn'))) {
        const id = (b as any).dataset.tabId || ''
        if (id === active) (b as HTMLElement).classList.add('active')
        else (b as HTMLElement).classList.remove('active')
      }

      for (const id of Object.keys(panels)) {
        panels[id].style.display = id === active ? '' : 'none'
      }
    }

    function onTabsClick(e: MouseEvent) {
      const t = e.target as HTMLElement
      const b = t.closest('.tab-btn')
      if (b && b instanceof HTMLElement) {
        active = (b as any).dataset.tabId || ''
        updateTabsUI()
      }
    }

    tabsWrap.addEventListener('click', onTabsClick)
    updateTabsUI()
  }

  function renderGroupsPanel(container: HTMLElement, groups: Group[]) {
    for (const g of groups) {
      const body = c('div', { className: 'grid group' })
      if (g.title) {
        const header = c('h2', { className: 'group-title', text: g.title })
        container.append(header)
      }

      container.append(body)
      for (const f of g.fields) appendField(body, f)
    }
  }

  const refreshAll = async () => {
    try {
      const g = await store.getAll(true)
      const s = await store.getAll(false)
      lastValues = { global: g, site: s }
    } catch {}

    for (const k of Object.keys(fillers)) {
      for (const fn of fillers[k]) {
        try {
          fn()
        } catch {}
      }
    }
  }

  function wireStoreChange(
    store: Store,
    fillers: Record<string, Array<() => void>>
  ) {
    try {
      store.onChange?.((e) => {
        if (e.key === '*' || !fillers[e.key]) {
          void refreshAll()
          return
        }

        for (const fn of fillers[e.key]) {
          try {
            fn()
          } catch {}
        }
      })
    } catch {}
  }

  function getFieldValue(key: string, el: HTMLElement | boolean | undefined) {
    const isSitePref =
      el instanceof HTMLElement ? Boolean(el.dataset.isSitePref) : Boolean(el)
    const values = isSitePref ? lastValues.site : lastValues.global
    return values[key]
  }

  function getFieldInfo(el: HTMLElement) {
    const key = el.dataset.key
    if (!key) return null
    const isSitePref = Boolean(el.dataset.isSitePref)
    return { key, isSitePref }
  }

  function fillRadioUI(seg: Element, key: string) {
    try {
      const btn = seg.querySelector<HTMLElement>('.seg-btn')
      if (!btn) return
      const v = getFieldValue(key, btn) as any
      for (const b of Array.from(seg.querySelectorAll('.seg-btn'))) {
        const val = (b as any).dataset.value || ''
        if (val === String(v)) (b as HTMLElement).classList.add('active')
        else (b as HTMLElement).classList.remove('active')
      }
    } catch {}
  }

  function fillColorUI(seg: Element, key: string) {
    try {
      const btn = seg.querySelector<HTMLElement>('.color-swatch')
      if (!btn) return
      const v = getFieldValue(key, btn) as any
      for (const b of Array.from(seg.querySelectorAll('.color-swatch'))) {
        const val = (b as any).dataset.value || ''
        if (val.toLowerCase() === String(v || '').toLowerCase())
          (b as HTMLElement).classList.add('active')
        else (b as HTMLElement).classList.remove('active')
      }
    } catch {}
  }

  function fillToggleUI(onBtn: Element, key: string) {
    try {
      if (onBtn instanceof HTMLInputElement && onBtn.type === 'checkbox') {
        const v = getFieldValue(key, onBtn as HTMLElement) as any
        onBtn.checked = Boolean(v)
      }
    } catch {}
  }

  function fillInput(inp: HTMLInputElement, key: string) {
    try {
      const v = getFieldValue(key, inp) as any
      inp.value = String(v ?? '')
    } catch {}
  }

  function fillTextarea(ta: HTMLTextAreaElement, key: string) {
    try {
      const v = getFieldValue(key, ta) as any
      ta.value = String(v ?? '')
    } catch {}
  }

  function fillSelect(sel: HTMLSelectElement, key: string) {
    try {
      const v = getFieldValue(key, sel) as any
      for (const o of Array.from(sel.querySelectorAll('option'))) {
        o.selected = (o as any).value === String(v)
      }
    } catch {}
  }

  async function handleSegButton(rb: HTMLElement) {
    const info = getFieldInfo(rb)
    if (!info) return
    const val = rb.dataset.value || ''
    try {
      await store.set(info.key, val, !info.isSitePref)
    } catch {}
  }

  async function handleColorSwatch(cs: HTMLElement) {
    const info = getFieldInfo(cs)
    if (!info) return
    const val = cs.dataset.value || ''
    try {
      await store.set(info.key, val, !info.isSitePref)
    } catch {}
  }

  function handleActionBtn(ab: HTMLElement) {
    const key = ab.dataset.key || ''
    const actionId = (ab.dataset as any).action || ''
    try {
      options?.onAction?.({ key, actionId, target: ab })
    } catch {}
  }

  function onPanelClick(e: MouseEvent) {
    const t = e.target as HTMLElement
    if (t === topCloseBtn) {
      closeSettingsPanel()
      return
    }

    const rb = t.closest('.seg-btn')
    if (rb && rb instanceof HTMLElement) {
      void handleSegButton(rb)
      return
    }

    const cs = t.closest('.color-swatch')
    if (cs && cs instanceof HTMLElement) {
      void handleColorSwatch(cs)
      return
    }

    const ab = t.closest('.action-btn')
    if (ab && ab instanceof HTMLElement) handleActionBtn(ab)
  }

  function handleInputChange(inp: HTMLInputElement) {
    const info = getFieldInfo(inp)
    if (!info) return
    const isCheckbox = (inp.type || '').toLowerCase() === 'checkbox'
    const v = isCheckbox ? Boolean(inp.checked) : inp.value
    void store.set(info.key, v, !info.isSitePref)
  }

  function handleTextareaChange(ta: HTMLTextAreaElement) {
    const info = getFieldInfo(ta)
    if (!info) return
    void store.set(info.key, ta.value, !info.isSitePref)
  }

  function handleSelectChange(sel: HTMLSelectElement) {
    const info = getFieldInfo(sel)
    if (!info) return
    void store.set(info.key, sel.value, !info.isSitePref)
  }

  function onPanelChange(e: Event) {
    const t = e.target as HTMLElement
    const inp = t.closest('input')
    if (inp && inp instanceof HTMLInputElement) {
      handleInputChange(inp)
      return
    }

    const ta = t.closest('textarea')
    if (ta && ta instanceof HTMLTextAreaElement) {
      handleTextareaChange(ta)
      return
    }

    const sel = t.closest('select')
    if (sel && sel instanceof HTMLSelectElement) {
      handleSelectChange(sel)
    }
  }

  switch (schema.type) {
    case 'simple': {
      renderSimplePanel(grid, schema as any)
      break
    }

    case 'tabs': {
      renderTabsPanel(grid, schema.tabs)
      break
    }
  }

  panel.addEventListener('click', onPanelClick)
  panel.addEventListener('change', onPanelChange)

  const outerHeader = c('div', { className: 'outer-header' })
  const outerTitle = c('label', {
    className: 'outer-title',
    text: schema.title,
  })
  const topCloseBtn = c('button', {
    className: 'btn-ghost icon close-btn',
    text: '×',
    attrs: { 'aria-label': '关闭' },
  })
  outerHeader.append(outerTitle)
  outerHeader.append(topCloseBtn)
  try {
    outerHeader.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      if (t === topCloseBtn) {
        closeSettingsPanel()
      }
    })
  } catch {}

  panel.append(grid)

  const footer = c('div', { className: 'footer' })
  const issueLink = c('a', {
    className: 'issue-link',
    text: 'Report an Issue…',
    attrs: {
      href: options?.issuesUrl || 'https://github.com/utags/userscripts/issues',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  })
  const brand = c('a', {
    className: 'brand',
    text: 'Made with ❤️ by Pipecraft',
    attrs: {
      href: 'https://www.pipecraft.net/',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  })
  footer.append(issueLink)
  footer.append(brand)
  panel.append(footer)

  const stickyThreshold = 22
  let stickyTimer: ReturnType<typeof setTimeout> | undefined
  const stickyDebounceMs = 80

  function updateHeaderStickyCore() {
    try {
      const sc = panel.scrollTop || 0
      const stuck = sc > stickyThreshold
      if (stuck) {
        panel.classList.add('panel-stuck')
        outerHeader.classList.add('stuck')
      } else {
        panel.classList.remove('panel-stuck')
        outerHeader.classList.remove('stuck')
      }
    } catch {}
  }

  function updateHeaderSticky() {
    try {
      if (stickyTimer !== undefined) globalThis.clearTimeout(stickyTimer)
      stickyTimer = globalThis.setTimeout(
        updateHeaderStickyCore,
        stickyDebounceMs
      )
    } catch {}
  }

  try {
    panel.addEventListener('scroll', updateHeaderSticky)
    updateHeaderStickyCore()
  } catch {}

  wrap.append(outerHeader)
  wrap.append(panel)
  root.append(wrap)

  wireStoreChange(store, fillers)
  void refreshAll()

  globalThis.addEventListener('keydown', onKeyDown, true)
}

export function createSettingsStore(
  storageKey: string | undefined,
  defaults: Record<string, unknown>,
  isSupportSitePref = false
): Store {
  const rootKey = storageKey || 'settings'
  let cache: Record<string, unknown> | undefined
  let globalCache: Record<string, unknown> | undefined
  let siteCache: Record<string, unknown> | undefined

  let initPromise: Promise<Record<string, unknown>> | undefined
  const changeCbs: Array<
    (e: {
      key: string
      oldValue: unknown
      newValue: unknown
      remote: boolean
    }) => void
  > = []
  let listenerRegistered = false

  const getHostname = () => globalThis.location?.hostname || 'unknown'

  let beforeSetHook:
    | ((
        values: Record<string, unknown>,
        isGlobalPref: boolean
      ) => Promise<Record<string, unknown>> | Record<string, unknown>)
    | undefined

  function updateCache(obj: unknown) {
    if (isSupportSitePref) {
      const rootObj = (isObject(obj) ? obj : {}) as Record<
        string,
        Record<string, unknown>
      >
      const globalData = rootObj.global
      globalCache = { ...defaults }
      if (isObject(globalData)) {
        Object.assign(globalCache, globalData)
      }

      const hostname = getHostname()
      const siteData = rootObj[hostname]
      siteCache = { ...globalCache }
      if (isObject(siteData)) {
        Object.assign(siteCache, siteData)
      }

      cache = siteCache
    } else {
      cache = { ...defaults }
      if (isObject(obj)) Object.assign(cache, obj)
    }
  }

  function registerValueChangeListener(): void {
    if (listenerRegistered) return
    try {
      void addValueChangeListener(rootKey, (n, ov, nv, remote) => {
        try {
          updateCache(nv)
          for (const f of changeCbs) {
            f({ key: '*', oldValue: ov, newValue: nv, remote })
          }
        } catch {}
      })
      listenerRegistered = true
    } catch {}
  }

  registerValueChangeListener()

  async function ensure(): Promise<Record<string, unknown>> {
    if (cache) return cache
    if (initPromise) return initPromise
    initPromise = (async () => {
      let obj: Record<string, unknown> | undefined
      try {
        obj = await getValue<Record<string, unknown>>(rootKey, undefined)
      } catch {}

      updateCache(obj)
      initPromise = undefined
      return cache!
    })()
    return initPromise
  }

  return {
    async get<T = unknown>(key: string, isGlobalPref?: boolean): Promise<T> {
      await ensure()
      if (isSupportSitePref) {
        if (isGlobalPref) return globalCache![key] as T
        return siteCache![key] as T
      }

      return cache![key] as T
    },
    async getAll<T extends Record<string, unknown> = Record<string, unknown>>(
      isGlobalPref?: boolean
    ): Promise<T> {
      await ensure()
      if (isSupportSitePref) {
        if (isGlobalPref) return { ...globalCache } as unknown as T
        return { ...siteCache } as unknown as T
      }

      return { ...cache } as unknown as T
    },
    async set(
      ...args:
        | [string, unknown]
        | [string, unknown, boolean]
        | [Record<string, unknown>]
        | [Record<string, unknown>, boolean]
    ): Promise<void> {
      let obj: any
      try {
        obj = await getValue<any>(rootKey, {})
      } catch {}

      if (!isObject(obj)) obj = {}

      let isGlobalPref = false
      let values: Record<string, unknown> = {}

      if (typeof args[0] === 'string') {
        values[args[0]] = args[1]
        isGlobalPref = Boolean(args[2])
      } else {
        values = { ...args[0] }
        isGlobalPref = Boolean(args[1])
      }

      if (beforeSetHook) {
        try {
          values = await beforeSetHook(values, isGlobalPref)
        } catch {}
      }

      let target: Record<string, unknown>
      let global: Record<string, unknown>
      if (isSupportSitePref) {
        const hostname = isGlobalPref ? 'global' : getHostname()
        if (!isObject(obj[hostname])) obj[hostname] = {}
        target = obj[hostname]
        global = isObject(obj.global) ? obj.global : {}
      } else {
        target = obj
      }

      const isSitePref = isSupportSitePref && !isGlobalPref

      const apply = (key: string, value: unknown) => {
        if (isSitePref && key in global) {
          const normalized = normalizeToDefaultType(value, defaults[key])
          target[key] = normalized
          return
        }

        setOrDelete(target, key, value, defaults[key])
      }

      if (values) {
        for (const k of Object.keys(values)) {
          const v = values[k]
          apply(k, v)
        }
      }

      if (isSupportSitePref && target && Object.keys(target).length === 0) {
        const hostname = isGlobalPref ? 'global' : getHostname()
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete obj[hostname]
      }

      updateCache(obj)
      try {
        await setValue(rootKey, obj)
      } catch {}
    },
    async reset(isGlobalPref?: boolean) {
      let obj: any

      if (isSupportSitePref) {
        try {
          obj = await getValue<any>(rootKey, {})
        } catch {}

        if (!isObject(obj)) obj = {}

        const hostname = isGlobalPref ? 'global' : getHostname()
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete obj[hostname]
      } else {
        obj = {}
      }

      updateCache(obj)
      try {
        await setValue(rootKey, obj)
      } catch {}
    },
    defaults() {
      return { ...defaults }
    },
    onChange(cb) {
      changeCbs.push(cb)
    },
    onBeforeSet(cb) {
      beforeSetHook = cb
    },
  }
}
