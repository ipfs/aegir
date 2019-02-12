'use strict'

const execa = require('execa')
const path = require('path')
const { fromAegir, hook } = require('../utils')

const DEFAULT_TIMEOUT = global.DEFAULT_TIMEOUT || 5 * 1000

function testNode (ctx) {
  let exec = 'mocha'

  const env = { NODE_ENV: 'test' }
  const timeout = ctx.timeout || DEFAULT_TIMEOUT

  let args = [
    ctx.progress && '--reporter=progress',
    '--ui', 'bdd',
    '--timeout', timeout
  ].filter(Boolean)

  let files = [
    'test/node.js',
    'test/**/*.spec.js'
  ]

  if (ctx.colors) {
    args.push('--colors')
  } else {
    args.push('--no-colors')
  }

  if (ctx.grep) {
    args.push(`--grep=${ctx.grep}`)
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

  if (ctx.flow) {
    args.push(...['--resolve', fromAegir('src/test/register.js')])
  }

  const postHook = hook('node', 'post')
  const preHook = hook('node', 'pre')

  let err

  return preHook(ctx).then(() => {
    return execa(exec, args.concat(files.map((p) => path.normalize(p))), {
      env: env,
      cwd: process.cwd(),
      preferLocal: true,
      localDir: path.join(__dirname, '../..'),
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    }).catch((_err) => {
      err = _err
    })
  }).then(() => postHook(ctx))
    .then(() => {
      if (err) {
        throw err
      }
    })
}

module.exports = testNode
