'use strict'

const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const { fromRoot, hasFile, fromAegir } = require('../utils')
const isWebworker = process.env.AEGIR_WEBWORKER === 'true'
const isProduction = process.env.NODE_ENV === 'production'
const userConfig = require('./user')()
const env = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.IS_WEBPACK_BUILD': JSON.stringify(true),
  TEST_DIR: JSON.stringify(fromRoot('test')),
  TEST_BROWSER_JS: hasFile('test', 'browser.js')
    ? JSON.stringify(fromRoot('test', 'browser.js'))
    : JSON.stringify('')
}
const karmaWebpackConfig = merge(webpackConfig({ production: isProduction }), {
  entry: '',
  devtool: 'inline-source-map',
  output: {
    libraryTarget: 'var'
  },
  plugins: [
    new webpack.DefinePlugin(env)
  ]
})

const karmaConfig = (config) => {
  return {
    browsers: ['ChromeHeadless'],
    frameworks: isWebworker ? ['mocha-webworker'] : ['mocha'],
    basePath: process.cwd(),
    files: [
      {
        pattern: fromAegir('src/config/karma-entry.js'),
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
      [fromAegir('src/config/karma-entry.js')]: [ 'webpack', 'sourcemap' ]
    },

    client: {
      mochaWebWorker: {
        pattern: [
          '/absolute/' + fromAegir('src/config/karma-entry.js'),
          'src/config/karma-entry.js'
        ]
      }
    },

    webpack: karmaWebpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: [
      'mocha'
    ],

    mochaReporter: {
      output: 'autowatch'
    },

    junitReporter: {
      outputDir: process.cwd(),
      outputFile: isWebworker ? 'junit-report-webworker.xml' : 'junit-report-browser.xml',
      useBrowserName: false
    },

    logLevel: config.LOG_ERROR,
    autoWatch: false,
    singleRun: true,
    colors: true,
    browserNoActivityTimeout: 50 * 1000
  }
}

module.exports = (config) => {
  config.set(merge(karmaConfig(config), userConfig.karma))
}
