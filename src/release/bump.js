'use strict'

const semver = require('semver')
const fs = require('fs-extra')

const { paths } = require('../utils')

/**
 * @param {{ type: any; preid: any; }} ctx
 * @param {{ title: string; }} task
 */
function bump (ctx, task) {
  const { type, preid } = ctx

  return fs.readJson(paths.package)
    .then((pkg) => {
      const version = pkg.version
      const newVersion = semver.inc(version, type, preid)

      task.title += `: v${version} -> v${newVersion}`

      pkg.version = newVersion
      return fs.writeJson(paths.package, pkg, { spaces: 2 })
    })
}

module.exports = bump
