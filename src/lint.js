/* eslint-disable no-console */

import path from 'path'
import { fileURLToPath } from 'url'
import { ESLint } from 'eslint'
import { execa } from 'execa'
import fs from 'fs-extra'
import { globby } from 'globby'
import kleur from 'kleur'
import Listr from 'listr'
import merge from './utils/merge-options.js'
import { fromRoot, fromAegir, readJson, hasTsconfig, isTypescript, findBinary, hasDocCheck } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {import('./types.js').GlobalOptions} GlobalOptions
 * @typedef {import('./types.js').LintOptions} LintOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 * @typedef {import('./types.js').TSOptions} TSOptions
 */

const tasks = new Listr(
  [
    {
      title: 'eslint',
      /**
       *
       * @param {GlobalOptions & LintOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const eslint = new ESLint({
          fix: ctx.fix,
          overrideConfigFile: fromAegir('eslint.config.js')
        })
        const results = await eslint.lintFiles(await globby(ctx.files))
        const formatter = await eslint.loadFormatter('unix')
        const hasErrors = ESLint.getErrorResults(results).length > 0

        if (ctx.fix) {
          await ESLint.outputFixes(results)
        }

        if (!ctx.silent && hasErrors) {
          const output = await formatter.format(results)

          console.error(output
            .split('\n')
            .map(line => {
              if (line.includes('[Error')) {
                return kleur.red(line)
              }

              return line
            })
            .join('\n'))
        }

        if (hasErrors) {
          throw new Error('Lint errors')
        }
      }
    },
    {
      title: 'tsc',
      /**
       * @param {GlobalOptions & LintOptions} ctx
       */
      enabled: ctx => hasTsconfig && !isTypescript,
      /**
       * @param {GlobalOptions & LintOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const configPath = fromRoot('tsconfig-check.aegir.json')
        const userTSConfig = readJson(fromRoot('tsconfig.json'))
        try {
          fs.writeJsonSync(
            configPath,
            merge.apply({ concatArrays: true }, [
              userTSConfig,
              {
                compilerOptions: {
                  noEmit: true,
                  emitDeclarationOnly: false
                }
              }
            ])
          )
          await execa(findBinary('tsc'), ['--build', configPath], {
            localDir: path.join(__dirname, '../..'),
            preferLocal: true,
            stdio: 'inherit'
          })
        } finally {
          fs.removeSync(configPath)
          fs.removeSync(fromRoot('dist', 'tsconfig-check.aegir.tsbuildinfo'))
        }
      }
    },
    {
      title: 'doc-check',
      enabled: () => hasDocCheck,
      task: async () => {
        await execa('npm', ['run', 'doc-check', '--if-present', '--', '--publish', 'false'], {
          stdio: 'inherit'
        })
      }
    }
  ],
  {
    renderer: 'verbose'
  }
)

export default tasks
