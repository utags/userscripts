# Discourse Prevent Jump on Reply

Prevent Discourse from jumping to the latest post after you submit a reply. The script intercepts reply actions and forces `shiftKey` behavior to keep your current scroll position and context. Includes a per‑site toggle and auto language for the UI label.

[中文版](https://github.com/utags/userscripts/blob/main/discourse-prevent-jump-on-reply/README.zh-CN.md)

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

### v0.1.0

- Initial release: button and hotkey interception, per‑site toggle, auto language

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
- 🔗 Copy Selected Links as Markdown
  - [Greasy Fork](https://greasyfork.org/scripts/557913-copy-selected-links-as-markdown)
- 🔄 Discourse Sort Option Quick Switcher
  - [Greasy Fork](https://greasyfork.org/scripts/554927-discourse-sort-option-quick-switcher)

## License

MIT License — see the repository `LICENSE` file.

## Contributing

Issues and pull requests are welcome!

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
