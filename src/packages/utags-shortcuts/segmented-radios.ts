import { uid } from '../../utils/uid'

export function createSegmentedRadios<T extends string>(
  initial: T,
  values: readonly T[],
  onChange: (v: T) => void,
  opts?: { labels?: Partial<Record<T, string>>; namePrefix?: string }
) {
  const wrap = document.createElement('div')
  wrap.className = 'segmented'
  const name = (opts?.namePrefix || 'utqn-seg-') + uid()
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
  initial: 'same-tab' | 'new-tab',
  onChange: (m: 'same-tab' | 'new-tab') => void,
  opts?: { labels?: Record<'same-tab' | 'new-tab', string> }
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
      namePrefix: 'utqn-open-',
    }
  )
}
