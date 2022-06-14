import path from 'path'
import { execa } from 'execa'
import merge from 'merge-options'
import { pkg } from './utils.js'
import { fileURLToPath } from 'url'
import Listr from 'listr'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import("listr").ListrTaskWrapper} Task
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").DependencyCheckOptions} DependencyCheckOptions
 */

const tasks = new Listr(
  [
    {
      title: 'dependency-check',
      /**
       * @param {GlobalOptions & DependencyCheckOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const forwardOptions = ctx['--'] ? ctx['--'] : []
        const input = ctx.input.length > 0 ? ctx.input : ctx.fileConfig.dependencyCheck.input
        const ignore = ctx.ignore
          .concat(ctx.fileConfig.dependencyCheck.ignore)
          .reduce((acc, i) => acc.concat('-i', i), /** @type {string[]} */ ([]))

        const args = [...input, '--missing', ...ignore]

        if (pkg.type === 'module') {
          // use detective-es6 for js, regular detective for cjs
          args.push(
            '--extensions', 'cjs:detective-cjs',
            '--extensions', 'js:detective-es6',
            '--extensions', 'ts:detective-typescript'
          )
        }

        await execa(
          'dependency-check',
          [...args, ...forwardOptions],
          merge(
            {
              localDir: path.join(__dirname, '..'),
              preferLocal: true
            }
          )
        )
      }
    },
    {
      title: 'dependency-check (production only)',
      /**
       * @param {GlobalOptions & DependencyCheckOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const forwardOptions = ctx['--'] ? ctx['--'] : []
        const input = ctx.input.length > 0 ? ctx.input : ctx.fileConfig.dependencyCheck.productionInput
        const ignore = ctx.ignore
          .concat(ctx.fileConfig.dependencyCheck.ignore)
          .reduce((acc, i) => acc.concat('-i', i), /** @type {string[]} */ ([]))

        const args = [...input, '--missing', '--no-dev', ...ignore]

        if (pkg.type === 'module') {
          // use detective-es6 for js, regular detective for cjs
          args.push(
            '--extensions', 'cjs:detective-cjs',
            '--extensions', 'js:detective-es6',
            '--extensions', 'ts:detective-typescript'
          )
        }

        await execa(
          'dependency-check',
          [...args, ...forwardOptions],
          merge(
            {
              localDir: path.join(__dirname, '..'),
              preferLocal: true
            }
          )
        )
      }
    },
    {
      title: 'dependency-check (unused)',
      /**
       * @param {GlobalOptions & DependencyCheckOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const forwardOptions = ctx['--'] ? ctx['--'] : []
        const input = ctx.input.length > 0 ? ctx.input : ctx.fileConfig.dependencyCheck.input
        const ignore = ctx.ignore
          .concat(ctx.fileConfig.dependencyCheck.ignore)
          .reduce((acc, i) => acc.concat('-i', i), /** @type {string[]} */ ([]))

        const args = [...input, '--unused', ...ignore]

        if (pkg.type === 'module') {
          // use detective-es6 for js, regular detective for cjs
          args.push(
            '--extensions', 'cjs:detective-cjs',
            '--extensions', 'js:detective-es6',
            '--extensions', 'ts:detective-typescript'
          )
        }

        await execa(
          'dependency-check',
          [...args, ...forwardOptions],
          merge(
            {
              localDir: path.join(__dirname, '..'),
              preferLocal: true
            }
          )
        )
      }
    },
    {
      title: 'dependency-check (unused, production only)',
      /**
       * @param {GlobalOptions & DependencyCheckOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const forwardOptions = ctx['--'] ? ctx['--'] : []
        const input = ctx.input.length > 0 ? ctx.input : ctx.fileConfig.dependencyCheck.productionInput
        const ignore = ctx.ignore
          .concat(ctx.fileConfig.dependencyCheck.ignore)
          .reduce((acc, i) => acc.concat('-i', i), /** @type {string[]} */ ([]))

        const args = [...input, '--no-dev', '--unused', ...ignore]

        if (pkg.type === 'module') {
          // use detective-es6 for js, regular detective for cjs
          args.push(
            '--extensions', 'cjs:detective-cjs',
            '--extensions', 'js:detective-es6',
            '--extensions', 'ts:detective-typescript'
          )
        }

        await execa(
          'dependency-check',
          [...args, ...forwardOptions],
          merge(
            {
              localDir: path.join(__dirname, '..'),
              preferLocal: true
            }
          )
        )
      }
    }
  ]
)

export default tasks
