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
    const libraryName = user.library
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
      mode: env === 'production' ? 'production' : 'development',
      entry: [
        entry
      ],
      devtool: sourcemap,
      output: {
        filename: user.output.concat('.js'),
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
