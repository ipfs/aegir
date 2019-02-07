'use strict'
const execa = require('execa')

module.exports = {
  command: 'dependency-check',
  aliases: ['dep-check', 'dep'],
  desc: 'Run `dependency-check` cli with aegir defaults.\nSupports options fowarding with `--` for more info check https://github.com/maxogden/dependency-check#cli-usage',
  handler (argv) {
    const input = argv._.slice(1)
    const fowardOptions = argv['--'] ? argv['--'] : []
    const defaults = input.length ? input : ['package.json', './test/**/*.js', './src/**/*.js']

    return execa('dependency-check', [
      ...defaults,
      ...fowardOptions
    ], {
      stdio: 'inherit'
    })
  }
}
