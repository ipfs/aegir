'use strict'

const $ = require('gulp-load-plugins')()

const utils = require('../../src/utils')
const config = require('../../config/webpack')

module.exports = {
  fn (gulp, done) {
    gulp.task('mocha', () => {
      return gulp.src([
        'test/node.js',
        'test/**/*.spec.js'
      ], {read: false})
        .pipe($.spawnMocha({
          R: 'spec',
          timeout: config.timeout
        }))
    })

    utils.hooksRun(gulp, 'test:node', ['mocha'], utils.exitOnFail(done))
  }
}
