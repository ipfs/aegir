/* eslint-disable no-console */

import merge from 'merge-options'
import { defaultDocumentCheckConfig } from '../config/default-document-check-config.js'
import docCheck from '../document-check.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").Arguments} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */

const EPILOG = `
Docs are verified using typescript-docs-verifier (https://github.com/bbc/typescript-docs-verifier#typescript-docs-verifier)
For more info read: https://github.com/bbc/typescript-docs-verifier#how-it-works
`

/** @type {CommandModule} */
export default {
  command: 'document-check [input...]',
  aliases: ['doc-check'],
  describe: 'Run `document-check` cli with aegir defaults.',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    return yargs
      .epilog(EPILOG)
      .middleware((yargs) => merge(yargs.fileConfig.documentCheck, yargs))
      .options({
        inputFiles: {
          array: true,
          describe: 'The files to verify, defaults to `README.md`',
          default: defaultDocumentCheckConfig.inputFiles
        },
        tsConfigPath: {
          type: 'string',
          describe: 'The path to the `tsconfig.json`, defaults to the root.',
          default: defaultDocumentCheckConfig.tsConfigPath
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await docCheck.run(argv)
  }
}
