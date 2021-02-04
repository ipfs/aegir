/* eslint-disable no-console */
'use strict'
const esbuild = require('esbuild')
const path = require('path')
const pascalcase = require('pascalcase')
const bytes = require('bytes')
const { premove: del } = require('premove')
const { gzipSize, pkg, hasTsconfig, fromRoot, paths } = require('./../utils')
const tsCmd = require('../ts')
const { userConfig } = require('../config/user')
const merge = require('merge-options').bind({
  ignoreUndefined: true,
  concatArrays: true
})

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
  // Clean dist
  await del(path.join(process.cwd(), 'dist'))

  if (argv.bundle) {
    const outfile = await build(argv)

    if (argv.bundlesize) {
      // @ts-ignore
      if (userConfig.bundlesize && userConfig.bundlesize.maxSize) {
        throw new Error('Config property `bundlesize.maxSize` is deprecated, use `build.bundlesizeMax`!')
      }
      const gzip = await gzipSize(outfile)
      const maxsize = bytes(userConfig.build.bundlesizeMax)
      const diff = gzip - maxsize

      console.log('Use https://www.bundle-buddy.com/ to load "./dist/stats.json".')
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
      include: userConfig.ts.include,
      copyTo: userConfig.ts.copyTo,
      copyFrom: userConfig.ts.copyFrom
    })
  }
}

/**
 * Build command
 *
 * @param {GlobalOptions & BuildOptions} argv
 */
const build = async (argv) => {
  const outfile = path.join(paths.dist, 'index.js')
  await esbuild.build(merge(
    {
      entryPoints: [fromRoot('src', argv.tsRepo ? 'index.ts' : 'index.js')],
      bundle: true,
      format: 'iife',
      mainFields: ['browser', 'module', 'main'],
      sourcemap: argv.bundlesize,
      minify: true,
      globalName: pascalcase(pkg.name),
      metafile: argv.bundlesize ? path.join(paths.dist, 'stats.json') : undefined,
      outfile,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    },
    userConfig.build.config
  ))

  return outfile
}
