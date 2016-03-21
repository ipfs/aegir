'use strict'

const $ = require('gulp-load-plugins')()

const utils = require('../../src/utils')

module.exports = (gulp, done) => {
  const remote = $.util.remote || 'origin'
  $.util.log('Pushing to git...')
  $.git.push(remote, 'master', {args: '--tags'}, (err) => {
    if (err) return utils.fail(err.message)

    $.util.log(`Pushed to git ${remote}:master`)
    done()
  })
}
