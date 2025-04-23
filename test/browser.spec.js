/* eslint-env mocha */

import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { expect } from '../utils/chai.js'
import loadFixture from '../utils/fixtures.js'

describe('browser', () => {
  it('fixtures', () => {
    const myFixture = loadFixture('test/fixtures/test.txt')
    expect(uint8ArrayToString(myFixture)).to.be.eql('Hello Fixture\n')
  })

  it('should load tar.gz fixures', () => {
    const myFixture = loadFixture('test/fixtures/file.tar.gz')
    // spell-checker: disable-next-line
    expect(uint8ArrayToString(myFixture, 'base64')).to.equal('H4sICIlTHVIACw')
  })

  it('non existing fixtures', () => {
    // spell-checker: disable-next-line
    expect(() => loadFixture('/test/fixtures/asdalkdjaskldjatest.txt'))
      .to.throw()
  })

  it('can access context object', async () => {
    const context = await import('./fixtures/tests/context-access.js')

    expect(context.default).to.equal(globalThis.Uint8Array)
  })
})
