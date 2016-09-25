'use strict'

module.exports = (gulp) => {
  gulp.task('clean:browser', (done) => {
    const rimraf = require('rimraf')

    rimraf('./dist', done)
  })
}
