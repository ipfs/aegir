'use strict'

const execa = require('execa')
const path = require('path')

function testNode (ctx) {
  const args = [
    '--colors',
    '--config', require.resolve('../config/jest')
  ]

  let files = [
    'test/node.js$',
    'test/.*\\.spec\\.js$'
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

  if (ctx.files && ctx.files.length > 0) {
    files = ctx.files
  }

  const res = execa('jest', args.concat(files), {
    cwd: process.cwd(),
    preferLocal: true,
    localDir: path.join(__dirname, '../..')
  })
  res.stdout.pipe(process.stdout)
  res.stderr.pipe(process.stderr)

  return res.catch((err) => {
    // catch and rethrow custom to avoid double printing failed tests
    if (err.code === 1 && err.stderr) {
      throw new Error('Tests failed')
    } else {
      throw err
    }
  })
}

module.exports = testNode
