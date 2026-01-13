export function watchTitleChange(callback: () => void) {
  try {
    const titleObserver = new MutationObserver(() => {
      callback()
    })

    let currentTitle: Element | undefined

    const updateTitleObserver = () => {
      const titleEl = document.querySelector('title') ?? undefined
      if (titleEl === currentTitle) return

      if (currentTitle) {
        titleObserver.disconnect()
      }

      currentTitle = titleEl
      if (currentTitle) {
        titleObserver.observe(currentTitle, {
          childList: true,
          subtree: true,
          characterData: true,
        })
        callback()
      }
    }

    updateTitleObserver()

    const headObserver = new MutationObserver(updateTitleObserver)
    if (document.head) {
      headObserver.observe(document.head, { childList: true })
    }

    return () => {
      titleObserver.disconnect()
      headObserver.disconnect()
    }
  } catch {
    return () => {
      // Do nothing
    }
  }
}
