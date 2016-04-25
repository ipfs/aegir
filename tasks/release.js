'use strict'

const $ = require('gulp-load-plugins')()
const runSequence = require('run-sequence')
const _ = require('lodash')

function getEnv () {
  if (_.includes($.util.env._, 'browser')) return 'browser'
  if (_.includes($.util.env._, 'node')) return 'node'
  if (_.includes($.util.env._, 'no-build')) return 'no-build'
  if ($.util.env.env) return $.util.env.env

  return 'default'
}

module.exports = (gulp, done) => {
  runSequence.use(gulp)(
    `release:${getEnv()}`,
    done
  )
}
