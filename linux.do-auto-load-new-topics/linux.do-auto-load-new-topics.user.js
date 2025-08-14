// ==UserScript==
// @name                 LINUX.DO Auto Load New Topics
// @name:zh-CN           LINUX.DO 自动加载新话题
// @namespace            https://www.pipecraft.net/
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.1
// @description          Auto load new topics with smart detection and error handling
// @description:zh-CN    智能自动加载新话题，带有错误处理和检测优化
// @author               Pipecraft
// @license              MIT
// @match                https://linux.do/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant                none
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration constants
  const CONFIG = {
    CHECK_INTERVAL: 3000, // Check every 3 seconds
    MAX_RETRIES: 3, // Maximum retry attempts
    SELECTORS: [
      '#list-area .show-more .clickable',
      // '.show-more-topics .clickable',
      // "[data-action='show-more']",
    ],
    DEBUG: false, // Set to true for debug logging
  }

  let retryCount = 0
  let lastClickTime = 0
  let intervalId = null

  /**
   * Log debug messages if debug mode is enabled
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log(`[LINUX.DO Auto Loader] ${message}`, data || '')
    }
  }

  /**
   * Check if a modal dialog is currently open
   * @returns {boolean} True if a modal is open
   */
  function isModalOpen() {
    const modals = document.querySelectorAll('[role="dialog"]')
    for (const modal of modals) {
      if (
        modal &&
        modal.offsetParent !== null &&
        modal.offsetHeight > 0 &&
        modal.offsetWidth > 0
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Find the clickable element using multiple selectors
   * @returns {HTMLElement|null} The clickable element or null
   */
  function findClickableElement() {
    for (const selector of CONFIG.SELECTORS) {
      const element = document.querySelector(selector)
      if (element && element.offsetParent !== null) {
        // Check if element is visible
        return element
      }
    }
    return null
  }

  /**
   * Check if enough time has passed since last click
   * @returns {boolean} True if enough time has passed
   */
  function canClick() {
    const now = Date.now()
    return now - lastClickTime > CONFIG.CHECK_INTERVAL
  }

  /**
   * Attempt to click the show more button
   * @returns {boolean} True if click was successful
   */
  function attemptClick() {
    try {
      // Check if modal is open and pause auto-loading
      if (isModalOpen()) {
        debugLog('Modal dialog is open, pausing auto-loader')
        return false
      }

      const clickable = findClickableElement()

      if (!clickable) {
        debugLog('No clickable element found')
        return false
      }

      if (!canClick()) {
        debugLog('Too soon since last click')
        return false
      }

      // Simulate a more natural click
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })

      clickable.dispatchEvent(event)
      lastClickTime = Date.now()
      retryCount = 0 // Reset retry count on successful click

      debugLog('Successfully clicked show more button', clickable)
      return true
    } catch (error) {
      debugLog('Error clicking element:', error)
      retryCount++

      if (retryCount >= CONFIG.MAX_RETRIES) {
        debugLog('Max retries reached, stopping auto-loader')
        stopAutoLoader()
      }

      return false
    }
  }

  /**
   * Start the auto-loader interval
   */
  function startAutoLoader() {
    if (intervalId) {
      clearInterval(intervalId)
    }

    debugLog('Starting auto-loader')
    intervalId = setInterval(attemptClick, CONFIG.CHECK_INTERVAL)
  }

  /**
   * Stop the auto-loader interval
   */
  function stopAutoLoader() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
      debugLog('Auto-loader stopped')
    }
  }

  /**
   * Initialize the script when DOM is ready
   */
  function initialize() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startAutoLoader)
    } else {
      startAutoLoader()
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoLoader()
      } else {
        startAutoLoader()
      }
    })

    // Stop when navigating away
    window.addEventListener('beforeunload', stopAutoLoader)
  }

  // Initialize the script
  initialize()
})()
