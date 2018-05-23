'use strict'
const resolveBin = require('resolve-bin')
const execa = require('execa')
const path = require('path')
const {hook} = require('./../utils')
const here = p => path.join(__dirname, p)

module.exports = (argv) => {
  const bin = resolveBin.sync('karma')
  const input = argv._.slice(1)
  const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []
  return hook('browser', 'pre')(argv.userConfig)
    .then(() => {
      return execa(bin, [
        'start',
        ...watch,
        here('./../config/karma-experimental.conf.js'),
        ...input
      ], {
        env: {
          NODE_ENV: argv.env,
          AEGIR_WEBWORKER: argv.webworker
        },
        stdio: 'inherit'
      })
    })
    .then(process => hook('browser', 'post')(argv.userConfig))
}
