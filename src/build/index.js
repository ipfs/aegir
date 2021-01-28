/* eslint-disable no-console */
'use strict'

const path = require('path')
const { readJsonSync } = require('fs-extra')
const bytes = require('bytes')
const execa = require('execa')
const { premove: del } = require('premove')
const { fromAegir, gzipSize, pkg, hasTsconfig } = require('./../utils')
const tsCmd = require('../ts')
const { userConfig } = require('../config/user')

/**
 * @typedef {import("../types").GlobalOptions} GlobalOptions
 * @typedef {import("../types").BuildOptions} BuildOptions
 */

/**
 * Build command
 *
 * @param {GlobalOptions & BuildOptions} argv
 */
module.exports = async (argv) => {
  const input = argv._.slice(1)
  const forwardOptions = argv['--'] ? argv['--'] : []
  const useBuiltinConfig = !forwardOptions.includes('--config')
  const progress = !forwardOptions.includes('--progress') && !process.env.CI ? ['--progress'] : []
  const webpackConfig = useBuiltinConfig
    ? ['--config', fromAegir('src/config/webpack.config.js')]
    : []

  // Clean dist
  await del(path.join(process.cwd(), 'dist'))

  if (argv.bundle) {
    // Run webpack
    await execa('webpack-cli', [
      ...webpackConfig,
      ...progress,
      ...input,
      ...forwardOptions
    ], {
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        AEGIR_BUILD_ANALYZE: argv.bundlesize ? 'true' : 'false',
        AEGIR_NODE: argv.node ? 'true' : 'false',
        AEGIR_TS: argv.tsRepo ? 'true' : 'false'
      },
      localDir: path.join(__dirname, '../..'),
      preferLocal: true,
      stdio: 'inherit'
    })

    if (argv.bundlesize) {
      // @ts-ignore
      if (userConfig.bundlesize?.maxSize) {
        throw new Error('Config property `bundlesize.maxSize` is deprecated, use `build.bundlesizeMax`!')
      }
      const stats = readJsonSync(path.join(process.cwd(), 'dist/stats.json'))
      const gzip = await gzipSize(path.join(stats.outputPath, stats.assets[0].name))
      const maxsize = bytes(userConfig.build.bundlesizeMax)
      const diff = gzip - maxsize

      console.log('Use http://webpack.github.io/analyse/ to load "./dist/stats.json".')
      console.log(`Check previous sizes in https://bundlephobia.com/result?p=${pkg.name}@${pkg.version}`)

      if (diff > 0) {
        throw new Error(`${bytes(gzip)} (▲${bytes(diff)} / ${bytes(maxsize)})`)
      } else {
        console.log(`${bytes(gzip)} (▼${bytes(diff)} / ${bytes(maxsize)})`)
      }
    }
  }

  if (argv.types && hasTsconfig) {
    await tsCmd({
      ...argv,
      preset: 'types',
      include: userConfig.ts.include
    })
  }
}
