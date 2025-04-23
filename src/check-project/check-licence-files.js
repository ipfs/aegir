/* eslint-disable no-console */

import path from 'path'
import fs from 'fs-extra'
import kleur from 'kleur'
import {
  ensureFileHasContents,
  ensureFileNotPresent
} from './utils.js'

/**
 * @param {string} projectDir
 */
export async function checkLicenseFiles (projectDir) {
  const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

  if (pkg.private === true) {
    console.info('Private module found, skipping license file check')
    return
  }

  console.info('Check license files')

  if (pkg.license !== 'Apache-2.0 OR MIT') {
    throw new Error(`Incorrect license field - found '${pkg.license}', expected 'Apache-2.0 OR MIT'`)
  }

  console.info(kleur.green('Manifest license field ok'))
  await ensureFileNotPresent(projectDir, 'LICENSE')
  await ensureFileHasContents(projectDir, 'LICENSE-APACHE')
  await ensureFileHasContents(projectDir, 'LICENSE-MIT')
  await ensureFileHasContents(projectDir, 'CODE_OF_CONDUCT.md')
}
