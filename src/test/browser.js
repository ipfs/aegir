'use strict'
// const resolveBin = require('resolve-bin')
const execao = require('execa-output')
const path = require('path')
const { throwError } = require('rxjs')
const { catchError } = require('rxjs/operators')
const { hook, fromAegir } = require('../utils')

module.exports = (argv) => {
  // const bin = resolveBin.sync('karma')
  const input = argv._.slice(1)
  const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []
  return hook('browser', 'pre')(argv.userConfig)
    .then(() => {
      return execao('karma', [
        'start',
        ...watch,
        fromAegir('src/config/karma.conf.js'),
        '--colors', // add supports-color
        ...input
      ], {
        env: {
          AEGIR_WEBWORKER: argv.webworker,
          NODE_ENV: process.env.NODE_ENV || 'test'
        },
        localDir: path.join(__dirname, '../..')
      })
        .pipe(catchError(err => {
          return throwError(Object.assign(new Error('Oops tests failed!'), {
            cause: err.stdout
          }))
        }))
    })
    .then(process => {
      hook('browser', 'post')(argv.userConfig)
      return process
    })
}
