# Discourse Topic Quick Switcher

A powerful user script that brings seamless topic navigation, intelligent current topic highlighting, and adaptive theme switching to Discourse forums. Browse your favorite forums with unprecedented speed and efficiency.

## Features

- **Topic List Caching**: Automatically caches the topic list when you visit a list page.
- **Quick Access**: Access the cached list from any topic page via:
  - A floating button in the bottom-right corner
  - A keyboard shortcut (backtick key `` ` ``)
- **User-Friendly Interface**:
  - Displays cache time and source information
  - Navigate directly to topics from the popup panel
  - Close with the ESC key, a close button, or by clicking outside the panel
  - Highlights the current topic for easy identification
  - Automatically scrolls to the current topic in the list
- **Smart Theme Detection**:
  - Automatically adapts to light/dark mode based on system and site preferences
- **Cache Management**:
  - 1-hour cache expiration with a visual indicator
  - Source link to return to the original list page

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
     - Press the backtick key (`` ` ``)
   - A popup will appear showing the cached topic list

3. **Navigate Between Topics**:
   - Click any topic in the popup to navigate to it
   - The popup will automatically close after selection

4. **Close the Popup**:
   - Click the × button
   - Press the ESC key
   - Click outside the popup

## Configuration

You can modify the following settings at the top of the script:

```javascript
const CONFIG = {
  // Keyboard shortcut (default: backtick key)
  HOTKEY: '`',
  // Cache key name
  CACHE_KEY: 'discourse_topic_list_cache',
  // Cache expiration time (in milliseconds) - 1 hour
  CACHE_EXPIRY: 60 * 60 * 1000,
  // Whether to show the floating button on topic pages
  SHOW_FLOATING_BUTTON: true,
  // Route check interval (in milliseconds)
  ROUTE_CHECK_INTERVAL: 500,
  // Whether to automatically follow system dark mode
  AUTO_DARK_MODE: true,
}
```

## Compatibility

This script is designed for all Discourse forums and has been tested on the following browsers:

- Chrome
- Firefox
- Safari

## Release Notes

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

## License

MIT License - see the [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
