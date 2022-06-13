/* eslint-env mocha */

import { expect } from '../../utils/chai.js'
import { config } from '../../src/config/user.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 *
 * @param {string} searchPath
 * @returns string
 */
const getConfigSearchPath = (searchPath) => join(__dirname, ...searchPath.split('/'))

describe('config - user', () => {
  it('custom config', async () => {
    const conf = await config(getConfigSearchPath('fixtures/custom-config'))
    expect(conf).to.have.property('debug').eql(false)
    expect(conf).to.have.nested.property('test.before')
    expect(conf).to.have.nested.property('test.after')

    // @ts-ignore
    const res = await conf.test.before()
    expect(res).to.eql(undefined)
  })

  it('custom config without extension', async () => {
    const conf = await config(getConfigSearchPath('fixtures/custom-config'))
    expect(conf).to.have.property('debug').eql(false)
    expect(conf).to.have.nested.property('test.before')
    expect(conf).to.have.nested.property('test.after')

    // @ts-ignore
    const res = await conf.test.before()
    expect(res).to.eql(undefined)
  })

  it('custom ts config', async () => {
    const conf = await config(getConfigSearchPath('fixtures/custom-ts-config'))
    expect(conf).to.have.property('debug').eql(true)
    expect(conf).to.have.nested.property('test.before')
    expect(conf).to.have.nested.property('test.after')

    // @ts-ignore
    const res = await conf.test.before()
    expect(res).not.to.be.undefined()
    expect(res && res.env?.res).to.eql('1234')
  })

  it('custom ts config without extension', async () => {
    const conf = await config(getConfigSearchPath('fixtures/custom-ts-no-ext-config'))
    expect(conf).to.have.property('debug').eql(true)
    expect(conf).to.have.nested.property('test.before')
    expect(conf).to.have.nested.property('test.after')

    // @ts-ignore
    const res = await conf.test.before()
    expect(res).not.to.be.undefined()
    expect(res && res.env?.res).to.eql('1234')
  })

  it('supports async hooks', async () => {
    const conf = await config(getConfigSearchPath('fixtures/custom-user-async-hooks'))
    // @ts-ignore
    expect(await conf.test.before()).to.eql('pre done async')
    // @ts-ignore
    expect(await conf.test.after()).to.eql('post done async')
  })

  it('supports package.json aegir property', async () => {
    const conf = await config(getConfigSearchPath('fixtures/custom-config-package-json'))
    expect(conf.debug).to.ok()
  })

  // Error cases
  it('throws an error when config has no exports', async () => {
    await expect(config(getConfigSearchPath('fixtures/config-without-export'))).to.be.rejectedWith(/^Nothing is exported in your config file/)
  })

  it('throws an error when config has invalid exports', async () => {
    await expect(config(getConfigSearchPath('fixtures/config-with-invalid-export'))).to.be.rejectedWith(/^Incorrectly exported configuration/)
  })
})
