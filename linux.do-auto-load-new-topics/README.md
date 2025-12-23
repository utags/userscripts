# LINUX.DO Auto Load New Topics

一个智能的用户脚本，用于自动加载 Linux.DO 论坛的新话题，无需手动点击"显示更多"按钮。

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-08-14-14-42-52.png)

## 功能特性

- 🚀 **智能检测**：自动识别并点击"显示更多"按钮
- 🛡️ **错误处理**：完善的错误处理和重试机制
- ⚡ **性能优化**：页面隐藏时自动暂停，节省资源
- 🔧 **可配置**：支持自定义检查间隔和重试次数
- 📝 **调试模式**：可开启调试日志进行问题排查
- 🎯 **精确定位**：使用多个选择器确保兼容性

## 安装方法

### 前置要求

首先需要安装用户脚本管理器，推荐以下任一款：

- [Tampermonkey](https://www.tampermonkey.net/) (推荐)
- [Violentmonkey](https://violentmonkey.github.io/)

### 安装脚本

1. 点击 [这里](https://github.com/utags/userscripts/raw/main/linux.do-auto-load-new-topics/linux.do-auto-load-new-topics.user.js) 从 GitHub 安装脚本
2. 点击 [这里](https://greasyfork.org/zh-CN/scripts/545775-linux-do-auto-load-new-topics) 从 Greasy Fork 安装脚本

## 使用说明

### 基本使用

脚本安装后会自动运行，无需任何手动操作：

1. 访问 Linux.DO 论坛任意页面
2. 脚本会自动检测"显示更多"按钮
3. 每 3 秒自动点击一次（如果按钮存在且可见）
4. 页面切换到后台时自动暂停，切回前台时恢复

### 配置选项

可以通过修改脚本中的 `CONFIG` 对象来自定义行为：

```javascript
const CONFIG = {
  CHECK_INTERVAL: 3000, // 检查间隔（毫秒）
  MAX_RETRIES: 3, // 最大重试次数
  SELECTORS: [
    // 按钮选择器列表
    '#list-area .show-more .clickable',
  ],
  DEBUG: false, // 调试模式开关
}
```

#### 配置说明

- **CHECK_INTERVAL**: 检查"显示更多"按钮的时间间隔，默认 3000 毫秒（3秒）
- **MAX_RETRIES**: 连续失败后停止尝试的最大次数，默认 3 次
- **SELECTORS**: 用于查找"显示更多"按钮的 CSS 选择器数组
- **DEBUG**: 设置为 `true` 可在浏览器控制台查看详细日志

### 调试模式

如果脚本工作异常，可以开启调试模式：

1. 将 `CONFIG.DEBUG` 设置为 `true`
2. 打开浏览器开发者工具（F12）
3. 查看控制台输出的调试信息

调试信息示例：

```
[LINUX.DO Auto Loader] Starting auto-loader
[LINUX.DO Auto Loader] Successfully clicked show more button
[LINUX.DO Auto Loader] No clickable element found
```

## 工作原理

### 核心机制

1. **DOM 监听**：等待页面 DOM 加载完成后启动
2. **元素检测**：使用预定义的选择器查找"显示更多"按钮
3. **可见性检查**：确保按钮在页面中可见才进行点击
4. **事件模拟**：使用 `MouseEvent` 模拟真实的鼠标点击
5. **状态管理**：跟踪点击时间和重试次数

### 生命周期管理

- **页面加载**：DOM 就绪后自动启动
- **页面隐藏**：切换到其他标签页时暂停运行
- **页面显示**：重新切回时恢复运行
- **页面卸载**：离开页面前清理定时器

### 错误处理

- **重试机制**：点击失败时自动重试，最多 3 次
- **异常捕获**：捕获并记录所有运行时错误
- **自动停止**：达到最大重试次数后停止运行
- **资源清理**：确保不会造成内存泄漏

## 兼容性

### 浏览器支持

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### 用户脚本管理器

- ✅ Tampermonkey
- ✅ Violentmonkey

## 常见问题

### Q: 脚本没有自动点击怎么办？

A: 请检查以下几点：

1. 确认用户脚本管理器已启用
2. 检查脚本是否在 Linux.DO 域名下激活
3. 开启调试模式查看控制台日志
4. 确认页面中存在"显示更多"按钮

### Q: 如何调整点击频率？

A: 修改 `CONFIG.CHECK_INTERVAL` 的值：

- 更快：设置为 1000（1秒）
- 更慢：设置为 5000（5秒）

### Q: 脚本会影响页面性能吗？

A: 不会，脚本具有以下优化：

- 页面隐藏时自动暂停
- 轻量级的 DOM 查询
- 智能的重试机制
- 及时的资源清理

### Q: 如何完全停止脚本？

A: 有以下几种方法：

1. 在用户脚本管理器中禁用脚本
2. 刷新页面
3. 修改脚本让其达到最大重试次数

## 更新日志

### v0.1.3

- 删除 `@noframes` 声明，兼容 utags-shortcuts 在 iframe 模式下运行

### v0.1.0 (2025-08-14)

- ✨ 初始版本发布
- 🚀 智能按钮检测和点击
- 🛡️ 完善的错误处理机制
- ⚡ 页面可见性感知
- 🔧 可配置的参数设置
- 📝 调试模式支持

## 更多实用脚本

以下是一些其他有用的脚本，可以增强您的浏览体验：

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links)
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

本项目采用 [MIT 许可证](https://github.com/utags/userscripts/blob/main/LICENSE)。

### 报告问题

如果遇到问题，请在 [GitHub Issues](https://github.com/utags/userscripts/issues) 中报告，并提供：

- 浏览器版本
- 用户脚本管理器版本
- 错误信息或截图
- 复现步骤

## 相关链接

- [UTags 项目主页](https://github.com/utags/userscripts)
- [Linux.DO 论坛](https://linux.do)
- [Tampermonkey 官网](https://www.tampermonkey.net/)

---

**注意**：本脚本仅用于提升用户体验，请遵守 Linux.DO 论坛的使用条款。
