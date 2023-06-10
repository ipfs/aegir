import { loadUserConfig } from '../config/user.js'
import lintCmd from '../lint.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Linting uses eslint (http://eslint.org/) and standard(https://github.com/feross/standard)
with some custom rules(https://github.com/ipfs/eslint-config-aegir) to enforce some more strictness.
`

/** @type {CommandModule} */
export default {
  command: 'lint',
  describe: 'Lint all project files',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .options({
        fix: {
          alias: 'f',
          type: 'boolean',
          describe: 'Automatically fix errors if possible.',
          default: userConfig.lint.fix
        },
        files: {
          array: true,
          describe: 'Files to lint.',
          default: userConfig.lint.files
        },
        silent: {
          type: 'boolean',
          describe: 'Disable eslint output.',
          default: userConfig.lint.silent
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await lintCmd.run(argv)
  }
}
