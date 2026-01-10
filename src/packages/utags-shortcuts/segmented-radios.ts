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
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  initial: OpenMode | undefined | null | string,
  onChange: (m: OpenMode | undefined) => void,
  opts?: { labels?: Record<OpenMode, string>; inheritLabel?: string }
) {
  const labels = opts?.labels ?? {
    'same-tab': '当前页',
    'new-tab': '新标签页',
  }
  const hasInherit = Boolean(opts?.inheritLabel)
  const values = hasInherit
    ? (['inherit', 'same-tab', 'new-tab'] as const)
    : (['same-tab', 'new-tab'] as const)

  const current =
    initial === 'same-tab' || initial === 'new-tab'
      ? initial
      : hasInherit
        ? 'inherit'
        : 'same-tab'

  const labelMap: Record<string, string> = { ...labels }
  if (hasInherit && opts?.inheritLabel) {
    labelMap.inherit = opts.inheritLabel
  }

  return createSegmentedRadios(
    current,
    values,
    (v) => {
      if (v === 'inherit') onChange(undefined)
      else onChange(v as OpenMode)
    },
    {
      labels: labelMap,
      namePrefix: 'ushortcuts-open-',
    }
  )
}
