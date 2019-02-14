'use strict'

const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const { fromRoot, hasFile } = require('../utils')
const userConfig = require('./user')()

const isProduction = process.env.NODE_ENV === 'production'
const isWebworker = process.env.AEGIR_WEBWORKER === 'true'

// Env to pass in the bundle with DefinePlugin
const env = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.IS_WEBPACK_BUILD': JSON.stringify(true),
  TEST_DIR: JSON.stringify(fromRoot('test')),
  TEST_BROWSER_JS: hasFile('test', 'browser.js')
    ? JSON.stringify(fromRoot('test', 'browser.js'))
    : JSON.stringify('')
}

// Webpack overrides for karma
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

const karmaConfig = (config, files, grep, progress) => {
  // TODO: check why bail doesn't work
  const mocha = {
    bail: false,
    grep
  }

  const karmaEntry = `${__dirname}/karma-entry.js`

  if (!files.length) {
    // only try to load *.spec.js if we aren't specifying custom files
    files.push(karmaEntry)
  }

  return {
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    frameworks: isWebworker ? ['mocha-webworker'] : ['mocha'],
    basePath: process.cwd(),
    files: files.map(f => {
      return {
        pattern: f,
        included: !isWebworker
      }
    }).concat([
      {
        pattern: 'test/fixtures/**/*',
        watched: false,
        served: true,
        included: false
      }
    ]),

    preprocessors: files.reduce((acc, f) => {
      acc[f] = ['webpack', 'sourcemap']
      return acc
    }, {}),

    client: {
      mocha,
      mochaWebWorker: {
        pattern: [
          ...files,
          'karma-entry.js'
        ],
        mocha
      }
    },

    webpack: karmaWebpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: [
      progress && 'progress',
      !progress && 'mocha-own',
      process.env.CI && 'junit'
    ].filter(Boolean),

    junitReporter: {
      outputDir: process.cwd(),
      outputFile: isWebworker ? 'junit-report-webworker.xml' : 'junit-report-browser.xml',
      useBrowserName: false
    },

    mochaOwnReporter: {
      reporter: 'spec'
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-junit-reporter',
      'karma-mocha',
      'karma-mocha-own-reporter',
      'karma-mocha-webworker',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],

    autoWatch: false,
    singleRun: true,
    colors: true,
    browserNoActivityTimeout: 50 * 1000
  }
}

module.exports = (config) => {
  var argv = require('yargs-parser')(process.argv.slice(2), { array: ['files-custom'], boolean: ['progress'] })
  config.set(merge(karmaConfig(config, argv.filesCustom, argv.grep, argv.progress), userConfig.karma))
}
