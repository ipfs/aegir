'use strict'
const path = require('path')
const execa = require('execa')
const { fromAegir } = require('../utils')
const merge = require('merge-options')

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('./../types').TestOptions} TestOptions
 * @typedef {import('./../types').GlobalOptions} GlobalOptions
 */

/**
 *
 * @param {TestOptions & GlobalOptions} argv
 * @param {ExecaOptions} execaOptions
 */
module.exports = async (argv, execaOptions) => {
  const extra = argv['--'] ? argv['--'] : []
  const forwardOptions = /** @type {string[]} */([
    ...extra,
    argv.timeout && `--timeout=${argv.timeout}`,
    argv.grep && `--grep=${argv.grep}`,
    argv.bail && '--bail'
  ].filter(Boolean))
  const watch = argv.watch ? ['--watch'] : []
  const cov = argv.cov ? ['--cov'] : []
  const files = argv.files.length > 0
    ? argv.files
    : [
        '**/*.spec.{js,ts}',
        'test/browser.{js,ts}'
      ]

  // before hook
  const before = await argv.fileConfig.test.before(argv)
  const beforeEnv = before && before.env ? before.env : {}

  // run pw-test
  await execa('pw-test',
    [
      ...files,
      '--mode', argv.runner === 'browser' ? 'main' : 'worker',
      ...watch,
      ...cov,
      '--config', fromAegir('src/config/pw-test.js'),
      ...forwardOptions
    ],
    merge(
      {
        env: {
          AEGIR_RUNNER: argv.runner,
          NODE_ENV: process.env.NODE_ENV || 'test',
          ...beforeEnv
        },
        preferLocal: true,
        localDir: path.join(__dirname, '../..'),
        stdio: 'inherit'
      },
      execaOptions
    )
  )

  // after hook
  await argv.fileConfig.test.after(argv, before)
}
