/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const { config } = require('../../src/config/user')
const path = require('path')

describe('config - user', () => {
  it('custom config', () => {
    const conf = config(path.join(__dirname, 'fixtures/custom-config'))
    expect(conf).to.have.property('webpack').eql({
      devtool: 'eval'
    })
    expect(conf).to.have.property('entry', 'src/main.js')

    expect(conf.hooks).to.have.nested.property('browser.pre')
    expect(conf.hooks).to.have.nested.property('browser.post')
    expect(conf.hooks).to.have.nested.property('node.pre')
    expect(conf.hooks).to.have.nested.property('node.post')

    return conf.hooks.browser.pre().then((res) => {
      expect(res).to.eql('pre')
    })
  })
  it('supports async hooks', async () => {
    const conf = config(path.join(__dirname, 'fixtures/custom-user-async-hooks'))
    expect(await conf.hooks.browser.pre()).to.eql('pre done async')
    expect(await conf.hooks.browser.post()).to.eql('post done async')
  })
  it('supports async hooks', async () => {
    const conf = config(path.join(__dirname, 'fixtures/custom-config-package-json'))
    expect(await conf.custom).to.ok()
  })
})
