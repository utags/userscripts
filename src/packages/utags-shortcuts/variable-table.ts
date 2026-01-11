import { c } from '../../utils/c'
import { setIcon } from '../../utils/dom'
import { uid } from '../../utils/uid'
import { type Variable } from './types'

export function renderVariableTable(
  container: HTMLElement,
  options: {
    initialValue?: Variable[]
    onChange: (value: Variable[] | undefined) => void
  }
) {
  let variables: Variable[] = options.initialValue
    ? [...options.initialValue]
    : []

  if (variables.length === 0) {
    variables.push({ id: uid(), key: '', value: '' })
  }

  const notifyChange = () => {
    const valid = variables.length === 0 ? undefined : [...variables]
    options.onChange(valid)
  }

  // Create a host element for Shadow DOM
  const host = c('div', { className: 'variable-table-host' })
  const shadow = host.attachShadow({ mode: 'open' })

  // Styles
  const style = c('style')
  style.textContent = `
    :host {
      display: block;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #374151;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .var-table {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }
    .var-table-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr 32px;
      gap: 0.75rem;
      align-items: center;
    }
    .header {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      font-weight: 600;
      padding-bottom: 0.25rem;
    }
    .col-key, .col-val {
      min-width: 0;
    }
    input {
      display: block;
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: #1f2937;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: all 0.15s ease-in-out;
    }
    input:focus {
      background-color: #fff;
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    input::placeholder {
      color: #9ca3af;
    }
    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: 0.375rem;
      color: #9ca3af;
      cursor: pointer;
      transition: all 0.2s;
    }
    .icon-btn:hover {
      background-color: #fee2e2;
      color: #ef4444;
    }
    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.625rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
      background-color: #fff;
      border: 1px dashed #d1d5db;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .add-btn:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
      color: #111827;
    }
    /* Icon styling adjustments for inside shadow DOM */
    .icon-btn img, .add-btn img {
      display: block;
      width: 16px;
      height: 16px;
    }
  `
  shadow.append(style)

  const table = c('div', { className: 'var-table' })
  const body = c('div', { className: 'var-table-body' })

  // Header
  const header = c('div', { className: 'row header' })
  header.append(
    c('div', { className: 'col-key', text: '变量名 (Name)' }),
    c('div', { className: 'col-val', text: '值 (Value)' }),
    c('div', { className: 'col-act', text: '' })
  )
  table.append(header)
  table.append(body)

  const rowMap = new Map<string, HTMLElement>()

  const renderRow = (v: Variable) => {
    const row = c('div', { className: 'row' })
    // Store ID on dataset for potential debugging or lookup
    row.dataset.id = v.id

    const keyInput = c('input', {
      type: 'text',
      className: 'input-key',
      value: v.key,
      placeholder: 'key (e.g. api_key)',
    })
    keyInput.addEventListener('change', () => {
      // Find current variable object in the latest array
      const current = variables.find((x) => x.id === v.id)
      if (current) {
        current.key = keyInput.value.trim()
        notifyChange()
      }
    })

    const valInput = c('input', {
      type: 'text',
      className: 'input-val',
      value: v.value,
      placeholder: 'value',
    })
    valInput.addEventListener('change', () => {
      const current = variables.find((x) => x.id === v.id)
      if (current) {
        current.value = valInput.value
        notifyChange()
      }
    })

    const delBtn = c('button', {
      className: 'icon-btn',
      attrs: { title: '删除变量' },
    })
    setIcon(delBtn, 'lucide:trash-2')
    delBtn.addEventListener('click', () => {
      variables = variables.filter((x) => x.id !== v.id)
      notifyChange()

      if (variables.length === 0) {
        variables.push({ id: uid(), key: '', value: '' })
        renderAll()
      } else {
        row.remove()
        rowMap.delete(v.id)
      }
    })

    row.append(
      c('div', { className: 'col-key', children: [keyInput] }),
      c('div', { className: 'col-val', children: [valInput] }),
      c('div', { className: 'col-act', children: [delBtn] })
    )
    return row
  }

  const renderAll = () => {
    // 1. Clean up removed rows
    const currentIds = new Set(variables.map((v) => v.id))
    for (const [id, row] of rowMap) {
      if (!currentIds.has(id)) {
        row.remove()
        rowMap.delete(id)
      }
    }

    // 2. Reconcile DOM
    let nextSibling = body.firstElementChild as HTMLElement | undefined

    for (const v of variables) {
      let row = rowMap.get(v.id)
      if (row) {
        // Update input values if changed externally
        const keyInput = row.querySelector<HTMLInputElement>('.input-key')!
        const valInput = row.querySelector<HTMLInputElement>('.input-val')!
        if (keyInput && keyInput.value !== v.key) keyInput.value = v.key
        if (valInput && valInput.value !== v.value) valInput.value = v.value
      } else {
        row = renderRow(v)
        rowMap.set(v.id, row)
      }

      if (row === nextSibling) {
        nextSibling = nextSibling.nextElementSibling as HTMLElement | undefined
      } else if (nextSibling) {
        nextSibling.before(row)
      } else {
        body.append(row)
      }
    }
  }

  renderAll()

  // Add Button
  const addBtn = c('button', {
    className: 'add-btn',
    text: '添加变量',
  })
  setIcon(addBtn, 'lucide:plus')
  addBtn.addEventListener('click', () => {
    // Wait for onChange() -> update() completion
    setTimeout(() => {
      const newVar: Variable = { id: uid(), key: '', value: '' }
      variables.push(newVar)
      notifyChange()
      renderAll()
      const row = rowMap.get(newVar.id)
      if (!row) return
      const keyInput = row.querySelector<HTMLInputElement>('.input-key')
      keyInput!.focus()
    }, 10)
  })

  table.append(addBtn)
  shadow.append(table)
  container.append(host)

  return {
    update(newValue: Variable[] | undefined) {
      variables = newValue ? [...newValue] : []
      if (variables.length === 0) {
        variables.push({ id: uid(), key: '', value: '' })
      }

      renderAll()
    },
  }
}
