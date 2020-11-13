'use strict'

const path = require('path')
const execa = require('execa')
const merge = require('merge-options')

/** @typedef { import("execa").Options} ExecaOptions */
/** @typedef { import("execa").ExecaChildProcess} ExecaChildProcess */

const defaultInput = [
  'package.json',
  './test/**/*.js',
  './src/**/*.js',
  '!./test/fixtures/**/*.js'
]

const commandNames = ['dependency-check', 'dep-check', 'dep']

/**
 * Returns true if the user invoked the command with non-flag or
 * optional args
 *
 * @param {Array} args - process.argv or similar
 * @returns {boolean} - true if the user passed files as positional arguments
 */
const hasPassedFileArgs = (args) => {
  let foundCommand = false

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--') {
      // reached forward args
      break
    }

    if (foundCommand && !arg.startsWith('-')) {
      // was not a flag (e.g. -f) or option (e.g. --foo)
      return true
    }

    if (commandNames.includes(arg)) {
      foundCommand = true
    }
  }

  return false
}

/**
 * Check dependencies
 *
 * @param {object} argv - Command line arguments passed to the process.
 * @param {Array} processArgs - Unparsed command line arguments used to start the process
 * @param {ExecaOptions} execaOptions - execa options.
 * @returns {ExecaChildProcess} - Child process that does dependency check.
 */
const check = (argv = { _: [], input: [] }, processArgs = [], execaOptions) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  let input = argv.input

  if (argv.productionOnly) {
    if (!hasPassedFileArgs(processArgs)) {
      input = [
        'package.json',
        './src/**/*.js'
      ]
    }

    forwardOptions.push('--no-dev')
  }

  if (input.length === 0) {
    input = defaultInput
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
