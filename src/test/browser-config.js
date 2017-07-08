'use strict'

const path = require('path')
const _ = require('lodash')

const timeout = require('../config/custom').timeout
const user = require('../config/user')

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'karma.conf.js')

function getPatterns (ctx) {
  if (ctx.files && ctx.files.length > 0) {
    return ctx.files
  }

  return [
    'test/browser.js',
    'test/**/*.spec.js'
  ]
}

function webworkerClient (ctx) {
  return {
    mochaWebWorker: {
      pattern: getPatterns(ctx),
      mocha: {
        timeout: timeout
      }
    }
  }
}

const defaultClient = {
  mocha: {
    timeout: timeout
  }
}

function getConfig (isWebworker, ctx) {
  return _.defaultsDeep({}, user().karma, {
    configFile: CONFIG_FILE,
    singleRun: !ctx.watch,
    watch: ctx.watch,
    frameworks: isWebworker ? ['mocha-webworker'] : ['mocha'],
    logLevel: ctx.verbose ? 'debug' : 'error',
    client: isWebworker ? webworkerClient : defaultClient,
    mochaOwnReporter: {
      reporter: ctx.verbose ? 'spec' : 'progress'
    },
    files: [
      getPatterns(ctx).map((pattern) => ({
        pattern: pattern,
        included: !isWebworker
      })), {
        pattern: 'test/fixtures/**/*',
        watched: false,
        served: true,
        included: false
      }
    ]
  })
}

module.exports = getConfig
