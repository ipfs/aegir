import buildCmd from '../build/index.js'
import { loadUserConfig } from '../config/user.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Output files will go into a "./dist" folder.
`

/** @type {CommandModule} */
export default {
  command: 'build',
  describe: 'Builds a browser bundle and TS type declarations from the `src` folder.',
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
          describe: 'Analyze bundle size.',
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
    await buildCmd.run(argv)
  }
}
