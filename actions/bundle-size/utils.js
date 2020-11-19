/* eslint-disable no-console */
'use strict'
const artifact = require('@actions/artifact')
const execa = require('execa')
const core = require('@actions/core')
const globby = require('globby')
const readPkgUp = require('read-pkg-up')
const fs = require('fs')
const { pkg } = require('../../src/utils')

const aegirExec = pkg.name === 'aegir' ? './cli.js' : 'aegir'

/** @typedef {import("@actions/github").context } Context */

/**
 * Bundle Size Check
 *
 * @param {Github} octokit
 * @param {Context} context
 * @param {string} baseDir
 */
const sizeCheck = async (octokit, context, baseDir) => {
  let check
  baseDir = fs.realpathSync(baseDir)

  const { packageJson } = readPkgUp.sync({
    cwd: baseDir
  })
  const pkgName = packageJson.name
  const checkName = process.cwd() !== baseDir ? `size: ${pkgName}` : 'size'

  try {
    check = await checkCreate(octokit, context, checkName)

    const out = await execa(aegirExec, ['build', '-b'], {
      cwd: baseDir,
      localDir: '.',
      preferLocal: true,
      env: { CI: true }
    })
    console.log('Size check for:', pkgName)
    console.log(out.stdout)

    if (check) {
      const parts = out.stdout.split('\n')
      const title = parts[2]
      await octokit.checks.update(
        {
          owner: context.repo.owner,
          repo: context.repo.repo,
          check_run_id: check.data.id,
          conclusion: 'success',
          output: {
            title: title,
            summary: [parts[0], parts[1]].join('\n')
          }
        }
      )
    }

    await artifact.create().uploadArtifact(
      `${pkgName}-size`,
      await globby(['dist/*'], { cwd: baseDir, absolute: true }),
      baseDir,
      {
        continueOnError: true
      }
    )
  } catch (err) {
    console.log('err', err)

    if (check) {
      await octokit.checks.update(
        {
          owner: context.repo.owner,
          repo: context.repo.repo,
          check_run_id: check.data.id,
          conclusion: 'failure',
          output: {
            title: err.stderr ? err.stderr : 'Error',
            summary: err.stdout ? err.stdout : err.message
          }
        }
      )
    }
    throw err
  }
}

/**
 *
 * @param {Github} octokit
 * @param {Context} context
 * @param {string} name
 */
const checkCreate = async (octokit, context, name) => {
  try {
    return await octokit.checks.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name,
      head_sha: context.sha,
      status: 'in_progress'
    })
  } catch (err) {
    core.warning(`Failed to create Github check with the error, ${err}, you can normally ignore this message when there is no PR associated with this commit or when the commit comes from a Fork PR. `)
  }
}

module.exports = {
  sizeCheck
}
