'use strict'

module.exports = {
  command: 'commitlint',
  desc: 'Lint commits',
  builder: {
    from: {
      alias: 'f',
      describe: 'First commit to lint',
      default: 'master'
    },
    to: {
      alias: 't',
      describe: 'Last commit to lint',
      default: 'HEAD'
    }
  },
  handler (argv) {
    const lint = require('../src/commitlint')
    const onError = require('../src/error-handler')
    lint(argv).catch(onError)
  }
}
