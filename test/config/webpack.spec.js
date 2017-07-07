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

  it('custom configs', () => {
    expect(config).toHaveProperty('output.filename', 'main.js')
    expect(config).toHaveProperty('output.library', 'Example')
    expect(config).toHaveProperty('devtool', 'eval')

    expect(config).toMatchSnapshot()
  })
})
