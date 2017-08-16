/* eslint-env mocha */
'use strict'

const loadFixture = require('../fixtures')
const expect = require('chai').expect

describe('browser', () => {
  it('fixtures', () => {
    const myFixture = loadFixture(__dirname, 'fixtures/test.txt')
    expect(myFixture.toString()).to.be.eql('Hello Fixture\n')
  })
})
