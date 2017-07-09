/* eslint-env jest */
'use strict'

describe('test', () => {
  describe('node', () => {
    it('patches this.timeout', function (done) {
      this.timeout(6 * 1000)
      setTimeout(done, 5500)
    })

    it('adds aliases for before and after', () => {
      expect(global.before).toEqual(beforeAll)
      expect(global.after).toEqual(afterAll)
    })
  })
})
