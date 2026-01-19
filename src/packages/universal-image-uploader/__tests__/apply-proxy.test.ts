import { describe, expect, it } from 'vitest'

import { applyProxy, applyProxyChain } from '../apply-proxy.js'

describe('applyProxy', () => {
  const baseUrl = 'https://example.com/image.png'
  const useWebpFalse = false
  const useWebpTrue = true

  it('returns original url when proxy is none', () => {
    const result = applyProxy(baseUrl, {
      providerKey: 'other',
      originalName: 'image.png',
      proxy: 'none',
      useWebp: useWebpFalse,
    })
    expect(result).toBe(baseUrl)
  })

  it('falls back to original url when proxy is unknown', () => {
    const result = applyProxy(baseUrl, {
      providerKey: 'other',
      originalName: 'image.png',
      proxy: 'unknown',
      useWebp: useWebpFalse,
    })
    expect(result).toBe(baseUrl)
  })

  it('applies wsrv.nl for non-gif non-imgur providers', () => {
    const result = applyProxy(baseUrl, {
      providerKey: 'mjj',
      originalName: 'image.png',
      proxy: 'wsrv.nl',
      useWebp: useWebpFalse,
    })
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const urlObj = new URL(result)
    const urlParam = urlObj.searchParams.get('url')!
    const defaultParam = urlObj.searchParams.get('default')
    expect(defaultParam).toBe(urlParam)
    expect(urlParam).toBe(baseUrl)
    const nParam = urlObj.searchParams.get('n')
    expect(nParam).toBeNull()
  })

  it('uses provided defaultUrl for wsrv.nl', () => {
    const defaultUrl = 'https://fallback.example.com/image.png'
    const result = applyProxy(baseUrl, {
      providerKey: 'mjj',
      originalName: 'image.png',
      proxy: 'wsrv.nl',
      defaultUrl,
      useWebp: useWebpFalse,
    })
    const urlObj = new URL(result)
    const urlParam = urlObj.searchParams.get('url')!
    const defaultParam = urlObj.searchParams.get('default')
    expect(urlParam).toBe(baseUrl)
    expect(defaultParam!).toBe(defaultUrl)
  })

  it('detects imgur url and uses wsrv.nl-duckduckgo when providerKey is missing', () => {
    const imgurUrl = 'https://i.imgur.com/test.png'
    const result = applyProxy(imgurUrl, {
      originalName: 'test.png',
      proxy: 'wsrv.nl',
      useWebp: useWebpFalse,
    })
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const wsrvUrl = new URL(result)
    const wrappedUrlParam = wsrvUrl.searchParams.get('url')!
    const ddgUrl = new URL(wrappedUrlParam)
    expect(ddgUrl.hostname).toBe('external-content.duckduckgo.com')
    const originalParam = ddgUrl.searchParams.get('u')!
    expect(originalParam).toBe(imgurUrl)
  })

  it('defaults to ordinary wsrv.nl when providerKey is missing and url is not imgur', () => {
    const otherUrl = 'https://example.com/test.png'
    const result = applyProxy(otherUrl, {
      originalName: 'test.png',
      proxy: 'wsrv.nl',
      useWebp: useWebpFalse,
    })
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const urlObj = new URL(result)
    const urlParam = urlObj.searchParams.get('url')!
    // check it is NOT wrapped in duckduckgo
    expect(urlParam).toBe(otherUrl)
    // Double check it's not the ddg url
    expect(urlParam).not.toContain('external-content.duckduckgo.com')
  })

  it('adds n=-1 when original name is gif for wsrv.nl', () => {
    const gifUrl = 'https://example.com/anim.gif'
    const result = applyProxy(gifUrl, {
      providerKey: 'mjj',
      originalName: 'anim.gif',
      proxy: 'wsrv.nl',
      useWebp: useWebpFalse,
    })
    const urlObj = new URL(result)
    const nParam = urlObj.searchParams.get('n')
    expect(nParam).toBe('-1')
    const urlParam = urlObj.searchParams.get('url')!
    expect(urlParam).toBe(gifUrl)
  })

  it('uses wsrv.nl-duckduckgo pipeline for imgur provider with wsrv.nl', () => {
    const imgurUrl = 'https://i.imgur.com/example.png'
    const result = applyProxy(imgurUrl, {
      providerKey: 'imgur',
      originalName: 'example.gif',
      proxy: 'wsrv.nl',
      useWebp: useWebpFalse,
    })
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const wsrvUrl = new URL(result)
    const wrappedUrlParam = wsrvUrl.searchParams.get('url')!
    const ddgUrl = new URL(wrappedUrlParam)
    expect(ddgUrl.hostname).toBe('external-content.duckduckgo.com')
    const originalParam = ddgUrl.searchParams.get('u')!
    expect(originalParam).toBe(imgurUrl)
    const nParam = wsrvUrl.searchParams.get('n')
    expect(nParam).toBe('-1')
  })

  it('wraps url with duckduckgo proxy', () => {
    const result = applyProxy(baseUrl, {
      providerKey: 'other',
      originalName: 'image.png',
      proxy: 'duckduckgo',
      useWebp: useWebpFalse,
    })
    expect(
      result.startsWith('https://external-content.duckduckgo.com/iu/?u=')
    ).toBe(true)
    const urlObj = new URL(result)
    const uParam = urlObj.searchParams.get('u')!
    const decoded = uParam
    expect(() => {
      const parsed = new URL(decoded)
      return parsed
    }).not.toThrow()
  })

  it('applies wsrv.nl-duckduckgo proxy directly', () => {
    const gifUrl = 'https://example.com/anim.gif'
    const result = applyProxy(gifUrl, {
      providerKey: 'other',
      originalName: 'anim.gif',
      proxy: 'wsrv.nl-duckduckgo',
      useWebp: useWebpFalse,
    })
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const wsrvUrl = new URL(result)
    const urlParam = wsrvUrl.searchParams.get('url')!
    const ddgUrl = new URL(urlParam)
    expect(ddgUrl.hostname).toBe('external-content.duckduckgo.com')
    const originalParam = ddgUrl.searchParams.get('u')!
    expect(originalParam).toBe(gifUrl)
    const nParam = wsrvUrl.searchParams.get('n')
    expect(nParam).toBe('-1')
  })

  it('uses provided defaultUrl for wsrv.nl-duckduckgo', () => {
    const defaultUrl = 'https://fallback.example.com/anim.gif'
    const gifUrl = 'https://example.com/anim.gif'
    const result = applyProxy(gifUrl, {
      providerKey: 'other',
      originalName: 'anim.gif',
      proxy: 'wsrv.nl-duckduckgo',
      defaultUrl,
      useWebp: useWebpFalse,
    })
    const wsrvUrl = new URL(result)
    const urlParam = wsrvUrl.searchParams.get('url')!
    const ddgUrl = new URL(urlParam)
    expect(ddgUrl.hostname).toBe('external-content.duckduckgo.com')
    const originalParam = ddgUrl.searchParams.get('u')!
    expect(originalParam).toBe(gifUrl)
    const defaultParam = wsrvUrl.searchParams.get('default')
    expect(defaultParam!).toBe(defaultUrl)
  })

  it('ignores defaultUrl for duckduckgo when webp is disabled', () => {
    const defaultUrl = 'https://fallback.example.com/image.png'
    const result = applyProxy(baseUrl, {
      providerKey: 'other',
      originalName: 'image.png',
      proxy: 'duckduckgo',
      defaultUrl,
      useWebp: useWebpFalse,
    })
    expect(
      result.startsWith('https://external-content.duckduckgo.com/iu/?u=')
    ).toBe(true)
    const urlObj = new URL(result)
    const uParam = urlObj.searchParams.get('u')!
    expect(uParam).toBe(baseUrl)
    // duckduckgo proxy implementation currently ignores defaultUrl when webp is false
    expect(result).not.toContain(encodeURIComponent('fallback.example.com'))
  })

  describe('when webp is enabled', () => {
    it('adds output=webp for wsrv.nl', () => {
      const result = applyProxy(baseUrl, {
        providerKey: 'mjj',
        originalName: 'image.png',
        proxy: 'wsrv.nl',
        useWebp: useWebpTrue,
      })
      const urlObj = new URL(result)
      expect(urlObj.searchParams.get('output')).toBe('webp')
    })

    it('adds output=webp for wsrv.nl-duckduckgo pipeline', () => {
      const result = applyProxy(baseUrl, {
        providerKey: 'other',
        originalName: 'image.png',
        proxy: 'wsrv.nl-duckduckgo',
        useWebp: useWebpTrue,
      })
      const urlObj = new URL(result)
      expect(urlObj.searchParams.get('output')).toBe('webp')
    })

    it('converts to wsrv.nl(webp) then wraps in duckduckgo when proxy is duckduckgo', () => {
      const result = applyProxy(baseUrl, {
        providerKey: 'other',
        originalName: 'image.png',
        proxy: 'duckduckgo',
        useWebp: useWebpTrue,
      })
      // Should be DDG -> wsrv.nl -> original
      expect(
        result.startsWith('https://external-content.duckduckgo.com/iu/?u=')
      ).toBe(true)
      const ddgUrl = new URL(result)
      const uParam = ddgUrl.searchParams.get('u')!
      const innerUrl = uParam

      expect(innerUrl.startsWith('https://wsrv.nl/?url=')).toBe(true)
      const innerObj = new URL(innerUrl)
      expect(innerObj.searchParams.get('output')).toBe('webp')

      // Verify inner wsrv.nl wraps original url
      const innerUrlParam = innerObj.searchParams.get('url')!
      expect(innerObj.searchParams.get('default')).toBe(innerUrlParam)
      expect(innerUrlParam).toBe(baseUrl)
    })

    it('uses provided defaultUrl for duckduckgo when webp is enabled', () => {
      const defaultUrl = 'https://fallback.example.com/image.png'
      const result = applyProxy(baseUrl, {
        providerKey: 'other',
        originalName: 'image.png',
        proxy: 'duckduckgo',
        defaultUrl,
        useWebp: useWebpTrue,
      })
      // Should be DDG -> wsrv.nl -> original
      expect(
        result.startsWith('https://external-content.duckduckgo.com/iu/?u=')
      ).toBe(true)
      const ddgUrl = new URL(result)
      const uParam = ddgUrl.searchParams.get('u')!
      const innerUrl = uParam

      expect(innerUrl.startsWith('https://wsrv.nl/?url=')).toBe(true)
      const innerObj = new URL(innerUrl)
      expect(innerObj.searchParams.get('output')).toBe('webp')

      // Verify inner wsrv.nl uses the provided defaultUrl
      const innerUrlParam = innerObj.searchParams.get('url')!
      const defaultParam = innerObj.searchParams.get('default')
      expect(innerUrlParam).toBe(baseUrl)
      expect(defaultParam!).toBe(defaultUrl)
    })
  })
})

describe('applyProxyChain', () => {
  const url1 = 'https://example.com/1.png'
  const url2 = 'https://example.com/2.png'
  const url3 = 'https://example.com/3.png'

  it('works with single item chain (same as applyProxy)', () => {
    const result = applyProxyChain([
      {
        url: url1,
        proxy: 'wsrv.nl',
      },
    ])
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const urlObj = new URL(result)
    const urlParam = urlObj.searchParams.get('url')!
    expect(urlParam).toBe(url1)
  })

  it('uses second item as defaultUrl for the first item', () => {
    const result = applyProxyChain([
      {
        url: url1,
        proxy: 'wsrv.nl',
      },
      {
        url: url2,
        proxy: 'none',
      },
    ])

    // Outer URL should be wsrv.nl wrapping url1
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const urlObj = new URL(result)
    const urlParam = urlObj.searchParams.get('url')!
    expect(urlParam).toBe(url1)

    // defaultUrl param should be url2 (because second item has proxy: 'none')
    const defaultParam = urlObj.searchParams.get('default')!
    expect(defaultParam).toBe(url2)
  })

  it('chains multiple proxies correctly', () => {
    // Chain:
    // 1. wsrv.nl (url1) -> default: result of 2
    // 2. wsrv.nl (url2) -> default: result of 3
    // 3. none (url3)

    const result = applyProxyChain([
      {
        url: url1,
        proxy: 'wsrv.nl',
      },
      {
        url: url2,
        proxy: 'wsrv.nl',
      },
      {
        url: url3,
        proxy: 'none',
      },
    ])

    // Level 1: wsrv.nl wrapping url1
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const level1 = new URL(result)
    expect(level1.searchParams.get('url')!).toBe(url1)

    // Level 1 default should be Level 2
    const level2Url = level1.searchParams.get('default')!
    expect(level2Url.startsWith('https://wsrv.nl/?url=')).toBe(true)

    // Level 2: wsrv.nl wrapping url2
    const level2 = new URL(level2Url)
    expect(level2.searchParams.get('url')!).toBe(url2)

    // Level 2 default should be url3
    const level3Url = level2.searchParams.get('default')!
    expect(level3Url).toBe(url3)
  })

  it('handles options like useWebp correctly in chain', () => {
    const result = applyProxyChain([
      {
        url: url1,
        proxy: 'wsrv.nl',
        useWebp: true,
      },
      {
        url: url2,
        proxy: 'none',
      },
    ])

    const urlObj = new URL(result)
    expect(urlObj.searchParams.get('output')).toBe('webp')
    const defaultParam = urlObj.searchParams.get('default')!
    expect(defaultParam).toBe(url2)
  })

  it('includes n=-1 in default param for intermediate layers when processing gifs', () => {
    // Chain:
    // 1. wsrv.nl (url1.gif) -> default: result of 2
    // 2. wsrv.nl (url2.gif) -> default: result of 3
    // 3. wsrv.nl (url3.gif) -> default: origin url of 3

    const result = applyProxyChain([
      {
        url: url1,
        originalName: '1.gif',
        proxy: 'wsrv.nl',
      },
      {
        url: url2,
        originalName: '2.gif',
        proxy: 'wsrv.nl',
      },
      {
        url: url3,
        originalName: '3.gif',
        proxy: 'wsrv.nl',
      },
    ])

    // Level 1: wsrv.nl wrapping url1
    const level1 = new URL(result)
    // Level 1 itself should have n=-1
    expect(level1.searchParams.get('n')).toBe('-1')

    // Level 1 default (Level 2) should have n=-1
    const level2Url = level1.searchParams.get('default')!
    const level2 = new URL(level2Url)
    expect(level2.searchParams.get('n')).toBe('-1')

    // Level 2 default (Level 3) should also come from wsrv.nl and have n=-1
    const level3Url = level2.searchParams.get('default')!
    const level3 = new URL(level3Url)
    expect(level3.searchParams.get('n')).toBe('-1')
    const level3DefaultParam = level3.searchParams.get('default')
    expect(level3DefaultParam).toBe(url3)
  })

  it('includes output=webp in default param for intermediate layers when webp is enabled', () => {
    // Chain:
    // 1. wsrv.nl (url1) [webp] -> default: result of 2
    // 2. wsrv.nl (url2) [webp] -> default: result of 3
    // 3. wsrv.nl (url3) [webp] -> default: origin url of 3

    const result = applyProxyChain([
      {
        url: url1,
        proxy: 'wsrv.nl',
        useWebp: true,
      },
      {
        url: url2,
        proxy: 'wsrv.nl',
        useWebp: true,
      },
      {
        url: url3,
        proxy: 'wsrv.nl',
        useWebp: true,
      },
    ])

    // Level 1: wsrv.nl wrapping url1
    const level1 = new URL(result)
    // Level 1 itself should have output=webp
    expect(level1.searchParams.get('output')).toBe('webp')

    // Level 1 default (Level 2) should have output=webp
    const level2Url = level1.searchParams.get('default')!
    const level2 = new URL(level2Url)
    expect(level2.searchParams.get('output')).toBe('webp')

    // Level 2 default (Level 3) should also come from wsrv.nl and have n=-1
    const level3Url = level2.searchParams.get('default')!
    const level3 = new URL(level3Url)
    expect(level3.searchParams.get('output')).toBe('webp')
    const level3DefaultParam = level3.searchParams.get('default')
    expect(level3DefaultParam).toBe(url3)
  })
})
