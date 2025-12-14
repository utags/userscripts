import { c } from '../../utils/c'
import { setOrDelete } from '../../utils/obj'
import styleText from 'css:./style.css'

export type FieldOption = { value: string; label: string }
type FieldToggle = { type: 'toggle'; key: string; label: string; help?: string }
type FieldInput = {
  type: 'input'
  key: string
  label: string
  placeholder?: string
  help?: string
}
type FieldColors = {
  type: 'colors'
  key: string
  label: string
  options: Array<{ value: string }>
  help?: string
}
type FieldTextarea = {
  type: 'textarea'
  key: string
  label: string
  rows?: number
  help?: string
}
type FieldRadio = {
  type: 'radio'
  key: string
  label: string
  options: FieldOption[]
  help?: string
}
type FieldSelect = {
  type: 'select'
  key: string
  label: string
  options: FieldOption[]
  help?: string
}
type FieldAction = {
  type: 'action'
  key: string
  label: string
  actions: Array<{ id: string; text: string; kind?: 'danger' }>
  help?: string
}
export type Field =
  | FieldToggle
  | FieldInput
  | FieldTextarea
  | FieldRadio
  | FieldSelect
  | FieldColors
  | FieldAction

export type Tab = { id: string; title: string; fields: Field[] }
export type PanelSchema =
  | { type: 'simple'; title: string; fields: Field[] }
  | { type: 'tabs'; title: string; tabs: Tab[] }

type Store = {
  onChange?: (
    cb: (e: {
      key: string
      oldValue: unknown
      newValue: unknown
      remote: boolean
    }) => void
  ) => void
  get<T = unknown>(key: string): Promise<T>
  getAll<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(): Promise<T>
  set(...args: [string, unknown] | [Record<string, unknown>]): Promise<void>
  defaults(): Record<string, unknown>
}

declare const GM: {
  getValue<T = unknown>(key: string, defaultValue: T): Promise<T>
  setValue(key: string, value: unknown): Promise<void>
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
  styleText?: string
  onAction?: (info: {
    key: string
    actionId: string
    target: HTMLElement
  }) => void
}

function createToggleRow(label: string, key: string, help?: string) {
  const row = c('div', { className: 'row' })
  const lab = c('label', { text: label })
  const seg = c('div', { className: 'toggle-wrap' })
  const chk = c('input', {
    type: 'checkbox',
    className: 'toggle-checkbox',
    dataset: { key },
  })
  const val = c('div', { className: 'value-wrap' })
  seg.append(chk)
  val.append(seg)
  if (help) val.append(c('div', { className: 'field-help', text: help }))
  row.append(lab)
  row.append(val)
  return { row, chk }
}

function createInputRow(
  label: string,
  key: string,
  placeholder?: string,
  help?: string
) {
  const row = c('div', { className: 'row' })
  const lab = c('label', { text: label })
  const inp = c('input', {
    type: 'text',
    placeholder: placeholder || '',
    dataset: { key },
  })
  const val = c('div', { className: 'value-wrap' })
  val.append(inp)
  if (help) val.append(c('div', { className: 'field-help', text: help }))
  row.append(lab)
  row.append(val)
  return { row, inp }
}

function createTextareaRow(
  label: string,
  key: string,
  rows?: number,
  help?: string
) {
  const row = c('div', { className: 'row' })
  const lab = c('label', { text: label })
  const ta = c('textarea', {
    rows: rows || 4,
    dataset: { key },
  })
  const val = c('div', { className: 'value-wrap' })
  val.append(ta)
  if (help) val.append(c('div', { className: 'field-help', text: help }))
  row.append(lab)
  row.append(val)
  return { row, ta }
}

function createRadioRow(
  label: string,
  key: string,
  opts: FieldOption[],
  help?: string
) {
  const row = c('div', { className: 'row' })
  const lab = c('label', { text: label })
  const seg = c('div', { className: 'seg' })
  for (const o of opts) {
    const b = c('button', {
      className: 'seg-btn',
      dataset: { key, value: o.value },
      text: o.label,
    })
    seg.append(b)
  }

  const val = c('div', { className: 'value-wrap' })
  val.append(seg)
  if (help) val.append(c('div', { className: 'field-help', text: help }))
  row.append(lab)
  row.append(val)
  return { row, seg }
}

function createColorRow(
  label: string,
  key: string,
  opts: Array<{ value: string }>,
  help?: string
) {
  const row = c('div', { className: 'row' })
  const lab = c('label', { text: label })
  const seg = c('div', { className: 'color-row' })
  for (const o of opts) {
    const b = c('button', {
      className: 'color-swatch',
      dataset: { key, value: o.value },
      style: { backgroundColor: o.value },
    })
    seg.append(b)
  }

  const val = c('div', { className: 'value-wrap' })
  val.append(seg)
  if (help) val.append(c('div', { className: 'field-help', text: help }))
  row.append(lab)
  row.append(val)
  return { row, seg }
}

function createSelectRow(
  label: string,
  key: string,
  opts: FieldOption[],
  help?: string
) {
  const row = c('div', { className: 'row' })
  const lab = c('label', { text: label })
  const sel = c('select', { dataset: { key } })
  for (const o of opts) {
    const opt = c('option', { value: o.value, text: o.label })
    sel.append(opt)
  }

  const val = c('div', { className: 'value-wrap' })
  val.append(sel)
  if (help) val.append(c('div', { className: 'field-help', text: help }))
  row.append(lab)
  row.append(val)
  return { row, sel }
}

function createActionRow(
  label: string,
  key: string,
  actions: Array<{ id: string; text: string; kind?: 'danger' }>,
  help?: string
) {
  const row = c('div', { className: 'row' })
  const lab = c('label', { text: label })
  const wrap = c('div', { className: 'value-wrap' })
  const act = c('div', { className: 'seg' })
  for (const a of actions) {
    const b = c('button', {
      className: `btn action-btn${a.kind === 'danger' ? ' btn-danger' : ''}`,
      dataset: { key, action: a.id },
      text: a.text,
    })
    act.append(b)
  }

  wrap.append(act)
  if (help) wrap.append(c('div', { className: 'field-help', text: help }))
  row.append(lab)
  row.append(wrap)
  return { row }
}

export function openSettingsPanel(
  schema: PanelSchema,
  store: Store,
  options?: PanelOptions
): void {
  const { host, root } = ensureHostAndRoot(options)

  let lastValues: Record<string, unknown> = {}

  const styleTag = c('style', {
    text: styleText.concat(options?.styleText || ''),
  })
  root.append(styleTag)

  const wrap = c('div', { className: 'user-settings' })
  applyThemeStyles(wrap, options?.theme)

  const panel = c('div', { className: 'panel' })
  const grid = c('div', { className: 'grid' })

  const { row: headerRow, closeBtn } = buildHeader(schema.title)
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
        const { row, chk } = createToggleRow(f.label, f.key, f.help)
        appendAndFill(container, row, f.key, () => {
          fillToggleUI(chk, f.key)
        })
        break
      }

      case 'input': {
        const { row, inp } = createInputRow(
          f.label,
          f.key,
          f.placeholder,
          f.help
        )
        appendAndFill(container, row, f.key, () => {
          fillInput(inp, f.key)
        })
        break
      }

      case 'textarea': {
        const { row, ta } = createTextareaRow(f.label, f.key, f.rows, f.help)
        appendAndFill(container, row, f.key, () => {
          fillTextarea(ta, f.key)
        })
        break
      }

      case 'radio': {
        const { row, seg } = createRadioRow(f.label, f.key, f.options, f.help)
        appendAndFill(container, row, f.key, () => {
          fillRadioUI(seg, f.key)
        })
        break
      }

      case 'select': {
        const { row, sel } = createSelectRow(f.label, f.key, f.options, f.help)
        appendAndFill(container, row, f.key, () => {
          fillSelect(sel, f.key)
        })
        break
      }

      case 'colors': {
        const { row, seg } = createColorRow(f.label, f.key, f.options, f.help)
        appendAndFill(container, row, f.key, () => {
          fillColorUI(seg, f.key)
        })
        break
      }

      case 'action': {
        const { row } = createActionRow(f.label, f.key, f.actions, f.help)
        container.append(row)
        break
      }
    }
  }

  function sanitizeDatasetKey(rawKey: string): string {
    let out = ''
    for (const ch of rawKey) {
      const code = ch.codePointAt(0) || 0
      out += code >= 65 && code <= 90 ? '-' + ch.toLowerCase() : ch
    }

    return out
  }

  function ensureHostAndRoot(options?: PanelOptions): {
    host: HTMLDivElement
    root: ShadowRoot
  } {
    const keySan = sanitizeDatasetKey(options?.hostDatasetKey || 'usrHost')
    const sel = `[data-${keySan}="${options?.hostDatasetValue || 'settings'}"]`
    const existing = document.querySelector(sel)

    let root: ShadowRoot
    let hostEl: HTMLDivElement
    if (existing instanceof HTMLDivElement && existing.shadowRoot) {
      hostEl = existing
      root = existing.shadowRoot
      for (const n of Array.from(root.childNodes)) (n as any).remove()
    } else {
      const key = options?.hostDatasetKey || 'userHost'
      const val = options?.hostDatasetValue || 'settings'
      hostEl = c('div', { dataset: { [key]: val } })
      root = hostEl.attachShadow({ mode: 'open' })
      document.documentElement.append(hostEl)
    }

    return { host: hostEl, root }
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
    if (properties.length > 0) wrap.style.cssText = properties.join(' ')
  }

  function buildHeader(title: string): {
    row: HTMLElement
    closeBtn: HTMLButtonElement
  } {
    const row = c('div', { className: 'row' })
    const titleEl = c('label', { className: 'panel-title', text: title })
    const closeBtn = c('button', {
      className: 'btn-ghost icon',
      text: '×',
      attrs: { 'aria-label': '关闭' },
    })
    row.append(titleEl)
    row.append(closeBtn)
    return { row, closeBtn }
  }

  function renderSimplePanel(container: HTMLElement, fields: Field[]) {
    for (const f of fields) appendField(container, f)
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
      for (const f of t.fields) appendField(p, f)
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

  const refreshAll = async () => {
    try {
      lastValues = await store.getAll()
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

  function fillRadioUI(seg: Element, key: string) {
    try {
      const v = lastValues[key] as any
      for (const b of Array.from(seg.querySelectorAll('.seg-btn'))) {
        const val = (b as any).dataset.value || ''
        if (val === String(v)) (b as HTMLElement).classList.add('active')
        else (b as HTMLElement).classList.remove('active')
      }
    } catch {}
  }

  function fillColorUI(seg: Element, key: string) {
    try {
      const v = lastValues[key] as any
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
      const v = lastValues[key] as any
      if (onBtn instanceof HTMLInputElement && onBtn.type === 'checkbox') {
        onBtn.checked = Boolean(v)
      }
    } catch {}
  }

  function fillInput(inp: HTMLInputElement, key: string) {
    try {
      const v = lastValues[key] as any
      inp.value = String(v ?? '')
    } catch {}
  }

  function fillTextarea(ta: HTMLTextAreaElement, key: string) {
    try {
      const v = lastValues[key] as any
      ta.value = String(v ?? '')
    } catch {}
  }

  function fillSelect(sel: HTMLSelectElement, key: string) {
    try {
      const v = lastValues[key] as any
      for (const o of Array.from(sel.querySelectorAll('option'))) {
        o.selected = (o as any).value === String(v)
      }
    } catch {}
  }

  async function handleSegButton(rb: HTMLElement) {
    const key = rb.dataset.key || ''
    const val = rb.dataset.value || ''
    if (!key) return
    try {
      await store.set(key, val)
    } catch {}
  }

  async function handleColorSwatch(cs: HTMLElement) {
    const key = cs.dataset.key || ''
    const val = cs.dataset.value || ''
    if (!key) return
    try {
      await store.set(key, val)
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
    if (t === closeBtn) {
      host?.remove()
      globalThis.removeEventListener('keydown', onKeyDown, true)
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
    const key = (inp as any).dataset?.key
    if (!key) return
    const isCheckbox = (inp.type || '').toLowerCase() === 'checkbox'
    const v = isCheckbox ? Boolean(inp.checked) : inp.value
    void store.set(key, v)
  }

  function handleTextareaChange(ta: HTMLTextAreaElement) {
    const key = (ta as any).dataset?.key
    if (!key) return
    void store.set(key, ta.value)
  }

  function handleSelectChange(sel: HTMLSelectElement) {
    const key = (sel as any).dataset?.key
    if (!key) return
    void store.set(key, sel.value)
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

  if (schema.type === 'simple') renderSimplePanel(grid, schema.fields)
  else renderTabsPanel(grid, schema.tabs)

  panel.addEventListener('click', onPanelClick)
  panel.addEventListener('change', onPanelChange)

  panel.append(grid)

  wrap.append(panel)
  root.append(wrap)

  wireStoreChange(store, fillers)
  void refreshAll()

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      host?.remove()
      globalThis.removeEventListener('keydown', onKeyDown, true)
    }
  }

  globalThis.addEventListener('keydown', onKeyDown, true)
}

export function createObjectSettingsStore(
  rootKey: string,
  defaults: Record<string, unknown>
): Store {
  let cache: Record<string, unknown> | undefined
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

  function registerValueChangeListener(): void {
    if (listenerRegistered) return
    if (typeof GM_addValueChangeListener !== 'function') return
    try {
      GM_addValueChangeListener(rootKey, (n, ov, nv, remote) => {
        console.log('GM_addValueChangeListener', n, ov, nv, remote)
        try {
          if (nv && typeof nv === 'object') {
            const merged = { ...defaults }
            Object.assign(merged, nv as Record<string, unknown>)
            cache = merged
          } else {
            cache = { ...defaults }
          }

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
        obj = await GM.getValue<Record<string, unknown>>(rootKey, defaults)
      } catch {}

      cache = { ...defaults }
      if (obj && typeof obj === 'object') Object.assign(cache, obj)
      initPromise = undefined
      return cache
    })()
    return initPromise
  }

  return {
    async get<T = unknown>(key: string): Promise<T> {
      const obj = await ensure()
      return (obj[key] as T) ?? (defaults[key] as T)
    },
    async getAll<
      T extends Record<string, unknown> = Record<string, unknown>,
    >(): Promise<T> {
      const obj = await ensure()
      const out = { ...obj }
      return out as unknown as T
    },
    async set(
      ...args: [string, unknown] | [Record<string, unknown>]
    ): Promise<void> {
      let obj: Record<string, unknown> | undefined
      try {
        obj = await GM.getValue<Record<string, unknown>>(rootKey, {})
      } catch {}

      if (typeof args[0] === 'string') {
        const key = args[0]
        const value = args[1]
        const dv = defaults[key]
        setOrDelete(obj as any, key, value, dv)
      } else {
        const kvs = args[0]
        for (const k of Object.keys(kvs)) {
          const v = kvs[k]
          const dv = defaults[k]
          setOrDelete(obj as any, k, v, dv)
        }
      }

      cache = { ...defaults }
      if (obj && typeof obj === 'object') Object.assign(cache, obj)
      try {
        await GM.setValue(rootKey, obj)
      } catch {}

      // Call onChange callbacks from GM_addValueChangeListener
      // try {
      //   for (const cb of changeCbs) {
      //     cb({ key: '*', oldValue: oldObj, newValue: obj, remote: false })
      //   }
      // } catch {}
    },
    defaults() {
      return { ...defaults }
    },
    onChange(cb) {
      changeCbs.push(cb)
    },
  }
}
