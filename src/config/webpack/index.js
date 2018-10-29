'use strict'

const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const debug = require('debug')('aegir:webpack')

const utils = require('../../utils')
const base = require('./base')
const user = require('../user')()

const devtool = {
  development: 'source-map',
  production: 'source-map',
  test: 'inline-source-map'
}

const getDevtool = (env) => {
  const d = devtool[env]
  if (!d) {
    const jsonStr = JSON.stringify(devtool, null, 2)
    throw new Error(`Could not find devtool for '${env}' in ${jsonStr}`)
  }
  return d
}

function webpackConfig (env) {
  debug('Running webpack with env', env)
  if (!env) {
    throw new Error(`Missing argument 'env' when calling webpackConfig`)
  }

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

    const mode = env === 'production' ? 'production' : 'development'
    return merge(base, {
      mode: mode,
      entry: [
        entry
      ],
      devtool: getDevtool(env),
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
