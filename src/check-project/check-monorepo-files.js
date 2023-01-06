/* eslint-disable no-console */

import fs from 'fs-extra'
import path from 'path'
import {
  ensureFileHasContents
} from './utils.js'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} projectDir
 */
export async function checkMonorepoFiles (projectDir) {
  console.info('Check monorepo files')

  // disable package-lock.json in monorepos until https://github.com/semantic-release/github/pull/487 is merged
  await ensureFileHasContents(projectDir, '.npmrc', fs.readFileSync(path.join(__dirname, 'files/npmrc'), {
    encoding: 'utf-8'
  }))
}
