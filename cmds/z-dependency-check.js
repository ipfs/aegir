/* eslint-disable no-console */
'use strict'
const path = require('path')
const execa = require('execa')
const ora = require('ora')

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/maxogden/dependency-check#cli-usage
`
const defaultInput = [
  'package.json',
  './test/**/*.js',
  './src/**/*.js',
  '!./test/fixtures/**/*.js'
]

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
    const input = argv._.slice(1)
    const forwardOptions = argv['--'] ? argv['--'] : []
    const defaults = input.length ? input : defaultInput

    const spinner = ora('Checking dependencies').start()
    await execa('dependency-check', [
      ...defaults,
      '--missing',
      ...forwardOptions
    ], {
      localDir: path.join(__dirname, '..'),
      preferLocal: true
    })
    spinner.succeed()
  }
}
