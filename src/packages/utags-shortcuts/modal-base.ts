import { clearChildren } from '../../utils/dom'

export type ModalOptions = {
  title: string
  root: ShadowRoot
  onClose?: () => void
}

export function createModalFrame(options: ModalOptions) {
  const { root, title, onClose } = options

  // Capture previous focus to restore later
  const previousFocus = root.activeElement || document.activeElement

  // Remove existing
  for (const n of Array.from(root.querySelectorAll('.modal-mask'))) n.remove()

  const mask = document.createElement('div')
  mask.className = 'modal-mask'
  try {
    ;(mask.style as any).zIndex = '2147483647'
  } catch {}

  const modal = document.createElement('div')
  modal.className = 'modal'
  // Prevent scroll chaining to body when modal scroll hits boundary
  modal.style.overscrollBehavior = 'contain'
  modal.tabIndex = -1

  // Dark mode detection
  try {
    const panel = root.querySelector('.ushortcuts')
    const isDarkPanel = panel?.classList.contains('dark')
    const prefersDark = (() => {
      try {
        return globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches
      } catch {
        return false
      }
    })()
    if (isDarkPanel || prefersDark) modal.classList.add('dark')
  } catch {}

  const h2 = document.createElement('h2')
  h2.textContent = title
  modal.append(h2)

  const body = document.createElement('div')
  modal.append(body)

  const actions = document.createElement('div')
  actions.className = 'row actions'
  modal.append(actions)

  mask.append(modal)
  root.append(mask)

  // Scroll Lock (prevent background scroll without hiding scrollbar)
  const preventBackgroundScroll = (e: Event) => {
    // If the event target is NOT inside the modal, prevent default (scrolling)
    // We use composedPath to handle Shadow DOM
    const path = e.composedPath()
    if (!path.includes(modal)) {
      e.preventDefault()
    }
  }

  // Use passive: false to allow preventDefault
  document.addEventListener('wheel', preventBackgroundScroll, {
    passive: false,
  })
  document.addEventListener('touchmove', preventBackgroundScroll, {
    passive: false,
  })

  const close = () => {
    try {
      mask.remove()
    } catch {}

    try {
      document.removeEventListener('keydown', onKey, true)
      document.removeEventListener('wheel', preventBackgroundScroll)
      document.removeEventListener('touchmove', preventBackgroundScroll)
    } catch {}

    if (onClose) onClose()

    // Restore focus
    try {
      if (previousFocus && 'focus' in previousFocus) {
        ;(previousFocus as HTMLElement).focus()
      }
    } catch {}
  }

  const onKey = (e: KeyboardEvent) => {
    const visible = root.contains(mask) && modal.style.display !== 'none'
    if (!visible) return

    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }

    if (e.key === 'Tab') {
      // Focus Trap
      const focusables = Array.from(
        modal.querySelectorAll(
          'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !(el as HTMLElement).hasAttribute('disabled')
      ) as HTMLElement[]

      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      // Check active element in shadow root
      const current = root.activeElement as HTMLElement | undefined

      if (e.shiftKey) {
        if (current === first || !modal.contains(current as Node)) {
          e.preventDefault()
          last.focus()
        }
      } else if (current === last || !modal.contains(current as Node)) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  document.addEventListener('keydown', onKey, true)

  // Initial focus
  requestAnimationFrame(() => {
    const focusables = modal.querySelectorAll(
      'input, button, [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length > 0) {
      ;(focusables[0] as HTMLElement).focus()
    }
  })

  return {
    mask,
    modal,
    body,
    actions,
    close,
  }
}
