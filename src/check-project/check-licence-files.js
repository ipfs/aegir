
/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import {
  ensureFileHasContents
} from './utils.js'

/**
 * @param {string} projectDir
 */
export async function checkLicenseFiles (projectDir) {
  console.info('Check license files')

  const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), {
    encoding: 'utf-8'
  }))

  if (pkg.license !== 'Apache-2.0 OR MIT') {
    throw new Error(`Incorrect license field - found '${pkg.license}', expected 'Apache-2.0 OR MIT'`)
  }

  console.info(chalk.green('Manifest license field ok'))
  await ensureFileHasContents(projectDir, 'LICENSE')
  await ensureFileHasContents(projectDir, 'LICENSE-APACHE')
  await ensureFileHasContents(projectDir, 'LICENSE-MIT')
}
