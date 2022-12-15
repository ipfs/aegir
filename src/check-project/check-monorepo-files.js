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

  const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

  let defaultLernaContent = fs.readFileSync(path.join(__dirname, 'files/lerna.json'), {
    encoding: 'utf-8'
  })

  // ensure lerna version is in sync
  const lernaConfig = JSON.parse(defaultLernaContent)
  lernaConfig.lerna = pkg.dependencies.lerna.replace(/\^/, '')

  defaultLernaContent = JSON.stringify(lernaConfig, null, 2)

  await ensureFileHasContents(projectDir, 'lerna.json', defaultLernaContent)

  // disable package-lock.json in monorepos until https://github.com/semantic-release/github/pull/487 is merged
  await ensureFileHasContents(projectDir, '.npmrc', fs.readFileSync(path.join(__dirname, 'files/npmrc'), {
    encoding: 'utf-8'
  }))
}
