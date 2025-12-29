# Userscript API Benchmark

[![Install](https://img.shields.io/badge/Install-Userscript-brightgreen?style=flat-square)](https://github.com/utags/userscript-api-benchmark/raw/refs/heads/main/userscript-api-benchmark.user.js)

## Purpose

This script is a comprehensive benchmark tool designed to test the compatibility and accuracy of Userscript Manager APIs. It verifies whether the APIs (both `GM_*` and `GM.*`) are correctly implemented according to the standards (e.g., Tampermonkey documentation).

It is particularly useful for:

- **Developers**: To verify if their userscript manager supports required APIs.
- **Users**: To check the capabilities of their installed userscript manager.
- **Maintainers**: To audit compliance with GM standards, especially for newer asynchronous `GM.*` APIs.

## Features

- **Dual API Support**: Tests both legacy synchronous `GM_*` APIs and modern asynchronous `GM.*` APIs.
- **Type Verification**: Checks if synchronous APIs return values directly and asynchronous APIs return Promises.
- **Functional Testing**: Executes actual API calls (e.g., storage read/write, value change listeners) to verify functionality, not just existence.
- **Isolated Execution**: Ensures that a failure in one API test does not block the execution of others.
- **Visual Reporting**: Displays a clear, color-coded table of results (Pass/Fail/N/A) directly on the page.

## Usage

1. Install the script in your Userscript Manager (Tampermonkey, Violentmonkey, etc.).
2. Visit any webpage.
3. Open the Userscript Manager menu.
4. Click on **"Run Benchmark"**.
5. A table will appear overlaying the page with the test results.

## Benchmark Results

### Tampermonkey

- **Manager**: Tampermonkey (5.4.1)
- **Browser**: Chrome 143.0.0.0
- **Date**: 2025-12-29

| API                                                | GM.\* (Support) | GM.\* (Pass) | GM\_\* (Support) | GM\_\* (Pass) |
| :------------------------------------------------- | :-------------: | :----------: | :--------------: | :-----------: |
| info                                               |       ✅        |     1/1      |        ✅        |      1/1      |
| log                                                |       ✅        |     1/1      |        ✅        |      1/1      |
| setValue / getValue                                |       ✅        |     2/2      |        ✅        |      2/2      |
| deleteValue                                        |       ✅        |     1/1      |        ✅        |      1/1      |
| listValues                                         |       ✅        |     1/1      |        ✅        |      1/1      |
| setValues / getValues / deleteValues               |       ✅        |     1/1      |        ✅        |      1/1      |
| addValueChangeListener / removeValueChangeListener |       ✅        |     5/5      |        ✅        |      5/5      |
| addStyle                                           |       ✅        |     1/1      |        ✅        |      1/1      |
| addElement                                         |       ✅        |     6/6      |        ✅        |      6/6      |
| registerMenuCommand                                |       ✅        |     1/1      |        ✅        |      1/1      |
| unregisterMenuCommand                              |       ✅        |     1/1      |        ✅        |      1/1      |
| xmlHttpRequest                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| download                                           |       ✅        |     1/1      |        ✅        |      1/1      |
| openInTab                                          |       ✅        |     1/1      |        ✅        |      1/1      |
| setClipboard                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| notification                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceText                                    |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceURL                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| getTab / saveTab / getTabs                         |       ✅        |     1/1      |        ✅        |      1/1      |
| cookie                                             |       ✅        |     1/1      |        ✅        |      1/1      |
| audio                                              |       ✅        |     1/1      |        ✅        |      1/1      |
| webRequest (Deprecated)                            |       ✅        |     1/1      |        ✅        |      1/1      |
| unsafeWindow                                       |       ✅        |     1/1      |        -         |       -       |
| window.onurlchange                                 |       ✅        |     1/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### Violentmonkey

- **Manager**: Violentmonkey (2.31.0)
- **Browser**: Firefox 146.0
- **Date**: 2025-12-29

| API                                                | GM.\* (Support) | GM.\* (Pass) | GM\_\* (Support) | GM\_\* (Pass) |
| :------------------------------------------------- | :-------------: | :----------: | :--------------: | :-----------: |
| info                                               |       ✅        |     1/1      |        ✅        |      1/1      |
| log                                                |       ✅        |     1/1      |        ✅        |      1/1      |
| setValue / getValue                                |       ✅        |     2/2      |        ✅        |      2/2      |
| deleteValue                                        |       ✅        |     1/1      |        ✅        |      1/1      |
| listValues                                         |       ✅        |     1/1      |        ✅        |      1/1      |
| setValues / getValues / deleteValues               |       ✅        |     1/1      |        ✅        |      1/1      |
| addValueChangeListener / removeValueChangeListener |       ✅        |     5/5      |        ✅        |      5/5      |
| addStyle                                           |       ✅        |     1/1      |        ✅        |      1/1      |
| addElement                                         |       ✅        |     6/6      |        ✅        |      6/6      |
| registerMenuCommand                                |       ✅        |     1/1      |        ✅        |      1/1      |
| unregisterMenuCommand                              |       ✅        |     1/1      |        ✅        |      1/1      |
| xmlHttpRequest                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| download                                           |       ✅        |     1/1      |        ✅        |      1/1      |
| openInTab                                          |       ✅        |     1/1      |        ✅        |      1/1      |
| setClipboard                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| notification                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceText                                    |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceURL                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| getTab / saveTab / getTabs                         |       ❌        |     0/1      |        ❌        |      0/1      |
| cookie                                             |       ❌        |     0/1      |        ❌        |      0/1      |
| audio                                              |       ❌        |     0/1      |        ❌        |      0/1      |
| webRequest (Deprecated)                            |       ❌        |     0/1      |        ❌        |      0/1      |
| unsafeWindow                                       |       ✅        |     1/1      |        -         |       -       |
| window.onurlchange                                 |       ❌        |     0/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### ScriptCat

- **Manager**: ScriptCat (1.2.3)
- **Browser**: Chrome 143.0.0.0
- **Date**: 2025-12-29

| API                                                | GM.\* (Support) | GM.\* (Pass) | GM\_\* (Support) | GM\_\* (Pass) |
| :------------------------------------------------- | :-------------: | :----------: | :--------------: | :-----------: |
| info                                               |       ✅        |     1/1      |        ✅        |      1/1      |
| log                                                |       ✅        |     1/1      |        ✅        |      1/1      |
| setValue / getValue                                |       ✅        |     2/2      |        ✅        |      2/2      |
| deleteValue                                        |       ✅        |     1/1      |        ✅        |      1/1      |
| listValues                                         |       ✅        |     1/1      |        ✅        |      1/1      |
| setValues / getValues / deleteValues               |       ✅        |     1/1      |        ✅        |      1/1      |
| addValueChangeListener / removeValueChangeListener |       ✅        |     5/5      |        ✅        |      5/5      |
| addStyle                                           |       ✅        |     1/1      |        ✅        |      1/1      |
| addElement                                         |       ✅        |     6/6      |        ✅        |      6/6      |
| registerMenuCommand                                |       ✅        |     1/1      |        ✅        |      1/1      |
| unregisterMenuCommand                              |       ✅        |     1/1      |        ✅        |      1/1      |
| xmlHttpRequest                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| download                                           |       ✅        |     1/1      |        ✅        |      1/1      |
| openInTab                                          |       ✅        |     1/1      |        ✅        |      1/1      |
| setClipboard                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| notification                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceText                                    |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceURL                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| getTab / saveTab / getTabs                         |       ✅        |     1/1      |        ✅        |      1/1      |
| cookie                                             |       ✅        |     1/1      |        ✅        |      1/1      |
| audio                                              |       ❌        |     0/1      |        ❌        |      0/1      |
| webRequest (Deprecated)                            |       ❌        |     0/1      |        ❌        |      0/1      |
| unsafeWindow                                       |       ✅        |     1/1      |        -         |       -       |
| window.onurlchange                                 |       ❌        |     0/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### Userscripts (Safari)

- **Manager**: Userscripts (4.8.2)
- **Browser**: Safari 605.1.15
- **Date**: 2025-12-29

| API                                                | GM.\* (Support) | GM.\* (Pass) | GM\_\* (Support) | GM\_\* (Pass) |
| :------------------------------------------------- | :-------------: | :----------: | :--------------: | :-----------: |
| info                                               |       ✅        |     1/1      |        ✅        |      1/1      |
| log                                                |       ❌        |     0/1      |        ❌        |      0/1      |
| setValue / getValue                                |       ✅        |     2/2      |        ❌        |      0/2      |
| deleteValue                                        |       ✅        |     1/1      |        ❌        |      0/1      |
| listValues                                         |       ✅        |     1/1      |        ❌        |      0/1      |
| setValues / getValues / deleteValues               |       ❌        |     0/1      |        ❌        |      0/1      |
| addValueChangeListener / removeValueChangeListener |       ❌        |     0/5      |        ❌        |      0/5      |
| addStyle                                           |       ⚠️        |     0/1      |        ❌        |      0/1      |
| addElement                                         |       ❌        |     0/6      |        ❌        |      0/6      |
| registerMenuCommand                                |       ❌        |     0/1      |        ❌        |      0/1      |
| unregisterMenuCommand                              |       ❌        |     0/1      |        ❌        |      0/1      |
| xmlHttpRequest                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| download                                           |       ❌        |     0/1      |        ❌        |      0/1      |
| openInTab                                          |       ✅        |     1/1      |        ❌        |      0/1      |
| setClipboard                                       |       ✅        |     1/1      |        ❌        |      0/1      |
| notification                                       |       ❌        |     0/1      |        ❌        |      0/1      |
| getResourceText                                    |       ❌        |     0/1      |        ❌        |      0/1      |
| getResourceURL                                     |       ❌        |     0/1      |        ❌        |      0/1      |
| getTab / saveTab / getTabs                         |       ❌        |     0/1      |        ❌        |      0/1      |
| cookie                                             |       ❌        |     0/1      |        ❌        |      0/1      |
| audio                                              |       ❌        |     0/1      |        ❌        |      0/1      |
| webRequest (Deprecated)                            |       ❌        |     0/1      |        ❌        |      0/1      |
| unsafeWindow                                       |       ❌        |     0/1      |        -         |       -       |
| window.onurlchange                                 |       ❌        |     0/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### Stay (Safari)

- **Manager**: tamp (2.9.12)
- **Browser**: Safari 605.1.15
- **Date**: 2025-12-29

| API                                                | GM.\* (Support) | GM.\* (Pass) | GM\_\* (Support) | GM\_\* (Pass) |
| :------------------------------------------------- | :-------------: | :----------: | :--------------: | :-----------: |
| info                                               |       ✅        |     1/1      |        ✅        |      1/1      |
| log                                                |       ✅        |     1/1      |        ✅        |      1/1      |
| setValue / getValue                                |       ✅        |     2/2      |        ✅        |      2/2      |
| deleteValue                                        |       ✅        |     1/1      |        ✅        |      1/1      |
| listValues                                         |       ✅        |     1/1      |        ✅        |      1/1      |
| setValues / getValues / deleteValues               |       ❌        |     0/1      |        ❌        |      0/1      |
| addValueChangeListener / removeValueChangeListener |       ⚠️        |     0/5      |        ⚠️        |      0/5      |
| addStyle                                           |       ⚠️        |     0/1      |        ✅        |      1/1      |
| addElement                                         |       ⚠️        |     4/6      |        ⚠️        |      4/6      |
| registerMenuCommand                                |       ✅        |     1/1      |        ✅        |      1/1      |
| unregisterMenuCommand                              |       ✅        |     1/1      |        ✅        |      1/1      |
| xmlHttpRequest                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| download                                           |       ❌        |     0/1      |        ✅        |      1/1      |
| openInTab                                          |       ✅        |     1/1      |        ✅        |      1/1      |
| setClipboard                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| notification                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceText                                    |       ❌        |     0/1      |        ✅        |      1/1      |
| getResourceURL                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| getTab / saveTab / getTabs                         |       ✅        |     1/1      |        ✅        |      1/1      |
| cookie                                             |       ✅        |     1/1      |        ✅        |      1/1      |
| audio                                              |       ❌        |     0/1      |        ❌        |      0/1      |
| webRequest (Deprecated)                            |       ❌        |     0/1      |        ❌        |      0/1      |
| unsafeWindow                                       |       ✅        |     1/1      |        -         |       -       |
| window.onurlchange                                 |       ❌        |     0/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### Stay (Chrome)

- **Manager**: extensions/stay (0.1)
- **Browser**: Chrome 143.0.0.0
- **Date**: 2025-12-29

| API                                                | GM.\* (Support) | GM.\* (Pass) | GM\_\* (Support) | GM\_\* (Pass) |
| :------------------------------------------------- | :-------------: | :----------: | :--------------: | :-----------: |
| info                                               |       ✅        |     1/1      |        ✅        |      1/1      |
| log                                                |       ✅        |     1/1      |        ✅        |      1/1      |
| setValue / getValue                                |       ✅        |     2/2      |        ✅        |      2/2      |
| deleteValue                                        |       ✅        |     1/1      |        ✅        |      1/1      |
| listValues                                         |       ✅        |     1/1      |        ✅        |      1/1      |
| setValues / getValues / deleteValues               |       ❌        |     0/1      |        ❌        |      0/1      |
| addValueChangeListener / removeValueChangeListener |       ⚠️        |     0/5      |        ⚠️        |      0/5      |
| addStyle                                           |       ✅        |     1/1      |        ✅        |      1/1      |
| addElement                                         |       ⚠️        |     4/6      |        ⚠️        |      4/6      |
| registerMenuCommand                                |       ✅        |     1/1      |        ✅        |      1/1      |
| unregisterMenuCommand                              |       ✅        |     1/1      |        ✅        |      1/1      |
| xmlHttpRequest                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| download                                           |       ❌        |     0/1      |        ✅        |      1/1      |
| openInTab                                          |       ✅        |     1/1      |        ✅        |      1/1      |
| setClipboard                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| notification                                       |       ✅        |     1/1      |        ✅        |      1/1      |
| getResourceText                                    |       ❌        |     0/1      |        ✅        |      1/1      |
| getResourceURL                                     |       ✅        |     1/1      |        ✅        |      1/1      |
| getTab / saveTab / getTabs                         |       ✅        |     1/1      |        ✅        |      1/1      |
| cookie                                             |       ✅        |     1/1      |        ✅        |      1/1      |
| audio                                              |       ❌        |     0/1      |        ❌        |      0/1      |
| webRequest (Deprecated)                            |       ❌        |     0/1      |        ❌        |      0/1      |
| unsafeWindow                                       |       ✅        |     1/1      |        -         |       -       |
| window.onurlchange                                 |       ❌        |     0/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### Greasemonkey

- **Manager**: Greasemonkey (4.13)
- **Browser**: Firefox 146.0
- **Date**: 2025-12-29

| API                                                | GM.\* (Support) | GM.\* (Pass) | GM\_\* (Support) | GM\_\* (Pass) |
| :------------------------------------------------- | :-------------: | :----------: | :--------------: | :-----------: |
| info                                               |       ✅        |     1/1      |        ✅        |      1/1      |
| log                                                |       ❌        |     0/1      |        ❌        |      0/1      |
| setValue / getValue                                |       ✅        |     2/2      |        ❌        |      0/2      |
| deleteValue                                        |       ✅        |     1/1      |        ❌        |      0/1      |
| listValues                                         |       ✅        |     1/1      |        ❌        |      0/1      |
| setValues / getValues / deleteValues               |       ❌        |     0/1      |        ❌        |      0/1      |
| addValueChangeListener / removeValueChangeListener |       ❌        |     0/5      |        ❌        |      0/5      |
| addStyle                                           |       ❌        |     0/1      |        ❌        |      0/1      |
| addElement                                         |       ❌        |     0/6      |        ❌        |      0/6      |
| registerMenuCommand                                |       ✅        |     1/1      |        ❌        |      0/1      |
| unregisterMenuCommand                              |       ❌        |     0/1      |        ❌        |      0/1      |
| xmlHttpRequest                                     |       ✅        |     1/1      |        ❌        |      0/1      |
| download                                           |       ❌        |     0/1      |        ❌        |      0/1      |
| openInTab                                          |       ✅        |     1/1      |        ❌        |      0/1      |
| setClipboard                                       |       ✅        |     1/1      |        ❌        |      0/1      |
| notification                                       |       ✅        |     1/1      |        ❌        |      0/1      |
| getResourceText                                    |       ❌        |     0/1      |        ❌        |      0/1      |
| getResourceURL                                     |       ✅        |     1/1      |        ❌        |      0/1      |
| getTab / saveTab / getTabs                         |       ❌        |     0/1      |        ❌        |      0/1      |
| cookie                                             |       ❌        |     0/1      |        ❌        |      0/1      |
| audio                                              |       ❌        |     0/1      |        ❌        |      0/1      |
| webRequest (Deprecated)                            |       ❌        |     0/1      |        ❌        |      0/1      |
| unsafeWindow                                       |       ✅        |     1/1      |        -         |       -       |
| window.onurlchange                                 |       ❌        |     0/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### END

## Project Info

- **Repository**: [https://github.com/utags/userscript-api-benchmark](https://github.com/utags/userscript-api-benchmark)
- **Issues**: [https://github.com/utags/userscript-api-benchmark/issues](https://github.com/utags/userscript-api-benchmark/issues)
- **License**: MIT

## Changelog

### 0.1.5

- Add `addStyle` and `addElement` test cases.

### 0.1.1

- Initial release.
- Support for `GM.*` (Promise) and `GM_*` (Callback/Sync) APIs.
- Comprehensive test coverage including storage, values, tabs, and window operations.
