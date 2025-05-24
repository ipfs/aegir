/* eslint-disable no-console */

import path from 'path'
import fs from 'fs-extra'
import {
  pkg
} from '../utils.js'
import {
  ensureFileHasContents
} from './utils.js'

/**
 * @param {string} projectDir
 * @param {boolean} isTypescriptProject
 */
export async function checkTypedocFiles (projectDir, isTypescriptProject) {
  const manifest = fs.readJSONSync(path.join(projectDir, 'package.json'))

  if (manifest.scripts.docs == null && pkg.scripts?.docs == null) {
    console.info('No "docs" npm script found, skipping typedoc.json check')
    return
  }

  if (manifest.exports == null) {
    console.info('No exports map found, skipping typedoc.json check')

    return
  }

  console.info('Check typedoc files')

  const entryPoints = Object.values(manifest.exports)
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
    readme: 'none',
    entryPoints
  }, null, 2))
}
