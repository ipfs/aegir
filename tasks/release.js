'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  runSequence.use(gulp)(
    'lint',
    'test',
    'build',
    'release:bump',
    'release:push',
    'release:publish',
    done
  )
}
