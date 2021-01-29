/* eslint-disable no-console */
'use strict'

const globby = require('globby')
const { ESLint } = require('eslint')

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").LintOptions} LintOptions
 *
 */

/**
 *
 * @param {GlobalOptions & LintOptions} opts
 */
async function runLinter (opts) {
  const eslint = new ESLint({
    fix: opts.fix,
    baseConfig: { extends: 'ipfs' },
    useEslintrc: true
  })
  const results = await eslint.lintFiles(await globby(opts.files))
  const formatter = await eslint.loadFormatter('unix')
  if (opts.fix) {
    await ESLint.outputFixes(results)
  }
  if (!opts.silent) {
    console.log(formatter.format(results))
  }
  if (ESLint.getErrorResults(results).length > 0) {
    throw new Error('Lint errors')
  }
}

module.exports = runLinter
