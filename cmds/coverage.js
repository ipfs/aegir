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
      alias: 'p',
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
    }
  },
  handler (argv) {
    coverage.run(argv).catch(onError)
  }
}
