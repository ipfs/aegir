'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const {fromRoot, pkg, paths, getLibraryName} = require('../utils')
const userConfig = require('./user')()
const isProduction = process.env.NODE_ENV === 'production'

const base = (env, argv) => {
  const filename = [
    pkg.name,
    isProduction ? '.min' : null,
    '.js'
  ]
    .filter(Boolean)
    .join('')

  return {
    bail: Boolean(isProduction),
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    entry: [userConfig.entry],
    output: {
      pathinfo: !isProduction,
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
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
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
  const external = typeof userConfig.webpack === 'function'
    ? userConfig.webpack(env, argv)
    : userConfig.webpack

  if (isProduction) {
    return [
      merge(
        base(env, argv),
        {
          output: {
            filename: `${pkg.name}.js`,
            sourceMapFilename: `${pkg.name}.js.map`
          },
          optimization: {
            minimizer: []
          }
        },
        external
      ),
      merge(
        base(env, argv),
        external
      )
    ]
  }

  return merge(
    base(env, argv),
    external
  )
}
