/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const mock = require('mock-require')

describe('config - user', () => {
  let config

  before(() => {
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
          entry: 'src/main.js',
          hooks: {
            pre () {
              return Promise.resolve('pre')
            },
            post () {
              return Promise.resolve('post')
            }
          }
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
      fromRoot () {
        return './src/index.js'
      }
    })

    config = mock.reRequire('../../src/config/user')()
  })

  after(() => {
    mock.stop('../../src/utils.js')
  })

  it('custom config', () => {
    expect(config).to.have.property('webpack').eql({
      devtool: 'eval'
    })
    expect(config).to.have.property('entry', 'src/main.js')

    expect(config.hooks).to.have.nested.property('browser.pre')
    expect(config.hooks).to.have.nested.property('browser.post')
    expect(config.hooks).to.have.nested.property('node.pre')
    expect(config.hooks).to.have.nested.property('node.post')

    return config.hooks.browser.pre().then((res) => {
      expect(res).to.eql('pre')
    })
  })
})

describe('config - user with async hooks', () => {
  let config

  before(() => {
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
          entry: 'src/main.js',
          hooks: {
            async pre () {
              await Promise.resolve()

              return 'pre done async'
            },
            async post () {
              await Promise.resolve()

              return 'post done async'
            }
          }
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
      fromRoot () {
        return './src/index.js'
      }
    })

    config = mock.reRequire('../../src/config/user')()
  })

  after(() => {
    mock.stop('../../src/utils.js')
  })

  it('supports async hooks', async () => {
    expect(await config.hooks.browser.pre()).to.eql('pre done async')
    expect(await config.hooks.browser.post()).to.eql('post done async')
  })
})
