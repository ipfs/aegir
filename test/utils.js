/* eslint-env mocha */
'use strict'

const sinon = require('sinon')
const path = require('path')
const expect = require('chai').expect

const utils = require('../src/utils')

describe('utils', () => {
  it('getBasePath', () => {
    expect(utils.getBasePath()).to.eql(process.cwd())
  })

  it('getPathToPkg', () => {
    sinon.stub(process, 'cwd').returns('hello')

    expect(utils.getPathToPkg()).to.eql(path.normalize('hello/package.json'))
    process.cwd.restore()
  })

  it('getPkg', () => {
    return utils.getPkg().then((pkg) => {
      expect(pkg.name).to.eql('aegir')
    })
  })

  it('getPathToDist', () => {
    expect(utils.getPathToDist()).to.match(/dist$/)
  })

  it('getUserConfigPath', () => {
    expect(utils.getUserConfigPath()).to.match(/.aegir.js$/)
  })

  it('getUserConfig', () => {
    sinon.stub(utils, 'getUserConfigPath').returns(path.join(__dirname, 'fixtures/.aegir.js'))
    expect(utils.getUserConfig()).to.eql({ config: 'mine' })
  })

  it('getLibraryName', () => {
    const cases = [
      ['hello world', 'HelloWorld'],
      ['peer-id', 'PeerId'],
      ['Peer ID', 'PeerId'],
      ['aegir', 'Aegir']
    ]
    cases.forEach((c) => {
      expect(utils.getLibraryName(c[0])).to.eql(c[1])
    })
  })

  it('getPathToNodeModules', () => {
    expect(utils.getPathToNodeModules()).to.match(/node_modules$/)
  })

  it('getEnv', () => {
    process.env.AEGIR_TEST = 'hello'

    const env = utils.getEnv()
    expect(env.raw.NODE_ENV).to.eql('test')
    expect(env.raw.AEGIR_TEST).to.eql('hello')
    expect(env.stringified['process.env'].NODE_ENV).to.eql('"test"')
    expect(env.stringified['process.env'].AEGIR_TEST).to.eql('"hello"')

    process.env.NODE_ENV = ''
    expect(utils.getEnv('production').raw).to.have.property('NODE_ENV', 'production')
    process.env.NODE_ENV = 'test'
  })

  it('hook', () => {
    return Promise.all([
      utils.hook({
        hooks: {
          node: {
            pre (cb) {
              cb(null, 10)
            }
          }
        }
      }, ['hooks', 'node', 'pre']),
      utils.hook({ hooks: {} }, ['hooks', 'node', 'pre']),
      utils.hook({ hooks: { browser: { pre: {} } } }, ['hooks', 'node', 'pre'])
    ]).then((results) => {
      expect(results).to.eql([
        10,
        undefined,
        undefined
      ])
    })
  })
})
