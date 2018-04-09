'use strict'

const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const utils = require('../../utils')
const base = require('./base')
const user = require('../user')()

function webpackConfig (env) {
  env = env || 'production'

  return utils.getPkg().then((pkg) => {
    const libraryName = utils.getLibraryName(pkg.name)
    const userConfig = user.webpack
    const entry = user.entry
    const environment = utils.getEnv(env).stringified
    const testDir = path.join(process.cwd(), 'test')
    environment.TEST_DIR = JSON.stringify(testDir)
    const browserJs = path.join(testDir, 'browser.js')
    if (fs.existsSync(browserJs)) {
      environment.TEST_BROWSER_JS = JSON.stringify(browserJs)
    } else {
      environment.TEST_BROWSER_JS = JSON.stringify('')
    }
    const sourcemap = env === 'test' ? 'inline-source-map' : 'source-map'

    return merge(base, {
      entry: [
        entry
      ],
      devtool: sourcemap,
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }]
      },
      output: {
        filename: path.basename(entry),
        library: libraryName,
        path: utils.getPathToDist()
      },
      plugins: [
        new webpack.DefinePlugin(environment)
      ]
    }, userConfig)
  })
}

module.exports = webpackConfig
