'use strict'

module.exports = (gulp) => {
  gulp.task('clean:docs', (done) => {
    const rimraf = require('rimraf')

    rimraf('./docs', done)
  })
}
