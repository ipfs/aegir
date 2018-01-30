'use strict'

const git = require('simple-git')(process.cwd())
const pify = require('pify')

function push () {
  const remote = 'origin'
  return pify(git.push.bind(git))(
    remote,
    'master',
    {
      // Linter and tests were already run by previous steps
      '--no-verify': true,
      '--tags': true
    }
  )
}

module.exports = push
