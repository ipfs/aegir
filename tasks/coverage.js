'use strict'

const $ = require('gulp-load-plugins')()

const utils = require('../src/utils')
const config = require('../config/webpack')

module.exports = {
  fn (gulp, done) {
    gulp.task('pre-test', function () {
      return gulp.src([
        'src/**/*.js'
      ]).pipe($.istanbul())
        .pipe($.istanbul.hookRequire())
    })

    gulp.task('mocha', ['pre-test'], () => {
      return gulp.src([
        'test/node.js',
        'test/**/*.spec.js'
      ])
        .pipe($.mocha({
          timeout: config.dev.timeout
        }))
        .pipe($.istanbul.writeReports())
    })

    utils.hooksRun(gulp, 'coverage', ['mocha'], utils.exitOnFail(done))
  }
}
