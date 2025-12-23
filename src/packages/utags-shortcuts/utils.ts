import { resolveUrlTemplate } from '../../utils/url-template'
import { getFaviconUrl } from '../../utils/favicon'

export function resolveTargetUrl(data?: string) {
  const path = String(data || '').trim() || '/'
  return new URL(resolveUrlTemplate(path), location.href).href
}

export function resolveIcon(
  icon: string | undefined,
  type: string,
  data: string | undefined,
  defaultIcon?: string
) {
  const rawIcon = String(icon || '')
  let iconStr = rawIcon || defaultIcon || 'lucide:link'

  if (rawIcon.startsWith('favicon')) {
    const param = rawIcon.split(':')[1]
    const sizeNum = param ? Number.parseInt(param, 10) : 64
    const size: 16 | 32 | 64 = sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
    if (type === 'url') {
      try {
        const targetUrl = resolveTargetUrl(data)
        iconStr = 'url:' + getFaviconUrl(targetUrl, size)
      } catch {}
    } else {
      iconStr =
        'url:https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png'
    }
  }

  return iconStr
}

export function isEditableTarget(t: EventTarget | undefined) {
  const el = t as HTMLElement | undefined
  if (!el) return false
  const tag = el.tagName ? el.tagName.toLowerCase() : ''
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  const ce = (el as any).isContentEditable as boolean | undefined
  return Boolean(ce)
}
