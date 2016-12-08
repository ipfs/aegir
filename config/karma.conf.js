'use strict'

const webpackConfig = require('./webpack')
const timeout = require('./custom').timeout
const user = require('./user').customConfig

let userFiles = []
if (user.karma && user.karma.files) {
  userFiles = user.karma.files
}

const files = [
  'test/browser.js',
  'test/**/*.spec.js',
  {pattern: 'test/fixtures/**/*', watched: false, served: true, included: false}
].concat(userFiles)

let concurrency = 1
let reporters = ['mocha-own']

const launchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'Chrome',
    platform: 'Windows 10',
    version: '53'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'Firefox',
    platform: 'Windows 10',
    version: '48'
  },
  sl_safari: {
    base: 'SauceLabs',
    browserName: 'Safari',
    platform: 'OS X 10.11',
    version: 'latest'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'Internet Explorer',
    platform: 'Windows 10',
    version: '11'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '14.14393'
  },
  sl_android: {
    base: 'SauceLabs',
    browserName: 'Browser',
    deviceName: 'Android Emulator',
    platformName: 'Android',
    appiumVersion: '1.5.3',
    platformVersion: '5.1',
    deviceOrientation: 'portrait'
  },
  sl_iphone: {
    base: 'SauceLabs',
    browserName: 'Safari',
    deviceName: 'iPhone Simulator',
    platformName: 'iOS',
    platformVersion: '9.3',
    appiumVersion: '1.5.3',
    deviceOrientation: 'portrait'
  }
}

let browsers = []

if (process.env.SAUCE_USERNAME &&
    process.env.SAUCE_ACCESS_KEY &&
    process.env.SAUCE) {
  browsers = Object.keys(launchers)
  concurrency = 3
  reporters = ['progress', 'saucelabs']
} else if (process.env.TRAVIS) {
  browsers.push('Firefox')
} else {
  browsers.push('Chrome')
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
    files: files,
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
    logLevel: process.env.DEBUG ? config.LOG_DEBUG : config.LOG_INFO,
    autoWatch: false,
    browsers: browsers,
    customLaunchers: launchers,
    singleRun: false,
    concurrency: concurrency,
    browserNoActivityTimeout: timeout,
    failOnEmptyTestSuite: false
  })
}
