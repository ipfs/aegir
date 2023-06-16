import { execa } from 'execa'
import kleur from 'kleur'
import { everyMonorepoProject } from './utils.js'

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").RunOptions} RunOptions
 */

export default {
  /**
   * @param {GlobalOptions & RunOptions & { scripts: string[] }} ctx
   */
  async run (ctx) {
    const scripts = ctx.scripts

    if (scripts == null || scripts.length === 0) {
      throw new Error('Please specify a script')
    }

    const forwardArgs = ctx['--'] == null ? [] : ['--', ...ctx['--']]

    await everyMonorepoProject(process.cwd(), async (project) => {
      for (const script of scripts) {
        if (project.manifest.scripts[script] == null) {
          continue
        }

        console.info('') // eslint-disable-line no-console
        console.info(kleur.grey(`${project.manifest.name} > npm run ${script} ${forwardArgs.join(' ')}`)) // eslint-disable-line no-console

        try {
          await execa('npm', ['run', script, ...forwardArgs], {
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
      }
    }, {
      concurrency: ctx.concurrency
    })
  }
}
