'use strict'

module.exports = (gulp) => {
  gulp.task('build:browser', ['clean:browser'], (done) => {
    const webpack = require('webpack')
    const uglify = require('gulp-uglify')
    const util = require('gulp-util')
    const size = require('gulp-size')
    const rename = require('gulp-rename')

    const config = require('../../config/webpack')

    const c = config
    c.output.filename = 'index.js'
    c.devtool = 'source-map'
    c.plugins.push(
      new webpack.optimize.DedupePlugin()
    )

    webpack(c, webpackDone(() => {
      gulp.src('dist/index.js')
        .pipe(uglify({
          mangle: false
        }))
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(size())
        .pipe(gulp.dest('dist'))
        .once('end', done)
    }))

    function webpackDone (done) {
      return (err, stats) => {
        if (err) {
          throw new util.PluginError('webpack', err)
        }

        if (util.env.stats) {
          require('fs').writeFileSync(
            'stats.json',
            JSON.stringify(stats.toJson(), null, 2)
          )
        }

        util.log('[webpack]', stats.toString({
          modules: false,
          colors: true,
          chunks: false
        }))

        done()
      }
    }
  })
}
