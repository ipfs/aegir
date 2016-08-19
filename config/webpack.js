'use strict'

const webpack = require('webpack')
const path = require('path')
const _ = require('lodash')
const merge = require('webpack-merge')

const pkg = require(path.resolve('package.json'))
let customConfig = {}
try {
  customConfig = require(path.resolve('.aegir.js'))
} catch (err) {
}
const babel = require('./babel')

// e.g. peer-id -> PeerId
const libraryName = _.upperFirst(_.camelCase(pkg.name))

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
      include: /node_modules\/(hoek|qs|wreck|boom|ipfs|promisify-es)/,
      loader: 'babel',
      query: babel
    }, {
      test: /\.js$/,
      include: /node_modules\/cbor/,
      loader: 'babel',
      query: {
        plugins: [
          // All things supported by node >= 4.0
          'babel-plugin-transform-es2015-template-literals',
          'babel-plugin-transform-es2015-literals',
          'babel-plugin-transform-es2015-function-name',
          'babel-plugin-transform-es2015-arrow-functions',
          'babel-plugin-transform-es2015-block-scoped-functions',
          'babel-plugin-transform-es2015-classes',
          'babel-plugin-transform-es2015-object-super',
          'babel-plugin-transform-es2015-shorthand-properties',
          'babel-plugin-transform-es2015-duplicate-keys',
          'babel-plugin-transform-es2015-computed-properties',
          'babel-plugin-transform-es2015-for-of',
          // 'babel-plugin-transform-es2015-sticky-regex',
          // 'babel-plugin-transform-es2015-unicode-regex',
          'babel-plugin-check-es2015-constants',
          // 'babel-plugin-transform-es2015-spread',
          // 'babel-plugin-transform-es2015-parameters',
          // 'babel-plugin-transform-es2015-destructuring',
          'babel-plugin-transform-es2015-block-scoping',
          'babel-plugin-transform-es2015-typeof-symbol',
          // 'babel-plugin-transform-es2015-modules-commonjs',
          'babel-plugin-transform-regenerator'
        ].map((p) => require.resolve(p))
      }
    }, {
      test: /\.json$/,
      loader: 'json'
    }],
    preLoaders: [{
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
  timeout: 80000,
  plugins: [
    new webpack.DefinePlugin({'fs.writeSync': false})
  ]
}

const dev = merge(shared, {
  devtool: 'inline-source-map',
  debug: true
}, specific)

module.exports = dev
