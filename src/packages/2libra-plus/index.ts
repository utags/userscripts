import styleText from 'css:./style.scss'

import { addStyle, registerMenu as gmRegisterMenu } from '../../common/gm'
import {
  createSettingsStore,
  openSettingsPanel as openPanel,
  type Field,
  type PanelSchema,
} from '../../common/settings'
import {
  initAutoMarkNotificationsRead,
  runAutoMarkNotificationsRead,
} from './auto-mark-notifications-read'
import { initPostListSort, runPostListSort } from './post-list-sort'
import { initReplyTimeColor, runReplyTimeColor } from './reply-time-color'
import { initSidebarHidden, runSidebarHidden } from './sidebar-hidden'
import { initStickyHeader, runStickyHeader } from './sticky-header'

type Settings = {
  enabled: boolean
  autoMarkNotificationsRead: boolean
  replyTimeColor: boolean
  postListSort: boolean
  stickyHeader: boolean
  hideSidebarEmail: boolean
  hideSidebarExperience: boolean
  hideSidebarCoins: boolean
  hideSidebarCheckin: boolean
}

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  autoMarkNotificationsRead: true,
  replyTimeColor: true,
  postListSort: true,
  stickyHeader: false,
  hideSidebarEmail: false,
  hideSidebarExperience: false,
  hideSidebarCoins: false,
  hideSidebarCheckin: false,
}

const store = createSettingsStore('settings', DEFAULT_SETTINGS)

let enabled = DEFAULT_SETTINGS.enabled
let autoMarkNotificationsRead = DEFAULT_SETTINGS.autoMarkNotificationsRead
let replyTimeColor = DEFAULT_SETTINGS.replyTimeColor
let postListSort = DEFAULT_SETTINGS.postListSort
let stickyHeader = DEFAULT_SETTINGS.stickyHeader
let hideSidebarEmail = DEFAULT_SETTINGS.hideSidebarEmail
let hideSidebarExperience = DEFAULT_SETTINGS.hideSidebarExperience
let hideSidebarCoins = DEFAULT_SETTINGS.hideSidebarCoins
let hideSidebarCheckin = DEFAULT_SETTINGS.hideSidebarCheckin

function buildSettingsSchema(): PanelSchema {
  const generalFields: Field[] = [
    { type: 'toggle', key: 'enabled', label: '启用' },
    {
      type: 'toggle',
      key: 'autoMarkNotificationsRead',
      label: '自动将通知页设为已读',
    },
    {
      type: 'toggle',
      key: 'replyTimeColor',
      label: '回复时间颜色渐变',
    },
    {
      type: 'toggle',
      key: 'postListSort',
      label: '当前页帖子列表排序',
    },
    {
      type: 'toggle',
      key: 'stickyHeader',
      label: '顶部导航栏固定显示',
    },
  ]

  const sidebarFields: Field[] = [
    { type: 'toggle', key: 'hideSidebarEmail', label: '隐藏邮箱' },
    { type: 'toggle', key: 'hideSidebarExperience', label: '隐藏经验值' },
    { type: 'toggle', key: 'hideSidebarCoins', label: '隐藏金币数量' },
    { type: 'toggle', key: 'hideSidebarCheckin', label: '隐藏签到' },
  ]

  return {
    type: 'simple',
    title: '2Libra Plus 设置',
    groups: [
      { id: 'general', title: '通用设置', fields: generalFields },
      { id: 'sidebar', title: '右侧栏个人卡片设置', fields: sidebarFields },
    ],
  }
}

function openSettings(): void {
  const schema = buildSettingsSchema()
  const s = store
  openPanel(schema, s, {
    hostDatasetKey: 'libraPlusHost',
    hostDatasetValue: '2libra-plus-settings',
    theme: {
      activeBg: '#2563eb',
      activeFg: '#ffffff',
      colorRing: '#2563eb',
      toggleOnBg: '#2563eb',
    },
  })
}

function registerMenus(): void {
  try {
    gmRegisterMenu('设置', () => {
      try {
        openSettings()
      } catch {}
    })
  } catch {}
}

function listenSettings(): void {
  try {
    store.onChange(() => {
      void applySettingsFromStore()
    })
  } catch {}
}

async function applySettingsFromStore(): Promise<void> {
  try {
    const prevEnabled = enabled
    const obj = await store.getAll<Settings>()
    enabled = Boolean(obj.enabled)
    autoMarkNotificationsRead = Boolean(obj.autoMarkNotificationsRead)
    replyTimeColor = Boolean(obj.replyTimeColor)
    postListSort = Boolean(obj.postListSort)
    stickyHeader = Boolean(obj.stickyHeader)
    hideSidebarEmail = Boolean(obj.hideSidebarEmail)
    hideSidebarExperience = Boolean(obj.hideSidebarExperience)
    hideSidebarCoins = Boolean(obj.hideSidebarCoins)
    hideSidebarCheckin = Boolean(obj.hideSidebarCheckin)

    if (!prevEnabled && enabled && !featuresInitialized) {
      initFeatures()
    } else if (featuresInitialized) {
      runAutoMarkNotificationsRead(getSettingsSnapshot)
      runReplyTimeColor(getSettingsSnapshot)
      runPostListSort(getSettingsSnapshot)
      runStickyHeader(getSettingsSnapshot)
      runSidebarHidden(getSettingsSnapshot)
    }
  } catch {}
}

function getSettingsSnapshot(): Settings {
  return {
    enabled,
    autoMarkNotificationsRead,
    replyTimeColor,
    postListSort,
    stickyHeader,
    hideSidebarEmail,
    hideSidebarExperience,
    hideSidebarCoins,
    hideSidebarCheckin,
  }
}

let featuresInitialized = false

function initFeatures(): void {
  if (featuresInitialized) return
  featuresInitialized = true
  initAutoMarkNotificationsRead(getSettingsSnapshot)
  initReplyTimeColor(getSettingsSnapshot)
  initPostListSort(getSettingsSnapshot)
  initStickyHeader(getSettingsSnapshot)
  initSidebarHidden(getSettingsSnapshot)
}

function bootstrap(): void {
  const d = document.documentElement
  const ds = d.dataset as Record<string, string>
  if (ds.libraPlus === '1') return
  ds.libraPlus = '1'
  void addStyle(styleText)
  registerMenus()
  listenSettings()
  void applySettingsFromStore()
  if (enabled) {
    initFeatures()
  }
}

bootstrap()
