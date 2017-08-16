'use strict'

const runSequence = require('run-sequence')

module.exports = (gulp) => {
  const util = require('gulp-util')

  gulp.task('release:docs', (cb) => {
    if (util.env.publish) {
      runSequence.use(gulp)('docs:publish', cb)
      return
    }

    cb()
  })
}
