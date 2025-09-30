# Discourse Topic Quick Switcher

A powerful user script that brings seamless topic navigation, effective current topic highlighting, and quick navigation to previous/next topics in Discourse forums. Browse your favorite forums with enhanced speed and efficiency.

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-09-30-08-15-02.gif)

## Features

- **Topic List Caching**: Automatically caches the topic list when you visit a list page.
- **Quick Access**: Access the cached list from any topic page via:
  - A floating button in the bottom-right corner
  - Customizable keyboard shortcuts (default: Alt+Q for topic list)
- **Enhanced Navigation**: Navigate between topics using:
  - Customizable keyboard shortcuts (default: Alt+W for next, Alt+E for previous)
  - Quick navigation buttons for previous and next topics
  - Automatically skips hidden topics during navigation
- **User-Friendly Interface**:
  - Displays cache time and source information
  - Navigate directly to topics from the popup panel
  - Close with the ESC key, a close button, or by clicking outside the panel
  - Highlights the current topic for easy identification
  - Automatically scrolls to the current topic in the list
  - Settings panel to customize language preferences, navigation button visibility, and hotkeys
- **Adaptive Theme**:
  - Automatically adjusts to light/dark mode based on system and site preferences
- **Cache Management**:
  - 1-hour cache expiration with a visual indicator
  - Source link to return to the original list page

## How It Works

This script operates entirely on the client-side with a focus on efficiency and minimal resource usage:

1. **Client-Side Caching**: When you visit a topic list page, the script captures the HTML content of the topic list and stores it in your browser's local storage.

2. **Zero Additional Server Requests**: The script works with content that's already been loaded by your browser, creating no additional load on the Discourse server.

3. **SPA Navigation**: The script leverages Discourse's Single Page Application architecture to navigate between topics without full page reloads, making navigation nearly instantaneous.

4. **DOM Manipulation**: The cached topic list is displayed through careful DOM manipulation, creating a seamless overlay that matches your forum's current theme.

5. **Event-Based Interaction**: All user interactions (keyboard shortcuts, button clicks) are handled through efficient event listeners.

The design philosophy prioritizes performance and server friendliness - the script adds convenient navigation without generating any additional server requests beyond what Discourse normally requires.

## Limitations

Due to the caching mechanism used by the script, there are some limitations:

1. **Non-Real-Time Data**: The reply counts and view counts displayed in the cached topic list are not real-time data, but rather the data at the time of caching.

2. **Cache Freshness**: The topic list is only updated when you visit a list page. If you haven't visited a list page for a long time, the cached data may differ significantly from the actual situation.

3. **New Topics Not Automatically Displayed**: New topics posted after you cached the list won't appear in the quick switcher until you visit the list page again to refresh the cache.

4. **Limited Topic Count**: The quick switcher can only display topics included in the last list page you visited, typically one page worth of content.

These limitations are design choices made to maintain the script's lightweight nature and zero additional server request advantage.

## Installation

1. Install a user script manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. [Click here to install this script](https://github.com/utags/userscripts/raw/main/discourse-topic-quick-switcher/discourse-topic-quick-switcher.user.js)
3. Visit any Discourse forum and enjoy the enhanced navigation experience!

## Usage

1. **Cache a Topic List**:
   - Visit any Discourse forum topic list page (Latest, New, Categories, etc.)
   - The script will automatically cache the current list

2. **View the Cached List**:
   - While viewing a topic, you can:
     - Click the floating button in the bottom-right corner
     - Use the configured hotkey (default: Alt+Q)
   - A popup will appear showing the cached topic list

3. **Navigate Between Topics**:
   - Click any topic in the popup to navigate to it
   - Use keyboard shortcuts for quick navigation:
     - Next topic: configured hotkey (default: Alt+W)
     - Previous topic: configured hotkey (default: Alt+E)
   - Use the navigation buttons in the popup
   - The popup will automatically close after selection

4. **Customize Hotkeys**:
   - Access the settings dialog from the popup or floating button
   - Configure custom keyboard shortcuts for each action
   - Supported formats: Alt+KeyQ, Ctrl+KeyK, Shift+KeyG, etc.

5. **Close the Popup**:
   - Click the × button
   - Press the ESC key
   - Click outside the popup

## Compatibility

This script is designed for all Discourse forums and has been tested on the following browsers:

- Chrome
- Firefox
- Safari

## Release Notes

### v0.5.x

- Added customizable hotkey settings for enhanced navigation control
- Implemented hotkey configuration in settings dialog with validation and duplicate checking
- Added support for custom keyboard shortcuts for show topic list, next topic, and previous topic actions
- Enhanced hotkey parser with support for modifier keys (Ctrl, Alt, Shift, Meta) and various key codes
- Improved settings interface with dedicated hotkey configuration section
- Added internationalization support for hotkey-related text in both English and Chinese
- Maintained backward compatibility with existing default hotkeys while allowing full customization

### v0.4.x

- Added comprehensive mobile device optimization
- Refactored GM API calls to modern async format (`GM.*` instead of `GM_*`)
- Improved dark mode settings dialog styling and contrast
- Optimized site-specific key generation for better performance (pre-initialized at script load)
- Settings are now site-specific (each website maintains its own settings independently)
- Added dark mode toggle in settings with three options: Auto (default), Light, and Dark
- Enhanced save button styling with prominent primary button design and smooth animations

### v0.3.x

- Added settings dialog for customizing user experience
- Added language selection option in settings
- Added toggle for navigation button visibility

### v0.2.x

- Added quick navigation buttons for previous and next topics
- Added feature to automatically skip hidden topics during navigation

### v0.1.1

- Added internationalization support with English and Chinese translations

### v0.1.0

- Initial release
- Basic topic list caching functionality
- Floating button for quick access
- Keyboard shortcut support
- Cache expiration indicator
- Added current topic highlighting
- Added auto-scrolling to the current topic
- Added closing the list by clicking outside of it
- Improved dark mode support with automatic theme detection

## More Useful Scripts

Here are some other useful scripts that can enhance your browsing experience:

### 🏷️ UTags - Add User Tags to Links

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/460718-utags-add-usertags-to-links)
- **Features**: Add custom tags and notes to user, post, video and other links
- **Highlights**: Support special tag filtering (like spam, block, clickbait, etc.), data export/import, auto-mark viewed posts
- **Supported Sites**: V2EX, X(Twitter), Reddit, GitHub, Bilibili, Zhihu, Linux.do, Youtube and 50+ websites
- **Description**: Super useful tag management tool for adding tags to forum users or posts, making it easy to identify or block low-quality content

### 🔗 Links Helper

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/464541-links-helper)
- **Features**: Open third-party website links in new tabs, parse text links into hyperlinks
- **Highlights**: Support custom rules, parse Markdown and BBCode formats, convert image links to image tags
- **Supported Sites**: Universal for all websites, including Google, YouTube, GitHub, V2EX, etc.
- **Description**: Enhance link browsing experience, automatically process various link formats for more convenient web browsing

### 🔍 Find Scripts For This Site

- **Link**: [Greasy Fork](https://greasyfork.org/scripts/550659-find-scripts-for-this-site)
- **Features**: Quickly find user scripts for the current website
- **Highlights**: Support for multiple popular script repositories, easy discovery of useful scripts
- **Supported Sites**: Works on any website to find relevant userscripts
- **Description**: A convenient tool to discover and install userscripts specifically designed for the websites you visit

## License

MIT License - see the [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## Related Links

- [Project Homepage](https://github.com/utags/userscripts)
- [Issue Reporting](https://github.com/utags/userscripts/issues)
