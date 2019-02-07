'use strict'
const commitlintTravis = require('../src/checks/commitlint-travis')
// const resolveBin = require('resolve-bin')
const execa = require('execa')

module.exports = {
  command: 'commitlint',
  aliases: ['cl', 'commit'],
  desc: 'Run `commitlint` cli with aegir defaults.\nSupports options fowarding with `--` for more info check https://conventional-changelog.github.io/commitlint/#/reference-cli',
  builder: {
    travis: {
      describe: 'Run `commitlint` in Travis CI mode.',
      boolean: true
    }
  },
  handler (argv) {
    if (argv.travis) {
      return commitlintTravis()
    }

    const input = argv._.slice(1)
    const fowardOptions = argv['--'] ? argv['--'] : []
    return execa('commitlint', [
      '--extends',
      '@commitlint/config-conventional',
      ...input,
      ...fowardOptions
    ], {
      stdio: 'inherit'
    })
  }
}
