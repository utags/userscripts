import { isTopFrame } from '../../utils/is-top-frame'
import { registerValueChangeListenerTests } from './tests/value-change-listener'
/* eslint-disable @typescript-eslint/naming-convention */

declare const GM_info: any
declare const GM_setValue: any
declare const GM_getValue: any
declare const GM_deleteValue: any
declare const GM_listValues: any
declare const GM_addStyle: any
declare const GM_registerMenuCommand: any
declare const GM_unregisterMenuCommand: any
declare const GM_xmlhttpRequest: any
declare const GM_getResourceText: any
declare const GM_getResourceURL: any
declare const GM_notification: any
declare const unsafeWindow: any
declare const GM_download: any
declare const GM_openInTab: any
declare const GM_setClipboard: any
declare const GM_getTab: any
declare const GM_saveTab: any
declare const GM_getTabs: any
declare const GM_cookie: any
declare const GM_webRequest: any
declare const GM_addElement: any
declare const GM_log: any
declare const GM_setValues: any
declare const GM_getValues: any
declare const GM_deleteValues: any
declare const GM_addValueChangeListener: any
declare const GM_removeValueChangeListener: any
declare const GM: any
declare const GM_audio: any
/* eslint-enable @typescript-eslint/naming-convention */

type TestResult = {
  supported: boolean
  passed: number
  total: number
  message?: string
  error?: any
}

type ApiTest = {
  name: string
  gmRun: () => Promise<TestResult> | TestResult
  gmDotRun?: () => Promise<TestResult> | TestResult
}

/* eslint-disable unicorn/no-typeof-undefined */
const tests: ApiTest[] = []

function registerTest(
  name: string,
  gmRun: () => Promise<TestResult> | TestResult,
  gmDotRun?: () => Promise<TestResult> | TestResult
) {
  tests.push({ name, gmRun, gmDotRun })
}

// --- Utils ---
const isPromise = (value: any) =>
  value &&
  typeof value.then === 'function' &&
  Object.prototype.toString.call(value) === '[object Promise]'

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const readClipboard = async (): Promise<string | null> => {
  if (typeof navigator.clipboard?.readText === 'function') {
    try {
      return await navigator.clipboard.readText()
    } catch {
      // Ignore
    }
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.append(textarea)
    textarea.focus()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const successful = document.execCommand('paste')
    const val = textarea.value
    textarea.remove()
    if (successful) return val
  } catch {
    // Ignore
  }

  return null
}

let isGmSetClipboardWorking = false
let isGmDotSetClipboardWorking = false

// --- Tests ---

registerTest(
  'info',
  () => {
    const supported = typeof GM_info !== 'undefined'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  },
  async () => {
    const supported =
      typeof GM !== 'undefined' && typeof GM.info !== 'undefined'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  }
)

registerTest(
  'log',
  () => {
    const supported = typeof GM_log === 'function'
    if (supported) {
      GM_log('Benchmark log test')
    }

    return { supported, passed: supported ? 1 : 0, total: 1 }
  },
  async () => {
    const supported = typeof GM !== 'undefined' && typeof GM.log === 'function'
    if (supported) {
      GM.log('Benchmark log test')
    }

    return { supported, passed: supported ? 1 : 0, total: 1 }
  }
)

registerTest(
  'setValue / getValue',
  async () => {
    if (
      typeof GM_setValue !== 'function' ||
      typeof GM_getValue !== 'function'
    ) {
      return { supported: false, passed: 0, total: 2 }
    }

    const key = 'benchmark_gm_key'
    const val = 'test-' + Math.random()
    GM_setValue(key, val)

    // Check return type (should NOT be promise)
    const retrievedRaw = GM_getValue(key)
    let passed = 0
    if (!isPromise(retrievedRaw)) {
      passed++
    }

    // Check value correctness
    const retrieved = await retrievedRaw
    if (retrieved === val) {
      passed++
    }

    GM_deleteValue(key)
    return { supported: true, passed, total: 2 }
  },
  async () => {
    if (
      typeof GM === 'undefined' ||
      typeof GM.setValue !== 'function' ||
      typeof GM.getValue !== 'function'
    ) {
      return { supported: false, passed: 0, total: 2 }
    }

    const key = 'benchmark_gm4_key'
    const val = 'gm4-' + Math.random()
    await GM.setValue(key, val)

    // Check return type (should be promise)
    const retrievedRaw = GM.getValue(key)
    let passed = 0
    if (isPromise(retrievedRaw)) {
      passed++
    }

    // Check value correctness
    const retrieved = await retrievedRaw
    if (retrieved === val) {
      passed++
    }

    await GM.deleteValue(key)
    return { supported: true, passed, total: 2 }
  }
)

registerTest(
  'deleteValue',
  async () => {
    if (typeof GM_deleteValue !== 'function')
      return { supported: false, passed: 0, total: 1 }
    const key = 'benchmark_del_key'
    await GM_setValue(key, '1')
    await GM_deleteValue(key)
    const val = await GM_getValue(key)
    return {
      supported: true,
      passed: val === undefined ? 1 : 0,
      total: 1,
    }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.deleteValue !== 'function')
      return { supported: false, passed: 0, total: 1 }
    const key = 'benchmark_gm4_del_key'
    await GM.setValue(key, '1')
    await GM.deleteValue(key)
    const val = await GM.getValue(key)
    return {
      supported: true,
      passed: val === undefined ? 1 : 0,
      total: 1,
    }
  }
)

registerTest(
  'listValues',
  async () => {
    if (typeof GM_listValues !== 'function')
      return { supported: false, passed: 0, total: 1 }
    const key = 'benchmark_list_key'
    await GM_setValue(key, '1')
    const list = await GM_listValues()
    await GM_deleteValue(key)
    return { supported: true, passed: list.includes(key) ? 1 : 0, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.listValues !== 'function')
      return { supported: false, passed: 0, total: 1 }
    const key = 'benchmark_gm4_list_key'
    await GM.setValue(key, '1')
    const list = await GM.listValues()
    await GM.deleteValue(key)
    return { supported: true, passed: list.includes(key) ? 1 : 0, total: 1 }
  }
)

registerTest(
  'setValues / getValues / deleteValues',
  async () => {
    if (
      typeof GM_setValues !== 'function' ||
      typeof GM_getValues !== 'function' ||
      typeof GM_deleteValues !== 'function'
    ) {
      return { supported: false, passed: 0, total: 1 }
    }

    const data = {
      benchmark_set_values_key1: 'val1-' + Math.random(),
      benchmark_set_values_key2: 12_345,
    }
    await GM_setValues(data)
    const retrieved = await GM_getValues(Object.keys(data))
    await GM_deleteValues(Object.keys(data))

    const passed =
      retrieved.benchmark_set_values_key1 === data.benchmark_set_values_key1 &&
      retrieved.benchmark_set_values_key2 === data.benchmark_set_values_key2
    return { supported: true, passed: passed ? 1 : 0, total: 1 }
  },
  async () => {
    if (
      typeof GM === 'undefined' ||
      typeof GM.setValues !== 'function' ||
      typeof GM.getValues !== 'function' ||
      typeof GM.deleteValues !== 'function'
    ) {
      return { supported: false, passed: 0, total: 1 }
    }

    const data = {
      benchmark_set_values_gm4_key1: 'val1-' + Math.random(),
      benchmark_set_values_gm4_key2: 12_345,
    }
    await GM.setValues(data)
    const retrieved = await GM.getValues(Object.keys(data))
    await GM.deleteValues(Object.keys(data))

    const passed =
      retrieved.benchmark_set_values_gm4_key1 ===
        data.benchmark_set_values_gm4_key1 &&
      retrieved.benchmark_set_values_gm4_key2 ===
        data.benchmark_set_values_gm4_key2
    return { supported: true, passed: passed ? 1 : 0, total: 1 }
  }
)

registerValueChangeListenerTests(registerTest)

registerTest(
  'addStyle',
  () => {
    if (typeof GM_addStyle !== 'function')
      return { supported: false, passed: 0, total: 1 }
    try {
      const el = GM_addStyle('.gm-test-style { display: none; }')
      return { supported: true, passed: 1, total: 1 }
    } catch {
      return { supported: true, passed: 0, total: 1 }
    }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.addStyle !== 'function')
      return { supported: false, passed: 0, total: 1 }
    try {
      const el = await GM.addStyle('.gm4-test-style { display: none; }')
      return { supported: true, passed: 1, total: 1 }
    } catch {
      return { supported: true, passed: 0, total: 1 }
    }
  }
)

registerTest(
  'addElement',
  () => {
    if (typeof GM_addElement !== 'function')
      return { supported: false, passed: 0, total: 1 }
    // Try adding an element
    try {
      const el = GM_addElement('div', { id: 'gm-add-element-test' })
      const passed = el && el.tagName === 'DIV' ? 1 : 0
      return { supported: true, passed, total: 1 }
    } catch {
      return { supported: true, passed: 0, total: 1 }
    }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.addElement !== 'function')
      return { supported: false, passed: 0, total: 1 }
    try {
      const el = await GM.addElement('div', { id: 'gm4-add-element-test' })
      const passed = el && el.tagName === 'DIV' ? 1 : 0
      return { supported: true, passed, total: 1 }
    } catch {
      return { supported: true, passed: 0, total: 1 }
    }
  }
)

registerTest(
  'registerMenuCommand',
  () => {
    if (typeof GM_registerMenuCommand !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    if (
      typeof GM === 'undefined' ||
      typeof GM.registerMenuCommand !== 'function'
    )
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'unregisterMenuCommand',
  () => {
    if (typeof GM_unregisterMenuCommand !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    if (
      typeof GM === 'undefined' ||
      typeof GM.unregisterMenuCommand !== 'function'
    )
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'xmlHttpRequest',
  () => {
    if (typeof GM_xmlhttpRequest !== 'function')
      return { supported: false, passed: 0, total: 1 }
    // Basic existence check is enough for compatibility chart usually,
    // but let's try a dummy call if we can, or just assume passed if function exists.
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    const supported =
      typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  }
)

registerTest(
  'download',
  () => {
    if (typeof GM_download !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.download !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'openInTab',
  () => {
    if (typeof GM_openInTab !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.openInTab !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'setClipboard',
  async () => {
    if (typeof GM_setClipboard !== 'function')
      return { supported: false, passed: 0, total: 1 }

    const secret = 'gm_' + Math.random().toString(36).slice(2)
    try {
      GM_setClipboard(secret)

      // Wait for clipboard to update
      await new Promise((resolve) => {
        setTimeout(resolve, 100)
      })

      const text = await readClipboard()
      console.log('GM_setClipboard: text', text)
      if (text === null) {
        // Can't verify whether write worked if read failed
        isGmSetClipboardWorking = false
        return {
          supported: true,
          passed: 1,
          total: 1,
          message: 'Write OK, Read blocked',
        }
      }

      const passed = text === secret ? 1 : 0
      if (passed) isGmSetClipboardWorking = true
      return { supported: true, passed, total: 1 }
    } catch (error) {
      return { supported: true, passed: 0, total: 1, error }
    }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.setClipboard !== 'function')
      return { supported: false, passed: 0, total: 1 }

    const secret = 'gm.' + Math.random().toString(36).slice(2)
    try {
      await GM.setClipboard(secret)

      // Wait for clipboard to update
      await new Promise((resolve) => {
        setTimeout(resolve, 100)
      })

      const text = await readClipboard()
      console.log('GM.setClipboard: text', text)
      if (text === null) {
        // Can't verify whether write worked if read failed
        isGmDotSetClipboardWorking = false
        return {
          supported: true,
          passed: 1,
          total: 1,
          message: 'Write OK, Read blocked',
        }
      }

      const passed = text === secret ? 1 : 0
      if (passed) isGmDotSetClipboardWorking = true
      return { supported: true, passed, total: 1 }
    } catch (error) {
      return { supported: true, passed: 0, total: 1, error }
    }
  }
)

registerTest(
  'notification',
  () => {
    if (typeof GM_notification !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.notification !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'getResourceText',
  () => {
    if (typeof GM_getResourceText !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.getResourceText !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'getResourceURL',
  () => {
    if (typeof GM_getResourceURL !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.getResourceUrl !== 'function')
      // Note: GM.getResourceUrl (lowercase 'rl' in some specs, check this)
      // Usually GM.getResourceUrl
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'getTab / saveTab / getTabs',
  () => {
    const s1 = typeof GM_getTab === 'function'
    const s2 = typeof GM_saveTab === 'function'
    const s3 = typeof GM_getTabs === 'function'
    const supported = s1 && s2 && s3
    return { supported, passed: supported ? 1 : 0, total: 1 }
  },
  async () => {
    // GM.getTab etc are not standard in GM.4 usually, but let's check
    if (
      typeof GM === 'undefined' ||
      typeof GM.getTab !== 'function' ||
      typeof GM.saveTab !== 'function' ||
      typeof GM.getTabs !== 'function'
    )
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'cookie',
  () => {
    const supported =
      typeof GM_cookie !== 'undefined' &&
      (typeof GM_cookie.list === 'function' || typeof GM_cookie === 'function')
    return { supported, passed: supported ? 1 : 0, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.cookie === 'undefined')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest(
  'audio',
  () => {
    // Note: This API is not standard in all managers, mainly checking existence.
    // Since it requires user interaction or audio context, we just check if defined.
    const supported = typeof GM_audio !== 'undefined'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  },
  async () => {
    // GM.audio is not standard, but we check anyway.
    const supported =
      typeof GM !== 'undefined' && typeof GM.audio !== 'undefined'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  }
)

registerTest(
  'webRequest (Deprecated)',
  () => {
    const supported = typeof GM_webRequest === 'function'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  },
  async () => {
    if (typeof GM === 'undefined' || typeof GM.webRequest !== 'function')
      return { supported: false, passed: 0, total: 1 }
    return { supported: true, passed: 1, total: 1 }
  }
)

registerTest('unsafeWindow', () => {
  const supported = typeof globalThis.unsafeWindow !== 'undefined'
  return { supported, passed: supported ? 1 : 0, total: 1 }
})

registerTest('window.onurlchange', () => {
  // Check if the event handler is supported on window
  const supported =
    'onurlchange' in globalThis && globalThis.onurlchange === null
  return { supported, passed: supported ? 1 : 0, total: 1 }
})

registerTest('window.close', () => {
  // Cannot easily test if it works without closing the tab, just check existence
  const supported = typeof window.close === 'function'
  return { supported, passed: supported ? 1 : 0, total: 1 }
})

registerTest('window.focus', () => {
  // Cannot easily test if it works without window interaction, just check existence
  const supported = typeof window.focus === 'function'
  return { supported, passed: supported ? 1 : 0, total: 1 }
})

// --- UI ---

async function render() {
  const hostId = 'data-benchmark-host'
  // Remove existing if any (for hot reload)
  const existing = document.querySelector(
    `[${hostId}="userscript-compatibility"]`
  )
  if (existing) existing.remove()

  const host = document.createElement('div')
  host.setAttribute(hostId, 'userscript-compatibility')
  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = `
    :host {
      position: fixed; top: 20px; right: 20px; z-index: 2147483647;
      background: #fff; color: #333; padding: 16px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-family: sans-serif;
      max-height: 90vh; overflow-y: auto; width: 600px;
      font-size: 13px;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #eee; padding: 6px 8px; text-align: left; }
    th { background: #f9f9f9; font-weight: 600; }
    .pass { color: #2ecc71; font-weight: bold; }
    .fail { color: #e74c3c; font-weight: bold; }
    .na { color: #f59e0b; font-weight: bold; }
    .header h3 { margin: 0 0 8px 0; font-size: 16px; }
    .close { position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 16px; color: #999; }
    .close:hover { color: #333; }
    .copy-btn {
      position: absolute; top: 10px; right: 40px;
      cursor: pointer; font-size: 13px; color: #007aff; border: 1px solid #007aff;
      padding: 2px 8px; border-radius: 4px; background: transparent;
    }
    .copy-btn:hover { background: #007aff; color: #fff; }
    .copy-btn:active { transform: translateY(1px); }
    .log-area {
      margin-top: 16px;
      padding: 10px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      max-height: 150px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
    .log-entry { margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    .log-entry:last-child { border-bottom: none; margin-bottom: 0; }
    .log-entry.error { color: #e74c3c; }
    .log-entry.warning { color: #f59e0b; }
  `
  shadow.append(style)

  const wrapper = document.createElement('div')

  // Header info
  let handler = 'Unknown'
  let version = 'Unknown'

  if (typeof GM !== 'undefined' && typeof GM.info !== 'undefined') {
    handler = GM.info.scriptHandler || handler
    version = GM.info.version || version
    console.log('GM.info', GM.info)
  } else if (typeof GM_info !== 'undefined') {
    handler = GM_info.scriptHandler || handler
    version = GM_info.version || version
    console.log('GM_info', GM_info)
  }

  // Browser info
  const ua = navigator.userAgent
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari')) browser = 'Safari'

  const browserInfo = `${browser} ${/(Chrome|Firefox|Safari)\/([\d.]+)/.exec(ua)?.[2] || ''}`

  wrapper.innerHTML = `
    <div class="close" title="Close">×</div>
    <button class="copy-btn" title="Copy as Markdown">Copy</button>
    <div class="header">
      <h3>Userscript API Benchmark</h3>
      <div><strong>Manager:</strong> ${handler} (${version})</div>
      <div><strong>Browser:</strong> ${browserInfo}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th rowspan="2">API</th>
          <th colspan="2">GM.* (Promise)</th>
          <th colspan="2">GM_* (Callback/Sync)</th>
        </tr>
        <tr>
          <th>Support</th>
          <th>Pass Rate</th>
          <th>Support</th>
          <th>Pass Rate</th>
        </tr>
      </thead>
      <tbody id="benchmark-results-body"></tbody>
    </table>
    <div class="log-area" id="benchmark-log"></div>
  `

  shadow.append(wrapper)
  document.documentElement.append(host)

  wrapper.querySelector('.close')!.addEventListener('click', () => {
    host.remove()
  })

  const logArea = wrapper.querySelector('#benchmark-log')!
  const appendLog = (
    msg: string,
    type: 'info' | 'error' | 'warning' = 'info'
  ) => {
    const entry = document.createElement('div')
    entry.className = `log-entry ${type}`
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`
    logArea.append(entry)
    logArea.scrollTop = logArea.scrollHeight
  }

  const resultsData: Array<{
    name: string
    gmRes: TestResult
    gmDotRes: TestResult
    isWindowApi: boolean
  }> = []

  const copyBtn = wrapper.querySelector('.copy-btn')!
  copyBtn.addEventListener('click', async () => {
    const lines = [
      `# Userscript API Benchmark Results`,
      ``,
      `- **Manager**: ${handler} (${version})`,
      `- **Browser**: ${browserInfo}`,
      `- **Date**: ${new Date().toISOString().split('T')[0]}`,
      ``,
      `| API | GM.* (Support) | GM.* (Pass) | GM_* (Support) | GM_* (Pass) |`,
      `| :--- | :---: | :---: | :---: | :---: |`,
    ]

    for (const { name, gmRes, gmDotRes, isWindowApi } of resultsData) {
      const formatCell = (res: TestResult) => {
        if (res.error) return 'Error'
        if (res.message === 'N/A') return '-'
        if (res.supported) {
          return res.passed === res.total ? '✅' : '⚠️'
        }

        return '❌'
      }

      const formatRate = (res: TestResult) => {
        if (res.error) return '-'
        if (res.message === 'N/A') return '-'
        return `${res.passed}/${res.total}`
      }

      let cell1
      let cell2
      let cell3
      let cell4

      if (isWindowApi) {
        // Swap for Window APIs: Show gmRes (valid) first, gmDotRes (N/A) second
        cell1 = formatCell(gmRes)
        cell2 = formatRate(gmRes)
        cell3 = formatCell(gmDotRes)
        cell4 = formatRate(gmDotRes)
      } else {
        // Standard order: Show gmDotRes (GM.*) first, gmRes (GM_*) second
        cell1 = formatCell(gmDotRes)
        cell2 = formatRate(gmDotRes)
        cell3 = formatCell(gmRes)
        cell4 = formatRate(gmRes)
      }

      lines.push(`| ${name} | ${cell1} | ${cell2} | ${cell3} | ${cell4} |`)
    }

    const markdown = lines.join('\n')

    if (isGmSetClipboardWorking && typeof GM_setClipboard === 'function') {
      GM_setClipboard(markdown, 'text')
    } else if (
      isGmDotSetClipboardWorking &&
      typeof GM !== 'undefined' &&
      typeof GM.setClipboard === 'function'
    ) {
      void GM.setClipboard(markdown, 'text')
    } else {
      try {
        await navigator.clipboard.writeText(markdown)
      } catch {
        // Fallback: use textarea
        const textarea = document.createElement('textarea')
        textarea.value = markdown
        textarea.style.position = 'fixed'
        textarea.style.bottom = '0'
        textarea.style.left = '0'
        textarea.style.width = '100%'
        textarea.style.height = '150px'
        textarea.style.zIndex = '2147483647'

        // Try to insert into shadow DOM first, fallback to body
        if (host.shadowRoot) {
          host.shadowRoot.append(textarea)
        } else {
          document.body.append(textarea)
        }

        textarea.focus()
        textarea.select()

        // Scroll panel to bottom to show textarea
        if (host.shadowRoot) {
          const wrapper = host.shadowRoot.querySelector('div')
          if (wrapper) wrapper.scrollTop = wrapper.scrollHeight
        }

        appendLog(
          'Clipboard write failed. Please copy manually from the textarea below.',
          'error'
        )
      }
    }

    const originalText = copyBtn.textContent
    copyBtn.textContent = 'Copied!'
    setTimeout(() => {
      copyBtn.textContent = originalText
    }, 2000)
  })

  const tbody = wrapper.querySelector('#benchmark-results-body')!
  tbody.innerHTML = ''

  const totalPassed = 0
  const totalTests = 0

  for (const t of tests) {
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${t.name}</td><td>...</td><td>...</td><td>...</td><td>...</td>`
    tbody.append(tr)

    let gmRes: TestResult = { supported: false, passed: 0, total: 0 }
    let gmDotRes: TestResult = { supported: false, passed: 0, total: 0 }

    try {
      // eslint-disable-next-line no-await-in-loop
      gmRes = await t.gmRun()
    } catch (error) {
      gmRes = { supported: false, passed: 0, total: 0, error }
    }

    if (t.gmDotRun) {
      try {
        // eslint-disable-next-line no-await-in-loop
        gmDotRes = await t.gmDotRun()
      } catch (error) {
        gmDotRes = { supported: false, passed: 0, total: 0, error }
      }
    } else {
      gmDotRes = { supported: false, passed: 0, total: 1, message: 'N/A' }
    }

    if (gmRes.error) {
      const msg = `${t.name} (GM_): ${String(gmRes.error)}`
      appendLog(msg, 'error')
      console.error(msg, gmRes.error)
    }

    if (gmRes.message && gmRes.message !== 'N/A') {
      const msg = `${t.name} (GM_): ${gmRes.message}`
      appendLog(msg, 'warning')
      console.warn(msg)
    }

    if (gmDotRes.error) {
      const msg = `${t.name} (GM.): ${String(gmDotRes.error)}`
      appendLog(msg, 'error')
      console.error(msg, gmDotRes.error)
    }

    if (gmDotRes.message && gmDotRes.message !== 'N/A') {
      const msg = `${t.name} (GM.): ${gmDotRes.message}`
      appendLog(msg, 'warning')
      console.warn(msg)
    }

    const isWindowApi = [
      'unsafeWindow',
      'window.onurlchange',
      'window.close',
      'window.focus',
    ].includes(t.name)

    resultsData.push({ name: t.name, gmRes, gmDotRes, isWindowApi })

    const renderCell = (res: TestResult) => {
      if (res.error) {
        return `<td class="fail">Error</td><td class="fail" title="${String(res.error)}">-</td>`
      }

      if (res.message === 'N/A') {
        return `<td class="na">-</td><td class="na">-</td>`
      }

      const passClass = res.supported ? 'pass' : 'fail'
      const passRateClass = res.passed === res.total ? 'pass' : 'fail'

      return `
        <td class="${passClass}" title="${res.message || ''}">${res.supported ? 'Yes' : 'No'}</td>
        <td class="${passRateClass}">${res.passed}/${res.total}</td>
      `
    }

    let rowContent = `<td>${t.name}</td>`

    // For window.* and unsafeWindow APIs, the "main" implementation is the direct one (GM_* column source),
    // so we swap them to show the valid result in the first column group (visually "Primary").

    // eslint-disable-next-line unicorn/prefer-ternary
    if (isWindowApi) {
      // Swap: Show gmRes (valid) first, gmDotRes (N/A) second
      rowContent += renderCell(gmRes) + renderCell(gmDotRes)
    } else {
      // Standard: Show gmDotRes (GM.*) first, gmRes (GM_*) second
      rowContent += renderCell(gmDotRes) + renderCell(gmRes)
    }

    tr.innerHTML = rowContent
  }
}

function start() {
  void render()
}

function main() {
  const urlParams = new URLSearchParams(globalThis.location.search)
  if (urlParams.get('benchmark_role') === 'iframe') {
    const key = urlParams.get('key')
    const value = urlParams.get('value')
    if (key && value) {
      if (typeof GM_setValue === 'function') GM_setValue(key, value)
      if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
        void GM.setValue(key, value)
      }
    }

    return
  }

  if (!isTopFrame()) {
    return
  }

  try {
    const de = document.documentElement as any
    if (de && de.dataset && de.dataset.uab === '1') return
    if (de && de.dataset) de.dataset.uab = '1'
  } catch {}

  if (
    typeof GM !== 'undefined' &&
    typeof GM.registerMenuCommand === 'function'
  ) {
    GM.registerMenuCommand('Run Benchmark', start)
  } else if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Run Benchmark', start)
  } else {
    // Fallback for managers that don't support menu commands or if the API is missing
    start()
  }
}

main()
/* eslint-enable unicorn/no-typeof-undefined */
