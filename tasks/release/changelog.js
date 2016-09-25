'use strict'

module.exports = (gulp) => {
  gulp.task('release:changelog', (done) => {
    const util = require('gulp-util')
    const conventionalChangelog = require('gulp-conventional-changelog')

    if (util.env.changelog === false) {
      util.log('Skipping changelog generation')
      return done()
    }

    const releaseCount = util.env.first ? 0 : 1

    return gulp.src('CHANGELOG.md')
      .pipe(conventionalChangelog({
        preset: 'angular',
        releaseCount
      }))
      .pipe(gulp.dest('./'))
  })
}
