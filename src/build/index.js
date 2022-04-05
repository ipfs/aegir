/* eslint-disable no-console */
'use strict'
const Listr = require('listr')
const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs-extra')
const pascalcase = require('pascalcase')
const bytes = require('bytes')
const { gzipSize, pkg, hasTsconfig, hasFile, fromRoot, paths } = require('./../utils')
const execa = require('execa')
const merge = require('merge-options').bind({
  ignoreUndefined: true
})

/**
 * @typedef {import("../types").GlobalOptions} GlobalOptions
 * @typedef {import("../types").BuildOptions} BuildOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

/**
 * Build command
 *
 * @param {GlobalOptions & BuildOptions} argv
 */
const build = async (argv) => {
  const outfile = path.join(paths.dist, 'index.min.js')
  const globalName = pascalcase(pkg.name)
  const umdPre = `(function (root, factory) {(typeof module === 'object' && module.exports) ? module.exports = factory() : root.${globalName} = factory()}(typeof self !== 'undefined' ? self : this, function () {`
  const umdPost = `return ${globalName}}));`

  const tsIndex = fromRoot('src', 'index.ts')
  const jsIndex = fromRoot('src', 'index.js')
  const entryPoint = hasFile(tsIndex) ? tsIndex : jsIndex

  const result = await esbuild.build(merge(
    {
      entryPoints: [entryPoint],
      bundle: true,
      format: 'iife',
      conditions: ['production'],
      sourcemap: argv.bundlesize,
      minify: true,
      globalName,
      banner: { js: umdPre },
      footer: { js: umdPost },
      metafile: argv.bundlesize,
      outfile,
      define: {
        global: 'globalThis',
        'process.env.NODE_ENV': '"production"'
      }
    },
    argv.fileConfig.build.config
  ))

  if (result.metafile) {
    fs.writeJSONSync(path.join(paths.dist, 'stats.json'), result.metafile)
  }

  return outfile
}

const tasks = new Listr([
  {
    title: 'tsc',
    enabled: ctx => ctx.types && hasTsconfig,
    /**
     * @param {GlobalOptions & BuildOptions} ctx
     * @param {Task} task
     */
    task: async (ctx, task) => {
      await execa('tsc', {
        preferLocal: true,
        stdio: 'inherit'
      })
    }
  },
  {
    title: 'esbuild',
    enabled: ctx => ctx.bundle,
    /**
     *
     * @param {GlobalOptions & BuildOptions} ctx
     * @param {Task} task
     */
    task: async (ctx, task) => {
      const outfile = await build(ctx)

      if (ctx.bundlesize) {
        const gzip = await gzipSize(outfile)
        const maxsize = bytes(ctx.bundlesizeMax)
        const diff = gzip - maxsize

        task.output = 'Use https://www.bundle-buddy.com/ to load "./dist/stats.json".'
        task.output = `Check previous sizes in https://bundlephobia.com/result?p=${pkg.name}@${pkg.version}`

        if (diff > 0) {
          throw new Error(`${bytes(gzip)} (▲${bytes(diff)} / ${bytes(maxsize)})`)
        } else {
          task.output = `${bytes(gzip)} (▼${bytes(diff)} / ${bytes(maxsize)})`
        }
      }
    }
  }
], { renderer: 'verbose' })

module.exports = tasks
