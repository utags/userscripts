// ==UserScript==
// @name         Storage Test - localStorage Max Size
// @name:zh-CN   存储测试 - localStorage 最大容量
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Test the maximum string size that can be stored using localStorage
// @description:zh-CN  测试使用 localStorage 可以存储的最大字符串大小
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration parameters
  const CONFIG = {
    // Storage key name
    STORAGE_KEY: 'localstorage_test_data',
    // Initial test size (bytes) - 1MB
    INITIAL_SIZE: 1024 * 1024,
    // Size increment per test (bytes) - 100KB
    INCREMENT_SIZE: 100 * 1024,
    // Maximum number of attempts to prevent infinite loops
    MAX_ATTEMPTS: 100,
    // Test interval (milliseconds)
    TEST_INTERVAL: 500,
    // Auto-start test
    AUTO_START: false,
  }

  // State variables
  let currentSize = CONFIG.INITIAL_SIZE
  let testRunning = false
  let testResults = []
  let testInterval = null
  let attemptCount = 0

  /**
   * Generate a string of specified size
   * @param {number} size - String size in bytes
   * @returns {string} - Generated string
   */
  function generateString(size) {
    // Use 'A' character which takes 1 byte
    return 'A'.repeat(size)
  }

  /**
   * Try to store a string of specified size
   * @param {number} size - Size of string to store (bytes)
   * @returns {boolean} - Whether storage was successful
   */
  function tryStore(size) {
    try {
      const testString = generateString(size)
      localStorage.setItem(CONFIG.STORAGE_KEY, testString)

      // Verify storage was successful
      const retrieved = localStorage.getItem(CONFIG.STORAGE_KEY)
      return retrieved && retrieved.length === testString.length
    } catch (error) {
      logResult(`存储失败 (${size} 字节): ${error.message}`)
      return false
    }
  }

  /**
   * Calculate total localStorage usage
   * @returns {object} - Object containing usage information
   */
  function calculateStorageUsage() {
    let totalBytes = 0
    let itemCount = 0

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = localStorage.getItem(key)
        // Each character in key and value is 2 bytes in UTF-16
        totalBytes += (key.length + value.length) * 2
        itemCount++
      }

      return {
        bytes: totalBytes,
        items: itemCount,
        formatted: `${(totalBytes / 1024).toFixed(2)} KB`,
      }
    } catch (error) {
      return {
        bytes: 0,
        items: 0,
        formatted: 'Error calculating',
      }
    }
  }

  /**
   * Log test results
   * @param {string} message - Log message
   */
  function logResult(message) {
    console.log(`[localStorage Test] ${message}`)
    testResults.push(message)
    updateUI()
  }

  /**
   * Start the test
   */
  function startTest() {
    if (testRunning) return

    testRunning = true
    currentSize = CONFIG.INITIAL_SIZE
    attemptCount = 0
    testResults = []

    logResult(`开始测试 localStorage 最大存储容量`)
    logResult(`浏览器: ${navigator.userAgent}`)

    // Show current storage usage
    const initialUsage = calculateStorageUsage()
    logResult(
      `当前 localStorage 使用情况: ${initialUsage.formatted} (${initialUsage.items} 项)`
    )

    // Clear previous test data
    localStorage.removeItem(CONFIG.STORAGE_KEY)

    // Create UI if not already created
    createUI()

    // Start test loop
    testInterval = setInterval(runTestIteration, CONFIG.TEST_INTERVAL)
  }

  /**
   * Run a single test iteration
   */
  function runTestIteration() {
    attemptCount++

    if (attemptCount > CONFIG.MAX_ATTEMPTS) {
      stopTest()
      logResult(`已达到最大尝试次数 (${CONFIG.MAX_ATTEMPTS})，测试停止`)
      return
    }

    logResult(`尝试存储 ${currentSize} 字节...`)

    if (tryStore(currentSize)) {
      logResult(
        `✅ 成功存储 ${currentSize} 字节 (${(currentSize / 1024).toFixed(2)} KB)`
      )
      // Increase test size
      currentSize += CONFIG.INCREMENT_SIZE
    } else {
      // Storage failed, end test
      const maxSize = currentSize - CONFIG.INCREMENT_SIZE
      logResult(`❌ 存储 ${currentSize} 字节失败`)
      logResult(
        `📊 最大成功存储大小: ${maxSize} 字节 (${(maxSize / 1024).toFixed(2)} KB / ${(maxSize / 1024 / 1024).toFixed(2)} MB)`
      )

      // Show browser-specific limits if known
      showBrowserLimits()

      stopTest()
    }
  }

  /**
   * Show known browser storage limits
   */
  function showBrowserLimits() {
    const browserInfo = getBrowserInfo()
    logResult(`浏览器: ${browserInfo.name} ${browserInfo.version}`)

    // Known approximate limits (in MB)
    const knownLimits = {
      Chrome: '5-10 MB per origin',
      Firefox: '10 MB per origin',
      Safari: '5 MB per origin',
      Edge: '5-10 MB per origin',
      Opera: '5-10 MB per origin',
    }

    if (knownLimits[browserInfo.name]) {
      logResult(
        `📝 ${browserInfo.name} 的已知限制约为: ${knownLimits[browserInfo.name]}`
      )
    }

    logResult(`注意: 实际限制可能因浏览器版本、设备和可用存储空间而异`)
  }

  /**
   * Get browser information
   * @returns {object} - Browser name and version
   */
  function getBrowserInfo() {
    const ua = navigator.userAgent
    let name = 'Unknown'
    let version = 'Unknown'

    if (ua.indexOf('Chrome') > -1) {
      name = 'Chrome'
      version = ua.match(/Chrome\/(\d+\.\d+)/)[1]
    } else if (ua.indexOf('Firefox') > -1) {
      name = 'Firefox'
      version = ua.match(/Firefox\/(\d+\.\d+)/)[1]
    } else if (ua.indexOf('Safari') > -1) {
      name = 'Safari'
      version = ua.match(/Version\/(\d+\.\d+)/)[1]
    } else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) {
      name = 'Edge'
      version = ua.match(/Edge?\/(\d+\.\d+)/)[1]
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      name = 'Opera'
      version = ua.match(/Opera|OPR\/(\d+\.\d+)/)[1]
    }

    return { name, version }
  }

  /**
   * Stop the test
   */
  function stopTest() {
    if (!testRunning) return

    clearInterval(testInterval)
    testRunning = false
    logResult(`测试结束`)
  }

  /**
   * Create user interface
   */
  function createUI() {
    // Don't create UI if it already exists
    if (document.getElementById('storage-test-container')) return

    // Add styles
    GM_addStyle(`
            #storage-test-container {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 15px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                z-index: 9999;
                font-family: Arial, sans-serif;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            #storage-test-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #dee2e6;
                padding-bottom: 10px;
            }
            #storage-test-title {
                font-size: 16px;
                font-weight: bold;
                margin: 0;
            }
            #storage-test-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            #storage-test-results {
                overflow-y: auto;
                flex-grow: 1;
                background-color: #f1f3f5;
                border-radius: 4px;
                padding: 10px;
                font-family: monospace;
                font-size: 12px;
                white-space: pre-wrap;
                max-height: 300px;
            }
            #storage-test-container button {
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            #storage-test-start {
                background-color: #28a745;
                color: white;
            }
            #storage-test-stop {
                background-color: #dc3545;
                color: white;
            }
            #storage-test-clear {
                background-color: #ffc107;
                color: #212529;
            }
            #storage-test-close {
                background-color: transparent;
                border: none;
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                color: #6c757d;
            }
            .storage-test-log-entry {
                margin-bottom: 5px;
                border-bottom: 1px dashed #dee2e6;
                padding-bottom: 5px;
            }
        `)

    // Create UI container
    const container = document.createElement('div')
    container.id = 'storage-test-container'

    // Create UI content
    container.innerHTML = `
            <div id="storage-test-header">
                <h3 id="storage-test-title">localStorage 存储测试</h3>
                <button id="storage-test-close">×</button>
            </div>
            <div id="storage-test-controls">
                <button id="storage-test-start">开始测试</button>
                <button id="storage-test-stop">停止测试</button>
                <button id="storage-test-clear">清除所有数据</button>
            </div>
            <div id="storage-test-results"></div>
        `

    // Add to page
    document.body.appendChild(container)

    // Add event listeners
    document
      .getElementById('storage-test-start')
      .addEventListener('click', startTest)
    document
      .getElementById('storage-test-stop')
      .addEventListener('click', stopTest)
    document
      .getElementById('storage-test-clear')
      .addEventListener('click', clearAllStorage)
    document
      .getElementById('storage-test-close')
      .addEventListener('click', () => {
        stopTest()
        container.remove()
      })
  }

  /**
   * Clear all localStorage data
   */
  function clearAllStorage() {
    try {
      localStorage.clear()
      logResult(`✅ 已清除所有 localStorage 数据`)
      const usage = calculateStorageUsage()
      logResult(
        `当前 localStorage 使用情况: ${usage.formatted} (${usage.items} 项)`
      )
    } catch (error) {
      logResult(`❌ 清除数据失败: ${error.message}`)
    }
  }

  /**
   * Update UI with test results
   */
  function updateUI() {
    const resultsContainer = document.getElementById('storage-test-results')
    if (!resultsContainer) return

    resultsContainer.innerHTML = testResults
      .map((result) => `<div class="storage-test-log-entry">${result}</div>`)
      .join('')

    // Scroll to bottom
    resultsContainer.scrollTop = resultsContainer.scrollHeight
  }

  // Register menu command
  GM_registerMenuCommand('运行 localStorage 存储测试', startTest)

  // If configured to auto-start, start test automatically
  if (CONFIG.AUTO_START) {
    // Wait for page to load
    window.addEventListener('load', () => {
      setTimeout(startTest, 1000)
    })
  } else {
    // Create UI but don't auto-start test
    window.addEventListener('load', () => {
      setTimeout(createUI, 1000)
    })
  }
})()
