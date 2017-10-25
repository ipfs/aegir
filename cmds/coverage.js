'use strict'

const coverage = require('../src/coverage')
const onError = require('../src/error-handler')

module.exports = {
  command: 'coverage',
  desc: 'Generate coverage report for node based tests',
  builder: {
    upload: {
      alias: 'u',
      describe: 'Upload the results to one of the providers',
      default: false
    },
    providers: {
      type: 'array',
      choices: Object.keys(coverage.providers),
      default: ['codecov']
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
    verbose: {
      alias: 'v',
      describe: 'Print verbose test output',
      default: false
    },
    ignore: {
      describe: 'Do not include passed in files in the coverage report',
      type: 'array',
      default: []
    },
    exit: {
      describe: 'force shutdown of the event loop after test run: mocha will call process.exit',
      default: true
    }
  },
  handler (argv) {
    coverage.run(argv).catch(onError)
  }
}
