/* eslint-env mocha */
'use strict'

const loadFixture = require('../fixtures')
const expect = require('chai').expect

describe('browser', () => {
  it('fixtures', () => {
    const myFixture = loadFixture(__dirname, 'test/fixtures/test.txt')
    expect(myFixture.toString()).to.be.eql('Hello Fixture\n')
  })

  it('process.env', () => {
    expect(process.env.NODE_ENV).to.eql('test')
    expect(process.env.AEGIR_TEST).to.eql('hello')
  })
})
