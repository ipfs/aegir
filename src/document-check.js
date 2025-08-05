/* eslint-disable no-console */

import fs from 'fs-extra'
import { globby } from 'globby'
import kleur from 'kleur'
import Listr from 'listr'
import { compileSnippets } from 'typescript-docs-verifier'
import merge from './utils/merge-options.js'
import { formatCode, formatError, fromRoot, hasTsconfig, readJson } from './utils.js'
/**
 * @typedef {import('./types.js').GlobalOptions} GlobalOptions
 * @typedef {import('./types.js').DocsVerifierOptions} DocsVerifierOptions
 * @typedef {import("listr").ListrTaskWrapper} Task
 * @typedef {import("ts-node").TSError} TSError
 */

/**
 * A list of tsc errors to ignore when compiling code snippets in documentation.
 */
const TS_ERRORS_TO_SUPPRESS = [
  2307 // Cannot find module '...' or its corresponding type declarations
]

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
        const isWindows = process.platform === 'win32'

        if (!isWindows) {
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
                    noImplicitAny: true,
                    noEmit: true,
                    skipLibCheck: true
                  }
                }
              ])
            )

            const results = await compileSnippets({ markdownFiles, project: configPath })

            results.forEach((result) => {
              if (result.error) {
                // ignore some diagnostic codes
                if (isTSError(result.error)) {
                  const diagnosticCodes = result.error?.diagnosticCodes?.filter(code => !TS_ERRORS_TO_SUPPRESS.includes(code))

                  if (diagnosticCodes.length === 0) {
                    return
                  }
                }

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
        } else {
          console.log(kleur.red('The underlying plugin used for TS-doc checks currently does not support Windows OS (See Github issue https://github.com/bbc/typescript-docs-verifier/issues/26). Skipping document check.'))
        }
      }
    }
  ],
  {
    renderer: 'verbose'
  }
)

export default tasks

/**
 *
 * @param {*} err
 * @returns {err is TSError}
 */
function isTSError (err) {
  return Array.isArray(err.diagnosticCodes)
}
