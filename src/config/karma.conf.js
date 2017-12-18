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
  config.set({
    frameworks: ['mocha'],
    basePath: process.cwd(),
    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap']
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: reporters,
    mochaOwnReporter: {
      reporter: 'spec'
    },
    junitReporter: {
      outputDir: process.cwd(),
      outputFile: 'junit-report-browser.xml',
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
