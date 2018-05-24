/* eslint-env mocha */
'use strict'

const loadFixture = require('../fixtures')
const expect = require('chai').expect
const path = require('path')

describe('fixtures', () => {
  it('should load fixtures from dependencies', () => {
    const myFixture = loadFixture('package.json', 'mocha')
    expect(JSON.parse(myFixture).name).to.be.eql('mocha')
  })

  it('should load local fixtures', () => {
    const myFixture = loadFixture(path.join('test', 'fixtures', 'test.txt'))
    expect(myFixture.toString('utf8').trim()).to.be.eql('Hello Fixture')
  })
})
