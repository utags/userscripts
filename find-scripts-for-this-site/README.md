# Find Scripts For This Site

A useful user script that helps you quickly find user scripts for the current website, with support for multiple popular script repositories.

[中文版](https://github.com/utags/userscripts/blob/main/find-scripts-for-this-site/README.zh-CN.md)

![screenshot](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-09-25-19-47-18.png)

## Features

- 🔍 **One-Click Search** - Quickly find scripts for the current website in multiple script repositories.
- 🌐 **Multi-Repository Support** - Supports Greasy Fork, OpenUserJS, ScriptCat, GitHub, and GitHub Gist.
- 🌍 **Multi-Language Support** - Automatically adapts to the browser's language, supporting 8 common languages.
- 🧩 **Smart Domain Extraction** - Automatically extracts the top-level domain to ensure accurate search results.
- 🛡️ **Error Handling** - Robust exception handling to ensure stable script operation.
- 🔧 **Configurable** - Supports debug mode and custom settings.

## Installation

### Prerequisites

Ensure your browser has one of the following user script managers installed:

- [Tampermonkey](https://www.tampermonkey.net/)
- [Violentmonkey](https://violentmonkey.github.io/)
- [ScriptCat](https://scriptcat.org/)

### Installation Steps

1. [Click here to install the script from GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js)
2. [Click here to install the script from Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site)

## Usage

### Basic Usage

1. Visit any website.
2. Click the user script manager's icon in your browser's toolbar.
3. In the popup menu, you will see the following options:
   - 🍴 Find scripts by domain on Greasy Fork
   - 🍴 Find scripts by keyword on Greasy Fork
   - 📜 Find scripts by keyword on OpenUserJS
   - 🐱 Find scripts by domain on ScriptCat
   - 🐱 Find scripts by keyword on ScriptCat
   - 🐙 Find scripts by keyword on GitHub
   - 📝 Find scripts by keyword on GitHub Gist
4. Click any option to open the search results in a new tab.

### Multi-Language Support

The script automatically detects the browser's language and displays the corresponding menu text. The following languages are currently supported:

- English
- Simplified Chinese
- Traditional Chinese
- Japanese
- Korean
- Spanish
- French
- German
- Russian

## Technical Implementation

### Core Features

- **Domain Extraction**: Intelligently extracts the top-level domain of the current website, handling subdomains and special domain formats.
- **Menu Registration**: Uses `GM_registerMenuCommand` to register multiple search options.
- **Internationalization Support**: Automatically selects the appropriate menu text based on the browser's language.
- **New Tab Opening**: Uses `GM_openInTab` to open search results in a new tab.

### Supported Script Repositories

| Repository  | Icon | Search Methods                   |
| ----------- | ---- | -------------------------------- |
| Greasy Fork | 🍴   | Domain Search, Keyword Search    |
| Sleazy Fork | 🔞   | Domain Search, Keyword Search    |
| OpenUserJS  | 📜   | Keyword Search                   |
| ScriptCat   | 🐱   | Domain Search, Keyword Search    |
| GitHub      | 🐙   | Keyword Search (JavaScript code) |
| GitHub Gist | 📝   | Keyword Search (JavaScript code) |

## Configuration Options

The script provides configurable options in the `CONFIG` object:

```javascript
const CONFIG = {
  REPOSITORIES: [
    // Repository configurations...
  ],
  DEBUG: false, // Debug mode switch
}
```

### Enabling Debug Mode

To see detailed logs, you can set `CONFIG.DEBUG` to `true`:

```javascript
DEBUG: true,
```

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Troubleshooting

### Common Issues

**Q: The menu items are not showing up?**

A: Please check the following:

1. Confirm that the script is installed correctly.
2. Confirm that the script is enabled.
3. Refresh the page and try again.

**Q: The search results are inaccurate?**

A: Possible reasons:

1. The website uses a complex domain structure.
2. Enable debug mode to check if the extracted domain is correct.

### Debugging Steps

1. Enable debug mode (set `DEBUG: true`).
2. Open the browser's developer tools console.
3. Refresh the page and check the log output.
4. Use the log information to identify the problem.

## Changelog

### v0.2.0

- ⚙️ Added a settings interface to enable/disable specific search methods.
- 🔄 Provided separate switches for domain and keyword searches for each repository.
- 🔞 Added support for the Sleazy Fork repository.

### v0.1.1

- ✨ Added keyword search functionality for all repositories.
- 🔍 Optimized menu display based on repository features.
- 🧹 Refactored code for improved maintainability.
- 📊 Updated repository search method descriptions in the documentation.

### v0.1.0 (Initial Release)

- ✨ Support for searching multiple script repositories.
- 🌍 Added multi-language support.
- 🧩 Smart domain extraction functionality.
- 🛡️ Robust error handling mechanism.

## Contribution Guidelines

Issues and Pull Requests are welcome!

## License

MIT License - see the [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details.

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
