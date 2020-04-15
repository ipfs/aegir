/* eslint-env mocha */
'use strict'

const test = require('../src/test')
const { expect } = require('../utils/chai')
const path = require('path')

describe('test', () => {
  it('unhandled promise rejections should fail tests', async () => {
    await expect(test.run({
      target: 'node',
      files: [
        path.join(__dirname, 'fixtures', 'tests', 'unhandled-promise-rejection.js')
      ],
      noUnhandledPromiseRejections: true
    })).to.eventually.be.rejected()
  })

  it('unhandled promise rejections should not fail tests when overridden', async () => {
    await test.run({
      target: 'node',
      files: [
        path.join(__dirname, 'fixtures', 'tests', 'unhandled-promise-rejection.js')
      ],
      noUnhandledPromiseRejections: false
    })
  })
})
