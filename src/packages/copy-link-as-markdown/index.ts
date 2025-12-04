function escapeMD(s) {
  s = String(s || '')
  return s.replaceAll('|', '\\|').replaceAll('[', '\\[').replaceAll(']', '\\]')
}

function getSelectionAnchors() {
  const sel = globalThis.getSelection()
  if (!sel || sel.rangeCount === 0) return []
  const set = new Set()
  for (let i = 0; i < sel.rangeCount; i++) {
    const range = sel.getRangeAt(i)
    let root = range.commonAncestorContainer
    if (root && root.nodeType === Node.TEXT_NODE) root = root.parentElement
    if (root && root.querySelectorAll) {
      const as = root.querySelectorAll('a[href]')
      for (const a of as) {
        try {
          if (range.intersectsNode(a)) set.add(a)
        } catch {}
      }
    }

    let node = range.startContainer
    if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement
    while (node && node instanceof HTMLElement) {
      if (node.tagName === 'A' && node.href) {
        set.add(node)
        break
      }

      node = node.parentElement
    }
  }

  return Array.from(set)
}

function buildMarkdown() {
  const sel = globalThis.getSelection()
  const textSel = sel ? sel.toString().trim() : ''
  const anchors = getSelectionAnchors()
  const origin = location.origin
  if (anchors.length === 1) {
    const a = anchors[0]
    const name = textSel || a.textContent.trim() || a.href
    const url = new URL(a.getAttribute('href'), origin).href
    return `[${escapeMD(name)}](${escapeMD(url)})`
  }

  if (anchors.length > 1) {
    return anchors
      .map((a) => {
        const name = a.textContent.trim() || a.href
        const url = new URL(a.getAttribute('href'), origin).href
        return `[${escapeMD(name)}](${escapeMD(url)})`
      })
      .join('\n')
  }

  if (textSel) {
    const m = /https?:\/\/[^\s)]+/.exec(textSel)
    if (m) {
      const url = m[0]
      const name = textSel.length > url.length ? textSel : url
      return `[${escapeMD(name)}](${escapeMD(url)})`
    }
  }

  return `[${escapeMD(document.title)}](${escapeMD(location.href)})`
}

async function copyText(s) {
  try {
    await navigator.clipboard.writeText(s)
    return
  } catch {}

  try {
    const ta = document.createElement('textarea')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    ta.value = s
    document.body.append(ta)
    ta.focus()
    ta.select()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand('copy')
    ta.remove()
  } catch {}
}

function run() {
  const md = buildMarkdown()
  void copyText(md)
}

try {
  const gmRegisterMenuCommand = (globalThis as any).GM_registerMenuCommand
  if (typeof gmRegisterMenuCommand === 'function') {
    gmRegisterMenuCommand('复制选中链接为 Markdown', run)
  }
} catch {}

globalThis.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyM') {
    e.preventDefault()
    run()
  }
})
