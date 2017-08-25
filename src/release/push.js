'use strict'

const git = require('simple-git')(process.cwd())
const pify = require('pify')

function push () {
  const remote = 'origin'
  return pify(git.push.bind(git))(
    remote,
    'master',
    {
      '--tags': true
    }
  )
}

module.exports = push
