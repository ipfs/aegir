'use strict'
const commitlintTravis = require('../src/checks/commitlint-travis')

module.exports = {
  command: 'check [cmd]',
  desc: 'Array of checks to run in a repo.',
  builder: {
    cmd: {
      describe: 'Check command to run.',
      default: 'lint',
      choices: ['lint', 'commitlint', 'commitlint-travis']
    }
  },
  handler (argv) {
    switch (argv.cmd) {
      case 'commitlint-travis':
        return commitlintTravis()
      default:
        console.error('Command not supported. Run `aegir check --help` for help.')
        break
    }
  }
}
