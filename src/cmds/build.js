'use strict'

const { userConfig } = require('../config/user')

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 */
const EPILOG = `
Output files will go into a "./dist" folder.
`
module.exports = {
  command: 'build',
  desc: 'Builds a browser bundle and TS type declarations from the `src` folder.',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    yargs
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
   * @param {(import("../types").GlobalOptions & import("../types").BuildOptions) | undefined} argv
   */
  handler (argv) {
    const build = require('../build')
    return build.run(argv)
  }
}
