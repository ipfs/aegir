'use strict'

const {
  exec
} = require('../utils')
const path = require('path')
const release = require('../release')
const semver = require('semver')

async function publishRc (opts) {
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

  console.info('Reading version number') // eslint-disable-line no-console
  const pkg = require(path.join(process.cwd(), 'package.json'))

  console.info('Found version number', pkg.version) // eslint-disable-line no-console
  const version = pkg.version
  const newVersion = semver.inc(version, opts.type)
  const newVersionBranch = `${opts.prefix}v${newVersion.split('.').filter((sub, i) => {
    return i < 2
  }).join('.')}.x`
  console.info('Creating release branch', newVersionBranch) // eslint-disable-line no-console

  await exec('git', ['checkout', '-b', newVersionBranch])
  await exec('git', ['push', 'origin', `${newVersionBranch}:${newVersionBranch}`], {
    quiet: true
  })

  if (version.includes('-')) {
    // already a pre${opts.type}, change from prepatch, preminor, etc to 'prerelease'
    // e.g. 0.38.0-pre.1 -> 0.38.0-rc.0
    opts.type = 'release'
  }

  console.info('Creating', opts.preId) // eslint-disable-line no-console
  await release({
    type: `pre${opts.type}`,
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

module.exports = publishRc
