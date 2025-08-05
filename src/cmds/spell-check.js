import spellCheck from '../spell-check.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Spelling is checked using cspell (https://cspell.org/)

Pass any cspell options as forward args
`

/** @type {CommandModule} */
export default {
  command: 'spell-check',
  aliases: [],
  describe: 'Run `spell-check` cli with aegir defaults.',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    return yargs
      .epilog(EPILOG)
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await spellCheck.run(argv)
  }
}
