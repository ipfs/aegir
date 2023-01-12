/* eslint-env mocha */

import fs, { copy } from 'fs-extra'
import path, { join } from 'path'
import * as tempy from 'tempy'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} project
 */
export async function setUpProject (project) {
  const projectDir = tempy.temporaryDirectory()

  await copy(join(__dirname, '..', 'fixtures', 'projects', project), projectDir)
  const nodeModulesPath = path.resolve(__dirname, '../../node_modules')
  const projectNodeModulesPath = path.join(projectDir, 'node_modules')
  const aegirPath = path.resolve(__dirname, '..', '..')

  // simulate having installed aegir
  for (const entry of await fs.readdir(nodeModulesPath)) {
    if (entry === '.' || entry === '..' || entry === '.bin') {
      continue
    }

    // symlink dep
    await fs.createSymlink(path.join(nodeModulesPath, entry), path.join(projectNodeModulesPath, entry), 'dir')
  }

  // link aegir into project
  await fs.mkdir(path.join(projectNodeModulesPath, '.bin'))
  await fs.createSymlink(aegirPath, path.join(projectNodeModulesPath, 'aegir'), 'dir')
  await fs.createSymlink(path.join(aegirPath, 'src', 'index.js'), path.join(projectNodeModulesPath, '.bin', 'aegir'), 'file')

  return projectDir
}
