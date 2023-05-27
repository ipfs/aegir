import merge from 'merge-options'
import { defaultRunConfig } from '../config/default-run-config.js'
import runCmd from '../run.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `Example:

$ aegir run clean build
`

/** @type {CommandModule} */
export default {
  command: 'run <scripts..>',
  describe: 'Run one or more npm scripts in each project of a monorepo',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.run, yargs))
      .options({
        bail: {
          type: 'boolean',
          describe: '',
          default: defaultRunConfig.bail
        }
      })
      .positional('script', {
        array: true
      })
  },

  /**
   * @param {any} argv
   */
  async handler (argv) {
    await runCmd.run(argv)
  }
}
