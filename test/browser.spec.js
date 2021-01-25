/* eslint-env mocha */
'use strict'

const loadFixture = require('../fixtures')
const expect = require('chai').expect

describe('browser', () => {
  it('fixtures', () => {
    const myFixture = loadFixture('test/fixtures/test.txt')
    expect(myFixture.toString()).to.be.eql('Hello Fixture\n')
  })

  it('non existing fixtures', () => {
    expect(() => loadFixture('/test/fixtures/asdalkdjaskldjatest.txt'))
      .to.throw()
  })

  it('can access context object', () => {
    const context = require('./fixtures/tests/context-access')

    expect(context).to.equal(globalThis.Uint8Array)
  })
})
