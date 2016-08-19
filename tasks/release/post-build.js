'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp, done) => {
  runSequence.use(gulp)(
    'release:contributors',
    'release:bump',
    'release:changelog',
    'release:commit',
    'release:push',
    'release:github',
    'release:publish',
    done
  )
}
