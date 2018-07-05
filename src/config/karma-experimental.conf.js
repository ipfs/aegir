'use strict'

const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const {fromRoot, hasFile} = require('./../utils')
const isWebworker = process.env.AEGIR_WEBWORKER === 'true'
const isProduction = process.env.NODE_ENV === 'production'
const userConfig = require('./user')()
const env = {
  TEST_DIR: JSON.stringify(fromRoot('test')),
  TEST_BROWSER_JS: hasFile('test', 'browser.js')
    ? JSON.stringify(fromRoot('test', 'browser.js'))
    : JSON.stringify('')
}
const karmaWebpackConfig = merge(webpackConfig({production: isProduction}), {
  entry: '',
  devtool: 'inline-source-map',
  output: {
    libraryTarget: 'var'
  },
  plugins: [
    new webpack.DefinePlugin(env)
  ]
})

const karmaConfig = {
  browsers: ['ChromeHeadless'],
  frameworks: isWebworker ? ['mocha-webworker'] : ['mocha'],
  basePath: process.cwd(),
  files: [
    {
      pattern: 'node_modules/aegir/src/config/karma-entry.js',
      included: !isWebworker
    },
    {
      pattern: 'test/fixtures/**/*',
      watched: false,
      served: true,
      included: false
    }
  ],

  preprocessors: {
    'node_modules/aegir/src/config/karma-entry.js': [ 'webpack', 'sourcemap' ]
  },

  client: {
    mochaWebWorker: {
      pattern: [
        'node_modules/aegir/src/config/karma-entry.js'
      ]
    }
  },

  webpack: karmaWebpackConfig,

  webpackMiddleware: {
    stats: 'errors-only'
  },

  reporters: [
    'mocha-own'
  ],

  junitReporter: {
    outputDir: process.cwd(),
    outputFile: isWebworker ? 'junit-report-webworker.xml' : 'junit-report-browser.xml',
    useBrowserName: false
  },

  mochaOwnReporter: {
    reporter: 'spec'
  },

  logLevel: karmaWebpackConfig.LOG_WARN,
  autoWatch: false,
  singleRun: true,
  colors: true,
  browserNoActivityTimeout: 50 * 1000
}

module.exports = (config) => {
  config.set(merge(karmaConfig, userConfig.karma))
}
