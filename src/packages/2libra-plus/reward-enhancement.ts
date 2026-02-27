import { onDomChange } from '../../utils/dom-watcher'

type GetSettings = () => any

const MIN_REWARD_AMOUNT = 100
const MAX_REWARD_AMOUNT = 500

let stopObserver: (() => void) | undefined

export function initRewardEnhancement(getSettings: GetSettings): void {
  runRewardEnhancement(getSettings)
}

export function runRewardEnhancement(getSettings: GetSettings): void {
  const settings = getSettings()
  if (!settings.enhanceReward) {
    if (stopObserver) {
      stopObserver()
      stopObserver = undefined
    }

    return
  }

  if (stopObserver) return

  stopObserver = onDomChange(() => {
    checkAndInject(getSettings)
  })
}

function checkAndInject(getSettings: GetSettings): void {
  const popupSelector = 'input.range.range-xs.range-success'
  const inputs = document.querySelectorAll(popupSelector)
  for (const input of inputs) {
    if (input instanceof HTMLInputElement) {
      injectButtons(input, getSettings)
    }
  }
}

function injectButtons(
  input: HTMLInputElement,
  getSettings: GetSettings
): void {
  const container = input.parentElement
  if (!container) return

  if (container.querySelector('.libra-plus-reward-buttons')) return

  const btnContainer = document.createElement('div')
  btnContainer.className = 'libra-plus-reward-buttons'

  const settings = getSettings()
  const amountsStr = String(
    settings.rewardAmounts || '100, 150, 200, 300, 350, 400, 500'
  )
  const amounts = amountsStr
    .split(/[,，\s\u3000]/)
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter(
      (n) =>
        !Number.isNaN(n) && n >= MIN_REWARD_AMOUNT && n <= MAX_REWARD_AMOUNT
    )

  for (const amount of amounts) {
    const btn = createButton(amount.toString(), () => {
      setValue(input, amount)
      clickConfirm(input)
    })
    btnContainer.append(btn)
  }

  // Random button
  const randomRangeStr = String(settings.rewardRandomRange || '100-500')
  let [min, max] = randomRangeStr
    .split(/[-~]/)
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n))

  if (!min) min = MIN_REWARD_AMOUNT
  if (!max) max = MAX_REWARD_AMOUNT

  if (min > max) {
    const temp = min
    min = max
    max = temp
  }

  if (!min || min < MIN_REWARD_AMOUNT || min > MAX_REWARD_AMOUNT)
    min = MIN_REWARD_AMOUNT
  if (!max || max < MIN_REWARD_AMOUNT || max > MAX_REWARD_AMOUNT)
    max = MAX_REWARD_AMOUNT
  if (min > max) min = max // In case both were out of bounds in a way that caused flip, though unlikely with above logic

  const randomBtn = createButton('随机', () => {
    let randomAmount = Math.floor(Math.random() * (max - min + 1)) + min

    console.info(
      '[2libra-plus] 💰 随机打赏金币',
      randomAmount,
      '范围: min',
      min,
      'max',
      max
    )

    if (randomAmount === 250) {
      randomAmount = 200
    }

    const probability = Number.parseInt(
      String(settings.rewardProbability || 100),
      10
    )
    const random = Math.floor(Math.random() * 100) + 1
    // 如果随机值大于概率值，则跳过（即 random <= probability 时才打赏）
    if (random > probability) {
      console.info(
        '[2libra-plus] 🎲 随机打赏跳过',
        '概率:',
        probability,
        '随机值:',
        random
      )
      const originalText = randomBtn.textContent
      randomBtn.textContent = '未触发'
      if (randomBtn instanceof HTMLButtonElement) {
        randomBtn.disabled = true
      }

      setTimeout(() => {
        randomBtn.textContent = originalText
        if (randomBtn instanceof HTMLButtonElement) {
          randomBtn.disabled = false
        }
      }, 1000)
      return
    }

    setValue(input, randomAmount)
    clickConfirm(input)
  })
  btnContainer.append(randomBtn)

  // Insert before input
  input.before(btnContainer)

  // Align confirm button
  const confirmBtn = container.parentElement?.querySelector('button')
  if (confirmBtn) {
    confirmBtn.classList.add('libra-plus-reward-confirm-btn')
  }
}

function createButton(text: string, onClick: () => void): HTMLElement {
  const btn = document.createElement('div')
  // Using Tailwind classes similar to existing UI but compact
  btn.className = 'libra-plus-reward-btn'
  btn.textContent = text
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    onClick()
  })
  return btn
}

function setValue(input: HTMLInputElement, value: number): void {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    globalThis.HTMLInputElement.prototype,
    'value'
  )?.set

  const originalStep = input.step
  input.step = '1'

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value)
  } else {
    input.value = value.toString()
  }

  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))

  // Restore step only if value is multiple of original step to keep UI consistent
  // otherwise keep it '1' to prevent snapping
  if (originalStep && value % Number(originalStep) === 0) {
    input.step = originalStep
  }
}

function clickConfirm(input: HTMLInputElement): void {
  const parent = input.parentElement
  if (!parent) return

  // Structure: .w-40 > input; .w-40 sibling is confirm button
  const confirmBtn = parent.parentElement?.querySelector('button')
  if (confirmBtn) {
    confirmBtn.click()
  }
}
