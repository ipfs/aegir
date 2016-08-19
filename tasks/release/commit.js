'use strict'

const $ = require('gulp-load-plugins')()

const getVersion = require('../../src/utils').getVersion

module.exports = (gulp, done) => {
  const newVersion = getVersion()

  return gulp.src(['package.json', 'CHANGELOG.md'])
    .pipe($.git.add())
    .pipe($.git.commit(`chore: release version v${newVersion}`, {args: '-n'}))
    .pipe($.filter('package.json'))
    .pipe($.tagVersion())
}
