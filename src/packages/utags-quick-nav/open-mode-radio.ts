export function createOpenModeRadios(
  initial: 'same-tab' | 'new-tab',
  onChange: (m: 'same-tab' | 'new-tab') => void,
  opts?: { labels?: Record<'same-tab' | 'new-tab', string> }
) {
  const wrap = document.createElement('div')
  wrap.className = 'segmented'
  const name = 'utqn-open-' + Math.random().toString(36).slice(2, 8)
  const labels = opts?.labels ?? {
    'same-tab': '当前页',
    'new-tab': '新标签页',
  }
  for (const m of ['same-tab', 'new-tab'] as Array<'same-tab' | 'new-tab'>) {
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
    text.textContent = labels[m] ?? m

    label.append(input)
    label.append(text)
    wrap.append(label)
  }

  return wrap
}
