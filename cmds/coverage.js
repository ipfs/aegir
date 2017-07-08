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
    }
  },
  handler (argv) {
    coverage.run(argv).catch(onError)
  }
}
