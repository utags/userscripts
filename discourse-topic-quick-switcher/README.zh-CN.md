# Discourse 话题快捷切换器

一款强大的用户脚本，为 Discourse 论坛带来无缝话题导航、当前话题智能高亮和自适应主题切换功能。让您以前所未有的速度和效率浏览您喜爱的论坛。

## 功能特点

- **话题列表缓存**：当您访问列表页面时自动缓存话题列表
- **快速访问**：通过以下方式从任何话题页面访问缓存的列表：
  - 右下角的悬浮按钮
  - 键盘快捷键（反引号键 `` ` ``）
- **用户友好界面**：
  - 显示缓存时间和来源信息
  - 从弹出面板直接导航到话题
  - 通过 ESC 键、关闭按钮或点击面板外部关闭
  - 当前话题高亮显示，方便识别
  - 自动滚动到列表中的当前话题
- **智能主题检测**：
  - 根据系统和网站偏好自动适应明/暗模式
- **缓存管理**：
  - 1小时缓存过期时间，带有视觉指示器
  - 源链接可返回原始列表页面

## 安装

1. 安装用户脚本管理器，如 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)
2. [点击此处安装此脚本](https://github.com/utags/userscripts/raw/main/discourse-topic-quick-switcher/discourse-topic-quick-switcher.user.js)
3. 访问任何 Discourse 论坛，享受增强的导航体验！

## 使用方法

1. **缓存话题列表**：
   - 访问任何 Discourse 论坛话题列表页面（最新、新建、分类等）
   - 脚本会自动缓存当前列表

2. **查看缓存的列表**：
   - 在查看话题时，可以：
     - 点击右下角的悬浮按钮
     - 按下反引号键（`` ` ``）
   - 将出现一个弹出窗口，显示缓存的话题列表

3. **在话题间导航**：
   - 点击弹出窗口中的任何话题以导航到该话题
   - 选择后弹出窗口将自动关闭

4. **关闭弹出窗口**：
   - 点击 × 按钮
   - 按下 ESC 键
   - 点击弹出窗口外部

## 配置

您可以在脚本顶部修改以下设置：

```javascript
const CONFIG = {
  // 键盘快捷键（默认为反引号键）
  HOTKEY: '`',
  // 缓存键名
  CACHE_KEY: 'discourse_topic_list_cache',
  // 缓存过期时间（毫秒）- 1小时
  CACHE_EXPIRY: 60 * 60 * 1000,
  // 是否在话题页显示悬浮按钮
  SHOW_FLOATING_BUTTON: true,
  // 路由检查间隔（毫秒）
  ROUTE_CHECK_INTERVAL: 500,
  // 是否自动跟随系统深色模式
  AUTO_DARK_MODE: true,
}
```

## 兼容性

此脚本适用于所有 Discourse 论坛，并已在以下浏览器上测试：

- Chrome
- Firefox
- Safari

## 发布记录

### v0.1.0

- 初始发布
- 基本话题列表缓存功能
- 快速访问的悬浮按钮
- 键盘快捷键支持
- 缓存过期指示器
- 添加当前话题高亮显示功能
- 添加自动滚动到当前话题的功能
- 添加点击列表外部关闭列表的功能
- 改进深色模式支持，增加自动主题检测

## 许可证

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 贡献

欢迎贡献！请随时提交拉取请求。
