'use strict'
const resolveBin = require('resolve-bin')
const execa = require('execa')
const { fromAegir } = require('./../utils')
const bin = resolveBin.sync('webpack-cli')
const rimraf = require('rimraf')
const path = require('path')

// Clean dist
rimraf.sync(path.join(process.cwd(), 'dist'))

// Run webpack
module.exports = (argv) => {
  const analyze = Boolean(process.env.AEGIR_BUILD_ANALYZE || argv.analyze)
  const input = argv._.slice(1)
  const useBuiltinConfig = !input.includes('--config')
  const config = useBuiltinConfig
    ? ['--config', fromAegir('src/config/webpack.config.js')]
    : []
  return execa(bin, [
    ...config,
    '--progress',
    ...input
  ], {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'production',
      AEGIR_BUILD_ANALYZE: analyze || ''
    },
    stdio: 'inherit'
  })
}
