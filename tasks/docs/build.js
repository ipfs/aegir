'use strict'

const pump = require('pump')
const join = require('path').join
const docs = require('gulp-documentation')
const exists = require('path-exists').sync
const fs = require('fs')
const gutil = require('gulp-util')

const pkg = require('../../config/user').pkg
const introTmpl = require('../../config/intro-template.md')

function generateDescription (name) {
  let example
  try {
    example = fs.readFileSync(join(
      process.cwd(), 'example.js'
    )).toString()
  } catch (err) {
    gutil.log('Warning: No `example.js` found in the root directory.')
  }
  return introTmpl(name, pkg.repository.url, example)
}

module.exports = (gulp) => {
  gulp.task('docs:build', ['clean:docs'], (cb) => {
    const options = {
      github: true
    }

    const configFile = join(process.cwd(), 'documentation.yml')
    if (exists(configFile)) {
      options.config = configFile
    } else {
      options.toc = [{
        name: 'Intro',
        description: generateDescription(pkg.name)
      }]
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
