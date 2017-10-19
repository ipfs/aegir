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

  it('passes', () => {
    return lint({fix: false})
  })
})
