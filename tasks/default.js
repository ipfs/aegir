'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  runSequence(
    'lint',
    'test',
    done
  )
}
