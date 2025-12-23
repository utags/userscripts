# No GIF Avatars - 屏蔽 GIF 头像

一个高效的油猴脚本，用于将动态 GIF 头像转换为静态图片，提供更流畅的浏览体验。

## 🌟 功能特性

- **智能转换**：自动检测并转换 GIF 和 WebP 动画头像为静态 PNG 格式
- **性能优化**：使用 WeakSet 避免重复处理，防抖机制减少不必要的计算
- **动画禁用**：禁用页面中的各种 CSS 动画效果，包括文字、图标和徽章动画
- **装饰隐藏**：自动隐藏头像装饰框架，保持界面简洁
- **实时监控**：监听 DOM 变化，自动处理动态加载的新头像
- **错误处理**：完善的异常处理机制，确保脚本稳定运行
- **调试支持**：内置调试日志功能，便于问题排查

## 🎯 支持网站

- [Linux.do](https://linux.do/) - Linux 中文社区
- [NodeLoc](https://www.nodeloc.com/) - 节点分享社区

## 📦 安装方法

### 前置要求

1. 安装浏览器扩展管理器（选择其一）：
   - [Tampermonkey](https://www.tampermonkey.net/) （推荐）
   - [Violentmonkey](https://violentmonkey.github.io/)

### 安装脚本

1. 点击 [这里](https://github.com/utags/userscripts/raw/main/no-gif-avatars/no-gif-avatars.user.js) 从 GitHub 安装脚本
2. 点击 [这里](https://greasyfork.org/zh-CN/scripts/529447-no-gif-avatars) 从 Greasy Fork 安装脚本

## 🚀 使用说明

脚本安装后会自动运行，无需手动操作：

1. **自动转换**：访问支持的网站时，脚本会自动检测并转换动态头像
2. **实时处理**：页面动态加载的新内容也会被自动处理
3. **样式应用**：自动禁用各种动画效果，提供静态浏览体验

## ⚙️ 配置选项

脚本提供了丰富的配置选项，可在代码中的 `CONFIG` 对象中修改：

```javascript
const CONFIG = {
  OBSERVER_DELAY: 50,           // DOM 变化处理延迟（毫秒）
  AVATAR_SELECTORS: [...],      // 头像选择器数组
  GIF_EXTENSIONS: ['.gif', '.webp'], // 需要转换的动画格式
  REPLACEMENT_EXTENSION: '.png',     // 目标静态格式
  DEBUG: false,                 // 启用调试日志
}
```

### 主要配置说明

- **OBSERVER_DELAY**：调整 DOM 变化检测的防抖延迟，较小值响应更快但可能增加 CPU 使用
- **AVATAR_SELECTORS**：自定义头像元素的 CSS 选择器，可根据网站结构调整
- **GIF_EXTENSIONS**：指定需要转换的动画图片格式
- **DEBUG**：开启后在浏览器控制台显示详细的处理日志

## 🔧 技术实现

### 核心功能

1. **图片检测**：使用多个 CSS 选择器精确定位头像元素
2. **格式判断**：检查图片 URL 中的文件扩展名识别动画格式
3. **URL 转换**：使用正则表达式替换动画格式为静态格式
4. **重复避免**：使用 WeakSet 跟踪已处理的图片元素
5. **性能优化**：防抖机制避免频繁的 DOM 操作

### 样式处理

脚本会注入 CSS 样式来禁用以下动画：

- 用户名文字特效和阴影
- FontAwesome 图标动画（beat、bounce、fade 等）
- 用户徽章动画
- 头像装饰框架
- 图片过渡效果

### DOM 监听

使用 `MutationObserver` 监听页面变化：

- 监听子节点添加事件
- 递归检查新增的图片元素
- 防抖处理避免过度触发

## 🌐 浏览器兼容性

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 🐛 故障排除

### 常见问题

**Q: 脚本没有生效？**
A: 请检查：

- 扩展管理器是否已启用
- 脚本是否在目标网站上激活
- 浏览器控制台是否有错误信息

**Q: 某些头像仍然是动态的？**
A: 可能原因：

- 网站使用了特殊的头像加载方式
- 需要调整 `AVATAR_SELECTORS` 配置
- 开启 `DEBUG` 模式查看处理日志

**Q: 页面加载变慢？**
A: 尝试：

- 增加 `OBSERVER_DELAY` 值
- 精简 `AVATAR_SELECTORS` 数组
- 关闭 `DEBUG` 模式

### 调试方法

1. 开启调试模式：设置 `CONFIG.DEBUG = true`
2. 打开浏览器开发者工具（F12）
3. 查看控制台中的 `[No GIF Avatars]` 日志
4. 根据日志信息定位问题

## 📝 更新日志

### v0.1.2

- 删除 `@noframes` 声明，兼容 utags-shortcuts 在 iframe 模式下运行

### v0.1.1 (2025-08-14)

- ✨ 初始版本发布
- 🚀 支持 GIF 和 WebP 动画转换
- 🎨 禁用多种 CSS 动画效果
- 🔧 添加配置选项和调试功能
- 📱 优化性能和错误处理
- 🌐 支持 Linux.do 和 NodeLoc 网站

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

## 📄 许可证

本项目采用 [MIT 许可证](https://github.com/utags/userscripts/blob/main/LICENSE)。

## 🔗 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
- [Tampermonkey 官网](https://www.tampermonkey.net/)

---

**注意**：本脚本仅用于改善浏览体验，不会收集或传输任何用户数据。
