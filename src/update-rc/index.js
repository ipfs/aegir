/* eslint-disable no-console */
'use strict'

const {
  exec
} = require('../utils')
const release = require('../release')

/**
 * @param {{ branch: string; remote: any; preId: any; distTag: any; ghtoken: any; }} opts
 */
async function updateRc (opts) {
  await exec('git', ['checkout', 'master'])

  try {
    console.info(`Removing local copy of ${opts.branch}`)
    await exec('git', ['branch', '-D', opts.branch])
  } catch (err) {
    if (!err.message.includes(`branch '${opts.branch}' not found`)) {
      throw err
    }
  }

  console.info('Fetching repo history')
  await exec('git', ['fetch'])

  console.info(`Checking out branch ${opts.branch}`)
  await exec('git', ['checkout', '--track', `${opts.remote}/${opts.branch}`])

  console.info('Removing dependencies')
  await exec('rm', ['-rf', 'node_modules', 'package-lock.json'])

  console.info('Installing dependencies')
  await exec('npm', ['ci'])

  console.info('Updating', opts.preId)
  await release({
    debug: false,
    tsRepo: false,
    type: 'prerelease',
    preid: opts.preId,
    distTag: opts.distTag,
    build: false,
    test: false,
    lint: false,
    contributors: true,
    bump: true,
    changelog: true,
    publish: true,
    ghrelease: true,
    commit: true,
    tag: true,
    push: true,
    docs: true,
    ghtoken: opts.ghtoken || process.env.AEGIR_GHTOKEN,
    remote: opts.remote
  })
}

module.exports = updateRc
