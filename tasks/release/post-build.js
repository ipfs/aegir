'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  runSequence.use(gulp)(
    'release:bump',
    'release:contributors',
    'release:push',
    'release:publish',
    done
  )
}
