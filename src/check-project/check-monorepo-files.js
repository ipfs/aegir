/* eslint-disable no-console */

import path from 'node:path'
import fs from 'fs-extra'
import {
  ensureFileHasContents
} from './utils.js'

/**
 * @param {string} projectDir
 */
export async function checkMonorepoFiles (projectDir) {
  console.info('Check monorepo files')

  const manifest = path.join(projectDir, 'package.json')
  const pkg = fs.readJSONSync(manifest)

  await ensureFileHasContents(projectDir, 'typedoc.json', JSON.stringify({
    $schema: 'https://typedoc.org/schema.json',
    name: pkg.name,
    readme: './README.md',
    headings: {
      readme: false,
      document: false
    }
  }, null, 2))
}
