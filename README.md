# Userscripts Collection

一个实用的油猴脚本合集，专为改善网页浏览体验而设计。

## 📦 脚本列表

### 1. [Find Scripts For This Site](./find-scripts-for-this-site/)

**查找适用于当前网站的脚本**

- **文件**: [`find-scripts-for-this-site.user.js`](./find-scripts-for-this-site/find-scripts-for-this-site.user.js)
- **功能**: 快速查找适用于当前网站的用户脚本，支持多个主流脚本仓库
- **适用网站**: 所有网站
- **说明**: 获取当前网站的一级域名，并添加命令菜单，跳转到 Greasy Fork、OpenUserJS、ScriptCat、GitHub 和 GitHub Gist 的搜索结果页面

### 2. [Discourse Topic Quick Switcher](./discourse-topic-quick-switcher/)

**Discourse 话题快捷切换器**

- **文件**: [`discourse-topic-quick-switcher.user.js`](./discourse-topic-quick-switcher/discourse-topic-quick-switcher.user.js)
- **功能**: 为 Discourse 论坛带来无缝话题导航、当前话题高亮显示和上一个/下一个话题的快速导航功能
- **适用网站**: 所有 Discourse 论坛
- **说明**: 自动缓存话题列表，通过悬浮按钮或键盘快捷键快速访问，支持自定义设置和多语言

### 3. [LINUX.DO Auto Load New Topics](./linux.do-auto-load-new-topics/)

**自动加载新话题**

- **文件**: [`linux.do-auto-load-new-topics.user.js`](./linux.do-auto-load-new-topics/linux.do-auto-load-new-topics.user.js)
- **功能**: 智能自动加载新话题，带有错误处理和检测优化
- **适用网站**: [Linux.do](https://linux.do/)
- **说明**: 自动检测并加载页面中的新话题，提升浏览效率

### 4. [LINUX.DO Load More Topics Manually](./linux.do-manual-load-more/)

**手动加载更多话题**

- **文件**: [`linux.do-manual-load-more.user.js`](./linux.do-manual-load-more/linux.do-manual-load-more.user.js)
- **功能**: 手动加载更多话题，具有增强的用户界面和错误处理
- **适用网站**: [Linux.do](https://linux.do/)
- **说明**: 在页面底部添加"加载更多"按钮，支持手动控制内容加载

### 5. [No GIF Avatars](./no-gif-avatars/)

**屏蔽 GIF 头像**

- **文件**: [`no-gif-avatars.user.js`](./no-gif-avatars/no-gif-avatars.user.js)
- **功能**: 将动图头像转换为静态图片，具有增强的性能和错误处理
- **适用网站**: [Linux.do](https://linux.do/)、[NodeLoc](https://www.nodeloc.com/)
- **说明**: 自动将 GIF 和 WebP 动画头像转换为静态 PNG 格式，减少页面动画干扰

## 🚀 安装方法

### 前置要求

1. 安装浏览器扩展管理器（选择其一）：
   - [Tampermonkey](https://www.tampermonkey.net/) （推荐）
   - [Greasemonkey](https://www.greasespot.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)

### 安装脚本

1. 点击上方脚本列表中的文件链接
2. 复制脚本内容
3. 在扩展管理器中创建新脚本并粘贴代码
4. 保存并启用脚本

## 📖 使用说明

每个脚本都有独立的 README 文档，详细说明了功能特性、配置选项和使用方法：

- [Find Scripts For This Site 说明](./find-scripts-for-this-site/README.md)
- [Discourse Topic Quick Switcher 说明](./discourse-topic-quick-switcher/README.md)
- [LINUX.DO Auto Load New Topics 说明](./linux.do-auto-load-new-topics/README.md)
- [LINUX.DO Load More Topics Manually 说明](./linux.do-manual-load-more/README.md)
- [No GIF Avatars 说明](./no-gif-avatars/README.md)

## 🔧 更多实用脚本

以下是一些与本项目脚本功能互补的优秀用户脚本，推荐一起使用以获得更好的浏览体验：

### 🏷️ 小鱼标签 (UTags) - 为链接添加用户标签

- **链接**: [Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links)
- **功能**: 为用户、帖子、视频等链接添加自定义标签和备注信息
- **特色**: 支持特殊标签过滤（如 sb、block、标题党等），数据导出导入，自动标记浏览过的帖子
- **支持网站**: V2EX、X(Twitter)、Reddit、GitHub、B站、知乎、Linux.do、NodeLoc 等 50+ 网站
- **说明**: 超实用的标签管理工具，可以给论坛用户或帖子添加标签，便于识别或屏蔽低质量内容

### 🔗 链接助手

- **链接**: [Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper)
- **功能**: 在新标签页中打开第三方网站链接，解析文本链接为超链接
- **特色**: 支持自定义规则，解析 Markdown 和 BBCode 格式，图片链接转图片标签
- **支持网站**: 所有网站通用，包括 Google、YouTube、GitHub、微信公众号等
- **说明**: 提升链接浏览体验，自动处理各种格式的链接，让网页浏览更加便捷

### 📝 V2EX.REP - 专注提升 V2EX 主题回复浏览体验

- **链接**: [Greasy Fork](https://greasyfork.org/zh-CN/scripts/466589-v2ex-rep-%E4%B8%93%E6%B3%A8%E6%8F%90%E5%8D%87-v2ex-%E4%B8%BB%E9%A2%98%E5%9B%9E%E5%A4%8D%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C)
- **功能**: 修复楼层号错位，显示热门回复，自动预加载分页，回复上传图片
- **特色**: 无感自动签到，快速感谢/隐藏回复，双击空白处快速导航
- **支持网站**: V2EX
- **说明**: V2EX 必装脚本，全面提升主题回复的浏览和交互体验

### 🔃 赐你个头像吧 - 换掉别人的头像与昵称

- **链接**: [Greasy Fork](https://greasyfork.org/zh-CN/scripts/472616-replace-ugly-avatars)
- **功能**: 批量替换用户头像，支持多种随机头像风格
- **特色**: 使用 DiceBear API 生成随机头像，支持统一风格设置
- **支持网站**: V2EX、Linux.do
- **说明**: 改善视觉体验，避免注意力分散，特别适合有强迫症或希望统一头像风格的用户

## 🌐 浏览器兼容性

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 🤝 贡献指南

欢迎提交问题报告和功能建议！

1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

## 🔗 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
- [Tampermonkey 官网](https://www.tampermonkey.net/)

---

**注意**：所有脚本仅用于改善浏览体验，不会收集或传输任何用户数据。
