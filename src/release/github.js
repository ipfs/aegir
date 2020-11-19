'use strict'

const conventionalGithubReleaser = require('conventional-github-releaser')
const { promisify } = require('util')

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
