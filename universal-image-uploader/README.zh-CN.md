# 通用图片上传助手（Universal Image Uploader）

一个用户脚本：在任意网站上粘贴、拖拽或选择图片，批量上传到 Imgur 或 Tikolu 或 MJJ.Today 或 Appinn（可选择图床），并按需自动复制为 Markdown/HTML/BBCode/纯链接。支持可配置的站点按钮（兼容单页应用），提供本地上传历史便于快速复用。

[English](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.md)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-23-13.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-12-14.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-08-06.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-06-32.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-00.png)

![screencapture](https://raw.githubusercontent.com/utags/userscripts/main/assets/2025-10-22-21-09-33.png)

## 功能（MVP）

- 📥 支持粘贴、拖拽、文件选择收集图片
- 📤 批量上传到 Imgur/Tikolu/MJJ.Today/Appinn，实时显示进度
- 📋 自动复制输出：`Markdown` / `HTML` / `BBCode` / `Link`
- 🕘 本地历史记录，便于再次复制与复用
- 🔘 可选站点按钮注入，兼容 SPA（按站点配置）

## 安装

### 依赖

任意脚本管理器：

- [Tampermonkey](https://www.tampermonkey.net/)
- [Violentmonkey](https://violentmonkey.github.io/)
- [ScriptCat](https://scriptcat.org/)

### 安装脚本

1. 点击 [这里](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js) 从 GitHub 安装脚本
2. 点击 [这里](https://greasyfork.org/zh-CN/scripts/553341-universal-image-uploader) 从 Greasy Fork 安装脚本
3. 点击 [这里](https://scriptcat.org/script-show-page/4467) 从 ScriptCat 安装脚本

## 使用方法

- 在页面中粘贴/拖拽图片，或使用面板选择文件
- 队列中可查看上传进度
- 在面板的图床选择器中选择上传平台（Imgur/Tikolu/MJJ.Today/Appinn）
- 在面板的代理选择器中选择是否使用代理（默认“无”；Imgur 不支持）
- 完成后按所选格式自动复制
- 历史记录中可快速再次复制

### 输出格式示例

- `Markdown`：`![alt](url)`
- `HTML`：`<img src="url" alt="alt" />`
- `BBCode`：`[img]url[/img]`
- `Link`：`url`

## 配置项

- 站点记忆图床：`Imgur` / `Tikolu`
- 站点记忆代理：`无` / `wsrv.nl`（Imgur 不支持；当选择 `wsrv.nl` 时，输出与历史复制/打开将使用 `https://wsrv.nl/?url=${encodeURIComponent(url)}`）
- 站点记忆输出格式：`Markdown` / `HTML` / `BBCode` / `Link`
- 可选站点按钮注入：选择器、位置（`before` | `inside` | `after`）、按钮文案

## 站点按钮设置

- 打开面板，切换到“设置”页。
- 填写“CSS 选择器”，用于定位要插入按钮的目标元素（例如 `.comment-screenshot-control`）。
- 选择位置：`之前` 在元素前插入，`之后` 在元素后插入，`里面` 作为最后一个子元素。
- 按钮文案：可填纯文本或单根 HTML 片段；留空或 HTML 不合法时，会回退为本地化默认文案，并使用内置样式按钮。
- 点击 `保存并插入`：规则会保存到本地并立即注入；脚本内置 DOM 观察器，兼容 SPA 页面。
- 使用 `移除按钮（临时）` 仅移除已注入按钮，不删除规则。
- 使用 `清空设置` 删除所有已保存规则。
- 列表中的每一项支持 `编辑` 和 `删除`。
- 提示：尽量选用稳定且唯一的选择器，避免过宽匹配造成多处插入。

## Roadmap（规划 / 未实现）

- 🌐 多平台上传：SM.MS、Cloudflare Images、自建 S3/MinIO
- 🛠 图片处理：质量、尺寸、压缩、格式（JPEG/PNG/WebP）、EXIF 清理
- 📦 队列增强：并发控制、失败重试、取消/暂停
- 🧩 模板系统：完全自定义输出与 HTML 片段
- 🗂 历史增强：按时间/平台/标签过滤，批量复制，更快复用

## 更新记录

### v0.6.x

- 新增每站点启用开关（命令菜单），切换后刷新页面生效。
- 新增每站点“粘贴上传/拖拽上传”开关（设置页）；预置站点默认启用。
- 支持同时粘贴多个图片上传。
- 粘贴/拖拽开关即时生效，无需刷新页面。
- 在目标输入框插入上传状态占位符，并在成功/失败时替换。

### v0.5.x

- 新增 MJJ.Today 图床。
- 新增 Appinn 图床。

### v0.4.x

- 支持自定义格式模版。
- Imgur 上传改为使用 `GM_xmlhttpRequest`，规避跨域问题。
- 抽取通用请求函数 `gmRequest`，统一上传通道的请求与错误处理。

### v0.3.x

- 设置存储迁移为统一的“站点映射”，将原先分散的多个键合并为单一结构，示例：`{ format?, host?, proxy?, btns?: [...] }`。
- 面板改为使用 Shadow DOM 渲染，实现与站点样式的隔离。内部样式使用 `:host`；拖拽覆盖层（`#uiu-drop`）与站点注入按钮（`.uiu-insert-btn`）仍保留在页面 DOM。
- 为“历史”和“设置”切换按钮新增高亮（打开态）与无障碍状态（`aria-pressed`），更易识别当前展开状态。
- 焦点跟踪支持 Shadow DOM：深入开放 Shadow DOM 与同源 iframe，正确识别可编辑目标；同时排除脚本面板本身，避免被记录为目标。
- Trusted Types 兼容：不再使用 `innerHTML` 清空（改用 `textContent = ''`）；自定义按钮 HTML 采用 `Range.createContextualFragment` 解析，避免在启用 TT 的站点报错。
- 兼容性：旧设置会自动迁移，无需手动操作。

### v0.2.x

- 新增代理选项：`无` / `wsrv.nl`；Imgur 不支持；当选择 `wsrv.nl` 时，输出与历史复制/打开将使用 `https://wsrv.nl/?url=${encodeURIComponent(url)}`
- 新增 Tikolu 图床，面板支持选择 Imgur/Tikolu
- 新增“记住最后访问输入框”：当点击上传等操作导致失焦时，仍可将内容插入到最后访问的输入框并自动恢复焦点；优化 `contentEditable` 插入时的光标定位（默认插入末尾）

### v0.1.0

- 初始 MVP：Imgur 上传、批量与进度、自动复制（Markdown/HTML/BBCode/Link）、本地历史、兼容 SPA 的站点按钮注入

## 更多实用脚本

以下是一些其他有用的脚本，可以增强您的浏览体验：

| 脚本名称                                                                                                                                    | 功能描述                                                                                                          | 适用网站                                                                     | 安装链接                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Find Scripts For This Site](https://github.com/utags/userscripts/blob/main/find-scripts-for-this-site/README.zh-CN.md)                     | 一键在 Greasy Fork、OpenUserJS、ScriptCat、GitHub/Gist 等仓库查找当前网站脚本                                     | 所有网站                                                                     | [GitHub](https://github.com/utags/userscripts/raw/main/find-scripts-for-this-site/find-scripts-for-this-site.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/550659-find-scripts-for-this-site) <br> [ScriptCat](https://scriptcat.org/script-show-page/4276)                               |
| [Universal Image Uploader](https://github.com/utags/userscripts/blob/main/universal-image-uploader/README.zh-CN.md)                         | 粘贴/拖拽/选择图片批量上传到 Imgur/Tikolu，自动复制为 Markdown/HTML/BBCode/链接，支持站点按钮与本地历史           | 所有网站                                                                     | [GitHub](https://github.com/utags/userscripts/raw/main/universal-image-uploader/universal-image-uploader.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/553341-universal-image-uploader) <br> [ScriptCat](https://scriptcat.org/script-show-page/4467)                                     |
| [Discourse Sort Option Quick Switcher](https://github.com/utags/userscripts/blob/main/discourse-sort-option-quick-switcher/README.zh-CN.md) | 菜单一键切换 Discourse 列表排序（创建/回复时间、回复数、浏览量、点赞数），仅更新 order 与 ascending，避免重复刷新 | 所有 Discourse 论坛                                                          | [GitHub](https://github.com/utags/userscripts/raw/main/discourse-sort-option-quick-switcher/discourse-sort-option-quick-switcher.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/554927-discourse-sort-option-quick-switcher) <br> [ScriptCat](https://scriptcat.org/script-show-page/4555) |
| [Discourse Topic Quick Switcher](https://github.com/utags/userscripts/blob/main/discourse-topic-quick-switcher/README.zh-CN.md)             | 缓存话题列表，悬浮面板与快捷键快速在话题间导航，支持设置与多语言                                                  | 所有 Discourse 论坛                                                          | [GitHub](https://github.com/utags/userscripts/raw/main/discourse-topic-quick-switcher/discourse-topic-quick-switcher.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/550982-discourse-topic-quick-switcher) <br> [ScriptCat](https://scriptcat.org/script-show-page/4310)                   |
| [LINUX.DO CloudFlare 5秒盾自动跳转](https://github.com/utags/userscripts/blob/main/linux.do-auto-challenge/README.md)                       | 检测 5 秒盾失败并自动跳转至 challenge 页面，支持手动触发                                                          | Linux.do                                                                     | [GitHub](https://github.com/utags/userscripts/raw/main/linux.do-auto-challenge/linux.do-auto-challenge.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/552218-linux-do-cloudflare-challenge-bypass) <br> [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4373)                     |
| [LINUX.DO Auto Load New Topics](https://github.com/utags/userscripts/blob/main/linux.do-auto-load-new-topics/README.md)                     | 智能自动加载新话题，含错误处理与检测优化                                                                          | Linux.do                                                                     | [GitHub](https://github.com/utags/userscripts/raw/main/linux.do-auto-load-new-topics/linux.do-auto-load-new-topics.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/545775-linux-do-auto-load-new-topics)                                                                                    |
| [LINUX.DO Load More Topics Manually](https://github.com/utags/userscripts/blob/main/linux.do-manual-load-more/README.md)                    | 页面底部添加“加载更多”按钮，手动控制内容加载                                                                      | Linux.do                                                                     | [GitHub](https://github.com/utags/userscripts/raw/main/linux.do-manual-load-more/linux.do-manual-load-more.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/545779-linux-do-load-more-topics-manually)                                                                                       |
| [No GIF Avatars](https://github.com/utags/userscripts/blob/main/no-gif-avatars/README.md)                                                   | 将动图头像转换为静态 PNG，减少动画干扰并提升性能                                                                  | Linux.do、NodeLoc                                                            | [GitHub](https://github.com/utags/userscripts/raw/main/no-gif-avatars/no-gif-avatars.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/529447-no-gif-avatars)                                                                                                                                 |
| [V2EX No Node Specific Styles](https://github.com/utags/userscripts/blob/main/v2ex-no-node-specific-styles/README.md)                       | 去除每个节点的特性化样式，保持所有页面样式统一、简洁                                                              | V2EX                                                                         | [GitHub](https://github.com/utags/userscripts/raw/main/v2ex-no-node-specific-styles/v2ex-no-node-specific-styles.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/555374-v2ex-no-node-specific-styles) <br> [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4591)                   |
| [小鱼标签 (UTags)](https://github.com/utags/utags)                                                                                          | 为链接添加用户标签与备注，支持过滤、导入导出、自动标记已读；可为论坛用户或帖子加标签，便于识别或屏蔽低质内容      | V2EX、X（Twitter）、Reddit、GitHub、B站、知乎、Linux.do、NodeLoc 等 50+ 网站 | [GitHub](https://github.com/utags/utags/raw/refs/heads/main/packages/extension/build/userscript-prod/utags.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/460718-utags-add-usertags-to-links) <br> [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/2784)                          |
| [链接助手](https://github.com/utags/links-helper)                                                                                           | 在新标签页打开第三方链接，解析文本为超链接，支持自定义规则、Markdown/BBCode、图片链接转标签                       | 所有网站                                                                     | [GitHub](https://github.com/utags/links-helper/raw/refs/heads/main/build/userscript-prod/links-helper.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/464541-links-helper) <br> [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4486)                                              |
| [V2EX.REP](https://github.com/v2hot/v2ex.rep)                                                                                               | 修复楼层号错位，显示热门回复，预加载分页与上传图片；无感签到、快速感谢/隐藏、双击导航                             | V2EX                                                                         | [GitHub](https://github.com/v2hot/v2ex.rep/raw/refs/heads/main/build/userscript-prod/v2ex.rep.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/466589-v2ex-rep) <br> [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/4592)                                                          |
| [赐你个头像吧](https://github.com/utags/replace-ugly-avatars)                                                                               | 批量替换用户头像，使用 DiceBear 生成随机头像，支持统一风格设置                                                    | V2EX、Linux.do                                                               | [GitHub](https://github.com/utags/replace-ugly-avatars/raw/refs/heads/main/build/userscript-prod/replace-ugly-avatars.user.js) <br> [Greasy Fork](https://greasyfork.org/zh-CN/scripts/472616-replace-ugly-avatars) <br> [ScriptCat](https://scriptcat.org/zh-CN/script-show-page/3049)                      |
| [UTags Advanced Filter](https://github.com/utags/utags-advanced-filter)                                                                     | 一个在任意网站对列表型内容进行实时过滤与隐藏的工具，提供用户脚本和浏览器扩展两种版本。                            | GreasyFork, SleasyFork                                                       | [Greasy Fork](https://greasyfork.org/scripts/556095-utags-advanced-filter) <br> [ScriptCat](https://scriptcat.org/en/script-show-page/4653) <br> [GitHub Raw](https://github.com/utags/utags-advanced-filter/raw/refs/heads/main/build/userscript-prod/utags-advanced-filter.user.js)                        |

## 许可证

MIT License - 详见 [LICENSE](https://github.com/utags/userscripts/blob/main/LICENSE) 文件

## 相关链接

- [项目主页](https://github.com/utags/userscripts)
- [问题反馈](https://github.com/utags/userscripts/issues)
