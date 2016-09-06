'use strict'

const path = require('path')
const webpackConfig = require('./webpack')
const timeout = webpackConfig.timeout

const browsers = []

if (process.env.TRAVIS) {
  browsers.push('Firefox')
} else {
  browsers.push('Chrome')
}

if (!process.env.DEBUG) {
  browsers.push('PhantomJS')
}

module.exports = function (config) {
  config.set({
    basePath: process.cwd(),
    frameworks: ['mocha'],
    client: {
      mocha: {
        timeout: timeout
      }
    },
    files: [
      path.join(require.resolve('babel-polyfill'), '/../../dist/polyfill.js'),
      'test/browser.js',
      'test/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'test/**/*': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['mocha-own'],
    mochaOwnReporter: {
      reporter: 'spec'
    },
    port: 9876,
    colors: true,
    logLevel: process.env.DEBUG ? config.LOG_DEBUG : config.LOG_INFO,
    autoWatch: false,
    browsers: browsers,
    singleRun: false,
    concurrency: 1,
    browserNoActivityTimeout: timeout,
    failOnEmptyTestSuite: false
  })
}
