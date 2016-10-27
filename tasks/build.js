'use strict'

module.exports = (gulp) => {
  require('./build/node')(gulp)
  require('./build/browser')(gulp)
  require('./clean')(gulp)

  gulp.task('build', ['build:browser'])
}
