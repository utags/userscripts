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
// @version              0.2.3
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
// @icon                 data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%3E%3Ctext%20x%3D%2232%22%20y%3D%2232%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Menlo%2C%20Monaco%2C%20Consolas%2C%20Courier%20New%2C%20monospace%22%20font-size%3D%2242%22%20font-weight%3D%22700%22%20fill%3D%22%231f2937%22%3E%7B%7D%3C/text%3E%3C/svg%3E
// @noframes
// @grant                GM_registerMenuCommand
// @grant                GM_openInTab
// @grant                GM.getValue
// @grant                GM_getValue
// @grant                GM.setValue
// @grant                GM_setValue
// @grant                GM_addStyle
// ==/UserScript==
//
;(() => {
  'use strict'
  var __defProp = Object.defineProperty
  var __getOwnPropSymbols = Object.getOwnPropertySymbols
  var __hasOwnProp = Object.prototype.hasOwnProperty
  var __propIsEnum = Object.prototype.propertyIsEnumerable
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value)
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop])
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop])
      }
    return a
  }
  var style_default =
    '#find-scripts-settings-overlay{align-items:center;background:rgba(0,0,0,.5);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;width:100%;z-index:9999}#find-scripts-settings-dialog{background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.2);max-height:90%;max-width:90%;overflow-y:auto;padding:20px;width:400px}#find-scripts-settings-dialog h2{border-bottom:1px solid #eee;font-size:18px;margin-bottom:15px;margin-top:0;padding-bottom:10px}.find-scripts-setting-item{align-items:center;display:flex;margin-bottom:12px}.find-scripts-setting-item label{flex-grow:1;margin-left:8px}.find-scripts-buttons{display:flex;gap:10px;justify-content:flex-end;margin-top:15px}.find-scripts-buttons button{background:#f5f5f5;border:1px solid #ccc;border-radius:4px;cursor:pointer;padding:6px 12px}.find-scripts-buttons button:hover{background:#e5e5e5}.find-scripts-buttons button.primary{background:#4a86e8;border-color:#3a76d8;color:#fff}.find-scripts-buttons button.primary:hover{background:#3a76d8}'
  function registerMenu(caption, onClick) {
    if (typeof GM_registerMenuCommand === 'function') {
      return GM_registerMenuCommand(caption, onClick)
    }
    return 0
  }
  function openInTab(url, options) {
    if (typeof GM_openInTab === 'function') {
      GM_openInTab(url, options)
      return
    }
    globalThis.open(url, '_blank')
  }
  async function getValue(key, defaultValue) {
    if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
      return GM.getValue(key, defaultValue)
    }
    if (typeof GM_getValue === 'function') {
      return GM_getValue(key, defaultValue)
    }
    return defaultValue
  }
  async function setValue(key, value) {
    if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
      await GM.setValue(key, value)
      return
    }
    if (typeof GM_setValue === 'function') {
      GM_setValue(key, value)
    }
  }
  function addStyle(css) {
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css)
      return
    }
    const style = document.createElement('style')
    style.textContent = css
    document.head.append(style)
  }
  var CONFIG = {
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
        icon: '\u{1F374}',
      },
      {
        id: 'openuserjs',
        name: 'OpenUserJS',
        keywordSearchUrl: 'https://openuserjs.org/?q={keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F4DC}',
      },
      {
        id: 'scriptcat',
        name: 'ScriptCat',
        domainSearchUrl: 'https://scriptcat.org/search?domain={domain}',
        domainSearchEnabled: true,
        keywordSearchUrl: 'https://scriptcat.org/search?keyword={keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F431}',
      },
      {
        id: 'github',
        name: 'GitHub',
        keywordSearchUrl:
          'https://github.com/search?type=code&q=language%3AJavaScript+%22%3D%3DUserScript%3D%3D%22+{keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F419}',
      },
      {
        id: 'github_gist',
        name: 'GitHub Gist',
        keywordSearchUrl:
          'https://gist.github.com/search?l=JavaScript&q=%22%3D%3DUserScript%3D%3D%22+{keyword}',
        keywordSearchEnabled: true,
        icon: '\u{1F4DD}',
      },
      {
        id: 'sleazy_fork',
        name: 'Sleazy Fork',
        domainSearchUrl:
          'https://sleazyfork.org/scripts/by-site/{domain}?filter_locale=0',
        domainSearchEnabled: false,
        keywordSearchUrl:
          'https://sleazyfork.org/scripts?filter_locale=0&q={keyword}',
        keywordSearchEnabled: false,
        icon: '\u{1F51E}',
      },
    ],
    DEBUG: false,
    SETTINGS_KEY: 'find_scripts_settings',
  }
  var I18N = {
    en: {
      menu_domain: '{icon} Find scripts by domain on {name}',
      menu_keyword: '{icon} Find scripts by keyword on {name}',
      title_settings: 'Repository Settings',
      btn_save: 'Save',
      btn_cancel: 'Cancel',
      note_refresh:
        'Note: Please refresh the page after saving for changes to take effect.',
      title_domain: 'Domain Search',
      title_keyword: 'Keyword Search',
      menu_settings: '\u2699\uFE0F Settings',
    },
    'zh-CN': {
      menu_domain:
        '{icon} \u5728 {name} \u4E0A\u6309\u57DF\u540D\u67E5\u627E\u811A\u672C',
      menu_keyword:
        '{icon} \u5728 {name} \u4E0A\u6309\u5173\u952E\u5B57\u67E5\u627E\u811A\u672C',
      title_settings: '\u4ED3\u5E93\u8BBE\u7F6E',
      btn_save: '\u4FDD\u5B58',
      btn_cancel: '\u53D6\u6D88',
      note_refresh:
        '\u6CE8\u610F\uFF1A\u4FDD\u5B58\u540E\u8BF7\u5237\u65B0\u9875\u9762\u4EE5\u4F7F\u66F4\u6539\u751F\u6548\u3002',
      title_domain: '\u57DF\u540D\u641C\u7D22',
      title_keyword: '\u5173\u952E\u5B57\u641C\u7D22',
      menu_settings: '\u2699\uFE0F \u8BBE\u7F6E',
    },
    'zh-TW': {
      menu_domain:
        '{icon} \u5728 {name} \u4E0A\u6309\u57DF\u540D\u67E5\u627E\u8173\u672C',
      menu_keyword:
        '{icon} \u5728 {name} \u4E0A\u6309\u95DC\u9375\u5B57\u67E5\u627E\u8173\u672C',
      title_settings: '\u5009\u5EAB\u8A2D\u7F6E',
      btn_save: '\u4FDD\u5B58',
      btn_cancel: '\u53D6\u6D88',
      note_refresh:
        '\u6CE8\u610F\uFF1A\u4FDD\u5B58\u5F8C\u8ACB\u5237\u65B0\u9801\u9762\u4EE5\u4F7F\u66F4\u6539\u751F\u6548\u3002',
      title_domain: '\u57DF\u540D\u641C\u7D22',
      title_keyword: '\u95DC\u9375\u5B57\u641C\u7D22',
      menu_settings: '\u2699\uFE0F \u8A2D\u7F6E',
    },
    ja: {
      menu_domain:
        '{icon} {name} \u3067\u30C9\u30E1\u30A4\u30F3\u304B\u3089\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u63A2\u3059',
      menu_keyword:
        '{icon} {name} \u3067\u30AD\u30FC\u30EF\u30FC\u30C9\u304B\u3089\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u63A2\u3059',
      title_settings: '\u30EA\u30DD\u30B8\u30C8\u30EA\u8A2D\u5B9A',
      btn_save: '\u4FDD\u5B58',
      btn_cancel: '\u30AD\u30E3\u30F3\u30BB\u30EB',
      note_refresh:
        '\u6CE8\u610F\uFF1A\u5909\u66F4\u3092\u6709\u52B9\u306B\u3059\u308B\u306B\u306F\u3001\u4FDD\u5B58\u5F8C\u306B\u30DA\u30FC\u30B8\u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002',
      title_domain: '\u30C9\u30E1\u30A4\u30F3\u691C\u7D22',
      title_keyword: '\u30AD\u30FC\u30EF\u30FC\u30C9\u691C\u7D22',
      menu_settings: '\u2699\uFE0F \u8A2D\u5B9A',
    },
    ko: {
      menu_domain:
        '{icon} {name}\uC5D0\uC11C \uB3C4\uBA54\uC778\uC73C\uB85C \uC2A4\uD06C\uB9BD\uD2B8 \uCC3E\uAE30',
      menu_keyword:
        '{icon} {name}\uC5D0\uC11C \uD0A4\uC6CC\uB4DC\uB85C \uC2A4\uD06C\uB9BD\uD2B8 \uCC3E\uAE30',
      title_settings: '\uC800\uC7A5\uC18C \uC124\uC815',
      btn_save: '\uC800\uC7A5',
      btn_cancel: '\uCDE8\uC18C',
      note_refresh:
        '\uCC38\uACE0: \uBCC0\uACBD \uC0AC\uD56D\uC744 \uC801\uC6A9\uD558\uB824\uBA74 \uC800\uC7A5 \uD6C4 \uD398\uC774\uC9C0\uB97C \uC0C8\uB85C \uACE0\uCE68\uD558\uC138\uC694.',
      title_domain: '\uB3C4\uBA54\uC778 \uAC80\uC0C9',
      title_keyword: '\uD0A4\uC6CC\uB4DC \uAC80\uC0C9',
      menu_settings: '\u2699\uFE0F \uC124\uC815',
    },
    es: {
      menu_domain: '{icon} Buscar scripts por dominio en {name}',
      menu_keyword: '{icon} Buscar scripts por palabra clave en {name}',
      title_settings: 'Configuraci\xF3n de repositorios',
      btn_save: 'Guardar',
      btn_cancel: 'Cancelar',
      note_refresh:
        'Nota: Por favor, actualice la p\xE1gina despu\xE9s de guardar para que los cambios surtan efecto.',
      title_domain: 'B\xFAsqueda por dominio',
      title_keyword: 'B\xFAsqueda por palabra clave',
      menu_settings: '\u2699\uFE0F Configuraci\xF3n',
    },
    fr: {
      menu_domain: '{icon} Trouver des scripts par domaine sur {name}',
      menu_keyword: '{icon} Trouver des scripts par mot-cl\xE9 sur {name}',
      title_settings: 'Param\xE8tres des d\xE9p\xF4ts',
      btn_save: 'Enregistrer',
      btn_cancel: 'Annuler',
      note_refresh:
        "Remarque : Veuillez actualiser la page apr\xE8s l'enregistrement pour que les modifications prennent effet.",
      title_domain: 'Recherche par domaine',
      title_keyword: 'Recherche par mot-cl\xE9',
      menu_settings: '\u2699\uFE0F Param\xE8tres',
    },
    de: {
      menu_domain: '{icon} Skripte nach Domain auf {name} finden',
      menu_keyword: '{icon} Skripte nach Stichwort auf {name} finden',
      title_settings: 'Repository-Einstellungen',
      btn_save: 'Speichern',
      btn_cancel: 'Abbrechen',
      note_refresh:
        'Hinweis: Bitte aktualisieren Sie die Seite nach dem Speichern, damit die \xC4nderungen wirksam werden.',
      title_domain: 'Domain-Suche',
      title_keyword: 'Stichwortsuche',
      menu_settings: '\u2699\uFE0F Einstellungen',
    },
    ru: {
      menu_domain:
        '{icon} \u041D\u0430\u0439\u0442\u0438 \u0441\u043A\u0440\u0438\u043F\u0442\u044B \u043F\u043E \u0434\u043E\u043C\u0435\u043D\u0443 \u043D\u0430 {name}',
      menu_keyword:
        '{icon} \u041D\u0430\u0439\u0442\u0438 \u0441\u043A\u0440\u0438\u043F\u0442\u044B \u043F\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u043C\u0443 \u0441\u043B\u043E\u0432\u0443 \u043D\u0430 {name}',
      title_settings:
        '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0435\u0432',
      btn_save: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C',
      btn_cancel: '\u041E\u0442\u043C\u0435\u043D\u0430',
      note_refresh:
        '\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435: \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043F\u043E\u0441\u043B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F, \u0447\u0442\u043E\u0431\u044B \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432\u0441\u0442\u0443\u043F\u0438\u043B\u0438 \u0432 \u0441\u0438\u043B\u0443.',
      title_domain:
        '\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0434\u043E\u043C\u0435\u043D\u0443',
      title_keyword:
        '\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u043C\u0443 \u0441\u043B\u043E\u0432\u0443',
      menu_settings:
        '\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
    },
  }
  var USER_LANG = detectLanguage()
  var LANG_MAP =
    USER_LANG === 'en'
      ? I18N.en
      : __spreadValues(__spreadValues({}, I18N.en), I18N[USER_LANG])
  function t(key) {
    return LANG_MAP[key]
  }
  function detectLanguage() {
    try {
      const browserLang = (
        navigator.language ||
        navigator.userLanguage ||
        'en'
      ).toLowerCase()
      const supportedLangs = Object.keys(I18N)
      if (supportedLangs.includes(browserLang)) {
        return browserLang
      }
      const langBase = browserLang.split('-')[0]
      const matchingLang = supportedLangs.find((lang) =>
        lang.startsWith(langBase + '-')
      )
      if (matchingLang) {
        return matchingLang
      }
      return 'en'
    } catch (error) {
      debugLog('Error detecting language:', error)
      return 'en'
    }
  }
  function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log('[Find Scripts] '.concat(message), data || '')
    }
  }
  function extractDomain() {
    try {
      const hostname = globalThis.location.hostname
      let domain = hostname.replace(/^www\./, '')
      const parts = domain.split('.')
      if (parts.length > 2) {
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
        domain =
          parts.length > 3 && secondLevelDomains.includes(thirdLevelDomain)
            ? parts.slice(-3).join('.')
            : parts.slice(-2).join('.')
      }
      debugLog('Extracted domain:', domain)
      return domain
    } catch (error) {
      debugLog('Error extracting domain:', error)
      return globalThis.location.hostname
    }
  }
  function getLocalizedMenuText(repo, isKeywordSearch = false) {
    const key = isKeywordSearch ? 'menu_keyword' : 'menu_domain'
    const template = t(key)
    return template.replace('{icon}', repo.icon).replace('{name}', repo.name)
  }
  function registerMenuCommands(domain) {
    for (const repo of CONFIG.REPOSITORIES) {
      if (repo.domainSearchUrl && repo.domainSearchEnabled) {
        const url = repo.domainSearchUrl.replace('{domain}', domain)
        const menuText = getLocalizedMenuText(repo)
        registerMenu(menuText, () => {
          debugLog('Opening '.concat(repo.name, ' for domain:'), domain)
          openInTab(url, { active: true, insert: true })
        })
      }
      if (repo.keywordSearchUrl && repo.keywordSearchEnabled) {
        const keywordUrl = repo.keywordSearchUrl.replace('{keyword}', domain)
        const keywordMenuText = getLocalizedMenuText(repo, true)
        registerMenu(keywordMenuText, () => {
          debugLog('Opening '.concat(repo.name, ' for keyword search:'), domain)
          openInTab(keywordUrl, { active: true, insert: true })
        })
      }
    }
  }
  async function loadSettings() {
    try {
      const savedSettings = await getValue(CONFIG.SETTINGS_KEY)
      if (savedSettings) {
        for (const repo of CONFIG.REPOSITORIES) {
          if (
            repo.domainSearchUrl &&
            savedSettings['domain_'.concat(repo.id)] !== void 0
          ) {
            repo.domainSearchEnabled = savedSettings['domain_'.concat(repo.id)]
          }
          if (
            repo.keywordSearchUrl &&
            savedSettings['keyword_'.concat(repo.id)] !== void 0
          ) {
            repo.keywordSearchEnabled =
              savedSettings['keyword_'.concat(repo.id)]
          }
        }
        debugLog('Settings loaded:', savedSettings)
      }
    } catch (error) {
      debugLog('Error loading settings:', error)
    }
  }
  async function saveSettings() {
    var _a, _b
    try {
      const settings = {}
      for (const repo of CONFIG.REPOSITORIES) {
        if (repo.domainSearchUrl) {
          settings['domain_'.concat(repo.id)] =
            (_a = repo.domainSearchEnabled) != null ? _a : false
        }
        if (repo.keywordSearchUrl) {
          settings['keyword_'.concat(repo.id)] =
            (_b = repo.keywordSearchEnabled) != null ? _b : false
        }
      }
      await setValue(CONFIG.SETTINGS_KEY, settings)
      debugLog('Settings saved:', settings)
    } catch (error) {
      debugLog('Error saving settings:', error)
    }
  }
  function showSettingsDialog() {
    var _a, _b
    addStyle(style_default)
    const overlay = document.createElement('div')
    overlay.id = 'find-scripts-settings-overlay'
    const dialog = document.createElement('div')
    dialog.id = 'find-scripts-settings-dialog'
    const titleEl = document.createElement('h2')
    titleEl.textContent = t('title_settings')
    const content = document.createElement('div')
    content.id = 'find-scripts-settings-content'
    const note = document.createElement('div')
    note.className = 'find-scripts-refresh-note'
    note.style.marginTop = '15px'
    note.style.color = '#e74c3c'
    note.style.fontSize = '0.9em'
    note.textContent = t('note_refresh')
    const btns = document.createElement('div')
    btns.className = 'find-scripts-buttons'
    const cancelBtn = document.createElement('button')
    cancelBtn.id = 'find-scripts-cancel'
    cancelBtn.textContent = t('btn_cancel')
    const saveBtn = document.createElement('button')
    saveBtn.id = 'find-scripts-save'
    saveBtn.className = 'primary'
    saveBtn.textContent = t('btn_save')
    btns.append(cancelBtn, saveBtn)
    dialog.append(titleEl, content, note, btns)
    const contentWrap = dialog.querySelector('#find-scripts-settings-content')
    const domainSection = document.createElement('div')
    const domainTitle = document.createElement('h3')
    domainTitle.textContent = t('title_domain')
    domainSection.append(domainTitle)
    contentWrap.append(domainSection)
    for (const repo of CONFIG.REPOSITORIES) {
      if (repo.domainSearchUrl) {
        const item = document.createElement('div')
        item.className = 'find-scripts-setting-item'
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = 'find-scripts-domain-'.concat(repo.id)
        checkbox.checked = (_a = repo.domainSearchEnabled) != null ? _a : false
        const label = document.createElement('label')
        label.htmlFor = 'find-scripts-domain-'.concat(repo.id)
        label.textContent = ''.concat(repo.icon, ' ').concat(repo.name)
        item.append(checkbox)
        item.append(label)
        domainSection.append(item)
      }
    }
    const keywordSection = document.createElement('div')
    const keywordTitle = document.createElement('h3')
    keywordTitle.textContent = t('title_keyword')
    keywordSection.append(keywordTitle)
    contentWrap.append(keywordSection)
    for (const repo of CONFIG.REPOSITORIES) {
      if (repo.keywordSearchUrl) {
        const item = document.createElement('div')
        item.className = 'find-scripts-setting-item'
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = 'find-scripts-keyword-'.concat(repo.id)
        checkbox.checked = (_b = repo.keywordSearchEnabled) != null ? _b : false
        const label = document.createElement('label')
        label.htmlFor = 'find-scripts-keyword-'.concat(repo.id)
        label.textContent = ''.concat(repo.icon, ' ').concat(repo.name)
        item.append(checkbox)
        item.append(label)
        keywordSection.append(item)
      }
    }
    overlay.append(dialog)
    document.body.append(overlay)
    saveBtn.addEventListener('click', () => {
      for (const repo of CONFIG.REPOSITORIES) {
        if (repo.domainSearchUrl) {
          const domainCheckbox = document.querySelector(
            '#find-scripts-domain-'.concat(repo.id)
          )
          repo.domainSearchEnabled = Boolean(domainCheckbox.checked)
        }
        if (repo.keywordSearchUrl) {
          const keywordCheckbox = document.querySelector(
            '#find-scripts-keyword-'.concat(repo.id)
          )
          repo.keywordSearchEnabled = Boolean(keywordCheckbox.checked)
        }
      }
      void saveSettings()
      const domain = extractDomain()
      registerMenuCommands(domain)
      overlay.remove()
    })
    cancelBtn.addEventListener('click', () => {
      overlay.remove()
    })
    overlay.addEventListener('click', (event) => {
      const target = event.target
      if (target === overlay) overlay.remove()
    })
  }
  function registerSettingsMenu() {
    const menuText = t('menu_settings')
    registerMenu(menuText, showSettingsDialog)
  }
  async function initialize() {
    await loadSettings()
    const domain = extractDomain()
    registerMenuCommands(domain)
    registerSettingsMenu()
    debugLog('Script initialized for domain:', domain)
  }
  void initialize()
})()
