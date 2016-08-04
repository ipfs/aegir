'use strict'

const $ = require('gulp-load-plugins')()
const conventionalGithubReleaser = require('conventional-github-releaser')

module.exports = (gulp, done) => {
  const token = process.env.GH_TOKEN || $.util.env.token

  if (!token) {
    $.util.log($.util.colors.yellow(`
Skipping Github release as you are missing an oauth token.
You can supply one by either using $GH_TOKEN or --token.
    `))
    return done()
  }

  conventionalGithubReleaser({
    type: 'oauth',
    token
  }, {
    preset: 'angular'
  }, done)
}
