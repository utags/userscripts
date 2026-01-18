import { getValue } from 'browser-extension-storage'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { SITE_SETTINGS_MAP_KEY } from '../constants'

vi.mock('browser-extension-storage', () => ({
  getValue: vi.fn(),
  setValue: vi.fn(),
  addValueChangeListener: vi.fn(),
  deleteValue: vi.fn(),
}))

type ApplyProxyFn = (
  url: string,
  providerKey?: string,
  originalName?: string,
  proxy?: string
) => Promise<string>

let applyProxy: ApplyProxyFn

beforeAll(async () => {
  ;(globalThis as any).GM_addStyle = (_css: string) => undefined
  // Default mock for module init
  vi.mocked(getValue).mockResolvedValue({})
  const mod = await import('../index.js')
  applyProxy = mod.applyProxy
})

describe('applyProxy', () => {
  const baseUrl = 'https://example.com/image.png'

  beforeEach(() => {
    // Default: webp disabled
    vi.mocked(getValue).mockResolvedValue({})
  })

  it('returns original url when proxy is none', async () => {
    const result = await applyProxy(baseUrl, 'other', 'image.png', 'none')
    expect(result).toBe(baseUrl)
  })

  it('falls back to original url when proxy is unknown', async () => {
    const result = await applyProxy(baseUrl, 'other', 'image.png', 'unknown')
    expect(result).toBe(baseUrl)
  })

  it('applies wsrv.nl for non-gif non-imgur providers', async () => {
    const result = await applyProxy(baseUrl, 'mjj', 'image.png', 'wsrv.nl')
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const urlObj = new URL(result)
    const urlParam = urlObj.searchParams.get('url')!
    const defaultParam = urlObj.searchParams.get('default')
    expect(defaultParam).toBe(urlParam)
    expect(decodeURIComponent(urlParam)).toBe(baseUrl)
    const nParam = urlObj.searchParams.get('n')
    expect(nParam).toBeNull()
  })

  it('adds n=-1 when original name is gif for wsrv.nl', async () => {
    const gifUrl = 'https://example.com/anim.gif'
    const result = await applyProxy(gifUrl, 'mjj', 'anim.gif', 'wsrv.nl')
    const urlObj = new URL(result)
    const nParam = urlObj.searchParams.get('n')
    expect(nParam).toBe('-1')
    const urlParam = urlObj.searchParams.get('url')!
    expect(decodeURIComponent(urlParam)).toBe(gifUrl)
  })

  it('uses wsrv.nl-duckduckgo pipeline for imgur provider with wsrv.nl', async () => {
    const imgurUrl = 'https://i.imgur.com/example.png'
    const result = await applyProxy(imgurUrl, 'imgur', 'example.gif', 'wsrv.nl')
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const wsrvUrl = new URL(result)
    const wrappedUrlParam = wsrvUrl.searchParams.get('url')!
    const ddgUrl = new URL(decodeURIComponent(wrappedUrlParam))
    expect(ddgUrl.hostname).toBe('external-content.duckduckgo.com')
    const originalParam = ddgUrl.searchParams.get('u')!
    expect(decodeURIComponent(originalParam)).toBe(imgurUrl)
    const nParam = wsrvUrl.searchParams.get('n')
    expect(nParam).toBe('-1')
  })

  it('wraps url with duckduckgo proxy', async () => {
    const result = await applyProxy(baseUrl, 'other', 'image.png', 'duckduckgo')
    expect(
      result.startsWith('https://external-content.duckduckgo.com/iu/?u=')
    ).toBe(true)
    const urlObj = new URL(result)
    const uParam = urlObj.searchParams.get('u')!
    const decoded = decodeURIComponent(uParam)
    expect(() => {
      const parsed = new URL(decoded)
      return parsed
    }).not.toThrow()
  })

  it('applies wsrv.nl-duckduckgo proxy directly', async () => {
    const gifUrl = 'https://example.com/anim.gif'
    const result = await applyProxy(
      gifUrl,
      'other',
      'anim.gif',
      'wsrv.nl-duckduckgo'
    )
    expect(result.startsWith('https://wsrv.nl/?url=')).toBe(true)
    const wsrvUrl = new URL(result)
    const urlParam = wsrvUrl.searchParams.get('url')!
    const ddgUrl = new URL(decodeURIComponent(urlParam))
    expect(ddgUrl.hostname).toBe('external-content.duckduckgo.com')
    const originalParam = ddgUrl.searchParams.get('u')!
    expect(decodeURIComponent(originalParam)).toBe(gifUrl)
    const nParam = wsrvUrl.searchParams.get('n')
    expect(nParam).toBe('-1')
  })

  describe('when webp is enabled', () => {
    beforeEach(() => {
      vi.mocked(getValue).mockImplementation(async (key, def) => {
        if (key === SITE_SETTINGS_MAP_KEY) {
          return new Proxy(
            {},
            {
              get: () => ({ webp: true }),
            }
          )
        }

        return def
      })
    })

    it('adds output=webp for wsrv.nl', async () => {
      const result = await applyProxy(baseUrl, 'mjj', 'image.png', 'wsrv.nl')
      const urlObj = new URL(result)
      expect(urlObj.searchParams.get('output')).toBe('webp')
    })

    it('adds output=webp for wsrv.nl-duckduckgo pipeline', async () => {
      const result = await applyProxy(
        baseUrl,
        'other',
        'image.png',
        'wsrv.nl-duckduckgo'
      )
      const urlObj = new URL(result)
      expect(urlObj.searchParams.get('output')).toBe('webp')
    })

    it('converts to wsrv.nl(webp) then wraps in duckduckgo when proxy is duckduckgo', async () => {
      const result = await applyProxy(
        baseUrl,
        'other',
        'image.png',
        'duckduckgo'
      )
      // Should be DDG -> wsrv.nl -> original
      expect(
        result.startsWith('https://external-content.duckduckgo.com/iu/?u=')
      ).toBe(true)
      const ddgUrl = new URL(result)
      const uParam = ddgUrl.searchParams.get('u')!
      const innerUrl = decodeURIComponent(uParam)

      expect(innerUrl.startsWith('https://wsrv.nl/?url=')).toBe(true)
      const innerObj = new URL(innerUrl)
      expect(innerObj.searchParams.get('output')).toBe('webp')

      // Verify inner wsrv.nl wraps original url
      const innerUrlParam = innerObj.searchParams.get('url')!
      expect(innerObj.searchParams.get('default')).toBe(innerUrlParam)
      expect(decodeURIComponent(innerUrlParam)).toBe(baseUrl)
    })
  })
})
