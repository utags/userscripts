import { createIconInput } from './icon-input'
import { createOpenModeRadios, createSegmentedRadios } from './segmented-radios'
import { type OpenMode } from './types'

export type GroupFormData = {
  id?: string
  name: string
  displayName?: string
  icon?: string
  match?: string[]
  defaultOpen?: OpenMode
  itemsPerRow?: number
  hidden?: boolean
  displayStyle?: 'icon-title' | 'icon-only' | 'title-only'
  iconSize?: 'small' | 'medium' | 'large'
  iconItemsPerRow?: number
}

export function renderGroupForm(
  container: HTMLElement,
  data: GroupFormData,
  options: {
    onChange?: () => void
  }
) {
  const grid = document.createElement('div')
  grid.className = 'grid'
  try {
    ;(grid.style as any).gridTemplateColumns = '1fr'
  } catch {}

  const notifyChange = () => {
    if (options.onChange) options.onChange()
  }

  // Name
  const nameRow = document.createElement('div')
  nameRow.className = 'row'
  const nameLabel = document.createElement('label')
  nameLabel.textContent = '组名'
  const nameInput = document.createElement('input')
  nameInput.value = data.name || ''
  nameInput.addEventListener('input', () => {
    data.name = nameInput.value
    if (!displayToggle.checked) {
      displayInput.value = nameInput.value
    }

    notifyChange()
  })
  nameRow.append(nameLabel)
  nameRow.append(nameInput)

  // Display Name
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
    typeof data.displayName === 'string' && data.displayName !== data.name
  displayToggle.checked = Boolean(hasCustomDisplay)
  displayInput.value = hasCustomDisplay
    ? data.displayName || ''
    : data.name || nameInput.value
  displayInput.disabled = !displayToggle.checked

  const updateDisplay = () => {
    if (displayToggle.checked) {
      data.displayName = displayInput.value
      displayInput.disabled = false
    } else {
      delete data.displayName
      displayInput.value = nameInput.value
      displayInput.disabled = true
    }

    notifyChange()
  }

  displayInput.addEventListener('input', updateDisplay)
  displayToggle.addEventListener('change', updateDisplay)

  displayRow.append(displayLabel)
  displayRow.append(displayInput)
  displayRow.append(displayCtrl)

  // Icon
  const iconRow = document.createElement('div')
  iconRow.className = 'row'
  const iconLabel = document.createElement('label')
  iconLabel.textContent = '图标'
  const iconComp = createIconInput(
    data.icon || 'lucide:folder',
    ['icon', 'url', 'emoji'],
    {
      labels: { icon: '图标', url: 'URL', emoji: 'Emoji' },
      namePrefix: 'ushortcuts-group-icon-kind-' + (data.id || Math.random()),
      onValueChange() {
        data.icon = iconComp.getFinal()
        notifyChange()
      },
      onKindChange() {
        data.icon = iconComp.getFinal()
        notifyChange()
      },
    }
  )
  iconRow.append(iconLabel)
  iconRow.append(iconComp.el)

  // URL Rules
  const ruleRow = document.createElement('div')
  ruleRow.className = 'row'
  const ruleLabel = document.createElement('label')
  ruleLabel.textContent = 'URL 规则'
  const ta = document.createElement('textarea')
  const host = location.hostname || ''
  const defaultMatch = ['*://' + host + '/*']
  ta.value = (
    data.match && data.match.length > 0 ? data.match : defaultMatch
  ).join('\n')

  const updateMatch = () => {
    data.match = ta.value
      .split(/\n+/)
      .map((v) => v.trim())
      .filter(Boolean)
    notifyChange()
  }

  ta.addEventListener('change', updateMatch)
  // Also update on input for smoother feel? Usually textarea change is on blur.
  // group-manager-panel uses change. add-group-modal doesn't listen to textarea, it reads on save.
  // We'll use change.

  ruleRow.append(ruleLabel)
  ruleRow.append(ta)

  // Template Selector
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
    updateMatch()
  })
  tplRow.append(tplLabel)
  tplRow.append(tplSel)

  // Open Mode
  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '默认打开方式'
  const openRadios = createOpenModeRadios(
    data.defaultOpen,
    (m) => {
      data.defaultOpen = m
      notifyChange()
    },
    { inheritLabel: '跟随站点设置' }
  )
  openRow.append(openLabel)
  openRow.append(openRadios)

  // Items Per Row
  const colsRow = document.createElement('div')
  colsRow.className = 'row'
  const colsLabel = document.createElement('label')
  colsLabel.textContent = '每行显示个数'
  let colVal = String(data.itemsPerRow ?? 1) as
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
  const colsRadios = createSegmentedRadios(
    colVal,
    ['1', '2', '3', '4', '5', '6'] as const,
    (v) => {
      colVal = v
      data.itemsPerRow = Number.parseInt(v, 10)
      notifyChange()
    },
    { namePrefix: 'ushortcuts-cols-' + (data.id || Math.random()) }
  )
  colsRow.append(colsLabel)
  colsRow.append(colsRadios)

  // Display Style
  const displayStyleRow = document.createElement('div')
  displayStyleRow.className = 'row'
  const displayStyleLabel = document.createElement('label')
  displayStyleLabel.textContent = '显示风格'
  const displayStyleRadios = createSegmentedRadios(
    data.displayStyle || 'icon-title',
    ['icon-title', 'icon-only', 'title-only'] as const,
    (v) => {
      data.displayStyle = v
      updateVisibility()
      notifyChange()
    },
    {
      labels: {
        'icon-title': '图标+标题',
        'icon-only': '仅图标',
        'title-only': '仅标题',
      },
      namePrefix: 'ushortcuts-display-style-' + (data.id || Math.random()),
    }
  )
  displayStyleRow.append(displayStyleLabel)
  displayStyleRow.append(displayStyleRadios)

  // Icon Items Per Row (Only visible if icon-only)
  const iconColsRow = document.createElement('div')
  iconColsRow.className = 'row'

  const iconColsLabel = document.createElement('label')
  iconColsLabel.textContent = '每行图标数'
  const iconColVal = String(data.iconItemsPerRow || 0) as
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
  const iconColsRadios = createSegmentedRadios(
    iconColVal === '0' ? 'Auto' : iconColVal,
    ['Auto', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const,
    (v) => {
      data.iconItemsPerRow = v === 'Auto' ? 0 : Number.parseInt(v, 10)
      notifyChange()
    },
    { namePrefix: 'ushortcuts-icon-cols-' + (data.id || Math.random()) }
  )
  iconColsRadios.classList.add('segmented-compact')
  iconColsRow.append(iconColsLabel)
  iconColsRow.append(iconColsRadios)

  // Icon Size (Only visible if icon-only)
  const iconSizeRow = document.createElement('div')
  iconSizeRow.className = 'row'

  const iconSizeLabel = document.createElement('label')
  iconSizeLabel.textContent = '图标大小'
  const iconSizeRadios = createSegmentedRadios(
    data.iconSize || 'medium',
    ['small', 'medium', 'large'] as const,
    (v) => {
      data.iconSize = v
      notifyChange()
    },
    {
      labels: { small: '小', medium: '中', large: '大' },
      namePrefix: 'ushortcuts-icon-size-' + (data.id || Math.random()),
    }
  )
  iconSizeRow.append(iconSizeLabel)
  iconSizeRow.append(iconSizeRadios)

  const updateVisibility = () => {
    const style = data.displayStyle || 'icon-title'
    const isIconOnly = style === 'icon-only'
    colsRow.style.display = isIconOnly ? 'none' : ''
    iconColsRow.style.display = isIconOnly ? '' : 'none'
    iconSizeRow.style.display = isIconOnly ? '' : 'none'
  }

  updateVisibility()

  // Visibility
  const stateRow = document.createElement('div')
  stateRow.className = 'row'
  const stateLabel = document.createElement('label')
  stateLabel.textContent = '分组显示状态'
  let groupState = data.hidden ? 'hidden' : 'visible'
  const stateRadios = createSegmentedRadios(
    groupState,
    ['visible', 'hidden'] as const,
    (v) => {
      groupState = v
      data.hidden = v === 'hidden'
      notifyChange()
    },
    {
      labels: { visible: '显示', hidden: '隐藏' },
      namePrefix: 'ushortcuts-state-' + (data.id || Math.random()),
    }
  )
  stateRow.append(stateLabel)
  stateRow.append(stateRadios)

  grid.append(nameRow)
  grid.append(displayRow)
  grid.append(iconRow)
  grid.append(tplRow)
  grid.append(ruleRow)
  grid.append(openRow)
  grid.append(colsRow)
  grid.append(displayStyleRow)
  grid.append(iconColsRow)
  grid.append(iconSizeRow)
  grid.append(stateRow)

  container.append(grid)

  return {
    nameInput, // Exposed for focus if needed
  }
}
