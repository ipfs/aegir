'use strict'
const path = require('path')
const execa = require('execa')
const commitlintTravis = require('../src/checks/commitlint-travis')

const EPILOG = `
Supports options forwarding with '--' for more info check https://conventional-changelog.github.io/commitlint/#/reference-cli
`

module.exports = {
  command: 'commitlint',
  aliases: ['cl', 'commit'],
  desc: 'Run `commitlint` cli with aegir defaults.',
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .example('npx aegir commitlint -- -E HUSKY_GIT_PARAMS', 'To use inside a package.json as a Husky commit-msg hook.')
      .options({
        travis: {
          describe: 'Run `commitlint` in Travis CI mode.',
          boolean: true
        }
      })
  },
  handler (argv) {
    if (argv.travis) {
      return commitlintTravis()
    }

    const input = argv._.slice(1)
    const forwardOptions = argv['--'] ? argv['--'] : []
    return execa('commitlint', [
      '--extends',
      '@commitlint/config-conventional',
      ...input,
      ...forwardOptions
    ], {
      stdio: 'inherit',
      localDir: path.join(__dirname, '..')
    })
  }
}
