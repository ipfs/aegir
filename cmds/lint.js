'use strict'

const formatter = require('eslint').CLIEngine.getFormatter()

const lint = require('../src/lint.js')

module.exports = {
  command: 'lint',
  desc: 'Lint all project files',
  builder: {
    fix: {
      alias: 'f',
      describe: 'Automatically fix errors if possible',
      default: false
    }
  },
  handler (argv) {
    const report = lint(argv)
    console.log(formatter(report.results))
  }
}
