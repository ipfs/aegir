'use strict'

const $ = require('gulp-load-plugins')()

module.exports = (gulp, done) => {
  const releaseCount = $.util.env.first ? 0 : 1

  return gulp.src('CHANGELOG.md')
    .pipe($.conventionalChangelog({
      preset: 'angular',
      releaseCount
    }))
    .pipe(gulp.dest('./'))
}
