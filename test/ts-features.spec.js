/* eslint-env mocha */

import { expect } from '../utils/chai.js'

describe('ts features', () => {
  it('should support Promise.withResolvers', async () => {
    const p = Promise.withResolvers()
    p.resolve(true)

    await expect(p.promise).to.eventually.be.true()
  })

  it('should support Array.toSorted', async () => {
    const arr1 = [3, 2, 1]
    const arr2 = arr1.toSorted()

    expect(arr1).to.not.equal(arr2)
    expect(arr2).to.deep.equal([1, 2, 3])
  })
})
