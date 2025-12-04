# Copy Selected Links as Markdown

Copy selected link(s) on any page to the clipboard as Markdown in the form `[text](url)`. Supports single or multiple anchors inside selection, URL text detection, and page fallback. Includes a keyboard shortcut and a menu command.

[中文版](https://github.com/utags/userscripts/blob/main/copy-link-as-markdown/README.zh-CN.md)

## Features

- Copies selected link(s) as Markdown `[text](url)`
- Single or multiple anchors; outputs one line per link
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
- Clipboard will contain Markdown; multiple links produce a multi‑line list

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

- 🏷️ UTags — Add User Tags to Links
  - [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links)
- 🔄 Discourse Topic Quick Switcher
  - [Greasy Fork](https://greasyfork.org/scripts/550982-discourse-topic-quick-switcher)
- 🔗 Links Helper
  - [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
- 🔍 Find Scripts For This Site
  - [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site)
- 🖼️ Universal Image Uploader
  - [Greasy Fork](https://greasyfork.org/scripts/553341-universal-image-uploader)

## License

MIT License — see the repository `LICENSE` file.

## Contributing

Issues and pull requests are welcome!

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
