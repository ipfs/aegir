'use strict'

const EPILOG = `
Presets:
\`check\`      Checks src and test folders for Typescript errors
\`types\`      Generates types declarations inline with the source files
\`types-clean\` Deletes all the *.d.ts files
\`docs\`       Generates documentation based on the type declarations

Supports options forwarding with '--' for more info check https://www.typescriptlang.org/v2/docs/handbook/compiler-options.html
`
module.exports = {
  command: 'ts',
  desc: 'Typescript command with presets for specific tasks.',
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .options({
        preset: {
          type: 'string',
          choices: ['check', 'types', 'types-clean', 'docs'],
          describe: 'Preset to run'
        }
      })
  },
  handler (argv) {
    const ts = require('../src/ts')
    return ts(argv)
  }
}
