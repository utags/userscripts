/**
 * Generates a favicon URL for a given website
 *
 * @param href - The URL of the website
 * @param size - The desired favicon size (16, 32, or 64 pixels)
 * @returns URL to the favicon image
 *
 * TODO:
 * - Add cache mechanism: cache[href][size]
 * - Implement fallback to first letter image when favicon is not available. Use first letter of title or domain.
 */
export function getFaviconUrl(href: string, size: 16 | 32 | 64 = 64) {
  // Google favicon service URLs for reference:
  // https://www.google.com/s2/favicons?domain=google.com&sz=64
  // https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=64

  try {
    const domain = new URL(href, location.origin).origin
    const url = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domain}&size=${size}`
    const wrapUrl = `https://wsrv.nl/?w=${size}&h=${size}&url=${encodeURIComponent(url)}&default=${defaultFavicons[size]}`
    return wrapUrl
  } catch (error) {
    console.error('Error generating favicon URL:', error)
    return decodeURIComponent(defaultFavicons[size])
  }
}

export function getWrappedIconUrl(href: string, size: 16 | 32 | 64 = 64) {
  try {
    const url = new URL(href, location.origin).toString()
    if (url.startsWith('https://wsrv.nl/')) {
      return url
    }

    const wrapUrl = `https://wsrv.nl/?w=${size}&h=${size}&url=${encodeURIComponent(url)}&default=${defaultFavicons[size]}`
    return wrapUrl
  } catch (error) {
    console.error('Error generating favicon URL:', error)
    return decodeURIComponent(defaultFavicons[size])
  }
}

export const defaultFavicon16 = encodeURIComponent(
  'https://wsrv.nl/?w=16&h=16&url=th.bing.com/th?id=ODLS.A2450BEC-5595-40BA-9F13-D9EC6AB74B9F'
)
export const defaultFavicon32 = encodeURIComponent(
  'https://wsrv.nl/?w=32&h=32&url=th.bing.com/th?id=ODLS.A2450BEC-5595-40BA-9F13-D9EC6AB74B9F'
)
export const defaultFavicon64 = encodeURIComponent(
  'https://wsrv.nl/?w=64&h=64&url=th.bing.com/th?id=ODLS.A2450BEC-5595-40BA-9F13-D9EC6AB74B9F'
)

export const defaultFavicons = {
  16: defaultFavicon16,
  32: defaultFavicon32,
  64: defaultFavicon64,
}
