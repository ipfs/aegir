import { loadUserConfig } from '../config/user.js'
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
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .options({
        bail: {
          type: 'boolean',
          describe: '',
          default: userConfig.exec.bail
        },
        noPrefix: {
          type: 'boolean',
          describe: 'Don\'t prefix output with the package name',
          default: userConfig.exec.noPrefix
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
