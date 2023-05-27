import kleur from 'kleur'
import merge from 'merge-options'
import { defaultBuildConfig } from '../config/default-build-config.js'
import { defaultTestConfig } from '../config/default-test-config.js'
import testCmd from '../test/index.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
By default browser tests run in Chromium headless.
Testing supports options forwarding with '--' for more info check https://github.com/hugomrdias/playwright-test#options, https://mochajs.org/#command-line-usage or https://github.com/jprichardson/electron-mocha#run-tests.
`

/** @type {CommandModule} */
export default {
  command: 'test',
  describe: 'Test your code in different environments',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.test, yargs))
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
        build: {
          alias: 'b',
          describe: 'Build the project before running the tests',
          type: 'boolean',
          default: defaultTestConfig.build
        },
        types: {
          type: 'boolean',
          describe: 'If a tsconfig.json is present in the project, run tsc.',
          default: defaultBuildConfig.types
        },
        target: {
          alias: 't',
          describe: 'In which target environment to execute the tests',
          array: true,
          choices: ['node', 'browser', 'webworker', 'electron-main', 'electron-renderer', 'react-native-android', 'react-native-ios'],
          default: defaultTestConfig.target
        },
        watch: {
          alias: 'w',
          describe: 'Watch files for changes and rerun tests',
          type: 'boolean',
          default: defaultTestConfig.watch
        },
        files: {
          alias: 'f',
          describe: 'Custom globs for files to test',
          array: true,
          default: defaultTestConfig.files
        },
        timeout: {
          describe: 'The default time a single test has to run',
          type: 'number',
          default: defaultTestConfig.timeout
        },
        grep: {
          alias: 'g',
          type: 'string',
          describe: 'Limit tests to those whose names match given pattern',
          default: defaultTestConfig.grep
        },
        bail: {
          alias: 'b',
          describe: 'Mocha should bail once a test fails',
          type: 'boolean',
          default: defaultTestConfig.bail
        },
        progress: {
          describe: 'Use progress reporters on mocha and karma',
          type: 'boolean',
          default: defaultTestConfig.progress
        },
        cov: {
          describe: 'Enable coverage output. Output is already in Istanbul JSON format and can be uploaded directly to codecov.',
          type: 'boolean',
          default: defaultTestConfig.cov
        },
        runner: {
          describe: 'The platform running the code. Important for differentiating between browser, electron, react-native, etc.',
          type: 'string',
          default: defaultTestConfig.runner
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    // temporarily disable code coverage on node 18
    if (argv.cov && process.version.startsWith('v18.')) {
      console.warn(kleur.red('!!! Temporarily disabling code coverage\n')) // eslint-disable-line no-console
      delete argv.cov
    }

    await testCmd.run({
      ...argv,
      bundle: false
    })
  }
}
