'use strict'
const path = require('path')
const execa = require('execa')
const { hook, fromAegir } = require('../utils')

module.exports = (argv) => {
  const input = argv._.slice(1)
  const forwardOptions = argv['--'] ? argv['--'] : []
  const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []
  const files = argv.files ? ['--files-custom', ...argv.files] : []
  const verbose = argv.verbose ? ['--log-level', 'debug'] : ['--log-level', 'error']
  const grep = argv.grep ? ['--grep', argv.grep] : []
  const progress = argv.progress ? ['--progress', argv.progress] : []
  const bail = argv.bail ? ['--bail', argv.bail] : []
  const timeout = argv.timeout ? ['--timeout', argv.timeout] : []

  return hook('browser', 'pre')(argv.userConfig)
    .then(() => {
      return execa('karma', [
        'start',
        fromAegir('src/config/karma.conf.js'),
        ...watch,
        ...files,
        ...verbose,
        ...grep,
        ...progress,
        ...input,
        ...bail,
        ...timeout,
        ...forwardOptions
      ], {
        env: {
          NODE_ENV: process.env.NODE_ENV || 'test',
          AEGIR_RUNNER: argv.webworker ? 'webworker' : 'browser'
        },
        localDir: path.join(__dirname, '../..'),
        stdio: 'inherit'
      })
    })
    .then(() => hook('browser', 'post')(argv.userConfig))
}
