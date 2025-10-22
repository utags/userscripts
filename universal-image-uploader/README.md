# Universal Image Uploader

A user script that lets you paste, drag, or select images and batch-upload them to Imgur, then auto-copy the result in Markdown/HTML/BBCode/plain link. It also integrates configurable site buttons (works with SPA pages) and keeps a local upload history for quick reuse.

[中文版](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.zh-CN.md)

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

- From GitHub (raw):
  - `https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js`

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

## Roadmap (Planned / Not Yet Implemented)

- 🌐 Multi-provider uploads: SM.MS, Cloudflare Images, self-hosted S3/MinIO
- 🛠 Image processing options: quality, resize, compression, format (JPEG/PNG/WebP), EXIF removal
- 📦 Queue controls: concurrency slider, retry/backoff, cancel/pause
- 🧩 Template system: fully customizable output formats and HTML snippets
- 🗂 History enhancements: filters by time/provider/tags, batch copy, faster reuse

## Changelog

- v0.1.0 — Initial MVP: Imgur upload, batch & progress, auto-copy (Markdown/HTML/BBCode/Link), local history, SPA-aware button injection

## License

MIT License - see the [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details.

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
