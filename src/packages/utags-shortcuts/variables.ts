import { type Variable } from './types'

export function getVariableValue(
  key: string,
  variables: Array<Variable[] | undefined>
): string | undefined {
  for (const list of variables) {
    if (list) {
      const v = list.find((v) => v.key === key)
      if (v) return v.value
    }
  }

  return undefined
}

export function createVariableResolver(
  variables: Array<Variable[] | undefined>
) {
  return (key: string) => {
    if (key.startsWith('v:')) {
      return getVariableValue(key.slice(2), variables)
    }

    return undefined
  }
}
