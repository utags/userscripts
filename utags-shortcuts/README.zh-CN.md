# UTags 快捷导航 (UTags Shortcuts)

**UTags 快捷导航** 是一款功能强大的用户脚本，提供悬浮球或侧边栏形式的快捷导航面板。它支持按站点分组、自定义图标以及执行 JS 脚本，帮助你高效管理常用链接，提升浏览体验。

[English Version](https://github.com/utags/userscripts/blob/main/utags-shortcuts/README.md)

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-22-38-53.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-07-10.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-17-50.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-09-19.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-12-29.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-16-56-24.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-13-59-40.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-16-56-11.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-16-52-20.png)
![screenshot](https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-17-03-52.gif)

## 核心功能

- **按站点智能分组**：根据当前访问的网站自动显示相关的导航组。你可以配置特定分组仅在特定的域名或 URL 模式下显示。
- **双重显示模式**：
  - **悬浮模式 (Floating)**：默认以边缘触条或悬浮球形式存在，鼠标悬停即展，不占用屏幕空间。
  - **侧边栏模式 (Sidebar)**：固定在屏幕左侧或右侧，内容常驻可见，适合宽屏用户。
- **多种项目类型**：
  - **链接 (URL)**：添加网页跳转链接，支持基于当前页面的相对路径。
  - **脚本 (JS)**：直接在菜单中运行简短的 JavaScript 代码片段，实现页面自动化。
- **个性化定制**：
  - **图标支持**：自动获取网站 Favicon，也支持自定义图标链接。
  - **主题跟随**：完美适配系统或网站的深色/浅色模式 (Dark/Light Mode)。
- **便捷管理**：
  - **快速添加**：一键将当前浏览的页面添加到指定分组。
  - **可视化编辑**：提供图形化界面，支持拖拽排序、分组管理和属性编辑。
- **快捷键支持**：默认使用 `Alt+Shift+K` 快速显示/隐藏面板。

## 安装方法

- 需要安装油猴脚本管理器：[Tampermonkey](https://www.tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/)、或 [ScriptCat](https://scriptcat.org/)
- 安装地址： [GitHub](https://github.com/utags/userscripts/raw/main/utags-shortcuts/utags-shortcuts.user.js) · [Greasy Fork](https://greasyfork.org/zh-CN/scripts/558485-utags-shortcuts) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4910)

## 使用指南

1.  **打开面板**：
    - 鼠标悬停在屏幕边缘的“触条”（默认位于屏幕右侧上部）。
    - 或者直接按下快捷键 `Alt+Shift+K`。
2.  **添加链接**：
    - 打开面板后，点击底部的 `+` 按钮，即可将当前页面添加到导航中。
    - 你可以选择添加到现有分组或创建新分组。
3.  **管理配置**：
    - 右键点击悬浮图标，或在面板中点击 **设置 (Settings)** 按钮，打开配置中心。
    - 在这里你可以：
      - 新建、编辑、删除分组。
      - 添加或修改具体的导航项（链接或脚本）。
      - 设置分组的匹配规则（决定分组在哪些网站显示）。
      - 切换显示模式（悬浮/侧边栏）及调整侧边栏位置。

## 应用场景

- **站点专属导航**：创建一个仅在 `github.com` 显示的“GitHub”分组，包含跳转到 Issues、Pull Requests 或特定仓库的快捷方式。
- **通用工具箱**：创建一个在所有网站 (`*`) 都显示的“常用工具”分组，放置翻译、JSON 格式化、图床等常用工具链接。
- **阅读辅助**：在小说或文档网站，配置“上一章”、“下一章”的快捷跳转（支持相对路径）。
- **开发调试**：配置一些 JS 脚本，用于快速填充表单、获取 Token 或切换测试环境。

## 个性化设置

进入设置面板，你可以自定义：

- **布局模式**：切换悬浮或侧边栏模式。
- **侧边栏位置**：设置在屏幕左侧或右侧。
- **打开方式**：设置点击链接时是在当前标签页打开还是新标签页打开。
- **外观样式**：调整边缘触条的大小、透明度和颜色。
- **快捷键**：自定义唤起面板的快捷键。

## 支持的变量

你可以在链接（URL）字段中使用以下变量，它们会被自动替换为当前页面的对应值：

- `{hostname}`: 当前主机名（例如 `www.baidu.com`）。
- `{hostname_without_www}`: 去除 `www.` 的主机名（例如 `baidu.com`）。
- `{hostname_top_level}`: 从当前 URL 提取的顶级域名（例如 `baidu.com`, `bbc.co.uk`）。
- `{current_url}`: 当前页面的完整 URL。
- `{current_url_encoded}`: 经过 URL 编码的完整 URL。
- `{current_title}`: 当前页面的标题。
- `{query}`: 从 URL 参数中提取的搜索关键词（自动检测 `q`, `query`, `kw`, `wd`, `keyword`, `p`, `s`, `term`）。
- `{selected}`: 页面上当前选中的文本。
- `{q:param}`: 指定查询参数的值（例如 `{q:id}` 获取 `?id=123` 中的 `123`）。
- `{p:n}`: URL 路径中的第 n 个片段（例如 `{p:1}` 获取 `/foo/bar` 中的 `foo`）。
- `{t:text}`: 直接返回文本（例如 `{t:hello}`）。
- **回退机制**: 使用 `||` 定义回退值（例如 `{selected||query||t:default}`）。

## 更新日志

### v0.3.x

- **兼容性优化**：Stay 脚本管理器禁止使用 Iframe 模式（因为 Stay 会强制删除新建的 iframe body）。
- **优化**：增加轮询机制作为跨标签页数据同步的兜底方案。
- 为不支持 `addValueChangeListener` 的脚本管理器增加监听数据变化的功能，实现跨标签页数据同步。

### v0.2.6

- **优化 Iframe 焦点管理**：更新 iframe URL 后自动聚焦 iframe，确保快捷键操作即时生效。

### v0.2.5

- **优化 Iframe 模式下的 SPA 导航**：改进了导航逻辑，通过父子窗口间的消息传递来触发导航，确保正确处理 SPA 路由（如 Next.js、Vue Router），避免强制重载。
- **改进 Iframe 模式下的 SPA 支持**：修复了在侧边栏内导航单页应用 (SPA) 时，可能无法正确更新 Iframe 支持状态的问题。
- **提升稳定性**：重构了 Iframe 检测逻辑，更好地处理无限刷新循环，提升整体稳定性。
- 改进 SPA（单页应用）导航体验：在 Iframe 模式或通过 Next.js 路由导航时，页面顶部会显示加载进度条，并优化了结束时的视觉延迟。
- 优化图片加载：为所有图标和图片启用懒加载（Lazy Loading），提升页面初始化加载性能。
- 代码重构：将图片生成逻辑提取为工厂方法，提高代码可维护性。

### v0.2.3

- 改进面板折叠行为：当鼠标离开窗口或悬停在滚动条上时，面板将保持展开状态。

### v0.2.2

- 优化面板渲染逻辑，减少状态更新时的 UI 抖动。
- 修复面板可能覆盖在蒙层之上的问题。

### v0.2.1

- 新增图片缓存机制，避免重复的网络请求，提升图标渲染性能。

### v0.2.0

- **Iframe 模式**: 侧边栏现在默认在隔离的 Iframe 环境中运行，极大提高了跨网站的兼容性和稳定性。
  - 自动处理 CSP (内容安全策略) 限制。
  - 确保样式和脚本不与宿主页面冲突。
  - 支持跨域导航：外部链接在顶层窗口打开，同源链接在 Iframe 内加载。
  - 保持 Iframe 与主窗口之间的状态同步（URL、标题、Favicon）。
- 优化键盘事件处理，提高与其他脚本的兼容性。
- 改进对 SPA (单页应用) 的支持，新增动态标题监听。

### v0.1.22

- 初始化时自动从远程导入预设数据。

### v0.1.21

- 修复了在具有严格 CSP（内容安全策略）的网站上无法注入样式的问题。

### v0.1.20

- 优化导入数据功能：支持从 URL 和粘贴文本导入

### v0.1.16

- 新增分组显示风格选项：支持“图标+标题”、“仅图标”、“仅标题”三种模式。
- 新增面板背景色设置，提供多种预设颜色。
- 优化“每行图标数”设置体验。

### v0.1.14

- 支持将网页中的链接拖拽到分组中。

### v0.1.12

- 支持更多 URL 变量：`{q:param}`, `{p:n}`, `{t:text}`, `{te:text}`。

### v0.1.6

- 新增侧边栏模式。
- 新增 JS 脚本执行支持。
- 改进 UI 和自定义选项。

## 更多实用脚本

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links)
- **功能**：为用户、帖子、视频和其他链接添加自定义标签和备注
- **亮点**：支持特殊标签过滤（如垃圾、屏蔽、标题党等），数据导出/导入，自动标记已查看帖子
- **支持网站**：V2EX、X(Twitter)、Reddit、GitHub、哔哩哔哩、知乎、Linux.do、YouTube 等 50+ 网站
- **描述**：超级实用的标签管理工具，可为论坛用户或帖子添加标签，轻松识别或屏蔽低质量内容

### 🧰 UTags Advanced Filter

- **链接**：[Greasy Fork](https://greasyfork.org/scripts/556095-utags-advanced-filter) · [ScriptCat](https://scriptcat.org/en/script-show-page/4653) · [GitHub Raw](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)
- **功能**：支持在 GreasyFork 实时过滤与隐藏脚本
- **亮点**：同时提供用户脚本与浏览器扩展两个版本
- **支持网站**：Greasy Fork
- **描述**：支持在 GreasyFork 实时过滤与隐藏脚本的工具，提供用户脚本和浏览器扩展两种版本。

### 🔗 链接助手

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper)
- **功能**：在新标签页中打开第三方网站链接，将文本链接解析为超链接
- **亮点**：支持自定义规则，解析 Markdown 和 BBCode 格式，将图片链接转换为图片标签
- **支持网站**：适用于所有网站，包括谷歌、YouTube、GitHub、V2EX 等
- **描述**：增强链接浏览体验，自动处理各种链接格式，使网页浏览更加便捷

### 🔍 Find Scripts For This Site - 查找适用于当前网站的脚本

- **链接**：[Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site) · [ScriptCat](https://scriptcat.org/script-show-page/4276) · [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js)
- **功能**：一键在多个仓库搜索脚本
- **亮点**：设置面板、实时同步、智能顶级域名提取
- **支持网站**：所有网站
- **描述**：一个用于快速在多个脚本仓库中查找当前网站脚本的用户脚本，提供设置面板与跨标签页实时同步

## 许可证

MIT License — 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE)

## 相关链接

- 项目主页：https://github.com/utags/userscripts
- 问题反馈：https://github.com/utags/userscripts/issues
