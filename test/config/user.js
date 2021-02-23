/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const { config } = require('../../src/config/user')
const path = require('path')

describe('config - user', () => {
  it('custom config', async () => {
    const conf = config(path.join(__dirname, 'fixtures/custom-config'))
    expect(conf).to.have.property('debug').eql(false)
    expect(conf).to.have.property('tsRepo').eql(false)
    expect(conf).to.have.nested.property('test.before')
    expect(conf).to.have.nested.property('test.after')

    // @ts-ignore
    const res = await conf.test.before()
    expect(res).to.eql(undefined)
  })
  it('supports async hooks', async () => {
    const conf = config(path.join(__dirname, 'fixtures/custom-user-async-hooks'))
    // @ts-ignore
    expect(await conf.test.before()).to.eql('pre done async')
    // @ts-ignore
    expect(await conf.test.after()).to.eql('post done async')
  })
  it('supports package.json aegir property', async () => {
    const conf = config(path.join(__dirname, 'fixtures/custom-config-package-json'))
    expect(conf.debug).to.ok()
  })
})
