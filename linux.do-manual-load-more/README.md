# LINUX.DO Manual Load More

一个用于 LINUX.DO 论坛的油猴脚本，提供手动加载更多话题的功能，具有现代化的用户界面和完善的错误处理机制。

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-08-14-15-07-39.png)

## 功能特性

- 🎯 **手动控制加载** - 替换自动加载为手动按钮控制
- 🎨 **现代化界面** - 美观的按钮设计，支持悬停效果和加载状态
- 🛡️ **错误处理** - 完善的异常处理和调试日志系统
- ⚡ **性能优化** - 智能的 DOM 变化检测，避免不必要的重复初始化
- 🔧 **可配置** - 支持调试模式和各种参数配置
- 🚫 **防重复点击** - 加载期间自动禁用按钮，防止重复请求

## 安装方法

### 前提条件

确保你的浏览器已安装以下油猴脚本管理器之一：

- [Tampermonkey](https://www.tampermonkey.net/)
- [Violentmonkey](https://violentmonkey.github.io/)

### 安装步骤

1. 点击 [这里](https://github.com/utags/userscripts/raw/main/linux.do-manual-load-more/linux.do-manual-load-more.user.js) 从 GitHub 安装脚本
2. 点击 [这里](https://greasyfork.org/zh-CN/scripts/545779-linux-do-load-more-topics-manually) 从 Greasy Fork 安装脚本
3. 访问 [LINUX.DO](https://linux.do) 即可使用

## 使用说明

### 基本使用

1. 访问 LINUX.DO 论坛的任意页面
2. 滚动到页面底部，原本的自动加载区域会被隐藏
3. 点击蓝色的 "Load More" 按钮手动加载更多内容
4. 加载期间按钮会显示 "Loading..." 状态并变为灰色
5. 加载完成后按钮恢复正常状态

### 按钮状态说明

| 状态   | 外观                        | 说明                 |
| ------ | --------------------------- | -------------------- |
| 正常   | 蓝色按钮，显示 "Load More"  | 可以点击加载更多内容 |
| 悬停   | 深蓝色，轻微上移效果        | 鼠标悬停时的视觉反馈 |
| 加载中 | 灰色按钮，显示 "Loading..." | 正在加载，按钮被禁用 |

## 配置选项

脚本提供了多个可配置的参数，位于 `CONFIG` 对象中：

```javascript
const CONFIG = {
  BUTTON_ID: 'userscript-load-more-button', // 按钮的 ID
  SENTINEL_SELECTOR: '.load-more-sentinel', // 加载触发器的选择器
  LOAD_TIMEOUT: 1000, // 加载超时时间（毫秒）
  OBSERVER_DELAY: 100, // DOM 观察器延迟（毫秒）
  DEBUG: false, // 是否启用调试模式
}
```

### 启用调试模式

如需查看详细的运行日志，可以将 `CONFIG.DEBUG` 设置为 `true`：

```javascript
DEBUG: true,
```

启用后，浏览器控制台会显示详细的操作日志，包括：

- 脚本初始化状态
- 按钮创建和插入过程
- 加载操作的执行情况
- DOM 变化检测结果
- 错误信息（如有）

## 技术实现

### 核心功能

- **DOM 操作** - 动态创建和插入加载按钮
- **事件处理** - 监听按钮点击和鼠标悬停事件
- **状态管理** - 跟踪加载状态，防止重复操作
- **样式应用** - 使用 JavaScript 动态应用现代化样式

### 关键组件

1. **`createLoadMoreButton()`** - 创建具有现代化样式的按钮
2. **`handleLoadMore()`** - 处理加载更多的核心逻辑
3. **`initLoadMore()`** - 初始化脚本功能
4. **`MutationObserver`** - 监听 DOM 变化，确保脚本在页面更新后仍能正常工作

### 兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 故障排除

### 常见问题

**Q: 按钮没有出现**

A: 请检查：

1. 确认已正确安装脚本
2. 确认脚本已启用
3. 刷新页面重试
4. 启用调试模式查看控制台日志

**Q: 点击按钮没有反应**

A: 可能的原因：

1. 页面结构发生变化，选择器失效
2. 网络连接问题
3. 启用调试模式查看具体错误信息

**Q: 按钮样式异常**

A: 可能是页面 CSS 冲突，脚本使用内联样式应该能覆盖大部分情况。

### 调试步骤

1. 启用调试模式（设置 `DEBUG: true`）
2. 打开浏览器开发者工具的控制台
3. 刷新页面，查看日志输出
4. 根据日志信息定位问题

## 更新日志

### v0.1.2

- 删除 `@noframes` 声明，兼容 utags-shortcuts 在 iframe 模式下运行

### v0.1.0 (2025-08-14)

- ✨ 全新的现代化用户界面
- 🛡️ 完善的错误处理机制
- ⚡ 优化的性能和 DOM 检测
- 🎨 支持悬停效果和加载状态
- 📝 详细的代码注释和文档
- 🔧 可配置的参数设置

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

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 相关链接

- [LINUX.DO 论坛](https://linux.do)
- [Tampermonkey 官网](https://www.tampermonkey.net/)
- [项目主页](https://github.com/utags/userscripts)

---

如果这个脚本对你有帮助，请考虑给项目点个 ⭐ Star！
