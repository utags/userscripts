import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

describe('utags-ext-replace-username', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.resetModules()
  })

  it('should wrap text in span for existing elements', async () => {
    document.body.innerHTML = `
      <a data-hovercard-url="/u/1" data-utags="tag1">User1</a>
      <a data-hovercard-url="/u/2">User2</a>
    `

    // Import the script to trigger execution
    await import('../index.js')

    // Fast-forward timers for requestAnimationFrame
    vi.runAllTimers()

    const link1 = document.querySelector('a[data-hovercard-url="/u/1"]')
    expect(link1?.getAttribute('data-utags-replaced')).toBe('true')
    expect(link1?.innerHTML).toBe('<span>User1</span>')

    const link2 = document.querySelector('a[data-hovercard-url="/u/2"]')
    expect(link2?.getAttribute('data-utags-replaced')).toBeNull()
    expect(link2?.innerHTML).toBe('User2')
  })

  it('should handle mixed content (images and text)', async () => {
    document.body.innerHTML = `
      <a data-hovercard-url="/u/3" data-utags="tag3">
        <img src="avatar.png">
        User3
      </a>
    `

    await import('../index.js')
    vi.runAllTimers()

    const link = document.querySelector('a[data-hovercard-url="/u/3"]')
    expect(link?.getAttribute('data-utags-replaced')).toBe('true')
    const span = link?.querySelector('span')
    expect(span?.textContent?.trim()).toBe('User3')
    expect(link?.querySelector('img')).not.toBeNull()
  })

  it('should process dynamically added elements', async () => {
    await import('../index.js')

    const link = document.createElement('a')
    link.dataset.hovercardUrl = '/u/4'
    link.dataset.utags = 'tag4'
    link.textContent = 'User4'
    document.body.append(link)

    // MutationObserver is async, plus requestAnimationFrame
    await Promise.resolve() // wait for mutation observer
    vi.runAllTimers()

    expect(link.dataset.utagsReplaced).toBe('true')
    expect(link.innerHTML).toBe('<span>User4</span>')
  })

  it('should process when data-utags attribute is added', async () => {
    await import('../index.js')

    const link = document.createElement('a')
    link.dataset.hovercardUrl = '/u/5'
    link.textContent = 'User5'
    document.body.append(link)

    await Promise.resolve()
    vi.runAllTimers()

    // Initially not processed
    expect(link.dataset.utagsReplaced).toBeUndefined()

    // Add data-utags
    link.dataset.utags = 'tag5'

    await Promise.resolve()
    vi.runAllTimers()

    expect(link.dataset.utagsReplaced).toBe('true')
    expect(link.innerHTML).toBe('<span>User5</span>')
  })
})
