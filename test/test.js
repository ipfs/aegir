/* eslint-env mocha */

import { execa } from 'execa'
import fs, { copy } from 'fs-extra'
import path, { join } from 'path'
import tempy from 'tempy'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} project
 */
async function setUpProject (project) {
  const projectDir = tempy.directory()

  await copy(join(__dirname, 'fixtures', 'projects', project), projectDir)
  const nodeModulesPath = path.resolve(__dirname, '../node_modules')

  // simulate having installed aegir
  for (const entry of await fs.readdir(nodeModulesPath)) {
    if (entry === '.' || entry === '..') {
      continue
    }

    // symlink dep
    await fs.createSymlink(path.join(nodeModulesPath, entry), path.join(projectDir, 'node_modules', entry), 'dir')
  }

  // symlink aegir
  await fs.createSymlink(path.resolve(__dirname, '..'), path.join(projectDir, 'node_modules/aegir'), 'dir')

  return projectDir
}

describe('test', () => {
  describe('esm', function () {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('an-esm-project')
    })

    it('should test an esm project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa('npm', ['test'], {
        cwd: projectDir
      })
    })
  })

  describe('ts', function () {
    let projectDir = ''

    before(async () => {
      projectDir = await setUpProject('a-ts-project')
    })

    it('should test a ts project', async function () {
      this.timeout(120 * 1000) // slow ci is slow

      await execa('npm', ['test'], {
        cwd: projectDir
      })
    })
  })
})
