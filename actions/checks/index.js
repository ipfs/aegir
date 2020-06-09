/* eslint-disable no-console */
'use strict'

const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')
const { prFiles, prPackages, sizeCheck, isMonorepo } = require('./utils')

const run = async () => {
  const octokit = new GitHub(core.getInput('github_token'))

  try {
    if (isMonorepo()) {
      const changedFiles = await prFiles(octokit, context)
      const pkgs = prPackages(changedFiles)

      await Promise.all(pkgs.map(pkg => sizeCheck(octokit, context, pkg)))
    } else {
      await sizeCheck(octokit, context, process.cwd())
    }
  } catch (err) {
    core.setFailed(err)
  }
}

run()
