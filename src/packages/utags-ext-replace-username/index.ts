import styleText from 'css:./style.scss'

// 插入样式
const style = document.createElement('style')
style.textContent = styleText
document.head.append(style)

// 遍历 a[data-hovercard-url] 元素，如果改元素有 data-utags 值（非空），将它的 text 用 span 标签包裹里来。
// 需要监听 dom 变化，当有新的元素插入时，也需要包裹它。但修改过的，不要再包裹。
// 并给这个元素加上 data-utags-replaced="true" 来标记它已经被处理过了。

function processElements() {
  const elements = document.querySelectorAll(
    'a[data-hovercard-url]:not([data-utags-replaced="true"])'
  )
  for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue

    const utags = element.dataset.utags
    if (!utags) continue

    // 标记已处理，避免重复处理
    element.dataset.utagsReplaced = 'true'

    // 遍历子节点，将文本节点包裹在 span 中
    const childNodes = Array.from(element.childNodes)
    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const span = document.createElement('span')
        span.textContent = node.textContent
        node.replaceWith(span)
      }
    }
  }
}

let timer: ReturnType<typeof requestAnimationFrame> | undefined

function scheduleProcess() {
  if (timer) return
  timer = requestAnimationFrame(() => {
    processElements()
    timer = undefined
  })
}

const observer = new MutationObserver((mutations) => {
  let shouldProcess = false
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      shouldProcess = true
      break
    }

    if (
      mutation.type === 'attributes' &&
      mutation.attributeName === 'data-utags'
    ) {
      shouldProcess = true
      break
    }
  }

  if (shouldProcess) {
    scheduleProcess()
  }
})

// 初始执行
scheduleProcess()

// 监听 DOM 变化
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['data-utags'],
})
