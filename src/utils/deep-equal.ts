export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false
  }

  if (Array.isArray(a)) {
    if (a.length !== (b as any[]).length) {
      return false
    }

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], (b as any[])[i])) {
        return false
      }
    }

    return true
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !deepEqual((a as any)[key], (b as any)[key])
    ) {
      return false
    }
  }

  return true
}
