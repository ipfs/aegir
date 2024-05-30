import alignVersions from '../align-versions.js'
import { loadUserConfig } from '../config/user.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

/** @type {CommandModule} */
export default {
  command: 'align-versions',
  describe: 'Align monorepo sibling dependency versions',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    const userConfig = await loadUserConfig()

    return yargs
      .options({
        siblingDepUpdateMessage: {
          alias: 'm',
          type: 'string',
          describe: 'The commit message to use when updating sibling dependencies',
          default: userConfig.release.siblingDepUpdateMessage
        },
        siblingDepUpdateName: {
          type: 'string',
          describe: 'The user name to use when updating sibling dependencies',
          default: userConfig.release.siblingDepUpdateName
        },
        siblingDepUpdateEmail: {
          type: 'string',
          describe: 'The email to use when updating sibling dependencies',
          default: userConfig.release.siblingDepUpdateEmail
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await alignVersions.run(argv)
  }
}
