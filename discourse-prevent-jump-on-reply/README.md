# Discourse Prevent Jump on Reply

Prevent Discourse from jumping to the latest post after you submit a reply. The script intercepts reply actions and forces `shiftKey` behavior to keep your current scroll position and context. Includes a per‑site toggle and auto language for the UI label.

[中文版](https://github.com/utags/userscripts/blob/main/discourse-prevent-jump-on-reply/README.zh-CN.md)

![screencapture](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-05-22-30-28.png)

## Features

- Prevents post‑submission jump; keeps current position
- Intercepts both reply button clicks and `Cmd/Ctrl + Enter` hotkey
- Per‑site toggle next to the reply button; off by default
- Toggle state persisted per domain via userscript storage (`GM.getValue`/`GM.setValue`)
- Auto label language (English/Simplified Chinese) based on Discourse UI language

## Supported Sites

Runs on these Discourse forums:

- `https://meta.discourse.org/*`
- `https://linux.do/*`
- `https://idcflare.com/*`
- `https://www.nodeloc.com/*`
- `https://meta.appinn.net/*`

## Installation

1. Install a user script manager:
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. Install the script:
   - [GitHub Raw](https://github.com/utags/userscripts/raw/main/discourse-prevent-jump-on-reply/discourse-prevent-jump-on-reply.user.js)
   - [Greasy Fork](https://greasyfork.org/scripts/557755-discourse-prevent-jump-on-reply)
   - [ScriptCat](https://scriptcat.org/script-show-page/4789)

## Usage

- On the reply composer, a checkbox appears next to the reply button:
  - Label: “Prevent jump to latest post” (auto‑localized)
  - Default: Off
  - When enabled, the script intercepts reply actions and keeps position
- Works for both clicking the reply button and pressing `Cmd/Ctrl + Enter`
- Shift override: if you manually hold Shift, the script does not alter behavior

## Compatibility

Tested on modern browsers with Tampermonkey/Violentmonkey and Discourse‑based forums.

## Changelog

### v0.1.4

- Delete `@noframes` declaration, compatible with utags-shortcuts in iframe mode

### v0.1.0

- Initial release: button and hotkey interception, per‑site toggle, auto language

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
