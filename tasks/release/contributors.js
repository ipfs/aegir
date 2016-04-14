'use strict'

const $ = require('gulp-load-plugins')()
const contributors = require('../../src/gulp-contributors')

module.exports = (gulp, done) => {
  return gulp.src('./package.json')
    .pipe(contributors())
    .pipe(gulp.dest('./'))
    .pipe($.git.add())
    .pipe($.git.commit('chore: update contributors', {args: '-n --allow-empty'}))
}
