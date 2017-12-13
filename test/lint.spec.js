/* eslint-env mocha */
'use strict'

const lint = require('../src/lint')

describe('lint', () => {
  it('passes', function () {
    // slow ci is slow
    this.timeout(4000)
    return lint({
      fix: false
    })
  })
})
