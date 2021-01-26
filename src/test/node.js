'use strict'

const execa = require('execa')
const path = require('path')
const { hook, fromAegir } = require('../utils')
const merge = require('merge-options')

const DEFAULT_TIMEOUT = global.DEFAULT_TIMEOUT || 5 * 1000

/** @typedef { import("execa").Options} ExecaOptions */

function testNode (argv, execaOptions) {
  let exec = 'mocha'
  const env = {
    NODE_ENV: 'test',
    AEGIR_RUNNER: 'node',
    AEGIR_TS: argv.tsRepo
  }
  const timeout = argv.timeout || DEFAULT_TIMEOUT

  let args = [
    argv.progress && '--reporter=progress',
    '--ui', 'bdd',
    '--timeout', timeout
  ].filter(Boolean)

  let files = [
    'test/node.{js,ts}',
    'test/**/*.spec.{js,ts}'
  ]

  if (argv.colors) {
    args.push('--colors')
  } else {
    args.push('--no-colors')
  }

  if (argv.grep) {
    args.push(`--grep=${argv.grep}`)
  }

  if (argv.invert) {
    args.push('--invert')
  }

  if (argv.files && argv.files.length > 0) {
    files = argv.files
  }

  if (argv.verbose) {
    args.push('--verbose')
  }

  if (argv.watch) {
    args.push('--watch')
  }

  if (argv.exit) {
    args.push('--exit')
  }

  if (argv.bail) {
    args.push('--bail')
  }

  if (argv.tsRepo) {
    args.push(...['--require', fromAegir('src/config/register.js')])
  }

  const postHook = hook('node', 'post')
  const preHook = hook('node', 'pre')

  if (argv['100']) {
    args = [
      '--check-coverage',
      '--branches=100',
      '--functions=100',
      '--lines=100',
      '--statements=100',
      exec
    ].concat(args)
    exec = 'nyc'
  }

  return preHook(argv)
    .then((hook = {}) => {
      return execa(exec,
        args.concat(files.map((p) => path.normalize(p))),
        merge(
          {
            env: {
              ...env,
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
    .then(() => postHook(argv))
}

module.exports = testNode
