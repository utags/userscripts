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

  it('replaces current_url', () => {
    const s = 'link: {current_url}'
    expect(resolveUrlTemplate(s)).toBe(
      'link: https://www.example.com/search?q=hello&foo=bar&query=hi'
    )
  })

  it('replaces current_url_encoded', () => {
    const s = 'link: {current_url_encoded}'
    expect(resolveUrlTemplate(s)).toBe(
      'link: ' +
        encodeURIComponent(
          'https://www.example.com/search?q=hello&foo=bar&query=hi'
        )
    )
  })

  it('replaces query (query or q)', () => {
    expect(resolveUrlTemplate('{query}')).toBe('hi')
    ;(globalThis as any).location.href = 'https://x.test/?q=zzz'
    expect(resolveUrlTemplate('{query}')).toBe('zzz')
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
    // no selection
    expect(resolveUrlTemplate(s)).toBe('https://example.com/?q=hi')
  })

  it('supports dynamic query param resolvers (q:param)', () => {
    ;(globalThis as any).location.href = 'https://x.test/?foo=bar&baz=qux'
    expect(resolveUrlTemplate('{q:foo}')).toBe('bar')
    expect(resolveUrlTemplate('{q:baz}')).toBe('qux')
    expect(resolveUrlTemplate('{q:missing}')).toBe('')
  })

  it('supports dynamic path segment resolvers (p:index)', () => {
    ;(globalThis as any).location.href = 'https://x.test/first/second/third'
    expect(resolveUrlTemplate('{p:1}')).toBe('first')
    expect(resolveUrlTemplate('{p:2}')).toBe('second')
    expect(resolveUrlTemplate('{p:3}')).toBe('third')
    expect(resolveUrlTemplate('{p:4}')).toBe('')
    // verify it ignores empty segments (e.g. leading slash or double slash)
    ;(globalThis as any).location.href = 'https://x.test//a/b//c/'
    expect(resolveUrlTemplate('{p:1}')).toBe('a')
    expect(resolveUrlTemplate('{p:2}')).toBe('b')
    expect(resolveUrlTemplate('{p:3}')).toBe('c')
  })

  it('supports fallback with dynamic resolvers', () => {
    ;(globalThis as any).location.href = 'https://x.test/path/to?id=123'
    // p:5 is empty, fallback to q:id
    expect(resolveUrlTemplate('{p:5||q:id}')).toBe('123')
    // q:missing is empty, fallback to p:1
    expect(resolveUrlTemplate('{q:missing||p:1}')).toBe('path')
  })

  it('supports static text resolvers (t:text, te:text)', () => {
    expect(resolveUrlTemplate('{t:hello}')).toBe('hello')
    expect(resolveUrlTemplate('{te:hello world}')).toBe('hello%20world')
    // fallback usage
    ;(globalThis as any).location.href = 'https://x.test/'
    expect(resolveUrlTemplate('{q:missing||t:default}')).toBe('default')
    expect(resolveUrlTemplate('{p:10||te:default value}')).toBe(
      'default%20value'
    )
  })
})
