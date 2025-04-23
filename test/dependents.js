/* eslint-env mocha */

import { createRequire } from 'module'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import fs from 'fs-extra'
import { expect } from '../utils/chai.js'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bin = require.resolve('../src/index.js')

/** @type {any} */
const dirs = {}

const git =
 {
   /**
    * @param {string} name
    */
   init: async (name) => {
     const source = path.join(__dirname, 'fixtures', 'test-dependant', name)
     dirs[name] = path.join(os.tmpdir(), `repo-${Math.random()}`)

     await fs.mkdir(dirs[name])
     await fs.copy(source, dirs[name])

     await execa('git', ['init'], {
       cwd: dirs[name]
     })
     await execa('git', ['config', 'user.email', 'test@test.com'], {
       cwd: dirs[name]
     })
     await execa('git', ['config', 'user.name', 'test'], {
       cwd: dirs[name]
     })
     await git.add(name)
     await git.commit(name, 'initial commit')
   },
   /**
    *
    * @param {string} name
    */
   add: async (name) => {
     await execa('git', ['add', '-A'], {
       cwd: dirs[name]
     })
   },
   /**
    *
    * @param {string} name
    * @param {string} message
    */
   commit: async (name, message) => {
     await execa('git', ['commit', '-m', message, '--no-gpg-sign'], {
       cwd: dirs[name]
     })
   }
 }

describe('dependents', function () {
  this.timeout(900000)

  if (os.platform() === 'win32') {
    // TODO: travis windows builds can't clone git repos from the local
    // filesystem as it errors with "git-upload-pack: command not found"
    return
  }

  afterEach(async () => {
    await Promise.all(
      Object.keys(dirs).map(dir => fs.remove(dirs[dir]))
    )
  })

  describe('regular project', () => {
    beforeEach(async () => {
      await git.init('project')
    })

    it('should test a regular project', async () => {
      const diff = `derp-${Math.random()}`
      const output = await execa(bin, ['test-dependant', dirs.project, '--deps=it-all@1.0.1'], {
        env: {
          DISAMBIGUATOR: diff
        }
      })
      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.0`)
      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.1`)
    })

    it('should fail to test a project that does not depend on the deps we are overriding', async () => {
      const diff = `derp-${Math.random()}`

      await expect(execa(bin, ['test-dependant', dirs.project, '--deps=it-derp@1.0.1'], {
        env: {
          DISAMBIGUATOR: diff
        }
      })).to.eventually.be.rejectedWith(/Module project does not depend on it-derp/)
    })

    it('should run a given script in a regular project', async () => {
      const diff = `derp-${Math.random()}`

      const output = await execa(
        bin,
        ['test-dependant', dirs.project, '--deps=it-all@1.0.1 --script-name=another-test'],
        {
          env: {
            DISAMBIGUATOR: diff
          }
        }
      )
      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.0`)
      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.1`)
    })
  })

  describe('monorepo', () => {
    beforeEach(async () => {
      await git.init('monorepo')
    })

    it('should test a monorepo', async () => {
      const diff = `derp-${Math.random()}`
      const output = await execa(bin, ['test-dependant', dirs.monorepo, '--deps=it-all@1.0.1'], {
        env: {
          DISAMBIGUATOR: diff
        }
      })

      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.0`)
      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.1`)
    })

    it('should run a given script in a monorepo project', async () => {
      const diff = `derp-${Math.random()}`
      const output = await execa(bin, ['test-dependant', dirs.monorepo, '--deps=it-all@1.0.1 --script-name=another-test'], {
        env: {
          DISAMBIGUATOR: diff
        }
      })

      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.0`)
      expect(output.stdout).to.include(`${diff}-dependency-version=1.0.1`)
    })
  })
})
