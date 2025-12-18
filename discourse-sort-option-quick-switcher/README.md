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

- 🏷️ UTags — Add User Tags to Links
  - [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links)
  - Tag users or posts across popular sites; filter, export/import, auto-mark viewed posts

- 🔄 Discourse Topic Quick Switcher
  - [Greasy Fork](https://greasyfork.org/scripts/550982-discourse-topic-quick-switcher)
  - Quickly navigate between topics with keyboard shortcuts and a floating panel

- 🔗 Links Helper
  - [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
  - Open third-party links in new tabs; parse text links into hyperlinks

- 🔍 Find Scripts For This Site
  - [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site)
  - One-click search for scripts relevant to the current website across multiple repositories

## License

MIT License — see the repository `LICENSE` file.

## Contributing

Issues and pull requests are welcome!

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
