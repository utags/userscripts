# Universal Image Uploader

A user script that lets you paste, drag, or select images and batch-upload them to Imgur, then auto-copy the result in Markdown/HTML/BBCode/plain link. It also integrates configurable site buttons (works with SPA pages) and keeps a local upload history for quick reuse.

[中文版](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.zh-CN.md)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-21-49.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-12-14.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-08-06.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-06-32.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-00.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-33.png)

## Features (MVP)

- 📥 Paste, drag-and-drop, or file picker to collect images
- 📤 Batch upload to Imgur with progress display
- 📋 Auto-copy output in `Markdown` / `HTML` / `BBCode` / `Link`
- 🕘 Local history to quickly re-copy and reuse uploads
- 🔘 Optional site button injection with SPA observer (per-site settings)

## Installation

### Prerequisites

Install one of the following user script managers:

- [Tampermonkey](https://www.tampermonkey.net/)
- [Violentmonkey](https://violentmonkey.github.io/)
- [ScriptCat](https://scriptcat.org/)

### Install Script

1. [Click here to install the script from GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js)
2. [Click here to install the script from Greasy Fork](https://greasyfork.org/scripts/553341-universal-image-uploader)

## Usage

- Open any site, paste or drop images onto the page, or use the panel’s file picker
- Watch the upload queue and progress
- When finished, the script auto-copies based on your selected format
- Use history to quickly copy past uploads

### Output Formats

- `Markdown`: `![alt](url)`
- `HTML`: `<img src="url" alt="alt" />`
- `BBCode`: `[img]url[/img]`
- `Link`: `url`

## Configuration

- Per-site output format: remember `Markdown` / `HTML` / `BBCode` / `Link`
- Per-site button injection (optional): selector, position (`before` | `inside` | `after`), text

## Site Button Settings

- Open the panel and switch to "Settings".
- Enter a CSS selector for the target element (e.g., `.comment-screenshot-control`).
- Choose position: `Before` inserts before, `After` inserts after, `Inside` appends as the last child.
- Set button content: plain text or a single-root HTML snippet. Leaving it empty uses the localized default.
- Click `Save & Insert` to persist the rule locally and inject immediately. A DOM observer keeps it inserted on SPA pages.
- Use `Remove button (temporary)` to clear injected buttons without deleting rules.
- Use `Clear settings` to remove all saved rules.
- Each rule in the list supports `Edit` and `Delete`.
- Tips: prefer stable, unique selectors to avoid multiple insertions.

## Roadmap (Planned / Not Yet Implemented)

- 🌐 Multi-provider uploads: SM.MS, Cloudflare Images, self-hosted S3/MinIO
- 🛠 Image processing options: quality, resize, compression, format (JPEG/PNG/WebP), EXIF removal
- 📦 Queue controls: concurrency slider, retry/backoff, cancel/pause
- 🧩 Template system: fully customizable output formats and HTML snippets
- 🗂 History enhancements: filters by time/provider/tags, batch copy, faster reuse

## Changelog

- v0.1.0 — Initial MVP: Imgur upload, batch & progress, auto-copy (Markdown/HTML/BBCode/Link), local history, SPA-aware button injection

## More Useful Scripts

Here are some other useful scripts that can enhance your browsing experience:

### 🏷️ UTags - Add User Tags to Links

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links)
- **Features**: Add custom tags and notes to user, post, video and other links
- **Highlights**: Support special tag filtering (like spam, block, clickbait, etc.), data export/import, auto-mark viewed posts
- **Supported Sites**: V2EX, X(Twitter), Reddit, GitHub, Bilibili, Zhihu, Linux.do, Youtube and 50+ websites
- **Description**: Super useful tag management tool for adding tags to forum users or posts, making it easy to identify or block low-quality content

### 🔗 Links Helper

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
- **Features**: Open third-party website links in new tabs, parse text links into hyperlinks
- **Highlights**: Support custom rules, parse Markdown and BBCode formats, convert image links to image tags
- **Supported Sites**: Universal for all websites, including Google, YouTube, GitHub, V2EX, etc.
- **Description**: Enhance link browsing experience, automatically process various link formats for more convenient web browsing

### 🔍 Find Scripts For This Site

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site)
- **Features**: Quickly find user scripts for the current website
- **Highlights**: Support for multiple popular script repositories, easy discovery of useful scripts
- **Supported Sites**: Works on any website to find relevant userscripts
- **Description**: A convenient tool to discover and install userscripts specifically designed for the websites you visit

## License

MIT License - see the [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details.

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
