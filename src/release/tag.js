'use strict'

const git = require('simple-git/promise')(process.cwd())

const { pkgVersion } = require('../utils')

async function tag () {
  await git.addTag(`v${await pkgVersion()}`)
}

module.exports = tag
