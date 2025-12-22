import {
  type ShortcutsConfig,
  type ShortcutsGroup,
  type ShortcutsItem,
} from './store'

/**
 * Overwrite Mode:
 * Preserves all groups.
 * If Group ID matches, replace the entire group content (items) with the imported one.
 */
export function mergeGroupsOverwrite(
  existing: ShortcutsConfig,
  imported: ShortcutsConfig
): ShortcutsConfig {
  // Clone existing groups to avoid mutation
  const mergedGroups: ShortcutsGroup[] = [...(existing.groups || [])]
  const existingGroupMap = new Map(mergedGroups.map((g, i) => [g.id, i]))

  for (const importedGroup of imported.groups || []) {
    if (existingGroupMap.has(importedGroup.id)) {
      // Overwrite: Replace the existing group at that index with the imported one
      const index = existingGroupMap.get(importedGroup.id)!
      mergedGroups[index] = importedGroup
    } else {
      // New group: Append
      mergedGroups.push(importedGroup)
    }
  }

  return { groups: mergedGroups }
}

/**
 * Merge Mode:
 * Preserves all groups.
 * If Group ID matches, merge the items (if Item ID matches, use imported data).
 */
export function mergeGroupsMerge(
  existing: ShortcutsConfig,
  imported: ShortcutsConfig
): ShortcutsConfig {
  // Clone existing groups
  const mergedGroups: ShortcutsGroup[] = [...(existing.groups || [])]
  const existingGroupMap = new Map(mergedGroups.map((g, i) => [g.id, i]))

  for (const importedGroup of imported.groups || []) {
    if (existingGroupMap.has(importedGroup.id)) {
      // Merge items within the group
      const index = existingGroupMap.get(importedGroup.id)!
      const existingGroup = mergedGroups[index]

      // Merge metadata (prefer imported, or keep existing? User said "Use imported data" for items.
      // Usually merge implies updating metadata too if present. Let's assume imported metadata overwrites existing.)
      const newGroup: ShortcutsGroup = {
        ...existingGroup,
        ...importedGroup,
        items: mergeItems(existingGroup.items || [], importedGroup.items || []),
      }
      mergedGroups[index] = newGroup
    } else {
      // New group: Append
      mergedGroups.push(importedGroup)
    }
  }

  return { groups: mergedGroups }
}

function mergeItems(
  existingItems: ShortcutsItem[],
  importedItems: ShortcutsItem[]
): ShortcutsItem[] {
  const mergedItems = [...existingItems]
  const existingItemMap = new Map(mergedItems.map((item, i) => [item.id, i]))

  for (const importedItem of importedItems) {
    if (existingItemMap.has(importedItem.id)) {
      // Overwrite item
      const index = existingItemMap.get(importedItem.id)!
      mergedItems[index] = importedItem
    } else {
      // Append new item
      mergedItems.push(importedItem)
    }
  }

  return mergedItems
}
