# 项目规则（userscripts）

## 常用命令

- 类型检查：`pnpm run lint:type`
- 代码规范检查：`pnpm run xo`
- 自动修复与格式化：`pnpm run lint:code`
- 构建测试版用户脚本：`pnpm run staging`
- 构建生产版用户脚本：`pnpm run build`
- 本地预览静态目录：`pnpm run server`

## 修改后必做

- 完成代码改动后依次运行：
  - `pnpm run lint:type`
  - `pnpm run xo`
  - `pnpm run lint`
  - `pnpm run test`
  - `pnpm run staging`
- 如有规范问题，运行 `pnpm run lint:code` 自动修复，再重复上述检查。

## Trusted Types 与 DOM 安全更新

- 避免为 `innerHTML`、`outerHTML` 直接赋普通字符串，启用 Trusted Types 的页面会报错：`This document requires 'TrustedHTML' assignment.`
- 清空或更新 DOM 时使用安全 API：
  - 清空：`element.replaceChildren()` 或 `element.textContent = ''`
  - 插入：`append/appendChild/insertAdjacentElement` 等节点级 API，不拼接 HTML 字符串
- 如需插入 HTML 字符串，必须通过站点的 Trusted Types 策略生成 `TrustedHTML`，否则禁止。

## TypeScript 与 GM API

- 直接使用全局 `GM_*` API，不使用 `(globalThis as any).GM_*`。
- 在使用处为 `GM_*` 做显式声明，例如：
  - `declare const GM_registerMenuCommand: (caption: string, onClick: () => void) => any`
  - `declare const GM_unregisterMenuCommand: (menuId: any) => void`
  - `declare const GM_addValueChangeListener: (name: string, cb: (name: string, oldValue: string, newValue: string, remote: boolean) => void) => any`
- 调用前使用 `typeof fn === 'function'` 判定以兼容不同脚本管理器。

## DOM 与样式约定

- UI 采用 Shadow DOM 宿主，宿主属性：`data-utqn-host="utags-quick-nav"`，同时设置 `host.dataset.utqnHost = 'utags-quick-nav'`。
- 使用 `dataset` 设置自定义属性，避免 `setAttribute` 触发 lint 规则。
- 样式使用 Tailwind CSS（类选择器与 `@apply`），避免 `backdrop-filter` 等高开销效果。

## 防重复注入

- 在入口处添加单例标记：`document.documentElement.dataset.utqn = '1'`。
- 若已标记，则直接返回，避免多脚本管理器或重复执行造成冲突。
- 创建根节点时优先复用已存在宿主以避免重复节点：
  - 通过 `document.querySelector('[data-utqn-host="utags-quick-nav"]')` 查找并复用。

## 交互与渲染

- 重渲染时保留滚动位置（读写 `scrollLeft/scrollTop`，并使用 `requestAnimationFrame` 二次恢复）。
- 动态列数：`--cols = min(itemsPerRow, 可见项个数)`，至少为 1。
- 空态文案：空分组显示“无项目”，全隐藏显示“项目已被隐藏”。
- 折叠/展开按钮常显（`.icon-btn.toggle`），其它操作按钮悬停显示。

## 项目结构

- 主目录：`src/packages/`，每个子文件夹代表一个独立的用户脚本。
- 示例：
  - `src/packages/copy-selected-links-as-markdown/`
  - `src/packages/discourse-prevent-jump-on-reply/`
  - `src/packages/utags-quick-nav/`
- 构建脚本：`scripts/userscript/build-all.mjs`
- 类型配置：`tsconfig.json`；代码规范使用 `xo` 与 `prettier`

## 脚本结构约定

- 执行入口为脚本文件夹内的 `index.ts`
- 可以将逻辑拆分到多个文件，并在 `index.ts` 中通过 `import` 引用
- 每个脚本可包含 `banner.txt` 用于生成元信息（`==UserScript==` 头部）
- 脚本之间可复用的代码抽离到 `src/utils/`、`src/common/` 或其他对应目录，避免重复实现
- 尽量模块化，导出可测试的函数或模块，保持单一职责
- 保持 `index.ts` 入口文件逻辑简洁，把实现细节拆分到独立模块
