export function deepMergeReplaceArrays(target: any, source: any): any {
  if (target === null || typeof target !== 'object') return source
  if (source === null || typeof source !== 'object') return source ?? target

  // Arrays: replace with source
  if (Array.isArray(target) && Array.isArray(source)) return source

  const out: Record<string, any> = { ...target }
  const src = source as Record<string, any>
  const trg = target as Record<string, any>
  for (const k of Object.keys(src)) {
    const sv = src[k]
    const tv = trg[k]
    if (Array.isArray(sv)) out[k] = sv
    else if (sv && typeof sv === 'object')
      out[k] = deepMergeReplaceArrays(tv ?? {}, sv)
    else out[k] = sv
  }

  return out
}

export function setOrDelete(
  obj: Record<string, any>,
  key: string,
  value: any,
  defaultValue: any
): void {
  const normalizeToDefaultType = (val: any, dv: any): any => {
    const t = typeof dv

    if (t === 'number') {
      const n = Number(val)
      return Number.isFinite(n) ? n : dv
    }

    if (t === 'object') {
      return val && typeof val === 'object' ? val : dv
    }

    return typeof val === t ? val : dv
  }

  const normalized = normalizeToDefaultType(value, defaultValue)
  const isEqual = (a: any, b: any): boolean => {
    // Primitive compare; fallback to JSON for objects
    if (a === b) return true
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      try {
        return JSON.stringify(a) === JSON.stringify(b)
      } catch {}
    }

    return false
  }

  if (isEqual(normalized, defaultValue)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete obj[key]
  } else {
    obj[key] = normalized
  }
}
