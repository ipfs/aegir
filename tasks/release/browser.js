'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp) => {
  gulp.task('release:pre-build:browser', (done) => {
    runSequence.use(gulp)(
      'lint',
      'test:browser',
      'test:webworker',
      done
    )
  })

  gulp.task('release:browser', (done) => {
    runSequence.use(gulp)(
      'release:pre-build:browser',
      'build:browser',
      'release:post-build',
      done
    )
  })
}
