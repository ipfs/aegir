'use strict'

const merge = require('webpack-merge')
const webpack = require('webpack')

const utils = require('../../utils')
const base = require('./base')
const user = require('../user')()

function webpackConfig () {
  return utils.getPkg().then((pkg) => {
    const libraryName = utils.getLibraryName(pkg.name)
    const userConfig = user.webpack
    const entry = user.entry

    return merge(base, {
      entry: [
        entry
      ],
      devtool: 'source-map',
      output: {
        filename: entry.split('/').pop(),
        library: libraryName,
        path: utils.getPathToDist()
      },
      plugins: [
        new webpack.DefinePlugin(utils.getEnv('production').stringified)
      ]
    }, userConfig)
  })
}

module.exports = webpackConfig
