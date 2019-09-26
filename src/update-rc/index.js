'use strict'

const {
  exec
} = require('../utils')
const release = require('../release')

async function updateRc (opts) {
  await exec('git', ['checkout', 'master'])

  try {
    console.info(`Removing local copy of ${opts.branch}`) // eslint-disable-line no-console
    await exec('git', ['branch', '-D', opts.branch])
  } catch (err) {
    if (!err.message.includes(`branch '${opts.branch}' not found`)) {
      throw err
    }
  }

  console.info('Fetching repo history') // eslint-disable-line no-console
  await exec('git', ['fetch'])

  console.info(`Checking out branch ${opts.branch}`) // eslint-disable-line no-console
  await exec('git', ['checkout', opts.branch])

  console.info('Removing dependencies') // eslint-disable-line no-console
  await exec('rm', ['-rf', 'node_modules', 'package-lock.json'])

  console.info('Installing dependencies') // eslint-disable-line no-console
  await exec('npm', ['ci'])

  console.info('Updating', opts.preId) // eslint-disable-line no-console
  await release({
    type: 'prerelease',
    preid: opts.preId,
    'dist-tag': opts.distTag,
    build: false,
    test: false,
    lint: false,
    docsFormats: ['html'],
    contributors: true,
    bump: true,
    changelog: true,
    publish: true,
    ghrelease: true,
    docs: true,
    ghtoken: opts.ghtoken || process.env.AEGIR_GHTOKEN
  })
}

module.exports = updateRc
