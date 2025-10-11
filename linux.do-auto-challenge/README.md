# LINUX.DO CloudFlare 5秒盾自动跳转

## 简介

这个用户脚本能在 linux.do 网站上当 CloudFlare 5秒盾检测失败时，自动跳转到 challenge 页面，提升浏览体验，无需手动干预。

## 功能特点

- 自动检测 CloudFlare 保护失败状态
- 立即重定向到 challenge 页面
- 提供手动触发 Challenge 跳转的菜单选项
- 提升 linux.do 的浏览体验
- 轻量级且高效的实现

## 安装方法

1. 确保您的浏览器已安装用户脚本管理器：
   - [Tampermonkey](https://www.tampermonkey.net/)（推荐）
   - [Violentmonkey](https://violentmonkey.github.io/)

2. 安装此脚本：
   - 点击 [这里](https://github.com/utags/userscripts/raw/main/linux.do-auto-challenge/linux.do-auto-challenge.user.js) 从 GitHub 安装脚本
   - 点击 [这里](https://greasyfork.org/zh-CN/scripts/552218-linux-do-cloudflare-challenge-bypass) 从 Greasy Fork 安装脚本

## 工作原理

该脚本监控页面中的 CloudFlare 错误消息。当它在对话框中检测到特定的错误文本时，会自动重定向到 challenge 页面，这有助于绕过 CloudFlare 保护。

## 更新日志

### v0.2.0 (2025-10-11)

- 添加手动触发 Challenge 跳转的菜单选项
- 优化用户体验，提供更直观的操作方式
- 更新脚本权限，支持菜单命令功能

### v0.1.1 (2025-10-11)

- 优化脚本结构，提高代码可维护性
- 添加错误处理和日志记录功能
- 改进检测逻辑，只检查带有 dialog-body 类的元素
- 创建 isChallengePage 函数，提高代码一致性

### v0.1.0 (2025-10-11)

- 首次发布
- 实现基本的 CloudFlare 失败检测功能
- 自动跳转到 challenge 页面

## 更多实用脚本

以下是一些其他有用的脚本，可以增强您的浏览体验：

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links)
- **功能**：为用户、帖子、视频和其他链接添加自定义标签和备注
- **亮点**：支持特殊标签过滤（如垃圾、屏蔽、标题党等），数据导出/导入，自动标记已查看帖子
- **支持网站**：V2EX、X(Twitter)、Reddit、GitHub、哔哩哔哩、知乎、Linux.do、Youtube 等 50+ 网站
- **描述**：超级实用的标签管理工具，可为论坛用户或帖子添加标签，轻松识别或屏蔽低质量内容

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

## 贡献

欢迎贡献！请随时提交拉取请求。

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
