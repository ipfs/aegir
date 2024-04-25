import { execa } from 'execa'
import kleur from 'kleur'
import { everyMonorepoProject, pipeOutput } from './utils.js'

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").ExecOptions} ExecOptions
 */

export default {
  /**
   * @param {GlobalOptions & ExecOptions & { command: string }} ctx
   */
  async run (ctx) {
    const forwardArgs = ctx['--'] ? ctx['--'] : []

    await everyMonorepoProject(async (project) => {
      console.info('') // eslint-disable-line no-console
      console.info(kleur.grey(`${project.manifest.name}:`), `> ${ctx.command}${forwardArgs.length > 0 ? ` ${forwardArgs.join(' ')}` : ''}`) // eslint-disable-line no-console

      try {
        const subprocess = execa(ctx.command, forwardArgs, {
          cwd: project.dir
        })
        pipeOutput(subprocess, project.manifest.name, ctx.prefix)
        await subprocess
      } catch (/** @type {any} */ err) {
        if (ctx.bail !== false) {
          throw err
        }

        console.info(kleur.red(err.stack)) // eslint-disable-line no-console
      }
    }, {
      concurrency: ctx.concurrency
    })
  }
}
