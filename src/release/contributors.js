'use strict'

const git = require('simple-git/promise')(process.cwd())
const execa = require('execa')
const { paths, fromAegir } = require('../utils')

const contributors = async () => {
  await execa('git-authors-cli', ['--print', 'false'], {
    localDir: fromAegir(),
    preferLocal: true
  })

  const res = await git.status()

  if (!res.modified.length) {
    return
  }

  await git.commit(
    'chore: update contributors',
    paths.package,
    {
      '--no-verify': null
    }
  )
}

module.exports = contributors
