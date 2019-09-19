'use strict'

module.exports = {
  command: 'update-release-branch-lockfiles <branch>',
  desc: 'Updates the lockfiles for the release branch',
  builder: {
    branch: {
      describe: 'Which branch to update',
      type: 'string'
    },
    message: {
      describe: 'The message to use when adding the shrinkwrap and yarn.lock file',
      type: 'string',
      default: 'chore: add lockfiles'
    }
  },
  handler (argv) {
    const cmd = require('../src/update-release-branch-lockfiles')
    const onError = require('../src/error-handler')
    cmd(argv).catch(onError)
  }
}
