'use strict'

const conventionalChangelog = require('conventional-changelog')
const fs = require('fs-extra')
const path = require('path')

/**
 * @typedef {import('./../types').ReleaseOptions} ReleaseOptions
 * @typedef {import('listr').ListrTaskWrapper} ListrTask
 */

/**
 *
 * @param {*} ctx
 * @param {ListrTask} task
 */
function changelog (ctx, task) {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')

  const releaseCount = fs.existsSync(changelogPath) ? 1 : 0

  /** @type {Buffer} */
  let current

  if (releaseCount === 0) {
    task.title += ' (including all releases)'
  } else {
    current = fs.readFileSync(changelogPath)
  }

  return new Promise((resolve, reject) => {
    conventionalChangelog({
      preset: 'angular',
      releaseCount: releaseCount
    }).pipe(fs.createWriteStream(changelogPath))
      .once('error', reject)
      .once('finish', resolve)
  }).then(() => {
    if (current) {
      return fs.appendFile(changelogPath, current)
    }
  })
}

module.exports = changelog
