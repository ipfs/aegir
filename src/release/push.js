'use strict'

const git = require('simple-git')(process.cwd())
const pify = require('pify')
const execa = require('execa')

async function push () {
  const remote = 'origin'
  const branch = (await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: process.cwd()
  })).stdout
  return pify(git.push.bind(git))(
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
