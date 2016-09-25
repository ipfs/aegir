'use strict'

module.exports = (gulp) => {
  gulp.task('release:commit', () => {
    const git = require('gulp-git')
    const filter = require('gulp-filter')
    const tagVersion = require('gulp-tag-version')

    const getVersion = require('../../src/utils').getVersion

    const newVersion = getVersion()

    return gulp.src(['package.json', 'CHANGELOG.md'])
      .pipe(git.add())
      .pipe(git.commit(`chore: release version v${newVersion}`, {args: '-n'}))
      .pipe(filter('package.json'))
      .pipe(tagVersion())
  })
}
