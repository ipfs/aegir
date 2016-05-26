'use strict'

const $ = require('gulp-load-plugins')()

const utils = require('../src/utils')
const config = require('../config/webpack')

module.exports = {
  fn (gulp, done) {
    gulp.task('istanbul', () => {
      return gulp.src([
        'test/node.js',
        'test/**/*.spec.js'
      ], {read: false})
        .pipe($.spawnMocha({
          istanbul: true,
          timeout: config.timeout
        }))
    })

    utils.hooksRun(gulp, 'test:node', ['istanbul'], utils.exitOnFail(done))
  }
}
