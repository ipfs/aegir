'use strict'
const path = require('path')
const execa = require('execa')
const { hook, getElectron } = require('../utils')

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import('./../types').TestOptions} TestOptions
 * @typedef {import('./../types').GlobalOptions} GlobalOptions
 */
/**
 *
 * @param {TestOptions & GlobalOptions} argv
 */
module.exports = async (argv) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const watch = argv.watch ? ['--watch'] : []
  const files = argv.files.length > 0 ? [...argv.files] : ['test/**/*.spec.{js,ts}']
  const grep = argv.grep ? ['--grep', argv.grep] : []
  const progress = argv.progress ? ['--reporter=progress'] : []
  const bail = argv.bail ? ['--bail'] : []
  const timeout = argv.timeout ? [`--timeout=${argv.timeout}`] : []
  const renderer = argv.runner === 'electron-renderer' ? ['--renderer'] : []
  const ts = argv.tsRepo ? ['--require', require.resolve('esbuild-register')] : []

  // pre hook
  const pre = await hook('browser', 'pre')(argv.config.hooks)
  const preEnv = pre && pre.env ? pre.env : {}
  const electronPath = await getElectron()

  await execa('electron-mocha', [
    ...files,
    ...watch,
    ...grep,
    ...progress,
    ...bail,
    ...timeout,
    ...ts,
    '--colors',
    '--full-trace',
    ...renderer,
    ...forwardOptions
  ], {
    localDir: path.join(__dirname, '../..'),
    preferLocal: true,
    stdio: 'inherit',
    env: {
      AEGIR_RUNNER: argv.runner,
      NODE_ENV: process.env.NODE_ENV || 'test',
      ELECTRON_PATH: electronPath,
      ...preEnv
    }
  })
  // post hook
  await hook('browser', 'pre')(argv.config.hooks)
}
