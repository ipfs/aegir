'use strict'

module.exports = (gulp) => {
  gulp.task('mocha', () => {
    const spawnMocha = require('gulp-spawn-mocha')

    const timeout = require('../../config/custom').timeout

    return gulp.src([
      'test/node.js',
      'test/**/*.spec.js'
    ], {read: false})
      .pipe(spawnMocha({
        R: 'spec',
        timeout: timeout
      }))
  })

  gulp.task('test:node', (done) => {
    const utils = require('../../src/utils')

    utils.hooksRun(gulp, 'test:node', ['mocha'], utils.exitOnFail(done))
  })
}
