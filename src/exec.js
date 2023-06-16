import { execa } from 'execa'
import kleur from 'kleur'
import { everyMonorepoProject } from './utils.js'

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").ExecOptions} ExecOptions
 */

export default {
  /**
   * @param {GlobalOptions & ExecOptions & { command: string }} ctx
   */
  async run (ctx) {
    const forwardOptions = ctx['--'] ? ctx['--'] : []

    await everyMonorepoProject(process.cwd(), async (project) => {
      console.info('') // eslint-disable-line no-console
      console.info(kleur.grey(`${project.manifest.name} > ${ctx.command} ${forwardOptions.join(' ')}`)) // eslint-disable-line no-console

      try {
        await execa(ctx.command, forwardOptions, {
          cwd: project.dir,
          stderr: 'inherit',
          stdout: 'inherit'
        })
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
