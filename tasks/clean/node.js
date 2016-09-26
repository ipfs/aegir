'use strict'

const rimraf = require('rimraf')

module.exports = (gulp) => {
  gulp.task('clean:node', (done) => {
    rimraf('./lib', done)
  })
}
