import { getFaviconUrl } from '../../utils/favicon'
import { resolveUrlTemplate } from '../../utils/url-template'

export function resolveTargetUrl(
  data?: string,
  extraResolvers?: (key: string) => string | undefined
) {
  const path = String(data || '').trim() || '/'
  return new URL(resolveUrlTemplate(path, extraResolvers), location.href).href
}

export function resolveIcon(
  icon: string | undefined,
  type: string,
  data: string | undefined,
  options?: {
    defaultIcon?: string
    extraResolvers?: (key: string) => string | undefined
  }
) {
  const rawIcon = String(icon || '')
  let iconStr = rawIcon || options?.defaultIcon || 'lucide:link'

  if (rawIcon.startsWith('favicon')) {
    const param = rawIcon.split(':')[1]
    const sizeNum = param ? Number.parseInt(param, 10) : 64
    const size: 16 | 32 | 64 = sizeNum === 32 ? 32 : sizeNum === 64 ? 64 : 64
    if (type === 'url') {
      try {
        const targetUrl = resolveTargetUrl(data, options?.extraResolvers)
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
