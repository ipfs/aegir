'use strict'

const includes = require('lodash.includes')
const runSequence = require('run-sequence')

module.exports = (gulp) => {
  const util = require('gulp-util')

  gulp.task('release:docs', (cb) => {
    if (includes(util.env._, 'docs')) {
      runSequence.use(gulp)('docs:publish', cb)
      return
    }

    cb()
  })
}
