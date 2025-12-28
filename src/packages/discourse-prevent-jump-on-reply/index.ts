import { getValue, setValue } from '../../common/gm/storage'

const SELECTOR_REPLY_BUTTON =
  '.composer-action-reply .save-or-cancel button.create'
const I18N_LABEL = {
  en: 'Prevent jump to latest post',
  'zh-CN': '防止跳转到最新帖子',
}
function getDiscourseLocale() {
  try {
    const htmlLang = (
      document.documentElement.getAttribute('lang') || ''
    ).toLowerCase()
    if (htmlLang) return htmlLang
    const bodyLang = (document.body && document.body.getAttribute('lang')) || ''
    if (bodyLang) return bodyLang.toLowerCase()
    const classes = (document.documentElement.className || '').toLowerCase()
    const m = /\blocale-([a-z-]+)/.exec(classes)
    if (m && m[1]) return m[1]
    const meta =
      document.querySelector('meta[name="language"]') ||
      document.querySelector('meta[http-equiv="content-language"]')
    const metaLang =
      meta && meta.getAttribute('content')
        ? meta.getAttribute('content')!.toLowerCase()
        : ''
    if (metaLang) return metaLang
  } catch {}

  return ''
}

function getLang() {
  const l =
    getDiscourseLocale() || String(navigator.language || '').toLowerCase()
  return l.startsWith('zh') ? 'zh-CN' : 'en'
}

const inited = new WeakSet()
function register(button: HTMLElement | undefined) {
  if (!button || inited.has(button)) return
  inited.add(button)
  ensureToggle(button)

  button.addEventListener(
    'click',
    (originalEvent) => {
      if (!getEnabled() || originalEvent.shiftKey || !originalEvent.target)
        return
      originalEvent.stopImmediatePropagation()
      originalEvent.preventDefault()
      const newEvent = new MouseEvent('click', {
        bubbles: originalEvent.bubbles,
        cancelable: originalEvent.cancelable,
        clientX: originalEvent.clientX,
        clientY: originalEvent.clientY,
        shiftKey: true,
        altKey: originalEvent.altKey,
        ctrlKey: originalEvent.ctrlKey,
        metaKey: originalEvent.metaKey,
        button: originalEvent.button,
        buttons: originalEvent.buttons,
      })
      originalEvent.target.dispatchEvent(newEvent)
    },
    true
  )
}

function scan() {
  const list = document.querySelectorAll(SELECTOR_REPLY_BUTTON)
  for (const b of list) register(b as HTMLElement)
}

function getActiveReplyButton() {
  const list = document.querySelectorAll(SELECTOR_REPLY_BUTTON)
  return (
    Array.from(list).find((b) => Boolean((b as HTMLElement).offsetParent)) ||
    list[0] ||
    null
  )
}

document.addEventListener(
  'keydown',
  (e) => {
    if (
      getEnabled() &&
      (e.metaKey || e.ctrlKey) &&
      (e.key === 'Enter' || e.code === 'Enter')
    ) {
      e.stopImmediatePropagation()
      e.preventDefault()
      const btn = getActiveReplyButton()
      if (btn) {
        const ev = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          shiftKey: true,
        })
        btn.dispatchEvent(ev)
      }
    }
  },
  true
)

const KEY = 'dpjor_enabled:' + (location.hostname || '')
let enabledFlag = false
function getEnabled() {
  return Boolean(enabledFlag)
}

async function loadEnabled() {
  try {
    const val = await getValue<string>(KEY, '0')
    enabledFlag = val === '1'
    updateToggleUI()
  } catch {
    enabledFlag = false
  }
}

async function setEnabled(v: boolean) {
  enabledFlag = Boolean(v)
  try {
    await setValue(KEY, v ? '1' : '0')
  } catch {}
}

function updateToggleUI() {
  try {
    const cbs = document.querySelectorAll<HTMLInputElement>(
      '.dpjor-toggle input[type="checkbox"]'
    )
    for (const cb of Array.from(cbs)) cb.checked = getEnabled()
  } catch {}
}

function ensureToggle(button) {
  const container = button.closest('.save-or-cancel') || button.parentElement
  if (!container || container.querySelector('.dpjor-toggle')) return
  const label = document.createElement('label')
  label.className = 'dpjor-toggle'
  label.style.marginLeft = '8px'
  label.style.display = 'inline-flex'
  label.style.alignItems = 'center'
  label.style.gap = '6px'
  const cb = document.createElement('input')
  cb.type = 'checkbox'
  cb.checked = getEnabled()
  const span = document.createElement('span')
  span.textContent = I18N_LABEL[getLang()] || I18N_LABEL.en
  cb.addEventListener('change', () => {
    void setEnabled(cb.checked)
  })
  label.append(cb)
  label.append(span)
  container.append(label)
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void loadEnabled()
scan()
const mo = new MutationObserver(() => {
  scan()
})
mo.observe(document.documentElement || document.body, {
  childList: true,
  subtree: true,
})
