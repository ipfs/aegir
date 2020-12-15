'use strict'

const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const webpackConfig = require('./webpack.config')
const { fromRoot, hasFile } = require('../utils')
const userConfig = require('./user')()
const isTSEnable = process.env.AEGIR_TS === 'true'
const isWebworker = process.env.AEGIR_RUNNER === 'webworker'

// Env to pass in the bundle with DefinePlugin
const env = {
  TS_ENABLED: process.env.AEGIR_TS,
  'process.env': JSON.stringify(process.env),
  TEST_DIR: JSON.stringify(fromRoot('test')),
  TEST_BROWSER_JS: hasFile('test', isTSEnable ? 'browser.ts' : 'browser.js')
    ? JSON.stringify(fromRoot('test', isTSEnable ? 'browser.ts' : 'browser.js'))
    : JSON.stringify('')
}

// Webpack overrides for karma
const karmaWebpackConfig = merge.strategy({ plugins: 'replace' })(webpackConfig(), {
  entry: '',
  plugins: [
    new webpack.DefinePlugin(env)
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|ts)$/,
            include: fromRoot('test'),
            use: {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [require('./babelrc')()],
                babelrc: false,
                cacheDirectory: true
              }
            }
          }
        ]
      }
    ]
  }
})

const karmaConfig = (config, argv) => {
  const files = argv.filesCustom
  const mocha = {
    reporter: 'spec',
    timeout: argv.timeout ? Number(argv.timeout) : 5000,
    bail: argv.bail,
    grep: argv.grep,
    invert: argv.invert
  }

  const karmaEntry = path.join(__dirname, 'karma-entry.js')

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
    files: files
      .map(f => {
        return {
          pattern: f,
          included: !isWebworker
        }
      })
      .concat([
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
      argv.progress && 'progress',
      !argv.progress && 'mocha'
    ].filter(Boolean),

    mochaReporter: {
      output: 'autowatch',
      showDiff: true
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
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
  const argv = require('yargs-parser')(process.argv.slice(2), {
    array: ['files-custom'],
    boolean: ['progress', 'bail'],
    string: ['timeout']
  })
  config.set(merge(karmaConfig(config, argv), userConfig.karma))
}
