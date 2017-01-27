'use strict'

const Server = require('karma').Server
const path = require('path')

module.exports = (gulp) => {
  const util = require('gulp-util')
  const utils = require('../../src/utils')

  gulp.task('test:karma-raw', (done) => {
    karmaTest(false, done)
  })

  gulp.task('test:karma-raw:webworker', (done) => {
    karmaTest(true, done)
  })

  gulp.task('test:karma', (done) => {
    utils.hooksRun(gulp, 'test:browser', ['test:karma-raw'], utils.exitOnFail(done))
  })

  gulp.task('test:karma:webworker', (done) => {
    if (!util.env.webworker) {
      return done()
    }

    utils.hooksRun(gulp, 'test:browser', ['test:karma-raw:webworker'], utils.exitOnFail(done))
  })

  gulp.task('test:browser', (done) => {
    const runSequence = require('run-sequence')

    runSequence.use(gulp)(
      'test:karma',
      'test:karma:webworker',
      utils.exitOnFail(done)
    )
  })
}

function karmaTest (webWorker, done) {
  const debug = process.env.DEBUG
  const sauce = process.env.SAUCE_USERNAME && process.env.TRAVIS

  const config = {
    configFile: path.join(__dirname, '../../config/karma.conf.js'),
    singleRun: !debug
  }

  if (webWorker) {
    config.frameworks = ['mocha-webworker']
    config.files = [{
      pattern: 'test/browser.js', included: false
    }, {
      pattern: 'test/**/*.spec.js', included: false
    }, {
      pattern: 'test/fixtures/**/*', watched: false, served: true, included: false
    }]
    config.client = {
      mochaWebWorker: {
        pattern: [
          'test/browser.js',
          'test/**/*.spec.js'
        ]
      }
    }
  }

  new Server(config, (code) => {
    if (sauce) {
      // don't fail on saucelabs tests
      return done()
    }
    done(code > 0 ? 'Some tests are failing' : undefined)
  }).start()
}
