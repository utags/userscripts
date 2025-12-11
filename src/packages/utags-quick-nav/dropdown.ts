export type DropdownItem = {
  icon: string
  label: string
  onClick: (ev: MouseEvent) => void
}

export function showDropdownMenu(
  root: ShadowRoot,
  anchor: HTMLElement,
  items: DropdownItem[],
  rightSide: boolean
) {
  for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
    n.remove()
  const menu = document.createElement('div')
  menu.className = 'quick-add-menu'
  menu.setAttribute('role', 'menu')
  for (const it of items) {
    const btn = document.createElement('button')
    btn.className = 'quick-add-item'
    btn.setAttribute('role', 'menuitem')
    btn.setAttribute('tabindex', '0')
    ;(btn as any).dataset.icon = it.icon
    btn.textContent = it.label
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      try {
        it.onClick(e)
      } finally {
        for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
          n.remove()
      }
    })
    menu.append(btn)
  }

  const r = anchor.getBoundingClientRect()
  menu.style.position = 'fixed'
  const top = Math.round(r.bottom + 6)
  if (rightSide) {
    const right = Math.round(window.innerWidth - r.right)
    menu.style.top = `${top}px`
    menu.style.right = `${right}px`
  } else {
    const left = Math.round(r.left)
    menu.style.top = `${top}px`
    menu.style.left = `${left}px`
  }

  root.append(menu)

  setTimeout(() => {
    const onOutside = () => {
      for (const n of Array.from(root.querySelectorAll('.quick-add-menu')))
        n.remove()
    }

    root.addEventListener('click', onOutside, { once: true })
    document.addEventListener('click', onOutside, { once: true })
    document.addEventListener(
      'keydown',
      (ev) => {
        if (ev.key === 'Escape') onOutside()
      },
      { once: true }
    )
  }, 0)
}
