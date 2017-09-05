'use strict'

const execa = require('execa')
const path = require('path')

const utils = require('../utils')

const coverageFiles = [
  '**/src/**/*.js',
  '!**/node_modules/**',
  '!**/test/**',
  '!**/dist/**',
  '!**/examples/**'
]

function testNode (ctx) {
  const args = [
    '--colors',
    '--config', require.resolve('../config/jest'),
    '--env', 'aegir',
    '--globals', JSON.stringify({ DEFAULT_TIMEOUT: ctx.timeout })
  ]

  let files = [
    'test/node.js$',
    'test/.*\\.spec\\.js$'
  ]
  if (ctx.files && ctx.files.length > 0) {
    files = ctx.files
  }

  if (!ctx.parallel) {
    args.push('--runInBand')
  }

  if (ctx.verbose) {
    args.push('--verbose')
  }

  if (ctx.watch) {
    args.push('--watchAll')
  }

  if (ctx.coverage) {
    args.push('--coverage')
    coverageFiles.forEach((file) => {
      args.push('--collectCoverageFrom')
      args.push(file)
    })
  }

  if (ctx.ignore) {
    ctx.ignore.forEach((pat) => {
      args.push('--collectCoverageFrom')
      args.push('!' + pat)
    })
  }

  if (ctx.updateSnapshot) {
    args.push('--updateSnapshot')
  }

  const postHook = utils.hook('node', 'post')
  const preHook = utils.hook('node', 'pre')

  return preHook(ctx).then(() => {
    return execa('jest', args.concat(files), {
      cwd: process.cwd(),
      preferLocal: true,
      localDir: path.join(__dirname, '../..'),
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    }).catch((err) => {
      // catch and rethrow custom to avoid double printing failed tests
      if (err.code === 1) {
        throw new Error('Your tests failed')
      } else {
        throw err
      }
    })
  }).then(() => postHook(ctx))
}

module.exports = testNode
