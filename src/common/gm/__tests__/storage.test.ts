import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('GM API polyfill', () => {
  let channelMock: any
  let triggerChannelMessage: (data: any) => void

  beforeEach(() => {
    vi.resetModules()

    // Mock BroadcastChannel
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    triggerChannelMessage = () => {}
    channelMock = {
      postMessage: vi.fn(),
      addEventListener: vi.fn((event, handler) => {
        if (event === 'message') {
          triggerChannelMessage = (data) => {
            handler({ data })
          }
        }
      }),
      close: vi.fn(),
    }

    class MockBroadcastChannel {
      postMessage(...args: any[]) {
        return channelMock.postMessage(...args)
      }

      addEventListener(...args: any[]) {
        return channelMock.addEventListener(...args)
      }

      close() {
        return channelMock.close()
      }
    }
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel)

    // Clear globals
    delete (globalThis as any).GM
    delete (globalThis as any).GM_addValueChangeListener
    delete (globalThis as any).GM_removeValueChangeListener
    delete (globalThis as any).GM_setValue
    delete (globalThis as any).GM_deleteValue
    delete (globalThis as any).GM_getValue
    delete (globalThis as any).GM_info
    delete (globalThis as any).GM_openInTab
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should use native GM.addValueChangeListener if supported', async () => {
    const nativeAddListener = vi.fn().mockResolvedValue(123)
    const nativeRemoveListener = vi.fn().mockResolvedValue(undefined)

    vi.stubGlobal('GM', {
      addValueChangeListener: nativeAddListener,
      removeValueChangeListener: nativeRemoveListener,
      setValue: vi.fn(),
      deleteValue: vi.fn(),
      getValue: vi.fn(),
    })

    const gm = await import('../storage.js')

    const callback = vi.fn()
    const id = await gm.addValueChangeListener('testKey', callback)

    expect(nativeAddListener).toHaveBeenCalledWith('testKey', callback)
    expect(id).toBe(123)

    // Verify fallback logic is NOT triggered on setValue
    await gm.setValue('testKey', 'newValue')
    // Since native is supported, our polyfill logic (reading old value, triggering callback) shouldn't run.
  })

  it('should fallback to simulation if native listener is NOT supported', async () => {
    // Setup environment with NO native listener support but WITH getValue/setValue
    const storage = new Map<string, any>()
    vi.stubGlobal('GM', {
      getValue: vi.fn(async (k) => storage.get(k)),
      setValue: vi.fn(async (k, v) => storage.set(k, v)),
      deleteValue: vi.fn(async (k) => storage.delete(k)),
      // explicitly undefined listener APIs
      addValueChangeListener: undefined,
      removeValueChangeListener: undefined,
    })

    const gm = await import('../storage.js')

    const callback = vi.fn()
    const id = await gm.addValueChangeListener('testKey', callback)

    // Verify ID is generated locally (simple counter starting at 1)
    expect(typeof id).toBe('number')
    expect(id).toBeGreaterThan(0)

    // Test setValue triggering listener
    await gm.setValue('testKey', 'value1')

    expect(callback).toHaveBeenCalledWith('testKey', undefined, 'value1', false)
    expect(channelMock.postMessage).toHaveBeenCalledWith({
      key: 'testKey',
      oldValue: undefined,
      newValue: 'value1',
    })

    // Test updating value
    await gm.setValue('testKey', 'value2')
    expect(callback).toHaveBeenCalledWith('testKey', 'value1', 'value2', false)

    // Test deleteValue
    await gm.deleteValue('testKey')
    expect(callback).toHaveBeenCalledWith('testKey', 'value2', undefined, false)

    // Test removeValueChangeListener
    await gm.removeValueChangeListener(id)
    callback.mockClear()
    await gm.setValue('testKey', 'value3')
    expect(callback).not.toHaveBeenCalled()
  })

  it('should NOT trigger listeners if oldValue equals newValue (primitive)', async () => {
    // Setup environment with NO native listener support
    const storage = new Map<string, any>()
    storage.set('testKey', 'sameValue')

    vi.stubGlobal('GM', {
      getValue: vi.fn(async (k) => storage.get(k)),
      setValue: vi.fn(async (k, v) => storage.set(k, v)),
      addValueChangeListener: undefined,
    })

    const gm = await import('../storage.js')
    const callback = vi.fn()
    await gm.addValueChangeListener('testKey', callback)

    // Set same value
    await gm.setValue('testKey', 'sameValue')

    expect(callback).not.toHaveBeenCalled()
    expect(channelMock.postMessage).not.toHaveBeenCalled()

    // Set different value
    await gm.setValue('testKey', 'newValue')
    expect(callback).toHaveBeenCalledWith(
      'testKey',
      'sameValue',
      'newValue',
      false
    )
  })

  it('should NOT trigger listeners if oldValue equals newValue (deep equal)', async () => {
    // Setup environment with NO native listener support
    const initialObj = { a: 1, b: { c: 2 } }
    const storage = new Map<string, any>()
    storage.set('testObj', initialObj)

    vi.stubGlobal('GM', {
      getValue: vi.fn(async (k) => storage.get(k)),
      setValue: vi.fn(async (k, v) => storage.set(k, v)),
      addValueChangeListener: undefined,
    })

    const gm = await import('../storage.js')
    const callback = vi.fn()
    await gm.addValueChangeListener('testObj', callback)

    // Set same content object (new reference)
    await gm.setValue('testObj', { a: 1, b: { c: 2 } })

    expect(callback).not.toHaveBeenCalled()
    expect(channelMock.postMessage).not.toHaveBeenCalled()

    // Set different content
    await gm.setValue('testObj', { a: 1, b: { c: 3 } })
    expect(callback).toHaveBeenCalledWith(
      'testObj',
      initialObj,
      { a: 1, b: { c: 3 } },
      false
    )
  })

  it('should handle cross-tab communication via BroadcastChannel', async () => {
    // No native support
    vi.stubGlobal('GM', {
      getValue: vi.fn(),
      setValue: vi.fn(),
    })

    const gm = await import('../storage.js')
    const callback = vi.fn()
    await gm.addValueChangeListener('remoteKey', callback)

    // Simulate receiving a message from another tab
    triggerChannelMessage({
      key: 'remoteKey',
      oldValue: 'old',
      newValue: 'new',
    })

    expect(callback).toHaveBeenCalledWith('remoteKey', 'old', 'new', true)
  })

  it('should force fallback if scriptHandler is "tamp"', async () => {
    // Setup environment where native API exists BUT scriptHandler is 'tamp'
    const nativeAddListener = vi.fn()
    vi.stubGlobal('GM', {
      addValueChangeListener: nativeAddListener,
      setValue: vi.fn(),
      getValue: vi.fn(),
      info: { scriptHandler: 'tamp' },
    })

    const gm = await import('../storage.js')
    const callback = vi.fn()

    await gm.addValueChangeListener('key', callback)

    // Should NOT use native listener because of blacklist
    expect(nativeAddListener).not.toHaveBeenCalled()

    // Should use simulation
    await gm.setValue('key', 'val')
    expect(callback).toHaveBeenCalled()
  })

  it('should force fallback if scriptHandler includes "stay"', async () => {
    // Setup environment with GM_info style
    const nativeAddListener = vi.fn()
    vi.stubGlobal('GM_addValueChangeListener', nativeAddListener)
    vi.stubGlobal('GM_info', { scriptHandler: 'Violentmonkey-stay-fork' })
    vi.stubGlobal('GM_setValue', vi.fn())
    vi.stubGlobal('GM_getValue', vi.fn())

    const gm = await import('../storage.js')
    const callback = vi.fn()

    await gm.addValueChangeListener('key', callback)

    // Should NOT use native listener
    expect(nativeAddListener).not.toHaveBeenCalled()
  })
})
