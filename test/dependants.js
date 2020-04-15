/* eslint-env mocha */
'use strict'

const { expect } = require('../utils/chai')
const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const bin = require.resolve('../')
const os = require('os')

const dirs = {}

const git = {
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
  add: async (name) => {
    await execa('git', ['add', '-A'], {
      cwd: dirs[name]
    })
  },
  commit: async (name, message) => {
    await execa('git', ['commit', '-m', message, '--no-gpg-sign'], {
      cwd: dirs[name]
    })
  }
}

describe('dependants', function () {
  this.timeout(120000)

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
  })
})
