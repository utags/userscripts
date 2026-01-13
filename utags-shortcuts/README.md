# UTags Shortcuts

**UTags Shortcuts** is a powerful userscript that provides a floating or sidebar navigation panel for quick access to your favorite links and scripts. It features per-site grouping, icon support, and versatile customization options, making it an essential tool for power users who want to streamline their browsing workflow.

[中文文档](https://github.com/utags/userscripts/blob/main/utags-shortcuts/README.zh-CN.md)

![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-22-38-53.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-07-10.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-17-50.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-09-19.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-18-23-12-29.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-16-56-24.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-13-59-40.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-16-56-11.png)
![screenshot](https://wsrv.nl/?url=https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-16-52-20.png)
![screenshot](https://raw.githubusercontent.com/utags/userscripts/main/assets/screenshot-2025-12-22-17-03-52.gif)

## Key Features

- **Per-Site Grouping**: Automatically displays relevant navigation groups based on the website you are currently visiting. Configure groups to appear on specific domains or URL patterns.
- **Two Display Modes**:
  - **Floating Mode**: A discreet floating icon that expands on hover, perfect for saving screen space.
  - **Sidebar Mode**: A fixed sidebar (left or right) for quick and always-visible access, ideal for wide screens.
- **Versatile Items**:
  - **URLs**: Add quick links to any webpage. Supports relative paths to the current page.
  - **JS Scripts**: Execute small JavaScript snippets directly from the menu for quick automation.
- **Visual Customization**:
  - **Icons**: Automatically fetches favicons or supports custom icon URLs.
  - **Themes**: seamlessly adapts to system or website themes (Light/Dark/System).
- **Easy Management**:
  - **Quick Add**: Instantly add the current page to a group.
  - **Visual Editor**: Drag-and-drop to reorder items, manage groups, and edit properties via a user-friendly interface.
- **Keyboard Shortcuts**: Toggle the panel instantly with `Alt+Shift+K`.

## Installation

- Requires a user script manager:
  - [Tampermonkey](https://www.tampermonkey.net/)
  - [Violentmonkey](https://violentmonkey.github.io/)
  - [ScriptCat](https://scriptcat.org/)
  - [Userscripts (Safari)](https://github.com/quoid/userscripts)
  - [Greasemonkey (Firefox)](https://addons.mozilla.org/firefox/addon/greasemonkey/)
- Incompatible:
  - Stay
- Install from: [GitHub](https://github.com/utags/userscripts/raw/main/utags-shortcuts/utags-shortcuts.user.js) · [Greasy Fork](https://greasyfork.org/scripts/558485-utags-shortcuts) · [ScriptCat](https://scriptcat.org/script-show-page/4910)

## Usage

1.  **Opening the Panel**:
    - Hover over the "edge strip" (default: top-right edge of the screen).
    - Or use the shortcut `Alt+Shift+K`.
2.  **Adding Links**:
    - Open the panel and click the `+` button at the bottom to add the current page to a group.
    - You can choose which group to add the link to or create a new group.
3.  **Managing Items**:
    - Right-click the floating icon or click the **Settings** button in the panel to open the configuration modal.
    - Here you can:
      - Create, edit, or delete groups.
      - Add or edit specific items (Links or Scripts).
      - Change matching rules for when groups should appear.
      - Adjust layout preferences (Floating vs. Sidebar).

### Discourse Sidebar Integration

On Discourse forums (e.g., Linux.do) that support custom sidebar sections:

1.  Go to the sidebar customization page.
2.  Click **Add Link** or edit an existing section.
3.  You will see three new buttons:
    - **Import from UTags Shortcuts**: Import links from your existing UTags Shortcuts groups.
    - **Import from JSON File**: Import links from a JSON file into the current section.
    - **Export as JSON File**: Export the current section's links as a JSON file compatible with UTags Shortcuts.

## Use Cases

- **Site-Specific Tools**: Create a "GitHub" group that only appears on `github.com`, containing links to your Issues, Pull Requests, and Profile.
- **Global Toolbox**: Create a "Tools" group that appears on every site (`*`), offering quick access to translation services, JSON formatters, or note-taking apps.
- **Reading Assistant**: Add "Next Chapter" or "Previous Chapter" scripts/links for your favorite novel reading sites.
- **Development Helper**: Execute quick JS snippets to fill forms, clear cache, or switch environments.

## Configuration

Access the settings panel to customize:

- **Layout Mode**: Switch between Floating and Sidebar.
- **Sidebar Position**: Left or Right.
- **Default Open Behavior**: Open links in the same tab or a new tab.
- **Appearance**: Adjust the size, opacity, and color of the edge trigger strip.
- **Hotkey**: Customize the toggle shortcut.

## Supported Variables

You can use the following variables in the URL field. They will be replaced with the corresponding values from the current page:

- `{hostname}`: Current hostname (e.g., `www.google.com`).
- `{hostname_without_www}`: Hostname without `www.` prefix (e.g., `google.com`).
- `{hostname_top_level}`: Top-level domain extracted from current URL (e.g., `google.com`, `bbc.co.uk`).
- `{current_url}`: Full URL of the current page.
- `{current_url_encoded}`: URL-encoded full URL.
- `{current_title}`: Title of the current page.
- `{query}`: Search keywords extracted from URL parameters (automatically detects `q`, `query`, `kw`, `wd`, `keyword`, `p`, `s`, `term`).
- `{selected}`: Currently selected text on the page.
- `{q:param}`: Value of the specified query parameter (e.g., `{q:id}` for `?id=123`).
- `{p:n}`: The n-th path segment of the URL (e.g., `{p:1}` gets `foo` from `/foo/bar`).
- `{t:text}`: Returns the text directly (e.g., `{t:hello}`).
- `{v:key}`: Value of the custom variable (e.g., `{v:api_key}`). Defined in Group, Site, or Global settings.
- **Fallback**: Use `||` to define a fallback value (e.g., `{selected||query||t:default}`).

## Changelog

### v0.7.x

- **Selection-Based Filtering**: Automatically filters navigation items when text is selected. Only items containing the `{selected}` variable will be displayed, helping you quickly find relevant actions.
- **Variable Enhancement**: Optimized the variable update mechanism. Relevant variables now automatically update and trigger a rerender when the page title (`{current_title}`) or selected text (`{selected}`) changes.
- **Global Selection State**: Introduced global selection state management. The main page can now detect text selection changes within iframes, ensuring the `{selected}` variable always reflects the user's latest selection, whether in the main page or an iframe.
- **Smart Debounce**: Added debounce mechanism for state updates to prevent excessive rerenders caused by frequent title or selection changes.
- **Code Optimization**: Extracted common title listening logic, improved the stability of SPA (Single Page Application) title change detection, and fixed cross-origin iframe communication issues.

### v0.6.x

- **Performance**: Implemented icon cache persistence to local storage, reducing network requests and speeding up initialization.
- **Stability**: Added timeout handling for network requests with automatic fallback to `GM_xmlhttpRequest` to prevent hanging.
- **Custom Variables**: Introduced support for custom variables. You can now define variables in Global, Site, or Group settings and use them in URLs (e.g., `{v:api_key}`).
- **Hierarchical Resolution**: Variables are resolved with a priority order: Group > Site > Global.
- **Enhanced Settings**: Added a new settings interface for managing custom variables.

### v0.5.x

- **Enhanced Open Mode**: Added "Follow Group Settings" for links and "Follow Site Settings" for groups, allowing flexible inheritance of open behavior.
- **Smart Defaults**: Automatically selects the inheritance option when the open mode is not explicitly set.
- **UX Improvement**: Automatically scrolls the sidebar to the newly created group.

### v0.4.x

- **Drag-and-Drop Sorting**: Enhanced drag-and-drop experience with visual insertion lines for precise reordering within groups.
- **Adaptive Visual Feedback**: Automatically switches between vertical (top/bottom) and horizontal (left/right) insertion lines based on the layout mode (List vs. Grid/Auto).
- **URL Handling**: Fixed an issue where URLs were double-encoded when dragged into a group, ensuring template variables (e.g., `{hostname}`) are preserved correctly.
- **Discourse Integration**: Added support for importing/exporting custom sidebar sections in Discourse forums.
- **Export Filter**: Automatically excludes items with `[Hidden]` in the name during export.
- **URL Processing**: Automatically converts absolute URLs to relative paths when importing if they match the current domain.
- **UI Improvements**: Optimized toast notifications and button layout in the Discourse sidebar.
- **Iframe Mode Improvements**: Enhanced cross-origin navigation handling to ensure external links open in the top frame, and improved security by validating origin before syncing URL state.

### v0.3.x

- **Compatibility**: Disabled Iframe Mode for Stay script manager (as it deletes the created iframe body).
- **Optimization**: Add polling mechanism as a fallback for data synchronization when native listeners are unavailable.
- Add simulated `addValueChangeListener` support for script managers that do not implement it natively, enabling cross-tab data synchronization.

### v0.2.6

- **Improved Iframe Focus**: The iframe now automatically receives focus after URL updates, ensuring keyboard shortcuts work immediately.

### v0.2.5

- **Refined SPA Navigation in Iframe Mode**: Improved the navigation logic by using message passing between parent and iframe, ensuring proper SPA routing handling (e.g. Next.js, Vue Router) instead of forcing a reload.
- **Improved SPA Support in Iframe Mode**: Fixed an issue where navigation in Single Page Applications (SPAs) within the sidebar might not correctly update the iframe support status.
- **Enhanced Stability**: Refactored the iframe detection logic to better handle infinite reload loops and improve overall stability.
- Improved SPA (Single Page Application) navigation experience: Added a loading progress bar at the top of the page when navigating in Iframe mode or via Next.js router.
- Optimized image loading: Enabled lazy loading for all icons and images to improve initial page load performance.
- Refactored internal code: Extracted image generation logic into a factory method for better maintainability.

### v0.2.3

- Improved panel collapse behavior: the panel now stays expanded when the mouse leaves the window or hovers over the scrollbar.

### v0.2.2

- Optimized the rendering logic of the panel to reduce UI flickering during state updates.
- Fixed an issue where the panel might overlap with the modal mask.

### v0.2.1

- Implemented image caching mechanism to prevent redundant network requests and improve rendering performance for icons.

### v0.2.0

- **Iframe Mode**: The sidebar now runs in an isolated iframe environment by default, improving compatibility and stability across different websites.
  - Automatically handles CSP (Content Security Policy) restrictions.
  - Ensures styles and scripts don't conflict with the host page.
  - Supports cross-origin navigation: External links open in the top frame, while homologous links load within the iframe.
  - Maintains state synchronization (URL, title, favicon) between the iframe and the main window.
- Optimized keyboard event handling for better compatibility with other scripts.
- Improved SPA (Single Page Application) support with dynamic title monitoring.

### v0.1.22

- Automatically imports built-in shortcuts from remote source upon initialization.

### v0.1.21

- Fixed an issue where styles could not be injected on websites with strict CSP (Content Security Policy).

### v0.1.20

- Optimized data import functionality: Added support for importing from URL and pasting text

### v0.1.16

- Added group display style options: "Icon+Title", "Icon Only", and "Title Only".
- Added panel background color setting with presets.
- Improved "Icons Per Row" setting UX.

### v0.1.14

- Support dragging and dropping links from the web page to groups.

### v0.1.12

- Support more URL variables: `{q:param}`, `{p:n}`, `{t:text}`, `{te:text}`.

### v0.1.6

- Added sidebar mode.
- Added JS script execution support.
- Improved UI and customization options.

## More Useful Scripts

### 🏷️ UTags - Add User Tags to Links

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links)
- **Features**: Add custom tags and notes to user, post, video and other links
- **Highlights**: Support special tag filtering (like spam, block, clickbait, etc.), data export/import, auto-mark viewed posts
- **Supported Sites**: V2EX, X(Twitter), Reddit, GitHub, Bilibili, Zhihu, Linux.do, Youtube and 50+ websites
- **Description**: Super useful tag management tool for adding tags to forum users or posts, making it easy to identify or block low-quality content

### 🧰 UTags Advanced Filter

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/556095-utags-advanced-filter) · [ScriptCat](https://scriptcat.org/en/script-show-page/4653) · [GitHub Raw](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)
- **Features**: Real-time filtering and hiding of scripts on GreasyFork
- **Highlights**: Available as both a userscript and a browser extension
- **Supported Sites**: Greasy Fork
- **Description**: A tool that supports real-time filtering and hiding on GreasyFork, available in userscript and browser extension versions

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

MIT License — see [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE)

## Related Links

- Project: https://github.com/utags/userscripts
- Issues: https://github.com/utags/userscripts/issues
