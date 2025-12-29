# 用户脚本 API 基准测试 (Userscript API Benchmark)

[![Install](https://img.shields.io/badge/Install-Userscript-brightgreen?style=flat-square)](https://github.com/utags/userscript-api-benchmark/raw/refs/heads/main/userscript-api-benchmark.user.js)

## 目的

本脚本是一个综合性的基准测试工具，旨在测试用户脚本管理器（Userscript Manager）API 的兼容性和准确性。它验证 API（包括 `GM_*` 和 `GM.*`）是否按照标准（如 Tampermonkey 文档）正确实现。

它特别适用于：

- **开发者**：验证用户脚本管理器是否支持所需的 API。
- **用户**：检查已安装的脚本管理器的能力。
- **维护者**：审计 GM 标准的合规性，特别是对于较新的异步 `GM.*` API。

## 功能特性

- **双 API 支持**：同时测试传统的同步 `GM_*` API 和现代的异步 `GM.*` API。
- **类型验证**：检查同步 API 是否直接返回值，以及异步 API 是否返回 Promise。
- **功能测试**：执行实际的 API 调用（如存储读写、值变更监听）以验证功能，而不仅仅是检查 API 是否存在。
- **隔离执行**：确保一个 API 测试的失败不会阻塞其他测试的执行。
- **可视化报告**：在页面上直接显示清晰、颜色编码的结果表（通过/失败/不支持）。

## 使用方法

1. 在您的用户脚本管理器（Tampermonkey, Violentmonkey 等）中安装本脚本。
2. 访问任意网页。
3. 打开用户脚本管理器菜单。
4. 点击 **"Run Benchmark"**（运行基准测试）。
5. 页面上将出现一个覆盖层，显示详细的测试结果表。

## 测试结果

### Tampermonkey (v5.4.1)

- **Manager**: Tampermonkey (5.4.1)
- **Browser**: Chrome 143.0.0.0
- **Date**: 2025-12-27

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
| addElement                                         |       ✅        |     1/1      |        ✅        |      1/1      |
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

### Violentmonkey (v2.31.0)

- **Manager**: Violentmonkey (2.31.0)
- **Browser**: Firefox 146.0
- **Date**: 2025-12-27

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
| addElement                                         |       ✅        |     1/1      |        ✅        |      1/1      |
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

### ScriptCat (v1.2.2)

- **Manager**: ScriptCat (1.2.2)
- **Browser**: Chrome 143.0.0.0
- **Date**: 2025-12-27

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
| addElement                                         |       ✅        |     1/1      |        ✅        |      1/1      |
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

### Userscripts (Safari) (v4.8.2)

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
| addElement                                         |       ❌        |     0/1      |        ❌        |      0/1      |
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

### Stay (Safari) (v2.9.12)

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
| addElement                                         |       ✅        |     1/1      |        ✅        |      1/1      |
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
| addElement                                         |       ✅        |     1/1      |        ✅        |      1/1      |
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

### Greasemonkey (v4.13.0)

- **Manager**: Greasemonkey (4.13)
- **Browser**: Firefox 146.0
- **Date**: 2025-12-27

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
| addElement                                         |       ❌        |     0/1      |        ❌        |      0/1      |
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
| unsafeWindow                                       |       ❌        |     0/1      |        -         |       -       |
| window.onurlchange                                 |       ❌        |     0/1      |        -         |       -       |
| window.close                                       |       ✅        |     1/1      |        -         |       -       |
| window.focus                                       |       ✅        |     1/1      |        -         |       -       |

### END

## 项目信息

- **代码仓库**: [https://github.com/utags/userscripts](https://github.com/utags/userscripts)
- **问题反馈**: [https://github.com/utags/userscripts/issues](https://github.com/utags/userscripts/issues)
- **许可证**: MIT

## 更新日志

### 0.1.1

- 初始发布。
- 支持 `GM.*` (Promise) 和 `GM_*` (回调/同步) API。
- 全面的测试覆盖，包括存储、值管理、标签页和窗口操作。
