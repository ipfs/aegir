'use strict'

const $ = require('gulp-load-plugins')()
const webpack = require('webpack-stream')
const runSequence = require('run-sequence')

const config = require('../../config/webpack')

module.exports = {
  dep: ['clean:browser'],
  fn (gulp, done) {
    gulp.task('build:browser:nonminified', () => {
      const c = Object.assign({}, config.dev)
      c.output.filename = 'index.js'

      return gulp.src('src/index.js')
        .pipe(webpack(c))
        .pipe($.size())
        .pipe(gulp.dest('dist'))
    })

    gulp.task('build:browser:minified', () => {
      const c = Object.assign({}, config.prod)
      c.output.filename = 'index.min.js'

      return gulp.src('src/index.js')
        .pipe(webpack(c))
        .pipe($.size())
        .pipe(gulp.dest('dist'))
    })

    runSequence.use(gulp)(
      'build:browser:nonminified',
      'build:browser:minified',
      done
    )
  }
}
