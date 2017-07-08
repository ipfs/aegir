/* eslint-env jest */
'use strict'

describe('config - user', () => {
  let config
  beforeAll(() => {
    jest.mock('../../src/utils', () => ({
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
      }
    }))
    config = require('../../src/config/user')()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('custom config', () => {
    expect(config).toMatchSnapshot()

    expect(config).toHaveProperty('webpack', {
      devtool: 'eval'
    })
    expect(config).toHaveProperty('entry', 'src/main.js')
  })
})
