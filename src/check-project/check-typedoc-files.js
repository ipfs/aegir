/* eslint-disable no-console */

import path from 'path'
import fs from 'fs-extra'
import {
  ensureFileHasContents
} from './utils.js'

/**
 * @param {string} projectDir
 * @param {boolean} isTypescriptProject
 */
export async function checkTypedocFiles (projectDir, isTypescriptProject) {
  console.info('Check typedoc files')

  const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

  if (pkg.exports == null) {
    return
  }

  const entryPoints = Object.values(pkg.exports)
    .map(e => {
      const path = e.import

      if (isTypescriptProject) {
        return path
          .replace('dist/src', 'src')
          .replace('.js', '.ts')
      }

      return path
    })

  await ensureFileHasContents(projectDir, 'typedoc.json', JSON.stringify({
    entryPoints
  }, null, 2))
}
