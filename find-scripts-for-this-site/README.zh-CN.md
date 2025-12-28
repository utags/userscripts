# Find Scripts For This Site - 查找适用于当前网站的脚本

一个用于快速在多个脚本仓库中查找当前网站脚本的用户脚本，提供设置面板与跨标签页实时同步。

[English Version](https://github.com/utags/userscripts/blob/main/find-scripts-for-this-site/README.md)

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-09-25-19-48-03.png)

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-16-09-57-35.png)

## 功能特性

- 🔍 一键在多个仓库搜索脚本
- 🌐 支持 Greasy Fork、OpenUserJS、ScriptCat、GitHub、GitHub Gist
- 🌍 自动适配浏览器语言（支持 8 种常用语言）
- ⚙️ 设置菜单：为每个仓库分别启用/禁用“域名搜索 / 关键字搜索”
- 🔄 设置在标签页之间实时同步（使用 `GM_addValueChangeListener`）
- 📑 更改设置后菜单顺序准确重排
- 🧩 智能顶级域名提取

## 安装方法

- 需要安装油猴脚本管理器：[Tampermonkey](https://www.tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/)、或 [ScriptCat](https://scriptcat.org/)
- 安装地址： [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js) · [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site) · [ScriptCat](https://scriptcat.org/script-show-page/4276)

## 使用说明

- 打开任意网页，点击油猴扩展菜单
- 菜单包含如下条目：
  - 🍴 在 Greasy Fork 上按域名/关键字查找脚本
  - 📜 在 OpenUserJS 上按关键字查找脚本
  - 🐱 在 ScriptCat 上按域名/关键字查找脚本
  - 🐙 在 GitHub 上按关键字查找脚本
  - 📝 在 GitHub Gist 上按关键字查找脚本
- 点击 ⚙️ 设置，选择需要显示的“域名搜索 / 关键字搜索”条目（按仓库分别设置）
- 设置即时生效，并会在其他标签页实时同步

## 多语言支持

- 支持：英文、简体中文、繁体中文、日文、韩文、西班牙文、法文、德文、俄文
- 菜单文案将自动根据浏览器语言显示

## 故障排除

- 菜单项未显示：
  - 检查脚本是否已安装、已启用
  - 确认脚本管理器支持菜单命令
- 搜索结果不准确：开启调试模式并查看控制台中的域名提取日志

## 更新日志

### v0.4.0

- 为不支持 `addValueChangeListener` 的脚本管理器增加监听数据变化的功能，实现跨标签页数据同步。

### v0.3.x

- 修复了在具有严格 CSP（内容安全策略）的网站上无法注入样式的问题
- 设置界面优化

### v0.2.4

- 设置跨标签页实时同步
- i18n 文案集中管理，简化获取逻辑
- 菜单重新注册顺序保持准确
- 移除“保存后需要刷新页面”的提示

### v0.2.0

- 添加设置面板，支持为各仓库启用/禁用搜索方法
- 域名搜索与关键字搜索分开独立开关
- 新增 Sleazy Fork 仓库

### v0.1.1

- 为所有仓库添加关键字搜索
- 优化菜单显示
- 重构与文档更新

### v0.1.0

- 初始发布：多仓库搜索、多语言支持、智能域名提取

## 更多实用脚本

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links)
- **功能**：为用户、帖子、视频和其他链接添加自定义标签和备注
- **亮点**：支持特殊标签过滤（如垃圾、屏蔽、标题党等），数据导出/导入，自动标记已查看帖子
- **支持网站**：V2EX、X(Twitter)、Reddit、GitHub、哔哩哔哩、知乎、Linux.do、YouTube 等 50+ 网站
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
- **提示**：导入 [用户脚本预设](https://raw.githubusercontent.com/utags/utags-shared-shortcuts/main/zh-CN/collections/plugin_groups.json) 后，也可实现本脚本的查找功能

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-23-14-48-43.png)

### 🔗 链接助手

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper)
- **功能**：在新标签页中打开第三方网站链接，将文本链接解析为超链接
- **亮点**：支持自定义规则，解析 Markdown 和 BBCode 格式，将图片链接转换为图片标签
- **支持网站**：适用于所有网站，包括谷歌、YouTube、GitHub、V2EX 等
- **描述**：增强链接浏览体验，自动处理各种链接格式，使网页浏览更加便捷

### 🖼️ 通用图片上传助手 (Universal Image Uploader)

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/553341-universal-image-uploader) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4467) · [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js)
- **功能**：粘贴/拖拽/选择图片批量上传到 Imgur/Tikolu/MJJ.Today/Appinn
- **亮点**：自动复制为 Markdown/HTML/BBCode/链接，支持站点按钮与本地历史，兼容单页应用 (SPA)
- **支持网站**：所有网站
- **描述**：在任意网站上粘贴、拖拽或选择图片，批量上传到图床，并按需自动复制为多种格式，支持本地历史记录以便快速复用

## 许可证

MIT License — 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE)

## 相关链接

- 项目主页：https://github.com/utags/userscripts
- 问题反馈：https://github.com/utags/userscripts/issues
