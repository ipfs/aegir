import merge from 'merge-options'
import { defaultReleaseRcConfig } from '../config/default-release-rc-config.js'
import releaseRcCmd from '../release-rc.js'

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
  command: 'release-rc',
  describe: 'Release an RC version of the current module or monorepo',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.releaseRc, yargs))
      .options({
        retries: {
          alias: 'r',
          type: 'number',
          describe: 'How many times to retry each publish',
          default: defaultReleaseRcConfig.retries
        },
        tag: {
          alias: 't',
          type: 'string',
          describe: 'Which tag to publish the version as',
          default: defaultReleaseRcConfig.tag
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await releaseRcCmd.run(argv)
  }
}
