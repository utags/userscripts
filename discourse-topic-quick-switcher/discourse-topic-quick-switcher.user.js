// ==UserScript==
// @name                 Discourse Topic Quick Switcher
// @name:zh-CN           Discourse 话题快捷切换器
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.5.2
// @description          Enhance Discourse forums with instant topic switching, current topic highlighting, and quick navigation to previous/next topics
// @description:zh-CN    增强 Discourse 论坛体验，提供即时话题切换、当前话题高亮和上一个/下一个话题的快速导航功能
// @author               Pipecraft
// @license              MIT
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=meta.discourse.org
// @match                https://meta.discourse.org/*
// @match                https://linux.do/*
// @match                https://idcflare.com/*
// @match                https://www.nodeloc.com/*
// @match                https://meta.appinn.net/*
// @match                https://community.openai.com/*
// @match                https://community.cloudflare.com/*
// @match                https://community.wanikani.com/*
// @match                https://forum.cursor.com/*
// @match                https://forum.obsidian.md/*
// @match                https://forum-zh.obsidian.md/*
// @match                https://www.uscardforum.com/*
// @noframes
// @grant                GM.addStyle
// @grant                GM.setValue
// @grant                GM.getValue
// ==/UserScript==

;(async function () {
  'use strict'

  // Configuration
  const CONFIG = {
    // Settings storage key
    SETTINGS_KEY: 'discourse_topic_switcher_settings',
    // Cache key base name
    CACHE_KEY_BASE: 'discourse_topic_list_cache',
    // Cache expiry time (milliseconds) - 1 hour
    CACHE_EXPIRY: 60 * 60 * 1000,
    // Whether to show floating button on topic pages
    SHOW_FLOATING_BUTTON: true,
    // Route check interval (milliseconds)
    ROUTE_CHECK_INTERVAL: 500,
    // Default language (en or zh-CN)
    DEFAULT_LANGUAGE: 'en',
  }

  // User settings with defaults
  let userSettings = {
    language: CONFIG.DEFAULT_LANGUAGE,
    showNavigationButtons: true,
    darkMode: 'auto', // auto, light, dark
    // Custom hotkey settings
    hotkeys: {
      showTopicList: 'Alt+KeyQ',
      nextTopic: 'Alt+KeyW',
      prevTopic: 'Alt+KeyE',
    },
  }

  // Pre-initialized site-specific keys (calculated once at script load)
  const SITE_CACHE_KEY = `${CONFIG.CACHE_KEY_BASE}_${window.location.hostname}`
  const SITE_SETTINGS_KEY = `${CONFIG.SETTINGS_KEY}_${window.location.hostname}`

  // Internationalization support
  const I18N = {
    en: {
      viewTopicList: 'View topic list (press Alt + Q)',
      topicList: 'Topic List',
      cacheExpired: 'Cache expired',
      cachedAgo: 'Cached {time} ago',
      searchPlaceholder: 'Search topics...',
      noResults: 'No matching topics found',
      backToList: 'Back to list',
      topicsCount: '{count} topics',
      currentTopic: 'Current topic',
      sourceFrom: 'Source',
      close: 'Close',
      loading: 'Loading...',
      refresh: 'Refresh',
      replies: 'Replies',
      views: 'Views',
      activity: 'Activity',
      language: 'Language',
      noCachedList:
        'No cached topic list available. Please visit a topic list page first.',
      prevTopic: 'Previous Topic',
      nextTopic: 'Next Topic',
      noPrevTopic: 'No previous topic',
      noNextTopic: 'No next topic',
      settings: 'Settings',
      save: 'Save',
      cancel: 'Cancel',
      showNavigationButtons: 'Show navigation buttons',
      darkMode: 'Dark Mode',
      darkModeAuto: 'Auto',
      darkModeLight: 'Light',
      darkModeDark: 'Dark',
      // Hotkey settings
      hotkeys: 'Hotkeys',
      hotkeyShowTopicList: 'Show topic list',
      hotkeyNextTopic: 'Next topic',
      hotkeyPrevTopic: 'Previous topic',
      hotkeyInputPlaceholder: 'e.g., Alt+KeyQ, Ctrl+KeyK, KeyG',
      hotkeyInvalidFormat: 'Invalid hotkey format',
    },
    'zh-CN': {
      viewTopicList: '查看话题列表（按 Alt + Q 键）',
      topicList: '话题列表',
      cacheExpired: '缓存已过期',
      cachedAgo: '{time}前缓存',
      searchPlaceholder: '搜索话题...',
      noResults: '未找到匹配的话题',
      backToList: '返回列表',
      topicsCount: '{count}个话题',
      currentTopic: '当前话题',
      sourceFrom: '来源',
      close: '关闭',
      loading: '加载中...',
      refresh: '刷新',
      replies: '回复',
      views: '浏览',
      activity: '活动',
      language: '语言',
      noCachedList: '没有可用的话题列表缓存。请先访问一个话题列表页面。',
      prevTopic: '上一个话题',
      nextTopic: '下一个话题',
      noPrevTopic: '没有上一个话题',
      noNextTopic: '没有下一个话题',
      settings: '设置',
      save: '保存',
      cancel: '取消',
      showNavigationButtons: '显示导航按钮',
      darkMode: '深色模式',
      darkModeAuto: '自动',
      darkModeLight: '浅色',
      darkModeDark: '深色',
      // Hotkey settings
      hotkeys: '快捷键',
      hotkeyShowTopicList: '显示话题列表',
      hotkeyNextTopic: '下一个话题',
      hotkeyPrevTopic: '上一个话题',
      hotkeyInputPlaceholder: '例如：Alt+KeyQ, Ctrl+KeyK, KeyG',
      hotkeyInvalidFormat: '快捷键格式无效',
    },
  }

  /**
   * Load user settings from storage
   */
  async function loadUserSettings() {
    const savedSettings = await GM.getValue(SITE_SETTINGS_KEY)
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        userSettings = { ...userSettings, ...parsedSettings }
      } catch (e) {
        console.error('[DTQS] Error parsing saved settings:', e)
      }
    }
    return userSettings
  }

  /**
   * Save user settings to storage
   */
  async function saveUserSettings() {
    await GM.setValue(SITE_SETTINGS_KEY, JSON.stringify(userSettings))
  }

  // Get user language
  function getUserLanguage() {
    // Use language from settings
    if (
      userSettings.language &&
      (userSettings.language === 'en' || userSettings.language === 'zh-CN')
    ) {
      return userSettings.language
    }

    // Try to get language from browser
    const browserLang = navigator.language || navigator.userLanguage

    // Check if we support this language
    if (browserLang.startsWith('zh')) {
      return 'zh-CN'
    }

    // Default to English
    return CONFIG.DEFAULT_LANGUAGE
  }

  // Current language
  let currentLanguage = getUserLanguage()

  /**
   * Create and show settings dialog
   */
  async function showSettingsDialog() {
    // If dialog already exists, don't create another one
    if (document.getElementById('dtqs-settings-overlay')) {
      return
    }

    // Create overlay
    const overlay = document.createElement('div')
    overlay.id = 'dtqs-settings-overlay'

    // Create dialog
    const dialog = document.createElement('div')
    dialog.id = 'dtqs-settings-dialog'

    // Create dialog content
    dialog.innerHTML = `
      <h2>${t('settings')}</h2>

      <div class="dtqs-setting-item">
        <label for="dtqs-language-select">${t('language')}</label>
        <select id="dtqs-language-select">
          <option value="en" ${userSettings.language === 'en' ? 'selected' : ''}>English</option>
          <option value="zh-CN" ${userSettings.language === 'zh-CN' ? 'selected' : ''}>中文</option>
        </select>
      </div>

      <div class="dtqs-setting-item">
        <label for="dtqs-dark-mode-select">${t('darkMode')}</label>
        <select id="dtqs-dark-mode-select">
          <option value="auto" ${userSettings.darkMode === 'auto' ? 'selected' : ''}>${t('darkModeAuto')}</option>
          <option value="light" ${userSettings.darkMode === 'light' ? 'selected' : ''}>${t('darkModeLight')}</option>
          <option value="dark" ${userSettings.darkMode === 'dark' ? 'selected' : ''}>${t('darkModeDark')}</option>
        </select>
      </div>

      <div class="dtqs-setting-item checkbox-item">
        <label for="dtqs-show-nav-buttons">
          <input type="checkbox" id="dtqs-show-nav-buttons" ${userSettings.showNavigationButtons ? 'checked' : ''}>
          <span>${t('showNavigationButtons')}</span>
        </label>
      </div>

      <div class="dtqs-setting-section">
        <h3>${t('hotkeys')}</h3>

        <div class="dtqs-setting-item">
          <label for="dtqs-hotkey-show-list">${t('hotkeyShowTopicList')}</label>
          <input type="text" id="dtqs-hotkey-show-list" value="${userSettings.hotkeys.showTopicList}" placeholder="${t('hotkeyInputPlaceholder')}">
        </div>

        <div class="dtqs-setting-item">
          <label for="dtqs-hotkey-next-topic">${t('hotkeyNextTopic')}</label>
          <input type="text" id="dtqs-hotkey-next-topic" value="${userSettings.hotkeys.nextTopic}" placeholder="${t('hotkeyInputPlaceholder')}">
        </div>

        <div class="dtqs-setting-item">
          <label for="dtqs-hotkey-prev-topic">${t('hotkeyPrevTopic')}</label>
          <input type="text" id="dtqs-hotkey-prev-topic" value="${userSettings.hotkeys.prevTopic}" placeholder="${t('hotkeyInputPlaceholder')}">
        </div>
      </div>

      <div class="dtqs-buttons">
        <button id="dtqs-settings-save">${t('save')}</button>
        <button id="dtqs-settings-cancel">${t('cancel')}</button>
      </div>
    `

    // Add dialog to overlay
    overlay.appendChild(dialog)

    // Add overlay to page
    document.body.appendChild(overlay)

    // Add event listeners
    const saveButton = document.getElementById('dtqs-settings-save')
    const cancelButton = document.getElementById('dtqs-settings-cancel')

    addTouchSupport(saveButton, async () => {
      // Save language setting
      const languageSelect = document.getElementById('dtqs-language-select')
      userSettings.language = languageSelect.value

      // Save dark mode setting
      const darkModeSelect = document.getElementById('dtqs-dark-mode-select')
      userSettings.darkMode = darkModeSelect.value

      // Save navigation buttons setting
      const showNavButtons = document.getElementById('dtqs-show-nav-buttons')
      userSettings.showNavigationButtons = showNavButtons.checked

      // Save hotkey settings with validation
      const hotkeyShowList = document.getElementById('dtqs-hotkey-show-list')
      const hotkeyNextTopic = document.getElementById('dtqs-hotkey-next-topic')
      const hotkeyPrevTopic = document.getElementById('dtqs-hotkey-prev-topic')

      // Validate hotkey format
      const hotkeyPattern =
        /^(Ctrl\+|Alt\+|Shift\+|Meta\+)*(Key[A-Z]|Digit[0-9]|Space|Enter|Escape|Backspace|Tab|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|F[1-9]|F1[0-2])$/

      const hotkeys = {
        showTopicList: hotkeyShowList.value.trim(),
        nextTopic: hotkeyNextTopic.value.trim(),
        prevTopic: hotkeyPrevTopic.value.trim(),
      }

      // Validate each hotkey
      for (const [key, value] of Object.entries(hotkeys)) {
        if (value && !hotkeyPattern.test(value)) {
          alert(`${t('hotkeyInvalidFormat')}: ${value}`)
          return
        }
      }

      // Check for duplicate hotkeys
      const hotkeyValues = Object.values(hotkeys).filter((v) => v)
      const uniqueHotkeys = new Set(hotkeyValues)
      if (hotkeyValues.length !== uniqueHotkeys.size) {
        alert('Duplicate hotkeys are not allowed')
        return
      }

      userSettings.hotkeys = hotkeys

      // Save settings
      await saveUserSettings()

      // Update language
      currentLanguage = userSettings.language

      // Update dark mode
      detectDarkMode()

      // Close dialog
      closeSettingsDialog()

      // Remove and recreate floating button to apply new settings
      if (floatingButton) {
        hideFloatingButton()
        addFloatingButton()
      }

      // If topic list is open, reopen it to apply new settings
      if (topicListContainer) {
        hideTopicList()
        topicListContainer.remove()
        topicListContainer = null
        setTimeout(() => {
          showTopicList()
        }, 350)
      }
    })

    addTouchSupport(cancelButton, closeSettingsDialog)

    // Close when clicking on overlay (outside dialog)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSettingsDialog()
      }
    })
  }

  /**
   * Close settings dialog
   */
  function closeSettingsDialog() {
    const overlay = document.getElementById('dtqs-settings-overlay')
    if (overlay) {
      overlay.remove()
    }
  }

  // Translate function
  function t(key, params = {}) {
    // Get the translation
    let text = I18N[currentLanguage][key] || I18N['en'][key] || key

    // Replace parameters
    for (const param in params) {
      text = text.replace(`{${param}}`, params[param])
    }

    return text
  }

  // Status variables
  let isListVisible = false
  let cachedTopicList = null
  let cachedTopicListTimestamp = 0
  let cachedTopicListUrl = ''
  let cachedTopicListTitle = ''
  let floatingButton = null
  let topicListContainer = null
  let lastUrl = window.location.href
  let urlCheckTimer = null
  let isDarkMode = false
  let isButtonClickable = true // Flag to prevent consecutive clicks
  let prevTopic = null // Previous topic data
  let nextTopic = null // Next topic data
  let isMobileDevice = false // Mobile device detection

  /**
   * Detect if the current device is a mobile device
   */
  function detectMobileDevice() {
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i

    // Check screen width
    const isSmallScreen = window.innerWidth <= 768

    // Check for touch support
    const hasTouchSupport =
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Combine all checks
    isMobileDevice =
      mobileRegex.test(userAgent) || (isSmallScreen && hasTouchSupport)

    console.log(`[DTQS] Mobile device detection: ${isMobileDevice}`)

    // Add mobile class to body for CSS targeting
    if (isMobileDevice) {
      document.body.classList.add('dtqs-mobile-device')
    } else {
      document.body.classList.remove('dtqs-mobile-device')
    }

    return isMobileDevice
  }

  /**
   * Detect dark mode based on user settings
   */
  function detectDarkMode() {
    let shouldUseDarkMode = false

    // Check user's dark mode preference
    switch (userSettings.darkMode) {
      case 'dark':
        // Force dark mode
        shouldUseDarkMode = true
        console.log('[DTQS] Dark mode: Force enabled by user setting')
        break

      case 'light':
        // Force light mode
        shouldUseDarkMode = false
        console.log('[DTQS] Dark mode: Force disabled by user setting')
        break

      case 'auto':
      default:
        // Auto mode - check system and site preferences
        if (window.matchMedia) {
          // Check system preference
          const systemDarkMode = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches

          // Check if the Discourse site is in dark mode
          const discourseBodyClass =
            document.body.classList.contains('dark-scheme') ||
            document.documentElement.classList.contains('dark-scheme') ||
            document.body.dataset.colorScheme === 'dark' ||
            document.documentElement.dataset.colorScheme === 'dark' ||
            document.documentElement.dataset.themeType === 'dark' ||
            // linux.do
            document.querySelector('header picture > source')?.media === 'all'

          // Enable dark mode if the system or site uses it
          shouldUseDarkMode = systemDarkMode || discourseBodyClass

          console.log(
            `[DTQS] Dark mode (auto): System: ${systemDarkMode}, Site: ${discourseBodyClass}, Final: ${shouldUseDarkMode}`
          )
        }
        break
    }

    // Update global dark mode state
    isDarkMode = shouldUseDarkMode

    // Add or remove dark mode class
    if (isDarkMode) {
      document.body.classList.add('topic-list-viewer-dark-mode')
    } else {
      document.body.classList.remove('topic-list-viewer-dark-mode')
    }
  }

  /**
   * Set up dark mode listener
   */
  function setupDarkModeListener() {
    if (window.matchMedia) {
      // Listen for system dark mode changes
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      )

      // Add change listener (only trigger if user is in auto mode)
      const handleSystemChange = (e) => {
        if (userSettings.darkMode === 'auto') {
          detectDarkMode()
        }
      }

      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleSystemChange)
      } else if (darkModeMediaQuery.addListener) {
        // Fallback for older browsers
        darkModeMediaQuery.addListener(handleSystemChange)
      }

      // Listen for Discourse theme changes (only trigger if user is in auto mode)
      const observer = new MutationObserver((mutations) => {
        if (userSettings.darkMode === 'auto') {
          mutations.forEach((mutation) => {
            if (
              mutation.attributeName === 'class' ||
              mutation.attributeName === 'data-color-scheme'
            ) {
              detectDarkMode()
            }
          })
        }
      })

      // Observe class changes on body and html elements
      observer.observe(document.body, { attributes: true })
      observer.observe(document.documentElement, { attributes: true })
    }
  }

  /**
   * Initialize the script
   */
  async function init() {
    // Load user settings
    await loadUserSettings()

    // Load cached topic list from storage
    await loadCachedTopicList()

    // Detect mobile device
    detectMobileDevice()

    // Detect dark mode
    detectDarkMode()

    // Set up dark mode listener
    // setupDarkModeListener()

    // Set up mobile device detection on window resize
    window.addEventListener('resize', () => {
      detectMobileDevice()
    })

    // Initial handling of the current page
    handleCurrentPage()

    // Set up URL change detection
    setupUrlChangeDetection()

    // Add global hotkey listener
    addHotkeyListener()
  }

  /**
   * Set up URL change detection
   * Use multiple methods to reliably detect URL changes
   */
  function setupUrlChangeDetection() {
    // Record initial URL
    lastUrl = window.location.href

    // Method 1: Listen for popstate events (handles browser back/forward buttons)
    window.addEventListener('popstate', () => {
      console.log('[DTQS] Detected popstate event')
      handleCurrentPage()
    })

    // Method 2: Use MutationObserver to listen for DOM changes that might indicate a URL change
    const pageObserver = new MutationObserver(() => {
      checkUrlChange('MutationObserver')
    })

    // Start observing DOM changes
    pageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Method 3: Set up a regular check as a fallback
    if (urlCheckTimer) {
      clearInterval(urlCheckTimer)
    }

    urlCheckTimer = setInterval(() => {
      checkUrlChange('Interval check')
    }, CONFIG.ROUTE_CHECK_INTERVAL)
  }

  /**
   * Check if the URL has changed
   * @param {string} source The source that triggered the check
   */
  function checkUrlChange(source) {
    const currentUrl = window.location.href
    if (currentUrl !== lastUrl) {
      console.log(`[DTQS] URL change detected (Source: ${source})`, currentUrl)
      lastUrl = currentUrl
      handleCurrentPage()
    }
  }

  /**
   * Handle the current page
   */
  function handleCurrentPage() {
    // If the list is visible, hide it
    if (isListVisible) {
      hideTopicList()
    }

    // Perform different actions based on the current page type
    if (isTopicPage()) {
      // On a topic page, add the floating button
      console.log('[DTQS] On a topic page, show button')
      if (CONFIG.SHOW_FLOATING_BUTTON) {
        addFloatingButton()

        // Update navigation buttons if we're on a topic page
        updateNavigationButtons()
      }

      // On a topic page, pre-render the list (if cached)
      if (cachedTopicList && !topicListContainer) {
        // Use setTimeout to ensure the DOM is fully loaded
        setTimeout(() => {
          prerenderTopicList()
        }, 100)
      }
    } else if (isTopicListPage()) {
      // On a topic list page, cache the current list
      console.log('[DTQS] On a list page, update cache')
      cacheCurrentTopicList()

      // Hide the button on the list page
      hideFloatingButton()
    } else {
      // On other pages, hide the button
      hideFloatingButton()

      // Observe the topic list element
      observeTopicListElement()
    }
  }

  /**
   * Check if the current page is a topic list page
   * @returns {boolean} Whether it is a topic list page
   */
  function isTopicListPage() {
    return (
      document.querySelector(
        '.contents table.topic-list tbody.topic-list-body'
      ) !== null
    )
  }

  /**
   * Observe the appearance of the topic list element
   * Solves the problem that the list element may not be rendered when the page loads
   */
  function observeTopicListElement() {
    // Create an observer instance
    const observer = new MutationObserver((mutations, obs) => {
      // Check if the list element has appeared
      if (
        document.querySelector(
          '.contents table.topic-list tbody.topic-list-body'
        )
      ) {
        console.log('[DTQS] Detected that the list element has been rendered')
        // If the list element appears, re-handle the current page
        handleCurrentPage()
        // The list element has been found, stop observing
        obs.disconnect()
      }
    })

    // Configure observer options
    const config = {
      childList: true, // Observe changes to the target's child nodes
      subtree: true, // Observe all descendant nodes
    }

    // Start observing the document body
    observer.observe(document.body, config)

    // Set a timeout to avoid indefinite observation
    setTimeout(() => {
      observer.disconnect()
    }, 10000) // Stop observing after 10 seconds
  }

  /**
   * Check if the current page is a topic page
   * @returns {boolean} Whether it is a topic page
   */
  function isTopicPage() {
    return window.location.pathname.includes('/t/')
  }

  /**
   * Check for URL changes
   */
  function checkForUrlChanges() {
    const currentUrl = window.location.href
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl

      // If we're on a topic page, update the button
      if (isTopicPage()) {
        addFloatingButton()
        // Update navigation buttons with new adjacent topics
        updateNavigationButtons()
      } else {
        // Remove the button if not on a topic page
        if (floatingButton) {
          floatingButton.remove()
          floatingButton = null
        }
      }

      // Hide the topic list if it's visible
      if (isListVisible) {
        hideTopicList()
      }
    }
  }

  /**
   * Get the current topic ID
   * @returns {number|null} The current topic ID or null
   */
  function getCurrentTopicId() {
    // Extract topic ID from the URL
    const match = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  /**
   * Check if a topic row is visible (not hidden)
   * @param {Element} row - The topic row element
   * @returns {boolean} - Whether the topic is visible
   */
  function isTopicVisible(row) {
    // Use more reliable method to detect element visibility
    if (typeof row.checkVisibility === 'function') {
      return row.checkVisibility()
    }

    // If checkVisibility is not available, use offsetParent for detection
    return row.offsetParent !== null
  }

  /**
   * Find adjacent topics (previous and next) from the cached topic list
   * @returns {Object} Object containing previous and next topics
   */
  function findAdjacentTopics() {
    // If no cached topic list, return empty result
    if (!cachedTopicList) {
      return { prev: null, next: null }
    }

    // Get current topic ID
    const currentId = getCurrentTopicId()
    if (!currentId) {
      return { prev: null, next: null }
    }

    // Create a temporary container to parse the cached HTML
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.visibility = 'hidden'
    tempContainer.innerHTML = `<table>${cachedTopicList}</table>`

    // Add to document.body to ensure offsetParent works correctly
    document.body.appendChild(tempContainer)

    // Get all topic rows
    const topicRows = tempContainer.querySelectorAll('tr')
    if (!topicRows.length) {
      // Remove the temporary container from document.body
      tempContainer.remove()
      return { prev: null, next: null }
    }

    // Find the current topic index
    let currentIndex = -1
    for (let i = 0; i < topicRows.length; i++) {
      const row = topicRows[i]
      const topicLink = row.querySelector('a.title')
      if (!topicLink) continue

      // Extract topic ID from the link
      const match = topicLink.href.match(/\/t\/[^\/]+\/(\d+)/)
      if (match && parseInt(match[1]) === currentId) {
        currentIndex = i
        break
      }
    }

    // If current topic not found in the list
    if (currentIndex === -1) {
      // Remove the temporary container from document.body
      tempContainer.remove()
      return { prev: null, next: null }
    }

    // Get previous visible topic
    let prevTopic = null
    for (let i = currentIndex - 1; i >= 0; i--) {
      const prevRow = topicRows[i]
      if (!isTopicVisible(prevRow)) continue

      const prevLink = prevRow.querySelector('a.title')
      if (prevLink) {
        prevTopic = {
          id: extractTopicId(prevLink.href),
          title: prevLink.textContent.trim(),
          url: prevLink.href,
        }
        break
      }
    }

    // Get next visible topic
    let nextTopic = null
    for (let i = currentIndex + 1; i < topicRows.length; i++) {
      const nextRow = topicRows[i]
      if (!isTopicVisible(nextRow)) continue

      const nextLink = nextRow.querySelector('a.title')
      if (nextLink) {
        nextTopic = {
          id: extractTopicId(nextLink.href),
          title: nextLink.textContent.trim(),
          url: nextLink.href,
        }
        break
      }
    }

    // Remove the temporary container from document.body
    tempContainer.remove()

    return { prev: prevTopic, next: nextTopic }
  }

  /**
   * Update navigation buttons with adjacent topics
   */
  function updateNavigationButtons() {
    // Find adjacent topics
    const { prev, next } = findAdjacentTopics()
    console.log('[DTQS] Adjacent topics:', prev, next)

    // Store for global access
    prevTopic = prev
    nextTopic = next

    // Update previous topic button
    const prevButton = document.querySelector('.topic-nav-button.prev-topic')
    if (prevButton) {
      const titleSpan = prevButton.querySelector('.topic-nav-title')
      if (prev) {
        titleSpan.textContent = prev.title
        prevButton.title = prev.title
        prevButton.style.opacity = '1'
        prevButton.style.pointerEvents = 'auto'
      } else {
        titleSpan.textContent = ''
        prevButton.title = t('noPrevTopic')
        prevButton.style.opacity = '0.5'
        prevButton.style.pointerEvents = 'none'
      }
    }

    // Update next topic button
    const nextButton = document.querySelector('.topic-nav-button.next-topic')
    if (nextButton) {
      const titleSpan = nextButton.querySelector('.topic-nav-title')
      if (next) {
        titleSpan.textContent = next.title
        nextButton.title = next.title
        nextButton.style.opacity = '1'
        nextButton.style.pointerEvents = 'auto'
      } else {
        titleSpan.textContent = ''
        nextButton.title = t('noNextTopic')
        nextButton.style.opacity = '0.5'
        nextButton.style.pointerEvents = 'none'
      }
    }
  }

  /**
   * Navigate to previous topic
   */
  function navigateToPrevTopic() {
    if (prevTopic && prevTopic.url) {
      navigateWithSPA(prevTopic.url)
    }
  }

  /**
   * Navigate to next topic
   */
  function navigateToNextTopic() {
    if (nextTopic && nextTopic.url) {
      navigateWithSPA(nextTopic.url)
    }
  }

  /**
   * Extract topic ID from a topic URL
   * @param {string} url The topic URL
   * @returns {number|null} The topic ID or null
   */
  function extractTopicId(url) {
    const match = url.match(/\/t\/[^\/]+\/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  /**
   * Cache the current topic list
   */
  function cacheCurrentTopicList() {
    // Check if the list element exists
    const topicListBody = document.querySelector('tbody.topic-list-body')
    if (topicListBody) {
      // If the list element exists, process it directly
      updateTopicListCache(topicListBody)

      // Listen for list content changes (when scrolling to load more)
      observeTopicListChanges(topicListBody)
    } else {
      // If the list element does not exist, listen for its appearance
      console.log('[DTQS] Waiting for the topic list element to appear')
      observeTopicListAppearance()
    }
  }

  /**
   * Observe the appearance of the topic list element
   */
  function observeTopicListAppearance() {
    // Create an observer instance
    const observer = new MutationObserver((mutations, obs) => {
      // Check if the list element has appeared
      const topicListBody = document.querySelector('tbody.topic-list-body')
      if (topicListBody) {
        console.log('[DTQS] Detected that the list element has been rendered')
        // Process the list content
        processTopicList(topicListBody)
        // Listen for list content changes
        observeTopicListChanges(topicListBody)
        // The list element has been found, stop observing
        obs.disconnect()
      }
    })

    // Configure observer options
    const config = {
      childList: true, // Observe changes to the target's child nodes
      subtree: true, // Observe all descendant nodes
    }

    // Start observing the document body
    observer.observe(document.body, config)
  }

  /**
   * Observe topic list content changes (when scrolling to load more)
   * @param {Element} topicListBody The topic list element
   */
  function observeTopicListChanges(topicListBody) {
    // Record the current number of rows
    let previousRowCount = topicListBody.querySelectorAll('tr').length

    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
      // Get the current number of rows
      const currentRowCount = topicListBody.querySelectorAll('tr').length

      // If the number of rows increases, it means more topics have been loaded
      if (currentRowCount > previousRowCount) {
        console.log(
          `[DTQS] Detected list update, rows increased from ${previousRowCount} to ${currentRowCount}`
        )
        // Update the cache
        updateTopicListCache(topicListBody)
        // Update the row count record
        previousRowCount = currentRowCount
      }
    })

    // Configure observer options
    const config = {
      childList: true, // Observe changes to the target's child nodes
      subtree: true, // Observe all descendant nodes
    }

    // Start observing the list element
    observer.observe(topicListBody, config)
  }

  /**
   * Update the topic list cache
   * @param {Element} topicListBody The topic list element
   */
  async function updateTopicListCache(topicListBody) {
    // Ensure the list has content
    const topicRows = topicListBody.querySelectorAll('tr')
    if (topicRows.length === 0) {
      console.log('[DTQS] Topic list is empty, not caching')
      return
    }

    console.log('[DTQS] Updating topic list cache')

    // Clone the node to save the complete topic list
    const clonedTopicList = topicListBody.cloneNode(true)

    // Save the current URL to show the source when the list is popped up
    const currentUrl = window.location.href

    // Get the list title
    let listTitle = t('topicList')
    // const titleElement = document.querySelector(
    //   '.category-name, .page-title h1, .topic-list-heading h2'
    // )
    // if (titleElement) {
    //   listTitle = titleElement.textContent.trim()
    // }
    const title = document.title.replace(/ - .*/, '').trim()
    if (title) {
      listTitle = title
    }

    // Get current category information (if any)
    let categoryInfo = ''
    const categoryBadge = document.querySelector(
      '.category-name .badge-category'
    )
    if (categoryBadge) {
      categoryInfo = categoryBadge.textContent.trim()
    }

    console.log(
      `[DTQS] Caching topic list "${listTitle}", containing ${topicRows.length} topics`
    )

    // Save to cache
    cachedTopicList = clonedTopicList.outerHTML
    cachedTopicListTimestamp = Date.now()
    cachedTopicListUrl = currentUrl
    cachedTopicListTitle = listTitle

    // Save to GM storage with site-specific key
    await GM.setValue(SITE_CACHE_KEY, {
      html: cachedTopicList,
      timestamp: cachedTopicListTimestamp,
      url: cachedTopicListUrl,
      title: cachedTopicListTitle,
      category: categoryInfo,
      topicCount: topicRows.length,
    })

    // Remove the list container, it needs to be re-rendered
    if (topicListContainer) {
      topicListContainer.remove()
      topicListContainer = null
    }
  }

  /**
   * Load the cached topic list from storage
   */
  async function loadCachedTopicList() {
    const cache = await GM.getValue(SITE_CACHE_KEY)
    if (cache) {
      cachedTopicList = cache.html
      cachedTopicListTimestamp = cache.timestamp
      cachedTopicListUrl = cache.url
      cachedTopicListTitle = cache.title
    }
  }

  /**
   * Add a floating button
   */
  function addFloatingButton() {
    // If the button already exists, do not add it again
    if (document.getElementById('topic-list-viewer-button')) return

    // Create the button container
    floatingButton = document.createElement('div')
    floatingButton.id = 'topic-list-viewer-button'

    // Create navigation container
    const navContainer = document.createElement('div')
    navContainer.className = 'topic-nav-container'

    // Control navigation buttons visibility based on user settings
    if (!userSettings.showNavigationButtons) {
      navContainer.classList.add('hide-nav-buttons')
    }

    // Create previous topic button
    const prevButton = document.createElement('div')
    prevButton.className = 'topic-nav-button prev-topic'
    prevButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span class="topic-nav-title"></span>
    `
    prevButton.title = t('prevTopic')

    addTouchSupport(prevButton, navigateToPrevTopic)

    // Create center button
    const centerButton = document.createElement('div')
    centerButton.className = 'topic-nav-button center-button'
    centerButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
    `
    centerButton.title = t('viewTopicList')
    addTouchSupport(centerButton, toggleTopicList)

    // Create next topic button
    const nextButton = document.createElement('div')
    nextButton.className = 'topic-nav-button next-topic'
    nextButton.innerHTML = `
      <span class="topic-nav-title"></span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `
    nextButton.title = t('nextTopic')
    addTouchSupport(nextButton, navigateToNextTopic)

    // Add all elements to the container
    navContainer.appendChild(prevButton)
    navContainer.appendChild(centerButton)
    navContainer.appendChild(nextButton)
    floatingButton.appendChild(navContainer)

    // Add to page
    document.body.appendChild(floatingButton)

    // Update navigation buttons
    updateNavigationButtons()
  }

  /**
   * Check if any unwanted modifier keys are pressed
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {boolean} True if any unwanted modifier key is pressed
   */
  function hasUnwantedModifierKeys(event) {
    return event.shiftKey || event.ctrlKey || event.metaKey
  }

  /**
   * Check if the focus is on an input element
   * @returns {boolean} True if focus is on an input element
   */
  function isFocusOnInput() {
    const activeElement = document.activeElement
    if (!activeElement) return false

    const tagName = activeElement.tagName.toLowerCase()
    const inputTypes = ['input', 'textarea', 'select']

    // Check if it's an input element
    if (inputTypes.includes(tagName)) {
      return true
    }

    // Check if it's a contenteditable element
    if (activeElement.contentEditable === 'true') {
      return true
    }

    // Check if it's inside a contenteditable element
    let parent = activeElement.parentElement
    while (parent) {
      if (parent.contentEditable === 'true') {
        return true
      }
      parent = parent.parentElement
    }

    return false
  }

  /**
   * Parse hotkey string into components
   * @param {string} hotkeyStr - Hotkey string like "Alt+KeyQ" or "Ctrl+Shift+KeyA"
   * @returns {Object} - Object with modifier flags and key code
   */
  function parseHotkey(hotkeyStr) {
    if (!hotkeyStr || typeof hotkeyStr !== 'string') {
      return null
    }

    const parts = hotkeyStr.split('+')
    const result = {
      ctrl: false,
      alt: false,
      shift: false,
      meta: false,
      code: null,
    }

    for (const part of parts) {
      const trimmed = part.trim()
      switch (trimmed) {
        case 'Ctrl':
          result.ctrl = true
          break
        case 'Alt':
          result.alt = true
          break
        case 'Shift':
          result.shift = true
          break
        case 'Meta':
          result.meta = true
          break
        default:
          result.code = trimmed
          break
      }
    }

    return result.code ? result : null
  }

  /**
   * Check if event matches the parsed hotkey
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Object} parsedHotkey - Parsed hotkey object
   * @returns {boolean} - True if event matches hotkey
   */
  function matchesHotkey(event, parsedHotkey) {
    if (!parsedHotkey) {
      return false
    }

    return (
      event.ctrlKey === parsedHotkey.ctrl &&
      event.altKey === parsedHotkey.alt &&
      event.shiftKey === parsedHotkey.shift &&
      event.metaKey === parsedHotkey.meta &&
      event.code === parsedHotkey.code
    )
  }

  /**
   * Add a hotkey listener
   */
  function addHotkeyListener() {
    document.addEventListener(
      'keydown',
      function (event) {
        // Skip if unwanted modifier keys are pressed (but allow Alt)
        // if (hasUnwantedModifierKeys(event)) {
        //   return
        // }

        // Skip if focus is on an input element
        if (isFocusOnInput()) {
          return
        }

        // Check for hotkeys only on topic pages
        if (!isTopicPage()) {
          return
        }

        console.log(
          `[DTQS] keydown event: key=${event.key}, code=${event.code}, modifiers: Ctrl=${event.ctrlKey}, Alt=${event.altKey}, Shift=${event.shiftKey}, Meta=${event.metaKey}`
        )

        // Parse configured hotkeys
        const showListHotkey = parseHotkey(userSettings.hotkeys.showTopicList)
        const nextTopicHotkey = parseHotkey(userSettings.hotkeys.nextTopic)
        const prevTopicHotkey = parseHotkey(userSettings.hotkeys.prevTopic)

        // Check for show topic list hotkey
        if (showListHotkey && matchesHotkey(event, showListHotkey)) {
          event.preventDefault()
          event.stopPropagation()
          toggleTopicList()
          return
        }

        // Check for next topic hotkey
        if (nextTopicHotkey && matchesHotkey(event, nextTopicHotkey)) {
          event.preventDefault()
          event.stopPropagation()
          navigateToNextTopic()
          return
        }

        // Check for previous topic hotkey
        if (prevTopicHotkey && matchesHotkey(event, prevTopicHotkey)) {
          event.preventDefault()
          event.stopPropagation()
          navigateToPrevTopic()
          return
        }

        // ESC key to close topic list (hardcoded for usability)
        if (
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey &&
          !event.metaKey &&
          event.key === 'Escape' &&
          isListVisible
        ) {
          event.preventDefault()
          event.stopPropagation()
          hideTopicList()
          return
        }
      },
      true
    )
  }

  /**
   * Hide the floating button
   */
  function hideFloatingButton() {
    if (floatingButton && floatingButton.parentNode) {
      floatingButton.parentNode.removeChild(floatingButton)
      floatingButton = null
    }
  }

  /**
   * Toggle the display state of the topic list
   * Includes debounce logic to prevent rapid consecutive clicks
   */
  function toggleTopicList() {
    // If button is not clickable, return immediately
    if (!isButtonClickable) {
      return
    }

    // Set button to non-clickable state
    isButtonClickable = false

    // Execute the original toggle logic
    if (isListVisible) {
      hideTopicList()
    } else {
      showTopicList()
    }

    // Set a timeout to restore button clickable state after 800ms
    setTimeout(() => {
      isButtonClickable = true
    }, 800)
  }

  /**
   * Navigate to the specified URL using SPA routing
   * @param {string} url The target URL
   */
  function navigateWithSPA(url) {
    // Hide the topic list
    hideTopicList()

    // Try to use pushState for SPA navigation
    try {
      console.log(`[DTQS] Navigating to ${url} using SPA routing`)

      // Use history API for navigation
      const urlObj = new URL(url)
      const pathname = urlObj.pathname

      // Update history
      history.pushState({}, '', pathname)

      // Trigger popstate event so Discourse can handle the route change
      window.dispatchEvent(new Event('popstate'))

      // Handle the current page
      setTimeout(handleCurrentPage, 100)
    } catch (error) {
      // If SPA navigation fails, fall back to normal navigation
      console.log(
        `[DTQS] SPA navigation failed, falling back to normal navigation to ${url}`,
        error
      )
      window.location.href = url
    }
  }

  /**
   * Pre-render the topic list
   */
  function prerenderTopicList() {
    // Record start time
    const startTime = performance.now()

    // If there is no cached topic list, do not pre-render
    if (!cachedTopicList) {
      console.log('[DTQS] No cached topic list available, cannot pre-render')
      return
    }

    // If the container already exists, do not create it again
    if (topicListContainer) {
      return
    }

    console.log('[DTQS] Pre-rendering topic list')

    // Check if the cache is expired
    const now = Date.now()
    const cacheAge = now - cachedTopicListTimestamp
    let cacheStatus = ''

    if (cacheAge > CONFIG.CACHE_EXPIRY) {
      cacheStatus = `<div class="cache-status expired">${t('cacheExpired')} (${formatTimeAgo(cacheAge)})</div>`
    } else {
      cacheStatus = `<div class="cache-status">${t('cachedAgo', { time: formatTimeAgo(cacheAge) })}</div>`
    }

    // Create the main container
    topicListContainer = document.createElement('div')
    topicListContainer.id = 'topic-list-viewer-container'

    // Create the overlay
    const overlay = document.createElement('div')
    overlay.className = 'topic-list-viewer-overlay'

    // Add an event listener to close the list when clicking the overlay
    overlay.addEventListener('click', (event) => {
      // If button is not clickable, return immediately
      if (!isButtonClickable) {
        return
      }
      // Make sure the click is on the overlay itself, not its children
      if (event.target === overlay) {
        hideTopicList()
      }
    })

    // Create the content container
    const contentContainer = document.createElement('div')
    contentContainer.className = 'topic-list-viewer-wrapper'

    // Add the content container to the main container
    topicListContainer.appendChild(overlay)
    topicListContainer.appendChild(contentContainer)

    // Add to body
    document.body.appendChild(topicListContainer)

    // Try to get the position and width of the #main-outlet element
    const mainOutlet = document.getElementById('main-outlet')
    if (mainOutlet) {
      console.log(
        '[DTQS] Adjusting list container position and width to match #main-outlet'
      )

      // Adjust position and width when the container is displayed
      const adjustContainerPosition = () => {
        if (topicListContainer && topicListContainer.style.display === 'flex') {
          const mainOutletRect = mainOutlet.getBoundingClientRect()

          // Set the position and width of the content container to match #main-outlet
          contentContainer.style.width = `${mainOutletRect.width}px`
          contentContainer.style.maxWidth = `${mainOutletRect.width}px`
          contentContainer.style.marginLeft = 'auto'
          contentContainer.style.marginRight = 'auto'
        }
      }

      // Add a listener to adjust the position
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === 'style' &&
            topicListContainer &&
            topicListContainer.style.display === 'flex'
          ) {
            adjustContainerPosition()
          }
        })
      })

      observer.observe(topicListContainer, { attributes: true })

      // Readjust on window resize
      window.addEventListener('resize', adjustContainerPosition)
    } else {
      console.log('[DTQS] #main-outlet does not exist, using default styles')
    }

    // Get the cached title
    const listTitle = cachedTopicListTitle || 'Topic List'

    // Fill the content container
    contentContainer.innerHTML = `
          <div class="topic-list-viewer-header">
              <h3>${listTitle}</h3>
              <div class="topic-list-viewer-controls">
                  <a href="${cachedTopicListUrl}" class="source-link" title="${t('sourceFrom')}">${t('sourceFrom')}</a>
                  <button id="topic-list-viewer-settings" title="${t('settings')}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </button>
                  <button id="topic-list-viewer-close">×</button>
              </div>
          </div>
          ${cacheStatus}
          <div class="topic-list-viewer-content">
              <table class="topic-list">
                  <thead>
                      <tr>
                          <th class="topic-list-data default">${t('topicList')}</th>
                          <th class="topic-list-data posters"></th>
                          <th class="topic-list-data posts num">${t('replies')}</th>
                          <th class="topic-list-data views num">${t('views')}</th>
                          <th class="topic-list-data activity num">${t('activity')}</th>
                      </tr>
                  </thead>
                  ${cachedTopicList}
              </table>
          </div>
      `

    // Add close button event
    contentContainer
      .querySelector('#topic-list-viewer-close')
      .addEventListener('click', hideTopicList)

    // Add settings button event
    contentContainer
      .querySelector('#topic-list-viewer-settings')
      .addEventListener('click', showSettingsDialog)

    // Add SPA routing events to all links in the topic list
    const topicLinks = contentContainer.querySelectorAll('.topic-list-item a')
    topicLinks.forEach((link) => {
      link.addEventListener(
        'click',
        function (event) {
          console.log(`[DTQS] Link clicked ${link.href}`)
          event.preventDefault()
          event.stopPropagation()
          navigateWithSPA(link.href, null)
          return false
        },
        true
      )
    })

    // Add swipe support for mobile devices
    // addSwipeSupport(contentContainer)

    // Initially hidden
    topicListContainer.style.display = 'none'
    topicListContainer.classList.remove('visible')

    // Calculate and print execution time
    const endTime = performance.now()
    console.log(
      `[DTQS] Pre-rendering topic list completed in ${(endTime - startTime).toFixed(2)}ms`
    )
  }

  // Add touch support for mobile devices
  const addTouchSupport = (button, clickHandler) => {
    button.addEventListener('click', clickHandler)
    if (isMobileDevice) {
      button.addEventListener('touchstart', (e) => {
        e.preventDefault()
        button.style.transform = 'scale(0.95)'
        button.style.opacity = '0.8'
      })

      button.addEventListener('touchend', (e) => {
        e.preventDefault()
        button.style.transform = ''
        button.style.opacity = ''
        clickHandler()
      })

      button.addEventListener('touchcancel', (e) => {
        button.style.transform = ''
        button.style.opacity = ''
      })
    }
  }

  /**
   * Add swipe gesture support for mobile devices
   * @param {Element} element - The element to add swipe support to
   */
  function addSwipeSupport(element) {
    if (!isMobileDevice) return

    let startY = 0
    let currentY = 0
    let isDragging = false
    let startTime = 0

    element.addEventListener(
      'touchstart',
      (e) => {
        startY = e.touches[0].clientY
        currentY = startY
        startTime = Date.now()
        isDragging = true
      },
      { passive: true }
    )

    element.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return

        currentY = e.touches[0].clientY
        const deltaY = currentY - startY

        // Only allow downward swipe to close
        if (deltaY > 0 && deltaY < 100) {
          const opacity = Math.max(0.3, 1 - deltaY / 200)
          element.style.opacity = opacity
          element.style.transform = `translateY(${deltaY}px)`
        }
      },
      { passive: true }
    )

    element.addEventListener(
      'touchend',
      (e) => {
        if (!isDragging) return

        const deltaY = currentY - startY
        const deltaTime = Date.now() - startTime
        const velocity = deltaY / deltaTime

        // Close if swipe down is significant or fast
        if (deltaY > 50 || (velocity > 0.3 && deltaY > 20)) {
          hideTopicList()
        } else {
          // Reset position
          element.style.opacity = ''
          element.style.transform = ''
        }

        isDragging = false
      },
      { passive: true }
    )

    element.addEventListener(
      'touchcancel',
      (e) => {
        if (isDragging) {
          element.style.opacity = ''
          element.style.transform = ''
          isDragging = false
        }
      },
      { passive: true }
    )
  }

  /**
   * Show the topic list
   */
  function showTopicList() {
    // Record start time
    const startTime = performance.now()

    // If there is no cached topic list, do not show
    if (!cachedTopicList) {
      alert(t('noCachedList'))
      return
    }

    // If the container does not exist, pre-render it first
    if (!topicListContainer) {
      prerenderTopicList()
    }

    // Hide body and html scrollbars
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Record the current scroll position for restoration
    window._savedScrollPosition =
      window.scrollY || document.documentElement.scrollTop

    // Show the container and add the visible class immediately
    topicListContainer.style.display = 'flex'
    // Force reflow
    // void topicListContainer.offsetWidth
    topicListContainer.classList.add('visible')
    isListVisible = true

    // Highlight the current topic
    const currentTopicId = getCurrentTopicId()

    // First, remove any existing highlights
    const previousHighlightedRows = topicListContainer.querySelectorAll(
      '.topic-list-item.current-topic'
    )
    previousHighlightedRows.forEach((row) => {
      row.classList.remove('current-topic')
    })

    if (currentTopicId) {
      // Find all topic rows
      const topicRows = topicListContainer.querySelectorAll('.topic-list-item')
      topicRows.forEach((row) => {
        // Get the topic link
        const topicLink = row.querySelector('a.title')
        if (topicLink) {
          // Extract the topic ID from the link
          const match = topicLink.href.match(/\/t\/[^\/]+\/(\d+)/)
          if (match && parseInt(match[1]) === currentTopicId) {
            // Add highlight class
            row.classList.add('current-topic')
            // Scroll to the current topic
            setTimeout(() => {
              row.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
          }
        }
      })
    }

    // Calculate and print execution time
    const endTime = performance.now()
    console.log(
      `[DTQS] Showing topic list completed in ${(endTime - startTime).toFixed(2)}ms`
    )
  }

  /**
   * Hide the topic list
   */
  function hideTopicList() {
    if (!topicListContainer) return

    // Restore body and html scrollbars
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''

    // Restore scroll position
    if (window._savedScrollPosition !== undefined) {
      window.scrollTo(0, window._savedScrollPosition)
      window._savedScrollPosition = undefined
    }

    // Remove the visible class to trigger the fade-out animation
    topicListContainer.classList.remove('visible')

    // Hide after the animation is complete
    setTimeout(() => {
      if (topicListContainer) {
        topicListContainer.style.display = 'none'
      }
      isListVisible = false
    }, 300)
  }

  /**
   * Format time difference
   * @param {number} ms - Milliseconds
   * @returns {string} - Formatted time difference
   */
  function formatTimeAgo(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }

  // Add styles
  GM.addStyle(`
        #topic-list-viewer-button {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 20px;
            background-color: #0078d7;
            color: white;
            border: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            padding: 5px 10px;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }

        #dtqs-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #dtqs-settings-dialog {
            background: white;
            border-radius: 8px;
            padding: 20px;
            width: 400px;
            max-width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        #dtqs-settings-dialog h2 {
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }

        .dtqs-setting-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .dtqs-setting-item label {
            margin-right: 10px;
            flex-grow: 1;
            display: flex;
            align-items: center;
        }

        .dtqs-setting-item input[type="checkbox"] {
            margin-right: 5px;
            vertical-align: middle;
        }

        .dtqs-setting-item select {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }

        .dtqs-setting-item input[type="text"] {
            padding: 5px 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
            font-family: monospace;
            font-size: 12px;
            min-width: 120px;
        }

        .dtqs-setting-section {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .dtqs-setting-section h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #333;
            font-weight: 600;
        }

        .dtqs-buttons {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            gap: 10px;
        }

        .dtqs-buttons button {
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: #f5f5f5;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .dtqs-buttons button:hover {
            background: #e5e5e5;
        }

        .dtqs-buttons #dtqs-settings-save {
            background: #007bff;
            border-color: #007bff;
            color: white;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
        }

        .dtqs-buttons #dtqs-settings-save:hover {
            background: #0056b3;
            border-color: #0056b3;
            box-shadow: 0 3px 6px rgba(0, 123, 255, 0.3);
            transform: translateY(-1px);
        }

        .dtqs-buttons #dtqs-settings-save:active {
            background: #004085;
            border-color: #004085;
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 123, 255, 0.2);
        }

        .topic-list-viewer-dark-mode #dtqs-settings-overlay {
            background: rgba(0, 0, 0, 0.7);
        }

        .topic-list-viewer-dark-mode #dtqs-settings-dialog {
            background: #2d2d2d;
            color: #e0e0e0;
            border: 1px solid #444;
        }

        .topic-list-viewer-dark-mode #dtqs-settings-dialog h2 {
            color: #e0e0e0;
            border-bottom: 1px solid #444;
        }

        .topic-list-viewer-dark-mode .dtqs-setting-item label {
            color: #e0e0e0;
        }

        .topic-list-viewer-dark-mode .dtqs-setting-item select {
            background: #3a3a3a;
            color: #e0e0e0;
            border: 1px solid #555;
        }

        .topic-list-viewer-dark-mode .dtqs-setting-item select:focus {
            border-color: #64b5f6;
            outline: none;
            box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
        }

        .topic-list-viewer-dark-mode .dtqs-setting-item input[type="checkbox"] {
            accent-color: #64b5f6;
        }

        .topic-list-viewer-dark-mode .dtqs-setting-item input[type="text"] {
            background: #3a3a3a;
            color: #e0e0e0;
            border: 1px solid #555;
        }

        .topic-list-viewer-dark-mode .dtqs-setting-item input[type="text"]:focus {
            border-color: #64b5f6;
            outline: none;
            box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
        }

        .topic-list-viewer-dark-mode .dtqs-setting-section {
            border-top: 1px solid #444;
        }

        .topic-list-viewer-dark-mode .dtqs-setting-section h3 {
            color: #e0e0e0;
        }

        .topic-list-viewer-dark-mode .dtqs-buttons button {
            background: #3a3a3a;
            color: #e0e0e0;
            border: 1px solid #555;
        }

        .topic-list-viewer-dark-mode .dtqs-buttons button:hover {
            background: #4a4a4a;
            border-color: #666;
        }

        .topic-list-viewer-dark-mode .dtqs-buttons button:active {
            background: #2a2a2a;
        }

        .topic-list-viewer-dark-mode .dtqs-buttons #dtqs-settings-save {
            background: #1976d2;
            border-color: #1976d2;
            color: white;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
        }

        .topic-list-viewer-dark-mode .dtqs-buttons #dtqs-settings-save:hover {
            background: #1565c0;
            border-color: #1565c0;
            box-shadow: 0 3px 6px rgba(25, 118, 210, 0.4);
            transform: translateY(-1px);
        }

        .topic-list-viewer-dark-mode .dtqs-buttons #dtqs-settings-save:active {
            background: #0d47a1;
            border-color: #0d47a1;
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(25, 118, 210, 0.3);
        }

        .topic-nav-container {
             display: grid;
             grid-template-columns: 1fr auto 1fr;
             align-items: center;
             position: relative;
             width: 100%;
         }

         .hide-nav-buttons .prev-topic,
         .hide-nav-buttons .next-topic {
             display: none;
         }

         .topic-nav-button {
             display: flex;
             align-items: center;
             padding: 5px 8px;
             cursor: pointer;
             border-radius: 4px;
             transition: all 0.2s ease;
         }

         .topic-nav-button:hover {
             background-color: rgba(255,255,255,0.2);
         }

         .topic-nav-title {
             max-width: 180px;
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
             font-size: 13px;
             margin: 0 6px;
             font-weight: 500;
         }

         .center-button {
             grid-column: 2;
             z-index: 1;
             margin: 0 15px;
         }

         .prev-topic {
             grid-column: 1;
             justify-self: end;
         }

         .next-topic {
             grid-column: 3;
             justify-self: start;
         }

        #topic-list-viewer-button:hover {
             background-color: #0063b1;
             transform: translateX(-50%) scale(1.05);
         }

        #topic-list-viewer-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: none;
            flex-direction: column;
            opacity: 0;
            transition: opacity 0.1s ease;
        }

        .topic-list-viewer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 1;
        }

        .topic-list-viewer-wrapper {
            position: relative;
            z-index: 2;
            background-color: white;
            width: 100%;
            max-width: 1200px;
            height: 100%;
            overflow-y: auto;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
        }

        #topic-list-viewer-container.visible {
            opacity: 1;
        }

        .topic-list-viewer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: #f8f8f8;
            border-bottom: 1px solid #ddd;
        }

        .topic-list-viewer-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 15px;
        }

        .topic-list-viewer-controls {
            display: flex;
            align-items: center;
            gap: 15px;
            height: 32px;
            flex-shrink: 0;
        }

        .source-link {
            color: #0078d7;
            text-decoration: none;
            font-size: 14px;
            height: 32px;
            display: flex;
            align-items: center;
            transition: all 0.2s ease;
        }

        .source-link:hover {
            text-decoration: underline;
        }

        #topic-list-viewer-settings {
            background: none;
            border: none;
            padding: 8px;
            cursor: pointer;
            color: #666;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        #topic-list-viewer-settings:hover {
            background-color: #f0f0f0;
            color: #333;
        }

        #topic-list-viewer-close {
            background: #f0f0f0;
            color: #666;
            border: none;
            font-size: 18px;
            font-weight: normal;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 4px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        #topic-list-viewer-close:hover {
            background-color: #e0e0e0;
            color: #333;
        }

        .cache-status {
            padding: 8px 20px;
            background-color: #f0f7ff;
            color: #0063b1;
            font-size: 12px;
            border-bottom: 1px solid #ddd;
        }

        .cache-status.expired {
            background-color: #fff0f0;
            color: #d70000;
        }

        .topic-list-viewer-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background-color: white;
        }

        .topic-list-viewer-content table {
            width: 100%;
            border-collapse: collapse;
            position: relative;
        }

        .topic-list-viewer-content th {
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #ddd;
            color: #555;
            font-weight: bold;
        }

        .topic-list-viewer-content tr:hover {
             background-color: #f5f5f5;
         }

         .topic-list-viewer-content tr.current-topic {
             background-color: #e6f7ff;
             border-left: 3px solid #1890ff;
         }

         .topic-list-viewer-content tr.current-topic:hover {
             background-color: #d4edff;
         }

         .topic-list-viewer-content tr.current-topic td:first-child {
             padding-left: 7px;
         }

        .topic-list-viewer-dark-mode #topic-list-viewer-button {
            background-color: #2196f3;
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
        }

        .topic-list-viewer-dark-mode #topic-list-viewer-button:hover {
            background-color: #1976d2;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-overlay {
            background-color: rgba(0,0,0,0.85);
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-wrapper {
            background-color: #222;
            color: #e0e0e0;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-header {
            background-color: #2c2c2c;
            border-bottom: 1px solid #444;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-header h3 {
            color: #e0e0e0;
        }

        .topic-list-viewer-dark-mode .source-link {
            color: #64b5f6;
        }

        .topic-list-viewer-dark-mode #topic-list-viewer-settings {
            color: #aaa;
        }

        .topic-list-viewer-dark-mode #topic-list-viewer-settings:hover {
            background-color: #444;
            color: #e0e0e0;
        }

        .topic-list-viewer-dark-mode #topic-list-viewer-close {
            background: #444;
            color: #aaa;
        }

        .topic-list-viewer-dark-mode #topic-list-viewer-close:hover {
            background-color: #555;
            color: #ccc;
        }

        .topic-list-viewer-dark-mode .cache-status {
            background-color: #1a3a5a;
            color: #90caf9;
            border-bottom: 1px solid #444;
        }

        .topic-list-viewer-dark-mode .cache-status.expired {
            background-color: #5a1a1a;
            color: #ef9a9a;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-content {
            background-color: #333;
            color: #e0e0e0;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-content th {
            border-bottom: 2px solid #555;
            color: #bbb;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-content tr:hover {
             background-color: #3a3a3a;
         }

         .topic-list-viewer-dark-mode .topic-list-viewer-content tr.current-topic {
             background-color: #1a365d;
             border-left: 3px solid #1890ff;
         }

         .topic-list-viewer-dark-mode .topic-list-viewer-content tr.current-topic:hover {
             background-color: #234979;
         }

        .topic-list-viewer-dark-mode .topic-list-viewer-content a {
            color: #64b5f6;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-content a:visited {
            color: #b39ddb;
        }

        .dtqs-mobile-device #topic-list-viewer-container {
            -webkit-overflow-scrolling: touch;
        }

        .dtqs-mobile-device .topic-list-viewer-content {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
        }

        .dtqs-mobile-device .topic-list-viewer-content table thead {
            display: none;
        }

        .dtqs-mobile-device .topic-list-viewer-wrapper {
            position: relative;
            overflow: hidden;
        }

        .dtqs-mobile-device .topic-list-viewer-content {
            transition: transform 0.3s ease;
        }

        .dtqs-mobile-device #topic-search-input {
            font-size: 16px;
            padding: 12px 15px;
            border-radius: 8px;
        }

        .dtqs-mobile-device #dtqs-settings-dialog {
            width: 90% !important;
            max-width: 400px !important;
            margin: 20px auto !important;
            padding: 20px !important;
            border-radius: 12px !important;
        }

        .dtqs-mobile-device #dtqs-settings-dialog h2 {
            font-size: 18px !important;
            margin-bottom: 20px !important;
        }

        .dtqs-mobile-device .dtqs-setting-item {
            margin-bottom: 20px !important;
        }

        .dtqs-mobile-device .dtqs-setting-item label {
            font-size: 16px !important;
            line-height: 1.4 !important;
        }

        .dtqs-mobile-device .dtqs-setting-item select {
            padding: 12px !important;
            font-size: 16px !important;
            border-radius: 8px !important;
            min-height: 44px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .dtqs-mobile-device .dtqs-setting-item input[type="checkbox"] {
            width: 20px !important;
            height: 20px !important;
            margin-right: 12px !important;
        }

        .dtqs-mobile-device .dtqs-buttons {
            display: flex !important;
            gap: 12px !important;
            margin-top: 24px !important;
        }

        .dtqs-mobile-device .dtqs-buttons button {
            flex: 1 !important;
            padding: 14px 20px !important;
            font-size: 16px !important;
            border-radius: 8px !important;
            min-height: 44px !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            -webkit-tap-highlight-color: transparent !important;
            touch-action: manipulation !important;
        }

        .dtqs-mobile-device .dtqs-buttons button:active {
            transform: scale(0.98) !important;
        }

        @media (max-width: 768px) {
            #topic-list-viewer-button {
                bottom: 12px;
                padding: 4px 6px;
                border-radius: 18px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                max-width: calc(100vw - 30px);
                overflow: hidden;
            }

            .topic-nav-container {
                gap: 3px;
            }

            .topic-nav-button {
                padding: 3px 5px;
                min-height: 32px;
                min-width: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .topic-nav-title {
                max-width: 90px;
                font-size: 10px;
                margin: 0 1px;
                line-height: 1.1;
            }

            .center-button {
                margin: 0 3px;
                background-color: rgba(255,255,255,0.2);
                border-radius: 50%;
                padding: 4px;
            }

            .topic-list-viewer-content {
                padding: 10px;
            }

            .topic-list-viewer-header {
                padding: 12px 15px;
                flex-wrap: wrap;
                gap: 10px;
            }

            .topic-list-viewer-header {
                padding: 12px 15px;
                flex-wrap: nowrap;
            }

            .topic-list-viewer-header h3 {
                font-size: 16px;
                margin-right: 10px;
            }

            .topic-list-viewer-controls {
                gap: 8px;
                flex-shrink: 0;
            }

            #topic-list-viewer-close {
                font-size: 28px;
                padding: 8px;
                min-height: 44px;
                min-width: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media (max-width: 480px) {
                #topic-list-viewer-button {
                    bottom: 10px;
                    padding: 3px 5px;
                    border-radius: 16px;
                }

                .topic-list-viewer-header {
                    padding: 10px 12px;
                }

                .topic-list-viewer-header h3 {
                    font-size: 14px;
                    margin-right: 8px;
                }

                .topic-list-viewer-controls {
                    gap: 6px;
                }

                .topic-nav-container {
                    gap: 2px;
                }

                .topic-nav-button {
                    padding: 2px 3px;
                    min-height: 28px;
                    min-width: 28px;
                }

                .topic-nav-title {
                    max-width: 80px;
                    font-size: 9px;
                    margin: 0;
                    line-height: 1.0;
                }

                .center-button {
                    margin: 0 2px;
                    padding: 3px;
                }

                .topic-nav-title {
                    display: none;
                }

                .prev-topic, .next-topic {
                    padding: 8px;
                }
            }
        }

        @media (max-width: 360px) {
            #topic-list-viewer-button {
                bottom: 8px;
                padding: 3px 5px;
                border-radius: 16px;
            }

            .topic-list-viewer-header {
                padding: 8px 10px;
            }

            .topic-list-viewer-header h3 {
                font-size: 13px;
                margin-right: 6px;
            }

            .topic-list-viewer-controls {
                gap: 4px;
            }

            .topic-nav-container {
                gap: 1px;
            }

            .topic-nav-button {
                padding: 2px 3px;
                min-height: 28px;
                min-width: 28px;
            }

            .center-button {
                margin: 0 1px;
                padding: 3px;
            }

            .topic-list-viewer-header {
                padding: 10px 12px;
            }

            .topic-list-viewer-content {
                padding: 8px;
            }
        }
    `)

  // Initialize after the page has loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    await init()
  }
})()
