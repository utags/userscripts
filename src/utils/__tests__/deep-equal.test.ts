import { describe, expect, it } from 'vitest'

import { deepEqual } from '../deep-equal'

describe('deepEqual', () => {
  it('should return true for strict equality (primitives)', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual('a', 'a')).toBe(true)
    expect(deepEqual(true, true)).toBe(true)
    expect(deepEqual(null, null)).toBe(true)
    expect(deepEqual(undefined, undefined)).toBe(true)
  })

  it('should return false for different primitives', () => {
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual('a', 'b')).toBe(false)
    expect(deepEqual(true, false)).toBe(false)
    expect(deepEqual(null, undefined)).toBe(false)
    expect(deepEqual(1, '1')).toBe(false)
  })

  it('should handle arrays', () => {
    expect(deepEqual([], [])).toBe(true)
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(deepEqual(['a', 'b'], ['a', 'b'])).toBe(true)
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true)

    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
    expect(deepEqual([1, 2, 3], [1, 2])).toBe(false)
    expect(deepEqual([1, 2], [1, 3])).toBe(false)
    expect(deepEqual([], {})).toBe(false)
  })

  it('should handle objects', () => {
    expect(deepEqual({}, {})).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)

    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false)
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
  })

  it('should handle mixed nested structures', () => {
    const obj1 = {
      a: 1,
      b: [2, { c: 3 }],
      d: { e: 'f' },
    }
    const obj2 = {
      a: 1,
      b: [2, { c: 3 }],
      d: { e: 'f' },
    }
    const obj3 = {
      a: 1,
      b: [2, { c: 4 }], // diff
      d: { e: 'f' },
    }

    expect(deepEqual(obj1, obj2)).toBe(true)
    expect(deepEqual(obj1, obj3)).toBe(false)
  })

  it('should handle null and objects', () => {
    expect(deepEqual(null, {})).toBe(false)
    expect(deepEqual({}, null)).toBe(false)
  })
})
