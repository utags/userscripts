import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createSettingsStore } from '../index'
import * as gm from '../../gm'

// Mock gm module
vi.mock('../../gm', () => ({
  getValue: vi.fn(),
  setValue: vi.fn(),
  addValueChangeListener: vi.fn(),
}))

describe('createSettingsStore', () => {
  const rootKey = 'test-settings'
  const defaults = {
    enabled: true,
    theme: 'light',
    count: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    let storage: any

    // Default mock implementation with state
    vi.mocked(gm.getValue).mockImplementation(async (_key, def) =>
      storage === undefined ? def : storage
    )
    vi.mocked(gm.setValue).mockImplementation(async (_key, val) => {
      storage = val
    })
    vi.mocked(gm.addValueChangeListener).mockResolvedValue(1)

    // Reset location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'example.com' },
      writable: true,
    })
  })

  describe('Basic functionality (isSupportSitePref = false)', () => {
    it('should initialize with defaults', async () => {
      const store = createSettingsStore(rootKey, defaults)
      const all = await store.getAll()
      expect(all).toEqual(defaults)
      expect(gm.getValue).toHaveBeenCalledWith(rootKey, undefined)
    })

    it('should load saved values', async () => {
      const saved = { enabled: false, theme: 'dark' }
      vi.mocked(gm.getValue).mockResolvedValue(saved)

      const store = createSettingsStore(rootKey, defaults)
      const all = await store.getAll()

      expect(all).toEqual({ ...defaults, ...saved })
      expect(all.enabled).toBe(false)
      expect(all.theme).toBe('dark')
      expect(all.count).toBe(0) // Default preserved
    })

    it('should get single value', async () => {
      vi.mocked(gm.getValue).mockResolvedValue({ count: 42 })
      const store = createSettingsStore(rootKey, defaults)

      expect(await store.get('count')).toBe(42)
      expect(await store.get('enabled')).toBe(true) // Default
    })

    it('should set single value', async () => {
      const store = createSettingsStore(rootKey, defaults)
      await store.set('count', 10)

      expect(gm.setValue).toHaveBeenCalledWith(rootKey, { count: 10 })
      expect(await store.get('count')).toBe(10)
    })

    it('should set multiple values', async () => {
      const store = createSettingsStore(rootKey, defaults)
      await store.set({ count: 10, theme: 'dark' })

      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {
        count: 10,
        theme: 'dark',
      })
      expect(await store.get('count')).toBe(10)
      expect(await store.get('theme')).toBe('dark')
    })

    it('should delete value if it matches default', async () => {
      vi.mocked(gm.getValue).mockResolvedValue({ count: 10 })
      const store = createSettingsStore(rootKey, defaults)

      // Set back to default (0)
      await store.set('count', 0)

      // Should save empty object or object without 'count'
      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {})
    })

    it('should normalize values to match default type', async () => {
      const store = createSettingsStore(rootKey, defaults)

      // Set string '10' for number field -> should be normalized to 10
      await store.set('count', '10')
      expect(await store.get('count')).toBe(10)

      // Set invalid number -> should fallback to default (0) and be deleted
      await store.set('count', 'invalid')
      expect(await store.get('count')).toBe(0)
      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {})

      // Set boolean as string? (Note: implementation uses strict typeof check for non-numbers)
      // defaults.enabled is boolean.
      // normalizeToDefaultType: typeof val === t ? val : dv
      // So 'true' (string) !== boolean -> fallback to default (true)
      await store.set('enabled', 'false')
      expect(await store.get('enabled')).toBe(true) // Fallback to default
    })

    it('should handle complex types (arrays, objects)', async () => {
      const complexDefaults = {
        tags: ['a', 'b'],
        config: { show: true },
      }
      const store = createSettingsStore('complex-settings', complexDefaults)

      // Set new value
      await store.set('tags', ['c'])
      expect(await store.get('tags')).toEqual(['c'])

      // Set back to default (deep equality check)
      await store.set('tags', ['a', 'b'])
      // Should be deleted
      // We need to check internal storage or calls
      // Since we can't easily access internal storage, we check if getAll returns default
      // AND verify setValue was called with empty object (since only one key changed)
      expect(await store.get('tags')).toEqual(['a', 'b'])

      // We need to spy on setValue to be sure it was deleted, not just saved as default
      expect(gm.setValue).toHaveBeenLastCalledWith('complex-settings', {})

      // Object equality
      await store.set('config', { show: false })
      expect(await store.get('config')).toEqual({ show: false })

      await store.set('config', { show: true })
      expect(gm.setValue).toHaveBeenLastCalledWith('complex-settings', {})
    })
  })

  describe('Site preference support (isSupportSitePref = true)', () => {
    const isSupportSitePref = true

    it('should handle global settings', async () => {
      const saved = { global: { enabled: false } }
      vi.mocked(gm.getValue).mockResolvedValue(saved)

      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      // Global pref should be false
      expect(await store.get('enabled', true)).toBe(false)
      // Site pref should inherit global (false)
      expect(await store.get('enabled', false)).toBe(false)
    })

    it('should handle site-specific settings', async () => {
      const saved = {
        global: { enabled: false },
        'example.com': { enabled: true },
      }
      vi.mocked(gm.getValue).mockResolvedValue(saved)

      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      // Global is false
      expect(await store.get('enabled', true)).toBe(false)
      // Site is true
      expect(await store.get('enabled', false)).toBe(true)
    })

    it('should set global settings', async () => {
      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      // Set global enabled = false
      await store.set('enabled', false, true)

      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {
        global: { enabled: false },
      })
    })

    it('should set site settings', async () => {
      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      // Set site enabled = false (default is true)
      await store.set('enabled', false, false)

      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {
        'example.com': { enabled: false },
      })
    })

    it('should cleanup empty site objects', async () => {
      const saved = {
        'example.com': { enabled: false },
      }
      vi.mocked(gm.getValue).mockResolvedValue(saved)

      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      // Set site enabled back to true (default) -> should remove key from site object
      // Since site object becomes empty, it should remove 'example.com' key
      await store.set('enabled', true, false)

      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {})
    })

    it('should fallback correctly: Site -> Global -> Default', async () => {
      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      // 1. All defaults
      expect(await store.get('enabled', false)).toBe(true)

      // 2. Set global to false
      await store.set('enabled', false, true)
      expect(await store.get('enabled', false)).toBe(false) // Inherits global

      // 3. Set site to true
      await store.set('enabled', true, false)
      expect(await store.get('enabled', false)).toBe(true) // Overrides global
      expect(await store.get('enabled', true)).toBe(false) // Global remains false
    })

    it('should save site preference even if it matches default when global preference exists', async () => {
      // Setup: Global has 'count' = 10 (default 0)
      vi.mocked(gm.getValue).mockResolvedValue({
        global: { count: 10 },
      })

      const store = createSettingsStore(rootKey, defaults, true)
      // Ensure loaded
      await store.get('count')

      // Global should be 10
      expect(await store.get('count', true)).toBe(10)
      // Site should inherit global -> 10
      expect(await store.get('count', false)).toBe(10)

      // Now set Site to default (0)
      // Since Global exists (10), we MUST save site pref (0) to override global
      await store.set('count', 0, false)

      expect(await store.get('count', false)).toBe(0)

      // Verify storage structure:
      // { global: { count: 10 }, 'example.com': { count: 0 } }
      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {
        global: { count: 10 },
        'example.com': { count: 0 },
      })
    })

    it('should save site preference even if it matches global preference', async () => {
      // Setup: Global has 'count' = 10
      vi.mocked(gm.getValue).mockResolvedValue({
        global: { count: 10 },
      })

      const store = createSettingsStore(rootKey, defaults, true)
      await store.get('count')

      // Set Site to 10 (same as global)
      // According to logic, if key in global, we save site pref regardless
      await store.set('count', 10, false)

      expect(await store.get('count', false)).toBe(10)

      // Verify storage structure:
      // { global: { count: 10 }, 'example.com': { count: 10 } }
      expect(gm.setValue).toHaveBeenCalledWith(rootKey, {
        global: { count: 10 },
        'example.com': { count: 10 },
      })
    })

    it('should return correct structure in getAll', async () => {
      const saved = {
        global: { theme: 'dark' },
        'example.com': { count: 5 },
      }
      vi.mocked(gm.getValue).mockResolvedValue(saved)

      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      const globalAll = await store.getAll(true)
      const siteAll = await store.getAll(false)

      expect(globalAll).toEqual({ ...defaults, theme: 'dark' })
      expect(siteAll).toEqual({ ...defaults, theme: 'dark', count: 5 })
    })

    it('should handle hostname change', async () => {
      const saved = {
        'example.com': { count: 5 },
        'other.com': { count: 10 },
      }
      vi.mocked(gm.getValue).mockResolvedValue(saved)

      const store = createSettingsStore(rootKey, defaults, isSupportSitePref)

      // Current host is example.com
      expect(await store.get('count', false)).toBe(5)

      // Change host
      Object.defineProperty(globalThis, 'location', {
        value: { hostname: 'other.com' },
        writable: true,
      })

      // Need to trigger update logic.
      // Note: The store caches values. In real app, page reload happens or we create new store.
      // But if we call methods that trigger 'ensure', it might re-read if cache invalidation logic existed.
      // However, the current implementation caches heavily.
      // Let's create a new store instance to simulate page load on new domain.
      const newStore = createSettingsStore(rootKey, defaults, isSupportSitePref)
      expect(await newStore.get('count', false)).toBe(10)
    })
  })

  describe('Reactivity', () => {
    it('should notify listeners on change', async () => {
      const store = createSettingsStore(rootKey, defaults)
      const cb = vi.fn()
      store.onChange?.(cb)

      // Trigger update via set
      await store.set('count', 1)

      // The implementation of createSettingsStore registers a GM listener
      // When GM listener fires, it calls the internal listeners.
      // Since we mocked GM.addValueChangeListener, we need to manually trigger the callback passed to it
      // OR we rely on the fact that `set` updates the cache and *could* trigger listeners if implemented that way.
      // Looking at the code:
      // set() calls setValue().
      // It DOES NOT directly call listeners. It relies on addValueChangeListener callback.

      // We need to simulate GM event
      expect(gm.addValueChangeListener).toHaveBeenCalled()
      const calls = vi.mocked(gm.addValueChangeListener).mock.calls
      if (calls.length > 0) {
        const gmCallback = calls[0][1] as any
        gmCallback(rootKey, {}, { count: 1 }, false)

        expect(cb).toHaveBeenCalled()
        expect(cb).toHaveBeenCalledWith(
          expect.objectContaining({
            key: '*',
            newValue: { count: 1 },
          })
        )
      } else {
        throw new Error('GM listener not registered')
      }
    })
  })
})
