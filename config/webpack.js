'use strict'

const path = require('path')
const upperFirst = require('lodash.upperfirst')
const camelCase = require('lodash.camelcase')
const merge = require('webpack-merge')

const pkg = require(path.resolve('package.json'))
let customConfig = {}
try {
  customConfig = require(path.resolve('.aegir.js'))
} catch (err) {
}
const babel = require('./babel')

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
    require.resolve('babel-polyfill'),
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
      test: /\.js$/,
      exclude: /node_modules|vendor/,
      loader: 'babel',
      query: babel
    }, {
      test: /\.js$/,
      include: /node_modules\/(hoek|qs|wreck|boom|ipfs|promisify-es|whatwg-fetch|node-fetch|isomorphic-fetch|db\.js)/,
      loader: 'babel',
      query: babel
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },
  node: {
    Buffer: true
  },
  plugins: []
}

const dev = merge(shared, {
  devtool: 'inline-source-map'
}, specific)

module.exports = dev
