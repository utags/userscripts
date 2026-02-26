# 通用图片上传助手（Universal Image Uploader）

一个用户脚本：在任意网站上粘贴、拖拽或选择图片，批量上传到 Imgur 或 Tikolu 或 MJJ.Today 或 Appinn（可选择图床），支持可选的 WebP 格式转换，并按需自动复制为 Markdown/HTML/BBCode/纯链接。支持可配置的站点按钮（兼容单页应用），提供本地上传历史便于快速复用。

[English](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.md)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-23-13.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-12-14.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-08-06.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-06-32.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-00.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-33.png)

## 功能（MVP）

- 📥 支持粘贴、拖拽、文件选择收集图片
- 📤 批量上传到 Imgur/Tikolu/MJJ.Today/ImgBB/Appinn/Photo.Lily/111666.best/Skyimg/StarDots，实时显示进度
- 🔄 支持并发上传到备用图床（双重备份）与自动降级
- 🖼️ 支持可选的 WebP 格式转换（通过代理或特定图床）
- 📋 自动复制输出：`Markdown` / `HTML` / `BBCode` / `Link`
- 🕘 本地历史记录，便于再次复制与复用
- 🔘 可选站点按钮注入，兼容 SPA（按站点配置）

## 安装方法

- 需要安装油猴脚本管理器：
  - [Tampermonkey](https://www.tampermonkey.net/)
  - [Violentmonkey](https://violentmonkey.github.io/)
  - [ScriptCat](https://scriptcat.org/)
- **安装地址**： [Greasy Fork](https://greasyfork.org/zh-CN/scripts/553341-universal-image-uploader) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4467) · [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js)

## 使用方法

- 在页面中粘贴/拖拽图片，或使用面板选择文件
- 队列中可查看上传进度
- 在面板的图床选择器中选择上传平台（Imgur/Tikolu/MJJ.Today/ImgBB/Appinn/Photo.Lily/111666.best/Skyimg/StarDots）
- （可选）选择备用图床以实现双重上传和自动故障转移
- 在面板的代理选择器中选择是否使用代理（默认“无”）
- 开启 WebP 选项可通过代理自动转换格式
- 完成后按所选格式自动复制
- 历史记录中可快速再次复制

### 输出格式示例

- `Markdown`：`![alt](url)`
- `HTML`：`<img src="url" alt="alt" />`
- `BBCode`：`[img]url[/img]`
- `Link`：`url`

## 站点按钮设置

- 打开面板，切换到“设置”页。
- 填写“CSS 选择器”，用于定位要插入按钮的目标元素（例如 `.comment-screenshot-control`）。
- 选择位置：`之前` 在元素前插入，`之后` 在元素后插入，`里面` 作为最后一个子元素。
- 按钮文案：可填纯文本或单根 HTML 片段；留空或 HTML 不合法时，会回退为本地化默认文案，并使用内置样式按钮。
- 点击 `保存并插入`：规则会保存到本地并立即注入；脚本内置 DOM 观察器，兼容 SPA 页面。
- 使用 `移除按钮（临时）` 仅移除已注入按钮，不删除规则。
- 使用 `清空设置` 删除所有已保存规则。
- 列表中的每一项支持 `编辑` 和 `删除`。
- 提示：尽量选用稳定且唯一的选择器，避免过宽匹配造成多处插入。

## Roadmap（规划 / 未实现）

- 🌐 多平台上传：SM.MS、Cloudflare Images、自建 S3/MinIO
- 🛠 图片处理：质量、尺寸、压缩、格式（JPEG/PNG/WebP）、EXIF 清理
- 📦 队列增强：并发控制、失败重试、取消/暂停
- 🧩 模板系统：完全自定义输出与 HTML 片段
- 🗂 历史增强：按时间/平台/标签过滤，批量复制，更快复用

## 更新记录

### v0.14.x

- **新增图床**：新增 **StarDots** 图床支持。需在设置面板中配置 API Key、Secret 和 Bucket 名称。
- **修复**：重构 StarDots 设置界面，使用 `c` 函数替代 `innerHTML`，以兼容 CSP 限制的网站。

### v0.13.x

- **修复**：优化站点按钮检测逻辑，防止在页面 DOM 变化（如工具栏动态更新）时导致按钮重复插入。
- **新增多图床支持**：
  - 支持设置备用图床，实现同时上传到两个图床（双重备份）。
  - 优化代理逻辑：优先使用主图床，备用图床作为自动降级备选，并构建代理链以确保高可用性。
  - 代理链策略调整为：`主图床(代理) -> 备用图床(代理) -> 主图床(直连)`。
  - UI 优化：使用不同颜色主题区分主图床（蓝色）与备用图床（紫色）的控件与标签。

### v0.12.x

- 优化 `wsrv.nl` 代理：启用 WebP 选项时自动追加 `&output=webp` 参数。

### v0.11.x

- 新增四种图床：ImgBB、Photo.Lily、111666.best、Skyimg。
- 更新面板图床选择器与文档，支持上述图床。
- 调整 111666.best 代理逻辑，与 Imgur 保持一致（支持 `wsrv.nl -> DuckDuckGo`）。
- 优化历史列表：放大缩略图、为预览图添加懒加载，并在悬浮时显示更大的浮层预览。
- 优化日志列表样式：调整间距、背景色与边框，增加鼠标悬浮高亮效果，提升视觉体验。
- 新增 Skyimg (WebP) 图床，上传接口带 `?webp=true` 参数。
- 优化 `wsrv.nl` 代理：根据原文件名判断 GIF 时自动追加 `&n=-1` 参数。

### v0.10.x

- 新增：全面的 iframe 支持。
  - 上传面板仅在顶层框架显示。
  - 站点按钮会注入到所有框架（包括 iframe）中。
  - 监听所有 iframe 中的 DOM 变化以自动注入按钮。
- 修复：跨框架焦点追踪。
  - 正确处理来自 iframe 的文件选择请求和图片粘贴。
  - “复制”按钮可正确将内容插入到位于 iframe 中的焦点元素。
- 优化：重构拖拽上传逻辑。
  - 统一主框架与 iframe 的拖拽初始化逻辑，减少代码重复。
  - 拖拽设置变更现在通过 `addValueChangeListener` 实现跨框架实时同步。
- 优化：统一粘贴上传逻辑并支持 iframe。
  - 主框架与 iframe 中的粘贴事件现在都通过同一条 `iu:uploadFiles` 管道进行处理，与拖拽上传保持一致。
- 新增：模拟上传图床（测试用）。
  - 提供一个可选测试图床，延迟 1 秒后返回随机示例图片链接。
  - 通过内部开关控制，默认关闭，不影响正常使用。
- 修复：拖拽覆盖层在输入框附近抖动的问题。
  - 拖拽覆盖层改为 `pointer-events: none`，并仅在合法拖拽目标上切换显示，避免拖拽经过输入框时反复闪烁。

### v0.9.x

- 新增代理选项：`DuckDuckGo` 和 `wsrv.nl -> DuckDuckGo`。
- 允许 Imgur 使用代理（支持 `DuckDuckGo` 和 `wsrv.nl -> DuckDuckGo`；`wsrv.nl` 自动转为 `wsrv.nl -> DuckDuckGo`）。
- 重构代理配置逻辑，提升扩展性。

### v0.8.x

- 为不支持 `addValueChangeListener` 的脚本管理器增加监听数据变化的功能，实现跨标签页数据同步。
- 优化：增加轮询机制作为跨标签页数据同步的兜底方案。
- 重构：将所有同步 `GM_` 存储调用迁移至异步 API，提升脚本性能与现代环境兼容性。

### v0.7.x

- 修复与 utags-shortcuts 的兼容性问题
- 重构：使用 esbuild 打包脚本

### v0.6.x

- 新增每站点启用开关（命令菜单），切换后刷新页面生效。
- 新增每站点“粘贴上传/拖拽上传”开关（设置页）；预置站点默认启用。
- 支持同时粘贴多个图片上传。
- 粘贴/拖拽开关即时生效，无需刷新页面。
- 在目标输入框插入上传状态占位符，并在成功/失败时替换。

### v0.5.x

- 新增 MJJ.Today 图床。
- 新增 Appinn 图床。

### v0.4.x

- 支持自定义格式模版。
- Imgur 上传改为使用 `GM_xmlhttpRequest`，规避跨域问题。
- 抽取通用请求函数 `gmRequest`，统一上传通道的请求与错误处理。

### v0.3.x

- 设置存储迁移为统一的“站点映射”，将原先分散的多个键合并为单一结构，示例：`{ format?, host?, proxy?, btns?: [...] }`。
- 面板改为使用 Shadow DOM 渲染，实现与站点样式的隔离。内部样式使用 `:host`；拖拽覆盖层（`#uiu-drop`）与站点注入按钮（`.uiu-insert-btn`）仍保留在页面 DOM。
- 为“历史”和“设置”切换按钮新增高亮（打开态）与无障碍状态（`aria-pressed`），更易识别当前展开状态。
- 焦点跟踪支持 Shadow DOM：深入开放 Shadow DOM 与同源 iframe，正确识别可编辑目标；同时排除脚本面板本身，避免被记录为目标。
- Trusted Types 兼容：不再使用 `innerHTML` 清空（改用 `textContent = ''`）；自定义按钮 HTML 采用 `Range.createContextualFragment` 解析，避免在启用 TT 的站点报错。
- 兼容性：旧设置会自动迁移，无需手动操作。

### v0.2.x

- 新增代理选项：`无` / `wsrv.nl`；Imgur 不支持；当选择 `wsrv.nl` 时，输出与历史复制/打开将使用 `https://wsrv.nl/?url=${encodeURIComponent(url)}`
- 新增 Tikolu 图床，面板支持选择 Imgur/Tikolu
- 新增“记住最后访问输入框”：当点击上传等操作导致失焦时，仍可将内容插入到最后访问的输入框并自动恢复焦点；优化 `contentEditable` 插入时的光标定位（默认插入末尾）

### v0.1.0

- 初始 MVP：Imgur 上传、批量与进度、自动复制（Markdown/HTML/BBCode/Link）、本地历史、兼容 SPA 的站点按钮注入

## 更多实用脚本

### 🏷️ UTags - 为链接添加用户标签

- **链接**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links) · [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/2784) · [GitHub](https://github.com/utags/utags/raw/main/packages/extension/build/userscript-prod/utags.user.js)
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

## 许可证

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
