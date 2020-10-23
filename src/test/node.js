'use strict'

const execa = require('execa')
const path = require('path')
const { hook, fromAegir } = require('../utils')
const merge = require('merge-options')

const DEFAULT_TIMEOUT = global.DEFAULT_TIMEOUT || 5 * 1000

/** @typedef { import("execa").Options} ExecaOptions */

function testNode (ctx, execaOptions) {
  let exec = 'mocha'
  const env = {
    NODE_ENV: 'test',
    AEGIR_RUNNER: 'node',
    AEGIR_TS: ctx.ts
  }
  const timeout = ctx.timeout || DEFAULT_TIMEOUT

  let args = [
    ctx.progress && '--reporter=progress',
    '--ui', 'bdd',
    '--timeout', timeout
  ].filter(Boolean)

  let files = [
    'test/node.{js,ts}',
    'test/**/*.spec.{js,ts}'
  ]

  if (ctx.colors) {
    args.push('--colors')
  } else {
    args.push('--no-colors')
  }

  if (ctx.grep) {
    args.push(`--grep=${ctx.grep}`)
  }

  if (ctx.invert) {
    args.push('--invert')
  }

  if (ctx.files && ctx.files.length > 0) {
    files = ctx.files
  }

  if (ctx.verbose) {
    args.push('--verbose')
  }

  if (ctx.watch) {
    args.push('--watch')
  }

  if (ctx.exit) {
    args.push('--exit')
  }

  if (ctx.bail) {
    args.push('--bail')
  }

  if (ctx.ts) {
    args.push(...['--require', fromAegir('src/config/register.js')])
  }

  const postHook = hook('node', 'post')
  const preHook = hook('node', 'pre')

  if (ctx['100']) {
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

  return preHook(ctx)
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
    .then(() => postHook(ctx))
}

module.exports = testNode
