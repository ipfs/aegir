'use strict'

const execa = require('execa')

// Check if there are valid GitHub credentials for publishing this module
function validGh (opts) {
  if (!opts.ghrelease) {
    return Promise.resolve(true)
  }

  if (!opts.ghtoken) {
    return Promise.reject(new Error('Missing GitHub access token. ' +
                                    'Have you set `AEGIR_GHTOKEN`?'))
  }
  return Promise.resolve()
}

// Is the current git workspace dirty?
async function isDirty () {
  const out = await execa('git', ['status', '-s'])

  if (out.stdout.trim().length > 0) {
    throw new Error('Dirty git repo, aborting')
  }
}

// Validate that all requirements are met before starting the release
// - No dirty git
// - github token for github release, if github release is enabled
function prerelease (opts) {
  return Promise.all([
    isDirty(),
    validGh(opts)
  ])
}

module.exports = prerelease
