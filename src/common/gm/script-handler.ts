const getScriptHandler = () => {
  if (typeof GM !== 'undefined' && (GM as any).info) {
    return ((GM as any).info.scriptHandler || '') as string
  }

  return ''
}

export const scriptHandler = getScriptHandler().toLowerCase()
