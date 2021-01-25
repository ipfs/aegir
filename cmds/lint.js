'use strict'
const { userConfig } = require('../src/config/user')
module.exports = {
  command: 'lint',
  desc: 'Lint all project files',
  builder: {
    fix: {
      alias: 'f',
      type: 'boolean',
      describe: 'Automatically fix errors if possible',
      default: userConfig.lint.fix
    }
  },
  handler (argv) {
    const lint = require('../src/lint')
    return lint(argv)
  }
}
