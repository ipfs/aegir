/* eslint-disable no-console */
const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')
const { sizeCheck } = require('./utils')

const run = async () => {
  try {
    const octokit = getOctokit(core.getInput('github_token'))
    await sizeCheck(octokit, context, core.getInput('project') || process.cwd())
  } catch (err) {
    core.setFailed(err)
  }
}

run()
