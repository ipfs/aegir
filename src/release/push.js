'use strict'

const git = require('simple-git/promise')(process.cwd())
const execa = require('execa')

/**
 * @param {{ remote: string; }} opts
 */
async function push (opts) {
  const branch = (await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: process.cwd()
  })).stdout
  return git.push(
    opts.remote,
    branch,
    {
      // Linter and tests were already run by previous steps
      '--no-verify': null,
      '--tags': null
    }
  )
}

module.exports = push
