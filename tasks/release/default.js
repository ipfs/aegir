'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  runSequence.use(gulp)(
    'release:pre-build',
    'build',
    'release:post-build',
    done
  )
}
