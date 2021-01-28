/* eslint-env mocha */
'use strict'

const { expect } = require('../utils/chai')

const utils = require('../src/utils')

describe('utils', () => {
  it('hook', () => {
    const res = utils.hook('node', 'pre')({
      hooks: {
        node: {
          pre () {
            return Promise.resolve(10)
          }
        }
      }
    })

    return Promise.all([
      res,
      utils.hook('node', 'pre')({ hooks: {} }),
      utils.hook('node', 'pre')({ hooks: { browser: { pre: {} } } })
    ]).then((results) => {
      expect(results).to.eql([
        10,
        undefined,
        undefined
      ])
    })
  })
})
