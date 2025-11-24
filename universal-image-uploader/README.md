# Universal Image Uploader

A user script that lets you paste, drag, or select images and batch-upload them to Imgur or Tikolu (selectable provider), then auto-copy the result in Markdown/HTML/BBCode/plain link. It also integrates configurable site buttons (works with SPA pages) and keeps a local upload history for quick reuse.

[中文版](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.zh-CN.md)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-21-49.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-12-14.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-08-06.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-06-32.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-00.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-33.png)

## Features (MVP)

- 📥 Paste, drag-and-drop, or file picker to collect images
- 📤 Batch upload to Imgur/Tikolu with progress display
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
- Choose upload provider via the panel’s host selector (Imgur/Tikolu)
- Choose proxy via the panel’s proxy selector (default None; Imgur not supported)
- When finished, the script auto-copies based on your selected format
- Use history to quickly copy past uploads

### Output Formats

- `Markdown`: `![alt](url)`
- `HTML`: `<img src="url" alt="alt" />`
- `BBCode`: `[img]url[/img]`
- `Link`: `url`

## Configuration

- Per-site upload provider: remember `Imgur` / `Tikolu`
- Per-site proxy: remember `None` / `wsrv.nl` (Imgur not supported; when `wsrv.nl` is selected, outputs and history copy/open use `https://wsrv.nl/?url=${encodeURIComponent(url)}`)
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

### v0.5.x

- Add MJJ.Today upload provider.

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

Here are some other useful scripts that can enhance your browsing experience:

| Script                                                                                                                                | Description                                                                                                                                         | Supported Sites                                                                           | Install Links                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Find Scripts For This Site](https://github.com/utags/userscripts/blob/main/find-scripts-for-this-site/README.md)                     | Search Greasy Fork, OpenUserJS, ScriptCat, GitHub/Gist for scripts for the current site with one click                                              | All sites                                                                                 | [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site) <br> [ScriptCat](https://scriptcat.org/script-show-page/4276)                               |
| [Universal Image Uploader](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.md)                         | Paste/drag/select images to upload to Imgur/Tikolu; auto-copy Markdown/HTML/BBCode/links; site button & history                                     | All sites                                                                                 | [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/553341-universal-image-uploader) <br> [ScriptCat](https://scriptcat.org/script-show-page/4467)                                     |
| [Discourse Sort Option Quick Switcher](https://github.com/utags/userscripts/blob/main/discourse-sort-option-quick-switcher/README.md) | One-click switch Discourse list sorting (created/replied time, replies, views, likes); only updates order/ascending                                 | All Discourse forums                                                                      | [GitHub](https://github.com/utags/userscripts/raw/main/discourse-sort-option-quick-switcher/discourse-sort-option-quick-switcher.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/554927-discourse-sort-option-quick-switcher) <br> [ScriptCat](https://scriptcat.org/script-show-page/4555) |
| [Discourse Topic Quick Switcher](https://github.com/utags/userscripts/blob/main/discourse-topic-quick-switcher/README.md)             | Cache topic list; floating panel and shortcuts to navigate fast; supports settings and multiple languages                                           | All Discourse forums                                                                      | [GitHub](https://github.com/utags/userscripts/raw/main/discourse-topic-quick-switcher/discourse-topic-quick-switcher.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/550982-discourse-topic-quick-switcher) <br> [ScriptCat](https://scriptcat.org/script-show-page/4310)                   |
| [LINUX.DO CloudFlare Challenge Auto Redirect](https://github.com/utags/userscripts/blob/main/linux.do-auto-challenge/README.md)       | Detect failed challenge and auto-redirect to the challenge page; supports manual trigger                                                            | Linux.do                                                                                  | [GitHub](https://github.com/utags/userscripts/raw/main/linux.do-auto-challenge/linux.do-auto-challenge.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/552218-linux-do-cloudflare-challenge-bypass) <br> [ScriptCat](https://scriptcat.org/script-show-page/4373)                           |
| [LINUX.DO Auto Load New Topics](https://github.com/utags/userscripts/blob/main/linux.do-auto-load-new-topics/README.md)               | Automatically load new topics with error handling and detection optimizations                                                                       | Linux.do                                                                                  | [GitHub](https://github.com/utags/userscripts/raw/main/linux.do-auto-load-new-topics/linux.do-auto-load-new-topics.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/545775-linux-do-auto-load-new-topics)                                                                                    |
| [LINUX.DO Load More Topics Manually](https://github.com/utags/userscripts/blob/main/linux.do-manual-load-more/README.md)              | Add a “Load more” button at the bottom to manually control content loading                                                                          | Linux.do                                                                                  | [GitHub](https://github.com/utags/userscripts/raw/main/linux.do-manual-load-more/linux.do-manual-load-more.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/545779-linux-do-load-more-topics-manually)                                                                                       |
| [No GIF Avatars](https://github.com/utags/userscripts/blob/main/no-gif-avatars/README.md)                                             | Convert animated avatars to static PNG to reduce distraction and improve performance                                                                | Linux.do, NodeLoc                                                                         | [GitHub](https://github.com/utags/userscripts/raw/main/no-gif-avatars/no-gif-avatars.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/529447-no-gif-avatars)                                                                                                                                 |
| [V2EX No Node Specific Styles](https://github.com/utags/userscripts/blob/main/v2ex-no-node-specific-styles/README.md)                 | Remove node-specific styles to keep all pages unified and clean                                                                                     | V2EX                                                                                      | [GitHub](https://github.com/utags/userscripts/raw/main/v2ex-no-node-specific-styles/v2ex-no-node-specific-styles.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/555374-v2ex-no-node-specific-styles) <br> [ScriptCat](https://scriptcat.org/script-show-page/4591)                         |
| [UTags](https://github.com/utags/utags)                                                                                               | Add user tags and notes to links; support filtering, import/export, auto mark-as-read; tag users or posts to identify or filter low-quality content | 50+ sites including V2EX, X (Twitter), Reddit, GitHub, Bilibili, Zhihu, Linux.do, NodeLoc | [GitHub](https://github.com/utags/utags/raw/refs/heads/main/packages/extension/build/userscript-prod/utags.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links) <br> [ScriptCat](https://scriptcat.org/script-show-page/2784)                                |
| [Links Helper](https://github.com/utags/links-helper)                                                                                 | Open third-party links in a new tab; parse text to hyperlinks; support custom rules, Markdown/BBCode, image-link tagging                            | All sites                                                                                 | [GitHub](https://github.com/utags/links-helper/raw/refs/heads/main/build/userscript-prod/links-helper.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper) <br> [ScriptCat](https://scriptcat.org/script-show-page/4486)                                                    |
| [V2EX.REP](https://github.com/v2hot/v2ex.rep)                                                                                         | Fix floor number offsets, show hot replies, prefetch pages and image uploads; auto check-in, quick thank/hide, double-tap navigation                | V2EX                                                                                      | [GitHub](https://github.com/v2hot/v2ex.rep/raw/refs/heads/main/build/userscript-prod/v2ex.rep.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/466589-v2ex-rep) <br> [ScriptCat](https://scriptcat.org/script-show-page/4592)                                                                |
| [Replace Ugly Avatars](https://github.com/utags/replace-ugly-avatars)                                                                 | Bulk replace user avatars using DiceBear-generated random avatars; support unified style                                                            | V2EX, Linux.do                                                                            | [GitHub](https://github.com/utags/replace-ugly-avatars/raw/refs/heads/main/build/userscript-prod/replace-ugly-avatars.user.js) <br> [Greasy Fork](https://greasyfork.org/scripts/472616-replace-ugly-avatars) <br> [ScriptCat](https://scriptcat.org/script-show-page/3049)                            |
| [UTags Advanced Filter](https://github.com/utags/utags-advanced-filter)                                                               | A tool that filters and hides list-style content in real time on any website. It is available as both a userscript and a browser extension.         | GreasyFork, SleasyFork                                                                    | [Greasy Fork](https://greasyfork.org/scripts/556095-utags-advanced-filter) <br> [ScriptCat](https://scriptcat.org/en/script-show-page/4653) <br> [GitHub Raw](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)                  |

## License

MIT License - see the [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details.

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
