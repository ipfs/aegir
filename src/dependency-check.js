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

/**
 * Check dependencies
 *
 * @param {Object} argv
 * @param {ExecaOptions} execaOptions
 * @returns {ExecaChildProcess}
 */
const check = (argv = { _: [] }, execaOptions) => {
  const input = argv._.slice(1)
  const forwardOptions = argv['--'] ? argv['--'] : []
  const defaults = input.length ? input : defaultInput
  return execa('dependency-check',
    [
      ...defaults,
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
