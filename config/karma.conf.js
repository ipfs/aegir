'use strict'

const path = require('path')
const webpackConfig = require('./webpack')
const timeout = webpackConfig.dev.timeout

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
      'test/**/*': ['webpack']
    },
    webpack: webpackConfig.dev,
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
    browsers: process.env.TRAVIS ? ['Firefox', 'PhantomJS'] : ['Chrome', 'PhantomJS'],
    singleRun: false,
    concurrency: 1,
    browserNoActivityTimeout: timeout
  })
}
