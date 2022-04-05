'use strict'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 */

const EPILOG = `
Removes the ./dist folder
`
module.exports = {
  command: 'clean',
  desc: 'Remove created build artifacts.',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
  },
  /**
   * @param {import("../types").GlobalOptions | undefined} argv
   */
  handler (argv) {
    const build = require('../clean')
    return build.run(argv)
  }
}
