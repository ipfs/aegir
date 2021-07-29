/* eslint-disable no-console */
'use strict'
const Listr = require('listr')
const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs-extra')
const pascalcase = require('pascalcase')
const bytes = require('bytes')
const { premove: del } = require('premove')
const { gzipSize, pkg, hasTsconfig, fromRoot, paths } = require('./../utils')
const tsCmd = require('../ts')
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
  const result = await esbuild.build(merge(
    {
      entryPoints: [fromRoot('src', argv.tsRepo ? 'index.ts' : 'index.js')],
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

/**
 * Build command
 *
 * @param {GlobalOptions & BuildOptions} argv
 */
const buildEsm = async (argv) => {
  const dist = path.join(process.cwd(), 'dist')
  // @ts-ignore no types
  const ipjs = await import('ipjs')

  await ipjs.default({
    dist,
    onConsole: (/** @type {any[]} */...args) => console.info.apply(console, args),
    cwd: process.cwd(),
    main: argv.esmMain,
    tests: argv.esmTests
  })
}

const tasks = new Listr([
  {
    title: 'Clean ./dist',
    task: async () => del(path.join(process.cwd(), 'dist'))
  },
  {
    title: 'Build ESM',
    enabled: ctx => {
      return pkg.type === 'module'
    },
    /**
     *
     * @param {GlobalOptions & BuildOptions} ctx
     * @param {Task} task
     */
    task: async (ctx, task) => {
      await buildEsm(ctx)
    }
  },
  {
    title: 'Bundle',
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
  },
  {
    title: 'Generate types',
    enabled: ctx => ctx.types && hasTsconfig,
    /**
     * @param {GlobalOptions & BuildOptions} ctx
     * @param {Task} task
     */
    task: async (ctx, task) => {
      await tsCmd({
        debug: ctx.debug,
        tsRepo: ctx.tsRepo,
        fileConfig: ctx.fileConfig,
        preset: 'types',
        include: ctx.fileConfig.ts.include,
        copyTo: ctx.fileConfig.ts.copyTo,
        copyFrom: ctx.fileConfig.ts.copyFrom
      })
    }
  }
], { renderer: 'verbose' })

module.exports = tasks
