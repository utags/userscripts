import { registerMenu, unregisterMenu, openInTab } from '../../common/gm'
import {
  openSettingsPanel,
  createObjectSettingsStore,
  type Field,
  type PanelSchema,
} from '../../common/settings'

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

const I18N: Record<string, Record<string, string>> = {
  en: {
    menu_domain: '{icon} Find scripts by domain on {name}',
    menu_keyword: '{icon} Find scripts by keyword on {name}',
    title_settings: 'Repository Settings',
    btn_save: 'Save',
    btn_cancel: 'Cancel',
    title_domain: 'Domain Search',
    title_keyword: 'Keyword Search',
    menu_settings: '⚙️ Settings',
  },
  'zh-CN': {
    menu_domain: '{icon} 在 {name} 上按域名查找脚本',
    menu_keyword: '{icon} 在 {name} 上按关键字查找脚本',
    title_settings: '仓库设置',
    btn_save: '保存',
    btn_cancel: '取消',
    title_domain: '域名搜索',
    title_keyword: '关键字搜索',
    menu_settings: '⚙️ 设置',
  },
  'zh-TW': {
    menu_domain: '{icon} 在 {name} 上按域名查找腳本',
    menu_keyword: '{icon} 在 {name} 上按關鍵字查找腳本',
    title_settings: '倉庫設置',
    btn_save: '保存',
    btn_cancel: '取消',
    title_domain: '域名搜索',
    title_keyword: '關鍵字搜索',
    menu_settings: '⚙️ 設置',
  },
  ja: {
    menu_domain: '{icon} {name} でドメインからスクリプトを探す',
    menu_keyword: '{icon} {name} でキーワードからスクリプトを探す',
    title_settings: 'リポジトリ設定',
    btn_save: '保存',
    btn_cancel: 'キャンセル',
    title_domain: 'ドメイン検索',
    title_keyword: 'キーワード検索',
    menu_settings: '⚙️ 設定',
  },
  ko: {
    menu_domain: '{icon} {name}에서 도메인으로 스크립트 찾기',
    menu_keyword: '{icon} {name}에서 키워드로 스크립트 찾기',
    title_settings: '저장소 설정',
    btn_save: '저장',
    btn_cancel: '취소',
    title_domain: '도메인 검색',
    title_keyword: '키워드 검색',
    menu_settings: '⚙️ 설정',
  },
  es: {
    menu_domain: '{icon} Buscar scripts por dominio en {name}',
    menu_keyword: '{icon} Buscar scripts por palabra clave en {name}',
    title_settings: 'Configuración de repositorios',
    btn_save: 'Guardar',
    btn_cancel: 'Cancelar',
    title_domain: 'Búsqueda por dominio',
    title_keyword: 'Búsqueda por palabra clave',
    menu_settings: '⚙️ Configuración',
  },
  fr: {
    menu_domain: '{icon} Trouver des scripts par domaine sur {name}',
    menu_keyword: '{icon} Trouver des scripts par mot-clé sur {name}',
    title_settings: 'Paramètres des dépôts',
    btn_save: 'Enregistrer',
    btn_cancel: 'Annuler',
    title_domain: 'Recherche par domaine',
    title_keyword: 'Recherche par mot-clé',
    menu_settings: '⚙️ Paramètres',
  },
  de: {
    menu_domain: '{icon} Skripte nach Domain auf {name} finden',
    menu_keyword: '{icon} Skripte nach Stichwort auf {name} finden',
    title_settings: 'Repository-Einstellungen',
    btn_save: 'Speichern',
    btn_cancel: 'Abbrechen',
    title_domain: 'Domain-Suche',
    title_keyword: 'Stichwortsuche',
    menu_settings: '⚙️ Einstellungen',
  },
  ru: {
    menu_domain: '{icon} Найти скрипты по домену на {name}',
    menu_keyword: '{icon} Найти скрипты по ключевому слову на {name}',
    title_settings: 'Настройки репозиториев',
    btn_save: 'Сохранить',
    btn_cancel: 'Отмена',
    title_domain: 'Поиск по домену',
    title_keyword: 'Поиск по ключевому слову',
    menu_settings: '⚙️ Настройки',
  },
}
const USER_LANG = detectLanguage()
const LANG_MAP: Record<string, string> =
  USER_LANG === 'en' ? I18N.en : { ...I18N.en, ...I18N[USER_LANG] }

function t(key: string): string {
  return LANG_MAP[key]
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
    const supportedLangs = Object.keys(I18N)

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
  isKeywordSearch = false
): string {
  const key = isKeywordSearch ? 'menu_keyword' : 'menu_domain'
  const template = t(key)
  return template.replace('{icon}', repo.icon).replace('{name}', repo.name)
}

let MENU_IDS: number[] = []
let SETTINGS_MENU_ID: number | undefined

function clearMenus(): void {
  for (const id of MENU_IDS) {
    unregisterMenu(id)
  }

  MENU_IDS = []
  if (SETTINGS_MENU_ID) {
    unregisterMenu(SETTINGS_MENU_ID)
    SETTINGS_MENU_ID = undefined
  }
}

function registerAllMenus(): void {
  const domain = extractDomain()
  registerMenuCommands(domain)
  registerSettingsMenu()
}

/**
 * Register menu commands for each repository
 * @param {string} domain - The extracted domain
 */
function registerMenuCommands(domain: string): void {
  for (const repo of CONFIG.REPOSITORIES) {
    // Register domain search menu if domainSearchUrl is defined and enabled
    const domainEnabled = Boolean(CURRENT_SETTINGS[`domain_${repo.id}`])
    if (repo.domainSearchUrl && domainEnabled) {
      const url = repo.domainSearchUrl.replace('{domain}', domain)
      const menuText = getLocalizedMenuText(repo)
      const id = registerMenu(menuText, () => {
        debugLog(`Opening ${repo.name} for domain:`, domain)
        openInTab(url, { active: true, insert: true })
      })
      MENU_IDS.push(id)
    }

    // Register keyword search menu if keywordSearchUrl is defined and enabled
    const keywordEnabled = Boolean(CURRENT_SETTINGS[`keyword_${repo.id}`])
    if (repo.keywordSearchUrl && keywordEnabled) {
      const keywordUrl = repo.keywordSearchUrl.replace('{keyword}', domain)
      const keywordMenuText = getLocalizedMenuText(repo, true)
      const id = registerMenu(keywordMenuText, () => {
        debugLog(`Opening ${repo.name} for keyword search:`, domain)
        openInTab(keywordUrl, { active: true, insert: true })
      })
      MENU_IDS.push(id)
    }
  }
}

/**
 * Load settings from GM storage
 */
let CURRENT_SETTINGS: Record<string, boolean> = {}

function buildDefaults(): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const repo of CONFIG.REPOSITORIES) {
    if (repo.domainSearchUrl)
      out[`domain_${repo.id}`] = repo.domainSearchEnabled ?? false
    if (repo.keywordSearchUrl)
      out[`keyword_${repo.id}`] = repo.keywordSearchEnabled ?? false
  }

  return out
}

// Store for settings (single instance)
const SETTINGS_STORE = createObjectSettingsStore(
  CONFIG.SETTINGS_KEY,
  buildDefaults()
)

async function loadSettings(): Promise<void> {
  try {
    const all = await SETTINGS_STORE.getAll<Record<string, boolean>>()
    CURRENT_SETTINGS = all
    debugLog('Settings loaded:', all)
  } catch (error) {
    debugLog('Error loading settings:', error)
  }
}

function listenSettings(): void {
  try {
    SETTINGS_STORE.onChange?.(() => {
      void (async () => {
        await loadSettings()
        clearMenus()
        registerAllMenus()
      })()
    })
  } catch {}
}

/**
 * Create and show settings dialog
 */
function showSettingsDialog(): void {
  const groupDomain: Field[] = []
  const groupKeyword: Field[] = []

  for (const repo of CONFIG.REPOSITORIES) {
    if (repo.domainSearchUrl) {
      groupDomain.push({
        type: 'toggle',
        key: `domain_${repo.id}`,
        label: `${repo.icon} ${repo.name}`,
      })
    }

    if (repo.keywordSearchUrl) {
      groupKeyword.push({
        type: 'toggle',
        key: `keyword_${repo.id}`,
        label: `${repo.icon} ${repo.name}`,
      })
    }
  }

  const schema: PanelSchema = {
    type: 'simple',
    title: t('title_settings'),
    groups: [
      { id: 'domain', title: t('title_domain'), fields: groupDomain },
      { id: 'keyword', title: t('title_keyword'), fields: groupKeyword },
    ],
  }

  const store = SETTINGS_STORE

  openSettingsPanel(schema, store, {
    hostDatasetKey: 'fsftsHost',
    hostDatasetValue: 'find-scripts-settings',
    theme: {
      activeBg: '#7c3aed',
      activeFg: '#ffffff',
      colorRing: '#7c3aed',
      toggleOnBg: '#7c3aed',
    },
  })
}

/**
 * Register settings menu command
 */
function registerSettingsMenu(): void {
  const menuText = t('menu_settings')
  SETTINGS_MENU_ID = registerMenu(menuText, showSettingsDialog)
}

/**
 * Initialize the script
 */
async function initialize(): Promise<void> {
  // Load saved settings
  await loadSettings()

  // Register menu commands
  registerAllMenus()

  // Listen settings changes
  listenSettings()
}

// Initialize the script
// eslint-disable-next-line unicorn/prefer-top-level-await
void initialize()
