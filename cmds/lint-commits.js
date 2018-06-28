'use strict'

module.exports = {
  command: 'lint-commits',
  desc: 'Lint commit messages',
  builder: {
    from: {
      alias: 'f',
      describe: 'The commit-ish to lint from',
      default: 'remotes/origin/master'
    },
    to: {
      alias: 't',
      describe: 'The commit-ish to lint to',
      default: 'HEAD'
    }
  },
  handler (argv) {
    const lintCommits = require('../src/lint-commits')
    const onError = require('../src/error-handler')
    lintCommits(argv).catch(onError)
  }
}
