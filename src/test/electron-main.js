'use strict'

const execa = require('execa')
const path = require('path')
const fs = require('fs')

const utils = require('../utils')

const findInPath = file => process.env.PATH.split(path.delimiter).map(p => path.join(p, file)).filter(fs.existsSync).shift()

const DEFAULT_TIMEOUT = global.DEFAULT_TIMEOUT || 5 * 1000

const coverageFiles = [
  'src/**/*.js'
]

const coverageFilesExclude = [
  'node_modules/**',
  'test/**',
  'dist/**',
  'examples/**'
]

function testNode (ctx) {
  let exec = 'mocha'

  let args = [
    '--ui', 'bdd',
    '--colors'
  ]

  let files = [
    'test/node.js',
    'test/**/*.spec.js'
  ]

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

  if (ctx.coverage) {
    exec = 'nyc'
    args = [
      '--include',
      coverageFiles,
      '--exclude',
      coverageFilesExclude.join(' '),
      '--reporter=lcov', '--reporter=text',
      'mocha'
    ].concat(args)
  }

  ctx.timeout = ctx.timeout || DEFAULT_TIMEOUT
  args = [
    '--timeout',
    ctx.timeout
  ].concat(args)

  const postHook = utils.hook('node', 'post')
  const preHook = utils.hook('node', 'pre')

  let err

  return preHook(ctx).then(() => {
    const fullPath = findInPath(exec)
    if (!fullPath) throw new Error(exec + 'was not found in PATH!')
    args.unshift(fullPath)
    return execa(require('electron'), args.concat(files.map((p) => path.normalize(p))), {
      env: {
        NODE_ENV: 'test'
      },
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
