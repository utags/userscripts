# Universal Image Uploader

A user script that lets you paste, drag, or select images and batch-upload them to Imgur or Tikolu or MJJ.Today or Appinn (selectable provider), then auto-copy the result in Markdown/HTML/BBCode/plain link. It also integrates configurable site buttons (works with SPA pages) and keeps a local upload history for quick reuse.

[中文版](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.zh-CN.md)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-21-49.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-12-14.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-08-06.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-06-32.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-00.png)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-33.png)

## Features (MVP)

- 📥 Paste, drag-and-drop, or file picker to collect images
- 📤 Batch upload to Imgur/Tikolu/MJJ.Today/ImgBB/Appinn/Photo.Lily/111666.best with progress display
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
3. [Click here to install the script from ScriptCat](https://scriptcat.org/script-show-page/4467)

## Usage

- Open any site, paste or drop images onto the page, or use the panel’s file picker
- Watch the upload queue and progress
- Choose upload provider via the panel’s host selector (Imgur/Tikolu/MJJ.Today/ImgBB/Appinn/Photo.Lily/111666.best)
- Choose proxy via the panel’s proxy selector (default `None`)
- When finished, the script auto-copies based on your selected format
- Use history to quickly copy past uploads

### Output Formats

- `Markdown`: `![alt](url)`
- `HTML`: `<img src="url" alt="alt" />`
- `BBCode`: `[img]url[/img]`
- `Link`: `url`

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

### v0.11.x

- Added new upload providers: ImgBB, Photo.Lily, and 111666.best.
- Updated documentation and host selector to include the new providers.
- Aligned 111666.best proxy behavior with Imgur (supports `wsrv.nl -> DuckDuckGo`).
- Improved history panel: larger thumbnails, lazy-loaded previews, and a floating enlarged preview when hovering thumbnails.
- Optimized log list style: improved spacing, added background/border for better visibility, and hover highlight effects.

### v0.10.x

- Feature: Comprehensive iframe support.
  - The upload panel is displayed only in the top frame.
  - Site buttons are injected into all frames (including iframes).
  - DOM changes in iframes are monitored for button injection.
- Fix: Cross-frame focus tracking.
  - Correctly handles file picker requests and image pasting from iframes.
  - "Copy" button correctly targets the last focused element, even inside iframes.
- Optimization: Refactored drag-and-drop logic.
  - Unified drag-and-drop initialization for both main frame and iframes, reducing code duplication.
  - Drag-and-drop settings changes now sync instantly across frames via `addValueChangeListener`.
- Optimization: Unified paste upload behavior across frames.
  - Paste events in both the main frame and iframes now use the same `iu:uploadFiles` pipeline as drag-and-drop, so behavior is consistent regardless of where you paste.
- Feature: Mock upload host for testing.
  - Optional test host that simulates a 1-second delay and returns a random demo image URL.
  - Controlled via an internal flag and disabled by default for normal users.
- Fix: Drag overlay flicker over inputs.
  - The drop overlay is now `pointer-events: none` and only toggles visibility on valid drag targets, avoiding oscillation when dragging across input fields.

### v0.9.x

- Added new proxy options: `DuckDuckGo` and `wsrv.nl -> DuckDuckGo`.
- Enabled proxy selection for Imgur (supports `DuckDuckGo` and `wsrv.nl -> DuckDuckGo`; `wsrv.nl` automatically switches to `wsrv.nl -> DuckDuckGo`).
- Refactored proxy configuration logic for better extensibility.

### v0.8.x

- Add simulated `addValueChangeListener` support for script managers that do not implement it natively, enabling cross-tab data synchronization.
- Optimization: Add polling mechanism as a fallback for data synchronization when native listeners are unavailable.
- Refactoring: Migrate all synchronous `GM_` storage calls to asynchronous APIs to improve script performance and compatibility with modern environments.

### v0.7.x

- Fix compatibility issues with utags-shortcuts
- Refactoring: use esbuild to bundle the script

### v0.6.x

- Per-site enable toggle via command menu; refresh page to apply.
- Per-site paste and drag-and-drop toggles in Settings; preset sites default to enabled.
- Support pasting multiple images at once.
- Paste/drag toggles take effect immediately without page reload.
- Insert upload-status placeholders into the target input and replace on success/failure.

### v0.5.x

- Add MJJ.Today upload provider.
- Add Appinn upload provider.

### v0.4.x

- Support custom format templates.
- Switch Imgur upload from `fetch` to `GM_xmlhttpRequest` to avoid CORS.
- Extract shared `gmRequest` helper to unify upload provider requests.

### v0.3.x

- Settings storage migrated to a unified per-site map, consolidating previously separate keys into a single structure. Example shape: `{ format?, host?, proxy?, btns?: [...] }`.
- Panel UI is now rendered inside a Shadow DOM for style isolation from host sites. Internal styles use `:host`; the drop overlay (`#uiu-drop`) and site-injected buttons (`.uiu-insert-btn`) remain in the page DOM.
- Added clear “open” visuals and accessibility states (`aria-pressed`) for History and Settings toggles.
- Shadow-DOM-aware focus tracking: resolves editable targets inside nested open shadow roots and same-origin iframes; excludes the script’s panel from being tracked as a target.
- Trusted Types compliance: avoid `innerHTML` clears (use `textContent = ''`), and parse custom button HTML via `Range.createContextualFragment` to prevent TT violations on strict sites.
- Backward compatibility: existing settings are migrated automatically; no manual action required.

### v0.2.x

- Added proxy option: `None` / `wsrv.nl`; Imgur not supported; when `wsrv.nl` is selected, outputs and history copy/open use `https://wsrv.nl/?url=${encodeURIComponent(url)}`
- Added Tikolu upload provider; choose Imgur/Tikolu via panel host selector
- Added last-focused input tracking: when clicks cause focus loss (e.g., upload), insert into the last visited input and restore focus; improved caret fallback for `contentEditable` elements

### v0.1.0

- Initial MVP: Imgur upload, batch & progress, auto-copy (Markdown/HTML/BBCode/Link), local history, SPA-aware button injection

## More Useful Scripts

### 🏷️ UTags - Add User Tags to Links

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links)
- **Features**: Add custom tags and notes to user, post, video and other links
- **Highlights**: Support special tag filtering (like spam, block, clickbait, etc.), data export/import, auto-mark viewed posts
- **Supported Sites**: V2EX, X(Twitter), Reddit, GitHub, Bilibili, Zhihu, Linux.do, Youtube and 50+ websites
- **Description**: Super useful tag management tool for adding tags to forum users or posts, making it easy to identify or block low-quality content

### 🧰 UTags Advanced Filter

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/556095-utags-advanced-filter) · [ScriptCat](https://scriptcat.org/en/script-show-page/4653) · [GitHub](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)
- **Features**: Real-time filtering and hiding of scripts on GreasyFork
- **Highlights**: Available as both a userscript and a browser extension
- **Supported Sites**: Greasy Fork
- **Description**: A tool that supports real-time filtering and hiding on GreasyFork, available in userscript and browser extension versions

### ⚡ UTags Shortcuts

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/558485-utags-shortcuts) · [ScriptCat](https://scriptcat.org/script-show-page/4910) · [GitHub](https://github.com/utags/userscripts/raw/main/utags-shortcuts/utags-shortcuts.user.js)
- **Features**: Per-site grouping, icon support, floating or sidebar navigation panel
- **Highlights**: Floating/Sidebar modes, URL/JS script support, visual editor, keyboard shortcuts
- **Supported Sites**: All websites
- **Description**: A powerful userscript that streamlines your browsing workflow with a customizable navigation panel for quick access to favorite links and scripts

### 🔗 Links Helper

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
- **Features**: Open third-party website links in new tabs, parse text links into hyperlinks
- **Highlights**: Support custom rules, parse Markdown and BBCode formats, convert image links to image tags
- **Supported Sites**: Universal for all websites, including Google, YouTube, GitHub, V2EX, etc.
- **Description**: Enhance link browsing experience, automatically process various link formats for more convenient web browsing

### 🔍 Find Scripts For This Site

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site) · [ScriptCat](https://scriptcat.org/script-show-page/4276) · [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js)
- **Features**: Quickly find scripts for the current site across multiple repositories
- **Highlights**: Settings dialog, real-time sync, smart domain extraction
- **Supported Sites**: All websites
- **Description**: A user script to quickly find scripts for the current site across multiple repositories, now with a settings dialog and real-time sync across tabs

## License

MIT License - see the [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details.

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
