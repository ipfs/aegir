'use strict'

const path = require('path')
const execa = require('execa')
const merge = require('merge-options')

/** @typedef { import("execa").Options} ExecaOptions */
/** @typedef { import("execa").ExecaChildProcess} ExecaChildProcess */

const defaultInput = [
  'package.json',
  '.aegir.js*',
  './test/**/*.js',
  './src/**/*.js',
  '!./test/fixtures/**/*.js'
]

const commandNames = ['dependency-check', 'dep-check', 'dep']

/**
 * Returns true if the user invoked the command with non-flag or
 * optional args
 *
 * @param {Array} input - input files maybe passed by the user, maybe defaults
 * @param {Array} processArgs - process.argv or similar
 * @returns {boolean}
 */
const hasPassedFileArgs = (input, processArgs) => {
  // if any of the passed paths are not in the process.argv used to invoke
  // this command, we have been passed defaults and not user input
  for (const path of input) {
    if (!processArgs.includes(path)) {
      return false
    }
  }

  return true
}

/**
 * Check dependencies
 *
 * @param {object} argv - Command line arguments passed to the process.
 * @param {Array} processArgs - Unparsed command line arguments used to start the process
 * @param {ExecaOptions} execaOptions - execa options.
 * @returns {ExecaChildProcess} - Child process that does dependency check.
 */
const check = (argv = { _: [], input: [], ignore: [] }, processArgs = [], execaOptions) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  let input = argv.input
  const ignore = argv.ignore

  if (argv.productionOnly) {
    if (!hasPassedFileArgs(input, processArgs)) {
      input = [
        'package.json',
        './src/**/*.js'
      ]
    }

    forwardOptions.push('--no-dev')
  }

  if (ignore.length) {
    // this allows us to specify ignores on a per-module basis while also orchestrating the command across multiple modules.
    //
    // e.g. npm script in package.json:
    // "dependency-check": "aegir dependency-check -i cross-env",
    //
    // .travis.yml:
    // lerna run dependency-check -- -p -- --unused
    //
    // results in the following being run in the package:
    // aegir dependency-check -i cross-env -p -- --unused
    ignore.forEach(i => {
      forwardOptions.push('-i', i)
    })
  }

  return execa('dependency-check',
    [
      ...input,
      '--missing',
      ...forwardOptions
    ],
    merge(
      {
        localDir: path.join(__dirname, '..'),
        preferLocal: true
      },
      execaOptions
    )
  )
}

module.exports = check
module.exports.defaultInput = defaultInput
module.exports.commandNames = commandNames
