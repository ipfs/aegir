import { loadUserConfig } from '../config/user.js'
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
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .options({
        retries: {
          alias: 'r',
          type: 'number',
          describe: 'How many times to retry each publish',
          default: userConfig.releaseRc.retries
        },
        tag: {
          alias: 't',
          type: 'string',
          describe: 'Which tag to publish the version as',
          default: userConfig.releaseRc.tag
        },
        concurrency: {
          type: 'number',
          describe: 'How many modules to release at the same time',
          default: userConfig.releaseRc.concurrency
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
