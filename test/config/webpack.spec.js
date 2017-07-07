/* eslint-env jest */
'use strict'

const sinon = require('sinon')
const path = require('path')

describe('config - webpack', () => {
  let config
  beforeEach(() => {
    sinon.stub(process, 'cwd').returns(path.join(__dirname, 'fixtures'))
    config = require('../../src/config/webpack')
  })

  afterEach(() => {
    process.cwd.restore()
  })

  it('default', () => {
    expect(config).toHaveProperty('output.filename', 'index.js')
    expect(config).toHaveProperty('output.library', 'Example')

    expect(config).toMatchSnapshot()
  })

  it('merge with user config', () => {
    expect(config).toHaveProperty('devtool', 'eval')
  })
})
