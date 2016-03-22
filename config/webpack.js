'use strict'

const webpack = require('webpack')
const path = require('path')
const _ = require('lodash')

const pkg = require(path.resolve('package.json'))
const babel = require('./babel')

// e.g. peer-id -> PeerId
const libraryName = _.upperFirst(_.camelCase(pkg.name))

let specific

if (pkg.dignified && pkg.dignified.webpack) {
  specific = pkg.dignified.webpack
}

const shared = {
  entry: [
    require.resolve('babel-polyfill'),
    path.resolve('src/index.js')
  ],
  output: {
    filename: 'index.js',
    library: libraryName
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    alias: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify')
    }
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
      include: /node_modules\/(hoek|qs|wreck|boom|ipfs)/,
      loader: 'babel',
      query: babel
    }, {
      test: /\.json$/,
      loader: 'json'
    }],
    postLoaders: [{
      test: /\.js$/,
      loader: 'transform?brfs'
    }]
  },
  externals: {
    net: '{}',
    fs: '{}',
    tls: '{}',
    console: '{}',
    'require-dir': '{}'
  },
  node: {
    Buffer: true
  },
  timeout: 80000
}

const dev = _.defaultsDeep({}, shared, {
  devtool: 'eval',
  debug: true
}, specific)

const prod = _.defaultsDeep({}, shared, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false
    })
  ]
}, specific)

module.exports = {
  dev,
  prod
}
