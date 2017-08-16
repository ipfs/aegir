/* eslint-env jest */
'use strict'

const sinon = require('sinon')
const lint = require('../src/lint')

describe('lint', () => {
  beforeAll(() => {
    sinon.stub(console, 'log')
  })
  afterAll(() => {
    console.log.restore()
  })

  it('passes', () => {
    return lint({fix: false})
  })
})
