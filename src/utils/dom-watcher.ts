type Callback = () => void

// --- URL Watcher ---
const urlCallbacks = new Set<Callback>()
let urlWatcherInstalled = false

function triggerUrlCallbacks() {
  for (const cb of urlCallbacks) {
    try {
      cb()
    } catch (error) {
      console.error(error)
    }
  }
}

export function onUrlChange(callback: Callback): () => void {
  urlCallbacks.add(callback)
  if (!urlWatcherInstalled) {
    installUrlWatcher()
    urlWatcherInstalled = true
  }

  return () => {
    urlCallbacks.delete(callback)
  }
}

function installUrlWatcher() {
  try {
    const origPush = history.pushState
    history.pushState = function (...args: any[]) {
      const ret = origPush.apply(history, args as any)
      triggerUrlCallbacks()
      return ret
    } as typeof history.pushState
  } catch {}

  try {
    const origReplace = history.replaceState
    history.replaceState = function (...args: any[]) {
      const ret = origReplace.apply(history, args as any)
      triggerUrlCallbacks()
      return ret
    } as typeof history.replaceState
  } catch {}

  globalThis.addEventListener('popstate', triggerUrlCallbacks)
  globalThis.addEventListener('hashchange', triggerUrlCallbacks)
}

// --- DOM Watcher ---
const domCallbacks = new Set<Callback>()
let domObserver: MutationObserver | undefined

function triggerDomCallbacks() {
  for (const cb of domCallbacks) {
    try {
      cb()
    } catch (error) {
      console.error(error)
    }
  }
}

export function onDomChange(callback: Callback): () => void {
  domCallbacks.add(callback)
  ensureDomObserver()
  return () => {
    domCallbacks.delete(callback)
  }
}

function ensureDomObserver() {
  if (domObserver) return

  const root = document.body || document.documentElement
  if (!root) {
    // If body/documentElement is not ready, wait for it
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          ensureDomObserver()
        },
        { once: true }
      )
    }

    return
  }

  domObserver = new MutationObserver(() => {
    triggerDomCallbacks()
  })

  domObserver.observe(root, {
    childList: true,
    subtree: true,
  })
}
