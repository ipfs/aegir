'use strict'

const webpack = require('webpack')
const path = require('path')

const babel = require('./babel')

const shared = {
  resolve: {
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    alias: {
      http: 'stream-http',
      https: 'https-browserify'
    }
  },
  resolveLoader: {
    modulesDirectories: [
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
      include: /node_modules\/(hoek|qs|wreck|boom)/,
      loader: 'babel',
      query: babel
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },
  externals: {
    net: '{}',
    fs: '{}',
    tls: '{}',
    console: '{}',
    'require-dir': '{}'
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
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
})

module.exports = {
  dev,
  prod
}
