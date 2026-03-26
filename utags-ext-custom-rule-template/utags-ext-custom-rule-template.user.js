// ==UserScript==
// @name                 UTags Ext - Custom Rule Template
// @name:zh-CN           UTags 扩展 - 自定义规则模板
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
// @description          Custom rule for UTags.
// @description:zh-CN    UTags 自定义规则。
// @icon                 data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ff6361' class='bi bi-tags-fill' viewBox='0 0 16 16'%3E %3Cpath d='M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/%3E %3Cpath d='M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z'/%3E %3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                https://baidu.com/*
// @match                https://www.baidu.com/*
// @noframes
// @run-at               document-idle
// ==/UserScript==
//
;(() => {
  'use strict'
  function main() {
    console.log('UTags Ext - Custom Rule Template')

    // 百度首页 > 百度热搜
    for (const item of document.querySelectorAll(
      '.s-hotsearch-content a.title-content'
    )) {
      const titleElement = item.querySelector('span.title-content-title')
      const title = titleElement?.textContent?.trim()
      if (title) {
        // data-utags_link 用于存储链接, 可以留空
        item.dataset.utags_link = `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`
        // data-utags_title 用于存储标题, 可以留空
        item.dataset.utags_title = title
      }
    }

    // 搜索结果 > 侧边栏 > 百度热搜
    for (const item of document.querySelectorAll('#con-ceiling-wrapper a')) {
      const title = item.textContent?.trim()
      if (title) {
        item.dataset.utags_link = `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`
      }
    }

    // 搜索结果 > 侧边栏 > 百度热搜标题
    const sectionTitle = document.querySelector(
      '#con-ceiling-wrapper .cr-title a'
    )
    if (sectionTitle) {
      // 排除 百度热搜标题 中的链接
      sectionTitle.dataset.utags_ignore = ''
    }
  }
  main()
})()
