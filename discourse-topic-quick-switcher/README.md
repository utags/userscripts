# Discourse Topic Quick Switcher

A powerful userscript that transforms Discourse forums with seamless topic navigation, current topic highlighting, and adaptive theming. Navigate your favorite forums with unprecedented speed and efficiency.

## Features

- **Topic List Caching**: Automatically caches the topic list when you visit a list page
- **Quick Access**: Access the cached list from any topic page via:
  - Floating button in the bottom-right corner
  - Keyboard shortcut (backtick key `` ` ``)
- **User-Friendly Interface**:
  - Shows cache age and source information
  - Direct topic navigation from the popup panel
  - Close with ESC key, close button, or clicking outside the popup
  - Current topic highlighting for easy identification
  - Auto-scrolls to current topic in the list
- **Smart Theme Detection**:
  - Automatically adapts to light/dark mode based on system and site preferences
- **Cache Management**:
  - 1-hour cache expiration with visual indicators
  - Source link to return to the original list

## Installation

1. Install a userscript manager extension:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox)
   - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)

2. Install this script by clicking [here](https://github.com/utags/userscripts/raw/main/discourse-topic-quick-switcher/discourse-topic-quick-switcher.user.js)

## Usage

1. **Cache a Topic List**:
   - Visit any Discourse forum topic list page (latest, new, categories, etc.)
   - The script automatically caches the current list

2. **View the Cached List**:
   - While viewing a topic, either:
     - Click the floating button in the bottom-right corner
     - Press the backtick key (`` ` ``)
   - A popup will appear with the cached topic list

3. **Navigate Between Topics**:
   - Click on any topic in the popup to navigate to it
   - The popup will automatically close after selection

4. **Close the Popup**:
   - Click the × button
   - Press the ESC key
   - Click outside the popup

## Configuration

You can modify the following settings at the top of the script:

```javascript
const CONFIG = {
  // Keyboard shortcut (default is backtick key)
  HOTKEY: '`',
  // Cache key name
  CACHE_KEY: 'discourse_topic_list_cache',
  // Cache expiration time (milliseconds) - 1 hour
  CACHE_EXPIRY: 60 * 60 * 1000,
  // Whether to show the floating button on topic pages
  SHOW_FLOATING_BUTTON: true,
  // Route check interval (milliseconds)
  ROUTE_CHECK_INTERVAL: 500,
  // Whether to automatically follow system dark mode
  AUTO_DARK_MODE: true,
}
```

## Compatibility

This script works with all Discourse forums and has been tested on:

- Chrome
- Firefox
- Safari

## Release Notes

### v0.1.0

- Initial release
- Basic topic list caching functionality
- Floating button for quick access
- Keyboard shortcut support
- Cache expiration indicators
- Added current topic highlighting feature
- Added auto-scroll to current topic in list
- Added ability to close the list by clicking outside
- Improved dark mode support with automatic theme detection

## License

MIT License - See [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
