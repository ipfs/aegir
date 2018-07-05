'use strict'
const resolveBin = require('resolve-bin')
const execa = require('execa')
const {fromAegir} = require('./../utils')
const bin = resolveBin.sync('webpack-cli')

module.exports = (argv) => {
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
    env: {NODE_ENV: process.env.NODE_ENV || 'production'},
    stdio: 'inherit'
  })
}
