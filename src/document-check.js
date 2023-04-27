/* eslint-disable no-console */

import { globby } from 'globby'
import Listr from 'listr'
import { compileSnippets } from 'typescript-docs-verifier'
import { hasTsconfig } from './utils.js'
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
        let tsconfigPath = 'tsconfig.json'
        let markdownFiles = ['README.md']

        if (ctx.tsConfigPath) {
          tsconfigPath = `${ctx.tsConfigPath}/tsconfig.json`
        }

        if (ctx.inputFiles) {
          markdownFiles = await globby(ctx.inputFiles)
        }

        compileSnippets({ markdownFiles, project: tsconfigPath })
          .then((results) => {
            results.forEach((result) => {
              if (result.error) {
                console.log(`Error compiling example code block ${result.index} in file ${result.file}`)
                console.log(result.error.message)
                console.log('Original code:')
                console.log(result.snippet)
              }
            })
          })
          .catch((error) => {
            console.error('Error compiling TypeScript snippets', error)
          })
      }

    }
  ],
  {
    renderer: 'verbose'
  }
)

export default tasks
