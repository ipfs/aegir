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

/**
 * @param {any} arr1
 * @param {any} arr2
 */
const isDefaultInput = (arr1, arr2) =>
  JSON.stringify(arr1) === JSON.stringify(arr2)

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
        const input =
            ctx.productionOnly &&
              isDefaultInput(ctx.fileConfig.dependencyCheck.input, ctx.input)
              ? ctx.fileConfig.dependencyCheck.productionInput
              : ctx.input
        const noDev = ctx.productionOnly ? ['--no-dev'] : []
        const ignore = ctx.ignore
          .concat(ctx.fileConfig.dependencyCheck.ignore)
          .reduce((acc, i) => acc.concat('-i', i), /** @type {string[]} */ ([]))

        const args = [...input, '--missing', ...noDev, ...ignore]

        if (pkg.type === 'module') {
          // use detective-es6 for js, regular detective for cjs
          args.push(
            '--extensions', 'cjs:detective-cjs',
            '--extensions', 'js:detective-es6'
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
