'use strict'

const path = require('path')
const _ = require('lodash')

const user = require('../config/user')
const webpackConfig = require('../config/webpack')

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'karma.conf.js')

function getPatterns (ctx) {
  if (ctx.files && ctx.files.length > 0) {
    return ctx.files
  }

  return [
    // Karma needs a single entry point. That files will create a single bundle
    // out of `test/browser.js` and `test/**/*.spec.js`
    'node_modules/aegir/src/config/karma-webpack-bundle.js'
  ]
}

function webworkerClient (ctx) {
  return {
    mochaWebWorker: {
      pattern: getPatterns(ctx),
      mocha: {
        timeout: ctx.timeout
      }
    }
  }
}

function getClient (isWebworker, ctx) {
  if (isWebworker) {
    return webworkerClient(ctx)
  }

  return {
    mocha: {
      timeout: ctx.timeout
    }
  }
}

function getConfig (isWebworker, ctx) {
  const ctxFiles = getPatterns(ctx).map((pattern) => ({
    pattern: pattern,
    included: !isWebworker
  }))
  // Preprocess every file that is used as a test file for Karma. By default
  // that's a single entry point, but it could also be a single test that
  // is given as command line parameter
  const preprocessors = getPatterns(ctx).reduce((acc, pattern) => {
    acc[pattern] = ['webpack', 'sourcemap']
    return acc
  }, {})

  const fixtureFiles = [{
    pattern: 'test/fixtures/**/*',
    watched: false,
    served: true,
    included: false
  }]
  const userKarma = user().karma
  const userFiles = userKarma.files || []

  return webpackConfig('test').then((webpack) => {
    // no need for entry
    webpack.entry = ''

    const randomNumber = Math.floor(Math.random() * 10000)
    const testType = isWebworker ? 'webworker' : 'browser'
    const junitFile = `junit-report-${testType}-${randomNumber}.xml`

    return _.defaultsDeep({
      files: ctxFiles.concat(fixtureFiles).concat(userFiles)
    }, userKarma, {
      configFile: CONFIG_FILE,
      singleRun: !ctx.watch,
      watch: ctx.watch,
      frameworks: isWebworker ? ['mocha-webworker'] : ['mocha'],
      logLevel: ctx.verbose ? 'debug' : 'error',
      client: getClient(isWebworker, ctx),
      preprocessors: preprocessors,
      mochaOwnReporter: {
        reporter: 'spec'
      },
      junitReporter: {
        outputFile: junitFile
      },
      browserNoActivityTimeout: 50 * 1000,
      customLaunchers: {
        ChromeCustom: {
          base: 'Chrome',
          flags: [!ctx.cors ? '--disable-web-security' : '']
        },
        FirefoxCustom: {
          base: 'Firefox',
          prefs: {
            'security.fileuri.strict_origin_policy': ctx.cors
          }
        }
      },
      webpack: webpack
    })
  })
}

module.exports = getConfig
