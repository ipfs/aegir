/* eslint-disable no-console */

import chalk from 'chalk'
import fs from 'fs-extra'
import { globby } from 'globby'
import Listr from 'listr'
import merge from 'merge-options'
import { compileSnippets } from 'typescript-docs-verifier'
import { formatCode, formatError, fromRoot, hasTsconfig, isTypescript, readJson } from './utils.js'
/**
 * @typedef {import("./types").GlobalOptions} GlobalOptions
 * @typedef {import("./types").DocsVerifierOptions} DocsVerifierOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 */

const tasks = new Listr(
  [
    {
      title: 'typescript-doc-verify',
      /**
       * @param {GlobalOptions & DocsVerifierOptions} ctx
       */
      enabled: ctx => hasTsconfig && !isTypescript,
      /**
       * @param {GlobalOptions & DocsVerifierOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        let configPath = './tsconfig-doc-check.aegir.json'
        let markdownFiles = ['README.md']

        if (ctx.tsConfigPath && ctx.tsConfigPath !== '.') {
          configPath = `${ctx.tsConfigPath}/tsconfig.json`
        }

        if (ctx.inputFiles) {
          markdownFiles = await globby(ctx.inputFiles)
        }

        const userTSConfig = readJson(fromRoot('tsconfig.json'))

        try {
          fs.writeJsonSync(
            configPath,
            merge.apply({ concatArrays: true }, [
              userTSConfig,
              {
                compilerOptions: {
                  target: 'esnext',
                  module: 'esnext',
                  noImplicitAny: true,
                  noEmit: true
                }
              }
            ])
          )

          const results = await compileSnippets({ markdownFiles, project: configPath })

          results.forEach((result) => {
            if (result.error) {
              process.exitCode = 1
              console.log(chalk.red.bold(`Error compiling example code block ${result.index} in file ${result.file}:`))
              console.log(formatError(result.error))
              console.log(chalk.blue.bold('Original code:'))
              console.log(formatCode(result.snippet, result.linesWithErrors))
            }
          })
        } catch (error) {
          console.error('Error complining Typescript snippets ', error)
        } finally {
          fs.removeSync(configPath)
          fs.removeSync(fromRoot('dist', 'tsconfig-doc-check.aegir.tsbuildinfo'))
        }
      }

    }
  ],
  {
    renderer: 'verbose'
  }
)

export default tasks
