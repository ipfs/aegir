'use strict'

const webpackConfig = require('./webpack')
const timeout = require('./custom').timeout

let concurrency = 1
let reporters = ['mocha-own']

let browsers = []

if (process.env.TRAVIS) {
  browsers.push('Firefox')
} else {
  browsers.push('Chrome')
}

module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    basePath: process.cwd(),
    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    reporters: reporters,
    mochaOwnReporter: {
      reporter: 'spec'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: browsers,
    singleRun: true,
    concurrency: concurrency,
    browserNoActivityTimeout: timeout,
    failOnEmptyTestSuite: true
  })
}
