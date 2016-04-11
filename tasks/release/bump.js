'use strict'

const $ = require('gulp-load-plugins')()
const semver = require('semver')
const fs = require('fs')
const _ = require('lodash')

function getType () {
  if (_.includes($.util.env._, 'major')) return 'major'
  if (_.includes($.util.env._, 'minor')) return 'minor'

  return 'patch'
}

function getCurrentVersion () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version
}

module.exports = (gulp, done) => {
  const type = getType()
  const newVersion = semver.inc(getCurrentVersion(), type)

  $.util.log('Releasing %s', newVersion)

  return gulp.src('./package.json')
    .pipe($.bump({version: newVersion}))
    .pipe(gulp.dest('./'))
    .pipe($.git.add())
    .pipe($.git.commit(`chore: release version v${newVersion}`, {args: '-n'}))
    .pipe($.filter('package.json'))
    .pipe($.tagVersion())
}
