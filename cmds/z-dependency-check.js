/* eslint-disable no-console */
'use strict'

const ora = require('ora')
const { check, commandNames, defaultInput } = require('../src/dependency-check')

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/maxogden/dependency-check#cli-usage
`

const commandName = commandNames[0]

module.exports = {
  command: `${commandName} [input...]`,
  aliases: commandNames.filter(name => name !== commandName),
  desc: 'Run `dependency-check` cli with aegir defaults.',
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .example('aegir dependency-check -- --unused', 'To check unused packages in your repo.')
      .example('aegir dependency-check -- --unused --ignore typescript', 'To check unused packages in your repo, ignoring typescript.')
      .positional('input', {
        describe: 'Files to check',
        type: 'array',
        default: defaultInput
      })
      .option('p', {
        alias: 'production-only',
        describe: 'Check production dependencies and paths only',
        type: 'boolean',
        default: false
      })
      .option('i', {
        alias: 'ignore',
        describe: 'Ignore these dependencies when considering which are used and which are not',
        type: 'array',
        default: []
      })
  },
  async handler (argv) {
    const spinner = ora('Checking dependencies').start()

    try {
      await check(argv, process.argv)
      spinner.succeed()
    } catch (err) {
      spinner.fail()
      throw err
    }
  }
}
