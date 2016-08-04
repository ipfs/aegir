'use strict'

const $ = require('gulp-load-plugins')()
const semver = require('semver')
const _ = require('lodash')

const getVersion = require('../../src/utils').getVersion

function getType () {
  if (_.includes($.util.env._, 'major')) return 'major'
  if (_.includes($.util.env._, 'minor')) return 'minor'
  if ($.util.env.type) return $.util.env.type

  return 'patch'
}

module.exports = (gulp, done) => {
  const type = getType()
  const newVersion = semver.inc(getVersion(), type)

  $.util.log('Releasing %s', newVersion)

  return gulp.src('./package.json')
    .pipe($.bump({version: newVersion}))
    .pipe(gulp.dest('./'))
}
