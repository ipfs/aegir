import { loadUserConfig } from '../config/user.js'
import runCmd from '../run.js'
import { listWorkspaces } from '../utils.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `Example:

$ aegir run clean build
`

/** @type {CommandModule} */
export default {
  command: 'run <scripts..>',
  describe: 'Run one or more npm scripts in each project of a monorepo',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .options({
        bail: {
          type: 'boolean',
          describe: '',
          default: userConfig.run.bail
        },
        prefix: {
          type: 'boolean',
          describe: 'Prefix output with the package name',
          default: userConfig.run.prefix
        },
        concurrency: {
          type: 'number',
          describe: 'How many scripts to run at the same time',
          default: userConfig.run.concurrency
        },

        workspaces: {
          // an array of strings
          array: true,
          describe: 'Run the script in a specific workspace',
          default: await listWorkspaces(process.cwd()),
          alias: ['workspace', 'roots']
        }
      })
      .positional('script', {
        array: true
      })
  },

  /**
   * @param {any} argv
   */
  async handler (argv) {
    await runCmd.run(argv)
  }
}
