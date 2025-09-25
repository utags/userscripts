# LINUX.DO Auto Load New Topics

一个智能的用户脚本，用于自动加载 Linux.DO 论坛的新话题，无需手动点击"显示更多"按钮。

![screenshot](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-08-14-14-42-52.png)

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
- [Greasemonkey](https://www.greasespot.net/)
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
- ✅ Greasemonkey
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

### v0.1.0 (2025-08-14)

- ✨ 初始版本发布
- 🚀 智能按钮检测和点击
- 🛡️ 完善的错误处理机制
- ⚡ 页面可见性感知
- 🔧 可配置的参数设置
- 📝 调试模式支持

## 许可证

本项目采用 [MIT 许可证](https://github.com/utags/userscripts/blob/main/LICENSE)。

## 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

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
