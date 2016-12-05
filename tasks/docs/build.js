'use strict'

const pump = require('pump')
const join = require('path').join
const docs = require('gulp-documentation')

const pkg = require('../../config/user').pkg

module.exports = (gulp) => {
  gulp.task('docs:build', ['clean:docs'], (cb) => {
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
