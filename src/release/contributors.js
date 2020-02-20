'use strict'

const git = require('simple-git')(process.cwd())
const pify = require('pify')
const execa = require('execa')
const { getPathToPkg } = require('../utils')

const contributors = async () => {
  await execa('git-authors-cli', ['--print', 'false'])

  const res = await pify(git.status.bind(git))()

  if (!res.modified.length) {
    return
  }

  await pify(git.commit.bind(git))(
    'chore: update contributors',
    getPathToPkg(), {
      '--no-verify': true
    }
  )
}

module.exports = contributors
