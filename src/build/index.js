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
 * @typedef {import('../types.js').GlobalOptions} GlobalOptions
 * @typedef {import('../types.js').BuildOptions} BuildOptions
 * @typedef {import('listr').ListrTaskWrapper} Task
 */

/**
 * Build command
 *
 * @param {GlobalOptions & BuildOptions} argv
 */
const build = async (argv) => {
  const globalName = pascalCase(pkg.name)
  const umdPre = `(function (root, factory) {(typeof module === 'object' && module.exports) ? module.exports = factory() : root.${globalName} = factory()}(typeof self !== 'undefined' ? self : this, function () {`
  const umdPost = `return ${globalName}}));`
  let entryPoint = fromRoot('src', 'index.js')

  if (isTypescript) {
    entryPoint = fromRoot('dist', 'src', 'index.js')
  }

  /** @type {esbuild.BuildOptions} */
  const config = defaults({
    bundle: true,
    format: 'iife',
    conditions: ['production'],
    sourcemap: true,
    minify: true,
    globalName,
    banner: { js: umdPre },
    footer: { js: umdPost },
    metafile: true,
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': '"production"'
    }
  }, argv.fileConfig.build.config)

  // use default single-file build
  if (config.entryPoints == null) {
    config.entryPoints = [entryPoint]
    config.outfile = path.join(paths.dist, 'index.min.js')
  }

  const entryPoints = Array.isArray(config.entryPoints) ? config.entryPoints : Object.keys(config.entryPoints)

  // support multi-output-file build
  if (entryPoints.length > 1) {
    delete config.outfile

    if (config.outdir == null) {
      config.outdir = 'dist'
    }
  }

  const result = await esbuild.build(config)

  if (result.metafile && argv.bundlesize) {
    fs.writeJSONSync(path.join(paths.dist, 'stats.json'), result.metafile)
  }

  return result.metafile?.outputs
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
      const outputs = await build(ctx)

      if (ctx.bundlesize && outputs != null) {
        task.output = 'Use https://esbuild.github.io/analyze/ to load "./dist/stats.json".'

        const maxSizes = typeof ctx.bundlesizeMax === 'string'
          ? {
              'dist/index.min.js': ctx.bundlesizeMax
            }
          : ctx.bundlesizeMax

        for (const file of Object.keys(outputs)) {
          if (file.endsWith('.map')) {
            continue
          }

          if (maxSizes[file] == null) {
            task.output = `Size for ${file} missing from bundlesizeMax in .aegir.js`
            continue
          }

          const gzip = await gzipSize(file)
          const maxSize = bytes(maxSizes[file])

          if (maxSize == null) {
            throw new Error(`Could not parse bytes from "${ctx.bundlesizeMax}"`)
          }

          const diff = gzip - maxSize

          if (diff > 0) {
            throw new Error(`${file} ${bytes(gzip)} (▲${bytes(diff)} / ${bytes(maxSize)})`)
          } else {
            task.output = `${file} ${bytes(gzip)} (▼${bytes(diff)} / ${bytes(maxSize)})`
          }
        }
      }
    }
  }
], { renderer: 'verbose' })

export default tasks
