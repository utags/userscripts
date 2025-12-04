# 复制选中链接为 Markdown

在任意网页将选中的链接复制到剪贴板，输出为 Markdown `[文本](链接)`。支持选择区域中的单个或多个链接、选中文本内的 URL 检测，以及页面标题回退。提供快捷键与菜单命令。

[English](https://github.com/utags/userscripts/blob/main/copy-link-as-markdown/README.md)

## 功能

- 将选中的链接复制为 Markdown `[文本](链接)`
- 支持单个或多个链接；多个链接按 Markdown 列表输出
- 当没有链接时，检测选中文本中的 URL
- 无选择时，回退为 `[页面标题](当前地址)`
- 快捷键：`Cmd/Ctrl + Shift + M`
- 菜单命令：`GM_registerMenuCommand`（“复制选中链接为 Markdown”）

## 支持站点

- 所有网站：`*://*/*`

## 安装

1. 安装脚本管理器：
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. 安装脚本：
   - [GitHub Raw](https://github.com/utags/userscripts/raw/main/copy-link-as-markdown/copy-link-as-markdown.user.js)
   - [Greasy Fork](https://greasyfork.org/scripts/557913-copy-selected-links-as-markdown)
   - [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4802)

## 使用方法

- 在页面上选中链接或文本
- 触发以下任一方式：
  - 按下快捷键 `Cmd/Ctrl + Shift + M`
  - 使用菜单命令“复制选中链接为 Markdown”
- 剪贴板中将输出 Markdown；若选择多个链接则以 Markdown 列表输出

## 技术说明

- 查找与当前选择区域相交的链接，并在光标位于链接内部时向上追溯父级链接
- 通过 `new URL(anchor.href, location.origin)` 生成绝对链接
- 首选 Clipboard API，回退到 `document.execCommand('copy')`

## 兼容性

适用于现代浏览器，Tampermonkey/Violentmonkey 环境。

## 更新记录

### v0.1.0

- 初始版本：选择解析、多链接输出、快捷键与菜单命令

## 更多实用脚本

- 🏷️ UTags — 为链接添加用户标签
  - [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links)
- 🔄 Discourse Topic Quick Switcher — 话题快速切换
  - [Greasy Fork](https://greasyfork.org/scripts/550982-discourse-topic-quick-switcher)
- 🔗 Links Helper — 链接助手
  - [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
- 🔍 Find Scripts For This Site — 查找当前网站脚本
  - [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site)
- 🖼️ 通用图片上传助手（Universal Image Uploader）
  - [Greasy Fork](https://greasyfork.org/scripts/553341-universal-image-uploader)

## 许可证

MIT License — 详见仓库 `LICENSE` 文件。

## 贡献

欢迎提交 Issue 与 Pull Request！

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
