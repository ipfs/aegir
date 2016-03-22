'use strict'

const webpack = require('webpack')
const path = require('path')

const babel = require('./babel')

const shared = {
  entry: [
    require.resolve('babel-polyfill'),
    path.resolve('src/index.js')
  ],
  output: {
    filename: 'index.js'
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
      exclude: /node_modules/,
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

const dev = Object.assign({}, shared, {
  devtool: 'eval',
  debug: true
})

const prod = Object.assign({}, shared, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false
    })
  ]
})

module.exports = {
  dev,
  prod
}
