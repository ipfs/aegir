/* eslint-disable no-console */
'use strict'
const path = require('path')
const fs = require('fs-extra')
const artifact = require('@actions/artifact')
const execa = require('execa')
const globby = require('globby')
const { pkg } = require('../../src/utils')

const aegirExec = pkg.name === 'aegir' ? './cli.js' : 'aegir'

/** @typedef {import("@actions/github").GitHub } Github */
/** @typedef {import("@actions/github").context } Context */

/**
 * Get files for a PR
 *
 * @param {Github} octokit
 * @param {Context} context
 * @return {string[]}
 */
const prFiles = async (octokit, context) => {
  const pr = await octokit.repos.listPullRequestsAssociatedWithCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha: context.sha
  })

  if (pr.data.length === 0) {
    throw new Error(`no PRs associated with commit ${context.sha}`)
  }

  const prFiles = await octokit.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pr.data[0].number
  })

  return prFiles.data.map(f => f.filename)
}

const prPackages = (files) => {
  const baseDir = 'packages'

  const packages = []
  for (const file of files) {
    if (file.startsWith(baseDir)) {
      const pkgName = file.split('/')[1]
      const pkgPath = path.join(process.cwd(), baseDir, pkgName)
      if (!packages.includes(pkgPath)) {
        packages.push(pkgPath)
      }
    }
  }

  return packages
}

/**
 * Bundle Size Check
 *
 * @param {Github} octokit
 * @param {Context} context
 * @param {string} baseDir
 */
const sizeCheck = async (octokit, context, baseDir) => {
  let check = null
  const pkgName = baseDir.split('/').pop()
  const checkName = isMonorepo() ? `size: ${pkgName}` : 'size'

  try {
    check = await octokit.checks.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: checkName,
      head_sha: context.sha,
      status: 'in_progress'
    })

    const out = await execa(aegirExec, ['build', '-b'], {
      cwd: baseDir,
      localDir: '.',
      preferLocal: true,
      env: { CI: true }
    })
    console.log('Size check for:', pkgName)
    console.log(out.stdout)

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

    await artifact.create().uploadArtifact(
      `${pkgName}-size`,
      await globby(['dist/*'], { cwd: baseDir, absolute: true }),
      baseDir,
      {
        continueOnError: true
      }
    )
  } catch (err) {
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
    throw err
  }
}

const isMonorepo = () => {
  return fs.existsSync(path.join(process.cwd(), 'packages'))
}

module.exports = {
  prFiles,
  prPackages,
  sizeCheck,
  isMonorepo
}
