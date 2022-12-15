/* eslint-env mocha */

import loadFixture from '../utils/fixtures.js'
import { expect } from '../utils/chai.js'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

describe('browser', () => {
  it('fixtures', () => {
    const myFixture = loadFixture('test/fixtures/test.txt')
    expect(uint8ArrayToString(myFixture)).to.be.eql('Hello Fixture\n')
  })

  it('non existing fixtures', () => {
    expect(() => loadFixture('/test/fixtures/asdalkdjaskldjatest.txt'))
      .to.throw()
  })

  it('can access context object', async () => {
    const context = await import('./fixtures/tests/context-access.js')

    expect(context.default).to.equal(globalThis.Uint8Array)
  })
})