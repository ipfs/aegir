/* eslint-disable no-console */

import http from 'https'
import {
  ensureFileHasContents,
  ensureFileNotPresent
} from './utils.js'

const ciFileUrl = 'https://raw.githubusercontent.com/pl-strflt/uci/main/templates/.github/workflows/js-test-and-release.yml'

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
 * @param {string} projectDir
 * @param {string} branchName
 * @param {string} repoUrl
 */
export async function checkBuildFiles (projectDir, branchName, repoUrl) {
  console.info('Check build files')

  await ensureFileNotPresent(projectDir, '.travis.yml')
  await ensureFileHasContents(projectDir, '.github/dependabot.yml')
  await ensureFileHasContents(projectDir, '.github/workflows/semantic-pull-request.yml')
  await ensureFileHasContents(projectDir, '.github/workflows/stale.yml')

  let defaultCiContent = await download(ciFileUrl)
  defaultCiContent = defaultCiContent.replaceAll('${{{ github.default_branch }}}', branchName)
  defaultCiContent = defaultCiContent.replaceAll('${{{ .config.versions.uci // (.source.tag | sub("\\\\.[^.\\\\-\\\\+]+(?=\\\\-|\\\\+|$)"; "")) }}}', 'v0.0')

  await ensureFileHasContents(projectDir, '.github/workflows/js-test-and-release.yml', defaultCiContent)
}
