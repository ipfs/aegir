'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  gulp.task('release:pre-build:no-build', (done1) => {
    runSequence.use(gulp)(
      'lint',
      done1
    )
  })

  runSequence.use(gulp)(
    'release:pre-build:no-build',
    'release:post-build',
    done
  )
}
