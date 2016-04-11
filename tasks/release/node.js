'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  runSequence.use(gulp)(
    'release:pre-build',
    'build:node',
    'release:post-build',
    done
  )
}
