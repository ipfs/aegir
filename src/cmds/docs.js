import { loadUserConfig } from '../config/user.js'
import docsCmd from '../docs.js'

/**
 * @typedef {import("yargs").Argv} Argv
 * @typedef {import("yargs").ArgumentsCamelCase} Arguments
 * @typedef {import("yargs").CommandModule} CommandModule
 */
const EPILOG = `
Typescript config file is required to generated docs. Please create a \`tsconfig.json\` file in the root of your project.
`
/** @type {CommandModule} */
export default {
  command: 'docs',
  describe: 'Generate documentation from TS type declarations.',
  /**
   * @param {Argv} yargs
   */
  builder: async (yargs) => {
    const userConfig = await loadUserConfig()

    return yargs
      .epilog(EPILOG)
      .example('aegir docs', 'Build HTML documentation.')
      .example('aegir docs -p', 'Build HTML documentation and publish to Github Pages.')
      .options({
        publish: {
          alias: 'p',
          type: 'boolean',
          describe: 'Publish to GitHub Pages',
          default: userConfig.docs.publish
        },
        entryPoint: {
          type: 'string',
          describe:
            'Specifies the entry points to be documented by TypeDoc. TypeDoc will examine the exports of these files and create documentation according to the exports. Either files or directories may be specified. If a directory is specified, all source files within the directory will be included as an entry point.',
          default: userConfig.docs.entryPoint
        },
        message: {
          type: 'string',
          describe: 'The commit message to use when updating the gh-pages branch',
          default: userConfig.docs.message
        },
        user: {
          type: 'string',
          describe: 'The user name to use when updating the gh-pages branch',
          default: userConfig.docs.user
        },
        email: {
          type: 'string',
          describe: 'The email address to use when updating the gh-pages branch',
          default: userConfig.docs.email
        },
        directory: {
          type: 'string',
          describe: 'Where to build the documentation',
          default: userConfig.docs.directory
        }
      })
  },
  /**
   * @param {any} argv
   */
  async handler (argv) {
    await docsCmd.run(argv)
  }
}
