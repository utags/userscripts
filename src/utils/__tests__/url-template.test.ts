import { describe, it, expect, beforeEach } from 'vitest'
import { resolveUrlTemplate } from '../url-template'

describe('resolveUrlTemplate', () => {
  beforeEach(() => {
    ;(globalThis as any).location = {
      href: 'https://www.example.com/search?q=hello&foo=bar&query=hi',
      hostname: 'www.example.com',
    }
    ;(globalThis as any).getSelection = () => ({
      toString() {
        return ''
      },
    })
  })

  it('replaces hostname', () => {
    const s = 'https://{hostname}/path'
    expect(resolveUrlTemplate(s)).toBe('https://www.example.com/path')
  })

  it('replaces hostname_without_www', () => {
    const s = 'https://{hostname_without_www}/'
    expect(resolveUrlTemplate(s)).toBe('https://example.com/')
  })

  it('replaces query (query or q)', () => {
    expect(resolveUrlTemplate('{query}')).toBe('hi')
    ;(globalThis as any).location.href = 'https://x.test/?q=zzz'
    expect(resolveUrlTemplate('{query}')).toBe('zzz')
  })

  it('supports kw/wd/keyword aliases', () => {
    ;(globalThis as any).location.href = 'https://x.test/?kw=kwv'
    expect(resolveUrlTemplate('{kw}')).toBe('kwv')
    expect(resolveUrlTemplate('{query}')).toBe('kwv')
    ;(globalThis as any).location.href = 'https://x.test/?wd=wdv'
    expect(resolveUrlTemplate('{wd}')).toBe('wdv')
    expect(resolveUrlTemplate('{query}')).toBe('wdv')
    ;(globalThis as any).location.href = 'https://x.test/?keyword=keyv'
    expect(resolveUrlTemplate('{keyword}')).toBe('keyv')
    expect(resolveUrlTemplate('{query}')).toBe('keyv')
  })

  it('supports p/s/term aliases', () => {
    ;(globalThis as any).location.href = 'https://x.test/?p=pv'
    expect(resolveUrlTemplate('{p}')).toBe('pv')
    expect(resolveUrlTemplate('{query}')).toBe('pv')
    ;(globalThis as any).location.href = 'https://x.test/?s=sv'
    expect(resolveUrlTemplate('{s}')).toBe('sv')
    expect(resolveUrlTemplate('{query}')).toBe('sv')
    ;(globalThis as any).location.href = 'https://x.test/?term=tv'
    expect(resolveUrlTemplate('{term}')).toBe('tv')
    expect(resolveUrlTemplate('{query}')).toBe('tv')
  })

  it('replaces selected when present', () => {
    ;(globalThis as any).getSelection = () => ({
      toString() {
        return 'picked'
      },
    })
    expect(resolveUrlTemplate('{selected}')).toBe('picked')
  })

  it('falls back with || chain: selected then query', () => {
    // no selection -> use query
    ;(globalThis as any).getSelection = () => ({
      toString() {
        return ''
      },
    })
    ;(globalThis as any).location.href = 'https://x.test/?query=abc'
    expect(resolveUrlTemplate('{selected||query}')).toBe('abc')

    // with selection -> use selected
    ;(globalThis as any).getSelection = () => ({
      toString() {
        return 'grab'
      },
    })
    expect(resolveUrlTemplate('{selected||query}')).toBe('grab')
  })

  it('supports whitespace in variable body', () => {
    ;(globalThis as any).getSelection = () => ({
      toString() {
        return ''
      },
    })
    ;(globalThis as any).location.href = 'https://x.test/?q=whitespace'
    expect(resolveUrlTemplate('{ selected  ||  query }')).toBe('whitespace')
  })

  it('handles unknown variables as empty', () => {
    expect(resolveUrlTemplate('x{unknown}y')).toBe('xy')
  })

  it('handles multiple tokens in one string', () => {
    const s = 'https://{hostname_without_www}/?q={selected||query}'
    ;(globalThis as any).getSelection = () => ({
      toString() {
        return ''
      },
    })
    ;(globalThis as any).location.href = 'https://www.example.com/?query=multi'
    expect(resolveUrlTemplate(s)).toBe('https://example.com/?q=multi')
  })
})
