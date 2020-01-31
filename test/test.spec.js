/* eslint-env mocha */
'use strict'

const test = require('../src/test')
const expect = require('./fixtures/chai').expect
const path = require('path')

describe('test', () => {
  describe('node', () => {
    before(function (done) {
      this.timeout(6 * 1000)
      setTimeout(done, 5500)
    })
  })

  describe('environemnt', () => {
    expect(
      Buffer.from('hello') instanceof Uint8Array
    ).to.eql(true)
  })

  // Use the following logic for flaky tests!
  // Basically, the idea is that we want to retry tests until they succeed or
  // reach X number of tries. Important to keep in mind that we should not
  // have any globals in these tests and test should be able to be run in total
  // isolation (via .only for example)
  describe('retrying logic', () => {
    let count = 0
    it('retries failing tests', function () {
      this.retries(4)
      count = count + 1
      if (count === 2) {
        expect(true).to.eql(true)
      } else {
        expect(false).to.eql(true)
      }
    })
  })

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
