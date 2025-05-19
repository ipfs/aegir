/* eslint-env mocha */

describe('should fail', () => {
  it('unhandled promise rejection', (done) => {
    new Promise((resolve, reject) => {
      reject(new Error('Nope!'))
    })

    done()
  })
})
