/* eslint-disable no-console */

import path from 'path'
import bytes from 'bytes'
import esbuild from 'esbuild'
import { execa } from 'execa'
import fs from 'fs-extra'
import Listr from 'listr'
import pascalCase from 'pascalcase'
import merge from '../utils/merge-options.js'
import { gzipSize, pkg, hasTsconfig, isTypescript, fromRoot, paths, findBinary } from './../utils.js'

const defaults = merge.bind({
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
  const globalName = pascalCase(pkg.name)
  const umdPre = `(function (root, factory) {(typeof module === 'object' && module.exports) ? module.exports = factory() : root.${globalName} = factory()}(typeof self !== 'undefined' ? self : this, function () {`
  const umdPost = `return ${globalName}}));`
  let entryPoint = fromRoot('src', 'index.js')

  if (isTypescript) {
    entryPoint = fromRoot('dist', 'src', 'index.js')
  }

  const result = await esbuild.build(defaults(
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
      await execa(findBinary('tsc'), {
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
        const maxSize = bytes(ctx.bundlesizeMax)

        if (maxSize == null) {
          throw new Error(`Could not parse bytes from "${ctx.bundlesizeMax}"`)
        }

        const diff = gzip - maxSize

        task.output = 'Use https://esbuild.github.io/analyze/ to load "./dist/stats.json".'

        if (diff > 0) {
          throw new Error(`${bytes(gzip)} (▲${bytes(diff)} / ${bytes(maxSize)})`)
        } else {
          task.output = `${bytes(gzip)} (▼${bytes(diff)} / ${bytes(maxSize)})`
        }
      }
    }
  }
], { renderer: 'verbose' })

export default tasks
