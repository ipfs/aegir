'use strict'

const pump = require('pump')
const join = require('path').join
const docs = require('gulp-documentation')
const exists = require('path-exists')

const pkg = require('../../config/user').pkg

module.exports = (gulp) => {
  gulp.task('docs:build', ['clean:docs'], (cb) => {
    const options = {
      github: true
    }

    const configFile = join(process.cwd(), 'documentation.yml')
    if (exists(configFile)) {
      options.config = configFile
    }

    pump(
      gulp.src([
        './src/**/*.js'
      ]),
      docs('html', options, {
        theme: require.resolve('clean-documentation-theme'),
        version: pkg.version,
        name: pkg.name
      }),
      gulp.dest('./docs'),
      cb
    )
  })
}
