'use strict'

const execa = require('execa')

function testNode (ctx) {
  const args = [
    '--colors',
    '--config', require.resolve('../config/jest')
  ]

  if (ctx.verbose) {
    args.push('--verbose')
  }

  if (ctx.watch) {
    args.push('--watchAll')
  }

  if (ctx.coverage) {
    args.push('--coverage')
  }

  if (ctx.updateSnapshot) {
    args.push('--updateSnapshot')
  }

  const res = execa('jest', args, {
    cwd: process.cwd()
  })
  res.stdout.pipe(process.stdout)
  res.stderr.pipe(process.stderr)

  // catch and rethrow custom to avoid double printing failed tests
  return res.catch(() => {
    throw new Error('Tests failed')
  })
}

module.exports = testNode
