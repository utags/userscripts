import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import * as esbuild from 'esbuild'

import { getBuildOptions, logger } from '../common.mjs'

const target = 'userscript'
const tag = process.argv.includes('--staging') ? 'staging' : 'prod'
const packagesDir = 'src/packages'
const config = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const log = logger(target)

const packages = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

if (packages.length === 0) {
  console.error('No packages found in ' + packagesDir)
  process.exit(1)
}

for (const packageName of packages) {
  const entryPath = path.join(packagesDir, packageName, 'index.ts')
  const bannerPath = path.join(packagesDir, packageName, 'banner.txt')

  if (!fs.existsSync(entryPath)) {
    log(`Skip ${packageName}: missing index.ts`)
    continue
  }
  if (!fs.existsSync(bannerPath)) {
    log(`Skip ${packageName}: missing banner.txt`)
    continue
  }

  let banner = fs.readFileSync(bannerPath, 'utf8')
  if (tag !== 'prod') {
    banner = banner.replaceAll(/(@name(:[\w-]+)?\s.+)/gm, `$1 - ${tag}`)
  }

  const buildOptions = {
    ...getBuildOptions(target, tag, `packages/${packageName}/index`),
    banner: { js: banner },
    legalComments: 'none',
    outfile:
      tag !== 'prod'
        ? `${packageName}/${packageName}-${tag}.user.js`
        : `${packageName}/${packageName}.user.js`,
  }
  buildOptions.alias = {
    ...buildOptions.alias,
    'browser-extension-storage': 'browser-extension-storage/userscript',
    'browser-extension-utils': 'browser-extension-utils/userscript',
  }

  log(`Building ${packageName}...`)
  await esbuild.build(buildOptions)

  let text = fs.readFileSync(buildOptions.outfile, 'utf8')

  if (config.bugs && config.bugs.url) {
    text = text.replace('{bugs.url}', config.bugs.url)
  }

  const keys = banner
    .split('\n')
    .map((v) => /{([\w\-.:]+)}/.exec(v))
    .filter(Boolean)
    .map((v) => v[1])

  for (const key of keys) {
    text = text.replace('{' + key + '}', config[key])
  }

  const matched = new Set()
  text.replaceAll(/(GM[_.]\w+)/gm, (match) => {
    matched.add(match)
  })
  const grants = [...matched]
    .map((v) => `// @grant${' '.repeat(16)}${v}`)
    .join('\n')
  text = text.replace('// ==/UserScript==', `${grants}\n// ==/UserScript==`)

  text = text.replace('{', '{\n  "use strict";')
  text = text.replaceAll(/^\s*\/\/ [^=@].*$/gm, '')
  text = text.replaceAll(/\n+/gm, '\n')

  fs.writeFileSync(buildOptions.outfile, text)
  log(`Built ${packageName} -> ${buildOptions.outfile}`)
}

log('All packages built.')
