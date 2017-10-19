/* eslint-env mocha */
'use strict'

const expect = require('chai').expect

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
})
