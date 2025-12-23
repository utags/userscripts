# Discourse Sort Option Quick Switcher

Quickly switch Discourse topic list sorting via menu commands by updating URL parameters. Supports multiple sort options (created time, activity time, replies count, views, likes) in both directions, with bilingual labels (English and Chinese).

[中文版](https://github.com/utags/userscripts/blob/main/discourse-sort-option-quick-switcher/README.zh-CN.md)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-11-06-15-17-11.png)

## Features

- One-click sort switching using user script menu commands
- Sorting options:
  - Created time: New → Old / Old → New
  - Activity time: New → Old / Old → New
  - Replies count: High → Low / Low → High
  - Views: High → Low / Low → High
  - Likes: High → Low / Low → High
- Preserves existing query parameters; only updates `order` and `ascending`
- Bilingual menu labels (English and Simplified Chinese) with auto language detection
- Restricted to specific Discourse forums via `@match`, avoiding non-target sites
- Avoids redundant reloads if the current page already matches the target sort

## Supported Sites

This script runs only on these domains:

- `https://meta.discourse.org/*`
- `https://linux.do/*`
- `https://idcflare.com/*`
- `https://www.nodeloc.com/*`
- `https://meta.appinn.net/*`
- `https://community.openai.com/*`
- `https://community.cloudflare.com/*`
- `https://community.wanikani.com/*`
- `https://forum.cursor.com/*`
- `https://forum.obsidian.md/*`
- `https://forum-zh.obsidian.md/*`
- `https://www.uscardforum.com/*`

## Installation

1. Install a user script manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. Install the script:
   - From GitHub: https://github.com/utags/userscripts/raw/main/discourse-sort-option-quick-switcher/discourse-sort-option-quick-switcher.user.js
   - From Greasy Fork: https://greasyfork.org/scripts/554927-discourse-sort-option-quick-switcher
   - From ScriptCat: https://scriptcat.org/script-show-page/4555

## Usage

1. Visit a Discourse list page (Latest, New, Categories, Tags, etc.).
2. Open your user script manager menu.
3. Choose a sort command from the script menu. The page URL will be updated with `order` and `ascending`, and the page will navigate to the target sort.

### Menu Items (English)

- Sort by created (New → Old) / (Old → New)
- Sort by activity (New → Old) / (Old → New)
- Sort by replies (High → Low) / (Low → High)
- Sort by views (High → Low) / (Low → High)

### Notes

- Some pages or forums may not support all sort parameters. In such cases, adding parameters may have no effect.
- When the current page already matches the chosen sort, navigation is skipped to avoid unnecessary reloads.

## Technical Details

- Uses `GM_registerMenuCommand` to expose sort options in the script menu.
- Updates the current page URL by setting `order` and `ascending` query parameters, then navigates via `window.location.assign(...)`.
- Auto language detection via `navigator.language` (`zh*` → Simplified Chinese, otherwise English).

## Compatibility

Tested on modern browsers with Tampermonkey/Violentmonkey, and designed for Discourse-based forums.

## Changelog

### v0.1.1

- Add likes sorting options (High → Low / Low → High)

### v0.1.0

- Initial release
- Sort by created, activity, replies, views (both directions)
- Bilingual menu labels (English and Chinese) with auto detection

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

MIT License — see the repository `LICENSE` file.

## Contributing

Issues and pull requests are welcome!

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
