/* eslint-env jest */
'use strict'

const expect = require('chai').expect
const mock = require('mock-require')

describe('config - webpack', () => {
  afterEach(() => {
    mock.stop('../../src/utils')
    mock.stop('../../src/config/user')
  })

  it('custom configs', () => {
    mock('../../src/utils', {
      getPkg () {
        return Promise.resolve({
          name: 'example'
        })
      },
      getUserConfig () {
        return {
          webpack: {
            devtool: 'eval'
          },
          entry: 'src/main.js'
        }
      },
      getLibraryName () {
        return 'Example'
      },
      getPathToDist () {
        return 'dist'
      },
      getPathToNodeModules () {
        return 'aegir/node_modules'
      },
      getEnv () {
        return {
          stringified: {
            'process.env': {
              NODE_ENV: 'production'
            }
          }
        }
      }
    })

    const config = require('../../src/config/webpack')

    return config().then((conf) => {
      expect(conf).to.have.deep.property('entry', ['src/main.js'])
      expect(conf).to.have.nested.property('output.library', 'Example')
      expect(conf).to.have.property('devtool', 'eval')
    })
  })

  it('uses inline-source-map for test', () => {
    mock('../../src/config/user', function () {
      return {
        webpack: {},
        entry: ''
      }
    })
    const config = mock.reRequire('../../src/config/webpack')
    return config('test').then((webpack) => {
      expect(webpack.devtool).to.equal('inline-source-map')
    })
  })

  it('uses sourcemap for production', () => {
    mock('../../src/config/user', function () {
      return {
        webpack: {},
        entry: ''
      }
    })
    const config = mock.reRequire('../../src/config/webpack')
    return config('production').then((webpack) => {
      expect(webpack.devtool).to.equal('source-map')
    })
  })

  it('uses sourcemap as the default', () => {
    mock('../../src/config/user', function () {
      return {
        webpack: {},
        entry: ''
      }
    })
    const config = mock.reRequire('../../src/config/webpack')
    return config().then((webpack) => {
      expect(webpack.devtool).to.equal('source-map')
    })
  })
})
