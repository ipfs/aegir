'use strict'

const lint = require('../src/lint')
const onError = require('../src/error-handler')

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
    lint(argv).catch(onError)
  }
}
