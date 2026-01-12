import { debounce } from '../../utils/async'
import { clearChildren } from '../../utils/dom'
import { setIcon } from '../../utils/icon'
import { createSegmentedRadios } from './segmented-radios'

export type IconKind = 'icon' | 'favicon' | 'url' | 'emoji'

export function detectIconKind(
  v: string,
  kinds: readonly IconKind[]
): IconKind {
  const s = String(v || '').trim()
  if (kinds.includes('favicon') && s.startsWith('favicon')) return 'favicon'
  if (s.startsWith('url:')) return 'url'
  if (s.includes(':')) return 'icon'
  if (s) return 'emoji'
  return 'icon'
}

export function createIconInput(
  initialValue: string,
  kinds: readonly IconKind[],
  opts?: {
    labels?: Partial<Record<IconKind, string>>
    placeholders?: Partial<Record<IconKind, string>>
    namePrefix?: string
    onKindChange?: (k: IconKind) => void
    onValueChange?: (raw: string) => void
  }
) {
  const wrap = document.createElement('div')
  wrap.style.flex = '1'

  const inputContainer = document.createElement('div')
  inputContainer.style.display = 'flex'
  inputContainer.style.alignItems = 'center'
  inputContainer.style.gap = '0.5em'

  const preview = document.createElement('span')
  preview.style.display = 'inline-flex'
  preview.style.alignItems = 'center'
  preview.style.justifyContent = 'center'
  preview.style.width = '1.5em'
  preview.style.height = '1.em'

  const input = document.createElement('input')
  try {
    ;(input.style as any).width = '100%'
  } catch {}

  inputContainer.append(preview)
  inputContainer.append(input)

  const help = document.createElement('div')
  help.className = 'field-help'
  try {
    ;(help.style as any).marginLeft = '0'
    ;(help.style as any).marginTop = '0.8em'
  } catch {}

  let kind: IconKind = detectIconKind(initialValue, kinds)

  const radios = createSegmentedRadios(
    kind,
    kinds,
    (v) => {
      kind = v
      syncPlaceholder()
      input.value = ''
      if (typeof opts?.onKindChange === 'function') opts.onKindChange(kind)
      updatePreview()
      syncHelp()
    },
    { labels: opts?.labels ?? ({} as any), namePrefix: opts?.namePrefix }
  )

  function syncPlaceholder() {
    const p = opts?.placeholders ?? {}
    input.placeholder =
      kind === 'icon'
        ? (p.icon ?? 'home | search | folder | file | ...')
        : kind === 'favicon'
          ? (p.favicon ?? '16 | 32 | 64')
          : kind === 'url'
            ? (p.url ?? 'https://...')
            : (p.emoji ?? '🔥 | 🍓 | 🎾 | ...')
  }

  {
    const raw = String(initialValue || '')
    let shown = raw
    switch (kind) {
      case 'icon': {
        shown = raw.includes(':') ? raw.split(':').pop() || '' : raw
        break
      }

      case 'favicon': {
        if (raw.startsWith('favicon')) {
          const param = raw.split(':')[1]
          shown = param || ''
        }

        break
      }

      case 'url': {
        shown = raw.startsWith('url:') ? raw.slice(4) : raw
        break
      }

      case 'emoji': {
        shown = raw
        break
      }
    }

    input.value = shown
  }

  const debouncedUpdatePreview = debounce(updatePreview, 500)

  input.addEventListener('change', () => {
    debouncedUpdatePreview()
    if (typeof opts?.onValueChange === 'function') {
      opts.onValueChange(input.value)
    }
  })

  input.addEventListener('input', () => {
    debouncedUpdatePreview()
  })

  syncPlaceholder()
  updatePreview()
  syncHelp()

  const br = document.createElement('div')
  br.style.flexBasis = '100%'

  wrap.append(radios)
  wrap.append(br)
  wrap.append(inputContainer)
  wrap.append(help)

  function updatePreview() {
    const finalValue = getFinalValue()
    clearChildren(preview)
    if (finalValue && !finalValue.startsWith('favicon')) {
      setIcon(preview, finalValue)
    }
  }

  function getFinalValue(): string | undefined {
    const raw = input.value.trim()
    // favicon 模式下允许为空
    if (!raw && kind !== 'favicon') return undefined
    switch (kind) {
      case 'icon': {
        return raw.includes(':') ? raw : 'lucide:' + raw
      }

      case 'favicon': {
        const sizeNum = Number.parseInt(raw, 10)
        const s: 16 | 32 | 64 =
          sizeNum === 16 ? 16 : sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
        return 'favicon' + (raw ? ':' + String(s) : '')
      }

      case 'url': {
        return raw.startsWith('url:') ? raw : 'url:' + raw
      }

      case 'emoji': {
        return raw
      }
    }
  }

  function syncHelp() {
    clearChildren(help)
    switch (kind) {
      case 'icon': {
        const line = document.createElement('div')
        line.append('查找图标： ')
        const a = document.createElement('a')
        a.href = 'https://lucide.dev/icons/'
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = 'https://lucide.dev/icons/'
        line.append(a)
        help.append(line)
        break
      }

      case 'favicon': {
        const line = document.createElement('div')
        line.textContent = '无预览效果'
        help.append(line)
        break
      }

      case 'url': {
        const line = document.createElement('div')
        line.textContent = '请输入图片 URL'
        help.append(line)
        break
      }

      case 'emoji': {
        const line = document.createElement('div')
        line.textContent = '请输入一个 emoji'
        help.append(line)
        break
      }
    }
  }

  return {
    el: wrap,
    input,
    radios,
    getKind: () => kind,
    setKind(k: IconKind) {
      kind = k
      syncPlaceholder()
    },
    getRaw: () => input.value,
    getFinal: getFinalValue,
  }
}
