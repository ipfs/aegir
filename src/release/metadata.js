'use strict'

const fs = require('fs-extra')

const getPathToPkg = require('../utils').getPathToPkg

function metadata (ctx, task) {
  const { metadata } = ctx

  return fs.readJson(getPathToPkg())
    .then((pkg) => {
      const version = pkg.version
      const newVersion = `${version}+${metadata}`

      task.title += `: v${version} -> v${newVersion}`

      pkg.version = newVersion
      return fs.writeJson(getPathToPkg(), pkg, { spaces: 2 })
    })
}

module.exports = metadata
