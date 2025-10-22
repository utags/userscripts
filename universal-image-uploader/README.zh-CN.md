# 通用图片上传助手（Universal Image Uploader）

一个用户脚本：在任意网站上粘贴、拖拽或选择图片，批量上传到 Imgur，并按需自动复制为 Markdown/HTML/BBCode/纯链接。支持可配置的站点按钮（兼容单页应用），提供本地上传历史便于快速复用。

[English](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.md)

## 功能（MVP）

- 📥 支持粘贴、拖拽、文件选择收集图片
- 📤 批量上传到 Imgur，实时显示进度
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

- GitHub（raw）：
  - `https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js`

## 使用方法

- 在页面中粘贴/拖拽图片，或使用面板选择文件
- 队列中可查看上传进度
- 完成后按所选格式自动复制
- 历史记录中可快速再次复制

### 输出格式示例

- `Markdown`：`![alt](url)`
- `HTML`：`<img src="url" alt="alt" />`
- `BBCode`：`[img]url[/img]`
- `Link`：`url`

## 配置项

- 站点记忆输出格式：`Markdown` / `HTML` / `BBCode` / `Link`
- 可选站点按钮注入：选择器、位置（`before` | `inside` | `after`）、按钮文案

## Roadmap（规划 / 未实现）

- 🌐 多平台上传：SM.MS、Cloudflare Images、自建 S3/MinIO
- 🛠 图片处理：质量、尺寸、压缩、格式（JPEG/PNG/WebP）、EXIF 清理
- 📦 队列增强：并发控制、失败重试、取消/暂停
- 🧩 模板系统：完全自定义输出与 HTML 片段
- 🗂 历史增强：按时间/平台/标签过滤，批量复制，更快复用

## 更新记录

- v0.1.0 — 初始 MVP：Imgur 上传、批量与进度、自动复制（Markdown/HTML/BBCode/Link）、本地历史、兼容 SPA 的站点按钮注入

## 许可证

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
