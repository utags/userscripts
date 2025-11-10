# V2EX 去除节点特性化样式

在 V2EX 去除每个节点的特性化样式，保持所有页面样式统一、简洁。

![icon](https://wsrv.nl/?w=64&h=64&url=https%3A%2F%2Ft3.gstatic.com%2FfaviconV2%3Fclient%3DSOCIAL%26type%3DFAVICON%26fallback_opts%3DTYPE%2CSIZE%2CURL%26url%3Dhttps%3A%2F%2Fwww.v2ex.com%26size%3D64)

## 功能特点

- 移除右侧栏 `#Rightbar` 下所有 `<style>` 标签，统一视觉风格
- 尽早执行：`@run-at document-start`，在文档开始阶段即进行清理
- 持续监控：使用 `MutationObserver` 监听并移除后续动态注入的样式
- 兜底清理：在 `DOMContentLoaded` 时再次清理，确保效果稳定
- 仅作用于 V2EX 域名（见下文支持站点），不影响其他网站
- 零依赖、无 GM 权限需求（`@grant none`），不注入额外 CSS

## 支持站点

脚本仅在以下域名上运行：

- `https://*.v2ex.com/*`
- `https://*.v2ex.co/*`

## 安装

1. 安装用户脚本管理器：
   - [Tampermonkey](https://www.tampermonkey.net/)（推荐）
   - [Violentmonkey](https://violentmonkey.github.io/)
2. 安装脚本：
   - GitHub 原始链接：`https://github.com/utags/userscripts/raw/main/v2ex-no-node-specific-styles/v2ex-no-node-specific-styles.user.js`
   - Greasy Fork 安装页：`https://greasyfork.org/zh-CN/scripts/555374-v2ex-no-node-specific-styles`
   - ScriptCat 安装页：`https://scriptcat.org/zh-CN/script-show-page/4591`

## 使用方法

1. 访问任意 V2EX 页面（话题页、节点页、首页等）。
2. 脚本会自动运行并移除右侧栏内联样式，无需手动操作。
3. 如果仍看到样式残留，刷新页面即可；如需恢复原样式，禁用或移除脚本即可。

## 技术实现

- 在 `document-start` 阶段立即执行一次清理：`document.querySelectorAll('#Rightbar style')` 并移除全部匹配节点。
- 通过 `MutationObserver` 监听 `#Rightbar` 的创建与后续子树变更：
  - 对动态添加的 `<style>` 及其子树中的 `<style>` 进行即时移除。
  - 找到 `#Rightbar` 后停止对整个文档的观察，仅观察右侧栏，提高性能与准确性。
- 在 `DOMContentLoaded` 事件触发时再次清理，作为兜底保障。

## 兼容性

适配现代浏览器的 Tampermonkey/Violentmonkey，已在桌面浏览器进行基本验证：

- Chrome
- Firefox
- Safari

## 更新记录

### v0.1.2

- 将 `@run-at` 设置为 `document-start`，在文档开始阶段清理样式
- 新增 `MutationObserver` 持续移除后续注入的 `<style>`
- 保留 `DOMContentLoaded` 兜底清理，确保稳定性

### v0.1.1

- 将清理范围调整为移除 `#Rightbar` 下的所有 `<style>` 标签
- 更新描述文本以匹配新的清理逻辑

### v0.1.0

- 初始版本：页面加载后删除 `#node_sidebar > style`

## 更多实用脚本

- 🏷️ UTags - 为链接添加用户标签
  - [Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links)
  - 为用户/帖子等添加标签与备注，支持过滤、导入导出、自动标记已读等

- 🔗 Links Helper
  - [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
  - Open third-party links in new tabs; parse text links into hyperlinks
- 🔍 查找适用于当前网站的脚本
  - [Greasy Fork](https://greasyfork.org/zh-CN/scripts/550659-find-scripts-for-this-site)
  - 一键在多个仓库中查找当前网站的相关脚本

- 🔄 Discourse 话题快捷切换器
  - [Greasy Fork](https://greasyfork.org/zh-CN/scripts/550982-discourse-topic-quick-switcher)
  - 在 Discourse 论坛中通过悬浮面板与快捷键快速导航话题

## 许可证

MIT License - 详见仓库中的 `LICENSE` 文件。

## 贡献

欢迎提交 Issue 与 Pull Request！

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
