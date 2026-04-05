// ==UserScript==
// @name                 LINUX.DO CloudFlare Challenge Bypass - staging
// @name:zh-CN           LINUX.DO CloudFlare 5秒盾自动跳转 - staging
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.3.0
// @description          Automatically redirects to the challenge page when CloudFlare protection fails, improving browsing experience on linux.do
// @description:zh-CN    当 CloudFlare 5秒盾检测失败时，自动跳转到 challenge 页面，提升 linux.do 的浏览体验
// @author               Pipecraft
// @license              MIT
// @match                https://linux.do/*
// @icon                 https://wsrv.nl/?w=64&h=64&url=https%3A%2F%2Ft3.gstatic.com%2FfaviconV2%3Fclient%3DSOCIAL%26type%3DFAVICON%26fallback_opts%3DTYPE%2CSIZE%2CURL%26url%3Dhttps%3A%2F%2Flinux.do%26size%3D64
// @grant                GM_registerMenuCommand
// ==/UserScript==
//
;(() => {
  'use strict'
  var CONFIG = {
    ERROR_TEXTS: [
      '403 error',
      '\u8BE5\u56DE\u5E94\u662F\u5F88\u4E45\u4EE5\u524D\u521B\u5EFA\u7684',
      'reaction was created too long ago',
      '\u6211\u4EEC\u65E0\u6CD5\u52A0\u8F7D\u8BE5\u8BDD\u9898',
    ],
    DIALOG_SELECTOR: '.dialog-body',
    CHALLENGE_PATH: '/challenge',
    DEBUG: false,
    MENU_TEXT: '\u624B\u52A8\u89E6\u53D1 Challenge \u8DF3\u8F6C',
  }
  var log = (...args) => {
    if (CONFIG.DEBUG) {
      console.log('[LINUX.DO Auto Challenge]', ...args)
    }
  }
  function isChallengePage() {
    return globalThis.location.pathname.startsWith(CONFIG.CHALLENGE_PATH)
  }
  function isChallengeFailure() {
    if (isChallengePage()) {
      return false
    }
    try {
      const dialogElement = document.querySelector(CONFIG.DIALOG_SELECTOR)
      if (!dialogElement) return false
      const text = dialogElement.textContent || ''
      return CONFIG.ERROR_TEXTS.some((errorText) => text.includes(errorText))
    } catch (error) {
      log('\u68C0\u6D4B\u5931\u8D25\u9875\u9762\u65F6\u51FA\u9519:', error)
      return false
    }
  }
  function redirectToChallenge() {
    try {
      if (isChallengePage()) return
      const redirectUrl = ''
        .concat(CONFIG.CHALLENGE_PATH, '?redirect=')
        .concat(encodeURIComponent(globalThis.location.href))
      log('\u91CD\u5B9A\u5411\u5230:', redirectUrl)
      globalThis.location.href = redirectUrl
    } catch (error) {
      log('\u91CD\u5B9A\u5411\u65F6\u51FA\u9519:', error)
    }
  }
  function checkAndRedirect(observer) {
    if (isChallengeFailure()) {
      if (observer) observer.disconnect()
      redirectToChallenge()
      return true
    }
    return false
  }
  function manualTrigger() {
    log('\u624B\u52A8\u89E6\u53D1 Challenge \u8DF3\u8F6C')
    if (isChallengePage()) {
      alert('\u5DF2\u5728 Challenge \u9875\u9762\uFF0C\u65E0\u9700\u8DF3\u8F6C')
      return
    }
    redirectToChallenge()
  }
  function initScript() {
    log('\u521D\u59CB\u5316\u811A\u672C')
    if (isChallengePage()) {
      log(
        '\u5DF2\u5728 challenge \u9875\u9762\uFF0C\u4E0D\u6267\u884C\u811A\u672C'
      )
      return
    }
    if (checkAndRedirect()) return
    try {
      const observer = new MutationObserver((mutations, obs) => {
        checkAndRedirect(obs)
      })
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      })
      log('DOM \u89C2\u5BDF\u5668\u5DF2\u542F\u52A8')
    } catch (error) {
      log('\u542F\u52A8 DOM \u89C2\u5BDF\u5668\u65F6\u51FA\u9519:', error)
    }
    try {
      GM_registerMenuCommand(CONFIG.MENU_TEXT, manualTrigger)
      log('\u83DC\u5355\u547D\u4EE4\u5DF2\u6CE8\u518C')
    } catch (error) {
      log('\u6CE8\u518C\u83DC\u5355\u547D\u4EE4\u65F6\u51FA\u9519:', error)
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript)
  } else {
    initScript()
  }
})()
