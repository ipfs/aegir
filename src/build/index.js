/* eslint-disable no-console */
'use strict'

const path = require('path')
const fs = require('fs')
const bytes = require('bytes')
const execa = require('execa')
const rimraf = require('rimraf')
const { fromAegir, gzipSize, pkg } = require('./../utils')
const userConfig = require('../config/user')

const config = userConfig()

module.exports = async (argv) => {
  const input = argv._.slice(1)
  const forwardOptions = argv['--'] ? argv['--'] : []
  const useBuiltinConfig = !forwardOptions.includes('--config')
  const progress = !forwardOptions.includes('--progress') && !process.env.CI ? ['--progress'] : []
  const webpackConfig = useBuiltinConfig
    ? ['--config', fromAegir('src/config/webpack.config.js')]
    : []

  // Clean dist
  rimraf.sync(path.join(process.cwd(), 'dist'))

  // Run webpack
  const webpack = await execa('webpack-cli', [
    ...webpackConfig,
    ...progress,
    ...input,
    ...forwardOptions
  ], {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'production',
      AEGIR_BUILD_ANALYZE: argv.bundlesize,
      AEGIR_NODE: argv.node
    },
    localDir: path.join(__dirname, '../..'),
    preferLocal: true,
    stdio: 'inherit'
  })

  if (argv.bundlesize) {
    const stats = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'dist/stats.json')))
    const gzip = await gzipSize(path.join(stats.outputPath, stats.assets[0].name))
    const maxsize = bytes(config.bundlesize.maxSize)
    const diff = gzip - maxsize
    console.log('Size:', bytes(gzip))

    if (diff > 0) {
      throw new Error(`${bytes(diff)} ${diff > 0 ? 'above' : 'below'} the limit of ${bytes(maxsize)}`)
    }
    console.log(`${bytes(Math.abs(diff))} ${diff > 0 ? 'above' : 'below'} the ${bytes(maxsize)} limit.`)
    console.log('Use http://webpack.github.io/analyse/ to load "./dist/stats.json".')
    console.log(`Check previous sizes in https://bundlephobia.com/result?p=${pkg.name}@${pkg.version}`)
  }
  return webpack
}
