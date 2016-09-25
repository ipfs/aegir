'use strict'

const size = require('gulp-size')

module.exports = (gulp) => {
  gulp.task('copy::node', () => {
    return gulp.src('src/**/*')
      .pipe(size())
      .pipe(gulp.dest('lib'))
  })

  gulp.task('build::node', () => {
    const babel = require('gulp-babel')
    const config = require('../../config/babel')

    return gulp.src('lib/**/*.js')
      .pipe(babel(config))
      .pipe(size())
      .pipe(gulp.dest('lib'))
  })

  gulp.task('build:node', ['clean:node'], (done) => {
    const runSequence = require('run-sequence')

    runSequence.use(gulp)(
      'copy::node',
      'build::node',
      done
    )
  })
}
