import { uid } from '../../utils/uid'
import { type OpenMode } from './types'

export function createSegmentedRadios<T extends string>(
  initial: T,
  values: readonly T[],
  onChange: (v: T) => void,
  opts?: { labels?: Partial<Record<T, string>>; namePrefix?: string }
) {
  const wrap = document.createElement('div')
  wrap.className = 'segmented'
  const name = (opts?.namePrefix || 'ushortcuts-seg-') + uid()
  const labels = (opts?.labels ?? {}) as Partial<Record<T, string>>
  for (const m of values) {
    const label = document.createElement('label')
    label.className = 'seg-item'

    const input = document.createElement('input')
    input.type = 'radio'
    input.name = name
    input.value = m
    input.className = 'seg-radio'
    input.checked = initial === m
    input.addEventListener('change', () => {
      if (input.checked) onChange(m)
    })

    const text = document.createElement('span')
    text.className = 'seg-text'
    text.textContent = labels[m] ?? String(m)

    label.append(input)
    label.append(text)
    wrap.append(label)
  }

  return wrap
}

export function createOpenModeRadios(
  initial: OpenMode,
  onChange: (m: OpenMode) => void,
  opts?: { labels?: Record<OpenMode, string> }
) {
  const labels = opts?.labels ?? {
    'same-tab': '当前页',
    'new-tab': '新标签页',
  }
  return createSegmentedRadios(
    initial,
    ['same-tab', 'new-tab'] as const,
    onChange,
    {
      labels,
      namePrefix: 'ushortcuts-open-',
    }
  )
}
