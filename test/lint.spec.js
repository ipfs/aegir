/* eslint-env mocha */
'use strict'

const lint = require('../src/lint')

describe('lint', () => {
  it('passes', function () {
    // slow ci is slow, appveyor is even slower...
    this.timeout(5000)
    return lint({
      fix: false
    })
  })
})
