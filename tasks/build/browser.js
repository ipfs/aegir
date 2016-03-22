'use strict'

const $ = require('gulp-load-plugins')()
const webpack = require('webpack')
const runSequence = require('run-sequence')
const path = require('path')

const config = require('../../config/webpack')

const webpackDone = (done) => (err, stats) => {
  if (err) {
    throw new $.util.PluginError('webpack', err)
  }

  $.util.log('[webpack]', stats.toString({
    modules: false,
    colors: true,
    chunks: false
  }))

  done()
}

module.exports = {
  dep: ['clean:browser'],
  fn (gulp, done) {
    gulp.task('build:browser:nonminified', (cb) => {
      const c = Object.assign({}, config.dev)
      c.output.filename = 'index.js'
      c.output.path = path.resolve('dist')
      c.devtool = undefined
      c.debug = false

      webpack(c, webpackDone(cb))
    })

    gulp.task('build:browser:minified', (cb) => {
      const c = Object.assign({}, config.prod)
      c.output.filename = 'index.min.js'
      c.output.path = path.resolve('dist')

      webpack(c, webpackDone(cb))
    })

    runSequence.use(gulp)(
      'build:browser:nonminified',
      'build:browser:minified',
      done
    )
  }
}
