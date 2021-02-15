'use strict'
const { userConfig } = require('../config/user')
/**
 * @typedef {import("yargs").Argv} Argv
 */
const EPILOG = `
Typescript config file is required to generated docs. Try \`aegir ts --preset config > tsconfig.json\`
`

module.exports = {
  command: 'docs',
  desc: 'Generate documentation from TS type declarations.',
  /**
   * @param {Argv} yargs
   */
  builder: yargs => {
    yargs
      .epilog(EPILOG)
      .example('aegir docs', 'Build HTML documentation.')
      .example('aegir docs -p', 'Build HTML documentation and publish to Github Pages.')
      .options(
        {
          publish: {
            alias: 'p',
            type: 'boolean',
            describe: 'Publish to GitHub Pages',
            default: userConfig.docs.publish
          },
          entryPoint: {
            type: 'string',
            describe: 'Specifies the entry points to be documented by TypeDoc. TypeDoc will examine the exports of these files and create documentation according to the exports. Either files or directories may be specified. If a directory is specified, all source files within the directory will be included as an entry point.',
            default: userConfig.docs.entryPoint
          }
        }
      )
  },
  /**
   * @param {(import("../types").GlobalOptions & import("../types").DocsOptions) | undefined} argv
   */
  handler (argv) {
    const docs = require('../docs')
    return docs.run(argv)
  }
}
