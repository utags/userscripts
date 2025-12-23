# Copy Selected Links as Markdown

Copy selected link(s) on any page to the clipboard as Markdown in the form `[text](url)`. Supports single or multiple anchors inside selection, URL text detection, and page fallback. Includes a keyboard shortcut and a menu command.

[中文版](https://github.com/utags/userscripts/blob/main/copy-link-as-markdown/README.zh-CN.md)

## Features

- Copies selected link(s) as Markdown `[text](url)`
- Single or multiple anchors; for multiple links outputs a Markdown bullet list
- Detects URL in selected text when no anchor is present
- Fallback to `[document.title](location.href)` when nothing is selected
- Keyboard shortcut: `Cmd/Ctrl + Shift + M`
- Menu command via `GM_registerMenuCommand`

## Supported Sites

- All sites: `*://*/*`

## Installation

1. Install a user script manager:
   - [Tampermonkey](https://www.tampermonkey.net/)
   - [Violentmonkey](https://violentmonkey.github.io/)
2. Install the script:
   - [GitHub Raw](https://github.com/utags/userscripts/raw/main/copy-link-as-markdown/copy-link-as-markdown.user.js)
   - [Greasy Fork](https://greasyfork.org/scripts/557913-copy-selected-links-as-markdown)
   - [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4802)

## Usage

- Select link(s) or text on the page
- Trigger one of the following:
  - Press `Cmd/Ctrl + Shift + M`
  - Use the menu command “复制选中链接为 Markdown”
- Clipboard will contain Markdown; multiple links produce a Markdown bullet list

## Technical Details

- Finds anchors that intersect the current selection range and parent anchor when cursor is inside a link
- Builds absolute URLs via `new URL(anchor.href, location.origin)`
- Uses Clipboard API with `document.execCommand('copy')` fallback

## Compatibility

Works on modern browsers with Tampermonkey/Violentmonkey.

## Changelog

### v0.1.0

- Initial release: selection parsing, multi‑link output, shortcut and menu

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
