'use strict'

const $ = require('gulp-load-plugins')()

module.exports = (gulp, done) => {
  if ($.util.env.changelog === false) {
    $.util.log('Skipping changelog generation')
    return done()
  }

  const releaseCount = $.util.env.first ? 0 : 1

  return gulp.src('CHANGELOG.md')
    .pipe($.conventionalChangelog({
      preset: 'angular',
      releaseCount
    }))
    .pipe(gulp.dest('./'))
}
