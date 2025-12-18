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

### v0.1.0 (2025-08-14)

- ✨ 全新的现代化用户界面
- 🛡️ 完善的错误处理机制
- ⚡ 优化的性能和 DOM 检测
- 🎨 支持悬停效果和加载状态
- 📝 详细的代码注释和文档
- 🔧 可配置的参数设置

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发环境

1. 克隆仓库
2. 安装依赖（如有）
3. 在浏览器中安装脚本进行测试

### 代码规范

- 使用 Prettier 格式化代码
- 函数必须包含 JSDoc 注释
- 变量和函数使用驼峰命名法
- 常量使用大写字母和下划线

## 许可证

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 相关链接

- [LINUX.DO 论坛](https://linux.do)
- [Tampermonkey 官网](https://www.tampermonkey.net/)
- [项目主页](https://github.com/utags/userscripts)

---

如果这个脚本对你有帮助，请考虑给项目点个 ⭐ Star！
