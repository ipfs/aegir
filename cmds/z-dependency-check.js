'use strict'
const path = require('path')
const execa = require('execa')

const EPILOG = `
Supports options fowarding with '--' for more info check https://github.com/maxogden/dependency-check#cli-usage
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
  handler (argv) {
    const input = argv._.slice(1)
    const fowardOptions = argv['--'] ? argv['--'] : []
    const defaults = input.length ? input : ['package.json', './test/**/*.js', './src/**/*.js']

    return execa('dependency-check', [
      ...defaults,
      ...fowardOptions
    ], {
      stdio: 'inherit',
      localDir: path.join(__dirname, '..')
    })
  }
}
