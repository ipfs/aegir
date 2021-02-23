'use strict'

// @ts-ignore
const conventionalGithubReleaser = require('conventional-github-releaser')
const { promisify } = require('util')

/**
 * Github release
 *
 * @param {{ ghtoken: string; }} opts
 * @returns {Promise<any>}
 */
function github (opts) {
  return promisify(conventionalGithubReleaser)({
    type: 'oauth',
    token: opts.ghtoken,
    url: 'https://api.github.com/'
  }, {
    preset: 'angular'
  })
}

module.exports = github
