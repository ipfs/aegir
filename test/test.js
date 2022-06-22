/* eslint-env mocha */

import { execa } from 'execa'
import fs, { copy } from 'fs-extra'
import path, { join } from 'path'
import { temporaryDirectory } from 'tempy'
import { fileURLToPath } from 'url'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string} project
 */
async function setUpProject (project) {
  const projectDir = temporaryDirectory()

  await copy(join(__dirname, 'fixtures', 'projects', project), projectDir)
  const nodeModulesPath = path.resolve(__dirname, '../node_modules')
  const projectNodeModulesPath = path.join(projectDir, 'node_modules')
  const aegirPath = path.resolve(__dirname, '..')

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

describe('test', () => {
  if (os.platform() === 'win32') {
    describe.skip('Skipping tests on windows because symlinking works differently', () => {})

    return
  }

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
