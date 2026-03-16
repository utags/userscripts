# Discourse 排序快速切换器

通过用户脚本菜单快速切换 Discourse 列表排序，直接更新页面 URL 参数实现。支持创建时间、回复时间、回复数量、浏览量与点赞数等多种排序，并提供升/降序两个方向。内置中英文菜单文案（自动按浏览器语言选择）。

[English Version](https://github.com/utags/userscripts/blob/main/discourse-sort-option-quick-switcher/README.md)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-11-06-15-17-47.png)

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
   - ScriptCat 安装页：https://scriptcat.org/script-show-page/4555

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

以下是一些其他有用的脚本，可以增强您的浏览体验：

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/569761-utags-add-usertags-to-links) · [Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/2784) · [GitHub](https://github.com/utags/utags/raw/main/packages/extension/build/userscript-prod/utags.user.js)
- **功能**：为用户、帖子、视频和其他链接添加自定义标签和备注
- **亮点**：支持特殊标签过滤（如垃圾、屏蔽、标题党等），数据导出/导入，自动标记已查看帖子
- **支持网站**：V2EX、X(Twitter)、Reddit、GitHub、哔哩哔哩、知乎、Linux.do、Youtube 等 50+ 网站
- **描述**：超级实用的标签管理工具，可为论坛用户或帖子添加标签，轻松识别或屏蔽低质量内容

### 🧰 UTags Advanced Filter

- **链接**：[Greasy Fork](https://greasyfork.org/scripts/556095-utags-advanced-filter) · [ScriptCat](https://scriptcat.org/en/script-show-page/4653) · [GitHub](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)
- **功能**：支持在 GreasyFork 实时过滤与隐藏脚本
- **亮点**：同时提供用户脚本与浏览器扩展两个版本
- **支持网站**：Greasy Fork
- **描述**：支持在 GreasyFork 实时过滤与隐藏脚本的工具，提供用户脚本和浏览器扩展两种版本。

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/utags-advanced-filter/refs/heads/main/assets/screenshot-2025-11-23-08-31-00.png)

### ⚡ UTags 快捷导航 (UTags Shortcuts)

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/558485-utags-shortcuts) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4910) · [GitHub](https://github.com/utags/userscripts/raw/main/utags-shortcuts/utags-shortcuts.user.js)
- **功能**：按站点分组、自定义图标、悬浮球或侧边栏导航面板
- **亮点**：悬浮/侧边栏模式、支持链接与脚本、可视化编辑、快捷键支持
- **支持网站**：所有网站
- **描述**：一款功能强大的用户脚本，提供便捷的快捷导航面板，帮助你高效管理常用链接与自动化脚本，提升浏览体验

### 🔗 链接助手

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper)
- **功能**：在新标签页中打开第三方网站链接，将文本链接解析为超链接
- **亮点**：支持自定义规则，解析 Markdown 和 BBCode 格式，将图片链接转换为图片标签
- **支持网站**：适用于所有网站，包括谷歌、YouTube、GitHub、V2EX 等
- **描述**：增强链接浏览体验，自动处理各种链接格式，使网页浏览更加便捷

### 🔍 查找适用于当前网站的脚本

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/550659-find-scripts-for-this-site)
- **功能**：快速查找当前网站的用户脚本
- **亮点**：支持多个流行的脚本仓库，轻松发现有用的脚本
- **支持网站**：适用于任何网站，查找相关用户脚本
- **描述**：一个方便的工具，用于发现和安装专为您访问的网站设计的用户脚本

### 🔄 Discourse 话题快捷切换器

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/550982-discourse-topic-quick-switcher)
- **功能**：在 Discourse 论坛中快速导航切换主题
- **亮点**：键盘快捷键、导航按钮、带语言选项的设置对话框
- **支持网站**：所有基于 Discourse 的论坛，包括 Discourse Meta、LINUX.DO 等
- **描述**：通过便捷的主题切换和可自定义设置，增强 Discourse 论坛中的导航体验

## 许可证

MIT License - 详见仓库中的 `LICENSE` 文件。

## 贡献

欢迎提交 Issue 与 Pull Request！

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
