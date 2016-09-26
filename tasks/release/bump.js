'use strict'

const includes = require('lodash.includes')

module.exports = (gulp) => {
  gulp.task('release:bump', () => {
    const util = require('gulp-util')
    const bump = require('gulp-bump')
    const semver = require('semver')

    const getVersion = require('../../src/utils').getVersion

    const type = getType(util.env)
    const newVersion = semver.inc(getVersion(), type)

    util.log('Releasing %s', newVersion)

    return gulp.src('./package.json')
      .pipe(bump({version: newVersion}))
      .pipe(gulp.dest('./'))
  })
}

function getType (env) {
  if (includes(env._, 'major')) return 'major'
  if (includes(env._, 'minor')) return 'minor'
  if (env.type) return env.type

  return 'patch'
}
