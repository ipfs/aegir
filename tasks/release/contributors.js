'use strict'

module.exports = (gulp) => {
  gulp.task('release:contributors', () => {
    const git = require('gulp-git')
    const contributors = require('../../src/gulp-contributors')

    return gulp.src('./package.json')
      .pipe(contributors())
      .pipe(gulp.dest('./'))
      .pipe(git.add())
      .pipe(git.commit('chore: update contributors', {args: '-n --allow-empty'}))
  })
}
