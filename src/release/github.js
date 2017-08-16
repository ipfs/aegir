'use strict'

const conventionalGithubReleaser = require('conventional-github-releaser')
const pify = require('pify')

function github (opts) {
  return pify(conventionalGithubReleaser)({
    type: 'oauth',
    token: opts.ghtoken
  }, {
    preset: 'angular'
  })
}

module.exports = github
