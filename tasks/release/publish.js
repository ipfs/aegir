'use strict'

const spawn = require('child_process').spawn

function npmPublish (utils, log, done) {
  const publish = spawn('npm', ['publish'])
  publish.stdout.pipe(process.stdout)
  publish.stderr.pipe(process.stderr)
  publish.on('close', (code) => {
    if (code !== 0) return utils.fail(`npm publish. Exiting with ${code}.`)

    log('Published to npm.')
    done()
  })
}

module.exports = (gulp) => {
  gulp.task('release:publish', (done) => {
    const git = require('gulp-git')
    const util = require('gulp-util')

    const utils = require('../../src/utils')

    git.status({args: '-s'}, (err, stdout) => {
      if (err) return utils.fail(err.message)

      const isDirty = stdout.trim().length > 0

      if (isDirty) {
        return utils.fail('Dirt workspace, cannot push to npm')
      }

      util.log('Publishing to npm...')
      npmPublish(utils, util.log, done)
    })
  })
}
