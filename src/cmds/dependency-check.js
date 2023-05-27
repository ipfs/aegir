/* eslint-disable no-console */

import merge from 'merge-options'
import { defaultDependencyCheckConfig } from '../config/default-dependency-check-config.js'
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
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.dependencyCheck, yargs))
      .example('aegir dependency-check --unused', 'To check unused packages in your repo.')
      .example('aegir dependency-check --unused --ignore typescript', 'To check unused packages in your repo, ignoring typescript.')
      .option('i', {
        alias: 'ignore',
        describe: 'Ignore these dependencies when considering which are used and which are not',
        array: true,
        default: defaultDependencyCheckConfig.ignore
      })
      .option('u', {
        alias: 'unused',
        describe: 'Checks for unused dependencies',
        default: defaultDependencyCheckConfig.unused,
        type: 'boolean'
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await depCheck.run(argv)
  }
}
