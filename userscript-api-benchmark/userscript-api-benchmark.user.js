// ==UserScript==
// @name                 Userscript API Benchmark
// @name:zh-CN           用户脚本 API 基准测试
// @namespace            https://github.com/utags/userscripts
// @version              0.1.3
// @description          Comprehensive benchmark tool for UserScript Manager APIs (GM.* and GM_*)
// @description:zh-CN    用户脚本管理器 API (GM.* 和 GM_*) 的综合基准测试工具，用于检查兼容性与准确性
// @author               Pipecraft
// @match                *://*/*
// @grant                unsafeWindow
// @grant                window.close
// @grant                window.focus
// @grant                window.onurlchange
// @grant                GM_addValueChangeListener
// @grant                GM_removeValueChangeListener
// @grant                GM_setValue
// @grant                GM_deleteValue
// @grant                GM.addValueChangeListener
// @grant                GM.removeValueChangeListener
// @grant                GM.setValue
// @grant                GM.deleteValue
// @grant                GM_info
// @grant                GM.info
// @grant                GM_log
// @grant                GM.log
// @grant                GM_getValue
// @grant                GM.getValue
// @grant                GM_listValues
// @grant                GM.listValues
// @grant                GM_setValues
// @grant                GM_getValues
// @grant                GM_deleteValues
// @grant                GM.setValues
// @grant                GM.getValues
// @grant                GM.deleteValues
// @grant                GM_addStyle
// @grant                GM.addStyle
// @grant                GM_addElement
// @grant                GM.addElement
// @grant                GM_registerMenuCommand
// @grant                GM.registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @grant                GM.unregisterMenuCommand
// @grant                GM_xmlhttpRequest
// @grant                GM.xmlHttpRequest
// @grant                GM_download
// @grant                GM.download
// @grant                GM_openInTab
// @grant                GM.openInTab
// @grant                GM_setClipboard
// @grant                GM.setClipboard
// @grant                GM_notification
// @grant                GM.notification
// @grant                GM_getResourceText
// @grant                GM.getResourceText
// @grant                GM_getResourceURL
// @grant                GM.getResourceUrl
// @grant                GM_getTab
// @grant                GM_saveTab
// @grant                GM_getTabs
// @grant                GM.getTab
// @grant                GM.saveTab
// @grant                GM.getTabs
// @grant                GM_cookie
// @grant                GM.cookie
// @grant                GM_audio
// @grant                GM.audio
// @grant                GM_webRequest
// @grant                GM.webRequest
// ==/UserScript==
//
;(() => {
  'use strict'
  var win = globalThis
  function isTopFrame() {
    return win.self === win.top
  }
  function registerValueChangeListenerTests(registerTest2) {
    registerTest2(
      'addValueChangeListener / removeValueChangeListener',
      async () => {
        if (
          typeof GM_addValueChangeListener !== 'function' ||
          typeof GM_removeValueChangeListener !== 'function' ||
          typeof GM_setValue !== 'function' ||
          typeof GM_deleteValue !== 'function'
        ) {
          return { supported: false, passed: 0, total: 5 }
        }
        let passed = 0
        const total = 5
        const messages = []
        {
          const key = 'benchmark_listener_basic_gm'
          let triggered = false
          const id = GM_addValueChangeListener(
            key,
            (name, oldVal, newVal, remote) => {
              if (name === key && newVal === 'changed') {
                triggered = true
              }
            }
          )
          GM_setValue(key, 'changed')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          GM_removeValueChangeListener(id)
          GM_deleteValue(key)
          if (triggered) {
            passed++
          } else {
            messages.push('Basic: Not triggered')
          }
        }
        {
          const key = 'benchmark_listener_same_gm'
          GM_deleteValue(key)
          let triggered = false
          const id = GM_addValueChangeListener(
            key,
            (name, oldVal, newVal, remote) => {
              if (name === key) triggered = true
            }
          )
          GM_setValue(key, 'initial')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          const initialTriggered = triggered
          if (!initialTriggered) {
            messages.push('SameValue: Initial change NOT triggered')
          }
          triggered = false
          GM_setValue(key, 'initial')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          GM_removeValueChangeListener(id)
          GM_deleteValue(key)
          if (triggered) {
            messages.push('SameValue: Triggered unexpectedly on same value')
          }
          if (initialTriggered && !triggered) {
            passed++
          }
        }
        {
          const key = 'benchmark_listener_obj_gm'
          const obj = { foo: 'bar', num: 123 }
          let receivedVal = null
          const id = GM_addValueChangeListener(
            key,
            (name, oldVal, newVal, remote) => {
              if (name === key) receivedVal = newVal
            }
          )
          GM_setValue(key, obj)
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          GM_removeValueChangeListener(id)
          GM_deleteValue(key)
          const objPassed =
            receivedVal &&
            typeof receivedVal === 'object' &&
            receivedVal.foo === 'bar' &&
            receivedVal.num === 123
          if (objPassed) {
            passed++
          } else {
            messages.push('Object: Value mismatch')
          }
        }
        {
          const keyLocal = 'benchmark_listener_remote_local_gm'
          const keyRemote = 'benchmark_listener_remote_other_gm'
          let localRemoteFlag
          let otherRemoteFlag
          const id1 = GM_addValueChangeListener(
            keyLocal,
            (name, oldVal, newVal, remote) => {
              if (name === keyLocal) localRemoteFlag = remote
            }
          )
          GM_setValue(keyLocal, 'local_change')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          GM_removeValueChangeListener(id1)
          GM_deleteValue(keyLocal)
          const id2 = GM_addValueChangeListener(
            keyRemote,
            (name, oldVal, newVal, remote) => {
              if (name === keyRemote) otherRemoteFlag = remote
            }
          )
          const iframe = document.createElement('iframe')
          const url = new URL(location.href)
          url.searchParams.set('benchmark_role', 'iframe')
          url.searchParams.set('key', keyRemote)
          url.searchParams.set('value', 'remote_change')
          iframe.src = url.href
          iframe.style.display = 'none'
          document.body.append(iframe)
          await new Promise((resolve) => {
            setTimeout(resolve, 1e3)
          })
          iframe.remove()
          GM_removeValueChangeListener(id2)
          GM_deleteValue(keyRemote)
          if (localRemoteFlag === false) {
            passed++
          } else {
            messages.push(
              'Remote(Local): Expected false, got '.concat(localRemoteFlag)
            )
          }
          if (otherRemoteFlag === true) {
            passed++
          } else {
            messages.push(
              'Remote(Other): Expected true, got '.concat(otherRemoteFlag)
            )
          }
        }
        return {
          supported: true,
          passed,
          total,
          message: messages.length > 0 ? messages.join('; ') : void 0,
        }
      },
      async () => {
        if (
          typeof GM === 'undefined' ||
          typeof GM.addValueChangeListener !== 'function' ||
          typeof GM.removeValueChangeListener !== 'function' ||
          typeof GM.setValue !== 'function' ||
          typeof GM.deleteValue !== 'function'
        ) {
          return { supported: false, passed: 0, total: 5 }
        }
        let passed = 0
        const total = 5
        const messages = []
        {
          const key = 'benchmark_listener_basic_gm_dot'
          let triggered = false
          const id = await GM.addValueChangeListener(
            key,
            (name, oldVal, newVal, remote) => {
              if (name === key && newVal === 'changed') {
                triggered = true
              }
            }
          )
          await GM.setValue(key, 'changed')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          await GM.removeValueChangeListener(id)
          await GM.deleteValue(key)
          if (triggered) {
            passed++
          } else {
            messages.push('Basic: Not triggered')
          }
        }
        {
          const key = 'benchmark_listener_same_gm_dot'
          await GM.deleteValue(key)
          let triggered = false
          const id = await GM.addValueChangeListener(
            key,
            (name, oldVal, newVal, remote) => {
              if (name === key) triggered = true
            }
          )
          await GM.setValue(key, 'initial')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          const initialTriggered = triggered
          if (!initialTriggered) {
            messages.push('SameValue: Initial change NOT triggered')
          }
          triggered = false
          await GM.setValue(key, 'initial')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          await GM.removeValueChangeListener(id)
          await GM.deleteValue(key)
          if (triggered) {
            messages.push('SameValue: Triggered unexpectedly on same value')
          }
          if (initialTriggered && !triggered) {
            passed++
          }
        }
        {
          const key = 'benchmark_listener_obj_gm_dot'
          const obj = { foo: 'bar', num: 123 }
          let receivedVal = null
          const id = await GM.addValueChangeListener(
            key,
            (name, oldVal, newVal, remote) => {
              if (name === key) receivedVal = newVal
            }
          )
          await GM.setValue(key, obj)
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          await GM.removeValueChangeListener(id)
          await GM.deleteValue(key)
          const objPassed =
            receivedVal &&
            typeof receivedVal === 'object' &&
            receivedVal.foo === 'bar' &&
            receivedVal.num === 123
          if (objPassed) {
            passed++
          } else {
            messages.push('Object: Value mismatch')
          }
        }
        {
          const keyLocal = 'benchmark_listener_remote_local_gm_dot'
          const keyRemote = 'benchmark_listener_remote_other_gm_dot'
          let localRemoteFlag
          let otherRemoteFlag
          const id1 = await GM.addValueChangeListener(
            keyLocal,
            (name, oldVal, newVal, remote) => {
              if (name === keyLocal) localRemoteFlag = remote
            }
          )
          await GM.setValue(keyLocal, 'local_change')
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })
          await GM.removeValueChangeListener(id1)
          await GM.deleteValue(keyLocal)
          const id2 = await GM.addValueChangeListener(
            keyRemote,
            (name, oldVal, newVal, remote) => {
              if (name === keyRemote) otherRemoteFlag = remote
            }
          )
          const iframe = document.createElement('iframe')
          const url = new URL(location.href)
          url.searchParams.set('benchmark_role', 'iframe')
          url.searchParams.set('key', keyRemote)
          url.searchParams.set('value', 'remote_change')
          iframe.src = url.href
          iframe.style.display = 'none'
          document.body.append(iframe)
          await new Promise((resolve) => {
            setTimeout(resolve, 1e3)
          })
          iframe.remove()
          await GM.removeValueChangeListener(id2)
          await GM.deleteValue(keyRemote)
          if (localRemoteFlag === false) {
            passed++
          } else {
            messages.push(
              'Remote(Local): Expected false, got '.concat(localRemoteFlag)
            )
          }
          if (otherRemoteFlag === true) {
            passed++
          } else {
            messages.push(
              'Remote(Other): Expected true, got '.concat(otherRemoteFlag)
            )
          }
        }
        return {
          supported: true,
          passed,
          total,
          message: messages.length > 0 ? messages.join('; ') : void 0,
        }
      }
    )
  }
  var tests = []
  function registerTest(name, gmRun, gmDotRun) {
    tests.push({ name, gmRun, gmDotRun })
  }
  var isPromise = (value) =>
    value &&
    typeof value.then === 'function' &&
    Object.prototype.toString.call(value) === '[object Promise]'
  var readClipboard = async () => {
    var _a
    if (
      typeof ((_a = navigator.clipboard) == null ? void 0 : _a.readText) ===
      'function'
    ) {
      try {
        return await navigator.clipboard.readText()
      } catch (e) {}
    }
    try {
      const textarea = document.createElement('textarea')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.append(textarea)
      textarea.focus()
      const successful = document.execCommand('paste')
      const val = textarea.value
      textarea.remove()
      if (successful) return val
    } catch (e) {}
    return null
  }
  var isGmSetClipboardWorking = false
  var isGmDotSetClipboardWorking = false
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
      const supported =
        typeof GM !== 'undefined' && typeof GM.log === 'function'
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
      const retrievedRaw = GM_getValue(key)
      let passed = 0
      if (!isPromise(retrievedRaw)) {
        passed++
      }
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
      const retrievedRaw = GM.getValue(key)
      let passed = 0
      if (isPromise(retrievedRaw)) {
        passed++
      }
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
        passed: val === void 0 ? 1 : 0,
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
        passed: val === void 0 ? 1 : 0,
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
        benchmark_set_values_key2: 12345,
      }
      await GM_setValues(data)
      const retrieved = await GM_getValues(Object.keys(data))
      await GM_deleteValues(Object.keys(data))
      const passed =
        retrieved.benchmark_set_values_key1 ===
          data.benchmark_set_values_key1 &&
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
        benchmark_set_values_gm4_key2: 12345,
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
      } catch (e) {
        return { supported: true, passed: 0, total: 1 }
      }
    },
    async () => {
      if (typeof GM === 'undefined' || typeof GM.addStyle !== 'function')
        return { supported: false, passed: 0, total: 1 }
      try {
        const el = await GM.addStyle('.gm4-test-style { display: none; }')
        return { supported: true, passed: 1, total: 1 }
      } catch (e) {
        return { supported: true, passed: 0, total: 1 }
      }
    }
  )
  registerTest(
    'addElement',
    () => {
      if (typeof GM_addElement !== 'function')
        return { supported: false, passed: 0, total: 1 }
      try {
        const el = GM_addElement('div', { id: 'gm-add-element-test' })
        const passed = el && el.tagName === 'DIV' ? 1 : 0
        return { supported: true, passed, total: 1 }
      } catch (e) {
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
      } catch (e) {
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
        await new Promise((resolve) => {
          setTimeout(resolve, 100)
        })
        const text = await readClipboard()
        console.log('GM_setClipboard: text', text)
        if (text === null) {
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
        await new Promise((resolve) => {
          setTimeout(resolve, 100)
        })
        const text = await readClipboard()
        console.log('GM.setClipboard: text', text)
        if (text === null) {
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
        (typeof GM_cookie.list === 'function' ||
          typeof GM_cookie === 'function')
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
      const supported = typeof GM_audio !== 'undefined'
      return { supported, passed: supported ? 1 : 0, total: 1 }
    },
    async () => {
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
    const supported = typeof unsafeWindow !== 'undefined'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  })
  registerTest('window.onurlchange', () => {
    const supported = 'onurlchange' in window && window.onurlchange === null
    return { supported, passed: supported ? 1 : 0, total: 1 }
  })
  registerTest('window.close', () => {
    const supported = typeof window.close === 'function'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  })
  registerTest('window.focus', () => {
    const supported = typeof window.focus === 'function'
    return { supported, passed: supported ? 1 : 0, total: 1 }
  })
  async function render() {
    var _a
    const hostId = 'data-benchmark-host'
    const existing = document.querySelector(
      '['.concat(hostId, '="userscript-compatibility"]')
    )
    if (existing) existing.remove()
    const host = document.createElement('div')
    host.setAttribute(hostId, 'userscript-compatibility')
    const shadow = host.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent =
      '\n    :host {\n      position: fixed; top: 20px; right: 20px; z-index: 2147483647;\n      background: #fff; color: #333; padding: 16px; border-radius: 8px;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-family: sans-serif;\n      max-height: 90vh; overflow-y: auto; width: 600px;\n      font-size: 13px;\n    }\n    table { width: 100%; border-collapse: collapse; margin-top: 10px; }\n    th, td { border: 1px solid #eee; padding: 6px 8px; text-align: left; }\n    th { background: #f9f9f9; font-weight: 600; }\n    .pass { color: #2ecc71; font-weight: bold; }\n    .fail { color: #e74c3c; font-weight: bold; }\n    .na { color: #f59e0b; font-weight: bold; }\n    .header h3 { margin: 0 0 8px 0; font-size: 16px; }\n    .close { position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 16px; color: #999; }\n    .close:hover { color: #333; }\n    .copy-btn {\n      position: absolute; top: 10px; right: 40px;\n      cursor: pointer; font-size: 13px; color: #007aff; border: 1px solid #007aff;\n      padding: 2px 8px; border-radius: 4px; background: transparent;\n    }\n    .copy-btn:hover { background: #007aff; color: #fff; }\n    .copy-btn:active { transform: translateY(1px); }\n    .log-area {\n      margin-top: 16px;\n      padding: 10px;\n      background: #f5f5f5;\n      border: 1px solid #ddd;\n      border-radius: 4px;\n      font-family: monospace;\n      font-size: 11px;\n      max-height: 150px;\n      overflow-y: auto;\n      white-space: pre-wrap;\n    }\n    .log-entry { margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 4px; }\n    .log-entry:last-child { border-bottom: none; margin-bottom: 0; }\n    .log-entry.error { color: #e74c3c; }\n    .log-entry.warning { color: #f59e0b; }\n  '
    shadow.append(style)
    const wrapper = document.createElement('div')
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
    const ua = navigator.userAgent
    let browser = 'Unknown'
    if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari')) browser = 'Safari'
    const browserInfo = ''
      .concat(browser, ' ')
      .concat(
        ((_a = /(Chrome|Firefox|Safari)\/([\d.]+)/.exec(ua)) == null
          ? void 0
          : _a[2]) || ''
      )
    wrapper.innerHTML =
      '\n    <div class="close" title="Close">\xD7</div>\n    <button class="copy-btn" title="Copy as Markdown">Copy</button>\n    <div class="header">\n      <h3>Userscript API Benchmark</h3>\n      <div><strong>Manager:</strong> '
        .concat(handler, ' (')
        .concat(version, ')</div>\n      <div><strong>Browser:</strong> ')
        .concat(
          browserInfo,
          '</div>\n    </div>\n    <table>\n      <thead>\n        <tr>\n          <th rowspan="2">API</th>\n          <th colspan="2">GM.* (Promise)</th>\n          <th colspan="2">GM_* (Callback/Sync)</th>\n        </tr>\n        <tr>\n          <th>Support</th>\n          <th>Pass Rate</th>\n          <th>Support</th>\n          <th>Pass Rate</th>\n        </tr>\n      </thead>\n      <tbody id="benchmark-results-body"></tbody>\n    </table>\n    <div class="log-area" id="benchmark-log"></div>\n  '
        )
    shadow.append(wrapper)
    document.documentElement.append(host)
    wrapper.querySelector('.close').addEventListener('click', () => {
      host.remove()
    })
    const logArea = wrapper.querySelector('#benchmark-log')
    const appendLog = (msg, type = 'info') => {
      const entry = document.createElement('div')
      entry.className = 'log-entry '.concat(type)
      entry.textContent = '['
        .concat(/* @__PURE__ */ new Date().toLocaleTimeString(), '] ')
        .concat(msg)
      logArea.append(entry)
      logArea.scrollTop = logArea.scrollHeight
    }
    const resultsData = []
    const copyBtn = wrapper.querySelector('.copy-btn')
    copyBtn.addEventListener('click', async () => {
      const lines = [
        '# Userscript API Benchmark Results',
        '',
        '- **Manager**: '.concat(handler, ' (').concat(version, ')'),
        '- **Browser**: '.concat(browserInfo),
        '- **Date**: '.concat(
          /* @__PURE__ */ new Date().toISOString().split('T')[0]
        ),
        '',
        '| API | GM.* (Support) | GM.* (Pass) | GM_* (Support) | GM_* (Pass) |',
        '| :--- | :---: | :---: | :---: | :---: |',
      ]
      for (const { name, gmRes, gmDotRes, isWindowApi } of resultsData) {
        const formatCell = (res) => {
          if (res.error) return 'Error'
          if (res.message === 'N/A') return '-'
          if (res.supported) {
            return res.passed === res.total ? '\u2705' : '\u26A0\uFE0F'
          }
          return '\u274C'
        }
        const formatRate = (res) => {
          if (res.error) return '-'
          if (res.message === 'N/A') return '-'
          return ''.concat(res.passed, '/').concat(res.total)
        }
        let cell1
        let cell2
        let cell3
        let cell4
        if (isWindowApi) {
          cell1 = formatCell(gmRes)
          cell2 = formatRate(gmRes)
          cell3 = formatCell(gmDotRes)
          cell4 = formatRate(gmDotRes)
        } else {
          cell1 = formatCell(gmDotRes)
          cell2 = formatRate(gmDotRes)
          cell3 = formatCell(gmRes)
          cell4 = formatRate(gmRes)
        }
        lines.push(
          '| '
            .concat(name, ' | ')
            .concat(cell1, ' | ')
            .concat(cell2, ' | ')
            .concat(cell3, ' | ')
            .concat(cell4, ' |')
        )
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
        } catch (e) {
          const textarea = document.createElement('textarea')
          textarea.value = markdown
          textarea.style.position = 'fixed'
          textarea.style.bottom = '0'
          textarea.style.left = '0'
          textarea.style.width = '100%'
          textarea.style.height = '150px'
          textarea.style.zIndex = '2147483647'
          if (host.shadowRoot) {
            host.shadowRoot.append(textarea)
          } else {
            document.body.append(textarea)
          }
          textarea.focus()
          textarea.select()
          if (host.shadowRoot) {
            const wrapper2 = host.shadowRoot.querySelector('div')
            if (wrapper2) wrapper2.scrollTop = wrapper2.scrollHeight
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
      }, 2e3)
    })
    const tbody = wrapper.querySelector('#benchmark-results-body')
    tbody.innerHTML = ''
    const totalPassed = 0
    const totalTests = 0
    for (const t of tests) {
      const tr = document.createElement('tr')
      tr.innerHTML = '<td>'.concat(
        t.name,
        '</td><td>...</td><td>...</td><td>...</td><td>...</td>'
      )
      tbody.append(tr)
      let gmRes = { supported: false, passed: 0, total: 0 }
      let gmDotRes = { supported: false, passed: 0, total: 0 }
      try {
        gmRes = await t.gmRun()
      } catch (error) {
        gmRes = { supported: false, passed: 0, total: 0, error }
      }
      if (t.gmDotRun) {
        try {
          gmDotRes = await t.gmDotRun()
        } catch (error) {
          gmDotRes = { supported: false, passed: 0, total: 0, error }
        }
      } else {
        gmDotRes = { supported: false, passed: 0, total: 1, message: 'N/A' }
      }
      if (gmRes.error) {
        const msg = ''.concat(t.name, ' (GM_): ').concat(String(gmRes.error))
        appendLog(msg, 'error')
        console.error(msg, gmRes.error)
      }
      if (gmRes.message && gmRes.message !== 'N/A') {
        const msg = ''.concat(t.name, ' (GM_): ').concat(gmRes.message)
        appendLog(msg, 'warning')
        console.warn(msg)
      }
      if (gmDotRes.error) {
        const msg = ''.concat(t.name, ' (GM.): ').concat(String(gmDotRes.error))
        appendLog(msg, 'error')
        console.error(msg, gmDotRes.error)
      }
      if (gmDotRes.message && gmDotRes.message !== 'N/A') {
        const msg = ''.concat(t.name, ' (GM.): ').concat(gmDotRes.message)
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
      const renderCell = (res) => {
        if (res.error) {
          return '<td class="fail">Error</td><td class="fail" title="'.concat(
            String(res.error),
            '">-</td>'
          )
        }
        if (res.message === 'N/A') {
          return '<td class="na">-</td><td class="na">-</td>'
        }
        const passClass = res.supported ? 'pass' : 'fail'
        const passRateClass = res.passed === res.total ? 'pass' : 'fail'
        return '\n        <td class="'
          .concat(passClass, '" title="')
          .concat(res.message || '', '">')
          .concat(res.supported ? 'Yes' : 'No', '</td>\n        <td class="')
          .concat(passRateClass, '">')
          .concat(res.passed, '/')
          .concat(res.total, '</td>\n      ')
      }
      let rowContent = '<td>'.concat(t.name, '</td>')
      if (isWindowApi) {
        rowContent += renderCell(gmRes) + renderCell(gmDotRes)
      } else {
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
      const de = document.documentElement
      if (de && de.dataset && de.dataset.uab === '1') return
      if (de && de.dataset) de.dataset.uab = '1'
    } catch (e) {}
    if (
      typeof GM !== 'undefined' &&
      typeof GM.registerMenuCommand === 'function'
    ) {
      GM.registerMenuCommand('Run Benchmark', start)
    } else if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Run Benchmark', start)
    } else {
      start()
    }
  }
  main()
})()
