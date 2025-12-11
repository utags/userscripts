import { createOpenModeRadios, createSegmentedRadios } from './segmented-radios'
import { createIconInput } from './icon-input'
import { uid } from '../../utils/uid'

export function openAddGroupModal(
  root: ShadowRoot,
  cfg: any,
  helpers: {
    saveConfig: (cfg: any) => void
    rerender: (root: ShadowRoot, cfg: any) => void
    defaultOpen: 'same-tab' | 'new-tab'
    defaultMatch?: string[]
    existingGroup?: any
  }
) {
  for (const n of Array.from(root.querySelectorAll('.modal-mask'))) n.remove()

  const mask = document.createElement('div')
  mask.className = 'modal-mask'
  try {
    ;(mask.style as any).zIndex = '2147483649'
  } catch {}

  const modal = document.createElement('div')
  modal.className = 'modal'
  try {
    const panel = root.querySelector('.utqn')
    const isDarkPanel = panel?.classList.contains('dark')
    const prefersDark = (() => {
      try {
        return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches
      } catch {
        return false
      }
    })()
    if (isDarkPanel || prefersDark) modal.classList.add('dark')
  } catch {}

  const h2 = document.createElement('h2')
  h2.textContent = helpers.existingGroup ? '编辑分组' : '添加分组'

  const grid = document.createElement('div')
  grid.className = 'grid'
  try {
    ;(grid.style as any).gridTemplateColumns = '1fr'
  } catch {}

  const nameRow = document.createElement('div')
  nameRow.className = 'row'
  const nameLabel = document.createElement('label')
  nameLabel.textContent = '组名'
  const nameInput = document.createElement('input')
  nameInput.value = helpers.existingGroup?.name ?? '新分组'
  nameRow.append(nameLabel)
  nameRow.append(nameInput)

  const displayRow = document.createElement('div')
  displayRow.className = 'row'
  const displayLabel = document.createElement('label')
  displayLabel.textContent = '显示组名'
  const displayInput = document.createElement('input')
  const displayCtrl = document.createElement('label')
  displayCtrl.className = 'check'
  const displayToggle = document.createElement('input')
  displayToggle.type = 'checkbox'
  const displayText = document.createElement('span')
  displayText.textContent = '自定义'
  displayCtrl.append(displayToggle)
  displayCtrl.append(displayText)
  const hasCustomDisplay =
    typeof helpers.existingGroup?.displayName === 'string' &&
    helpers.existingGroup.displayName !== helpers.existingGroup.name
  displayToggle.checked = Boolean(hasCustomDisplay)
  displayInput.value = hasCustomDisplay
    ? helpers.existingGroup?.displayName || ''
    : helpers.existingGroup?.name || nameInput.value
  displayInput.disabled = !displayToggle.checked
  nameInput.addEventListener('input', () => {
    if (!displayToggle.checked) displayInput.value = nameInput.value
  })
  displayToggle.addEventListener('change', () => {
    displayInput.disabled = !displayToggle.checked
    if (!displayToggle.checked) displayInput.value = nameInput.value
  })
  displayRow.append(displayLabel)
  displayRow.append(displayInput)
  displayRow.append(displayCtrl)

  const iconRow = document.createElement('div')
  iconRow.className = 'row'
  const iconLabel = document.createElement('label')
  iconLabel.textContent = '图标'
  const iconComp = createIconInput(
    helpers.existingGroup?.icon ?? 'lucide:folder',
    ['icon', 'url', 'emoji'],
    {
      labels: { icon: '图标', url: 'URL', emoji: 'Emoji' },
      namePrefix: 'utqn-group-icon-kind-',
    }
  )
  iconRow.append(iconLabel)
  iconRow.append(iconComp.el)

  const ruleRow = document.createElement('div')
  ruleRow.className = 'row'
  const ruleLabel = document.createElement('label')
  ruleLabel.textContent = 'URL 规则'
  const ta = document.createElement('textarea')
  const host = location.hostname || ''
  ta.value = (
    helpers.existingGroup?.match ??
    (helpers.defaultMatch && helpers.defaultMatch.length > 0
      ? helpers.defaultMatch
      : ['*://' + host + '/*'])
  ).join('\n')
  ruleRow.append(ruleLabel)
  ruleRow.append(ta)

  function escRe(s: string): string {
    let out = ''
    const specials = '\\^$.*+?()[]{}|'
    for (const ch of s) out += specials.includes(ch) ? '\\' + ch : ch
    return out
  }

  function regexHostAll(h: string): string {
    const hh = escRe(h)
    return `/.+://${hh}/.*$/`
  }

  function regexHostDir(h: string, d: string): string {
    const hh = escRe(h)
    const dd = escRe(d)
    return `/.+://${hh}${dd}.*$/`
  }

  function regexHostPath(h: string, p: string): string {
    const hh = escRe(h)
    const pp = escRe(p)
    return `/.+://${hh}${pp}$/`
  }

  const tplRow = document.createElement('div')
  tplRow.className = 'row'
  const tplLabel = document.createElement('label')
  tplLabel.textContent = '规则模板'
  const tplSel = document.createElement('select')
  const pathname = location.pathname || '/'
  const dir = pathname.endsWith('/') ? pathname : pathname.replace(/[^/]+$/, '')
  const opts: Array<{ v: string; t: string }> = [
    { v: `*://${host}/*`, t: '当前域名所有页面' },
    { v: `*://${host}${dir}*`, t: '当前路径前缀' },
    { v: `*://${host}${pathname}`, t: '当前完整路径' },
    { v: `*`, t: '任意域名所有页面' },
    { v: regexHostAll(host), t: '正则：当前域名所有页面' },
    { v: regexHostDir(host, dir), t: '正则：当前路径前缀' },
    { v: regexHostPath(host, pathname), t: '正则：当前完整路径' },
  ]
  for (const it of opts) {
    const o = document.createElement('option')
    o.value = it.v
    o.textContent = it.t
    tplSel.append(o)
  }

  tplSel.addEventListener('change', () => {
    ta.value = tplSel.value
  })
  tplRow.append(tplLabel)
  tplRow.append(tplSel)

  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '默认打开方式'
  let openValue: 'same-tab' | 'new-tab' =
    (helpers.existingGroup?.defaultOpen as 'same-tab' | 'new-tab') ||
    helpers.defaultOpen ||
    'same-tab'
  const openRadios = createOpenModeRadios(openValue, (m) => {
    openValue = m
  })
  openRow.append(openLabel)
  openRow.append(openRadios)

  const colsRow = document.createElement('div')
  colsRow.className = 'row'
  const colsLabel = document.createElement('label')
  colsLabel.textContent = '每行显示个数'
  let colVal: '1' | '2' | '3' | '4' | '5' | '6' = String(
    helpers.existingGroup?.itemsPerRow ?? 1
  ) as '1' | '2' | '3' | '4' | '5' | '6'
  const colsRadios = createSegmentedRadios(
    colVal,
    ['1', '2', '3', '4', '5', '6'] as const,
    (v) => {
      colVal = v
    },
    { namePrefix: 'utqn-cols-' }
  )
  colsRow.append(colsLabel)
  colsRow.append(colsRadios)

  const stateRow = document.createElement('div')
  stateRow.className = 'row'
  const stateLabel = document.createElement('label')
  stateLabel.textContent = '分组显示状态'
  let groupState: 'visible' | 'hidden' = helpers.existingGroup?.hidden
    ? 'hidden'
    : 'visible'
  const stateRadios = createSegmentedRadios(
    groupState,
    ['visible', 'hidden'] as const,
    (v) => {
      groupState = v
    },
    { labels: { visible: '显示', hidden: '隐藏' }, namePrefix: 'utqn-state-' }
  )
  stateRow.append(stateLabel)
  stateRow.append(stateRadios)

  const actions = document.createElement('div')
  actions.className = 'row actions'
  const saveBtn = document.createElement('button')
  saveBtn.className = 'btn btn-primary'
  saveBtn.textContent = helpers.existingGroup ? '确认' : '添加'
  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'btn btn-secondary'
  cancelBtn.textContent = '取消'

  const isEditableTarget = (t: EventTarget | undefined) => {
    const el = t as HTMLElement | undefined
    if (!el) return false
    const tag = el.tagName ? el.tagName.toLowerCase() : ''
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
    const ce = (el as any).isContentEditable as boolean | undefined
    return Boolean(ce)
  }

  const close = () => {
    try {
      mask.remove()
    } catch {}

    try {
      document.removeEventListener('keydown', onKey, true)
    } catch {}
  }

  const onKey = (e: KeyboardEvent) => {
    const visible = root.contains(mask) && modal.style.display !== 'none'
    if (!visible) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }

    if (e.key === 'Enter') {
      const ae = (root as any).activeElement as HTMLElement | undefined
      const inModal = ae ? Boolean(modal.contains(ae)) : false
      if (!inModal) return
      const tag = ae?.tagName ? ae.tagName.toLowerCase() : ''
      if (tag === 'textarea' || tag === 'button') return
      e.preventDefault()
      saveBtn.click()
    }
  }

  document.addEventListener('keydown', onKey, true)

  saveBtn.addEventListener('click', () => {
    const nm = nameInput.value.trim()
    if (!nm) {
      try {
        nameInput.focus()
      } catch {}

      return
    }

    const toMatch = ta.value
      .split(/\n+/)
      .map((v) => v.trim())
      .filter(Boolean)
    const toCols = Math.max(1, Math.min(6, Number.parseInt(colVal, 10)))
    const toHidden = helpers.existingGroup ? groupState === 'hidden' : false

    if (helpers.existingGroup) {
      const g = helpers.existingGroup
      g.name = nm
      g.icon = iconComp.getFinal() || g.icon || 'lucide:folder'
      g.match = toMatch
      g.defaultOpen = openValue
      g.itemsPerRow = toCols
      g.hidden = Boolean(toHidden)
      if (displayToggle.checked) {
        g.displayName = displayInput.value
      } else {
        try {
          delete g.displayName
        } catch {}
      }
    } else {
      const g = {
        id: uid(),
        name: nm,
        icon: iconComp.getFinal() || 'lucide:folder',
        match: toMatch,
        items: [],
        defaultOpen: openValue,
        itemsPerRow: toCols,
        hidden: Boolean(toHidden),
      }
      if (displayToggle.checked) {
        ;(g as any).displayName = displayInput.value
      }

      cfg.groups.push(g)
    }

    try {
      helpers.saveConfig(cfg)
    } catch {}

    try {
      helpers.rerender(root, cfg)
    } catch {}

    close()
  })

  cancelBtn.addEventListener('click', () => {
    close()
  })

  actions.append(saveBtn)
  actions.append(cancelBtn)
  grid.append(nameRow)
  grid.append(displayRow)
  grid.append(iconRow)
  grid.append(tplRow)
  grid.append(ruleRow)
  grid.append(openRow)
  grid.append(colsRow)
  if (helpers.existingGroup) grid.append(stateRow)
  modal.append(h2)
  modal.append(grid)
  modal.append(actions)
  mask.append(modal)
  root.append(mask)
}
