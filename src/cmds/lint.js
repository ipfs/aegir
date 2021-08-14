'use strict'
const { userConfig } = require('../config/user')

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 */

const EPILOG = `
Linting uses eslint (http://eslint.org/) and standard(https://github.com/feross/standard)
with some custom rules(https://github.com/ipfs/eslint-config-aegir) to enforce some more strictness.
`

module.exports = {
  command: 'lint',
  desc: 'Lint all project files',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    yargs
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
   * @param {(import("../types").GlobalOptions & import("../types").LintOptions) | undefined} argv
   */
  handler (argv) {
    const lint = require('../lint')
    return lint.run(argv)
  }
}
