'use strict'

const $ = require('gulp-load-plugins')()
const semver = require('semver')
const fs = require('fs')

function getType () {
  if ($.util.env.major) return 'major'
  if ($.util.env.minor) return 'minor'

  return 'patch'
}

function getCurrentVersion () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version
}

module.exports = (gulp, done) => {
  const type = getType()
  const newVersion = semver.inc(getCurrentVersion(), type)

  return gulp.src('./package.json')
    .pipe($.bump({version: newVersion}))
    .pipe(gulp.dest('./'))
    .pipe($.git.add())
    .pipe($.git.commit(`chore: release version v${newVersion}`, {args: '-n'}))
    .pipe($.filter('package.json'))
    .pipe($.tagVersion())
}
