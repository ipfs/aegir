import cleanCmd from '../clean.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Removes the ./dist folder
`

/** @type {CommandModule} */
export default {
  command: 'clean',
  describe: 'Remove created build artifacts.',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    return yargs
      .epilog(EPILOG)
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await cleanCmd.run(argv)
  }
}
