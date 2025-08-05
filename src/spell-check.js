import { execa } from 'execa'
import Listr from 'listr'

/**
 * @typedef {import('./types.js').GlobalOptions} GlobalOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 * @typedef {import("ts-node").TSError} TSError
 */

const tasks = new Listr(
  [
    {
      title: 'cspell-spell-check',
      /**
       * @param {GlobalOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const exec = 'cspell'
        const args = [
          process.env.CI ? '--no-color' : '--color'
        ]

        if (ctx['--']) {
          args.push(...ctx['--'])
        }

        // run cspell
        const proc = execa(exec, args, {
          preferLocal: true,
          stdio: 'pipe'
        })

        proc.stderr?.addListener('data', (data) => {
          process.stderr.write(data)
        })

        proc.stdout?.addListener('data', (data) => {
          process.stdout.write(data)
        })

        await proc
      }
    }
  ],
  {
    renderer: 'verbose'
  }
)

export default tasks
