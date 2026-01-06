import { ProgressBar } from '../common/progress-bar'
import { doc } from '../globals/doc'
import { win } from '../globals/win'
import { isSameOrigin } from './url'

let progressBar: ProgressBar | undefined

function isVueApp() {
  // Vue does not work pushState
  return false
  // let isVue = false
  // for (const div of doc.querySelectorAll('div')) {
  //   for (const k of Object.keys(div.dataset)) {
  //     if (k.startsWith('v-')) {
  //       isVue = true
  //       break
  //     }
  //   }
  // }

  // return isVue
}

function isSpa() {
  return (
    // doc.querySelector('#__next') !== null ||
    // doc.querySelector('#app') !== null ||
    // doc.querySelector('#root') !== null ||
    // doc.querySelector('[ng-version]') !== null ||
    // doc.querySelector('meta[name="next-head-count"]') !== null ||
    doc.querySelector('.ember-application') !== null || isVueApp()
  )
}

function isForceLocationAssign(url: string) {
  const rules = [
    'https://linux.do/challenge?redirect=',
    'https://linux.do/?safe_mode=',
  ]
  return rules.some((rule) => url.includes(rule))
}

export function navigateUrl(url: string) {
  if (!progressBar) {
    progressBar = new ProgressBar()
  }

  progressBar.start()

  try {
    if (isSameOrigin(url) && !isForceLocationAssign(url)) {
      if (
        document.querySelector('script[src*="/_next/"],link[href*="/_next/"]')
      ) {
        // Try Next.js router via script injection (to access page's window.next)
        try {
          const key = 'ushortcutsNextNavigated'
          const code = `
            try {
            console.log('window.next', window.next)
              if (window.next && window.next.router && typeof window.next.router.push === 'function') {
                window.next.router.push(${JSON.stringify(url)});
                document.documentElement.dataset['${key}'] = '1';
              }
            } catch (e) {}
          `
          const s = document.createElement('script')
          s.textContent = code
          document.documentElement.append(s)
          s.remove()

          if (document.documentElement.dataset[key] === '1') {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete document.documentElement.dataset[key]
            setTimeout(() => {
              progressBar?.finish()
            }, 800)
            return
          }
        } catch {}
      }

      // if ((win as any).navigation !== undefined) {
      //   ;(win as any).navigation.navigate(url)
      //   return
      // }

      console.log('isSpa', isSpa())

      if (isSpa()) {
        win.history.pushState(null, '', url)
        win.dispatchEvent(new PopStateEvent('popstate'))
        win.scrollTo(0, 0)
        setTimeout(() => {
          progressBar?.finish()
        }, 800)
        return
      }
    }
  } catch {}

  win.location.assign(url)
}
