# 通用图片上传助手（Universal Image Uploader）

一个用户脚本：在任意网站上粘贴、拖拽或选择图片，批量上传到 Imgur 或 Tikolu（可选择图床），并按需自动复制为 Markdown/HTML/BBCode/纯链接。支持可配置的站点按钮（兼容单页应用），提供本地上传历史便于快速复用。

[English](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.md)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-23-13.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-12-14.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-08-06.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-06-32.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-00.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-33.png)

## 功能（MVP）

- 📥 支持粘贴、拖拽、文件选择收集图片
- 📤 批量上传到 Imgur/Tikolu，实时显示进度
- 📋 自动复制输出：`Markdown` / `HTML` / `BBCode` / `Link`
- 🕘 本地历史记录，便于再次复制与复用
- 🔘 可选站点按钮注入，兼容 SPA（按站点配置）

## 安装

### 依赖

任意脚本管理器：

- [Tampermonkey](https://www.tampermonkey.net/)
- [Violentmonkey](https://violentmonkey.github.io/)
- [ScriptCat](https://scriptcat.org/)

### 安装脚本

1. 点击 [这里](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js) 从 GitHub 安装脚本
2. 点击 [这里](https://greasyfork.org/zh-CN/scripts/553341-universal-image-uploader) 从 Greasy Fork 安装脚本

## 使用方法

- 在页面中粘贴/拖拽图片，或使用面板选择文件
- 队列中可查看上传进度
- 在面板的图床选择器中选择上传平台（Imgur/Tikolu）
- 在面板的代理选择器中选择是否使用代理（默认“无”；Imgur 不支持）
- 完成后按所选格式自动复制
- 历史记录中可快速再次复制

### 输出格式示例

- `Markdown`：`![alt](url)`
- `HTML`：`<img src="url" alt="alt" />`
- `BBCode`：`[img]url[/img]`
- `Link`：`url`

## 配置项

- 站点记忆图床：`Imgur` / `Tikolu`
- 站点记忆代理：`无` / `wsrv.nl`（Imgur 不支持；当选择 `wsrv.nl` 时，输出与历史复制/打开将使用 `https://wsrv.nl/?url=${encodeURIComponent(url)}`）
- 站点记忆输出格式：`Markdown` / `HTML` / `BBCode` / `Link`
- 可选站点按钮注入：选择器、位置（`before` | `inside` | `after`）、按钮文案

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

### v0.2.x

- 新增代理选项：`无` / `wsrv.nl`；Imgur 不支持；当选择 `wsrv.nl` 时，输出与历史复制/打开将使用 `https://wsrv.nl/?url=${encodeURIComponent(url)}`
- 新增 Tikolu 图床，面板支持选择 Imgur/Tikolu

### v0.1.0

- 初始 MVP：Imgur 上传、批量与进度、自动复制（Markdown/HTML/BBCode/Link）、本地历史、兼容 SPA 的站点按钮注入

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

## 许可证

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
