/* eslint-disable no-console */
'use strict'

const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')
const { sizeCheck } = require('./utils')

const run = async () => {
  const octokit = new GitHub(core.getInput('github_token'))

  try {
    await sizeCheck(octokit, context, core.getInput('project') || process.cwd())
  } catch (err) {
    core.setFailed(err)
  }
}

run()
