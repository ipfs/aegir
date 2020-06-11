'use strict'

const git = require('simple-git/promise')(process.cwd())
const execa = require('execa')

async function push (opts) {
  const remote = opts.remote || 'origin'
  const branch = (await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: process.cwd()
  })).stdout
  return git.push(
    remote,
    branch,
    {
      // Linter and tests were already run by previous steps
      '--no-verify': true,
      '--tags': true
    }
  )
}

module.exports = push
