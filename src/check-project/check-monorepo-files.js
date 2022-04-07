/* eslint-disable no-console */

import fs from 'fs'
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

  const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
    encoding: 'utf-8'
  }))

  let defaultLernaContent = fs.readFileSync(path.join(__dirname, 'files/lerna.json'), {
    encoding: 'utf-8'
  })
  defaultLernaContent = defaultLernaContent.replace(/\$lerna-version/g, pkg.dependencies.lerna.replace(/\^/, ''))

  // ensure npm workspaces/lerna packages are in sync
  const lernaConfig = JSON.parse(defaultLernaContent)
  lernaConfig.packages = pkg.workspaces

  defaultLernaContent = JSON.stringify(lernaConfig, null, 2)

  await ensureFileHasContents(projectDir, 'lerna.json', defaultLernaContent)
}
