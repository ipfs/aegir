'use strict'

const git = require('simple-git/promise')(process.cwd())
const { pkg } = require('../utils')

const files = ['package.json', 'CHANGELOG.md']

async function commit () {
  await git.add(files)

  await git.commit(
    `chore: release version v${pkg.version}`,
    files
  )
}

module.exports = commit
