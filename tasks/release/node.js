'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  gulp.task('release:pre-build:node', (done1) => {
    runSequence.use(gulp)(
      'lint',
      'test:node',
      done1
    )
  })

  runSequence.use(gulp)(
    'release:pre-build:node',
    'build:node',
    'release:post-build',
    done
  )
}
