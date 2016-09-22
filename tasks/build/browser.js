'use strict'

const $ = require('gulp-load-plugins')()
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const config = require('../../config/webpack')

const webpackDone = (done) => (err, stats) => {
  if (err) {
    throw new $.util.PluginError('webpack', err)
  }

  if ($.util.env.stats) {
    fs.writeFileSync('stats.json', JSON.stringify(stats.toJson(), null, 2))
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
    const c = config
    c.output.filename = 'index.js'
    c.output.path = path.resolve('dist')
    c.devtool = 'source-map'
    c.plugins.push(
      new webpack.optimize.DedupePlugin()
    )

    webpack(c, webpackDone(() => {
      gulp.src('dist/index.js')
        .pipe($.uglify({
          mangle: false
        }))
        .pipe($.rename({
          suffix: '.min'
        }))
        .pipe($.size())
        .pipe(gulp.dest('dist'))
        .once('end', done)
    }))
  }
}
