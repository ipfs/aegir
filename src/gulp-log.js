'use strict'

const gutil = require('gulp-util')
const chalk = require('chalk')
const prettyTime = require('pretty-hrtime')

// Format orchestrator errors
function formatError (e) {
  if (!e.err) {
    return e.message
  }

  // PluginError
  if (typeof e.err.showStack === 'boolean') {
    return e.err.toString()
  }

  // Normal error
  if (e.err.stack) {
    return e.err.stack
  }

  // Unknown (string, number, etc.)
  return new Error(String(e.err)).stack
}

// Wire up logging events
// Based on https://github.com/gulpjs/gulp/blob/master/bin/gulp.js#L173
module.exports = (gulp) => {
  let failed = false

  // Total hack due to poor error management in orchestrator
  gulp.on('err', () => {
    failed = true
  })

  gulp.on('task_start', (e) => {
    gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...')
  })

  gulp.on('task_stop', (e) => {
    const time = prettyTime(e.hrDuration)
    gutil.log(
      'Finished', '\'' + chalk.cyan(e.task) + '\'',
      'after', chalk.magenta(time)
    )
  })

  gulp.on('task_err', (e) => {
    const msg = formatError(e)
    const time = prettyTime(e.hrDuration)
    gutil.log(
      '\'' + chalk.cyan(e.task) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    )
    gutil.log(msg)
  })

  gulp.on('task_not_found', (err) => {
    gutil.log(
      chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
    )
    gutil.log('Please check the documentation for proper gulpfile formatting')
    process.exit(1)
  })

  process.once('exit', (code) => {
    if (code === 0 && failed) {
      process.exit(1)
    }
  })
}
