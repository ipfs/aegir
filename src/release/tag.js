'use strict'

const git = require('simple-git')(process.cwd())
const pify = require('pify')
const fs = require('fs-extra')

const getPathToPkg = require('../utils').getPathToPkg

async function tag () {
  const {
    version
  } = await fs.readJson(getPathToPkg())

  await pify(git.addTag.bind(git))(`v${version}`)
}

module.exports = tag
