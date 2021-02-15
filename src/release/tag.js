'use strict'

const git = require('simple-git/promise')(process.cwd())

const { paths, readJson } = require('../utils')

async function tag () {
  const pkg = readJson(paths.package)
  await git.addTag(`v${pkg.version}`)
}

module.exports = tag
