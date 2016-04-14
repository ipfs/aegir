'use strict'

const $ = require('gulp-load-plugins')()

const config = require('../config/webpack')

module.exports = {
  fn (gulp, done) {
    return gulp.src([
      'test/node.js',
      'test/**/*.spec.js'
    ], {read: false})
      .pipe($.spawnMocha({
        istanbul: true,
        timeout: config.dev.timeout
      }))
  }
}
