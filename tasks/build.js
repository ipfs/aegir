'use strict'

module.exports = (gulp) => {
  require('./build/node')(gulp)
  require('./build/browser')(gulp)

  gulp.task('build', ['build:browser', 'build:node'])
}
