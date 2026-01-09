import { getFaviconUrl } from '../../utils/favicon'
import { uid } from '../../utils/uid'
import { extractDomain, isSameOrigin } from '../../utils/url'
import { resolveUrlTemplate } from '../../utils/url-template'
import { shortcutsStore } from './store'

// import { t } from '../../common/i18n' // Removed as i18n module doesn't exist

/**
 * Initialize Discourse integration
 */
export function initDiscourseSidebar() {
  const root = document.querySelector('.discourse-root')
  if (root) {
    observeModal(root)
  } else {
    // Watch for .discourse-root
    const observer = new MutationObserver(() => {
      const root = document.querySelector('.discourse-root')
      if (root) {
        observer.disconnect()
        observeModal(root)
      }
    })
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    })
  }
}

/**
 * Observe for the custom sidebar section modal
 */
function observeModal(root?: Element) {
  const observer = new MutationObserver(() => {
    const form = document.querySelector<HTMLFormElement>(
      'form.sidebar-section-form'
    )
    if (form && !form.querySelector('.import-from-utags')) {
      injectImportButton(form)
    }
  })

  observer.observe(root || document.body || document.documentElement, {
    childList: true,
    subtree: true,
  })
}

/**
 * Inject "Import from UTags Shortcuts" button
 */
function injectImportButton(form: HTMLFormElement) {
  const addLinkBtn = form.querySelector('.btn.add-link')
  if (!addLinkBtn || !addLinkBtn.parentNode) return

  // 1. Import Button
  const importBtn = document.createElement('button')
  importBtn.className = 'btn btn-icon-text btn-flat btn-text import-from-utags'
  importBtn.type = 'button'

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('class', 'fa d-icon d-icon-download svg-icon svg-string')
  icon.setAttribute('aria-hidden', 'true')
  icon.style.width = '.75em'
  icon.style.height = '.75em'
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('href', '#download')
  icon.append(use)

  const label = document.createElement('span')
  label.className = 'd-button-label'
  label.textContent = '从 UTags Shortcuts 导入'

  importBtn.append(icon, label)

  importBtn.addEventListener('click', () => {
    void showImportDialog(form)
  })

  // 1.5 Import JSON Button
  const importJsonBtn = document.createElement('button')
  importJsonBtn.className =
    'btn btn-icon-text btn-flat btn-text import-from-json'
  importJsonBtn.type = 'button'

  const iconJson = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  iconJson.setAttribute(
    'class',
    'fa d-icon d-icon-download svg-icon svg-string'
  )
  iconJson.setAttribute('aria-hidden', 'true')
  iconJson.style.width = '.75em'
  iconJson.style.height = '.75em'
  const useJson = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  useJson.setAttribute('href', '#download')
  iconJson.append(useJson)

  const labelJson = document.createElement('span')
  labelJson.className = 'd-button-label'
  labelJson.textContent = '从 JSON 文件导入'

  importJsonBtn.append(iconJson, labelJson)

  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = '.json'
  fileInput.style.display = 'none'
  importJsonBtn.append(fileInput)

  importJsonBtn.addEventListener('click', () => {
    fileInput.click()
  })

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (data && Array.isArray(data.items)) {
        showToast(`成功读取 JSON 文件`, form)
        importGroup(data, form)
      } else {
        alert('无效的 JSON 文件格式：缺少 items 数组')
      }
    } catch (error) {
      console.error(error)
      alert('读取或解析 JSON 文件失败')
    }

    fileInput.value = ''
  })

  // 2. Export Button
  const exportBtn = document.createElement('button')
  exportBtn.className = 'btn btn-icon-text btn-flat btn-text export-to-json'
  exportBtn.type = 'button'

  const iconExport = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )
  iconExport.setAttribute(
    'class',
    'fa d-icon d-icon-upload svg-icon svg-string'
  )
  iconExport.setAttribute('aria-hidden', 'true')
  iconExport.style.width = '.75em'
  iconExport.style.height = '.75em'
  const useExport = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'use'
  )
  useExport.setAttribute('href', '#upload')
  iconExport.append(useExport)

  const labelExport = document.createElement('span')
  labelExport.className = 'd-button-label'
  labelExport.textContent = '导出为 JSON 文件'

  exportBtn.append(iconExport, labelExport)

  exportBtn.addEventListener('click', () => {
    exportToJson(form)
  })

  const importRow = document.createElement('div')
  importRow.style.marginTop = '0.5rem'
  importRow.style.marginLeft = '-0.5rem'
  importRow.style.display = 'block'
  importRow.style.textAlign = 'left'
  importRow.append(importBtn)

  const importJsonRow = document.createElement('div')
  importJsonRow.style.marginTop = '0.5rem'
  importJsonRow.style.marginLeft = '-0.5rem'
  importJsonRow.style.display = 'block'
  importJsonRow.style.textAlign = 'left'
  importJsonRow.append(importJsonBtn)

  const exportRow = document.createElement('div')
  exportRow.style.marginTop = '0.5rem'
  exportRow.style.marginLeft = '-0.5rem'
  exportRow.style.display = 'block'
  exportRow.style.textAlign = 'left'
  exportRow.append(exportBtn)

  addLinkBtn.parentNode.insertBefore(importRow, addLinkBtn.nextSibling)
  importRow.after(importJsonRow)
  importJsonRow.after(exportRow)
}

function exportToJson(form: HTMLFormElement) {
  const sectionNameInput = form.querySelector<HTMLInputElement>('#section-name')
  const sectionName = sectionNameInput?.value || 'Discourse Sidebar'

  const items: any[] = []
  const rows = form.querySelectorAll('.sidebar-section-form-link')
  for (const row of rows) {
    const nameInput = row.querySelector<HTMLInputElement>(
      'input[name="link-name"]'
    )
    const urlInput = row.querySelector<HTMLInputElement>(
      'input[name="link-url"]'
    )
    if (nameInput && urlInput && nameInput.value && urlInput.value) {
      if (nameInput.value.includes('[隐藏]')) continue

      items.push({
        id: uid(),
        name: nameInput.value,
        type: 'url',
        data: urlInput.value,
        openIn: getOpenInType(urlInput.value),
      })
    }
  }

  if (items.length === 0) {
    showToast('没有可导出的链接', form)
    return
  }

  const hostname = globalThis.location.hostname
  const exportData = {
    id: `${hostname.replaceAll('.', '_')}_${uid()}`,
    name: sectionName,
    icon: `url:${getFaviconUrl(globalThis.location.origin)}`,
    match: [`*://${hostname}/*`],
    defaultOpen: 'same-tab',
    items,
    itemsPerRow: 1,
  }

  const date = new Date()
  const timestamp = `${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(
    date.getHours()
  ).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(
    date.getSeconds()
  ).padStart(2, '0')}`

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `utags-shortcuts-data-${timestamp}.json`
  a.click()
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)

  showToast(`已导出 ${items.length} 项`, form)
}

function getOpenInType(url: string): 'same-tab' | 'new-tab' {
  // If not same origin, always new-tab
  if (!isSameOrigin(url)) {
    return 'new-tab'
  }

  // Same origin checks
  try {
    const u = new URL(url, globalThis.location.href)
    // Special paths that should open in new tab
    if (u.pathname.startsWith('/pub/') || u.pathname.startsWith('/challenge')) {
      return 'new-tab'
    }
  } catch {}

  return 'same-tab'
}

/**
 * Show a dialog to select a group to import
 */
async function showImportDialog(form: Element) {
  const config = await shortcutsStore.load()
  if (!config.groups || config.groups.length === 0) {
    alert('UTags Shortcuts 中没有可导入的分组')
    return
  }

  // Create a simple selection modal
  const dialog = document.createElement('dialog')
  dialog.style.padding = '20px'
  dialog.style.borderRadius = '8px'
  dialog.style.border = '1px solid #ccc'
  dialog.style.position = 'fixed'
  dialog.style.top = '50%'
  dialog.style.left = '50%'
  dialog.style.transform = 'translate(-50%, -50%)'
  dialog.style.zIndex = '9999'
  dialog.style.backgroundColor = 'var(--secondary)'
  dialog.style.color = 'var(--primary)'

  const title = document.createElement('h3')
  title.textContent = '选择要导入的分组'
  dialog.append(title)

  const list = document.createElement('div')
  list.style.margin = '10px 0'
  list.style.maxHeight = '300px'
  list.style.overflowY = 'auto'

  for (const group of config.groups) {
    const item = document.createElement('div')
    item.style.padding = '5px'
    item.style.cursor = 'pointer'
    item.style.borderBottom = '1px solid #eee'
    item.textContent = `${group.name} (${group.items.length} 项)`
    item.addEventListener('click', () => {
      importGroup(group, form)
      dialog.close()
      dialog.remove()
    })
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = '#f0f0f0'
    })
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = 'transparent'
    })
    list.append(item)
  }

  dialog.append(list)

  const closeBtn = document.createElement('button')
  closeBtn.textContent = '取消'
  closeBtn.className = 'btn'
  closeBtn.addEventListener('click', () => {
    dialog.close()
    dialog.remove()
  })
  dialog.append(closeBtn)

  document.body.append(dialog)
  dialog.showModal()
}

/**
 * Import items from a group into the form
 */
function importGroup(group: any, form: Element) {
  // 1. Fill section name if empty
  const nameInput = form.querySelector<HTMLInputElement>('#section-name')
  if (nameInput && !nameInput.value) {
    nameInput.value = group.name
    nameInput.dispatchEvent(new Event('input', { bubbles: true }))
    nameInput.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // 2. Add links
  const addLinkBtn = form.querySelector<HTMLButtonElement>('.btn.add-link')
  if (!addLinkBtn) return

  // We need to wait for rows to be added. Since Discourse uses Ember,
  // clicking "Add Link" might take a moment to render the row.
  // Strategy: Click add link, wait for new row, fill it. Repeat.

  void processItems(group.items, addLinkBtn, form)
}

function showToast(message: string, form: Element) {
  let toast = form.querySelector('.utags-toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.className = 'utags-toast'
    const style = (toast as HTMLElement).style
    style.background = '#e7f5ff' // Light blue
    style.color = 'var(--primary)'
    style.padding = '8px 12px'
    style.borderRadius = '4px'
    style.fontSize = '12px'
    style.marginTop = '10px'
    style.border = '1px solid #b3d7ff'
    style.display = 'none'

    // Insert after the last link row or at the end of form content
    const addLinkBtn = form.querySelector('.btn.add-link')
    if (addLinkBtn) {
      addLinkBtn.before(toast)
    } else {
      form.append(toast)
    }
  }

  const timerId = (toast as HTMLElement).dataset.timerId
  if (timerId) {
    clearTimeout(Number(timerId))
  }

  toast.textContent = message
  ;(toast as HTMLElement).style.display = 'block'
  toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  const newTimerId = globalThis.setTimeout(() => {
    ;(toast as HTMLElement).style.display = 'none'
  }, 10_000)

  ;(toast as HTMLElement).dataset.timerId = String(newTimerId)
}

async function processItems(
  items: any[],
  addBtn: HTMLButtonElement,
  form: Element
) {
  // 1. Get existing URLs
  const existingUrls = new Set<string>()
  for (const input of form.querySelectorAll<HTMLInputElement>(
    'input[name="link-url"]'
  )) {
    if (input.value) existingUrls.add(input.value)
  }

  let countTotal = 0
  let countTypeFiltered = 0
  let countVarFiltered = 0
  let countDupFiltered = 0

  const urlItems = items
    .filter((item) => {
      countTotal++
      if (item.type !== 'url') {
        countTypeFiltered++
        return false
      }

      return true
    })
    .map((item) => {
      // Check and replace variables in URL
      let processedUrl = processUrl(item.data)
      if (!processedUrl) {
        countVarFiltered++
        return undefined
      }

      // Convert absolute URL to relative if same origin
      if (isSameOrigin(processedUrl)) {
        try {
          // Intentionally do not pass base to new URL:
          // - Absolute URLs parse successfully and we convert them to relative (pathname + search + hash)
          // - Relative URLs will throw here and fall into catch, leaving them unchanged
          const u = new URL(processedUrl)
          processedUrl = u.pathname + u.search + u.hash
        } catch {}
      }

      if (processedUrl.startsWith('?')) {
        countVarFiltered++
        return undefined
      }

      return { ...item, url: processedUrl }
    })
    .filter((item): item is typeof item => {
      if (!item) return false
      if (existingUrls.has(item.url)) {
        countDupFiltered++
        return false
      }

      existingUrls.add(item.url) // Add to set to filter duplicates within the import list itself
      return true
    })

  if (urlItems.length === 0) {
    showToast(
      `无可用导入项 (总数: ${countTotal}, 类型过滤: ${countTypeFiltered}, 变量过滤: ${countVarFiltered}, 重复过滤: ${countDupFiltered})`,
      form
    )
    return
  }

  // 1. Click add button N times
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < urlItems.length; i++) {
    addBtn.click()
  }

  // 2. Wait for rows to appear
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 100))

  // 3. Fill rows
  const rows = form.querySelectorAll<HTMLDivElement>(
    '.sidebar-section-form-link'
  )
  // We fill the last N rows
  const startIndex = Math.max(0, rows.length - urlItems.length)

  for (const [index, item] of urlItems.entries()) {
    const row = rows[startIndex + index]
    if (row) {
      fillRow(row, item)
    }
  }

  // 4. Clean empty rows that may exist before import
  for (const row of form.querySelectorAll<HTMLDivElement>(
    '.sidebar-section-form-link'
  )) {
    const nameInput = row.querySelector<HTMLInputElement>(
      'input[name="link-name"]'
    )
    const urlInput = row.querySelector<HTMLInputElement>(
      'input[name="link-url"]'
    )
    const deleteBtn = row.querySelector<HTMLButtonElement>('button.delete-link')
    const name = nameInput?.value.trim() ?? ''
    const url = urlInput?.value.trim() ?? ''
    if (!name && !url && deleteBtn) {
      deleteBtn.click()
    }
  }

  showToast(
    `导入 ${urlItems.length} 项 (总数: ${countTotal}, 类型过滤: ${countTypeFiltered}, 变量过滤: ${countVarFiltered}, 重复过滤: ${countDupFiltered})`,
    form
  )
}

function processUrl(url: string): string | undefined {
  if (!url) return undefined

  const allowedVars = new Set([
    'hostname',
    'hostname_without_www',
    'hostname_top_level',
  ])
  const re = /{([^}]+)}/g

  // Check for disallowed variables
  let hasDisallowed = false
  // Use matchAll or simply test
  const matches = url.match(re)
  if (matches) {
    for (const match of matches) {
      // match is like "{hostname}" or "{query||hostname}"
      const content = match.slice(1, -1) // remove { and }
      const parts = content.split('||').map((p) => p.trim())
      // If any part is NOT in allowedVars, reject
      if (!parts.every((p) => allowedVars.has(p))) {
        hasDisallowed = true
        break
      }
    }
  }

  if (hasDisallowed) return undefined

  // Perform replacement
  return resolveUrlTemplate(url)
}

function fillRow(row: Element, item: any) {
  const nameInput = row.querySelector<HTMLInputElement>(
    'input[name="link-name"]'
  )
  const urlInput = row.querySelector<HTMLInputElement>('input[name="link-url"]')

  if (nameInput) {
    nameInput.value = item.name
    nameInput.dispatchEvent(new Event('input', { bubbles: true }))
    nameInput.dispatchEvent(new Event('change', { bubbles: true }))
  }

  if (urlInput) {
    urlInput.value = item.url
    urlInput.dispatchEvent(new Event('input', { bubbles: true }))
    urlInput.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // Icon handling is complex because it uses a custom selector.
  // For now we skip icon or try to set a default one if possible,
  // but Discourse icon picker is non-trivial to interact with programmatically without internal APIs.
}
