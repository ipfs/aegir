import merge from 'merge-options'
import { defaultExecConfig } from '../config/default-exec-config.js'
import execCmd from '../exec.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `Example:

$ aegir exec david -- update
`

/** @type {CommandModule} */
export default {
  command: 'exec <command>',
  describe: 'Run a command in each project of a monorepo',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.exec, yargs))
      .options({
        bail: {
          type: 'boolean',
          describe: '',
          default: defaultExecConfig.bail
        }
      })
  },

  /**
   * @param {any} argv
   */
  async handler (argv) {
    await execCmd.run(argv)
  }
}
