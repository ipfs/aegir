'use strict'

const pump = require('pump')
const join = require('path').join

const config = require('../config/jsdoc')
const pkg = require('../config/user').pkg

module.exports = (gulp) => {
  const docs = require('gulp-documentation')
  require('./clean')(gulp)

  gulp.task('docs', ['clean:docs'], (cb) => {
    pump(
      gulp.src([
        './src/**/*.js'
      ]),
      docs('html', {
        config: join(process.cwd(), 'documentation.yml'),
        github: true
      }, {
        theme: require.resolve('clean-documentation-theme'),
        version: pkg.version,
        name: pkg.name
      }),
      gulp.dest('./docs'),
      cb
    )
  })
}
