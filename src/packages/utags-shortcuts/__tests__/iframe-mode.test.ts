// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { isIframeModeDisabled, isIframeModeDisabledUrl } from '../iframe-mode'

describe('isIframeModeDisabledUrl', () => {
  it('disables Google search with udm=50', () => {
    expect(
      isIframeModeDisabledUrl('https://www.google.com/search?q=test&udm=50')
    ).toBe(true)
    expect(
      isIframeModeDisabledUrl('https://www.google.com/search?udm=50&q=test')
    ).toBe(true)
  })

  it('disables Google search without udm param', () => {
    expect(
      isIframeModeDisabledUrl('https://www.google.com/search?q=test')
    ).toBe(true)
    expect(
      isIframeModeDisabledUrl('https://www.google.com/search?q=test&foo=1')
    ).toBe(true)
  })

  it('does not disable Google search with other udm values', () => {
    expect(
      isIframeModeDisabledUrl('https://www.google.com/search?q=test&udm=40')
    ).toBe(false)
  })

  it('disables stackexchange domains', () => {
    expect(
      isIframeModeDisabledUrl('https://stackexchange.com/questions/123')
    ).toBe(true)
    expect(isIframeModeDisabledUrl('https://meta.stackexchange.com/')).toBe(
      true
    )
    expect(
      isIframeModeDisabledUrl('https://superuser.stackexchange.com/questions/1')
    ).toBe(true)
  })

  it('disables login/auth subdomains', () => {
    expect(isIframeModeDisabledUrl('https://login.example.com/path')).toBe(true)
    expect(
      isIframeModeDisabledUrl('https://auth2.service.example.com/login')
    ).toBe(true)
  })

  it('disables URLs with auth keywords at word start boundary', () => {
    expect(isIframeModeDisabledUrl('https://example.com/path/login123')).toBe(
      true
    )
    expect(isIframeModeDisabledUrl('https://example.com/path/SignupForm')).toBe(
      true
    )
  })

  it('disables URLs with auth keywords at word end boundary', () => {
    expect(
      isIframeModeDisabledUrl('https://example.com/path/xlogin/step')
    ).toBe(true)
    expect(isIframeModeDisabledUrl('https://example.com/path/raw')).toBe(true)
  })

  it('does NOT disable URLs with auth keywords inside words', () => {
    expect(
      isIframeModeDisabledUrl('https://example.com/path/preloginpost')
    ).toBe(false)
    expect(isIframeModeDisabledUrl('https://example.com/drawing/canvas')).toBe(
      false
    ) // 'raw' in 'drawing'
  })

  it('disables URLs with auth prefix even if it might be a false positive (e.g. author)', () => {
    // Current implementation uses \bauth, which matches 'author'.
    // This is a known limitation/feature to ensure security over convenience.
    expect(isIframeModeDisabledUrl('https://example.com/author/profile')).toBe(
      true
    )
  })

  it('disables resource URLs with blocked extensions', () => {
    expect(isIframeModeDisabledUrl('https://example.com/file.md')).toBe(true)
    expect(
      isIframeModeDisabledUrl('https://example.com/image.png?size=large')
    ).toBe(true)
    expect(
      isIframeModeDisabledUrl('https://example.com/photo.jpeg#anchor')
    ).toBe(true)
    expect(
      isIframeModeDisabledUrl('https://example.com/assets/icon.webp?version=1')
    ).toBe(true)
    expect(isIframeModeDisabledUrl('https://example.com/vector.svg')).toBe(true)
    expect(
      isIframeModeDisabledUrl(
        'https://example.com/userscript.user.js?source=greasyfork'
      )
    ).toBe(true)
  })

  it('does not disable URLs without blacklisted patterns', () => {
    expect(isIframeModeDisabledUrl('https://example.com/page.html')).toBe(false)
    expect(isIframeModeDisabledUrl('https://www.google.com/')).toBe(false)
    expect(isIframeModeDisabledUrl('https://example.com/file.mdx')).toBe(false)
  })
})

describe('isIframeModeDisabled', () => {
  const originalLocation = globalThis.location
  const originalLocalStorage = globalThis.localStorage

  beforeEach(() => {
    // Reset location mock
    delete (globalThis as any).location
    globalThis.location = {
      ...originalLocation,
      host: 'example.com',
      href: 'https://example.com',
      reload: vi.fn(),
    } as any

    // Reset localStorage mock
    const storage: Record<string, string> = {}
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn((key) => storage[key] || null),
        setItem: vi.fn((key, value) => {
          storage[key] = value.toString()
        }),
        removeItem: vi.fn((key) => {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete storage[key]
        }),
        clear: vi.fn(() => {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete, guard-for-in
          for (const key in storage) delete storage[key]
        }),
      },
      writable: true,
    })
  })

  afterEach(() => {
    delete (globalThis as any).location
    ;(globalThis as any).location = originalLocation
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    })
    vi.restoreAllMocks()
  })

  it('returns true if domain is in BLACKLIST_DOMAINS', () => {
    globalThis.location.host = 'github.com'
    expect(isIframeModeDisabled()).toBe(true)
  })

  it('returns true if URL is disabled by isIframeModeDisabledUrl', () => {
    globalThis.location.host = 'example.com'
    globalThis.location.href = 'https://example.com/login'
    expect(isIframeModeDisabled()).toBe(true)
  })

  it('returns true if disabled via localStorage key DISABLE_IFRAME_KEY', () => {
    globalThis.localStorage.setItem('utags_iframe_mode_disabled', '1')
    expect(isIframeModeDisabled()).toBe(true)
  })

  it('returns true if checking via localStorage key CHECK_IFRAME_KEY', () => {
    globalThis.localStorage.setItem('utags_iframe_mode_checking', '1')
    expect(isIframeModeDisabled()).toBe(true)
  })

  it('returns false for normal safe URLs', () => {
    globalThis.location.host = 'example.com'
    globalThis.location.href = 'https://example.com/page'
    expect(isIframeModeDisabled()).toBe(false)
  })
})
