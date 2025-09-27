// ==UserScript==
// @name                 Discourse Topic Quick Switcher
// @name:zh-CN           Discourse 话题快捷切换器
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
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
// @noframes
// @grant                GM_addStyle
// @grant                GM_setValue
// @grant                GM_getValue
// ==/UserScript==

;(function () {
  'use strict'

  // 配置
  const CONFIG = {
    // 快捷键 (默认为反引号键 `)
    HOTKEY: '`',
    // 缓存键名
    CACHE_KEY: 'discourse_topic_list_cache',
    // 缓存过期时间（毫秒）- 1小时
    CACHE_EXPIRY: 60 * 60 * 1000,
    // 是否在话题页显示悬浮按钮
    SHOW_FLOATING_BUTTON: true,
    // 路由检查间隔（毫秒）
    ROUTE_CHECK_INTERVAL: 500,
    // 是否自动跟随系统深色模式
    AUTO_DARK_MODE: true,
  }

  // 状态变量
  let isListVisible = false
  let cachedTopicList = null
  let cachedTopicListTimestamp = 0
  let cachedTopicListUrl = ''
  let floatingButton = null
  let topicListContainer = null
  let lastUrl = window.location.href
  let urlCheckTimer = null
  let isDarkMode = false

  /**
   * 检测深色模式
   */
  function detectDarkMode() {
    // 检查系统深色模式
    if (CONFIG.AUTO_DARK_MODE && window.matchMedia) {
      // 检查系统偏好
      const systemDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

      // 检查 Discourse 网站是否处于深色模式
      const discourseBodyClass =
        document.body.classList.contains('dark-scheme') ||
        document.documentElement.classList.contains('dark-scheme') ||
        document.body.dataset.colorScheme === 'dark' ||
        document.documentElement.dataset.colorScheme === 'dark' ||
        document.documentElement.dataset.themeType === 'dark' ||
        // linux.do
        document.querySelector('header picture > source')?.media === 'all'

      // 如果系统或网站使用深色模式，则启用深色模式
      isDarkMode = systemDarkMode || discourseBodyClass

      console.log(
        `Discourse Quick List Viewer: 深色模式检测 - 系统: ${systemDarkMode}, 网站: ${discourseBodyClass}, 最终: ${isDarkMode}`
      )

      // 添加或移除深色模式类
      if (isDarkMode) {
        document.body.classList.add('topic-list-viewer-dark-mode')
      } else {
        document.body.classList.remove('topic-list-viewer-dark-mode')
      }
    }
  }

  /**
   * 设置深色模式监听器
   */
  function setupDarkModeListener() {
    if (CONFIG.AUTO_DARK_MODE && window.matchMedia) {
      // 监听系统深色模式变化
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      )

      // 添加变化监听器
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', (e) => {
          detectDarkMode()
        })
      } else if (darkModeMediaQuery.addListener) {
        // 兼容旧版浏览器
        darkModeMediaQuery.addListener((e) => {
          detectDarkMode()
        })
      }

      // 监听 Discourse 主题变化
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

      // 观察 body 和 html 元素的类变化
      observer.observe(document.body, { attributes: true })
      observer.observe(document.documentElement, { attributes: true })
    }
  }

  /**
   * 初始化脚本
   */
  function init() {
    // 从存储中加载缓存的话题列表
    loadCachedTopicList()

    // 检测深色模式
    detectDarkMode()

    // 设置深色模式监听器
    // setupDarkModeListener()

    // 初始处理当前页面
    handleCurrentPage()

    // 设置URL变化监听
    setupUrlChangeDetection()

    // 添加全局快捷键监听
    addHotkeyListener()
  }

  /**
   * 设置URL变化监听
   * 使用多种方式确保能够可靠地检测URL变化
   */
  function setupUrlChangeDetection() {
    // 记录初始URL
    lastUrl = window.location.href

    // 方法1: 监听popstate事件（处理浏览器前进/后退按钮）
    window.addEventListener('popstate', () => {
      console.log('Discourse Quick List Viewer: 检测到popstate事件')
      handleCurrentPage()
    })

    // 方法2: 使用MutationObserver监听DOM变化，可能暗示URL变化
    const pageObserver = new MutationObserver(() => {
      checkUrlChange('MutationObserver')
    })

    // 开始观察DOM变化
    pageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // 方法3: 设置定期检查，作为备用方案
    if (urlCheckTimer) {
      clearInterval(urlCheckTimer)
    }

    urlCheckTimer = setInterval(() => {
      checkUrlChange('定时检查')
    }, CONFIG.ROUTE_CHECK_INTERVAL)
  }

  /**
   * 检查URL是否发生变化
   * @param {string} source 触发检查的来源
   */
  function checkUrlChange(source) {
    const currentUrl = window.location.href
    if (currentUrl !== lastUrl) {
      console.log(
        `Discourse Quick List Viewer: 检测到URL变化 (来源: ${source})`,
        currentUrl
      )
      lastUrl = currentUrl
      handleCurrentPage()
    }
  }

  /**
   * 处理当前页面
   */
  function handleCurrentPage() {
    // 如果列表已显示，关闭
    if (isListVisible) {
      hideTopicList()
    }

    // 根据当前页面类型执行不同的操作
    if (isTopicPage()) {
      // 在话题页面，添加悬浮按钮
      console.log('Discourse Quick List Viewer: 当前是话题页，显示按钮')
      if (CONFIG.SHOW_FLOATING_BUTTON) {
        addFloatingButton()
      }

      // 在话题页面，提前渲染列表（如果有缓存）
      if (cachedTopicList && !topicListContainer) {
        // 使用setTimeout确保DOM已完全加载
        setTimeout(() => {
          prerenderTopicList()
        }, 100)
      }
    } else if (isTopicListPage()) {
      // 在话题列表页面，缓存当前列表
      console.log('Discourse Quick List Viewer: 当前是列表页，更新缓存')
      cacheCurrentTopicList()

      // 在列表页隐藏按钮
      hideFloatingButton()
    } else {
      // 其他页面，隐藏按钮
      hideFloatingButton()

      // 监听列表元素
      observeTopicListElement()
    }
  }

  /**
   * 判断当前是否为话题列表页面
   * @returns {boolean} 是否为话题列表页面
   */
  function isTopicListPage() {
    return (
      document.querySelector(
        '.contents table.topic-list tbody.topic-list-body'
      ) !== null
    )
  }

  /**
   * 监听话题列表元素的出现
   * 解决页面加载时列表元素可能尚未渲染的问题
   */
  function observeTopicListElement() {
    // 创建一个观察器实例
    const observer = new MutationObserver((mutations, obs) => {
      // 检查列表元素是否已出现
      if (
        document.querySelector(
          '.contents table.topic-list tbody.topic-list-body'
        )
      ) {
        console.log('Discourse Quick List Viewer: 检测到列表元素已渲染')
        // 如果列表元素出现，重新处理当前页面
        handleCurrentPage()
        // 列表元素已找到，停止观察
        obs.disconnect()
      }
    })

    // 配置观察选项
    const config = {
      childList: true, // 观察目标子节点的变化
      subtree: true, // 观察所有后代节点
    }

    // 开始观察文档主体
    observer.observe(document.body, config)

    // 设置超时，避免无限期观察
    setTimeout(() => {
      observer.disconnect()
    }, 10000) // 10秒后停止观察
  }

  /**
   * 判断当前是否为话题页面
   * @returns {boolean} 是否为话题页面
   */
  function isTopicPage() {
    return window.location.pathname.includes('/t/')
  }

  /**
   * 获取当前话题ID
   * @returns {number|null} 当前话题ID或null
   */
  function getCurrentTopicId() {
    // 从URL中提取话题ID
    const match = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  /**
   * 缓存当前话题列表
   */
  function cacheCurrentTopicList() {
    // 检查列表元素是否存在
    const topicListBody = document.querySelector('tbody.topic-list-body')
    if (topicListBody) {
      // 列表元素已存在，直接处理
      updateTopicListCache(topicListBody)

      // 监听列表内容变化（滚动加载更多时）
      observeTopicListChanges(topicListBody)
    } else {
      // 列表元素不存在，监听其出现
      console.log('Discourse Quick List Viewer: 等待话题列表元素出现')
      observeTopicListAppearance()
    }
  }

  /**
   * 监听话题列表元素的出现
   */
  function observeTopicListAppearance() {
    // 创建一个观察器实例
    const observer = new MutationObserver((mutations, obs) => {
      // 检查列表元素是否已出现
      const topicListBody = document.querySelector('tbody.topic-list-body')
      if (topicListBody) {
        console.log('Discourse Quick List Viewer: 检测到列表元素已渲染')
        // 处理列表内容
        processTopicList(topicListBody)
        // 监听列表内容变化
        observeTopicListChanges(topicListBody)
        // 列表元素已找到，停止观察
        obs.disconnect()
      }
    })

    // 配置观察选项
    const config = {
      childList: true, // 观察目标子节点的变化
      subtree: true, // 观察所有后代节点
    }

    // 开始观察文档主体
    observer.observe(document.body, config)
  }

  /**
   * 监听话题列表内容变化（滚动加载更多时）
   * @param {Element} topicListBody 话题列表元素
   */
  function observeTopicListChanges(topicListBody) {
    // 记录当前行数
    let previousRowCount = topicListBody.querySelectorAll('tr').length

    // 创建一个观察器实例
    const observer = new MutationObserver((mutations) => {
      // 获取当前行数
      const currentRowCount = topicListBody.querySelectorAll('tr').length

      // 如果行数增加，说明加载了更多话题
      if (currentRowCount > previousRowCount) {
        console.log(
          `Discourse Quick List Viewer: 检测到列表更新，行数从 ${previousRowCount} 增加到 ${currentRowCount}`
        )
        // 更新缓存
        updateTopicListCache(topicListBody)
        // 更新行数记录
        previousRowCount = currentRowCount
      }
    })

    // 配置观察选项
    const config = {
      childList: true, // 观察目标子节点的变化
      subtree: true, // 观察所有后代节点
    }

    // 开始观察列表元素
    observer.observe(topicListBody, config)
  }

  /**
   * 更新话题列表缓存
   * @param {Element} topicListBody 话题列表元素
   */
  function updateTopicListCache(topicListBody) {
    // 确保列表中有内容
    const topicRows = topicListBody.querySelectorAll('tr')
    if (topicRows.length === 0) {
      console.log('Discourse Quick List Viewer: 话题列表为空，不缓存')
      return
    }

    console.log('Discourse Quick List Viewer: 更新话题列表缓存')

    // 克隆节点以保存完整的话题列表
    const clonedTopicList = topicListBody.cloneNode(true)

    // 保存当前URL，以便在弹出列表时显示来源
    const currentUrl = window.location.href

    // 获取列表标题
    let listTitle = '话题列表'
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

    // 获取当前分类信息（如果有）
    let categoryInfo = ''
    const categoryBadge = document.querySelector(
      '.category-name .badge-category'
    )
    if (categoryBadge) {
      categoryInfo = categoryBadge.textContent.trim()
    }

    console.log(
      `Discourse Quick List Viewer: 缓存话题列表 "${listTitle}"，包含 ${topicRows.length} 个话题`
    )

    // 保存到缓存
    cachedTopicList = clonedTopicList.outerHTML
    cachedTopicListTimestamp = Date.now()
    cachedTopicListUrl = currentUrl

    // 保存到GM存储
    GM_setValue(CONFIG.CACHE_KEY, {
      html: cachedTopicList,
      timestamp: cachedTopicListTimestamp,
      url: cachedTopicListUrl,
      title: listTitle,
      category: categoryInfo,
      topicCount: topicRows.length,
    })

    // 移除列表容器，需要重新渲染
    if (topicListContainer) {
      topicListContainer.remove()
      topicListContainer = null
    }
  }

  /**
   * 从存储中加载缓存的话题列表
   */
  function loadCachedTopicList() {
    const cache = GM_getValue(CONFIG.CACHE_KEY)
    if (cache) {
      cachedTopicList = cache.html
      cachedTopicListTimestamp = cache.timestamp
      cachedTopicListUrl = cache.url
    }
  }

  /**
   * 添加悬浮按钮
   */
  function addFloatingButton() {
    // 如果已经存在按钮，则不重复添加
    if (document.getElementById('topic-list-viewer-button')) return

    // 创建悬浮按钮
    floatingButton = document.createElement('button')
    floatingButton.id = 'topic-list-viewer-button'
    floatingButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
    floatingButton.title = '查看话题列表 (按 ` 键)'

    // 添加点击事件
    floatingButton.addEventListener('click', toggleTopicList)

    // 添加到页面
    document.body.appendChild(floatingButton)
  }

  /**
   * 添加快捷键监听器
   */
  function addHotkeyListener() {
    document.addEventListener('keydown', function (event) {
      // 检查是否按下了配置的快捷键
      if (event.key === CONFIG.HOTKEY) {
        // 防止默认行为和事件冒泡
        event.preventDefault()
        event.stopPropagation()

        // 切换话题列表显示
        toggleTopicList()
      }

      // 如果列表已显示，按ESC键关闭
      if (isListVisible && event.key === 'Escape') {
        hideTopicList()
      }
    })
  }

  /**
   * 隐藏悬浮按钮
   */
  function hideFloatingButton() {
    if (floatingButton && floatingButton.parentNode) {
      floatingButton.parentNode.removeChild(floatingButton)
      floatingButton = null
    }
  }

  /**
   * 切换话题列表显示状态
   */
  function toggleTopicList() {
    if (isListVisible) {
      hideTopicList()
    } else {
      showTopicList()
    }
  }

  /**
   * 使用SPA路由方式导航到指定URL
   * @param {string} url 目标URL
   */
  function navigateWithSPA(url) {
    // 隐藏话题列表
    hideTopicList()

    // 尝试使用pushState进行SPA导航
    try {
      console.log(`Discourse Quick List Viewer: 使用SPA路由导航到 ${url}`)

      // 使用history API进行导航
      const urlObj = new URL(url)
      const pathname = urlObj.pathname

      // 更新历史记录
      history.pushState({}, '', pathname)

      // 触发popstate事件以便Discourse可以处理路由变化
      window.dispatchEvent(new Event('popstate'))

      // 处理当前页面
      setTimeout(handleCurrentPage, 100)
    } catch (error) {
      // 如果SPA导航失败，回退到普通导航
      console.log(
        `Discourse Quick List Viewer: SPA导航失败，使用普通导航到 ${url}`,
        error
      )
      window.location.href = url
    }
  }

  /**
   * 预渲染话题列表
   */
  function prerenderTopicList() {
    // 记录开始时间
    const startTime = performance.now()

    // 如果没有缓存的话题列表，则不预渲染
    if (!cachedTopicList) {
      console.log(
        'Discourse Quick List Viewer: 没有可用的话题列表缓存，无法预渲染'
      )
      return
    }

    // 如果容器已存在，则不重复创建
    if (topicListContainer) {
      return
    }

    console.log('Discourse Quick List Viewer: 预渲染话题列表')

    // 检查缓存是否过期
    const now = Date.now()
    const cacheAge = now - cachedTopicListTimestamp
    let cacheStatus = ''

    if (cacheAge > CONFIG.CACHE_EXPIRY) {
      cacheStatus = `<div class="cache-status expired">缓存已过期 (${formatTimeAgo(cacheAge)})</div>`
    } else {
      cacheStatus = `<div class="cache-status">缓存于 ${formatTimeAgo(cacheAge)} 前</div>`
    }

    // 创建主容器
    topicListContainer = document.createElement('div')
    topicListContainer.id = 'topic-list-viewer-container'

    // 创建遮罩层
    const overlay = document.createElement('div')
    overlay.className = 'topic-list-viewer-overlay'

    // 添加点击遮罩层关闭列表的事件监听器
    overlay.addEventListener('click', (event) => {
      // 确保点击的是遮罩层本身，而不是其子元素
      if (event.target === overlay) {
        hideTopicList()
      }
    })

    // 创建内容容器
    const contentContainer = document.createElement('div')
    contentContainer.className = 'topic-list-viewer-wrapper'

    // 将内容容器添加到主容器
    topicListContainer.appendChild(overlay)
    topicListContainer.appendChild(contentContainer)

    // 添加到 body
    document.body.appendChild(topicListContainer)

    // 尝试获取 #main-outlet 元素的位置和宽度
    const mainOutlet = document.getElementById('main-outlet')
    if (mainOutlet) {
      console.log(
        'Discourse Quick List Viewer: 调整列表容器位置和宽度与 #main-outlet 一致'
      )

      // 在显示容器时调整位置和宽度
      const adjustContainerPosition = () => {
        if (topicListContainer.style.display === 'flex') {
          const mainOutletRect = mainOutlet.getBoundingClientRect()

          // 设置内容容器的位置和宽度与 #main-outlet 一致
          contentContainer.style.width = `${mainOutletRect.width}px`
          contentContainer.style.maxWidth = `${mainOutletRect.width}px`
          contentContainer.style.marginLeft = 'auto'
          contentContainer.style.marginRight = 'auto'
        }
      }

      // 添加调整位置的监听器
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === 'style' &&
            topicListContainer.style.display === 'flex'
          ) {
            adjustContainerPosition()
          }
        })
      })

      observer.observe(topicListContainer, { attributes: true })

      // 窗口大小变化时重新调整
      window.addEventListener('resize', adjustContainerPosition)
    } else {
      console.log(
        'Discourse Quick List Viewer: #main-outlet 不存在，使用默认样式'
      )
    }

    // 获取缓存的标题
    const cache = GM_getValue(CONFIG.CACHE_KEY)
    const listTitle = cache && cache.title ? cache.title : '话题列表'

    // 填充内容容器
    contentContainer.innerHTML = `
          <div class="topic-list-viewer-header">
              <h3>${listTitle}</h3>
              <div class="topic-list-viewer-controls">
                  <a href="${cachedTopicListUrl}" class="source-link" title="打开源列表页面">源页面</a>
                  <button id="topic-list-viewer-close">×</button>
              </div>
          </div>
          ${cacheStatus}
          <div class="topic-list-viewer-content">
              <table class="topic-list">
                  <thead>
                      <tr>
                          <th class="topic-list-data default">话题</th>
                          <th class="topic-list-data posters"></th>
                          <th class="topic-list-data posts num">回复</th>
                          <th class="topic-list-data views num">查看</th>
                          <th class="topic-list-data activity num">活动</th>
                      </tr>
                  </thead>
                  ${cachedTopicList}
              </table>
          </div>
      `

    // 添加关闭按钮事件
    contentContainer
      .querySelector('#topic-list-viewer-close')
      .addEventListener('click', hideTopicList)

    // 为话题列表中的所有链接添加SPA路由事件
    const topicLinks = contentContainer.querySelectorAll('.topic-list-item a')
    topicLinks.forEach((link) => {
      link.addEventListener(
        'click',
        function (event) {
          console.log(`Discourse Quick List Viewer: 链接被点击 ${link.href}`)
          event.preventDefault()
          event.stopPropagation()
          navigateWithSPA(link.href, null)
          return false
        },
        true
      )
    })

    // 初始状态为隐藏
    topicListContainer.style.display = 'none'
    topicListContainer.classList.remove('visible')

    // 计算并打印执行时间
    const endTime = performance.now()
    console.log(
      `Discourse Quick List Viewer: 预渲染话题列表完成，耗时 ${(endTime - startTime).toFixed(2)}ms`
    )
  }

  /**
   * 显示话题列表
   */
  function showTopicList() {
    // 记录开始时间
    const startTime = performance.now()

    // 如果没有缓存的话题列表，则不显示
    if (!cachedTopicList) {
      alert('没有可用的话题列表缓存。请先访问一个话题列表页面。')
      return
    }

    // 如果容器不存在，先预渲染
    if (!topicListContainer) {
      prerenderTopicList()
    }

    // 隐藏 body 和 html 的滚动条
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // 记录当前滚动位置，以便恢复时使用
    window._savedScrollPosition =
      window.scrollY || document.documentElement.scrollTop

    // 显示容器并立即添加可见类
    topicListContainer.style.display = 'flex'
    // 强制重绘
    // void topicListContainer.offsetWidth
    topicListContainer.classList.add('visible')
    isListVisible = true

    // 高亮当前话题
    const currentTopicId = getCurrentTopicId()

    // 先移除所有已有的高亮
    const previousHighlightedRows = topicListContainer.querySelectorAll(
      '.topic-list-item.current-topic'
    )
    previousHighlightedRows.forEach((row) => {
      row.classList.remove('current-topic')
    })

    if (currentTopicId) {
      // 查找所有话题行
      const topicRows = topicListContainer.querySelectorAll('.topic-list-item')
      topicRows.forEach((row) => {
        // 获取话题链接
        const topicLink = row.querySelector('a.title')
        if (topicLink) {
          // 从链接中提取话题ID
          const match = topicLink.href.match(/\/t\/[^\/]+\/(\d+)/)
          if (match && parseInt(match[1]) === currentTopicId) {
            // 添加高亮类
            row.classList.add('current-topic')
            // 滚动到当前话题
            setTimeout(() => {
              row.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
          }
        }
      })
    }

    // 计算并打印执行时间
    const endTime = performance.now()
    console.log(
      `Discourse Quick List Viewer: 显示话题列表完成，耗时 ${(endTime - startTime).toFixed(2)}ms`
    )
  }

  /**
   * 隐藏话题列表
   */
  function hideTopicList() {
    if (!topicListContainer) return

    // 恢复 body 和 html 的滚动条
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''

    // 恢复滚动位置
    if (window._savedScrollPosition !== undefined) {
      window.scrollTo(0, window._savedScrollPosition)
      window._savedScrollPosition = undefined
    }

    // 移除可见类以触发淡出动画
    topicListContainer.classList.remove('visible')

    // 等待动画完成后隐藏
    setTimeout(() => {
      topicListContainer.style.display = 'none'
      isListVisible = false
    }, 300)
  }

  /**
   * 格式化时间差
   * @param {number} ms - 毫秒数
   * @returns {string} - 格式化后的时间差
   */
  function formatTimeAgo(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}天`
    if (hours > 0) return `${hours}小时`
    if (minutes > 0) return `${minutes}分钟`
    return `${seconds}秒`
  }

  // 添加样式
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

         /* 当前话题高亮样式 */
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

        /* 深色模式样式 */
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

         /* 深色模式下当前话题高亮样式 */
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

  // 等待页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
