'use strict'

module.exports = (gulp) => {
  gulp.task('default', (done) => {
    const runSequence = require('run-sequence')

    runSequence(
      'lint',
      'test',
      done
    )
  })
}
