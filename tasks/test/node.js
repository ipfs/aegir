'use strict'

const $ = require('gulp-load-plugins')()

const utils = require('../../src/utils')
const config = require('../../config/webpack')

module.exports = {
  fn (gulp, done) {
    gulp.task('mocha', () => {
      return gulp.src([
        'test/setup.js',
        'test/**/*.spec.js'
      ])
        .pipe($.mocha({
          timeout: config.dev.timeout
        }))
    })

    utils.hooksRun(gulp, 'test:node', ['mocha'], utils.exitOnFail(done))
  }
}
