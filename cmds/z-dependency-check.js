/* eslint-disable no-console */
'use strict'

const ora = require('ora')
const depCheck = require('../src/dependency-check')

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/maxogden/dependency-check#cli-usage
`

const commandName = depCheck.commandNames[0]

module.exports = {
  command: `${commandName} [input...]`,
  aliases: depCheck.commandNames.filter(name => name !== commandName),
  desc: 'Run `dependency-check` cli with aegir defaults.',
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .example('aegir dependency-check -- --unused', 'To check unused packages in your repo.')
      .positional('input', {
        describe: 'Files to check',
        type: 'array',
        default: depCheck.defaultInput
      })
      .option('p', {
        alias: 'production-only',
        describe: 'Check production dependencies and paths only',
        type: 'boolean',
        default: false
      })
  },
  async handler (argv) {
    const spinner = ora('Checking dependencies').start()

    try {
      await depCheck(argv, process.argv)
      spinner.succeed()
    } catch (err) {
      spinner.fail()
      throw err
    }
  }
}
