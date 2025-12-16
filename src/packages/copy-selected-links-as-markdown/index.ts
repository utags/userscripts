import { registerMenu } from '../../common/gm'

function escapeMD(s: string) {
  s = String(s || '')
  return s.replaceAll('|', '\\|').replaceAll('[', '\\[').replaceAll(']', '\\]')
}

function getSelectionAnchors(): HTMLAnchorElement[] {
  const sel = globalThis.getSelection()
  if (!sel || sel.rangeCount === 0) return []
  const set = new Set<HTMLAnchorElement>()
  for (let i = 0; i < sel.rangeCount; i++) {
    const range = sel.getRangeAt(i)
    const common = range.commonAncestorContainer
    const rootEl: Element | undefined =
      common.nodeType === Node.TEXT_NODE
        ? ((common as Text).parentElement as HTMLElement | undefined)
        : (common as Element | undefined)
    if (rootEl) {
      const as = rootEl.querySelectorAll('a[href]')
      for (const a of Array.from(as)) {
        if (a instanceof HTMLAnchorElement) {
          try {
            if (range.intersectsNode(a)) set.add(a)
          } catch {}
        }
      }
    }

    let startNode: Node | undefined = range.startContainer
    if (startNode && startNode.nodeType === Node.TEXT_NODE)
      startNode = (startNode as Text).parentElement as HTMLElement | undefined
    let cur: HTMLElement | undefined =
      startNode instanceof HTMLElement ? startNode : undefined
    while (cur) {
      if (cur instanceof HTMLAnchorElement && cur.getAttribute('href')) {
        set.add(cur)
        break
      }

      cur = cur.parentElement as HTMLElement | undefined
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
    const name = textSel || (a.textContent || '').trim() || a.href
    const url = new URL(a.getAttribute('href') || a.href, origin).href
    return `[${escapeMD(name)}](${escapeMD(url)})`
  }

  if (anchors.length > 1) {
    return anchors
      .map((a) => {
        const name = (a.textContent || '').trim() || a.href
        const url = new URL(a.getAttribute('href') || a.href, origin).href
        return `- [${escapeMD(name)}](${escapeMD(url)})`
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

async function copyText(s: string) {
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
  registerMenu('复制选中链接为 Markdown', run)
} catch {}

globalThis.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyM') {
    e.preventDefault()
    run()
  }
})
