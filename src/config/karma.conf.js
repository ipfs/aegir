'use strict'

let concurrency = 1
let reporters = ['mocha-own']

if (process.env.CI) {
  reporters.push('junit')
}

let browsers = []

if (process.env.TRAVIS) {
  browsers.push('FirefoxCustom')
} else {
  browsers.push('ChromeCustom')
}

module.exports = function (config) {
  const randomNumber = Math.floor(Math.random() * 10000)
  const junitFile = `junit-report-browser-${randomNumber}.xml`

  config.set({
    frameworks: ['mocha'],
    basePath: process.cwd(),
    webpackMiddleware: {
      noInfo: true
    },
    plugins: config.plugins.concat([
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-mocha',
      'karma-mocha-webworker',
      'karma-mocha-own-reporter',
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ].map(m => require(m))),
    reporters: reporters,
    mochaOwnReporter: {
      reporter: 'spec'
    },
    junitReporter: {
      outputDir: process.cwd(),
      outputFile: junitFile,
      useBrowserName: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: browsers,
    singleRun: true,
    concurrency: concurrency,
    failOnEmptyTestSuite: true
  })
}
