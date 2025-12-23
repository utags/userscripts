import { mergeGroupsMerge, mergeGroupsOverwrite } from './merge-utils'
import type { ShortcutsConfig, ShortcutsStore } from './store'

export async function importAndSave(
  store: ShortcutsStore,
  data: any,
  mode: 'overwrite' | 'merge',
  existingData?: ShortcutsConfig
): Promise<ShortcutsConfig> {
  let obj = data
  if (!Array.isArray(obj.groups) && Array.isArray(obj.items)) {
    obj = { groups: [obj] }
  }

  const existingObj = existingData ?? (await store.load())

  const merged: ShortcutsConfig =
    mode === 'overwrite'
      ? mergeGroupsOverwrite(existingObj, obj)
      : mergeGroupsMerge(existingObj, obj)

  await store.save(merged)
  return merged
}
