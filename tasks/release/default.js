'use strict'

module.exports = (gulp) => {
  gulp.task('release:default', (done) => {
    const runSequence = require('run-sequence')

    runSequence.use(gulp)(
      'release:pre-build',
      'build',
      'release:post-build',
      done
    )
  })
}
