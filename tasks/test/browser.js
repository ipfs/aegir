'use strict'

const Server = require('karma').Server
const path = require('path')

const utils = require('../../src/utils')

module.exports = {
  fn (gulp, done) {
    gulp.task('karma', (cb) => {
      new Server({
        configFile: path.join(__dirname, '/../../config/karma.conf.js'),
        singleRun: true
      }, (code) => {
        cb(code > 0 ? 'Some tests are failing' : undefined)
      }).start()
    })

    utils.hooksRun(gulp, 'test:browser', ['karma'], utils.exitOnFail(done))
  }
}
