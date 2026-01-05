import { describe, expect, it } from 'vitest'

import { mergeGroupsMerge, mergeGroupsOverwrite } from '../merge-utils'
import { type ShortcutsConfig, type ShortcutsGroup } from '../store'

const createConfig = (groups: ShortcutsGroup[]): ShortcutsConfig => ({ groups })

const createGroup = (
  id: string,
  name: string,
  items: any[] = []
): ShortcutsGroup => ({
  id,
  name,
  match: ['*'],
  items,
})

const createItem = (id: string, name: string) => ({
  id,
  name,
  type: 'url' as const,
  data: 'https://example.com',
})

describe('merge-utils', () => {
  describe('mergeGroupsOverwrite', () => {
    it('should overwrite existing group completely if IDs match', () => {
      const existing = createConfig([
        createGroup('g1', 'Group 1', [createItem('i1', 'Item 1')]),
        createGroup('g2', 'Group 2', [createItem('i2', 'Item 2')]),
      ])

      const imported = createConfig([
        createGroup('g1', 'Group 1 Updated', [createItem('i3', 'Item 3')]),
      ])

      const result = mergeGroupsOverwrite(existing, imported)

      expect(result.groups).toHaveLength(2)
      // g1 should be replaced
      expect(result.groups[0].name).toBe('Group 1 Updated')
      expect(result.groups[0].items).toHaveLength(1)
      expect(result.groups[0].items[0].id).toBe('i3')
      // g2 should be preserved
      expect(result.groups[1].id).toBe('g2')
    })

    it('should append new groups', () => {
      const existing = createConfig([createGroup('g1', 'Group 1')])
      const imported = createConfig([createGroup('g2', 'Group 2')])

      const result = mergeGroupsOverwrite(existing, imported)

      expect(result.groups).toHaveLength(2)
      expect(result.groups[0].id).toBe('g1')
      expect(result.groups[1].id).toBe('g2')
    })

    it('should handle complex scenario with overwrite and append', () => {
      const existing = createConfig([
        createGroup('g1', 'G1 Old'),
        createGroup('g2', 'G2 Old'),
      ])
      const imported = createConfig([
        createGroup('g3', 'G3 New'),
        createGroup('g1', 'G1 New'),
      ])

      const result = mergeGroupsOverwrite(existing, imported)

      expect(result.groups).toHaveLength(3)
      // g1 overwritten at index 0
      expect(result.groups[0].name).toBe('G1 New')
      // g2 preserved at index 1
      expect(result.groups[1].name).toBe('G2 Old')
      // g3 appended at index 2
      expect(result.groups[2].name).toBe('G3 New')
    })

    it('should handle empty existing config', () => {
      const existing = createConfig([])
      const imported = createConfig([createGroup('g1', 'G1')])
      const result = mergeGroupsOverwrite(existing, imported)
      expect(result.groups).toHaveLength(1)
      expect(result.groups[0].id).toBe('g1')
    })
  })

  describe('mergeGroupsMerge', () => {
    it('should merge items within the same group (overwrite existing items)', () => {
      const existing = createConfig([
        createGroup('g1', 'G1', [
          createItem('i1', 'Item 1 Old'),
          createItem('i2', 'Item 2'),
        ]),
      ])

      const imported = createConfig([
        createGroup('g1', 'G1 Updated', [
          createItem('i1', 'Item 1 New'), // Should overwrite i1
          createItem('i3', 'Item 3'), // Should append
        ]),
      ])

      const result = mergeGroupsMerge(existing, imported)

      expect(result.groups).toHaveLength(1)
      const group = result.groups[0]
      expect(group.name).toBe('G1 Updated') // Metadata updated
      expect(group.items).toHaveLength(3)

      // Order: existing preserved, new appended?
      // mergeItems logic:
      // Loop existing -> if not in imported, keep.
      // Actually mergeItems logic in merge-utils.ts is:
      // Loop imported -> if in existing, overwrite at existing index. else append.
      // Wait, let me check the implementation of mergeItems again.

      // mergeItems implementation:
      // const mergedItems = [...existingItems]
      // Loop importedItems:
      //   if existingItemMap.has(id): overwrite at index
      //   else: append

      expect(group.items[0].name).toBe('Item 1 New') // Overwritten
      expect(group.items[1].name).toBe('Item 2') // Preserved
      expect(group.items[2].name).toBe('Item 3') // Appended
    })

    it('should append new groups', () => {
      const existing = createConfig([createGroup('g1', 'G1')])
      const imported = createConfig([createGroup('g2', 'G2')])

      const result = mergeGroupsMerge(existing, imported)

      expect(result.groups).toHaveLength(2)
      expect(result.groups[0].id).toBe('g1')
      expect(result.groups[1].id).toBe('g2')
    })

    it('should preserve groups not in imported', () => {
      const existing = createConfig([
        createGroup('g1', 'G1'),
        createGroup('g2', 'G2'),
      ])
      const imported = createConfig([createGroup('g1', 'G1 New')])

      const result = mergeGroupsMerge(existing, imported)

      expect(result.groups).toHaveLength(2)
      expect(result.groups[0].name).toBe('G1 New')
      expect(result.groups[1].name).toBe('G2')
    })

    it('should handle multiple groups merging items correctly', () => {
      const existing = createConfig([
        createGroup('g1', 'G1', [createItem('i1', 'I1')]),
        createGroup('g2', 'G2', [createItem('i2', 'I2')]),
      ])

      const imported = createConfig([
        createGroup('g2', 'G2 New', [createItem('i3', 'I3')]), // Append to g2
        createGroup('g1', 'G1', [createItem('i1', 'I1 New')]), // Overwrite in g1
      ])

      const result = mergeGroupsMerge(existing, imported)

      expect(result.groups).toHaveLength(2)

      // g1
      expect(result.groups[0].items).toHaveLength(1)
      expect(result.groups[0].items[0].name).toBe('I1 New')

      // g2
      expect(result.groups[1].name).toBe('G2 New')
      expect(result.groups[1].items).toHaveLength(2)
      expect(result.groups[1].items[0].name).toBe('I2')
      expect(result.groups[1].items[1].name).toBe('I3')
    })

    it('should handle undefined groups gracefully', () => {
      // @ts-expect-error - testing runtime robustness
      const result = mergeGroupsMerge({}, {})
      expect(result.groups).toEqual([])
    })
  })
})
