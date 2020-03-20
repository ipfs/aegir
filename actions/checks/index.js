/* eslint-disable no-console */
'use strict'

const artifact = require('@actions/artifact')
const core = require('@actions/core')
const execa = require('execa')
const globby = require('globby')
const { context, GitHub } = require('@actions/github')

const run = async () => {
  let check = null
  const token = core.getInput('github_token')
  const octokit = new GitHub(token)
  const checkName = 'Size'

  try {
    check = await octokit.checks.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: checkName,
      head_sha: context.sha,
      status: 'in_progress'
    })

    await execa('yarn', ['install', '--silent'])
    const out = await execa('./cli.js', ['build', '-b'], { localDir: '.', preferLocal: true, env: { CI: true } })
    console.log(out.stdout)
    const title = out.stdout.split('\n')[1]
    await octokit.checks.update(
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        check_run_id: check.data.id,
        name: checkName,
        status: 'completed',
        conclusion: 'success',
        output: {
          title: title,
          summary: out.stdout
        }
      }
    )
    const files = await globby(['dist/*'])
    const artifactClient = artifact.create()
    const artifactName = 'bundle'
    const rootDirectory = './dist'
    const options = {
      continueOnError: true
    }

    const uploadResult = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options)
    console.log('run -> uploadResult', uploadResult)
  } catch (err) {
    await octokit.checks.update(
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        check_run_id: check.data.id,
        name: checkName,
        status: 'completed',
        conclusion: 'failure'
      }
    )
    console.error(err.stack)
    core.setFailed(err.message)
  }
}

run()
