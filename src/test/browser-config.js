'use strict'

const path = require('path')
const timeout = require('../config/custom').timeout
const user = require('../config/user')().karma

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'karma.conf.js')

const userFiles = user.files != null ? user.files : []

const webworkerClient = {
  mochaWebWorker: {
    pattern: [
      'test/browser.js',
      'test/**/*.spec.js'
    ],
    mocha: {
      timeout: timeout
    }
  }
}

const defaultClient = {
  mocha: {
    timeout: timeout
  }
}

function getConfig (isWebworker, ctx) {
  return {
    configFile: CONFIG_FILE,
    singleRun: !ctx.watch,
    watch: ctx.watch,
    frameworks: isWebworker ? ['mocha-webworker'] : ['mocha'],
    logLevel: ctx.verbose ? 'debug' : 'error',
    client: isWebworker ? webworkerClient : defaultClient,
    mochaOwnReporter: {
      reporter: ctx.verbose ? 'spec' : 'progress'
    },
    files: [{
      pattern: 'test/browser.js',
      included: !isWebworker
    }, {
      pattern: 'test/**/*.spec.js',
      included: !isWebworker
    }, {
      pattern: 'test/fixtures/**/*',
      watched: false,
      served: true,
      included: false
    }].concat(userFiles)
  }
}

module.exports = getConfig
