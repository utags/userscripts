/**
 * Import and validate JSON from a file.
 */
export function importJson<T = any>(options: {
  validate?: (data: any) => boolean
  onSuccess: (data: T) => Promise<void | boolean> | void | boolean
  confirmMessage?: string
  errorMessage?: string
}) {
  const {
    validate,
    onSuccess,
    confirmMessage = '导入会与现有数据合并，是否继续？',
    errorMessage = '导入的数据格式不正确',
  } = options

  if (confirmMessage) {
    const ok = globalThis.confirm(confirmMessage)
    if (!ok) return
  }

  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'application/json'
  fileInput.style.display = 'none'

  const cleanup = () => {
    fileInput.removeEventListener('change', onChange)
    fileInput.removeEventListener('cancel', cleanup)
    fileInput.remove()
  }

  const onChange = async () => {
    try {
      const f = fileInput.files?.[0]
      if (!f) return
      const txt = await f.text()
      let obj: any
      try {
        obj = JSON.parse(txt)
      } catch {
        alert('无法解析 JSON 文件')
        return
      }

      if (validate && !validate(obj)) {
        alert(errorMessage)
        return
      }

      const result = await onSuccess(obj)
      if (result !== false) {
        alert('导入完成')
      }
    } catch (error) {
      console.error(error)
      alert('导入失败')
    } finally {
      cleanup()
    }
  }

  fileInput.addEventListener('change', onChange)
  fileInput.addEventListener('cancel', cleanup)
  document.documentElement.append(fileInput)
  fileInput.click()
}
