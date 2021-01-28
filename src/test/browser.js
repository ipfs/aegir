'use strict'
const path = require('path')
const execa = require('execa')
const { hook, fromAegir } = require('../utils')
const merge = require('merge-options')

/** @typedef { import("execa").Options} ExecaOptions */

module.exports = (argv, execaOptions) => {
  const input = argv._.slice(1)
  const forwardOptions = argv['--'] ? argv['--'] : []
  const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []
  const verbose = argv.verbose ? ['--log-level', 'debug'] : ['--log-level', 'error']
  const color = argv.colors ? ['--color'] : []

  return hook('browser', 'pre')(argv.userConfig)
    .then((hook = {}) => {
      return execa('karma',
        [
          'start',
          fromAegir('src/config/karma.conf.js'),
          ...color,
          ...watch,
          ...verbose,
          ...input,
          ...forwardOptions
        ],
        merge(
          {
            env: {
              NODE_ENV: process.env.NODE_ENV || 'test',
              AEGIR_RUNNER: argv.webworker ? 'webworker' : 'browser',
              AEGIR_NODE: argv.node,
              AEGIR_TS: argv.tsRepo,
              AEGIR_MOCHA_TIMEOUT: argv.timeout ? `${argv.timeout}` : '5000',
              AEGIR_MOCHA_GREP: argv.grep,
              AEGIR_MOCHA_BAIL: argv.bail ? 'true' : 'false',
              AEGIR_PROGRESS: argv.progress ? 'true' : 'false',
              AEGIR_FILES: JSON.stringify(argv.files),
              IS_WEBPACK_BUILD: true,
              ...hook.env
            },
            preferLocal: true,
            localDir: path.join(__dirname, '../..'),
            stdio: 'inherit'
          },
          execaOptions
        )
      )
    })
    .then(() => hook('browser', 'post')(argv.userConfig))
}
