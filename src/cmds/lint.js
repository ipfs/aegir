'use strict'
const { userConfig } = require('../config/user')
module.exports = {
  command: 'lint',
  desc: 'Lint all project files',
  builder: {
    fix: {
      alias: 'f',
      type: 'boolean',
      describe: 'Automatically fix errors if possible.',
      default: userConfig.lint.fix
    },
    files: {
      type: 'array',
      describe: 'Files to lint.',
      default: userConfig.lint.files
    },
    silent: {
      type: 'boolean',
      describe: 'Disable eslint output.',
      default: userConfig.lint.silent
    }
  },
  /**
   * @param {(import("../types").GlobalOptions & import("../types").LintOptions) | undefined} argv
   */
  handler (argv) {
    const lint = require('../lint')
    return lint.run(argv)
  }
}
