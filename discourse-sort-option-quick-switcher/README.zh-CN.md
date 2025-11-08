# Discourse 排序快速切换器

通过用户脚本菜单快速切换 Discourse 列表排序，直接更新页面 URL 参数实现。支持创建时间、回复时间、回复数量、浏览量与点赞数等多种排序，并提供升/降序两个方向。内置中英文菜单文案（自动按浏览器语言选择）。

[English Version](https://github.com/utags/userscripts/blob/main/discourse-sort-option-quick-switcher/README.md)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-11-06-15-17-47.png)

## 功能特点

- 一键切换排序（通过用户脚本菜单命令）
- 支持的排序：
  - 创建时间：新→老 / 老→新
  - 回复时间：新→老 / 老→新
  - 回复数量：多→少 / 少→多
  - 浏览量：多→少 / 少→多
  - 点赞数：多→少 / 少→多
- 保留现有查询参数，仅更新 `order` 与 `ascending`
- 中英文双语菜单，自动语言检测（浏览器语言以 `zh` 开头使用中文，否则英文）
- 通过 `@match` 限定只在特定 Discourse 论坛运行，避免干扰其他站点
- 若当前已是目标排序，避免重复刷新

## 支持站点

该脚本仅在以下域名上运行：

- `https://meta.discourse.org/*`
- `https://linux.do/*`
- `https://idcflare.com/*`
- `https://www.nodeloc.com/*`
- `https://meta.appinn.net/*`
- `https://community.openai.com/*`
- `https://community.cloudflare.com/*`
- `https://community.wanikani.com/*`
- `https://forum.cursor.com/*`
- `https://forum.obsidian.md/*`
- `https://forum-zh.obsidian.md/*`
- `https://www.uscardforum.com/*`

## 安装

1. 安装用户脚本管理器：
   - [Tampermonkey](https://www.tampermonkey.net/)（推荐）
   - [Violentmonkey](https://violentmonkey.github.io/)
2. 安装脚本：
   - GitHub 原始链接：https://github.com/utags/userscripts/raw/main/discourse-sort-option-quick-switcher/discourse-sort-option-quick-switcher.user.js
   - Greasy Fork 安装页：https://greasyfork.org/zh-CN/scripts/554927-discourse-sort-option-quick-switcher

## 使用方法

1. 打开 Discourse 列表页面（Latest、New、Categories、Tags 等）。
2. 点击浏览器工具栏中的用户脚本管理器图标。
3. 在菜单中选择相应的排序命令。脚本会更新当前页面的 `order` 与 `ascending` 参数，并跳转到目标排序。

### 菜单项（中文）

- 按创建时间（新→老） / （老→新）
- 按回复时间（新→老） / （老→新）
- 按回复数量（多→少） / （少→多）
- 按浏览量（多→少） / （少→多）

### 说明

- 部分页面或站点可能不支持全部排序参数，此时添加参数可能不会生效。
- 当当前页面已是目标排序时，脚本会跳过刷新以避免不必要的跳转。

## 技术实现

- 使用 `GM_registerMenuCommand` 注册菜单命令，提供多个排序选项。
- 更新当前页面 URL 的 `order` 和 `ascending` 查询参数，然后通过 `window.location.assign(...)` 导航。
- 自动语言检测：`navigator.language` 以 `zh` 开头时使用中文，否则使用英文。

## 兼容性

适配现代浏览器的 Tampermonkey/Violentmonkey，适用于基于 Discourse 的论坛网站。

## 更新记录

### v0.1.1

- 新增点赞数排序（多→少 / 少→多）

### v0.1.0

- 首次发布
- 支持创建、回复、回复数、浏览量等排序的双向切换
- 内置中英文菜单，自动语言检测

## 更多实用脚本

- 🏷️ UTags - 为链接添加用户标签
  - [Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links)
  - 为用户/帖子等添加标签与备注，支持过滤、导入导出、自动标记已读等

- 🔄 Discourse 话题快捷切换器
  - [Greasy Fork](https://greasyfork.org/zh-CN/scripts/550982-discourse-topic-quick-switcher)
  - 在 Discourse 论坛中通过悬浮面板与快捷键快速导航话题

- 🔗 链接助手
  - [Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper)
  - 在新标签页打开第三方链接，将文本链接解析为超链接

- 🔍 查找适用于当前网站的脚本
  - [Greasy Fork](https://greasyfork.org/zh-CN/scripts/550659-find-scripts-for-this-site)
  - 一键在多个仓库中查找当前网站的相关脚本

## 许可证

MIT License - 详见仓库中的 `LICENSE` 文件。

## 贡献

欢迎提交 Issue 与 Pull Request！

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
