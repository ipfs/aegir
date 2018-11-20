'use strict'

const semver = require('semver')
const fs = require('fs-extra')

const getPathToPkg = require('../utils').getPathToPkg

function bump (ctx, task) {
  const { type, preid } = ctx

  return fs.readJson(getPathToPkg())
    .then((pkg) => {
      const version = pkg.version
      const newVersion = semver.inc(version, type, preid)

      task.title += `: v${version} -> v${newVersion}`

      pkg.version = newVersion
      return fs.writeJson(getPathToPkg(), pkg, { spaces: 2 })
    })
}

module.exports = bump
