/* eslint-disable no-console */
'use strict'

const ora = require('ora')
const { userConfig } = require('../config/user')
const { check } = require('../dependency-check')
/**
 * @typedef {import("yargs").Argv} Argv
 */
const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/maxogden/dependency-check#cli-usage
`

module.exports = {
  command: 'dependency-check [input...]',
  aliases: ['dep-check', 'dep'],
  desc: 'Run `dependency-check` cli with aegir defaults.',
  /**
   * @param {Argv} yargs
   */
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .example('aegir dependency-check -- --unused', 'To check unused packages in your repo.')
      .example('aegir dependency-check -- --unused --ignore typescript', 'To check unused packages in your repo, ignoring typescript.')
      .positional('input', {
        describe: 'Files to check',
        type: 'string',
        array: true,
        default: userConfig.dependencyCheck.input
      })
      .option('p', {
        alias: 'production-only',
        describe: 'Check production dependencies and paths only',
        type: 'boolean',
        default: userConfig.dependencyCheck.productionOnly
      })
      .option('i', {
        alias: 'ignore',
        describe: 'Ignore these dependencies when considering which are used and which are not',
        array: true,
        default: userConfig.dependencyCheck.ignore
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    const spinner = ora('Checking dependencies').start()

    try {
      await check(argv)
      spinner.succeed()
    } catch (err) {
      spinner.fail()
      throw err
    }
  }
}
