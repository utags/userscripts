// ==UserScript==
// @name                 Find Scripts For This Site
// @name:zh-CN           查找适用于当前网站的脚本
// @name:zh-TW           查找適用於當前網站的腳本
// @name:ja              このサイト用のスクリプトを探す
// @name:ko              이 사이트용 스크립트 찾기
// @name:es              Buscar scripts para este sitio
// @name:fr              Trouver des scripts pour ce site
// @name:de              Skripte für diese Website finden
// @name:ru              Найти скрипты для этого сайта
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.0
// @description          Find userscripts for the current website from popular script repositories
// @description:zh-CN    查找适用于当前网站的用户脚本，支持多个脚本仓库
// @description:zh-TW    查找適用於當前網站的用戶腳本，支持多個腳本倉庫
// @description:ja       人気のスクリプトリポジトリから現在のウェブサイト用のユーザースクリプトを見つける
// @description:ko       인기 스크립트 저장소에서 현재 웹사이트용 사용자 스크립트 찾기
// @description:es       Encuentra userscripts para el sitio web actual desde repositorios populares
// @description:fr       Trouvez des scripts utilisateur pour le site Web actuel à partir de référentiels de scripts populaires
// @description:de       Finden Sie Benutzerskripte für die aktuelle Website aus beliebten Skript-Repositories
// @description:ru       Найдите пользовательские скрипты для текущего веб-сайта из популярных репозиториев скриптов
// @author               Pipecraft
// @license              MIT
// @match                *://*/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=www.tampermonkey.net
// @grant                GM_registerMenuCommand
// @grant                GM_openInTab
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration constants
  const CONFIG = {
    REPOSITORIES: [
      {
        name: 'Greasy Fork',
        url: 'https://greasyfork.org/scripts/by-site/{domain}',
        icon: '🍴',
      },
      {
        name: 'OpenUserJS',
        url: 'https://openuserjs.org/?q={domain}',
        icon: '📜',
      },
      {
        name: 'ScriptCat',
        url: 'https://scriptcat.org/search?domain={domain}',
        icon: '🐱',
      },
      {
        name: 'GitHub',
        url: 'https://github.com/search?type=code&q=language%3AJavaScript+%22%3D%3DUserScript%3D%3D%22+{domain}',
        icon: '🐙',
      },
      {
        name: 'GitHub Gist',
        url: 'https://gist.github.com/search?l=JavaScript&q=%22%3D%3DUserScript%3D%3D%22+{domain}',
        icon: '📝',
      },
    ],
    DEBUG: false, // Set to true for debug logging
  }

  // Internationalization support
  const I18N = {
    // Menu text template: "{icon} Find scripts on {name}"
    menuTemplate: {
      en: '{icon} Find scripts on {name}',
      'zh-CN': '{icon} 在 {name} 上查找脚本',
      'zh-TW': '{icon} 在 {name} 上查找腳本',
      ja: '{icon} {name} でスクリプトを探す',
      ko: '{icon} {name}에서 스크립트 찾기',
      es: '{icon} Buscar scripts en {name}',
      fr: '{icon} Trouver des scripts sur {name}',
      de: '{icon} Skripte auf {name} finden',
      ru: '{icon} Найти скрипты на {name}',
    },
  }

  /**
   * Detect user's browser language
   * @returns {string} Language code
   */
  function detectLanguage() {
    try {
      // Get browser language
      const browserLang = (
        navigator.language ||
        navigator.userLanguage ||
        'en'
      ).toLowerCase()

      // Match with supported languages
      const supportedLangs = Object.keys(I18N.menuTemplate)

      // Try to find exact match
      if (supportedLangs.includes(browserLang)) {
        return browserLang
      }

      // Try to find language match without region (e.g., 'zh' for 'zh-CN')
      const langBase = browserLang.split('-')[0]
      const matchingLang = supportedLangs.find((lang) =>
        lang.startsWith(langBase + '-')
      )
      if (matchingLang) {
        return matchingLang
      }

      // Default to English
      return 'en'
    } catch (error) {
      debugLog('Error detecting language:', error)
      return 'en' // Fallback to English
    }
  }

  /**
   * Log debug messages if debug mode is enabled
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log(`[Find Scripts] ${message}`, data || '')
    }
  }

  /**
   * Extract the top-level domain from the current URL
   * @returns {string} The top-level domain
   */
  function extractDomain() {
    try {
      const hostname = window.location.hostname
      // Remove 'www.' if present
      let domain = hostname.replace(/^www\./, '')

      // Extract the top-level domain (e.g., example.com from sub.example.com)
      const parts = domain.split('.')
      if (parts.length > 2) {
        // Handle special cases like co.uk, com.au, etc.
        const secondLevelDomains = [
          'co',
          'com',
          'org',
          'net',
          'edu',
          'gov',
          'mil',
        ]
        const thirdLevelDomain = parts[parts.length - 2]

        if (parts.length > 3 && secondLevelDomains.includes(thirdLevelDomain)) {
          // For domains like sub.example.co.uk
          domain = parts.slice(-3).join('.')
        } else {
          // For domains like sub.example.com
          domain = parts.slice(-2).join('.')
        }
      }

      debugLog('Extracted domain:', domain)
      return domain
    } catch (error) {
      debugLog('Error extracting domain:', error)
      return window.location.hostname // Fallback to full hostname
    }
  }

  /**
   * Get localized menu text based on user's language
   * @param {Object} repo - Repository information
   * @param {string} lang - Language code
   * @returns {string} Localized menu text
   */
  function getLocalizedMenuText(repo, lang) {
    // Get template for user's language or fallback to English
    const template = I18N.menuTemplate[lang] || I18N.menuTemplate['en']

    // Replace placeholders with actual values
    return template.replace('{icon}', repo.icon).replace('{name}', repo.name)
  }

  /**
   * Register menu commands for each repository
   * @param {string} domain - The extracted domain
   */
  function registerMenuCommands(domain) {
    // Detect user's language
    const userLang = detectLanguage()
    debugLog('Detected user language:', userLang)

    CONFIG.REPOSITORIES.forEach((repo) => {
      const url = repo.url.replace('{domain}', domain)
      const menuText = getLocalizedMenuText(repo, userLang)

      GM_registerMenuCommand(menuText, () => {
        debugLog(`Opening ${repo.name} for domain:`, domain)
        GM_openInTab(url, { active: true, insert: true })
      })
    })
  }

  /**
   * Initialize the script
   */
  function initialize() {
    const domain = extractDomain()
    registerMenuCommands(domain)
    debugLog('Script initialized for domain:', domain)
  }

  // Initialize the script
  initialize()
})()
