import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { environment: 'jsdom' },
  plugins: [
    {
      name: 'vitest-css-import-as-text',
      resolveId(source, importer) {
        if (!source.startsWith('css:')) return null
        const rel = source.slice(4)
        const base = importer
          ? importer.startsWith('file:')
            ? fileURLToPath(importer)
            : importer
          : process.cwd()
        const resolved = rel.startsWith('/')
          ? rel
          : path.resolve(path.dirname(base), rel)
        const url = pathToFileURL(resolved).href
        return 'css:' + url
      },
      load(id) {
        if (!id.startsWith('css:')) return null
        const url = id.slice(4)
        const file = fileURLToPath(url)
        const css = fs.readFileSync(file, 'utf8')
        return `export default ${JSON.stringify(css)}`
      },
    },
  ],
})
