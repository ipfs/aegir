'use strict'

const join = require('path').join
const ghPages = require('gh-pages')
const util = require('gulp-util')

module.exports = (gulp) => {
  gulp.task('docs:publish', ['docs:build'], (cb) => {
    ghPages.publish(join(process.cwd(), 'docs'), {
      message: 'docs: auto build',
      logger (msg) {
        util.log(`'${util.colors.cyan('docs:publish')}' ${msg}`)
      }
    }, cb)
  })
}
