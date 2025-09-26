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
// @version              0.2.0
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
// @noframes
// @grant                GM_registerMenuCommand
// @grant                GM_openInTab
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_addStyle
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration constants
  const CONFIG = {
    REPOSITORIES: [
      {
        id: 'greasy_fork',
        name: 'Greasy Fork',
        domainSearchUrl:
          'https://greasyfork.org/scripts/by-site/{domain}?filter_locale=0',
        domainSearchEnabled: true,
        keywordSearchUrl:
          'https://greasyfork.org/scripts?filter_locale=0&q={keyword}',
        keywordSearchEnabled: true,
        icon: '🍴',
      },
      {
        id: 'openuserjs',
        name: 'OpenUserJS',
        keywordSearchUrl: 'https://openuserjs.org/?q={keyword}',
        keywordSearchEnabled: true,
        icon: '📜',
      },
      {
        id: 'scriptcat',
        name: 'ScriptCat',
        domainSearchUrl: 'https://scriptcat.org/search?domain={domain}',
        domainSearchEnabled: true,
        keywordSearchUrl: 'https://scriptcat.org/search?keyword={keyword}',
        keywordSearchEnabled: true,
        icon: '🐱',
      },
      {
        id: 'github',
        name: 'GitHub',
        keywordSearchUrl:
          'https://github.com/search?type=code&q=language%3AJavaScript+%22%3D%3DUserScript%3D%3D%22+{keyword}',
        keywordSearchEnabled: true,
        icon: '🐙',
      },
      {
        id: 'github_gist',
        name: 'GitHub Gist',
        keywordSearchUrl:
          'https://gist.github.com/search?l=JavaScript&q=%22%3D%3DUserScript%3D%3D%22+{keyword}',
        keywordSearchEnabled: true,
        icon: '📝',
      },
    ],
    DEBUG: false, // Set to true for debug logging
    SETTINGS_KEY: 'find_scripts_settings', // Key for storing settings
  }

  // Internationalization support
  const I18N = {
    // Menu text template for domain search: "{icon} Find scripts by domain on {name}"
    menuTemplate: {
      en: '{icon} Find scripts by domain on {name}',
      'zh-CN': '{icon} 在 {name} 上按域名查找脚本',
      'zh-TW': '{icon} 在 {name} 上按域名查找腳本',
      ja: '{icon} {name} でドメインからスクリプトを探す',
      ko: '{icon} {name}에서 도메인으로 스크립트 찾기',
      es: '{icon} Buscar scripts por dominio en {name}',
      fr: '{icon} Trouver des scripts par domaine sur {name}',
      de: '{icon} Skripte nach Domain auf {name} finden',
      ru: '{icon} Найти скрипты по домену на {name}',
    },
    // Menu text template for keyword search: "{icon} Find scripts by keyword on {name}"
    keywordSearchTemplate: {
      en: '{icon} Find scripts by keyword on {name}',
      'zh-CN': '{icon} 在 {name} 上按关键字查找脚本',
      'zh-TW': '{icon} 在 {name} 上按關鍵字查找腳本',
      ja: '{icon} {name} でキーワードからスクリプトを探す',
      ko: '{icon} {name}에서 키워드로 스크립트 찾기',
      es: '{icon} Buscar scripts por palabra clave en {name}',
      fr: '{icon} Trouver des scripts par mot-clé sur {name}',
      de: '{icon} Skripte nach Stichwort auf {name} finden',
      ru: '{icon} Найти скрипты по ключевому слову на {name}',
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
   * @param {boolean} isKeywordSearch - Whether this is for keyword search
   * @returns {string} Localized menu text
   */
  function getLocalizedMenuText(repo, lang, isKeywordSearch = false) {
    // Get template for user's language or fallback to English
    const templateKey = isKeywordSearch
      ? 'keywordSearchTemplate'
      : 'menuTemplate'
    const template = I18N[templateKey][lang] || I18N[templateKey]['en']

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
      // Register domain search menu if domainSearchUrl is defined and enabled
      if (repo.domainSearchUrl && repo.domainSearchEnabled) {
        const url = repo.domainSearchUrl.replace('{domain}', domain)
        const menuText = getLocalizedMenuText(repo, userLang)

        GM_registerMenuCommand(menuText, () => {
          debugLog(`Opening ${repo.name} for domain:`, domain)
          GM_openInTab(url, { active: true, insert: true })
        })
      }

      // Register keyword search menu if keywordSearchUrl is defined and enabled
      if (repo.keywordSearchUrl && repo.keywordSearchEnabled) {
        const keywordUrl = repo.keywordSearchUrl.replace('{keyword}', domain)
        const keywordMenuText = getLocalizedMenuText(repo, userLang, true)

        GM_registerMenuCommand(keywordMenuText, () => {
          debugLog(`Opening ${repo.name} for keyword search:`, domain)
          GM_openInTab(keywordUrl, { active: true, insert: true })
        })
      }
    })
  }

  /**
   * Load settings from GM storage
   */
  function loadSettings() {
    try {
      const savedSettings = GM_getValue(CONFIG.SETTINGS_KEY)
      if (savedSettings) {
        // Update repository enabled states
        CONFIG.REPOSITORIES.forEach((repo) => {
          // Load domain search settings
          if (
            repo.domainSearchUrl &&
            savedSettings[`domain_${repo.id}`] !== undefined
          ) {
            repo.domainSearchEnabled = savedSettings[`domain_${repo.id}`]
          }

          // Load keyword search settings
          if (
            repo.keywordSearchUrl &&
            savedSettings[`keyword_${repo.id}`] !== undefined
          ) {
            repo.keywordSearchEnabled = savedSettings[`keyword_${repo.id}`]
          }
        })
        debugLog('Settings loaded:', savedSettings)
      }
    } catch (error) {
      debugLog('Error loading settings:', error)
    }
  }

  /**
   * Save settings to GM storage
   */
  function saveSettings() {
    try {
      const settings = {}
      CONFIG.REPOSITORIES.forEach((repo) => {
        // Save domain search settings
        if (repo.domainSearchUrl) {
          settings[`domain_${repo.id}`] = repo.domainSearchEnabled
        }

        // Save keyword search settings
        if (repo.keywordSearchUrl) {
          settings[`keyword_${repo.id}`] = repo.keywordSearchEnabled
        }
      })
      GM_setValue(CONFIG.SETTINGS_KEY, settings)
      debugLog('Settings saved:', settings)
    } catch (error) {
      debugLog('Error saving settings:', error)
    }
  }

  /**
   * Create and show settings dialog
   */
  function showSettingsDialog() {
    // Add CSS for the settings dialog
    GM_addStyle(`
      #find-scripts-settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #find-scripts-settings-dialog {
        background: white;
        border-radius: 8px;
        padding: 20px;
        width: 400px;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
      #find-scripts-settings-dialog h2 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 18px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      .find-scripts-setting-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      .find-scripts-setting-item label {
        margin-left: 8px;
        flex-grow: 1;
      }
      .find-scripts-buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
        gap: 10px;
      }
      .find-scripts-buttons button {
        padding: 6px 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: #f5f5f5;
        cursor: pointer;
      }
      .find-scripts-buttons button:hover {
        background: #e5e5e5;
      }
      .find-scripts-buttons button.primary {
        background: #4a86e8;
        color: white;
        border-color: #3a76d8;
      }
      .find-scripts-buttons button.primary:hover {
        background: #3a76d8;
      }
    `)

    // Create overlay and dialog elements
    const overlay = document.createElement('div')
    overlay.id = 'find-scripts-settings-overlay'

    const dialog = document.createElement('div')
    dialog.id = 'find-scripts-settings-dialog'

    // Detect user's language
    const userLang = detectLanguage()

    // Set dialog title based on language
    const titles = {
      en: 'Repository Settings',
      'zh-CN': '仓库设置',
      'zh-TW': '倉庫設置',
      ja: 'リポジトリ設定',
      ko: '저장소 설정',
      es: 'Configuración de repositorios',
      fr: 'Paramètres des dépôts',
      de: 'Repository-Einstellungen',
      ru: 'Настройки репозиториев',
    }

    const saveButtonText = {
      en: 'Save',
      'zh-CN': '保存',
      'zh-TW': '保存',
      ja: '保存',
      ko: '저장',
      es: 'Guardar',
      fr: 'Enregistrer',
      de: 'Speichern',
      ru: 'Сохранить',
    }

    const cancelButtonText = {
      en: 'Cancel',
      'zh-CN': '取消',
      'zh-TW': '取消',
      ja: 'キャンセル',
      ko: '취소',
      es: 'Cancelar',
      fr: 'Annuler',
      de: 'Abbrechen',
      ru: 'Отмена',
    }

    // 添加刷新提示文本
    const refreshNoteText = {
      en: 'Note: Please refresh the page after saving for changes to take effect.',
      'zh-CN': '注意：保存后请刷新页面以使更改生效。',
      'zh-TW': '注意：保存後請刷新頁面以使更改生效。',
      ja: '注意：変更を有効にするには、保存後にページを更新してください。',
      ko: '참고: 변경 사항을 적용하려면 저장 후 페이지를 새로 고침하세요.',
      es: 'Nota: Por favor, actualice la página después de guardar para que los cambios surtan efecto.',
      fr: "Remarque : Veuillez actualiser la page après l'enregistrement pour que les modifications prennent effet.",
      de: 'Hinweis: Bitte aktualisieren Sie die Seite nach dem Speichern, damit die Änderungen wirksam werden.',
      ru: 'Примечание: Пожалуйста, обновите страницу после сохранения, чтобы изменения вступили в силу.',
    }

    // Set dialog content
    dialog.innerHTML = `
      <h2>${titles[userLang] || titles.en}</h2>
      <div id="find-scripts-settings-content"></div>
      <div class="find-scripts-refresh-note" style="margin-top: 15px; color: #e74c3c; font-size: 0.9em;">
        ${refreshNoteText[userLang] || refreshNoteText.en}
      </div>
      <div class="find-scripts-buttons">
        <button id="find-scripts-cancel">${cancelButtonText[userLang] || cancelButtonText.en}</button>
        <button id="find-scripts-save" class="primary">${saveButtonText[userLang] || saveButtonText.en}</button>
      </div>
    `

    // Add repository options
    const content = dialog.querySelector('#find-scripts-settings-content')

    // Add section titles based on language
    const domainSearchTitle = {
      en: 'Domain Search',
      'zh-CN': '域名搜索',
      'zh-TW': '域名搜索',
      ja: 'ドメイン検索',
      ko: '도메인 검색',
      es: 'Búsqueda por dominio',
      fr: 'Recherche par domaine',
      de: 'Domain-Suche',
      ru: 'Поиск по домену',
    }

    const keywordSearchTitle = {
      en: 'Keyword Search',
      'zh-CN': '关键字搜索',
      'zh-TW': '關鍵字搜索',
      ja: 'キーワード検索',
      ko: '키워드 검색',
      es: 'Búsqueda por palabra clave',
      fr: 'Recherche par mot-clé',
      de: 'Stichwortsuche',
      ru: 'Поиск по ключевому слову',
    }

    // Create domain search section
    const domainSection = document.createElement('div')
    domainSection.innerHTML = `<h3>${domainSearchTitle[userLang] || domainSearchTitle.en}</h3>`
    content.appendChild(domainSection)

    // Add domain search options
    CONFIG.REPOSITORIES.forEach((repo) => {
      if (repo.domainSearchUrl) {
        const item = document.createElement('div')
        item.className = 'find-scripts-setting-item'

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = `find-scripts-domain-${repo.id}`
        checkbox.checked = repo.domainSearchEnabled

        const label = document.createElement('label')
        label.htmlFor = `find-scripts-domain-${repo.id}`
        label.textContent = `${repo.icon} ${repo.name}`

        item.appendChild(checkbox)
        item.appendChild(label)
        domainSection.appendChild(item)
      }
    })

    // Create keyword search section
    const keywordSection = document.createElement('div')
    keywordSection.innerHTML = `<h3>${keywordSearchTitle[userLang] || keywordSearchTitle.en}</h3>`
    content.appendChild(keywordSection)

    // Add keyword search options
    CONFIG.REPOSITORIES.forEach((repo) => {
      if (repo.keywordSearchUrl) {
        const item = document.createElement('div')
        item.className = 'find-scripts-setting-item'

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = `find-scripts-keyword-${repo.id}`
        checkbox.checked = repo.keywordSearchEnabled

        const label = document.createElement('label')
        label.htmlFor = `find-scripts-keyword-${repo.id}`
        label.textContent = `${repo.icon} ${repo.name}`

        item.appendChild(checkbox)
        item.appendChild(label)
        keywordSection.appendChild(item)
      }
    })

    // Add dialog to page
    overlay.appendChild(dialog)
    document.body.appendChild(overlay)

    // Handle save button click
    document
      .getElementById('find-scripts-save')
      .addEventListener('click', () => {
        // Update repository enabled states
        CONFIG.REPOSITORIES.forEach((repo) => {
          // Update domain search enabled state
          if (repo.domainSearchUrl) {
            const domainCheckbox = document.getElementById(
              `find-scripts-domain-${repo.id}`
            )
            if (domainCheckbox) {
              repo.domainSearchEnabled = domainCheckbox.checked
            }
          }

          // Update keyword search enabled state
          if (repo.keywordSearchUrl) {
            const keywordCheckbox = document.getElementById(
              `find-scripts-keyword-${repo.id}`
            )
            if (keywordCheckbox) {
              repo.keywordSearchEnabled = keywordCheckbox.checked
            }
          }
        })

        // Save settings
        saveSettings()

        // Refresh menu commands
        const domain = extractDomain()
        registerMenuCommands(domain)

        // Close dialog
        document.body.removeChild(overlay)
      })

    // Handle cancel button click
    document
      .getElementById('find-scripts-cancel')
      .addEventListener('click', () => {
        document.body.removeChild(overlay)
      })

    // Close when clicking outside the dialog
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        document.body.removeChild(overlay)
      }
    })
  }

  /**
   * Register settings menu command
   */
  function registerSettingsMenu() {
    const settingsText = {
      en: '⚙️ Settings',
      'zh-CN': '⚙️ 设置',
      'zh-TW': '⚙️ 設置',
      ja: '⚙️ 設定',
      ko: '⚙️ 설정',
      es: '⚙️ Configuración',
      fr: '⚙️ Paramètres',
      de: '⚙️ Einstellungen',
      ru: '⚙️ Настройки',
    }

    const userLang = detectLanguage()
    const menuText = settingsText[userLang] || settingsText.en

    GM_registerMenuCommand(menuText, showSettingsDialog)
  }

  /**
   * Initialize the script
   */
  function initialize() {
    // Load saved settings
    loadSettings()

    // Register menu commands
    const domain = extractDomain()
    registerMenuCommands(domain)
    registerSettingsMenu()

    debugLog('Script initialized for domain:', domain)
  }

  // Initialize the script
  initialize()
})()
