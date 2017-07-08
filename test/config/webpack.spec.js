/* eslint-env jest */
'use strict'

describe('config - webpack', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('custom configs', () => {
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

    const config = require('../../src/config/webpack')

    return config().then((conf) => {
      expect(conf).toHaveProperty('entry', ['src/main.js'])
      expect(conf).toHaveProperty('output.library', 'Example')
      expect(conf).toHaveProperty('devtool', 'eval')

      expect(conf).toMatchSnapshot()
    })
  })
})
