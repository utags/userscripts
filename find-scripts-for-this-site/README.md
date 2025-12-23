# Find Scripts For This Site

A user script to quickly find scripts for the current site across multiple repositories, now with a settings dialog and real-time sync across tabs.

[中文文档](https://github.com/utags/userscripts/blob/main/find-scripts-for-this-site/README.zh-CN.md)

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-09-25-19-47-18.png)

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-16-09-57-11.png)

## Features

- 🔍 One-click search across repositories
- 🌐 Supports Greasy Fork, OpenUserJS, ScriptCat, GitHub, GitHub Gist
- 🌍 Auto language detection (8 languages)
- ⚙️ Settings menu to enable/disable per-repository Domain/Keyword search
- 🔄 Real-time settings sync across tabs using `GM_addValueChangeListener`
- 📑 Accurate menu re-ordering after changes
- 🧩 Smart top-level domain extraction

## Installation

- Requires a user script manager: [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), or [ScriptCat](https://scriptcat.org/)
- Install from: [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js), [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site), [ScriptCat](https://scriptcat.org/script-show-page/4276)

## Usage

- Open your userscript manager menu on any page
- You will see entries like:
  - 🍴 Find scripts by domain on Greasy Fork
  - 🍴 Find scripts by keyword on Greasy Fork
  - 📜 Find scripts by keyword on OpenUserJS
  - 🐱 Find scripts by domain on ScriptCat
  - 🐱 Find scripts by keyword on ScriptCat
  - 🐙 Find scripts by keyword on GitHub
  - 📝 Find scripts by keyword on GitHub Gist
- Click ⚙️ Settings to configure which Domain/Keyword entries are shown per repository
- Changes apply immediately and sync across tabs

## Multi-Language Support

- English, Simplified Chinese, Traditional Chinese, Japanese, Korean, Spanish, French, German, Russian
- Menu text adapts to the detected browser language

## Troubleshooting

- If menu items do not appear:
  - Ensure the script is installed and enabled
  - Verify your userscript manager supports menu commands
- If results seem off, enable debug mode and check the extracted domain in console

## Changelog

### v0.3.x

- Fixed an issue where styles could not be injected on websites with strict CSP (Content Security Policy).
- Settings panel UI improvements

### v0.2.4

- Real-time settings sync across tabs
- Centralized i18n messages and simplified lookup
- Accurate menu re-registration order
- Removed outdated “refresh after saving” note

### v0.2.0

- Settings dialog to enable/disable per-repository search methods
- Separate toggles for Domain and Keyword search
- Added Sleazy Fork repository

### v0.1.1

- Added keyword search for all repositories
- Optimized menu display
- Refactoring and documentation updates

### v0.1.0

- Initial release with multi-repository search, multi-language support, smart domain extraction

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

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/utags-advanced-filter/refs/heads/main/assets/screenshot-2025-11-23-08-31-00.png)

### ⚡ UTags Shortcuts

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/558485-utags-shortcuts) · [ScriptCat](https://scriptcat.org/script-show-page/4910) · [GitHub](https://github.com/utags/userscripts/raw/main/utags-shortcuts/utags-shortcuts.user.js)
- **Features**: Per-site grouping, icon support, floating or sidebar navigation panel
- **Highlights**: Floating/Sidebar modes, URL/JS script support, visual editor, keyboard shortcuts
- **Supported Sites**: All websites
- **Description**: A powerful userscript that streamlines your browsing workflow with a customizable navigation panel for quick access to favorite links and scripts
- **Tip**: You can also achieve the functionality of this script by importing [Userscript Presets](https://raw.githubusercontent.com/utags/utags-shared-shortcuts/main/en/collections/plugin_groups.json)

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-23-14-48-43.png)

### 🔗 Links Helper

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
- **Features**: Open third-party website links in new tabs, parse text links into hyperlinks
- **Highlights**: Support custom rules, parse Markdown and BBCode formats, convert image links to image tags
- **Supported Sites**: Universal for all websites, including Google, YouTube, GitHub, V2EX, etc.
- **Description**: Enhance link browsing experience, automatically process various link formats for more convenient web browsing

### 🖼️ Universal Image Uploader

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/553341-universal-image-uploader) · [ScriptCat](https://scriptcat.org/script-show-page/4467) · [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js)
- **Features**: Paste/drag/select images to batch-upload to Imgur/Tikolu/MJJ.Today/Appinn
- **Highlights**: Auto-copy to Markdown/HTML/BBCode/Link, supports site buttons & local history, SPA-compatible
- **Supported Sites**: All websites
- **Description**: A user script that lets you paste, drag, or select images and batch-upload them to various providers, then auto-copy the result in your preferred format

## License

MIT License — see [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE)

## Related Links

- Project: https://github.com/utags/userscripts
- Issues: https://github.com/utags/userscripts/issues
