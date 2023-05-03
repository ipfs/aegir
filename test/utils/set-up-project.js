/* eslint-env mocha */

import path, { join } from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import fs, { copy } from 'fs-extra'
import * as tempy from 'tempy'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} project
 */
export async function setUpProject (project) {
  const projectDir = tempy.temporaryDirectory()

  // clone an empty repo
  await execa('git', ['clone', 'https://github.com/ipfs-shipyard/empty-repository.git', projectDir])

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

  // add files and make sure we are at the tip of the tree
  await execa('git', ['add', '-A'], {
    cwd: projectDir
  })
  await execa('git', ['commit', '-m', 'feat: initial import'], {
    cwd: projectDir
  })

  return projectDir
}
