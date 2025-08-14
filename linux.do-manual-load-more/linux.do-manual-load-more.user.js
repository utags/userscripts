// ==UserScript==
// @name                 LINUX.DO Load More Topics Manually
// @name:zh-CN           LINUX.DO 手动加载更多话题
// @namespace            https://www.pipecraft.net/
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
// @description          Load more topics manually with enhanced UI and error handling.
// @description:zh-CN    手动加载更多话题，具有增强的用户界面和错误处理。
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
    BUTTON_ID: 'userscript-load-more-button',
    SENTINEL_SELECTOR: '.load-more-sentinel',
    LOAD_TIMEOUT: 1000,
    OBSERVER_DELAY: 100,
    DEBUG: false,
  }

  let isLoading = false

  /**
   * Log debug messages if debug mode is enabled
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log(`[Load More Manually] ${message}`, data || '')
    }
  }

  /**
   * Create and style the load more button
   * @returns {HTMLButtonElement} The created button element
   */
  function createLoadMoreButton() {
    const button = document.createElement('button')
    button.id = CONFIG.BUTTON_ID
    button.textContent = 'Load More'
    button.className = 'userscript-load-more-btn'

    // Apply modern button styles
    Object.assign(button.style, {
      width: '100%',
      margin: '16px 0',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#007bff',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)',
    })

    // Add hover and active states
    button.addEventListener('mouseenter', () => {
      if (!isLoading) {
        button.style.backgroundColor = '#0056b3'
        button.style.transform = 'translateY(-1px)'
        button.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)'
      }
    })

    button.addEventListener('mouseleave', () => {
      if (!isLoading) {
        button.style.backgroundColor = '#007bff'
        button.style.transform = 'translateY(0)'
        button.style.boxShadow = '0 2px 4px rgba(0, 123, 255, 0.2)'
      }
    })

    return button
  }

  /**
   * Update button state during loading
   * @param {HTMLButtonElement} button - The button element
   * @param {boolean} loading - Whether the button is in loading state
   */
  function updateButtonState(button, loading) {
    isLoading = loading

    if (loading) {
      button.textContent = 'Loading...'
      button.style.backgroundColor = '#6c757d'
      button.style.cursor = 'not-allowed'
      button.style.transform = 'translateY(0)'
      button.disabled = true
    } else {
      button.textContent = 'Load More'
      button.style.backgroundColor = '#007bff'
      button.style.cursor = 'pointer'
      button.disabled = false
    }
  }

  /**
   * Handle the load more button click event
   * @param {HTMLElement} sentinel - The load more sentinel element
   * @param {HTMLButtonElement} button - The button element
   */
  function handleLoadMore(sentinel, button) {
    if (isLoading) {
      debugLog('Already loading, ignoring click')
      return
    }

    debugLog('Load more button clicked')
    updateButtonState(button, true)

    try {
      // Show the sentinel to trigger loading
      sentinel.style.display = 'block'

      // Hide the sentinel after timeout and reset button state
      setTimeout(() => {
        sentinel.style.display = 'none'
        updateButtonState(button, false)
        debugLog('Load more completed')
      }, CONFIG.LOAD_TIMEOUT)
    } catch (error) {
      debugLog('Error during load more:', error)
      updateButtonState(button, false)
    }
  }

  /**
   * Insert the button in the appropriate position relative to the sentinel
   * @param {HTMLElement} sentinel - The load more sentinel element
   * @param {HTMLButtonElement} button - The button element to insert
   */
  function insertButton(sentinel, button) {
    try {
      const parent = sentinel.parentNode
      if (!parent) {
        debugLog('Sentinel has no parent node')
        return false
      }

      if (sentinel.nextSibling) {
        parent.insertBefore(button, sentinel.nextSibling)
      } else {
        parent.appendChild(button)
      }

      debugLog('Button inserted successfully')
      return true
    } catch (error) {
      debugLog('Error inserting button:', error)
      return false
    }
  }

  /**
   * Initialize the load more functionality
   */
  function initLoadMore() {
    try {
      const sentinel = document.querySelector(CONFIG.SENTINEL_SELECTOR)
      if (!sentinel) {
        debugLog('Load more sentinel not found')
        return
      }

      // Hide the sentinel by default
      sentinel.style.display = 'none'

      // Check if button already exists
      const existingButton = document.querySelector(`#${CONFIG.BUTTON_ID}`)
      if (existingButton) {
        debugLog('Button already exists')
        return
      }

      // Create and configure the button
      const button = createLoadMoreButton()
      button.addEventListener('click', () => handleLoadMore(sentinel, button))

      // Insert the button
      if (insertButton(sentinel, button)) {
        debugLog('Load more functionality initialized')
      }
    } catch (error) {
      debugLog('Error initializing load more:', error)
    }
  }

  /**
   * Check if the mutation should trigger an update
   * @param {NodeList} addedNodes - The added nodes from mutation
   * @returns {boolean} Whether an update should be triggered
   */
  function shouldUpdateOnMutation(addedNodes) {
    if (!addedNodes || addedNodes.length === 0) {
      return false
    }

    // Check if any added node contains the sentinel or is the sentinel itself
    for (const node of addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.matches && node.matches(CONFIG.SENTINEL_SELECTOR)) {
          return true
        }
        if (
          node.querySelector &&
          node.querySelector(CONFIG.SENTINEL_SELECTOR)
        ) {
          return true
        }
      }
    }

    return false
  }

  // Initialize mutation observer to watch for DOM changes
  const observer = new MutationObserver((mutationsList) => {
    let shouldUpdate = false

    for (const mutation of mutationsList) {
      if (shouldUpdateOnMutation(mutation.addedNodes)) {
        shouldUpdate = true
        break
      }
    }

    if (shouldUpdate) {
      debugLog('DOM mutation detected, reinitializing')
      setTimeout(initLoadMore, CONFIG.OBSERVER_DELAY)
    }
  })

  // Start observing DOM changes
  observer.observe(document, {
    childList: true,
    subtree: true,
  })

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadMore)
  } else {
    initLoadMore()
  }

  debugLog('Script initialized')
})()
