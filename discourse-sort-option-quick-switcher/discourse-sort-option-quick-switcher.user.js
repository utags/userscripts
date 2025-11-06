// ==UserScript==
// @name                 Discourse Sort Option Quick Switcher
// @name:zh-CN           Discourse 排序快速切换
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.1
// @description          Quickly switch Discourse list sorting (created, activity, replies, views, likes) via menu by updating URL params.
// @description:zh-CN    通过菜单快速切换 Discourse 列表排序（创建/回复时间、回复数、浏览量、点赞数，升/降序），通过修改 URL 参数实现。
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
// @noframes
// @run-at               document-idle
// @grant                GM_registerMenuCommand
// ==/UserScript==

;(() => {
  'use strict'

  // i18n strings
  const I18N = {
    en: {
      created_new_to_old: 'Sort by created (New → Old)',
      created_old_to_new: 'Sort by created (Old → New)',
      activity_new_to_old: 'Sort by activity (New → Old)',
      activity_old_to_new: 'Sort by activity (Old → New)',
      posts_high_to_low: 'Sort by replies (High → Low)',
      posts_low_to_high: 'Sort by replies (Low → High)',
      views_high_to_low: 'Sort by views (High → Low)',
      views_low_to_high: 'Sort by views (Low → High)',
      likes_high_to_low: 'Sort by likes (High → Low)',
      likes_low_to_high: 'Sort by likes (Low → High)',
    },
    'zh-CN': {
      created_new_to_old: '按创建时间（新→老）',
      created_old_to_new: '按创建时间（老→新）',
      activity_new_to_old: '按回复时间（新→老）',
      activity_old_to_new: '按回复时间（老→新）',
      posts_high_to_low: '按回复数量（多→少）',
      posts_low_to_high: '按回复数量（少→多）',
      views_high_to_low: '按浏览量（多→少）',
      views_low_to_high: '按浏览量（少→多）',
      likes_high_to_low: '按点赞数（多→少）',
      likes_low_to_high: '按点赞数（少→多）',
    },
  }

  function getLanguage() {
    const lang = (navigator.language || 'en').toLowerCase()
    return lang.startsWith('zh') ? 'zh-CN' : 'en'
  }

  // Sort parameter mapping
  const SORTS = {
    created_desc: { order: 'created', ascending: false },
    created_asc: { order: 'created', ascending: true },
    activity_desc: { order: 'activity', ascending: false },
    activity_asc: { order: 'activity', ascending: true },
    posts_desc: { order: 'posts', ascending: false },
    posts_asc: { order: 'posts', ascending: true },
    views_desc: { order: 'views', ascending: false },
    views_asc: { order: 'views', ascending: true },
    likes_desc: { order: 'likes', ascending: false },
    likes_asc: { order: 'likes', ascending: true },
  }

  // Update URL parameters and navigate
  function applySort(opts) {
    const { order, ascending } = opts || {}
    if (!order || typeof ascending !== 'boolean') return

    // Current URL (unchanged)
    const current = new URL(window.location.href)
    const currentOrder = current.searchParams.get('order')
    const currentAsc = current.searchParams.get('ascending')

    // Target URL (with updated params)
    const target = new URL(window.location.href)
    target.searchParams.set('order', order)
    target.searchParams.set('ascending', ascending ? 'true' : 'false')

    // Avoid redundant reload if already at target sort
    const isSame =
      currentOrder === order &&
      ((currentAsc === null && ascending === false) || // Some sites default to descending and omit 'ascending'
        currentAsc === (ascending ? 'true' : 'false'))
    if (!isSame) {
      window.location.assign(target.toString())
    }
  }

  // Register menu commands
  function registerMenu() {
    if (typeof GM_registerMenuCommand !== 'function') return
    const t = I18N[getLanguage()] || I18N['en']

    GM_registerMenuCommand(t.created_new_to_old, () =>
      applySort(SORTS.created_desc)
    )
    GM_registerMenuCommand(t.created_old_to_new, () =>
      applySort(SORTS.created_asc)
    )

    GM_registerMenuCommand(t.activity_new_to_old, () =>
      applySort(SORTS.activity_desc)
    )
    GM_registerMenuCommand(t.activity_old_to_new, () =>
      applySort(SORTS.activity_asc)
    )

    GM_registerMenuCommand(t.posts_high_to_low, () =>
      applySort(SORTS.posts_desc)
    )
    GM_registerMenuCommand(t.posts_low_to_high, () =>
      applySort(SORTS.posts_asc)
    )

    GM_registerMenuCommand(t.views_high_to_low, () =>
      applySort(SORTS.views_desc)
    )
    GM_registerMenuCommand(t.views_low_to_high, () =>
      applySort(SORTS.views_asc)
    )

    GM_registerMenuCommand(t.likes_high_to_low, () =>
      applySort(SORTS.likes_desc)
    )
    GM_registerMenuCommand(t.likes_low_to_high, () =>
      applySort(SORTS.likes_asc)
    )
  }

  // Register menu immediately
  registerMenu()
})()
