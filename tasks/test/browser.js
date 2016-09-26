'use strict'

const Server = require('karma').Server
const path = require('path')

const utils = require('../../src/utils')

module.exports = (gulp) => {
  gulp.task('karma', (done) => {
    const debug = process.env.DEBUG
    new Server({
      configFile: path.join(__dirname, '/../../config/karma.conf.js'),
      singleRun: !debug
    }, (code) => {
      done(code > 0 ? 'Some tests are failing' : undefined)
    }).start()
  })

  gulp.task('test:browser', (done) => {
    utils.hooksRun(gulp, 'test:browser', ['karma'], utils.exitOnFail(done))
  })
}
