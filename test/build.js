/* eslint-env mocha */
'use strict'

const { expect } = require('../utils/chai')
const execa = require('execa')
const { copy, existsSync } = require('fs-extra')
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

      expect(existsSync(join(projectDir, 'dist', 'index.min.js'))).to.be.true()
    })
  })
})
