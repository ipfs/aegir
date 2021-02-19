'use strict'

const path = require('path')
const execa = require('execa')
const merge = require('merge-options')

/**
 * @typedef {import("execa").Options} ExecaOptions
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").DependencyCheckOptions} DependencyCheckOptions
 */

/**
 * @param {any} arr1
 * @param {any} arr2
 */
const isDefaultInput = (arr1, arr2) =>
  JSON.stringify(arr1) === JSON.stringify(arr2)
/**
 * Check dependencies
 *
 * @param {GlobalOptions & DependencyCheckOptions} argv - Command line arguments passed to the process.
 * @param {ExecaOptions} [execaOptions] - execa options.
 */
const check = (argv, execaOptions) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const input =
        argv.productionOnly &&
        isDefaultInput(argv.fileConfig.dependencyCheck.input, argv.input)
          ? argv.productionInput
          : argv.input
  const noDev = argv.productionOnly ? ['--no-dev'] : []
  const ignore = argv.ignore
    .concat(argv.fileConfig.dependencyCheck.ignore)
    .reduce((acc, i) => acc.concat('-i', i), /** @type {string[]} */ ([]))

  return execa(
    'dependency-check',
    [...input, '--missing', ...noDev, ...ignore, ...forwardOptions],
    merge(
      {
        localDir: path.join(__dirname, '..'),
        preferLocal: true
      },
      execaOptions
    )
  )
}

module.exports = {
  check
}
