'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const {fromRoot, pkg, paths, getLibraryName} = require('../utils')
const userConfig = require('./user')()

const base = (env = {production: true}, argv) => {
  const filename = [
    pkg.name,
    env.production ? '.min' : null,
    '.js'
  ]
    .filter(Boolean)
    .join('')

  return {
    bail: Boolean(env.production),
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'cheap-module-source-map',
    entry: [userConfig.entry],
    output: {
      pathinfo: !env.production,
      path: fromRoot(paths.dist),
      filename: filename,
      sourceMapFilename: filename + '.map',
      library: getLibraryName(pkg.name),
      libraryTarget: 'umd',
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          // exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [require('./babelrc')],
              babelrc: false,
              cacheDirectory: true
            }
          }
        }
      ]
    },

    resolve: {
      alias: {
        '@babel/runtime': path.dirname(
          require.resolve('@babel/runtime/package.json')
        )
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.production ? 'production' : 'development'),
        'process.env.IS_WEBPACK_BUILD': JSON.stringify(true)
      })
    ],
    target: 'web',
    node: {
      console: false,
      global: true,
      process: true,
      __filename: 'mock',
      __dirname: 'mock',
      Buffer: true,
      setImmediate: true
    },
    performance: {
      hints: false
    },
    stats: true
  }
}

module.exports = (env, argv) => {
  return merge(base(env, argv), userConfig.webpack)
}
