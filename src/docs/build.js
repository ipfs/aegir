'use strict'

const path = require('path')
const execa = require('execa')
const merge = require('merge-options')
const { fromRoot, hasFile } = require('../utils')

/** @typedef { import("execa").Options} ExecaOptions */
/** @typedef { import("execa").ExecaChildProcess} ExecaChildProcess */

/**
 * Build docs
 *
 * @param {Object} argv
 * @param {ExecaOptions} execaOptions
 * @returns {ExecaChildProcess}
 */
const docs = (argv, execaOptions = {}) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const format = forwardOptions.some(v => ['--format', '-f'].includes(v)) ? [] : ['--format', 'html']
  const output = forwardOptions.some(v => ['--output', '-o'].includes(v)) ? [] : ['--output', fromRoot('docs')]
  const config = hasFile('documentation.yml') ? ['--config', fromRoot('documentation.yml')] : []
  return execa('documentation',
    [
      'build',
      fromRoot('src/index.js'),
      ...format,
      ...output,
      ...config,
      '--github',
      '--resolve', 'node',
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

module.exports = docs
