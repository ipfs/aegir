'use strict'

const $ = require('gulp-load-plugins')()

const config = require('../../config/babel')

module.exports = {
  dep: ['clean:node'],
  fn (gulp, done) {
    return gulp.src('src/**/*.js')
      .pipe($.babel(config))
      .pipe($.size())
      .pipe(gulp.dest('lib'))
  }
}
