'use strict'

module.exports = (gulp) => {
  require('./test/node')(gulp)
  require('./test/browser')(gulp)

  gulp.task('test', (done) => {
    const runSequence = require('run-sequence')

    const utils = require('../src/utils')

    runSequence.use(gulp)(
      'test:node',
      'test:browser',
      utils.exitOnFail(done)
    )
  })
}
