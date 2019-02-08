'use strict'

const path = require('path')
const execa = require('execa')
const rimraf = require('rimraf')
const { fromAegir } = require('./../utils')

module.exports = (argv) => {
  const analyze = Boolean(process.env.AEGIR_BUILD_ANALYZE || argv.analyze)
  const input = argv._.slice(1)
  const fowardOptions = argv['--'] ? argv['--'] : []
  const useBuiltinConfig = !fowardOptions.includes('--config')
  const progress = !fowardOptions.includes('--progress') ? ['--progress'] : []
  const config = useBuiltinConfig
    ? ['--config', fromAegir('src/config/webpack.config.js')]
    : []

  // Clean dist
  rimraf.sync(path.join(process.cwd(), 'dist'))

  // Run webpack
  return execa('webpack-cli', [
    ...config,
    ...progress,
    ...input,
    ...fowardOptions
  ], {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'production',
      AEGIR_BUILD_ANALYZE: analyze || ''
    },
    localDir: path.join(__dirname, '../..'),
    stdio: 'inherit'
  })
}
