import path from 'node:path'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { expect } from '../utils/chai.js'
import loadFixture from '../utils/fixtures.js'

describe('fixtures', () => {
  it('should load fixtures from dependencies', () => {
    const myFixture = loadFixture('package.json', 'mocha')
    expect(JSON.parse(myFixture.toString()).name).to.be.eql('mocha')
  })

  it('should load local fixtures', () => {
    const myFixture = loadFixture(path.join('test', 'fixtures', 'test.txt'))
    expect(uint8ArrayToString(myFixture).trim()).to.be.eql('Hello Fixture')
  })

  it('should load tar.gz fixtures', () => {
    const myFixture = loadFixture(path.join('test', 'fixtures', 'file.tar.gz'))
    // spell-checker: disable-next-line
    expect(uint8ArrayToString(myFixture, 'base64')).to.equal('H4sICIlTHVIACw')
    expect(myFixture).to.equalBytes(uint8ArrayFromString('H4sICIlTHVIACw', 'base64'), 'did not load correct file contents')
  })
})
