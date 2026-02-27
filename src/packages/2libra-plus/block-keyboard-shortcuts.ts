import { type GetSettings } from './index'

let hasInitialized = false
let currentBlockedShortcuts: Array<{
  key: string
  modifiers: { ctrl: boolean; alt: boolean; shift: boolean; meta: boolean }
}> = []

/**
 * 解析快捷键字符串
 * @param keyStr 快捷键字符串，如 "ctrl+b", "cmd+s"
 */
function parseShortcut(keyStr: string) {
  const parts = keyStr
    .toLowerCase()
    .split('+')
    .map((s) => s.trim())
  const key = parts[parts.length - 1]
  const modifiers = {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    alt: parts.includes('alt') || parts.includes('option'),
    shift: parts.includes('shift'),
    meta:
      parts.includes('meta') ||
      parts.includes('cmd') ||
      parts.includes('command') ||
      parts.includes('super') ||
      parts.includes('win'),
  }
  return { key, modifiers }
}

function handleKeyDown(e: KeyboardEvent) {
  if (currentBlockedShortcuts.length === 0) return

  // 检查是否在输入框内
  const target = e.target as HTMLElement
  const isInput =
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  if (!isInput) return

  const pressedKey = e.key.toLowerCase()

  for (const shortcut of currentBlockedShortcuts) {
    const { key, modifiers } = shortcut

    // 检查按键是否匹配
    if (key !== pressedKey) continue

    // 检查修饰键是否匹配
    if (e.ctrlKey !== modifiers.ctrl) continue
    if (e.altKey !== modifiers.alt) continue
    if (e.shiftKey !== modifiers.shift) continue
    if (e.metaKey !== modifiers.meta) continue

    // 匹配成功，只阻止事件冒泡，不阻止默认行为
    // 这样输入框绑定的快捷键事件会被拦截（因为它们通常也是监听 keydown/keypress/keyup）
    // 但浏览器默认快捷键（如 cmd+w 关闭标签）仍然会触发
    e.stopPropagation()
    // e.preventDefault() // 不阻止默认行为
    console.info('[2libra-plus] 🚫 已屏蔽快捷键:', key)
    return
  }
}

export function initBlockKeyboardShortcuts(getSettings: GetSettings): void {
  if (hasInitialized) return
  hasInitialized = true

  // 初始加载设置
  updateBlockedShortcuts(getSettings().blockedShortcuts)

  // 使用捕获阶段监听，以确保能优先拦截
  globalThis.addEventListener('keydown', handleKeyDown, true)
}

export function runBlockKeyboardShortcuts(getSettings: GetSettings): void {
  updateBlockedShortcuts(getSettings().blockedShortcuts)
}

function updateBlockedShortcuts(shortcutsStr: string | undefined): void {
  if (!shortcutsStr) {
    currentBlockedShortcuts = []
    return
  }

  currentBlockedShortcuts = shortcutsStr
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => parseShortcut(s))
}
