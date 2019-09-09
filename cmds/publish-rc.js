'use strict'

module.exports = {
  command: 'publish-rc',
  desc: 'Publish a release candidate',
  builder: {
    branch: {
      describe: 'Where the latest good build is',
      type: 'string',
      default: 'build/last-successful'
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
    },
    type: {
      describe: 'What sort of update this will be',
      type: 'string',
      default: 'minor'
    }
  },
  handler (argv) {
    const publishRc = require('../src/publish-rc')
    const onError = require('../src/error-handler')
    publishRc(argv).catch(onError)
  }
}
