/* eslint-disable no-console */

import http from 'https'

import {
  ensureFileHasContents,
  ensureFileNotPresent
} from './utils.js'

const managedRepos = 'https://raw.githubusercontent.com/protocol/.github/master/configs/js.json'
const ciFileUrl = 'https://raw.githubusercontent.com/protocol/.github/master/templates/.github/workflows/js-test-and-release.yml'
const mergeFileUrl = 'https://raw.githubusercontent.com/protocol/.github/master/templates/.github/workflows/automerge.yml'

/**
 * @param {string} url
 * @returns
 */
async function download (url) {
  return new Promise((resolve, reject) => {
    http.get(url, function (response) {
      let contents = ''

      response.on('data', (chunk) => {
        contents += chunk.toString()
      })
      response.on('end', () => {
        resolve(contents)
      })
      response.on('error', (err) => {
        reject(err)
      })
    })
  })
}

/**
 * @param {string} repoName
 */
async function isManagedRepo (repoName) {
  const repos = JSON.parse(await download(managedRepos)).repositories

  for (const { target } of repos) {
    if (target === repoName) {
      return true
    }
  }

  return false
}

/**
 * @param {string} projectDir
 * @param {string} branchName
 * @param {string} repoUrl
 */
export async function checkBuildFiles (projectDir, branchName, repoUrl) {
  console.info('Check build files')

  await ensureFileNotPresent(projectDir, '.travis.yml')
  await ensureFileHasContents(projectDir, '.github/dependabot.yml')

  // if this repo is managed by https://github.com/protocol/.github don't try to update the ci files
  const isManaged = await isManagedRepo(repoUrl.replace('https://github.com/', ''))

  if (isManaged) {
    console.info('CI files are managed by https://github.com/protocol/.github')
    return
  }

  let defaultCiContent = await download(ciFileUrl)
  defaultCiContent = defaultCiContent.replace(/\$default-branch/g, branchName)

  await ensureFileHasContents(projectDir, '.github/workflows/js-test-and-release.yml', defaultCiContent)

  const defaultMergeContent = await download(mergeFileUrl)

  await ensureFileHasContents(projectDir, '.github/workflows/automerge.yml', defaultMergeContent)
}
