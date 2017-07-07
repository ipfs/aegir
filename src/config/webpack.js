'use strict'

const path = require('path')
const _ = require('lodash')
const merge = require('webpack-merge')

let user = require('./user')

// e.g. peer-id -> PeerId
const libraryName = _.upperFirst(_.camelCase(user.pkg.name))
const specific = merge(user.customPkg.webpack || {}, user.customConfig.webpack || {})
const entry = user.entry || 'src/index.js'

const base = {
  entry: [
    path.resolve(entry)
  ],
  devtool: 'source-map',
  output: {
    filename: entry.split('/').pop(),
    library: libraryName,
    path: path.join(process.cwd(), '/dist')
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    alias: {
      // These are needed because node-libs-browser depends on outdated
      // versions
      //
      // Can be dropped once https://github.com/devongovett/browserify-zlib/pull/18
      // is shipped
      zlib: 'browserify-zlib',
      // Can be dropped once https://github.com/webpack/node-libs-browser/pull/41
      // is shipped
      http: 'stream-http'
    }
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [{
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  node: {
    Buffer: true
  },
  plugins: [],
  target: 'web',
  performance: {
    hints: false
  }
}

module.exports = merge(base, specific)
