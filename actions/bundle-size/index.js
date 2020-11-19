/* eslint-disable no-console */
'use strict'

const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')
const { sizeCheck } = require('./utils')

const run = async () => {
  try {
    const octokit = getOctokit(core.getInput('github_token', { required: true }))
    console.log("core.getInput('github_token')", core.getInput('github_token') === '')
    console.log('Running sizeeeeeeeeeeeee')
    // await sizeCheck(octokit, context, core.getInput('project') || process.cwd())
  } catch (err) {
    core.setFailed(err)
  }
}

run()
