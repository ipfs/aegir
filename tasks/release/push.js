'use strict'

module.exports = (gulp) => {
  gulp.task('release:push', (done) => {
    const util = require('gulp-util')
    const git = require('gulp-git')

    const utils = require('../../src/utils')

    const remote = util.remote || 'origin'
    util.log('Pushing to git...')
    git.push(remote, 'master', {args: '--tags'}, (err) => {
      if (err) return utils.fail(err.message)

      util.log(`Pushed to git ${remote}:master`)
      done()
    })
  })
}
