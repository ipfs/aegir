/* eslint-disable no-console */

import fs from 'fs-extra'
import { globby } from 'globby'
import kleur from 'kleur'
import Listr from 'listr'
import merge from 'merge-options'
import { compileSnippets } from 'typescript-docs-verifier'
import { formatCode, formatError, fromRoot, hasTsconfig, readJson } from './utils.js'
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
      enabled: ctx => hasTsconfig,
      /**
       * @param {GlobalOptions & DocsVerifierOptions} ctx
       * @param {Task} task
       */
      task: async (ctx, task) => {
        const configPath = './tsconfig-doc-check.aegir.json'

        let userTSConfig = {}
        let markdownFiles = ['README.md']

        if (ctx.tsConfigPath && ctx.tsConfigPath !== '.') {
          userTSConfig = readJson(`${ctx.tsConfigPath}/tsconfig.json`)
        } else {
          userTSConfig = readJson(fromRoot('tsconfig.json'))
        }

        if (ctx.inputFiles) {
          markdownFiles = await globby(ctx.inputFiles)
        }

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
              console.log(kleur.red().bold(`Error compiling example code block ${result.index} in file ${result.file}:`))
              console.log(formatError(result.error))
              console.log(kleur.blue().bold('Original code:'))
              console.log(formatCode(result.snippet, result.linesWithErrors))
            }
          })
        } catch (err) {
          console.log('Error in trying to compile Typescript code', err)
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
