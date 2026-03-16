# Discourse 回复防跳转

防止在 Discourse 回复后页面自动跳转到最新帖子。脚本拦截回复行为并强制 `shiftKey`，保持当前滚动位置与上下文。提供每站点开关与多语言标签。

[English](https://github.com/utags/userscripts/blob/main/discourse-prevent-jump-on-reply/README.md)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-05-22-27-09.png)

## 功能

- 回复后不跳转，保持当前位置
- 同时拦截按钮点击与快捷键 `Cmd/Ctrl + Enter`
- 回复按钮旁提供每站点开关，默认关闭
- 开关状态按域名持久化（用户脚本存储：`GM.getValue`/`GM.setValue`）
- UI 文案根据 Discourse 界面语言自动切换（中文/英文）

## 支持站点

仅在以下 Discourse 论坛上运行：

- `https://meta.discourse.org/*`
- `https://linux.do/*`
- `https://idcflare.com/*`
- `https://www.nodeloc.com/*`
- `https://meta.appinn.net/*`

## 安装

1. 安装脚本管理器：
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. 安装脚本：
   - [GitHub Raw](https://github.com/utags/userscripts/raw/main/discourse-prevent-jump-on-reply/discourse-prevent-jump-on-reply.user.js)
   - [Greasy Fork](https://greasyfork.org/scripts/557755-discourse-prevent-jump-on-reply)
   - [ScriptCat](https://scriptcat.org/script-show-page/4789)

## 使用方法

- 在回复编辑器的提交按钮旁会出现一个复选框：
  - 文案：根据站点语言显示为“Prevent jump to latest post / 防止跳转到最新帖子”
  - 默认：关闭
  - 启用后，脚本会拦截回复并保持当前位置
- 支持点击按钮与快捷键 `Cmd/Ctrl + Enter`
- 覆盖规则：当你手动按下 Shift 时，脚本不改变站点默认行为

## 兼容性

在现代浏览器的 Tampermonkey/Violentmonkey 环境下、各类 Discourse 论坛已测试。

## 更新记录

### v0.3.0

- 在检测到权限回复占位符时，等待回复真正发送完成后再刷新页面，避免回复仍在发送过程中就被刷新导致内容丢失。

### v0.2.0

- 为不支持 `addValueChangeListener` 的脚本管理器增加监听数据变化的功能，实现跨标签页数据同步。

### v0.1.4

- 删除 `@noframes` 声明，兼容 utags-shortcuts 在 iframe 模式下运行

### v0.1.0

- 初始版本：支持按钮与快捷键拦截、每站点开关、多语言标签

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

MIT License — 详见仓库 `LICENSE` 文件。

## 贡献

欢迎提交 Issue 与 Pull Request！

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
