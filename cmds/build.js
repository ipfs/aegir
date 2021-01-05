'use strict'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 */
const EPILOG = `
Output files will go into a "./dist" folder.
Supports options forwarding with '--' for more info check https://webpack.js.org/api/cli/
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
          default: true
        },
        bundlesize: {
          alias: 'b',
          type: 'boolean',
          describe: 'Analyse bundle size. Default threshold is 100kB, you can override that in `.aegir.js` with the property `bundlesize.maxSize`.',
          default: false
        },
        types: {
          type: 'boolean',
          describe: 'Build the Typescripts type declarations.',
          default: true
        }
      })
  },
  /**
   *
   * @param {Arguments} argv
   */
  handler (argv) {
    const build = require('../src/build')
    return build(argv)
  }
}
