import checkProjectCmd from '../check-project/index.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Makes sure package.json and other files have the correct contents for the current project type
`

/** @type {CommandModule} */
export default {
  command: 'check-project',
  describe: 'Ensure your project has the correct config.',
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
    await checkProjectCmd.run(argv)
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
  }
}
