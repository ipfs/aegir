'use strict'

module.exports = (gulp) => {
  gulp.task('release:post-build', (done) => {
    const runSequence = require('run-sequence')

    runSequence.use(gulp)(
      'release:contributors',
      'release:bump',
      'release:changelog',
      'release:commit',
      'release:push',
      'release:docs',
      'release:github',
      'release:publish',
      done
    )
  })
}
