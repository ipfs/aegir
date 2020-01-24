/* eslint-env mocha */
'use strict'

describe('should fail', () => {
  it('unhandled promise rejection', (done) => {
    new Promise((resolve, reject) => { // eslint-disable-line no-new
      reject(new Error('Nope!'))
    })

    done()
  })
})
