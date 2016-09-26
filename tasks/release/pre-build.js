'use strict'

module.exports = (gulp) => {
  gulp.task('release:pre-build', (done) => {
    const runSequence = require('run-sequence')

    runSequence.use(gulp)(
      'lint',
      'test',
      done
    )
  })
}
