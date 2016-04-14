'use strict'

const $ = require('gulp-load-plugins')()
const runSequence = require('run-sequence')

const config = require('../../config/babel')

module.exports = {
  dep: ['clean:node'],
  fn (gulp, done) {
    gulp.task('copy::node', () => {
      return gulp.src('src/**/*')
        .pipe($.size())
        .pipe(gulp.dest('lib'))
    })

    gulp.task('build::node', () => {
      return gulp.src('src/**/*.js')
        .pipe($.babel(config))
        .pipe($.size())
        .pipe(gulp.dest('lib'))
    })

    runSequence.use(gulp)(
      'copy::node',
      'build::node',
      done
    )
  }
}
