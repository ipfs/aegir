/* eslint-env mocha */
'use strict'

const generateTypes = require('../src/generate-types')

describe('generate-types', () => {
  it('generate types for itself (aegir)', function () {
    this.timeout(60 * 1000) // slow ci is slow
    return generateTypes({
      input: ['src/**/*.js'],
      overwrite: true,
      '--': [
        '--allowJs'
      ]
    })
  })
})
