'use strict'

const test = require('../src/test')
const onError = require('../src/error-handler')

module.exports = {
  command: 'test',
  desc: 'Test your code in different environments',
  builder: {
    target: {
      alias: 't',
      describe: 'In which target environment to execute the tests',
      type: 'array',
      choices: ['node', 'browser', 'webworker'],
      default: ['node', 'browser', 'webworker']
    },
    verbose: {
      alias: 'v',
      describe: 'Print verbose test output',
      default: false
    },
    watch: {
      describe: 'Watch files for changes and rerun tests (only available for browser based tests)',
      default: false
    }
  },
  handler (argv) {
    test.run(argv).catch(onError)
  }
}
