import { pickLinkFromPage } from './add-link-actions'
import { createIconInput } from './icon-input'
import { createOpenModeRadios, createSegmentedRadios } from './segmented-radios'
import { type OpenMode } from './types'

export type LinkFormData = {
  id?: string
  groupId?: string
  name: string
  icon?: string
  type: 'url' | 'js'
  data: string
  openIn?: OpenMode
  hidden?: boolean
}

export function renderLinkForm(
  container: HTMLElement,
  data: LinkFormData,
  options: {
    root: ShadowRoot
    groups?: Array<{ id: string; name: string }>
    disableGroupSelector?: boolean
    onChange?: () => void
    onPickStart?: () => void
    onPickEnd?: () => void
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

  // Group Selector
  if (options.groups && options.groups.length > 0) {
    const grpRow = document.createElement('div')
    grpRow.className = 'row'
    const grpLabel = document.createElement('label')
    grpLabel.textContent = '分组'
    const grpSel = document.createElement('select')

    for (const g of options.groups) {
      const o = document.createElement('option')
      o.value = g.id
      o.textContent = g.name
      if (g.id === data.groupId) o.selected = true
      grpSel.append(o)
    }

    grpSel.addEventListener('change', () => {
      data.groupId = grpSel.value
      notifyChange()
    })

    if (options.disableGroupSelector) {
      grpSel.disabled = true
    }

    grpRow.append(grpLabel)
    grpRow.append(grpSel)
    grid.append(grpRow)
  }

  // Name
  const nameRow = document.createElement('div')
  nameRow.className = 'row'
  const nameLabel = document.createElement('label')
  nameLabel.textContent = '名称'
  const nameInput = document.createElement('input')
  nameInput.value = data.name || ''
  nameInput.addEventListener('input', () => {
    data.name = nameInput.value
    notifyChange()
  })
  nameRow.append(nameLabel)
  nameRow.append(nameInput)
  grid.append(nameRow)

  // Icon
  const iconRow = document.createElement('div')
  iconRow.className = 'row'
  const iconLabel = document.createElement('label')
  iconLabel.textContent = '图标'

  // We need to access iconComp inside callbacks, but it's not defined yet.
  // We use a mutable ref or just rely on the fact that callbacks run later.

  const updateIconData = () => {
    if (iconComp) {
      data.icon = iconComp.getFinal()
      notifyChange()
    }
  }

  const iconComp = createIconInput(
    data.icon || '',
    ['icon', 'favicon', 'url', 'emoji'],
    {
      labels: { icon: '图标', favicon: 'Favicon', url: 'URL', emoji: 'Emoji' },
      namePrefix: 'ushortcuts-item-icon-kind-' + (data.id || 'new'),
      onValueChange: updateIconData,
      onKindChange: updateIconData,
    }
  )
  iconRow.append(iconLabel)
  iconRow.append(iconComp.el)
  grid.append(iconRow)

  // Type Selector
  const typeRow = document.createElement('div')
  typeRow.className = 'row'
  const typeLabel = document.createElement('label')
  typeLabel.textContent = '类型'

  const typeRadios = createSegmentedRadios(
    data.type,
    ['url', 'js'] as const,
    (v) => {
      data.type = v
      syncTypeUi()
      notifyChange()
    },
    {
      labels: { url: 'URL', js: 'JS' },
      namePrefix: 'ushortcuts-item-type-' + (data.id || 'new'),
    }
  )
  typeRow.append(typeLabel)
  typeRow.append(typeRadios)
  grid.append(typeRow)

  // URL Input
  const urlRow = document.createElement('div')
  urlRow.className = 'row'
  const urlLabel = document.createElement('label')
  urlLabel.textContent = 'URL'
  const urlInput = document.createElement('input')
  urlInput.placeholder = 'https://...'
  urlInput.value = data.type === 'url' ? data.data || '/' : '/'
  urlInput.addEventListener('input', () => {
    if (data.type === 'url') {
      data.data = urlInput.value
      notifyChange()
    }
  })
  urlRow.append(urlLabel)
  urlRow.append(urlInput)
  grid.append(urlRow)

  // URL Help
  const urlHelpRow = document.createElement('div')
  urlHelpRow.className = 'row'
  const urlHelp = document.createElement('div')
  urlHelp.className = 'field-help'
  urlHelp.innerHTML = `
    <div class="field-help-title">🔗 URL 变量与示例</div>
    <div><b>基础变量：</b>{hostname}、{current_url}、{current_title}、{query}、{selected}</div>
    <div><b>高级变量：</b>{q:key} (查询参数)、{p:index} (路径片段)、{v:key} (自定义变量)</div>
    <div><b>常量文本：</b>{t:text} (编码后的文本)</div>
    <div><b>组合逻辑：</b>{selected||q:wd||t:默认值} (按顺序取非空值)</div>
    <div><b>示例：</b>https://google.com/search?q={selected}</div>
    <div>更多说明参考 <a href="https://greasyfork.org/scripts/558485-utags-shortcuts" target="_blank" rel="noopener noreferrer">GreasyFork</a></div>
  `
  urlHelpRow.append(urlHelp)
  grid.append(urlHelpRow)

  // JS Input
  const jsRow = document.createElement('div')
  jsRow.className = 'row'
  const jsLabel = document.createElement('label')
  jsLabel.textContent = 'JS'
  const jsInput = document.createElement('textarea')
  jsInput.placeholder = 'console.log("hello")\n// 或者粘贴脚本内容'
  jsInput.value = data.type === 'js' ? data.data || '' : ''
  jsInput.addEventListener('input', () => {
    if (data.type === 'js') {
      data.data = jsInput.value
      notifyChange()
    }
  })
  jsRow.append(jsLabel)
  jsRow.append(jsInput)
  grid.append(jsRow)

  // JS Help
  const jsHelpRow = document.createElement('div')
  jsHelpRow.className = 'row'
  const jsHelp = document.createElement('div')
  jsHelp.className = 'field-help'
  jsHelp.innerHTML = `
    <div class="field-help-title">🧩 JS 返回与示例</div>
    <div>JS：返回字符串或 {url, mode} 导航</div>
    <div>示例：return "http://example.com/search?query={selected||query}"</div>
    <div>示例：return { url: "http://example.com/?q={query}", mode: "new-tab" }</div>
    <div>更多使用说明参考 <a href="https://github.com/utags/userscripts" target="_blank" rel="noopener noreferrer">https://github.com/utags/userscripts</a></div>
  `
  jsHelpRow.append(jsHelp)
  grid.append(jsHelpRow)

  // Open Mode
  const openRow = document.createElement('div')
  openRow.className = 'row'
  const openLabel = document.createElement('label')
  openLabel.textContent = '打开方式'
  const openRadios = createOpenModeRadios(
    data.openIn,
    (m) => {
      data.openIn = m
      notifyChange()
    },
    { inheritLabel: '跟随分组设置' }
  )
  openRow.append(openLabel)
  openRow.append(openRadios)
  grid.append(openRow)

  // Visibility
  const visibleRow = document.createElement('div')
  visibleRow.className = 'row'
  const visibleLabel = document.createElement('label')
  visibleLabel.textContent = '显示状态'
  const stateRadios = createSegmentedRadios(
    data.hidden ? 'hidden' : 'visible',
    ['visible', 'hidden'] as const,
    (v) => {
      data.hidden = v === 'hidden'
      notifyChange()
    },
    {
      labels: { visible: '显示', hidden: '隐藏' },
      namePrefix: 'ushortcuts-item-state-' + (data.id || 'new'),
    }
  )
  visibleRow.append(visibleLabel)
  visibleRow.append(stateRadios)
  grid.append(visibleRow)

  // Quick Actions
  const quickRow = document.createElement('div')
  quickRow.className = 'row'
  const addCurrentBtn = document.createElement('button')
  addCurrentBtn.className = 'btn btn-secondary'
  addCurrentBtn.textContent = '添加当前网页'
  const pickLinksBtn = document.createElement('button')
  pickLinksBtn.className = 'btn btn-secondary'
  pickLinksBtn.textContent = '从当前网页采集链接'
  quickRow.append(addCurrentBtn)
  quickRow.append(pickLinksBtn)
  grid.append(quickRow)

  addCurrentBtn.addEventListener('click', () => {
    try {
      nameInput.value = document.title || '当前网页'
      data.name = nameInput.value

      // Update URL input if type is URL
      const currentUrl = location.href
      if (data.type === 'url') {
        urlInput.value = currentUrl
        data.data = currentUrl
      } else {
        // If JS, maybe we don't change data? Or we switch to URL?
        // Usually "Add Current Page" implies URL.
        // Let's switch to URL
        const urlRadio =
          typeRadios.querySelector<HTMLInputElement>('input[value="url"]')!
        if (urlRadio) {
          urlRadio.checked = true
          urlRadio.dispatchEvent(new Event('change'))
        }

        // data.type updated by callback
        urlInput.value = currentUrl
        data.data = currentUrl
      }

      notifyChange()
    } catch {}
  })

  pickLinksBtn.addEventListener('click', () => {
    try {
      pickLinkFromPage(options.root, {
        beforeStart() {
          if (options.onPickStart) options.onPickStart()
        },
        afterFinish() {
          if (options.onPickEnd) options.onPickEnd()
        },
        onPicked(nm, href) {
          nameInput.value = nm
          data.name = nm

          const urlRadio =
            typeRadios.querySelector<HTMLInputElement>('input[value="url"]')!
          if (urlRadio) {
            urlRadio.checked = true
            urlRadio.dispatchEvent(new Event('change'))
          }

          urlInput.value = href
          data.data = href

          notifyChange()
        },
      })
    } catch {}
  })

  // Sync UI based on type
  function syncTypeUi() {
    if (data.type === 'url') {
      urlRow.style.display = ''
      jsRow.style.display = 'none'
      quickRow.style.display = ''
      urlHelpRow.style.display = ''
      jsHelpRow.style.display = 'none'
    } else {
      urlRow.style.display = 'none'
      jsRow.style.display = ''
      quickRow.style.display = 'none'
      urlHelpRow.style.display = 'none'
      jsHelpRow.style.display = ''
    }
  }

  syncTypeUi()
  container.append(grid)
}
