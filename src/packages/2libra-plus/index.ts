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
import {
  initCheckNotifications,
  runCheckNotifications,
} from './check-notifications'
import { initPostListSort, runPostListSort } from './post-list-sort'
import { initReplyTimeColor, runReplyTimeColor } from './reply-time-color'
import { initSidebarHidden, runSidebarHidden } from './sidebar-hidden'
import { initStickyHeader, runStickyHeader } from './sticky-header'

type Settings = {
  enabled: boolean
  autoMarkNotificationsRead: boolean
  checkUnreadNotifications: boolean
  checkUnreadNotificationsTitle: boolean
  checkUnreadNotificationsFavicon: boolean
  checkUnreadNotificationsUtags: boolean
  replyTimeColor: boolean
  postListSort: boolean
  rememberSortMode: boolean
  stickyHeader: boolean
  hideSidebarEmail: boolean
  hideSidebarExperience: boolean
  hideSidebarCoins: boolean
  hideSidebarCheckin: boolean
}

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  autoMarkNotificationsRead: true,
  checkUnreadNotifications: true,
  checkUnreadNotificationsTitle: true,
  checkUnreadNotificationsFavicon: true,
  checkUnreadNotificationsUtags: true,
  replyTimeColor: true,
  postListSort: true,
  rememberSortMode: false,
  stickyHeader: false,
  hideSidebarEmail: false,
  hideSidebarExperience: false,
  hideSidebarCoins: false,
  hideSidebarCheckin: false,
}

const store = createSettingsStore('settings', DEFAULT_SETTINGS)

let enabled = DEFAULT_SETTINGS.enabled
let autoMarkNotificationsRead = DEFAULT_SETTINGS.autoMarkNotificationsRead
let checkUnreadNotifications = DEFAULT_SETTINGS.checkUnreadNotifications
let checkUnreadNotificationsTitle =
  DEFAULT_SETTINGS.checkUnreadNotificationsTitle
let checkUnreadNotificationsFavicon =
  DEFAULT_SETTINGS.checkUnreadNotificationsFavicon
let checkUnreadNotificationsUtags =
  DEFAULT_SETTINGS.checkUnreadNotificationsUtags
let replyTimeColor = DEFAULT_SETTINGS.replyTimeColor
let postListSort = DEFAULT_SETTINGS.postListSort
let rememberSortMode = DEFAULT_SETTINGS.rememberSortMode
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
      key: 'rememberSortMode',
      label: '记住排序选项，每次自动排序',
    },
    {
      type: 'toggle',
      key: 'stickyHeader',
      label: '顶部导航栏固定显示',
    },
  ]

  const notificationFields: Field[] = [
    {
      type: 'toggle',
      key: 'autoMarkNotificationsRead',
      label: '自动将通知页设为已读',
    },
    {
      type: 'toggle',
      key: 'checkUnreadNotifications',
      label: '定时检查未读通知',
    },
    {
      type: 'toggle',
      key: 'checkUnreadNotificationsTitle',
      label: '网页标题显示通知个数',
    },
    {
      type: 'toggle',
      key: 'checkUnreadNotificationsFavicon',
      label: 'Favicon Badge 显示通知个数',
    },
    {
      type: 'toggle',
      key: 'checkUnreadNotificationsUtags',
      label: 'UTags Shortcuts 显示通知个数',
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
      { id: 'notifications', title: '通知管理', fields: notificationFields },
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
    autoMarkNotificationsRead =
      enabled && Boolean(obj.autoMarkNotificationsRead)
    checkUnreadNotifications = enabled && Boolean(obj.checkUnreadNotifications)
    checkUnreadNotificationsTitle =
      enabled && Boolean(obj.checkUnreadNotificationsTitle)
    checkUnreadNotificationsFavicon =
      enabled && Boolean(obj.checkUnreadNotificationsFavicon)
    checkUnreadNotificationsUtags =
      enabled && Boolean(obj.checkUnreadNotificationsUtags)
    replyTimeColor = enabled && Boolean(obj.replyTimeColor)
    postListSort = enabled && Boolean(obj.postListSort)
    rememberSortMode = enabled && Boolean(obj.rememberSortMode)
    stickyHeader = enabled && Boolean(obj.stickyHeader)
    hideSidebarEmail = enabled && Boolean(obj.hideSidebarEmail)
    hideSidebarExperience = enabled && Boolean(obj.hideSidebarExperience)
    hideSidebarCoins = enabled && Boolean(obj.hideSidebarCoins)
    hideSidebarCheckin = enabled && Boolean(obj.hideSidebarCheckin)

    if (enabled && !featuresInitialized) {
      initFeatures()
    } else if (featuresInitialized) {
      runAutoMarkNotificationsRead(getSettingsSnapshot)
      runCheckNotifications(getSettingsSnapshot)
      runReplyTimeColor(getSettingsSnapshot)
      runPostListSort(getSettingsSnapshot)
      runStickyHeader(getSettingsSnapshot)
      runSidebarHidden(getSettingsSnapshot)
    }
  } catch {}
}

export function getSettingsSnapshot(): Settings {
  return {
    enabled,
    autoMarkNotificationsRead,
    checkUnreadNotifications,
    checkUnreadNotificationsTitle,
    checkUnreadNotificationsFavicon,
    checkUnreadNotificationsUtags,
    replyTimeColor,
    postListSort,
    rememberSortMode,
    stickyHeader,
    hideSidebarEmail,
    hideSidebarExperience,
    hideSidebarCoins,
    hideSidebarCheckin,
  }
}

export function getSettings() {
  return getSettingsSnapshot()
}

let featuresInitialized = false

function initFeatures(): void {
  if (featuresInitialized) return
  featuresInitialized = true
  initAutoMarkNotificationsRead(getSettingsSnapshot)
  initCheckNotifications(getSettingsSnapshot)
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
}

bootstrap()
