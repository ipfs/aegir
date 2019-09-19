'use strict'

module.exports = {
  command: 'update-rc <branch>',
  desc: 'Update a release candidate',
  builder: {
    branch: {
      describe: 'Where the latest release branch is',
      type: 'string'
    },
    distTag: {
      describe: 'The dist tag to publish the rc as',
      type: 'string',
      default: 'next'
    },
    preId: {
      describe: 'What to call the rc',
      type: 'string',
      default: 'rc'
    }
  },
  handler (argv) {
    const publishRc = require('../src/update-rc')
    const onError = require('../src/error-handler')
    publishRc(argv).catch(onError)
  }
}
