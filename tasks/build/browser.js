'use strict'

module.exports = (gulp) => {
  gulp.task('build:browser', ['clean:browser'], (done) => {
    const webpack = require('webpack')
    const minifier = require('gulp-uglify/minifier')
    const util = require('gulp-util')
    const size = require('gulp-size')
    const rename = require('gulp-rename')
    const uglify = require('uglify-js')
    const pump = require('pump')

    const config = require('../../config/webpack')

    const c = config
    c.devtool = 'source-map'

    webpack(c, webpackDone(() => {
      pump([
        gulp.src('dist/' + c.output.filename),
        minifier({
          mangle: false
        }, uglify),
        rename({
          suffix: '.min'
        }),
        size(),
        gulp.dest('dist')
      ], done)
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
