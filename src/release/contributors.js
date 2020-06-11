'use strict'

const git = require('simple-git/promise')(process.cwd())
const execa = require('execa')
const { getPathToPkg } = require('../utils')

const contributors = async () => {
  await execa('git-authors-cli', ['--print', 'false'])

  const res = await git.status()

  if (!res.modified.length) {
    return
  }

  await git.commit(
    'chore: update contributors',
    getPathToPkg(),
    {
      '--no-verify': true
    }
  )
}

module.exports = contributors
