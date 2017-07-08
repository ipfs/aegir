/* eslint-env jest */
'use strict'

const sinon = require('sinon')

const utils = require('../src/utils')

describe('utils', () => {
  it('getBasePath', () => {
    expect(utils.getBasePath()).toEqual(process.cwd())
  })

  it('getPathToPkg', () => {
    sinon.stub(process, 'cwd').returns('hello')

    expect(utils.getPathToPkg()).toEqual('hello/package.json')
    process.cwd.restore()
  })

  it('getPkg', () => {
    return utils.getPkg().then((pkg) => {
      expect(pkg.name).toEqual('aegir')
    })
  })

  it('getPathToDist', () => {
    expect(utils.getPathToDist()).toEqual(expect.stringMatching(/dist$/))
  })

  it('getUserConfigPath', () => {
    expect(utils.getUserConfigPath()).toEqual(expect.stringMatching(/.aegir.js$/))
  })

  it('getUserConfig', () => {
    expect(utils.getUserConfig()).toEqual({})
  })

  it('getLibraryName', () => {
    const cases = [
      ['hello world', 'HelloWorld'],
      ['peer-id', 'PeerId'],
      ['Peer ID', 'PeerId'],
      ['aegir', 'Aegir']
    ]
    cases.forEach((c) => {
      expect(utils.getLibraryName(c[0])).toEqual(c[1])
    })
  })

  it('getPathToNodeModules', () => {
    expect(utils.getPathToNodeModules()).toEqual(expect.stringMatching(/node_modules$/))
  })

  it('getEnv', () => {
    process.env.AEGIR_TEST = 'hello'

    const env = utils.getEnv()
    expect(env.raw).toEqual({
      NODE_ENV: 'test',
      AEGIR_TEST: 'hello'
    })
    expect(env.stringified).toEqual({
      'process.env': {
        NODE_ENV: '"test"',
        AEGIR_TEST: '"hello"'
      }
    })

    process.env.NODE_ENV = ''
    expect(utils.getEnv('production').raw).toHaveProperty('NODE_ENV', 'production')
    process.env.NODE_ENV = 'test'
  })
})
