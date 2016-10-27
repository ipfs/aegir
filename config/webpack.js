'use strict'

const path = require('path')
const upperFirst = require('lodash.upperfirst')
const camelCase = require('lodash.camelcase')
const merge = require('webpack-merge')
const webpack = require('webpack')

const pkg = require(path.resolve('package.json'))
let customConfig = {}
try {
  customConfig = require(path.resolve('.aegir.js'))
} catch (err) {
}

// e.g. peer-id -> PeerId
const libraryName = upperFirst(camelCase(pkg.name))

let custom1 = {}
let custom2 = {}

if (pkg.aegir && pkg.aegir.webpack) {
  custom1 = pkg.aegir.webpack
}

if (customConfig && customConfig.webpack) {
  custom2 = customConfig.webpack
}

const specific = merge(custom1, custom2)

const shared = {
  entry: [
    path.resolve('src/index.js')
  ],
  output: {
    filename: 'index.js',
    library: libraryName,
    path: 'dist'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ]
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ]
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }]
  },
  node: {
    Buffer: true
  },
  plugins: [],
  target: 'web'
}

const dev = merge(shared, {
  devtool: 'inline-source-map'
}, specific)

module.exports = dev
