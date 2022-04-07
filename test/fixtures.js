/* eslint-env mocha */

import loadFixture from '../utils/fixtures.js'
import { expect } from '../utils/chai.js'
import path from 'path'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

describe('fixtures', () => {
  it('should load fixtures from dependencies', () => {
    const myFixture = loadFixture('package.json', 'mocha')
    expect(JSON.parse(myFixture.toString()).name).to.be.eql('mocha')
  })

  it('should load local fixtures', () => {
    const myFixture = loadFixture(path.join('test', 'fixtures', 'test.txt'))
    expect(uint8ArrayToString(myFixture).trim()).to.be.eql('Hello Fixture')
  })
})
