type TestResult = {
  supported: boolean
  passed: number
  total: number
  message?: string
  error?: any
}

export function registerValueChangeListenerTests(
  registerTest: (
    name: string,
    gmRun: () => Promise<TestResult> | TestResult,
    gmDotRun?: () => Promise<TestResult> | TestResult
  ) => void
) {
  registerTest(
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
      const messages: string[] = []

      // --- 1. Basic Trigger ---
      {
        const key = 'benchmark_listener_basic_gm'
        let triggered = false
        const id = GM_addValueChangeListener(
          key,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === key && newVal === 'changed') {
              triggered = true
            }
          }
        )

        GM_setValue(key, 'changed')
        await new Promise<void>((resolve) => {
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

      // --- 2. Ignore Same Value ---
      {
        const key = 'benchmark_listener_same_gm'
        // Ensure clean state
        GM_deleteValue(key)

        let triggered = false
        const id = GM_addValueChangeListener(
          key,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === key) triggered = true
          }
        )

        // 1. First change (should trigger)
        GM_setValue(key, 'initial')
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 200)
        })

        const initialTriggered = triggered
        if (!initialTriggered) {
          messages.push('SameValue: Initial change NOT triggered')
        }

        // Reset trigger flag
        triggered = false

        // 2. Second change with SAME value (should NOT trigger)
        GM_setValue(key, 'initial')
        await new Promise<void>((resolve) => {
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

      // --- 3. Object Value ---
      {
        const key = 'benchmark_listener_obj_gm'
        const obj = { foo: 'bar', num: 123 }
        let receivedVal: any = null

        const id = GM_addValueChangeListener(
          key,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === key) receivedVal = newVal
          }
        )

        GM_setValue(key, obj)
        await new Promise<void>((resolve) => {
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

      // --- 4. Remote Flag (Local & Remote) ---
      {
        const keyLocal = 'benchmark_listener_remote_local_gm'
        const keyRemote = 'benchmark_listener_remote_other_gm'
        let localRemoteFlag: boolean | undefined
        let otherRemoteFlag: boolean | undefined

        // 4a. Local change
        const id1 = GM_addValueChangeListener(
          keyLocal,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === keyLocal) localRemoteFlag = remote
          }
        )
        GM_setValue(keyLocal, 'local_change')
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 200)
        })
        GM_removeValueChangeListener(id1)
        GM_deleteValue(keyLocal)

        // 4b. Other tab change (via iframe)
        const id2 = GM_addValueChangeListener(
          keyRemote,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === keyRemote) otherRemoteFlag = remote
          }
        )

        // Create iframe to trigger change
        const iframe = document.createElement('iframe')
        const url = new URL(location.href)
        url.searchParams.set('benchmark_role', 'iframe')
        url.searchParams.set('key', keyRemote)
        url.searchParams.set('value', 'remote_change')
        iframe.src = url.href
        iframe.style.display = 'none'
        document.body.append(iframe)

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000)
        }) // Give iframe time to load and run

        iframe.remove()
        GM_removeValueChangeListener(id2)
        GM_deleteValue(keyRemote)

        if (localRemoteFlag === false) {
          passed++
        } else {
          messages.push(`Remote(Local): Expected false, got ${localRemoteFlag}`)
        }

        if (otherRemoteFlag === true) {
          passed++
        } else {
          messages.push(`Remote(Other): Expected true, got ${otherRemoteFlag}`)
        }
      }

      return {
        supported: true,
        passed,
        total,
        message: messages.length > 0 ? messages.join('; ') : undefined,
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
      const messages: string[] = []

      // --- 1. Basic Trigger ---
      {
        const key = 'benchmark_listener_basic_gm_dot'
        let triggered = false
        const id = await GM.addValueChangeListener(
          key,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === key && newVal === 'changed') {
              triggered = true
            }
          }
        )

        await GM.setValue(key, 'changed')
        await new Promise<void>((resolve) => {
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

      // --- 2. Ignore Same Value ---
      {
        const key = 'benchmark_listener_same_gm_dot'
        // Ensure clean state
        await GM.deleteValue(key)

        let triggered = false
        const id = await GM.addValueChangeListener(
          key,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === key) triggered = true
          }
        )

        // 1. First change (should trigger)
        await GM.setValue(key, 'initial')
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 200)
        })

        const initialTriggered = triggered
        if (!initialTriggered) {
          messages.push('SameValue: Initial change NOT triggered')
        }

        // Reset trigger flag
        triggered = false

        // 2. Second change with SAME value (should NOT trigger)
        await GM.setValue(key, 'initial')
        await new Promise<void>((resolve) => {
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

      // --- 3. Object Value ---
      {
        const key = 'benchmark_listener_obj_gm_dot'
        const obj = { foo: 'bar', num: 123 }
        let receivedVal: any = null

        const id = await GM.addValueChangeListener(
          key,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === key) receivedVal = newVal
          }
        )

        await GM.setValue(key, obj)
        await new Promise<void>((resolve) => {
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

      // --- 4. Remote Flag (Local & Remote) ---
      {
        const keyLocal = 'benchmark_listener_remote_local_gm_dot'
        const keyRemote = 'benchmark_listener_remote_other_gm_dot'
        let localRemoteFlag: boolean | undefined
        let otherRemoteFlag: boolean | undefined

        // 4a. Local change
        const id1 = await GM.addValueChangeListener(
          keyLocal,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === keyLocal) localRemoteFlag = remote
          }
        )
        await GM.setValue(keyLocal, 'local_change')
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 200)
        })
        await GM.removeValueChangeListener(id1)
        await GM.deleteValue(keyLocal)

        // 4b. Other tab change (via iframe)
        const id2 = await GM.addValueChangeListener(
          keyRemote,
          (name: string, oldVal: any, newVal: any, remote: boolean) => {
            if (name === keyRemote) otherRemoteFlag = remote
          }
        )

        // Create iframe to trigger change
        const iframe = document.createElement('iframe')
        const url = new URL(location.href)
        url.searchParams.set('benchmark_role', 'iframe')
        url.searchParams.set('key', keyRemote)
        url.searchParams.set('value', 'remote_change')
        iframe.src = url.href
        iframe.style.display = 'none'
        document.body.append(iframe)

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000)
        })

        iframe.remove()
        await GM.removeValueChangeListener(id2)
        await GM.deleteValue(keyRemote)

        if (localRemoteFlag === false) {
          passed++
        } else {
          messages.push(`Remote(Local): Expected false, got ${localRemoteFlag}`)
        }

        if (otherRemoteFlag === true) {
          passed++
        } else {
          messages.push(`Remote(Other): Expected true, got ${otherRemoteFlag}`)
        }
      }

      return {
        supported: true,
        passed,
        total,
        message: messages.length > 0 ? messages.join('; ') : undefined,
      }
    }
  )
}
