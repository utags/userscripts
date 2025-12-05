# Discourse 回复防跳转

防止在 Discourse 回复后页面自动跳转到最新帖子。脚本拦截回复行为并强制 `shiftKey`，保持当前滚动位置与上下文。提供每站点开关与多语言标签。

[English](https://github.com/utags/userscripts/blob/main/discourse-prevent-jump-on-reply/README.md)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-05-22-27-09.png)

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

### v0.1.0

- 初始版本：支持按钮与快捷键拦截、每站点开关、多语言标签

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
- 🔗 复制选中链接为 Markdown（Copy Selected Links as Markdown）
  - [Greasy Fork](https://greasyfork.org/scripts/557913-copy-selected-links-as-markdown)
- 🔄 Discourse 排序项快速切换（Discourse Sort Option Quick Switcher）
  - [Greasy Fork](https://greasyfork.org/scripts/554927-discourse-sort-option-quick-switcher)

## 许可证

MIT License — 详见仓库 `LICENSE` 文件。

## 贡献

欢迎提交 Issue 与 Pull Request！

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
