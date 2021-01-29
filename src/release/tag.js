'use strict'

const git = require('simple-git/promise')(process.cwd())

const { pkg } = require('../utils')

async function tag () {
  await git.addTag(`v${pkg.version}`)
}

module.exports = tag
