# 小鱼标签 (UTags) 导入助手

把其他 V2EX 相关脚本保存的“标签数据”，转换成小鱼标签（UTags）可导入的备份 JSON，并自动下载。

## 安装

- 安装地址：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/572962-utags-import-helper) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/5847) · [GitHub](https://github.com/utags/userscripts/raw/main/utags-import-helper/utags-import-helper.user.js)

## 支持的数据来源

- V2EX Next
  - 笔记标题前缀：`--用户标签--`
  - 数据结构：`{ [用户名]: 标签列表 }`（标签列表支持数组或字符串）
- V2EX Polish
  - 笔记标题前缀：`V2EX_Polish_settings`
  - 数据结构：`{ "member-tag": { [用户名]: { avatar?: string, tags: 标签列表 } } }`
  - 会忽略 `avatar` 字段，只读取 `tags`

## 工作原理

- 访问 `/notes`，在你的 V2EX 笔记列表中找到标题包含指定前缀的第一条笔记
- 访问 `/notes/edit/:id`，从编辑器内容里解析出 JSON
- 生成并自动下载文件，例如：
  - `utags-backup-v2ex-next-YYYYMMDD_HHMMSS.json`
  - `utags-backup-v2ex-polish-YYYYMMDD_HHMMSS.json`

## 使用方法

1. 在浏览器中登录 V2EX。
2. 确保来源脚本已经把数据写入你的 V2EX 笔记：
   - V2EX Next：开启它的“用户标签”功能，让它创建/更新 `--用户标签--` 笔记
   - V2EX Polish：确保它创建/更新了 `V2EX_Polish_settings` 笔记
3. 打开任意 V2EX 页面，在用户脚本菜单中执行：
   - “🏷️ 从 V2EX Next 导出为 UTags 备份”
   - “🏷️ 从 V2EX Polish 导出为 UTags 备份”
4. 访问 https://utags.link/
5. 打开 设置 > 数据管理 > 导入数据 > 选择下载得到的 JSON 文件

## 常见问题

- 提示“未找到笔记：...”：
  - 未登录，或来源脚本尚未创建对应笔记
  - 先打开来源脚本的设置/功能页让它初始化一次
- 导出的文件为空：
  - 笔记存在但 JSON 为空/格式不正确，或标签列表为空

## 隐私说明

- 只会对 `v2ex.com` / `v2ex.co` 的笔记页面发起同源请求（`/notes`、`/notes/edit/:id`）
- 脚本只读：不会修改你的笔记，只会在本地下载转换后的 JSON
- 不会上传数据到任何服务器，不会收集任何数据

## 变更日志

- 0.1.0
  - 初始版本
  - 支持从 V2EX Next 导出为 UTags 备份
  - 支持从 V2EX Polish 导出为 UTags 备份

## 更多实用脚本

以下是一些其他有用的脚本，可以增强您的浏览体验：

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/569761-utags-add-usertags-to-links) · [Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/2784) · [GitHub](https://github.com/utags/utags/raw/main/packages/extension/build/userscript-prod/utags.user.js)
- **功能**：为用户、帖子、视频和其他链接添加自定义标签和备注
- **亮点**：支持特殊标签过滤（如垃圾、屏蔽、标题党等），数据导出/导入，自动标记已查看帖子
- **支持网站**：V2EX、X(Twitter)、Reddit、GitHub、哔哩哔哩、知乎、Linux.do、Youtube 等 50+ 网站
- **描述**：超级实用的标签管理工具，可为论坛用户或帖子添加标签，轻松识别或屏蔽低质量内容

### 🧰 UTags Advanced Filter

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/556095-utags-advanced-filter) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4653) · [GitHub](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)
- **功能**：支持在 GreasyFork 实时过滤与隐藏脚本
- **亮点**：同时提供用户脚本与浏览器扩展两个版本
- **支持网站**：Greasy Fork
- **描述**：支持在 GreasyFork 实时过滤与隐藏脚本的工具，提供用户脚本和浏览器扩展两种版本。

### ⚡ UTags 快捷导航 (UTags Shortcuts)

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/558485-utags-shortcuts) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4910) · [GitHub](https://github.com/utags/userscripts/raw/main/utags-shortcuts/utags-shortcuts.user.js)
- **功能**：按站点分组、自定义图标、悬浮球或侧边栏导航面板
- **亮点**：悬浮/侧边栏模式、支持链接与脚本、可视化编辑、快捷键支持
- **支持网站**：所有网站
- **描述**：一款功能强大的用户脚本，提供便捷的快捷导航面板，帮助你高效管理常用链接与自动化脚本，提升浏览体验

### 🔗 链接助手

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4486) · [GitHub](https://github.com/utags/links-helper/raw/refs/heads/main/build/userscript-prod/links-helper.user.js)
- **功能**：在新标签页中打开第三方网站链接，将文本链接解析为超链接
- **亮点**：支持自定义规则，解析 Markdown 和 BBCode 格式，将图片链接转换为图片标签
- **支持网站**：适用于所有网站，包括谷歌、YouTube、GitHub、V2EX 等
- **描述**：增强链接浏览体验，自动处理各种链接格式，使网页浏览更加便捷

### 🔍 查找适用于当前网站的脚本

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/550659-find-scripts-for-this-site) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4276) · [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js)
- **功能**：快速查找当前网站的用户脚本
- **亮点**：支持多个流行的脚本仓库，轻松发现有用的脚本
- **支持网站**：适用于任何网站，查找相关用户脚本
- **描述**：一个方便的工具，用于发现和安装专为您访问的网站设计的用户脚本

### 🖼️ 通用图片上传助手 (Universal Image Uploader)

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/553341-universal-image-uploader) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4467) · [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js)
- **功能**：粘贴/拖拽/选择图片批量上传到 Imgur/Tikolu/MJJ.Today/Appinn
- **亮点**：自动复制为 Markdown/HTML/BBCode/链接，支持站点按钮与本地历史，兼容单页应用 (SPA)
- **支持网站**：所有网站
- **描述**：在任意网站上粘贴、拖拽或选择图片，批量上传到图床，并按需自动复制为多种格式，支持本地历史记录以便快速复用

### 🔄 Discourse 话题快捷切换器

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/550982-discourse-topic-quick-switcher)
- **功能**：在 Discourse 论坛中快速导航切换主题
- **亮点**：键盘快捷键、导航按钮、带语言选项的设置对话框
- **支持网站**：所有基于 Discourse 的论坛，包括 Discourse Meta、LINUX.DO 等
- **描述**：通过便捷的主题切换和可自定义设置，增强 Discourse 论坛中的导航体验

## 许可证

MIT License — 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE)

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
