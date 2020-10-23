'use strict'

const git = require('simple-git/promise')(process.cwd())
const { pkgVersion } = require('../utils')

const files = ['package.json', 'CHANGELOG.md']

async function commit () {
  await git.add(files)

  await git.commit(
    `chore: release version v${await pkgVersion()}`,
    files
  )
}

module.exports = commit
