'use strict'

const git = require('simple-git/promise')(process.cwd())
const { readJson, paths } = require('../utils')

const files = ['package.json', 'CHANGELOG.md']

async function commit () {
  const pkg = readJson(paths.package)
  await git.add(files)

  await git.commit(
    `chore: release version v${pkg.version}`,
    files
  )
}

module.exports = commit
