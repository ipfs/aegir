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
      describe: 'Watch files for changes and rerun tests',
      default: false
    },
    updateSnapshot: {
      alias: 'u',
      describe: 'Use this flag to re-record every snapshot that fails during this test run. (node only)'
    },
    files: {
      alias: 'f',
      describe: 'Custom globs for files to test',
      type: 'array',
      default: []
    },
    parallel: {
      alias: 'p',
      describe: 'Run tests in parallel (only available in node)',
      default: true
    },
    timeout: {
      describe: 'The default time a single test has to run',
      type: 'number',
      default: 5000
    },
    exit: {
      describe: 'force shutdown of the event loop after test run: mocha will call process.exit',
      default: true
    },
    cors: {
      describe: 'Enable or disable CORS (only available in browser runs)',
      default: true
    }
  },
  handler (argv) {
    test.run(argv).catch(onError)
  }
}
