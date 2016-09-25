'use strict'

module.exports = (gulp) => {
  gulp.task('release:github', (done) => {
    const util = require('gulp-util')
    const conventionalGithubReleaser = require('conventional-github-releaser')

    if (util.env.changelog === false) {
      util.log('Skipping github release')
      return done()
    }

    const token = process.env.GH_TOKEN || util.env.token

    if (!token) {
      util.log(util.colors.yellow(`
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
  })
}
