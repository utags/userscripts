# Find Scripts For This Site - 查找适用于当前网站的脚本

一个实用的用户脚本，帮助你快速查找适用于当前浏览网站的用户脚本，支持多个主流脚本仓库。

[English Version](https://github.com/utags/userscripts/blob/main/find-scripts-for-this-site/README.md)

![screenshot](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-09-25-19-48-03.png)

## 功能特性

- 🔍 **一键搜索** - 快速在多个脚本仓库中查找适用于当前网站的脚本
- 🌐 **多仓库支持** - 支持 Greasy Fork、OpenUserJS、ScriptCat、GitHub 和 GitHub Gist
- 🌍 **多语言支持** - 自动适配浏览器语言，支持8种常用语言
- 🧩 **智能域名提取** - 自动提取顶级域名，确保搜索结果准确
- 🛡️ **错误处理** - 完善的异常处理机制，确保脚本稳定运行
- 🔧 **可配置** - 支持调试模式和自定义设置

## 安装方法

### 前提条件

确保你的浏览器已安装以下油猴脚本管理器之一：

- [Tampermonkey](https://www.tampermonkey.net/)
- [Violentmonkey](https://violentmonkey.github.io/)
- [ScriptCat](https://scriptcat.org/)

### 安装步骤

1. 点击 [这里](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js) 从 GitHub 安装脚本
2. 点击 [这里](https://greasyfork.org/scripts/550659-find-scripts-for-this-site) 从 Greasy Fork 安装脚本

## 使用说明

### 基本使用

1. 访问任意网站
2. 点击浏览器工具栏中的油猴扩展图标
3. 在弹出的菜单中，你会看到以下选项：
   - 🍴 在 Greasy Fork 上按域名查找脚本
   - 🍴 在 Greasy Fork 上按关键字查找脚本
   - 📜 在 OpenUserJS 上按关键字查找脚本
   - 🐱 在 ScriptCat 上按域名查找脚本
   - 🐱 在 ScriptCat 上按关键字查找脚本
   - 🐙 在 GitHub 上按关键字查找脚本
   - 📝 在 GitHub Gist 上按关键字查找脚本
4. 点击任意选项，将在新标签页中打开对应网站的搜索结果

### 多语言支持

脚本会自动检测浏览器语言并显示相应的菜单文本，目前支持以下语言：

- 英文 (English)
- 简体中文
- 繁体中文
- 日文 (日本語)
- 韩文 (한국어)
- 西班牙文 (Español)
- 法文 (Français)
- 德文 (Deutsch)
- 俄文 (Русский)

## 技术实现

### 核心功能

- **域名提取**：智能提取当前网站的顶级域名，处理子域名和特殊域名格式
- **菜单注册**：使用 `GM_registerMenuCommand` 注册多个搜索选项
- **国际化支持**：根据浏览器语言自动选择合适的菜单文本
- **新标签页打开**：使用 `GM_openInTab` 在新标签页中打开搜索结果

### 支持的脚本仓库

| 仓库名称    | 图标 | 搜索方式                     |
| ----------- | ---- | ---------------------------- |
| Greasy Fork | 🍴   | 域名搜索、关键字搜索         |
| Sleazy Fork | 🔞   | 域名搜索、关键字搜索         |
| OpenUserJS  | 📜   | 关键字搜索                   |
| ScriptCat   | 🐱   | 域名搜索、关键字搜索         |
| GitHub      | 🐙   | 关键字搜索（JavaScript代码） |
| GitHub Gist | 📝   | 关键字搜索（JavaScript代码） |

## 配置选项

脚本提供了可配置的选项，位于 `CONFIG` 对象中：

```javascript
const CONFIG = {
  REPOSITORIES: [
    // 仓库配置...
  ],
  DEBUG: false, // 调试模式开关
}
```

### 启用调试模式

如需查看详细的运行日志，可以将 `CONFIG.DEBUG` 设置为 `true`：

```javascript
DEBUG: true,
```

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 故障排除

### 常见问题

**Q: 菜单项没有显示？**

A: 请检查：

1. 确认已正确安装脚本
2. 确认脚本已启用
3. 刷新页面重试

**Q: 搜索结果不准确？**

A: 可能原因：

1. 网站使用了复杂的域名结构
2. 启用调试模式查看提取的域名是否正确

### 调试步骤

1. 启用调试模式（设置 `DEBUG: true`）
2. 打开浏览器开发者工具的控制台
3. 刷新页面，查看日志输出
4. 根据日志信息定位问题

## 更新日志

### v0.2.0

- ⚙️ 添加设置界面，可启用/禁用特定搜索方法
- 🔄 为每个仓库的域名搜索和关键字搜索提供独立开关
- 🔞 添加 Sleazy Fork 仓库支持

### v0.1.1

- ✨ 为所有仓库添加关键字搜索功能
- 🔍 根据仓库特性优化菜单显示
- 🧹 重构代码提高可维护性
- 📊 更新文档中的仓库搜索方法说明

### v0.1.0 (初始版本)

- ✨ 支持多个脚本仓库搜索
- 🌍 添加多语言支持
- 🧩 智能域名提取功能
- 🛡️ 完善的错误处理机制

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
