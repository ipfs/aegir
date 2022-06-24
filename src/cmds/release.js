import releaseCmd from '../release.js'
import { loadUserConfig } from '../config/user.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Release uses semantic-release (https://github.com/semantic-release/semantic-release#readme.
`

/** @type {CommandModule} */
export default {
  command: 'release',
  describe: 'Release using semantic-release',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .options({
        siblingDepUpdateMessage: {
          alias: 'm',
          type: 'string',
          describe: 'Automatically fix errors if possible.',
          default: userConfig.release.siblingDepUpdateMessage
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await releaseCmd.run(argv)
  }
}
