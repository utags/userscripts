# UTags Import Helper

Export tag data from other V2EX-related userscripts and convert it into a UTags backup JSON file, then download it automatically.

## Install

- GitHub: https://github.com/utags/userscripts/raw/main/utags-import-helper/utags-import-helper.user.js
- Greasy Fork: https://greasyfork.org/scripts/572962-utags-import-helper
- ScriptCat: https://scriptcat.org/script-show-page/5847

## Supported Sources

- V2EX Next
  - Note title prefix: `--用户标签--`
  - Data shape: `{ [username: string]: string[] | string }`
- V2EX Polish
  - Note title prefix: `V2EX_Polish_settings`
  - Data shape: `{ "member-tag": { [username: string]: { avatar?: string; tags: string[] | string } } }` (the `avatar` field is ignored)

## How It Works

- Reads your V2EX Notes list from `/notes`, finds the first note whose title contains the configured prefix.
- Fetches `/notes/edit/:id`, extracts the JSON payload from the note editor.
- Converts it to UTags backup format (databaseVersion = 3):
  - `created` / `updated`: current time (`Date.now()`)
  - `updated2` / `updated3`: not included
- Downloads a file like:
  - `utags-backup-v2ex-next-YYYYMMDD_HHMMSS.json`
  - `utags-backup-v2ex-polish-YYYYMMDD_HHMMSS.json`

## Usage

1. Log in to V2EX in your browser.
2. Make sure the source script has already written its data to your V2EX Notes:
   - V2EX Next: enable its tagging feature and let it create/update the `--用户标签--` note.
   - V2EX Polish: ensure it has created/updated the `V2EX_Polish_settings` note.
3. Open any V2EX page, then run one of the userscript menu commands:
   - “Export V2EX Next tags to UTags backup”
   - “Export V2EX Polish tags to UTags backup”
4. Visit https://utags.link/
5. Open Settings > Data Management > Import Data, then select the downloaded JSON file.

## Troubleshooting

- “未找到笔记：...”:
  - You are not logged in, or the source script never created the note yet.
  - Open the source script’s settings page/features once to let it initialize.
- Exported file is empty:
  - The note exists but its JSON payload is missing/invalid, or tag list is empty.

## Privacy

- All requests are same-origin to `v2ex.com` / `v2ex.co` notes pages.
- The script is read-only: it does not modify your notes. It only downloads the converted JSON locally.
- It does not upload your data to any server and does not collect any data.

## Changelog

- 0.1.0
  - Initial release
  - Export from V2EX Next to UTags backup
  - Export from V2EX Polish to UTags backup

## More Useful Scripts

### 🏷️ UTags - Add User Tags to Links

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/569761-utags-add-usertags-to-links) · [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links) · [ScriptCat](https://scriptcat.org/script-show-page/2784) · [GitHub](https://github.com/utags/utags/raw/main/packages/extension/build/userscript-prod/utags.user.js)
- **Features**: Add custom tags and notes to user, post, video and other links
- **Highlights**: Support special tag filtering (like spam, block, clickbait, etc.), data export/import, auto-mark viewed posts
- **Supported Sites**: V2EX, X(Twitter), Reddit, GitHub, Bilibili, Zhihu, Linux.do, Youtube and 50+ websites
- **Description**: Super useful tag management tool for adding tags to forum users or posts, making it easy to identify or block low-quality content

### 🧰 UTags Advanced Filter

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/556095-utags-advanced-filter) · [ScriptCat](https://scriptcat.org/script-show-page/4653) · [GitHub](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)
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

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper) · [ScriptCat](https://scriptcat.org/script-show-page/4486) · [GitHub](https://github.com/utags/links-helper/raw/refs/heads/main/build/userscript-prod/links-helper.user.js)
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

### 🖼️ Universal Image Uploader

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/553341-universal-image-uploader) · [ScriptCat](https://scriptcat.org/script-show-page/4467) · [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js)
- **Features**: Paste/drag/select images to batch-upload to Imgur/Tikolu/MJJ.Today/Appinn
- **Highlights**: Auto-copy to Markdown/HTML/BBCode/Link, supports site buttons & local history, SPA-compatible
- **Supported Sites**: All websites
- **Description**: A user script that lets you paste, drag, or select images and batch-upload them to various providers, then auto-copy the result in your preferred format

## License

MIT License — see https://github.com/utags/userscripts/blob/main/LICENSE

## Related Links

- Project homepage: https://github.com/utags/userscripts
- Issues: https://github.com/utags/userscripts/issues
