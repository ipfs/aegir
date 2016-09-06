'use strict'

const gulpRequire = require('gulp-require-tasks')
const path = require('path')
const onExit = require('signal-exit')

module.exports = (gulp) => {
  gulp = gulp || require('gulp')

  gulpRequire({
    path: path.join(__dirname, '../tasks'),
    gulp: gulp
  })

  // Workaround for gulp not exiting after calling done
  // See https://github.com/gulpjs/gulp/issues/167
  //
  // The issue for this is that the daemon start seems to keep
  // some open connections that are not cleaned up properly and so
  // gulp does not exit. So it's probably a bug in node-ipfs-ctl
  gulp.on('stop', () => {
    process.nextTick(() => {
      process.exit()
    })
  })

  onExit(function (code) {
    gulp.stop()
    process.exit(code)
  })
}
