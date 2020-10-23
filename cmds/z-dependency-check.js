/* eslint-disable no-console */
'use strict'

const ora = require('ora')
const depCheck = require('../src/dependency-check')

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/maxogden/dependency-check#cli-usage
`

module.exports = {
  command: 'dependency-check',
  aliases: ['dep-check', 'dep'],
  desc: 'Run `dependency-check` cli with aegir defaults.',
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .example('aegir dependency-check -- --unused', 'To check unused packages in your repo.')
  },
  async handler (argv) {
    const spinner = ora('Checking dependencies').start()
    await depCheck(argv)
    spinner.succeed()
  }
}
