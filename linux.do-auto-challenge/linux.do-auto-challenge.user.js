// ==UserScript==
// @name                 LINUX.DO CloudFlare Challenge Bypass
// @name:zh-CN           LINUX.DO CloudFlare 5秒盾自动跳转
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.2.1
// @description          Automatically redirects to the challenge page when CloudFlare protection fails, improving browsing experience on linux.do
// @description:zh-CN    当 CloudFlare 5秒盾检测失败时，自动跳转到 challenge 页面，提升 linux.do 的浏览体验
// @author               Pipecraft
// @license              MIT
// @match                https://linux.do/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant                GM_registerMenuCommand
// ==/UserScript==

;(function () {
  'use strict'

  // 配置常量
  const CONFIG = {
    // 需要检测的错误文本
    ERROR_TEXTS: [
      '403 error',
      '该回应是很久以前创建的',
      'reaction was created too long ago',
      '我们无法加载该话题',
    ],
    // 要查找的元素选择器
    DIALOG_SELECTOR: '.dialog-body',
    // 重定向路径
    CHALLENGE_PATH: '/challenge',
    // 调试模式
    DEBUG: false,
    // 菜单文本
    MENU_TEXT: '手动触发 Challenge 跳转',
  }

  /**
   * 日志函数，仅在调试模式下输出
   * @param {...any} args - 要记录的参数
   */
  const log = (...args) => {
    if (CONFIG.DEBUG) {
      console.log('[LINUX.DO Auto Challenge]', ...args)
    }
  }

  /**
   * 检查当前页面是否是 challenge 页面
   * @returns {boolean} - 如果是 challenge 页面则返回 true，否则返回 false
   */
  function isChallengePage() {
    return window.location.pathname.startsWith(CONFIG.CHALLENGE_PATH)
  }

  /**
   * 检查当前页面是否是 CloudFlare challenge 失败页面
   * 只检查带有 dialog-body 类的元素
   * @returns {boolean} - 如果是失败页面则返回 true，否则返回 false
   */
  function isChallengeFailure() {
    // 如果已经在 challenge 页面，不要再次检测
    if (isChallengePage()) {
      return false
    }

    try {
      // 查找页面中的 dialog-body 元素
      const dialogElement = document.querySelector(CONFIG.DIALOG_SELECTOR)
      if (!dialogElement) return false

      // 检查 dialog-body 元素的内容是否包含错误文本
      const text = dialogElement.innerText || ''
      return CONFIG.ERROR_TEXTS.some((errorText) => text.includes(errorText))
    } catch (error) {
      log('检测失败页面时出错:', error)
      return false
    }
  }

  /**
   * 重定向到 challenge URL
   */
  function redirectToChallenge() {
    try {
      // 防止在 challenge 页面重复跳转
      if (isChallengePage()) return

      const redirectUrl = `${CONFIG.CHALLENGE_PATH}?redirect=${encodeURIComponent(window.location.href)}`
      log('重定向到:', redirectUrl)
      window.location.href = redirectUrl
    } catch (error) {
      log('重定向时出错:', error)
    }
  }

  /**
   * 检查并处理 CloudFlare 失败
   * @param {MutationObserver} [observer] - 可选的观察者实例，如果提供则在检测到失败时断开
   */
  function checkAndRedirect(observer) {
    if (isChallengeFailure()) {
      if (observer) observer.disconnect()
      redirectToChallenge()
      return true
    }
    return false
  }

  /**
   * 手动触发 Challenge 跳转
   * 直接跳转到 challenge 页面，或在已经在 challenge 页面时提示用户
   */
  function manualTrigger() {
    log('手动触发 Challenge 跳转')

    if (isChallengePage()) {
      alert('已在 Challenge 页面，无需跳转')
      return
    }

    redirectToChallenge()
  }

  /**
   * 初始化脚本
   */
  function initScript() {
    log('初始化脚本')

    // 如果已经在 challenge 页面，不需要执行脚本
    if (isChallengePage()) {
      log('已在 challenge 页面，不执行脚本')
      return
    }

    // 初始检查
    if (checkAndRedirect()) return

    // 观察 DOM 变化
    try {
      const observer = new MutationObserver((mutations, obs) => {
        checkAndRedirect(obs)
      })

      observer.observe(document.body, {
        childList: true, // 监听子节点变化
        subtree: true, // 监听所有后代节点
        characterData: true, // 监听文本内容变化
      })

      log('DOM 观察器已启动')
    } catch (error) {
      log('启动 DOM 观察器时出错:', error)
    }

    // 注册菜单命令
    try {
      GM_registerMenuCommand(CONFIG.MENU_TEXT, manualTrigger)
      log('菜单命令已注册')
    } catch (error) {
      log('注册菜单命令时出错:', error)
    }
  }

  // 确保 DOM 已加载后执行脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript)
  } else {
    initScript()
  }
})()
