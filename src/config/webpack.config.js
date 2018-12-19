'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StatsPlugin = require('stats-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { fromRoot, pkg, paths, getLibraryName } = require('../utils')
const userConfig = require('./user')()
const isProduction = process.env.NODE_ENV === 'production'

const base = (env, argv) => {
  const filename = [
    'index',
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
          oneOf: [
            {
              test: /\.js$/,
              include: fromRoot(paths.src),
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: [require('./babelrc')],
                  babelrc: false,
                  cacheDirectory: true
                }
              }
            },
            {
              test: /\.js$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: [require('./babelrc')],
                  babelrc: false,
                  cacheDirectory: true,
                  sourceMaps: false
                }
              }
            }
          ]
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
    optimization: {
      minimize: isProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false
            }
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: true
        })
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.IS_WEBPACK_BUILD': JSON.stringify(true)
      })
    ],
    target: 'web',
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
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
    stats: 'minimal'
  }
}

module.exports = (env, argv) => {
  const external = typeof userConfig.webpack === 'function'
    ? userConfig.webpack(env, argv)
    : userConfig.webpack

  if (process.env.AEGIR_BUILD_ANALYZE) {
    return merge(
      base(env, argv),
      {
        plugins: [
          new BundleAnalyzerPlugin(),
          new StatsPlugin('stats.json')
        ],
        profile: true
      },
      external
    )
  }
  if (isProduction) {
    return [
      merge(
        base(env, argv),
        {
          output: {
            filename: 'index.js',
            sourceMapFilename: 'index.js.map'
          },
          optimization: {
            minimize: false
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
    {
      output: {
        filename: 'index.js',
        sourceMapFilename: 'index.js.map'
      },
      optimization: {
        minimize: false
      }
    },
    external
  )
}
