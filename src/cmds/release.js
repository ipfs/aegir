import merge from 'merge-options'
import { defaultReleaseConfig } from '../config/default-release-config.js'
import releaseCmd from '../release.js'

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
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.release, yargs))
      .options({
        siblingDepUpdateMessage: {
          alias: 'm',
          type: 'string',
          describe: 'The commit message to use when updating sibling dependencies',
          default: defaultReleaseConfig.siblingDepUpdateMessage
        },
        siblingDepUpdateName: {
          type: 'string',
          describe: 'The user name to use when updating sibling dependencies',
          default: defaultReleaseConfig.siblingDepUpdateName
        },
        siblingDepUpdateEmail: {
          type: 'string',
          describe: 'The email to use when updating sibling dependencies',
          default: defaultReleaseConfig.siblingDepUpdateEmail
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
