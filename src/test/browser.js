'use strict'
const path = require('path')
const execa = require('execa')
const { hook, fromAegir } = require('../utils')
const merge = require('merge-options')

/** @typedef { import("execa").Options} ExecaOptions */

module.exports = (argv, execaOptions) => {
  const extra = argv['--'] ? argv['--'] : []
  const forwardOptions = [
    ...extra,
    argv.timeout && `--timeout=${argv.timeout}`,
    argv.grep && `--grep=${argv.grep}`,
    argv.bail && '--bail'
  ].filter(Boolean)
  const watch = argv.watch ? ['--watch'] : []
  const files = argv.files.length > 0
    ? [
        ...argv.files
      ]
    : [
        '**/*.spec.{js,ts}',
        'test/browser.{js,ts}'
      ]

  return hook('browser', 'pre')(argv.userConfig)
    .then((hook = {}) => {
      return execa('pw-test',
        [
          ...files,
          '--mode', argv.webworker ? 'worker' : 'main',
          ...watch,
          '--config', fromAegir('src/config/pw-test.js'),
          ...forwardOptions
        ],
        merge(
          {
            env: {
              AEGIR_RUNNER: argv.webworker ? 'worker' : 'main',
              NODE_ENV: process.env.NODE_ENV || 'test',
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
