'use strict'

const config = require('../config/jsdoc.js')

module.exports = (gulp) => {
  const jsdoc = require('gulp-jsdoc3')
  require('./clean')(gulp)

  gulp.task('docs', ['clean:docs'], (cb) => {
    gulp.src([
      'README.md', './src/**/*.js'
    ], {read: false})
      .pipe(jsdoc(config, cb))
  })
}
