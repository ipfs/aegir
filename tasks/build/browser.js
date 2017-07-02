'use strict'

module.exports = (gulp) => {
  gulp.task('build:browser', ['clean:browser'], (done) => {
    const webpack = require('webpack')
    const composer = require('gulp-uglify/composer')
    const util = require('gulp-util')
    const size = require('gulp-size')
    const rename = require('gulp-rename')
    const uglify = require('uglify-es')
    const pump = require('pump')

    const minify = composer(uglify, console)
    const config = require('../../config/webpack')

    const c = config
    c.devtool = 'source-map'

    webpack(c, webpackDone(() => {
      pump([
        gulp.src('dist/' + c.output.filename),
        minify({
          mangle: false
        }),
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
