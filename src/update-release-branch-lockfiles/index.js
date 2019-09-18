'use strict'

const {
  exec
} = require('../utils')

async function updateReleaseBranchLockfiles (opts) {
  // when (eventually) run on CI, deps should already be present so need to
  // remove the lines that remove the node_modules folder
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
  await exec('rm', ['-rf', 'node_modules', 'package-lock.json', 'yarn.lock', 'npm-shrinkwrap.json'])

  console.info('Creating yarn.lock') // eslint-disable-line no-console
  await exec('yarn')

  console.info('Installing dependencies') // eslint-disable-line no-console
  await exec('npm', ['install'])

  console.info('Creating npm-shrinkwrap.json') // eslint-disable-line no-console
  await exec('npm', ['shrinkwrap'])

  try {
    console.info('Committing') // eslint-disable-line no-console
    await exec('git', ['add', '-f', 'npm-shrinkwrap.json', 'yarn.lock'])
    await exec('git', ['commit', '-m', opts.message])
  } catch (err) {
    if (err.message.includes('nothing to commit, working tree clean')) {
      console.info('No changes detected, nothing to do') // eslint-disable-line no-console
      return
    }

    throw err
  }

  console.info(`Pushing ${opts.branch} branch`) // eslint-disable-line no-console
  await exec('git', ['push', 'origin', `${opts.branch}:${opts.branch}`], {
    quiet: true
  })
}

module.exports = updateReleaseBranchLockfiles
