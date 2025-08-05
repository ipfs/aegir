/* eslint-env mocha */

describe('should fail', () => {
  it('unhandled promise rejection', (done) => {
    // eslint-disable-next-line no-new
    new Promise((resolve, reject) => {
      reject(new Error('Nope!'))
    })

    done()
  })
})
