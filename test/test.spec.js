/* eslint-env jest */
'use strict'

describe('test', () => {
  describe('node', () => {
    beforeAll(function (done) {
      this.timeout(6 * 1000)
      setTimeout(done, 5500)
    })

    it('patches this.timeout', function (done) {
      expect(global.jasmine.DEFAULT_TIMEOUT_INTERVAL).toEqual(5000)
      this.timeout(6 * 1000)
      setTimeout(done, 5500)
    })

    it('restores timeout', () => {
      expect(global.jasmine.DEFAULT_TIMEOUT_INTERVAL).toEqual(5000)
    })

    it('adds aliases for before and after', () => {
      expect(global.before).toEqual(beforeAll)
      expect(global.after).toEqual(afterAll)
    })
  })
})
