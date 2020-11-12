'use strict'

const EPILOG = `
Presets:
\`check\`       Checks src and test folders for Typescript errors
\`types\`       Generates types declarations inline with the source files
\`docs\`        Generates documentation based on the type declarations
\`config\`      Print base config to stdout.

Note: 
Add this to your package json:

"types": "./dist/src/index.d.ts",
"typesVersions": {
  "*": { "src/*": ["dist/src/*"] }
},

Supports options forwarding with '--' for more info check https://www.typescriptlang.org/docs/handbook/compiler-options.html
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
          choices: ['config', 'check', 'types', 'docs'],
          describe: 'Preset to run'
        }
      })
  },
  handler (argv) {
    const ts = require('../src/ts')
    return ts(argv)
  }
}
