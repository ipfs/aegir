/* eslint-env jest */
'use strict'

const sinon = require('sinon')
const path = require('path')

describe('config - user', () => {
  let config
  beforeEach(() => {
    sinon.stub(process, 'cwd').returns(path.join(__dirname, 'fixtures'))
    config = require('../../src/config/user')
  })

  afterEach(() => {
    process.cwd.restore()
  })

  it('loads from package.json', () => {
    expect(config).toHaveProperty('customPkg', {custom: true})

    expect(config).toMatchSnapshot()
  })

  it('loads from .aegir.js', () => {
    expect(config).toHaveProperty('customConfig', {
      entry: 'src/main.js',
      webpack: {
        devtool: 'eval'
      }
    })
  })

  it('custom entry', () => {
    expect(config).toHaveProperty('entry', 'src/main.js')
  })
})
