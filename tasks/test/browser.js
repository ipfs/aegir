'use strict'

const Server = require('karma').Server
const path = require('path')

const utils = require('../../src/utils')

module.exports = (gulp) => {
  gulp.task('karma', (done) => {
    const debug = process.env.DEBUG
    const sauce = process.env.SAUCE_USERNAME && process.env.TRAVIS

    new Server({
      configFile: path.join(__dirname, webWorker
        ? '../../config/karma.webworker.conf.js'
        : '../../config/karma.conf.js'),
      singleRun: !debug
    }, (code) => {
      if (sauce) {
        // don't fail on saucelabs tests
        return done()
      }
      done(code > 0 ? 'Some tests are failing' : undefined)
    }).start()
  })

  gulp.task('test:browser', (done) => {
    utils.hooksRun(gulp, 'test:browser', ['karma'], utils.exitOnFail(done))
  })

  let webWorker = false
  gulp.task('test:webworker', (done) => {
    webWorker = true
    utils.hooksRun(gulp, 'test:browser', ['karma'], utils.exitOnFail(done))
  })
}
