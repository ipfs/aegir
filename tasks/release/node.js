'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp) => {
  gulp.task('release:pre-build:node', (done) => {
    runSequence.use(gulp)(
      'lint',
      'test:node',
      done
    )
  })

  gulp.task('release:node', (done) => {
    runSequence.use(gulp)(
      'release:pre-build:node',
      'release:post-build',
      done
    )
  })
}
