/* eslint-disable no-console */
import testDependantCmd from '../test-dependant/index.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").CommandModule} CommandModule
 */

/** @type {CommandModule} */
export default {
  command: 'test-dependant [repo]',
  describe: 'Run the tests of an module that depends on this module to see if the current changes have caused a regression',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    return yargs
      .options({
        repo: {
          describe: 'The dependant module\'s repo URL',
          type: 'string'
        },
        branch: {
          describe: 'A branch to use from the dependant repo',
          type: 'string'
        },
        moduleName: {
          describe: 'A branch to use from the dependant repo',
          type: 'string'
        },
        deps: {
          describe: 'Other dependencies to override, e.g. --deps=foo@1.5.0,bar@2.4.1',
          /**
           *
           * @param {string} val
           */
          coerce: (val) => {
            if (typeof val !== 'string') {
              return {}
            }

            /** @type {Record<string, string>} */
            const deps = {}

            for (const dep of val.split(',')) {
              const parts = dep.split('@')
              deps[parts[0]] = parts[1]
            }

            return deps
          },
          default: {}
        },
        scriptName: {
          describe: 'The script name to run',
          type: 'string',
          default: 'test'
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    try {
      await testDependantCmd(argv)
    } catch (/** @type {any} */ err) {
      console.info('-------------------------------------------------------------------')
      console.info('')
      console.info(err.message)
      console.info('')
      console.info('Dependant project has not been tested with updated dependencies')
      console.info('')
      console.info('-------------------------------------------------------------------')

      throw err
    }
  }
}
