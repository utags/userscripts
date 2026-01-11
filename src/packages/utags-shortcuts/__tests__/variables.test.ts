import { describe, expect, it } from 'vitest'

import { type Variable } from '../types'
import { createVariableResolver, getVariableValue } from '../variables'

describe('variables', () => {
  const vars1: Variable[] = [
    { id: '1', key: 'name', value: 'Alice' },
    { id: '2', key: 'role', value: 'Admin' },
  ]

  const vars2: Variable[] = [
    { id: '3', key: 'name', value: 'Bob' },
    { id: '4', key: 'city', value: 'New York' },
  ]

  const vars3: Variable[] = [{ id: '5', key: 'country', value: 'USA' }]

  describe('getVariableValue', () => {
    it('should retrieve value from a single list', () => {
      expect(getVariableValue('name', [vars1])).toBe('Alice')
      expect(getVariableValue('role', [vars1])).toBe('Admin')
    })

    it('should return undefined if key not found', () => {
      expect(getVariableValue('age', [vars1])).toBeUndefined()
    })

    it('should respect priority order (first list overrides second)', () => {
      // vars1 (Alice) should override vars2 (Bob)
      expect(getVariableValue('name', [vars1, vars2])).toBe('Alice')

      // vars2 (Bob) should be found if vars1 doesn't have it (but here vars1 has name)
      // Let's test non-overlapping keys
      expect(getVariableValue('city', [vars1, vars2])).toBe('New York')
    })

    it('should skip undefined lists', () => {
      expect(getVariableValue('name', [undefined, vars1])).toBe('Alice')
      expect(getVariableValue('city', [undefined, vars2])).toBe('New York')
      expect(getVariableValue('country', [vars1, undefined, vars3])).toBe('USA')
    })

    it('should handle empty lists', () => {
      expect(getVariableValue('name', [[], vars1])).toBe('Alice')
    })

    it('should return undefined if all lists are checked and key is not found', () => {
      expect(getVariableValue('unknown', [vars1, vars2, vars3])).toBeUndefined()
    })
  })

  describe('createVariableResolver', () => {
    it('should resolve keys starting with "v:"', () => {
      const resolver = createVariableResolver([vars1, vars2])

      expect(resolver('v:name')).toBe('Alice')
      expect(resolver('v:role')).toBe('Admin')
      expect(resolver('v:city')).toBe('New York')
    })

    it('should return undefined for keys not starting with "v:"', () => {
      const resolver = createVariableResolver([vars1])

      expect(resolver('name')).toBeUndefined()
      expect(resolver('v-name')).toBeUndefined()
    })

    it('should return undefined if variable value is not found', () => {
      const resolver = createVariableResolver([vars1])

      expect(resolver('v:unknown')).toBeUndefined()
    })

    it('should handle complex priority with multiple lists', () => {
      // Priority: vars1 > vars2 > vars3
      const resolver = createVariableResolver([vars1, vars2, vars3])

      expect(resolver('v:name')).toBe('Alice') // vars1
      expect(resolver('v:city')).toBe('New York') // vars2
      expect(resolver('v:country')).toBe('USA') // vars3
    })
  })
})
