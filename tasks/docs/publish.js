'use strict'

const join = require('path').join
const os = require('os')
const pkg = require('../../config/user').pkg

module.exports = (gulp) => {
  gulp.task('docs:publish', ['docs:build'], () => {
    const ghPages = require('gulp-gh-pages')
    return gulp.src('./docs/**/*', {cwd: process.cwd()})
      .pipe(ghPages({
        cacheDir: join(os.tmpdir(), 'aegir-gh-pages-cache', pkg.name)
      }))
  })
}
