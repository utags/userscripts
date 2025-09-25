# Find Scripts For This Site

A practical userscript that helps you quickly find userscripts for the current website you're browsing, supporting multiple mainstream script repositories.

[中文版](https://github.com/utags/userscripts/blob/main/find-scripts-for-this-site/README.zh-CN.md)

![screenshot](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-09-25-19-06-40.png)

## Features

- 🔍 **One-Click Search** - Quickly find scripts for the current website across multiple repositories
- 🌐 **Multi-Repository Support** - Supports Greasy Fork, OpenUserJS, ScriptCat, GitHub, and GitHub Gist
- 🌍 **Multilingual Support** - Automatically adapts to browser language, supporting 8 common languages
- 🧩 **Smart Domain Extraction** - Automatically extracts top-level domains for accurate search results
- 🛡️ **Error Handling** - Comprehensive exception handling ensures script stability
- 🔧 **Configurable** - Supports debug mode and custom settings

## Installation

### Prerequisites

Ensure your browser has one of the following userscript managers installed:

- [Tampermonkey](https://www.tampermonkey.net/)
- [Violentmonkey](https://violentmonkey.github.io/)

### Installation Steps

1. Click [here](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js) to install from GitHub
2. Click [here](https://greasyfork.org/scripts/550659-find-scripts-for-this-site) to install from Greasy Fork

## Usage Instructions

### Basic Usage

1. Visit any website
2. Click on the userscript manager icon in your browser toolbar
3. In the popup menu, you'll see the following options:
   - 🍴 Find scripts on Greasy Fork
   - 📜 Find scripts on OpenUserJS
   - 🐱 Find scripts on ScriptCat
   - 🐙 Find scripts on GitHub
   - 📝 Find scripts on GitHub Gist
4. Click any option to open the search results in a new tab

### Multilingual Support

The script automatically detects your browser language and displays the appropriate menu text. Currently supports:

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

### Core Functionality

- **Domain Extraction**: Intelligently extracts the top-level domain of the current website, handling subdomains and special domain formats
- **Menu Registration**: Uses `GM_registerMenuCommand` to register multiple search options
- **Internationalization**: Automatically selects appropriate menu text based on browser language
- **New Tab Opening**: Uses `GM_openInTab` to open search results in a new tab

### Supported Script Repositories

| Repository  | Icon | Search Method     |
| ----------- | ---- | ----------------- |
| Greasy Fork | 🍴   | Site-based search |
| OpenUserJS  | 📜   | Keyword search    |
| ScriptCat   | 🐱   | Domain search     |
| GitHub      | 🐙   | Code search       |
| GitHub Gist | 📝   | Code search       |

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

### Enable Debug Mode

To view detailed operation logs, set `CONFIG.DEBUG` to `true`:

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

**Q: Menu items not showing?**

A: Please check:

1. Confirm the script is properly installed
2. Confirm the script is enabled
3. Refresh the page and try again

**Q: Search results not accurate?**

A: Possible reasons:

1. The website uses a complex domain structure
2. Enable debug mode to check if the extracted domain is correct

### Debugging Steps

1. Enable debug mode (set `DEBUG: true`)
2. Open the browser developer tools console
3. Refresh the page and check the log output
4. Identify issues based on log information

## Changelog

### v0.1.0 (Initial Release)

- ✨ Support for multiple script repository searches
- 🌍 Added multilingual support
- 🧩 Smart domain extraction functionality
- 🛡️ Comprehensive error handling

## Contribution Guidelines

Issues and Pull Requests are welcome!

## License

MIT License - See [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
