'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  runSequence.use(gulp)(
    'release:pre-build',
    'build:browser',
    'release:post-build',
    done
  )
}
