
/* eslint-disable no-console */

import fs from 'fs-extra'
import path from 'path'
import kleur from 'kleur'
import {
  ensureFileHasContents
} from './utils.js'

/**
 * @param {string} projectDir
 */
export async function checkLicenseFiles (projectDir) {
  console.info('Check license files')

  const pkg = fs.readJSONSync(path.join(projectDir, 'package.json'))

  if (pkg.license !== 'Apache-2.0 OR MIT') {
    throw new Error(`Incorrect license field - found '${pkg.license}', expected 'Apache-2.0 OR MIT'`)
  }

  console.info(kleur.green('Manifest license field ok'))
  await ensureFileHasContents(projectDir, 'LICENSE')
  await ensureFileHasContents(projectDir, 'LICENSE-APACHE')
  await ensureFileHasContents(projectDir, 'LICENSE-MIT')
}
