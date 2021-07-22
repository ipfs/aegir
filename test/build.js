/* eslint-env mocha */
'use strict'

const { expect } = require('../utils/chai')
const execa = require('execa')
const { copy, existsSync, readJson } = require('fs-extra')
const { join } = require('path')
const bin = require.resolve('../')
const tempy = require('tempy')

describe('build', () => {
  describe('esm', () => {
    let projectDir = ''

    before(async () => {
      projectDir = tempy.directory()

      await copy(join(__dirname, 'fixtures', 'esm', 'an-esm-project'), projectDir)
    })

    it('should build an esm project', async function () {
      this.timeout(20 * 1000) // slow ci is slow

      await execa(bin, ['build'], {
        cwd: projectDir
      })

      expect(existsSync(join(projectDir, 'dist', 'esm'))).to.be.true()
      expect(existsSync(join(projectDir, 'dist', 'cjs'))).to.be.true()

      const module = require(join(projectDir, 'dist'))

      expect(module).to.have.property('useHerp').that.is.a('function')
      expect(module).to.have.property('useDerp').that.is.a('function')

      const distPkgPath = join(projectDir, 'dist', 'package.json')
      const distPkg = await readJson(distPkgPath)

      expect(distPkg.types.includes('dist')).to.be.false()
    })
  })
})
