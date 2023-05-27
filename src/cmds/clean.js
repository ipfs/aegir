import cleanCmd from '../clean.js'
import { defaultCleanConfig } from '../config/default-clean-config.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Removes the ./dist folder
`

/** @type {CommandModule} */
export default {
  command: 'clean [files..]',
  describe: 'Remove created build artifacts.',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    return yargs
      .epilog(EPILOG)
      .positional('files', {
        array: true,
        default: defaultCleanConfig.files
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await cleanCmd.run(argv)
  }
}
