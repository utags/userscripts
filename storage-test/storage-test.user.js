// ==UserScript==
// @name         Storage Test - GM_setValue Max Size
// @name:zh-CN   存储测试 - GM_setValue 最大容量
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Test the maximum string size that can be stored using GM_setValue
// @description:zh-CN  测试使用 GM_setValue 可以存储的最大字符串大小
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration parameters
  const CONFIG = {
    // Storage key name
    STORAGE_KEY: 'storage_test_data',
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
      GM_setValue(CONFIG.STORAGE_KEY, testString)

      // Verify storage was successful
      const retrieved = GM_getValue(CONFIG.STORAGE_KEY)
      return retrieved && retrieved.length === testString.length
    } catch (error) {
      logResult(`存储失败 (${size} 字节): ${error.message}`)
      return false
    }
  }

  /**
   * Log test results
   * @param {string} message - Log message
   */
  function logResult(message) {
    console.log(`[Storage Test] ${message}`)
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

    logResult(`开始测试 GM_setValue 最大存储容量`)
    logResult(`浏览器: ${navigator.userAgent}`)
    logResult(`脚本管理器: ${getScriptManager()}`)

    // Clear previous test data
    GM_deleteValue(CONFIG.STORAGE_KEY)

    // Create UI if not already created
    createUI()

    // Start test loop
    testInterval = setInterval(runTestIteration, CONFIG.TEST_INTERVAL)
  }

  /**
   * Detect script manager
   * @returns {string} - Script manager name
   */
  function getScriptManager() {
    // Try to detect script manager based on available properties
    if (typeof GM !== 'undefined') {
      if (typeof GM.info !== 'undefined') {
        return GM.info.scriptHandler || 'Unknown (GM4)'
      }
    }

    // Check for Tampermonkey
    if (typeof GM_info !== 'undefined') {
      return GM_info.scriptHandler || 'Unknown'
    }

    return 'Unknown'
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
      stopTest()
    }
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
                <h3 id="storage-test-title">GM_setValue 存储测试</h3>
                <button id="storage-test-close">×</button>
            </div>
            <div id="storage-test-controls">
                <button id="storage-test-start">开始测试</button>
                <button id="storage-test-stop">停止测试</button>
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
      .getElementById('storage-test-close')
      .addEventListener('click', () => {
        stopTest()
        container.remove()
      })
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
  GM_registerMenuCommand('运行 GM_setValue 存储测试', startTest)

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
