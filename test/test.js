/* eslint-env mocha */
'use strict'

const execa = require('execa')
const { copy } = require('fs-extra')
const { join } = require('path')
const bin = require.resolve('../')
const tempy = require('tempy')

describe('test', () => {
  describe('esm', function () {
    let projectDir = ''

    before(async () => {
      projectDir = tempy.directory()

      await copy(join(__dirname, 'fixtures', 'esm', 'an-esm-project'), projectDir)
    })

    it('should test an esm project', async function () {
      this.timeout(60 * 1000) // slow ci is slow

      await execa(bin, ['test'], {
        cwd: projectDir
      })
    })
  })
})
