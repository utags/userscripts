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

### v0.1.1 (2025-08-14)

- ✨ 初始版本发布
- 🚀 支持 GIF 和 WebP 动画转换
- 🎨 禁用多种 CSS 动画效果
- 🔧 添加配置选项和调试功能
- 📱 优化性能和错误处理
- 🌐 支持 Linux.do 和 NodeLoc 网站

## 🤝 贡献指南

欢迎提交问题报告和功能建议！

1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 开发规范

- 使用 Prettier 格式化代码
- 添加 JSDoc 注释
- 遵循现有的代码风格
- 测试新功能的兼容性

## 📄 许可证

本项目采用 [MIT 许可证](https://github.com/utags/userscripts/blob/main/LICENSE)。

## 🔗 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
- [Tampermonkey 官网](https://www.tampermonkey.net/)

---

**注意**：本脚本仅用于改善浏览体验，不会收集或传输任何用户数据。
