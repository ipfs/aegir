'use strict'

module.exports = {
  command: 'test-external <name> <repo>',
  desc: 'Run the tests of an external module, then upgrade IPFS/http client to the branch version and run them again',
  builder: {
    name: {
      describe: 'The external module\'s name',
      type: 'string'
    },
    repo: {
      describe: 'The external module\'s repo URL',
      type: 'string'
    },
    branch: {
      describe: 'A branch to use from the external repo',
      type: 'string'
    }
  },
  handler (argv) {
    const cmd = require('../src/test-external')
    const onError = require('../src/error-handler')
    cmd(argv).catch(onError)
  }
}
