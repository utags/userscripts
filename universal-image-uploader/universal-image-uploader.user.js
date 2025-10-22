// ==UserScript==
// @name               Universal Image Uploader
// @name:zh-CN         通用图片上传助手
// @namespace          https://github.com/utags
// @homepageURL        https://github.com/utags/userscripts#readme
// @supportURL         https://github.com/utags/userscripts/issues
// @version            0.0.1
// @description        Paste/drag/select images, batch upload to Imgur; auto-copy Markdown/HTML/BBCode/link; site button integration with SPA observer; local history.
// @description:zh-CN  通用图片上传与插入：支持粘贴/拖拽/选择，批量上传至 Imgur；自动复制 Markdown/HTML/BBCode/链接；可为各站点插入按钮并适配 SPA；保存本地历史。
// @author             Pipecraft
// @license            MIT
// @icon               data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSI+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTAiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTMyIDIwbC0xMiAxMmg3djE4aDEwVjMyaDdsLTEyLTEyeiIgZmlsbD0iIzFmMjkzNyIvPjwvc3ZnPg==
// @noframes
// @match              *://*/*
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_addStyle
// @grant              GM_registerMenuCommand
// @grant              GM_setClipboard
// @grant              GM_addValueChangeListener
// @connect            api.imgur.com
// ==/UserScript==

;(function () {
  'use strict'

  // Imgur Client ID 池（参考 upload-image.ts）
  const IMGUR_CLIENT_IDS = [
    '3107b9ef8b316f3',
    '442b04f26eefc8a',
    '59cfebe717c09e4',
    '60605aad4a62882',
    '6c65ab1d3f5452a',
    '83e123737849aa9',
    '9311f6be1c10160',
    'c4a4a563f698595',
    '81be04b9e4a08ce',
  ]

  const HISTORY_KEY = 'iu_history'
  const FORMAT_MAP_KEY = 'iu_format_map'
  const DEFAULT_FORMAT = 'markdown'
  const siteKey = () => {
    let h = location.hostname || ''
    return h.startsWith('www.') ? h.slice(4) : h
  }
  const getFormat = () => {
    const map = GM_getValue(FORMAT_MAP_KEY, {})
    return map[siteKey()] || DEFAULT_FORMAT
  }
  const setFormat = (fmt) => {
    const map = GM_getValue(FORMAT_MAP_KEY, {})
    map[siteKey()] = fmt
    GM_setValue(FORMAT_MAP_KEY, map)
  }
  // 站点按钮设置（选择器/位置/文字）
  const BTN_SETTINGS_MAP_KEY = 'iu_site_btn_settings_map'
  const getSiteBtnSettings = () => {
    const map = GM_getValue(BTN_SETTINGS_MAP_KEY, {})
    return map[siteKey()] || null
  }
  const setSiteBtnSettings = (cfg) => {
    const map = GM_getValue(BTN_SETTINGS_MAP_KEY, {})
    const key = siteKey()
    const selector = (cfg?.selector || '').trim()
    if (!selector) {
      delete map[key]
    } else {
      // 规范化插入位置（英文）：'before' | 'after' | 'inside'
      const p = (cfg?.position || '').trim()
      const pos =
        p === 'before' ? 'before' : p === 'inside' ? 'inside' : 'after'
      map[key] = {
        selector,
        position: pos,
        text: cfg?.text || '插入图片',
      }
    }
    GM_setValue(BTN_SETTINGS_MAP_KEY, map)
  }
  const MAX_HISTORY = 50

  const createEl = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag)
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'text') el.textContent = v
      else if (k === 'class') el.className = v
      else el.setAttribute(k, v)
    })
    children.forEach((c) => el.appendChild(c))
    return el
  }

  const css = `
  #iu-panel { position: fixed; right: 16px; bottom: 16px; z-index: 999999; width: 440px; background: #111827cc; color: #fff; backdrop-filter: blur(6px); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.25); font-family: system-ui, -apple-system, Segoe UI, Roboto; }
  #iu-panel header { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; font-weight: 600; }
  #iu-panel header .actions { display:flex; gap:8px; }
  #iu-panel .body { padding: 8px 12px; }
  #iu-panel .controls { display:flex; align-items:center; gap:8px; flex-wrap: wrap; }
  #iu-panel select, #iu-panel button { font-size: 12px; padding: 6px 10px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; }
  #iu-panel button.primary { background:#2563eb; border-color:#1d4ed8; }
  #iu-panel .progress { font-size: 12px; opacity:.9; }
  #iu-panel .list { margin-top:8px; max-height: 140px; overflow-y:auto; overflow-x:hidden; font-size: 12px; }
  #iu-panel .list .item { padding:6px 0; border-bottom: 1px dashed #334155; white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
  #iu-panel .history { display:none; margin-top:8px; }
  #iu-panel.show-history .history { display:block; }
  #iu-panel .history .list { max-height: 240px; }
  #iu-panel .history .row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 0; border-bottom: 1px dashed #334155; }
  #iu-panel .history .row .ops { display:flex; gap:6px; }
  #iu-panel .history .row .name { display:block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #iu-panel .hint { font-size: 11px; opacity:.85; margin-top:6px; }
  #iu-drop { position: fixed; inset: 0; background: rgba(37,99,235,.12); border: 2px dashed #2563eb; display:none; align-items:center; justify-content:center; z-index: 999998; color:#2563eb; font-size: 18px; font-weight: 600; }
  #iu-drop.show { display:flex; }
  .iu-insert-btn { font-size: 12px; padding: 4px 8px; border-radius: 6px; border: 1px solid #334155; background:#1f2937; color:#fff; cursor:pointer; }
  #iu-panel .settings { display:none; margin-top:8px; }
  #iu-panel.show-settings .settings { display:block; }
  `
  GM_addStyle(css)

  function loadHistory() {
    return GM_getValue(HISTORY_KEY, [])
  }
  function saveHistory(list) {
    GM_setValue(HISTORY_KEY, list.slice(0, MAX_HISTORY))
  }

  function addToHistory(entry) {
    const list = loadHistory()
    list.unshift(entry)
    saveHistory(list)
  }

  function basename(name) {
    const n = (name || '').trim()
    if (!n) return 'image'
    return n.replace(/\.[^.]+$/, '')
  }

  function formatText(link, name, fmt) {
    const alt = basename(name)
    switch (fmt) {
      case 'html':
        return `<img src="${link}" alt="${alt}" />`
      case 'bbcode':
        return `[img]${link}[/img]`
      case 'link':
        return link
      default:
        return `![${alt}](${link})`
    }
  }

  async function uploadToImgur(file) {
    // 随机打乱 Client-ID 列表，保证每次失败后更换不同 ID
    const ids = [...IMGUR_CLIENT_IDS]
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
    }

    let lastError
    for (const id of ids) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await fetch('https://api.imgur.com/3/upload', {
          method: 'POST',
          headers: { Authorization: `Client-ID ${id}` },
          body: formData,
        })
        if (!res.ok) {
          lastError = new Error('网络错误')
          continue
        }
        const data = await res.json()
        if (data?.success && data?.data?.link) {
          return data.data.link
        }
        lastError = new Error('上传失败')
      } catch (e) {
        lastError = e
      }
    }

    throw lastError || new Error('上传失败')
  }

  function insertIntoFocused(text) {
    const el = document.activeElement
    if (!el) return false
    try {
      if (
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLInputElement && el.type === 'text')
      ) {
        const start = el.selectionStart ?? el.value.length
        const end = el.selectionEnd ?? el.value.length
        const v = el.value
        el.value = v.slice(0, start) + text + v.slice(end)
        el.dispatchEvent(new Event('input', { bubbles: true }))
        return true
      }
      if (el instanceof HTMLElement && el.isContentEditable) {
        document.execCommand('insertText', false, text)
        return true
      }
    } catch {}
    return false
  }

  function copyAndInsert(text) {
    try {
      GM_setClipboard(text)
    } catch {}
    insertIntoFocused(text)
  }

  function createPanel() {
    const panel = createEl('div', { id: 'iu-panel' })
    const header = createEl('header')
    header.appendChild(createEl('span', { text: '图片上传' }))
    const actions = createEl('div', { class: 'actions' })
    const toggleHistoryBtn = createEl('button', { text: '历史' })
    toggleHistoryBtn.addEventListener('click', () => {
      panel.classList.toggle('show-history')
      renderHistory()
    })
    const settingsBtn = createEl('button', { text: '设置' })
    settingsBtn.addEventListener('click', () => {
      panel.classList.toggle('show-settings')
      try {
        refreshSettingsUI()
      } catch {}
    })
    const closeBtn = createEl('button', { text: '关闭' })
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none'
    })
    actions.appendChild(toggleHistoryBtn)
    actions.appendChild(settingsBtn)
    actions.appendChild(closeBtn)
    header.appendChild(actions)

    const body = createEl('div', { class: 'body' })
    const controls = createEl('div', { class: 'controls' })

    const format = getFormat()
    const formatSel = createEl('select')
    ;[
      ['markdown', 'Markdown'],
      ['html', 'HTML'],
      ['bbcode', 'BBCode'],
      ['link', '链接'],
    ].forEach(([val, label]) => {
      const opt = createEl('option', { value: val, text: label })
      if (val === format) opt.selected = true
      formatSel.appendChild(opt)
    })
    formatSel.addEventListener('change', () => setFormat(formatSel.value))
    // 新增：抽取文件选择逻辑为函数，供按钮与菜单复用
    function openFilePicker() {
      const input = createEl('input', {
        type: 'file',
        accept: 'image/*',
        multiple: 'true',
        style: 'display:none',
      })
      input.addEventListener('change', () => {
        if (input.files?.length) handleFiles(Array.from(input.files))
      })
      input.click()
    }

    // 选择图片按钮（调用统一的 openFilePicker）
    const selectBtn = createEl('button', { class: 'primary', text: '选择图片' })
    selectBtn.addEventListener('click', openFilePicker)

    const progressEl = createEl('span', { class: 'progress', text: '完成 0/0' })

    controls.appendChild(formatSel)
    controls.appendChild(selectBtn)
    controls.appendChild(progressEl)
    body.appendChild(controls)

    const list = createEl('div', { class: 'list' })
    body.appendChild(list)

    const hint = createEl('div', {
      class: 'hint',
      text: '支持粘贴图片、拖拽图片到页面或点击选择图片进行批量上传',
    })
    body.appendChild(hint)

    const history = createEl('div', { class: 'history' })
    body.appendChild(history)

    // 设置面板：站点“插入图片”按钮配置
    const settings = createEl('div', { class: 'settings' })
    const settingsHeader = createEl('div', { class: 'controls' })
    settingsHeader.appendChild(createEl('span', { text: '站点按钮设置' }))
    settings.appendChild(settingsHeader)
    const settingsForm = createEl('div', { class: 'controls' })
    const selInput = createEl('input', {
      type: 'text',
      placeholder: 'CSS 选择器',
    })
    const posSel = createEl('select')
    ;[
      { value: 'before', text: '之前' },
      { value: 'after', text: '之后' },
      { value: 'inside', text: '里面' },
    ].forEach(({ value, text }) => {
      const opt = createEl('option', { value, text })
      if (value === 'after') opt.selected = true
      posSel.appendChild(opt)
    })
    const textInput = createEl('input', {
      type: 'text',
      placeholder: '按钮内容（可为 HTML）',
    })
    textInput.value = '插入图片'
    const saveBtn = createEl('button', { text: '保存并插入' })
    saveBtn.addEventListener('click', () => {
      setSiteBtnSettings({
        selector: selInput.value,
        position: posSel.value,
        text: textInput.value,
      })
      document.querySelectorAll('.iu-insert-btn').forEach((el) => el.remove())
      applySiteButton()
      try {
        restartSiteButtonObserver()
      } catch {}
    })
    const removeBtn = createEl('button', { text: '移除按钮（临时）' })
    removeBtn.addEventListener('click', () => {
      document.querySelectorAll('.iu-insert-btn').forEach((el) => el.remove())
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch {}
    })
    const clearBtn = createEl('button', { text: '清空设置' })
    clearBtn.addEventListener('click', () => {
      setSiteBtnSettings({ selector: '' })
      document.querySelectorAll('.iu-insert-btn').forEach((el) => el.remove())
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch {}
    })
    settingsForm.appendChild(selInput)
    settingsForm.appendChild(posSel)
    settingsForm.appendChild(textInput)
    settingsForm.appendChild(saveBtn)
    settingsForm.appendChild(removeBtn)
    settingsForm.appendChild(clearBtn)
    settings.appendChild(settingsForm)
    body.appendChild(settings)

    function refreshSettingsUI() {
      const cur = getSiteBtnSettings() || {
        selector: '',
        position: 'after',
        text: '插入图片',
      }
      selInput.value = cur.selector || ''
      Array.from(posSel.options).forEach((opt) => {
        opt.selected = opt.value === (cur.position || 'after')
      })
      textInput.value = cur.text || '插入图片'
    }

    panel.appendChild(header)
    panel.appendChild(body)
    document.body.appendChild(panel)
    // 默认隐藏面板，避免初始显示
    panel.style.display = 'none'

    // 根据站点设置，在指定位置插入“插入图片”按钮
    function applySiteButton() {
      const cfg = getSiteBtnSettings()
      if (!cfg?.selector) return
      let target
      try {
        target = document.querySelector(cfg.selector)
      } catch (e) {
        return
      }
      if (!target) return
      const posRaw = (cfg.position || '').trim()
      const pos =
        posRaw === 'before'
          ? 'before'
          : posRaw === 'inside'
            ? 'inside'
            : 'after'
      const exists =
        pos === 'inside'
          ? !!target.querySelector('.iu-insert-btn')
          : pos === 'before'
            ? !!(
                target.previousElementSibling &&
                target.previousElementSibling.classList?.contains(
                  'iu-insert-btn'
                )
              )
            : !!(
                target.nextElementSibling &&
                target.nextElementSibling.classList?.contains('iu-insert-btn')
              )
      if (exists) return
      let btn
      const content = (cfg.text || '插入图片').trim()
      try {
        const t = document.createElement('template')
        t.innerHTML = content
        if (t.content && t.content.childElementCount === 1) {
          btn = t.content.firstElementChild
        }
      } catch {}
      if (!btn) {
        btn = createEl('button', { class: 'iu-insert-btn', text: content })
      } else {
        btn.classList.add('iu-insert-btn')
      }
      btn.addEventListener('click', (event) => {
        panel.style.display = 'block'
        event.preventDefault()
        try {
          openFilePicker()
        } catch {}
      })
      if (pos === 'before') {
        target.insertAdjacentElement('beforebegin', btn)
      } else if (pos === 'inside') {
        target.insertAdjacentElement('beforeend', btn)
      } else {
        target.insertAdjacentElement('afterend', btn)
      }
    }
    applySiteButton()

    // SPA/延迟渲染：观察 DOM，目标出现即插入按钮
    let siteBtnObserver
    function restartSiteButtonObserver() {
      try {
        if (siteBtnObserver) siteBtnObserver.disconnect()
      } catch {}
      const cfg = getSiteBtnSettings()
      if (!cfg?.selector) {
        siteBtnObserver = null
        return
      }
      let inserted = false
      const checkAndInsert = () => {
        if (inserted) return
        let target
        try {
          target = document.querySelector(cfg.selector)
        } catch (e) {
          return
        }
        if (!target) return
        const posRaw = (cfg.position || '').trim()
        const pos =
          posRaw === 'before'
            ? 'before'
            : posRaw === 'inside'
              ? 'inside'
              : 'after'
        const exists =
          pos === 'inside'
            ? !!target.querySelector('.iu-insert-btn')
            : pos === 'before'
              ? !!(
                  target.previousElementSibling &&
                  target.previousElementSibling.classList?.contains(
                    'iu-insert-btn'
                  )
                )
              : !!(
                  target.nextElementSibling &&
                  target.nextElementSibling.classList?.contains('iu-insert-btn')
                )
        if (!exists) {
          applySiteButton()
        }
        const existsAfter =
          pos === 'inside'
            ? !!target.querySelector('.iu-insert-btn')
            : pos === 'before'
              ? !!(
                  target.previousElementSibling &&
                  target.previousElementSibling.classList?.contains(
                    'iu-insert-btn'
                  )
                )
              : !!(
                  target.nextElementSibling &&
                  target.nextElementSibling.classList?.contains('iu-insert-btn')
                )
        if (existsAfter) {
          inserted = true
          try {
            siteBtnObserver.disconnect()
          } catch {}
        }
      }
      checkAndInsert()
      siteBtnObserver = new MutationObserver(() => checkAndInsert())
      siteBtnObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      })
    }
    restartSiteButtonObserver()

    // Drop 覆盖层
    const drop = createEl('div', { id: 'iu-drop', text: '释放以上传图片' })
    document.body.appendChild(drop)

    // 队列与并发
    const queue = []
    let running = 0
    let done = 0
    let total = 0
    const CONCURRENCY = 3

    function updateProgress() {
      progressEl.textContent = `完成 ${done}/${total}`
    }

    function addLog(text) {
      list.prepend(createEl('div', { class: 'item', text }))
    }

    async function processQueue() {
      while (running < CONCURRENCY && queue.length) {
        const item = queue.shift()
        running++
        addLog(`上传中：${item.file.name}`)
        try {
          const link = await uploadToImgur(item.file)
          const fmt = getFormat()
          const out = formatText(link, item.file.name, fmt)
          copyAndInsert(out)
          addToHistory({
            link,
            name: item.file.name,
            ts: Date.now(),
            pageUrl: location.href,
          })
          addLog(`✅ 成功：${item.file.name} → ${link}`)
        } catch (e) {
          addLog(`❌ 失败：${item.file.name}（${e?.message || e}）`)
        } finally {
          running--
          done++
          updateProgress()
        }
      }
    }

    function handleFiles(files) {
      const imgs = files.filter((f) => f.type.includes('image'))
      if (!imgs.length) return
      total += imgs.length
      updateProgress()
      imgs.forEach((file) => queue.push({ file }))
      processQueue()
    }

    // 粘贴图片
    document.addEventListener(
      'paste',
      (event) => {
        const items = event.clipboardData?.items
        if (!items) return
        const imageItem = Array.from(items).find((i) =>
          i.type.includes('image')
        )
        const file = imageItem?.getAsFile()
        if (file) handleFiles([file])
      },
      true
    )

    // 拖拽上传
    document.addEventListener('dragover', (e) => {
      drop.classList.add('show')
      e.preventDefault()
    })
    document.addEventListener('dragleave', () => drop.classList.remove('show'))
    document.addEventListener('drop', (event) => {
      drop.classList.remove('show')
      event.preventDefault()
      const files = event.dataTransfer?.files
      if (files?.length) handleFiles(Array.from(files))
    })

    function renderHistory() {
      history.innerHTML = ''
      const header = createEl('div', { class: 'controls' })
      header.appendChild(
        createEl('span', { text: `历史（${loadHistory().length}）` })
      )
      const clearBtn = createEl('button', { text: '清空' })
      clearBtn.addEventListener('click', () => {
        saveHistory([])
        renderHistory()
      })
      header.appendChild(clearBtn)
      history.appendChild(header)

      const listWrap = createEl('div', { class: 'list' })
      const items = loadHistory()
      items.forEach((it) => {
        const row = createEl('div', { class: 'row' })
        // 预览图片
        const preview = createEl('img', {
          src: it.link,
          style:
            'width:48px;height:48px;object-fit:cover;border-radius:4px;border:1px solid #334155;',
        })
        row.appendChild(preview)

        // 信息栏：名称与来源网址
        const info = createEl('div', {
          style:
            'flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding:0 8px;',
        })
        info.appendChild(
          createEl('span', {
            class: 'name',
            text: it.name || it.link,
            title: it.name || it.link,
          })
        )
        if (it.pageUrl) {
          let host = it.pageUrl
          try {
            host = new URL(it.pageUrl).hostname
          } catch {}
          const pageLink = createEl('a', {
            href: it.pageUrl,
            text: `上传页面：${host}`,
            target: '_blank',
            rel: 'noopener noreferrer',
            style: 'color:#93c5fd;text-decoration:none;font-size:11px;',
          })
          info.appendChild(pageLink)
        }
        row.appendChild(info)

        const ops = createEl('div', { class: 'ops' })
        const copyBtn = createEl('button', { text: '复制' })
        copyBtn.addEventListener('click', () => {
          const fmt = getFormat()
          const out = formatText(it.link, it.name || 'image', fmt)
          copyAndInsert(out)
        })
        const openBtn = createEl('button', { text: '打开' })
        openBtn.addEventListener('click', () => window.open(it.link, '_blank'))
        ops.appendChild(copyBtn)
        ops.appendChild(openBtn)
        row.appendChild(ops)
        listWrap.appendChild(row)
      })
      history.appendChild(listWrap)
    }

    // 监听历史记录的变化，实时刷新列表
    try {
      if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener(
          HISTORY_KEY,
          function (name, oldValue, newValue, remote) {
            renderHistory()
          }
        )
      }
    } catch {}

    GM_registerMenuCommand('打开图片上传面板', () => {
      panel.style.display = 'block'
    })
    GM_registerMenuCommand('选择图片', () => {
      panel.style.display = 'block'
      openFilePicker()
    })
    GM_registerMenuCommand('设置', () => {
      panel.style.display = 'block'
      panel.classList.add('show-settings')
      try {
        refreshSettingsUI()
      } catch {}
    })

    return { handleFiles }
  }

  // 初始化
  if (!document.getElementById('iu-panel')) {
    const { handleFiles } = createPanel()
    // 支持通过菜单外部触发（例如其他脚本集成）
    window.addEventListener('iu:uploadFiles', (e) => {
      const files = e.detail?.files
      if (files?.length) handleFiles(files)
    })
  }
})()
