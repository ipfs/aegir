'use strict'

const path = require('path')
const upperFirst = require('lodash.upperfirst')
const camelCase = require('lodash.camelcase')
const merge = require('webpack-merge')

let user = require('./user')

// e.g. peer-id -> PeerId
const libraryName = upperFirst(camelCase(user.pkg.name))
const specific = merge(user.customPkg || {}, user.customPkg || {})
const entry = user.entry || 'src/index.js'

const shared = {
  entry: [
    path.resolve(entry)
  ],
  output: {
    filename: entry.split('/').pop(),
    library: libraryName,
    path: 'dist'
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
      zlib: 'browserify-zlib-next',
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

const dev = merge(shared, {
  devtool: 'inline-source-map'
}, specific)

module.exports = dev
