/* eslint-env mocha */
'use strict'

const sinon = require('sinon')
const lint = require('../src/lint')

describe('lint', () => {
  before(() => {
    sinon.stub(console, 'log')
  })
  after(() => {
    console.log.restore()
  })

  it('passes', function () {
    // slow ci is slow
    this.timeout(4000)
    return lint({
      fix: false
    })
  })
})
