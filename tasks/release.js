'use strict'

const includes = require('lodash.includes')

function getEnv (env) {
  if (includes(env._, 'browser')) return 'browser'
  if (includes(env._, 'node')) return 'node'
  if (includes(env._, 'no-build')) return 'no-build'
  if (env.env) return env.env

  return 'default'
}

module.exports = (gulp) => {
  require('./release/node')(gulp)
  require('./release/browser')(gulp)
  require('./release/no-build')(gulp)

  require('./release/bump')(gulp)
  require('./release/changelog')(gulp)
  require('./release/commit')(gulp)
  require('./release/contributors')(gulp)
  require('./release/default')(gulp)
  require('./release/github')(gulp)
  require('./release/docs')(gulp)
  require('./release/post-build')(gulp)
  require('./release/pre-build')(gulp)
  require('./release/publish')(gulp)
  require('./release/push')(gulp)

  gulp.task('release', (done) => {
    const util = require('gulp-util')
    const runSequence = require('run-sequence')

    runSequence.use(gulp)(
      `release:${getEnv(util.env)}`,
      done
    )
  })
}
