'use strict'
const { userConfig } = require('../config/user')
/**
 * @typedef {import("yargs").Argv} Argv
 */

const EPILOG = `
By default browser tests run in Chromium headless.
Testing supports options forwarding with '--' for more info check https://github.com/hugomrdias/playwright-test#options, https://mochajs.org/#command-line-usage or https://github.com/jprichardson/electron-mocha#run-tests.
`

module.exports = {
  command: 'test',
  desc: 'Test your code in different environments',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .example(
        'aegir test -t webworker',
        'Run tests in the browser inside a webworker.'
      )
      .example(
        'aegir test -t browser -- --browser firefox',
        'Tell `playwright-test` to run tests in firefox.'
      )
      .example(
        'aegir test -w -t browser -- --browser webkit --debug',
        'Debug tests with watch mode and tell `playwright-test` to open webkit in a non-headless mode.'
      )
      .example(
        'aegir test -t electron-renderer -- --interactive',
        'Debug electron renderer test with a persistent window.'
      )
      .example(
        'aegir test -t node --cov && npx nyc report',
        'Run test with coverage enabled and report to the terminal.'
      )
      .options({
        target: {
          alias: 't',
          describe: 'In which target environment to execute the tests',
          array: true,
          choices: ['node', 'browser', 'webworker', 'electron-main', 'electron-renderer', 'react-native-android', 'react-native-ios'],
          default: userConfig.test.target
        },
        watch: {
          alias: 'w',
          describe: 'Watch files for changes and rerun tests',
          type: 'boolean',
          default: userConfig.test.watch
        },
        files: {
          alias: 'f',
          describe: 'Custom globs for files to test',
          array: true,
          default: userConfig.test.files
        },
        timeout: {
          describe: 'The default time a single test has to run',
          type: 'number',
          default: userConfig.test.timeout
        },
        grep: {
          alias: 'g',
          type: 'string',
          describe: 'Limit tests to those whose names match given pattern'
        },
        bail: {
          alias: 'b',
          describe: 'Mocha should bail once a test fails',
          type: 'boolean',
          default: userConfig.test.bail
        },
        progress: {
          describe: 'Use progress reporters on mocha and karma',
          type: 'boolean',
          default: userConfig.test.progress
        },
        cov: {
          describe: 'Enable coverage output. Output is already in Istanbul JSON format and can be uploaded directly to codecov.',
          type: 'boolean',
          default: userConfig.test.cov
        }
      })
  },
  /**
   * @param {import("../types").TestOptions & import("../types").GlobalOptions} argv
   */
  handler (argv) {
    const test = require('../test')
    return test.run(argv)
  }
}
