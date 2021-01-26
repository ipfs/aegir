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
  const files = argv.files ? ['--files-custom', ...argv.files] : []
  const verbose = argv.verbose ? ['--log-level', 'debug'] : ['--log-level', 'error']
  const grep = argv.grep ? ['--grep', argv.grep] : []
  const invert = argv.invert ? ['--invert'] : []
  const progress = argv.progress ? ['--progress', argv.progress] : []
  const bail = argv.bail ? ['--bail', argv.bail] : []
  const timeout = argv.timeout ? ['--timeout', argv.timeout] : []

  return hook('browser', 'pre')(argv.userConfig)
    .then((hook = {}) => {
      return execa('karma',
        [
          'start',
          fromAegir('src/config/karma.conf.js'),
          ...watch,
          ...files,
          ...verbose,
          ...grep,
          ...invert,
          ...progress,
          ...input,
          ...bail,
          ...timeout,
          ...forwardOptions
        ],
        merge(
          {
            env: {
              NODE_ENV: process.env.NODE_ENV || 'test',
              AEGIR_RUNNER: argv.webworker ? 'webworker' : 'browser',
              AEGIR_NODE: argv.node,
              AEGIR_TS: argv.tsRepo,
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
