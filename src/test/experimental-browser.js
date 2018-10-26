'use strict'
const resolveBin = require('resolve-bin')
const execa = require('execa')
const { hook, fromAegir } = require('./../utils')

module.exports = (argv) => {
  const bin = resolveBin.sync('karma')
  const input = argv._.slice(1)
  const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []
  return hook('browser', 'pre')(argv.userConfig)
    .then(() => {
      return execa(bin, [
        'start',
        ...watch,
        fromAegir('src/config/karma-experimental.conf.js'),
        ...input
      ], {
        env: {
          AEGIR_WEBWORKER: argv.webworker
        },
        stdio: 'inherit'
      })
    })
    .then(process => hook('browser', 'post')(argv.userConfig))
}
