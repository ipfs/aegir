'use strict'

const utils = require('../../utils')

module.exports = {
  devtool: 'source-map',
  output: {},
  resolve: {
    modules: [
      'node_modules',
      utils.getPathToNodeModules()
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
      utils.getPathToNodeModules()
    ],
    moduleExtensions: ['-loader']
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
