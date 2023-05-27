import merge from 'merge-options'
import buildCmd from '../build/index.js'
import { defaultBuildConfig } from '../config/default-build-config.js'

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
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.build, yargs))
      .options({
        bundle: {
          type: 'boolean',
          describe: 'Build the JS standalone bundle.',
          default: defaultBuildConfig.bundle
        },
        bundlesize: {
          alias: 'b',
          type: 'boolean',
          describe: 'Analyse bundle size.',
          default: defaultBuildConfig.bundlesize
        },
        bundlesizeMax: {
          type: 'string',
          describe: 'Max threshold for the bundle size.',
          default: defaultBuildConfig.bundlesizeMax
        },
        types: {
          type: 'boolean',
          describe: 'If a tsconfig.json is present in the project, run tsc.',
          default: defaultBuildConfig.types
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
