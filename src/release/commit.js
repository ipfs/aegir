'use strict'

const git = require('simple-git')(process.cwd())
const pify = require('pify')
const fs = require('fs-extra')

const getPathToPkg = require('../utils').getPathToPkg

const files = ['package.json', 'CHANGELOG.md']

function commit () {
  let version
  return Promise.all([
    pify(git.add.bind(git))(files),
    fs.readJson(getPathToPkg())
  ]).then((res) => {
    version = res[1].version
    return pify(git.commit.bind(git))(
      `chore: release version v${version}`,
      files
    )
  }).then(() => pify(git.addTag.bind(git))(`v${version}`))
}

module.exports = commit
