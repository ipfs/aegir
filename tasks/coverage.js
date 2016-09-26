'use strict'

const spawnMocha = require('gulp-spawn-mocha')

const utils = require('../src/utils')
const timeout = require('../config/custom').timeout

module.exports = (gulp) => {
  gulp.task('istanbul', () => {
    return gulp.src([
      'test/node.js',
      'test/**/*.spec.js'
    ], {read: false})
      .pipe(spawnMocha({
        istanbul: true,
        timeout: timeout
      }))
  })

  gulp.task('coverage', (done) => {
    utils.hooksRun(gulp, 'test:node', ['istanbul'], utils.exitOnFail(done))
  })
}
