import { describe, it, expect } from 'vitest'
import {
  deepMergeReplaceArrays,
  normalizeToDefaultType,
  setOrDelete,
} from '../obj'

describe('obj utils', () => {
  describe('deepMergeReplaceArrays', () => {
    it('should handle non-object inputs', () => {
      expect(deepMergeReplaceArrays(null, { a: 1 })).toEqual({ a: 1 })
      expect(deepMergeReplaceArrays(undefined, { a: 1 })).toEqual({ a: 1 })
      expect(deepMergeReplaceArrays(1, { a: 1 })).toEqual({ a: 1 })

      expect(deepMergeReplaceArrays({ a: 1 }, null)).toEqual({ a: 1 })
      expect(deepMergeReplaceArrays({ a: 1 }, undefined)).toEqual({ a: 1 })
      expect(deepMergeReplaceArrays({ a: 1 }, 2)).toBe(2)
    })

    it('should replace arrays instead of merging them', () => {
      const target = { arr: [1, 2] }
      const source = { arr: [3] }
      expect(deepMergeReplaceArrays(target, source)).toEqual({ arr: [3] })

      expect(deepMergeReplaceArrays([1, 2], [3, 4])).toEqual([3, 4])
    })

    it('should deeply merge objects', () => {
      const target = {
        a: 1,
        b: { x: 1, y: 2 },
        c: 3,
      }
      const source = {
        b: { y: 3, z: 4 },
        c: { nested: true }, // Type mismatch replace?
      }
      // Note: Implementation iterates keys of source.
      // out[k] = deepMergeReplaceArrays(tv ?? {}, sv)

      // For c: target.c is 3 (number). tv is 3. sv is {nested:true}.
      // deepMergeReplaceArrays(3, {nested:true}) -> returns source ({nested:true}) because target is not object

      const result = deepMergeReplaceArrays(target, source)
      expect(result).toEqual({
        a: 1,
        b: { x: 1, y: 3, z: 4 },
        c: { nested: true },
      })
    })

    it('should not mutate target', () => {
      const target = { a: { b: 1 } }
      const source = { a: { c: 2 } }
      const result = deepMergeReplaceArrays(target, source)

      expect(result).not.toBe(target)
      expect(target.a).toEqual({ b: 1 })
      expect(result.a).toEqual({ b: 1, c: 2 })
    })
  })

  describe('normalizeToDefaultType', () => {
    it('should normalize numbers', () => {
      expect(normalizeToDefaultType('123', 0)).toBe(123)
      expect(normalizeToDefaultType(123, 0)).toBe(123)
      // Invalid number fallback
      expect(normalizeToDefaultType('abc', 0)).toBe(0)
      expect(normalizeToDefaultType({}, 0)).toBe(0)
      expect(normalizeToDefaultType(null, 0)).toBe(0)
    })

    it('should normalize booleans', () => {
      expect(normalizeToDefaultType(true, false)).toBe(true)
      expect(normalizeToDefaultType(false, true)).toBe(false)
      // Strict type check for non-numbers
      expect(normalizeToDefaultType('true', false)).toBe(false)
      expect(normalizeToDefaultType(1, false)).toBe(false)
    })

    it('should normalize strings', () => {
      expect(normalizeToDefaultType('text', '')).toBe('text')
      expect(normalizeToDefaultType(123, '')).toBe('')
      expect(normalizeToDefaultType(null, '')).toBe('')
    })

    it('should normalize objects', () => {
      const def = { a: 1 }
      expect(normalizeToDefaultType({ b: 2 }, def)).toEqual({ b: 2 })
      expect(normalizeToDefaultType(null, def)).toBe(def) // typeof null is 'object', but check is val && typeof val === 'object'
      expect(normalizeToDefaultType('string', def)).toBe(def)
    })
  })

  describe('setOrDelete', () => {
    it('should set value if different from default', () => {
      const obj: Record<string, any> = {}
      setOrDelete(obj, 'key', 'value', 'default')
      expect(obj).toEqual({ key: 'value' })
    })

    it('should delete key if value matches default', () => {
      const obj: Record<string, any> = { key: 'value' }
      setOrDelete(obj, 'key', 'default', 'default')
      expect(obj).toEqual({})
      expect('key' in obj).toBe(false)
    })

    it('should normalize value before comparing/setting', () => {
      const obj: Record<string, any> = {}
      // '10' normalizes to 10. Default is 0. 10 != 0 -> set 10
      setOrDelete(obj, 'count', '10', 0)
      expect(obj.count).toBe(10)

      // 'abc' normalizes to 0. Default is 0. 0 == 0 -> delete
      setOrDelete(obj, 'count', 'abc', 0)
      expect('count' in obj).toBe(false)
    })

    it('should handle object equality using JSON.stringify', () => {
      const obj: Record<string, any> = {}
      const def = { a: 1 }

      setOrDelete(obj, 'data', { a: 2 }, def)
      expect(obj.data).toEqual({ a: 2 })

      // Equal object
      setOrDelete(obj, 'data', { a: 1 }, def)
      expect('data' in obj).toBe(false)
    })

    it('should handle complex nested structures', () => {
      const obj: Record<string, any> = {}
      const def = { a: [1, 2], b: { c: 3 } }

      // Different
      setOrDelete(obj, 'complex', { a: [1], b: { c: 3 } }, def)
      expect(obj.complex).toEqual({ a: [1], b: { c: 3 } })

      // Same
      setOrDelete(obj, 'complex', { a: [1, 2], b: { c: 3 } }, def)
      expect('complex' in obj).toBe(false)
    })
  })
})
