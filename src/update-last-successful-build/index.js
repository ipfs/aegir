'use strict'

const {
  exec
} = require('../utils')

async function findCurrentBranch () {
  const result = await exec('cat', ['.git/HEAD'])

  return result.stdout.replace('ref: ', '').trim()
}

async function findMasterCommit () {
  const result = await exec('git', ['show-ref', '-s', 'origin/master'])

  return result.stdout.trim()
}

async function isHeadOfMaster () {
  const master = await findMasterCommit()
  const branch = await findCurrentBranch()

  // we either have master checked out or a single commit
  return branch === 'refs/heads/master' || branch === master
}

async function updateLastSuccessfulBuild (opts) {
  if (!isHeadOfMaster()) {
    console.info('Will only run on the master branch') // eslint-disable-line no-console

    return
  }

  console.info('Fetching latest') // eslint-disable-line no-console
  await exec('git', ['fetch'])

  const tempBranch = 'update-branch-' + Date.now()

  console.info('Creating temp branch') // eslint-disable-line no-console
  await exec('git', ['checkout', '-b', tempBranch])

  console.info('Creating yarn.lock') // eslint-disable-line no-console
  await exec('yarn')

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

  try {
    console.info(`Deleting remote ${opts.branch} branch`) // eslint-disable-line no-console
    await exec('git', ['push', 'origin', `:${opts.branch}`], {
      quiet: true
    })
  } catch (err) {
    if (!err.message.includes('remote ref does not exist')) {
      throw err
    }
  }

  console.info(`Pushing ${opts.branch} branch`) // eslint-disable-line no-console
  await exec('git', ['push', 'origin', `${tempBranch}:${opts.branch}`], {
    quiet: true
  })
}

module.exports = updateLastSuccessfulBuild
