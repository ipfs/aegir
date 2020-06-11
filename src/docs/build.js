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
const docs = (argv = { _: [] }, execaOptions = {}) => {
  const forwardOptions = argv['--'] ? argv['--'] : []
  const config = hasFile('documentation.yml') ? ['--config', fromRoot('documentation.yml')] : []
  return execa('documentation',
    [
      'build',
      fromRoot('src/index.js'),
      '--format', 'html',
      '--resolve', 'node',
      '--github',
      '--output', fromRoot('docs'),
      ...config,
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
