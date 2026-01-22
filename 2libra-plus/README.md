# 2Libra Plus

专为 2Libra.com 打造的增强工具，旨在提升日常使用的效率与体验。

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2026-01-16-13-26-10.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2026-01-16-13-27-49.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2026-01-17-20-14-42.png)

## ✨ 主要功能

### 1. 通知中心增强

- **未读消息高亮**：自动检测通知列表中的未读条目，并在左侧添加醒目的**橙色竖线**标记，帮助你快速定位未处理的通知。
- **自动已读（可选）**：支持进入通知页后自动将当前页消息标记为已读，减少重复点击操作（默认开启，可在设置中关闭）。

### 2. 帖子列表增强

- **回复时间颜色渐变**：根据你上次在首页查看时间，将最新回复显示得更醒目，较久之前的回复颜色更浅，帮助你一眼区分「最近更新」和「很久没动」的帖子。为了避免频繁刷新带来的视觉抖动，「上次查看时间」在 5 分钟内不会更新；最新回复会使用 `--color-primary` 颜色展示，更加醒目。
- **当前页帖子列表排序（可选）**：在帖子列表右上角添加排序按钮，支持按默认顺序、回复时间（新→老 / 老→新）以及回复数量（多→少 / 少→多）排序，并提供开关选项，可在设置中关闭。

### 3. 个性化设置

- 提供可视化的设置面板，可随时开启或关闭特定功能，按需定制你的使用体验。

### 4. 界面增强

- **顶部导航栏固定显示（可选）**：支持将页面顶部的导航栏固定，在向下滚动浏览时始终保持可见，方便随时切换页面。默认关闭，可在设置中开启。

## 📖 使用说明

- 安装脚本后，访问 2Libra 通知页即可看到效果。
- 通过脚本管理器菜单可打开设置面板。

## ⬇️ 安装方法

- **安装地址**： [Greasy Fork](https://greasyfork.org/zh-CN/scripts/562820-2libra-plus) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/5195) · [GitHub](https://github.com/utags/userscripts/raw/main/2libra-plus/2libra-plus.user.js)
- **环境要求**：需要安装油猴脚本管理器（如 [Tampermonkey](https://www.tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/)、[ScriptCat](https://scriptcat.org/)）。

## 📝 更新日志

### v0.2.x

- ✨ 新增“记住排序选项”功能，开启后自动应用上次选择的排序方式（默认关闭）。
- ✨ 新增顶部导航栏固定显示功能，支持在滚动时保持导航栏可见。
- ✨ 新增右侧栏个人卡片自定义功能，支持隐藏邮箱、经验值、金币及签到，减轻用户心理负担，避免分散注意力。
- ✨ 优化设置面板，支持分组显示，提升查找体验。
- ✨ 在设置面板中添加对应开关（默认关闭）。

### v0.1.x

- ✨ 新增首页帖子列表排序功能，支持按回复时间与回复数量排序。
- ✨ 提供排序功能启用开关，可在设置面板中独立控制。

### v0.0.2

- ✨ 新增帖子列表回复时间颜色渐变功能。

### v0.0.1

- 🚀 首次发布。
- ✨ 支持通知页未读消息高亮（橙色竖线）。
- ✨ 支持通知页自动标记已读功能。
- ⚙️ 集成通用设置面板。

## 更多 2Libra 增强脚本

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/2784) · [GitHub](https://github.com/utags/utags/raw/main/packages/extension/build/userscript-prod/utags.user.js)
- **功能**：为用户、帖子、视频和其他链接添加自定义标签和备注
- **亮点**：支持特殊标签过滤（如垃圾、屏蔽、标题党等），数据导出/导入，自动标记已查看帖子
- **支持网站**：V2EX、X(Twitter)、Reddit、GitHub、哔哩哔哩、知乎、Linux.do、Youtube 等 50+ 网站
- **描述**：超级实用的标签管理工具，可为论坛用户或帖子添加标签，轻松识别或屏蔽低质量内容

### ⚡ UTags 快捷导航 (UTags Shortcuts)

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/558485-utags-shortcuts) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4910) · [GitHub](https://github.com/utags/userscripts/raw/main/utags-shortcuts/utags-shortcuts.user.js)
- **功能**：按站点分组、自定义图标、悬浮球或侧边栏导航面板
- **亮点**：悬浮/侧边栏模式、支持链接与脚本、可视化编辑、快捷键支持
- **支持网站**：所有网站
- **描述**：一款功能强大的用户脚本，提供便捷的快捷导航面板，帮助你高效管理常用链接与自动化脚本，提升浏览体验

### 🔗 链接助手

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4486) · [GitHub](https://github.com/utags/links-helper/raw/refs/heads/main/build/userscript-prod/links-helper.user.js)
- **功能**：在新标签页中打开第三方网站链接，将文本链接解析为超链接
- **亮点**：支持自定义规则，解析 Markdown 和 BBCode 格式，将图片链接转换为图片标签
- **支持网站**：适用于所有网站，包括谷歌、YouTube、GitHub、V2EX 等
- **描述**：增强链接浏览体验，自动处理各种链接格式，使网页浏览更加便捷

### 🔍 查找适用于当前网站的脚本

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/550659-find-scripts-for-this-site) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4276) · [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js)
- **功能**：快速查找当前网站的用户脚本
- **亮点**：支持多个流行的脚本仓库，轻松发现有用的脚本
- **支持网站**：适用于任何网站，查找相关用户脚本
- **描述**：一个方便的工具，用于发现和安装专为您访问的网站设计的用户脚本

### 🖼️ 通用图片上传助手 (Universal Image Uploader)

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/553341-universal-image-uploader) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4467) · [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js)
- **功能**：粘贴/拖拽/选择图片批量上传到 Imgur/Tikolu/MJJ.Today/Appinn
- **亮点**：自动复制为 Markdown/HTML/BBCode/链接，支持站点按钮与本地历史，兼容单页应用 (SPA)
- **支持网站**：所有网站
- **描述**：在任意网站上粘贴、拖拽或选择图片，批量上传到图床，并按需自动复制为多种格式，支持本地历史记录以便快速复用

## 许可证

MIT License — 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE)

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
