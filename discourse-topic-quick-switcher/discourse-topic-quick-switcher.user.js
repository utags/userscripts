// ==UserScript==
// @name                 Discourse Topic Quick Switcher
// @name:zh-CN           Discourse 话题快捷切换器
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.1
// @description          Enhance Discourse forums with instant topic switching, current topic highlighting, and smart theme detection
// @description:zh-CN    增强 Discourse 论坛体验，提供即时话题切换、当前话题高亮和智能主题检测功能
// @author               Pipecraft
// @license              MIT
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=meta.discourse.org
// @match                https://meta.discourse.org/*
// @match                https://linux.do/*
// @match                https://idcflare.com/*
// @match                https://meta.appinn.net/*
// @match                https://community.openai.com/*
// @match                https://community.cloudflare.com/*
// @match                https://community.wanikani.com/*
// @match                https://forum.cursor.com/*
// @match                https://forum.obsidian.md/*
// @match                https://forum-zh.obsidian.md/*
// @noframes
// @grant                GM_addStyle
// @grant                GM_setValue
// @grant                GM_getValue
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration
  const CONFIG = {
    // Hotkey (default is backtick key `)
    HOTKEY: '`',
    // Cache key name
    CACHE_KEY: 'discourse_topic_list_cache',
    // Cache expiry time (milliseconds) - 1 hour
    CACHE_EXPIRY: 60 * 60 * 1000,
    // Whether to show floating button on topic pages
    SHOW_FLOATING_BUTTON: true,
    // Route check interval (milliseconds)
    ROUTE_CHECK_INTERVAL: 500,
    // Whether to automatically follow system dark mode
    AUTO_DARK_MODE: true,
    // Default language (en or zh-CN)
    DEFAULT_LANGUAGE: 'en',
  }

  // Internationalization support
  const I18N = {
    en: {
      viewTopicList: 'View topic list (press ` key)',
      topicList: 'Topic List',
      cacheExpired: 'Cache expired',
      cachedAgo: 'Cached {time} ago',
      searchPlaceholder: 'Search topics...',
      noResults: 'No matching topics found',
      backToList: 'Back to list',
      topicsCount: '{count} topics',
      currentTopic: 'Current topic',
      sourceFrom: 'Source: {source}',
      close: 'Close',
      loading: 'Loading...',
      refresh: 'Refresh',
      replies: 'Replies',
      views: 'Views',
      activity: 'Activity',
      language: 'Language',
      noCachedList:
        'No cached topic list available. Please visit a topic list page first.',
    },
    'zh-CN': {
      viewTopicList: '查看话题列表（按 ` 键）',
      topicList: '话题列表',
      cacheExpired: '缓存已过期',
      cachedAgo: '{time}前缓存',
      searchPlaceholder: '搜索话题...',
      noResults: '未找到匹配的话题',
      backToList: '返回列表',
      topicsCount: '{count}个话题',
      currentTopic: '当前话题',
      sourceFrom: '来源：{source}',
      close: '关闭',
      loading: '加载中...',
      refresh: '刷新',
      replies: '回复',
      views: '浏览',
      activity: '活动',
      language: '语言',
      noCachedList: '没有可用的话题列表缓存。请先访问一个话题列表页面。',
    },
  }

  // Get user language
  function getUserLanguage() {
    // Try to get saved language preference first
    const savedLanguage = GM_getValue('discourse_topic_switcher_language')
    if (
      savedLanguage &&
      (savedLanguage === 'en' || savedLanguage === 'zh-CN')
    ) {
      return savedLanguage
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

  /**
   * Detect dark mode
   */
  function detectDarkMode() {
    // Check system dark mode
    if (CONFIG.AUTO_DARK_MODE && window.matchMedia) {
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
      isDarkMode = systemDarkMode || discourseBodyClass

      console.log(
        `[DTQS] Dark mode detection - System: ${systemDarkMode}, Site: ${discourseBodyClass}, Final: ${isDarkMode}`
      )

      // Add or remove dark mode class
      if (isDarkMode) {
        document.body.classList.add('topic-list-viewer-dark-mode')
      } else {
        document.body.classList.remove('topic-list-viewer-dark-mode')
      }
    }
  }

  /**
   * Set up dark mode listener
   */
  function setupDarkModeListener() {
    if (CONFIG.AUTO_DARK_MODE && window.matchMedia) {
      // Listen for system dark mode changes
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      )

      // Add change listener
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', (e) => {
          detectDarkMode()
        })
      } else if (darkModeMediaQuery.addListener) {
        // Fallback for older browsers
        darkModeMediaQuery.addListener((e) => {
          detectDarkMode()
        })
      }

      // Listen for Discourse theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === 'class' ||
            mutation.attributeName === 'data-color-scheme'
          ) {
            detectDarkMode()
          }
        })
      })

      // Observe class changes on body and html elements
      observer.observe(document.body, { attributes: true })
      observer.observe(document.documentElement, { attributes: true })
    }
  }

  /**
   * Initialize the script
   */
  function init() {
    // Load cached topic list from storage
    loadCachedTopicList()

    // Detect dark mode
    detectDarkMode()

    // Set up dark mode listener
    // setupDarkModeListener()

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
   * Get the current topic ID
   * @returns {number|null} The current topic ID or null
   */
  function getCurrentTopicId() {
    // Extract topic ID from the URL
    const match = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/)
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
  function updateTopicListCache(topicListBody) {
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

    // Save to GM storage
    GM_setValue(CONFIG.CACHE_KEY, {
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
  function loadCachedTopicList() {
    const cache = GM_getValue(CONFIG.CACHE_KEY)
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

    // Create the floating button
    floatingButton = document.createElement('button')
    floatingButton.id = 'topic-list-viewer-button'
    floatingButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
    floatingButton.title = t('viewTopicList')

    // Add click event
    floatingButton.addEventListener('click', toggleTopicList)

    // Add to page
    document.body.appendChild(floatingButton)
  }

  /**
   * Add a hotkey listener
   */
  function addHotkeyListener() {
    document.addEventListener('keydown', function (event) {
      // Check if the configured hotkey is pressed
      if (event.key === CONFIG.HOTKEY) {
        // Prevent default behavior and event bubbling
        event.preventDefault()
        event.stopPropagation()

        // Toggle topic list display
        toggleTopicList()
      }

      // If the list is visible, close it with the ESC key
      if (isListVisible && event.key === 'Escape') {
        hideTopicList()
      }
    })
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
   */
  function toggleTopicList() {
    if (isListVisible) {
      hideTopicList()
    } else {
      showTopicList()
    }
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
                  <select id="language-selector" onchange="this.dataset.lang = this.value" style="
                      margin-right: 15px;
                      margin-bottom: 0px;
                      padding: 4px 8px;
                      width: 100px;
                      border-radius: 4px;
                      border: 1px solid #e9e9e9;
                      background-color: #f8f8f8;
                      font-size: 14px;
                      color: #333;
                      cursor: pointer;
                      outline: none;
                      box-shadow: none;
                      appearance: auto;
                  ">
                      <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
                      <option value="zh-CN" ${currentLanguage === 'zh-CN' ? 'selected' : ''}>中文</option>
                  </select>
                  <a href="${cachedTopicListUrl}" class="source-link" title="${t('sourceFrom', { source: 'Page' })}">${t('sourceFrom', { source: 'Page' })}</a>
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

    // Add language selector event
    const languageSelector =
      contentContainer.querySelector('#language-selector')
    if (languageSelector) {
      languageSelector.addEventListener('change', function () {
        currentLanguage = this.value
        // Save language preference
        GM_setValue('discourse_topic_switcher_language', currentLanguage)
        // Refresh UI with new language
        hideTopicList()
        topicListContainer.remove()
        topicListContainer = null
        setTimeout(() => {
          showTopicList()
        }, 350)
      })
    }

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

    // Initially hidden
    topicListContainer.style.display = 'none'
    topicListContainer.classList.remove('visible')

    // Calculate and print execution time
    const endTime = performance.now()
    console.log(
      `[DTQS] Pre-rendering topic list completed in ${(endTime - startTime).toFixed(2)}ms`
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
  GM_addStyle(`
        #topic-list-viewer-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #0078d7;
            color: white;
            border: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        #topic-list-viewer-button:hover {
            background-color: #0063b1;
            transform: scale(1.1);
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
        }

        .topic-list-viewer-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .source-link {
            color: #0078d7;
            text-decoration: none;
            font-size: 14px;
        }

        .source-link:hover {
            text-decoration: underline;
        }

        #topic-list-viewer-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
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

        .topic-list-viewer-content td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        .topic-list-viewer-content tr:hover {
             background-color: #f5f5f5;
         }

         /* Current topic highlight style */
         .topic-list-viewer-content tr.current-topic {
             background-color: #e6f7ff;
             border-left: 3px solid #1890ff;
         }

         .topic-list-viewer-content tr.current-topic:hover {
             background-color: #d4edff;
         }

         .topic-list-viewer-content tr.current-topic td:first-child {
             padding-left: 7px; /* 10px - 3px border */
         }

        .topic-list-data {
            width: 60%;
        }

        .topic-list-replies, .topic-list-views, .topic-list-activity {
            width: 13%;
            text-align: center;
        }

        /* Dark mode styles */
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

        .topic-list-viewer-dark-mode #topic-list-viewer-close {
            color: #aaa;
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

        .topic-list-viewer-dark-mode .topic-list-viewer-content td {
            border-bottom: 1px solid #444;
        }

        .topic-list-viewer-dark-mode .topic-list-viewer-content tr:hover {
             background-color: #3a3a3a;
         }

         /* Current topic highlight style in dark mode */
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

        @media (max-width: 768px) {
            .topic-list-viewer-content {
                padding: 10px;
            }

            .topic-list-data {
                width: 70%;
            }

            .topic-list-replies, .topic-list-views, .topic-list-activity {
                width: 10%;
            }
        }
    `)

  // Initialize after the page has loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
