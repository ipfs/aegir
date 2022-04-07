/* eslint-disable no-console */

import { loadUserConfig } from '../config/user.js'
import depCheck from '../dependency-check.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/maxogden/dependency-check#cli-usage
`

/** @type {CommandModule} */
export default {
  command: 'dependency-check [input...]',
  aliases: ['dep-check', 'dep'],
  describe: 'Run `dependency-check` cli with aegir defaults.',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .example('aegir dependency-check -- --unused', 'To check unused packages in your repo.')
      .example('aegir dependency-check -- --unused --ignore typescript', 'To check unused packages in your repo, ignoring typescript.')
      .positional('input', {
        describe: 'Files to check',
        type: 'string',
        array: true,
        default: userConfig.dependencyCheck.input
      })
      .option('p', {
        alias: 'production-only',
        describe: 'Check production dependencies and paths only',
        type: 'boolean',
        default: userConfig.dependencyCheck.productionOnly
      })
      .option('i', {
        alias: 'ignore',
        describe: 'Ignore these dependencies when considering which are used and which are not',
        array: true,
        default: userConfig.dependencyCheck.ignore
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await depCheck.run(argv)
  }
}
