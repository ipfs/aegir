/* eslint-disable no-console */
'use strict'

const globby = require('globby')
const { ESLint } = require('eslint')
const Listr = require('listr')

/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").LintOptions} LintOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 *
 */

const tasks = new Listr(
  [
    {
      title: 'Lint files',
      /**
       *
       * @param {GlobalOptions & LintOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const eslint = new ESLint({
          fix: ctx.fix,
          baseConfig: { extends: 'ipfs' },
          useEslintrc: true
        })
        const results = await eslint.lintFiles(await globby(ctx.files))
        const formatter = await eslint.loadFormatter('unix')
        const hasErrors = ESLint.getErrorResults(results).length > 0

        if (ctx.fix) {
          await ESLint.outputFixes(results)
        }

        if (!ctx.silent && hasErrors) {
          console.error(formatter.format(results))
        }

        if (hasErrors) {
          throw new Error('Lint errors')
        }
      }
    }
  ],
  {
    renderer: 'verbose'
  }
)

module.exports = tasks
