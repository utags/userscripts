import styleText from 'css:./style.css'
import {
  registerMenu,
  openInTab,
  getValue,
  setValue,
  addStyle,
} from '../../common/gm'

type RepoConfig = {
  id: string
  name: string
  icon: string
  domainSearchUrl?: string
  domainSearchEnabled?: boolean
  keywordSearchUrl?: string
  keywordSearchEnabled?: boolean
}

type Config = {
  REPOSITORIES: RepoConfig[]
  DEBUG: boolean
  SETTINGS_KEY: string
}

type TemplateMap = Record<string, string>

// Configuration constants
const CONFIG: Config = {
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
    {
      id: 'sleazy_fork',
      name: 'Sleazy Fork',
      domainSearchUrl:
        'https://sleazyfork.org/scripts/by-site/{domain}?filter_locale=0',
      domainSearchEnabled: false,
      keywordSearchUrl:
        'https://sleazyfork.org/scripts?filter_locale=0&q={keyword}',
      keywordSearchEnabled: false,
      icon: '🔞',
    },
  ],
  DEBUG: false, // Set to true for debug logging
  SETTINGS_KEY: 'find_scripts_settings', // Key for storing settings
}

const I18N: {
  menuTemplate: TemplateMap
  keywordSearchTemplate: TemplateMap
} = {
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
function detectLanguage(): string {
  try {
    // Get browser language
    const browserLang = (
      navigator.language ||
      ((navigator as any).userLanguage as string) ||
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
function debugLog(message: string, data: unknown = null): void {
  if (CONFIG.DEBUG) {
    console.log(`[Find Scripts] ${message}`, data || '')
  }
}

/**
 * Extract the top-level domain from the current URL
 * @returns {string} The top-level domain
 */
function extractDomain(): string {
  try {
    const hostname = globalThis.location.hostname
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

      domain =
        parts.length > 3 && secondLevelDomains.includes(thirdLevelDomain)
          ? parts.slice(-3).join('.')
          : parts.slice(-2).join('.')
    }

    debugLog('Extracted domain:', domain)
    return domain
  } catch (error) {
    debugLog('Error extracting domain:', error)
    return globalThis.location.hostname // Fallback to full hostname
  }
}

/**
 * Get localized menu text based on user's language
 * @param {Object} repo - Repository information
 * @param {string} lang - Language code
 * @param {boolean} isKeywordSearch - Whether this is for keyword search
 * @returns {string} Localized menu text
 */
function getLocalizedMenuText(
  repo: RepoConfig,
  lang: string,
  isKeywordSearch = false
): string {
  // Get template for user's language or fallback to English
  const templateKey = isKeywordSearch ? 'keywordSearchTemplate' : 'menuTemplate'
  const template = I18N[templateKey][lang] || I18N[templateKey].en

  // Replace placeholders with actual values
  return template.replace('{icon}', repo.icon).replace('{name}', repo.name)
}

/**
 * Register menu commands for each repository
 * @param {string} domain - The extracted domain
 */
function registerMenuCommands(domain: string): void {
  // Detect user's language
  const userLang = detectLanguage()
  debugLog('Detected user language:', userLang)

  for (const repo of CONFIG.REPOSITORIES) {
    // Register domain search menu if domainSearchUrl is defined and enabled
    if (repo.domainSearchUrl && repo.domainSearchEnabled) {
      const url = repo.domainSearchUrl.replace('{domain}', domain)
      const menuText = getLocalizedMenuText(repo, userLang)
      registerMenu(menuText, () => {
        debugLog(`Opening ${repo.name} for domain:`, domain)
        openInTab(url, { active: true, insert: true })
      })
    }

    // Register keyword search menu if keywordSearchUrl is defined and enabled
    if (repo.keywordSearchUrl && repo.keywordSearchEnabled) {
      const keywordUrl = repo.keywordSearchUrl.replace('{keyword}', domain)
      const keywordMenuText = getLocalizedMenuText(repo, userLang, true)
      registerMenu(keywordMenuText, () => {
        debugLog(`Opening ${repo.name} for keyword search:`, domain)
        openInTab(keywordUrl, { active: true, insert: true })
      })
    }
  }
}

/**
 * Load settings from GM storage
 */
async function loadSettings(): Promise<void> {
  try {
    const savedSettings = await getValue<Record<string, boolean>>(
      CONFIG.SETTINGS_KEY
    )
    if (savedSettings) {
      // Update repository enabled states
      for (const repo of CONFIG.REPOSITORIES) {
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
      }

      debugLog('Settings loaded:', savedSettings)
    }
  } catch (error) {
    debugLog('Error loading settings:', error)
  }
}

/**
 * Save settings to GM storage
 */
async function saveSettings(): Promise<void> {
  try {
    const settings: Record<string, boolean> = {}
    for (const repo of CONFIG.REPOSITORIES) {
      // Save domain search settings
      if (repo.domainSearchUrl) {
        settings[`domain_${repo.id}`] = repo.domainSearchEnabled ?? false
      }

      // Save keyword search settings
      if (repo.keywordSearchUrl) {
        settings[`keyword_${repo.id}`] = repo.keywordSearchEnabled ?? false
      }
    }

    await setValue(CONFIG.SETTINGS_KEY, settings)

    debugLog('Settings saved:', settings)
  } catch (error) {
    debugLog('Error saving settings:', error)
  }
}

/**
 * Create and show settings dialog
 */
function showSettingsDialog(): void {
  // Add CSS for the settings dialog
  addStyle(styleText)

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

  const titleEl = document.createElement('h2')
  titleEl.textContent = titles[userLang] || titles.en
  const content = document.createElement('div')
  content.id = 'find-scripts-settings-content'
  const note = document.createElement('div')
  note.className = 'find-scripts-refresh-note'
  note.style.marginTop = '15px'
  note.style.color = '#e74c3c'
  note.style.fontSize = '0.9em'
  note.textContent = refreshNoteText[userLang] || refreshNoteText.en
  const btns = document.createElement('div')
  btns.className = 'find-scripts-buttons'
  const cancelBtn = document.createElement('button')
  cancelBtn.id = 'find-scripts-cancel'
  cancelBtn.textContent = cancelButtonText[userLang] || cancelButtonText.en
  const saveBtn = document.createElement('button')
  saveBtn.id = 'find-scripts-save'
  saveBtn.className = 'primary'
  saveBtn.textContent = saveButtonText[userLang] || saveButtonText.en
  btns.append(cancelBtn, saveBtn)
  dialog.append(titleEl, content, note, btns)

  // Add repository options
  const contentWrap = dialog.querySelector('#find-scripts-settings-content')!

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
  const domainTitle = document.createElement('h3')
  domainTitle.textContent = domainSearchTitle[userLang] || domainSearchTitle.en
  domainSection.append(domainTitle)
  contentWrap.append(domainSection)

  // Add domain search options
  for (const repo of CONFIG.REPOSITORIES) {
    if (repo.domainSearchUrl) {
      const item = document.createElement('div')
      item.className = 'find-scripts-setting-item'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = `find-scripts-domain-${repo.id}`
      checkbox.checked = repo.domainSearchEnabled ?? false

      const label = document.createElement('label')
      label.htmlFor = `find-scripts-domain-${repo.id}`
      label.textContent = `${repo.icon} ${repo.name}`

      item.append(checkbox)
      item.append(label)
      domainSection.append(item)
    }
  }

  // Create keyword search section
  const keywordSection = document.createElement('div')
  const keywordTitle = document.createElement('h3')
  keywordTitle.textContent =
    keywordSearchTitle[userLang] || keywordSearchTitle.en
  keywordSection.append(keywordTitle)
  contentWrap.append(keywordSection)

  // Add keyword search options
  for (const repo of CONFIG.REPOSITORIES) {
    if (repo.keywordSearchUrl) {
      const item = document.createElement('div')
      item.className = 'find-scripts-setting-item'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = `find-scripts-keyword-${repo.id}`
      checkbox.checked = repo.keywordSearchEnabled ?? false

      const label = document.createElement('label')
      label.htmlFor = `find-scripts-keyword-${repo.id}`
      label.textContent = `${repo.icon} ${repo.name}`

      item.append(checkbox)
      item.append(label)
      keywordSection.append(item)
    }
  }

  // Add dialog to page
  overlay.append(dialog)
  document.body.append(overlay)

  // Handle save button click
  saveBtn.addEventListener('click', () => {
    // Update repository enabled states
    for (const repo of CONFIG.REPOSITORIES) {
      // Update domain search enabled state
      if (repo.domainSearchUrl) {
        const domainCheckbox = document.querySelector<HTMLInputElement>(
          `#find-scripts-domain-${repo.id}`
        )!
        repo.domainSearchEnabled = Boolean(domainCheckbox.checked)
      }

      // Update keyword search enabled state
      if (repo.keywordSearchUrl) {
        const keywordCheckbox = document.querySelector<HTMLInputElement>(
          `#find-scripts-keyword-${repo.id}`
        )!
        repo.keywordSearchEnabled = Boolean(keywordCheckbox.checked)
      }
    }

    // Save settings
    void saveSettings()

    // Refresh menu commands
    const domain = extractDomain()
    registerMenuCommands(domain)

    // Close dialog
    overlay.remove()
  })

  // Handle cancel button click
  cancelBtn.addEventListener('click', () => {
    overlay.remove()
  })

  // Close when clicking outside the dialog
  overlay.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target === overlay) overlay.remove()
  })
}

/**
 * Register settings menu command
 */
function registerSettingsMenu(): void {
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
  registerMenu(menuText, showSettingsDialog)
}

/**
 * Initialize the script
 */
async function initialize(): Promise<void> {
  // Load saved settings
  await loadSettings()

  // Register menu commands
  const domain = extractDomain()
  registerMenuCommands(domain)
  registerSettingsMenu()

  debugLog('Script initialized for domain:', domain)
}

// Initialize the script
// eslint-disable-next-line unicorn/prefer-top-level-await
void initialize()
