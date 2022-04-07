import { loadUserConfig } from '../config/user.js'
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
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .options({
        bundle: {
          type: 'boolean',
          describe: 'Build the JS standalone bundle.',
          default: userConfig.build.bundle
        },
        bundlesize: {
          alias: 'b',
          type: 'boolean',
          describe: 'Analyse bundle size.',
          default: userConfig.build.bundlesize
        },
        bundlesizeMax: {
          type: 'string',
          describe: 'Max threshold for the bundle size.',
          default: userConfig.build.bundlesizeMax
        },
        types: {
          type: 'boolean',
          describe: 'If a tsconfig.json is present in the project, run tsc.',
          default: userConfig.build.types
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
