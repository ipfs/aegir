'use strict'
const EPILOG = `
This command outputs two bundles, one in development mode (index.js) and another in production mode (index.min.js) plus respective source-maps, files are written to ./dist folder.
Supports options forwarding with '--' for more info check https://webpack.js.org/api/cli/
`
module.exports = {
  command: 'build',
  desc: 'Builds browser bundles with Webpack.',
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .options({
        node: {
          type: 'boolean',
          describe: 'Flag to control when to tell the bundler to include node global packages.',
          default: true
        },
        bundlesize: {
          alias: 'b',
          type: 'boolean',
          describe: 'Analyse bundle size. Default threshold is 100kB, you can override that in `.aegir.js` with the property `bundlesize`.',
          default: false
        }
      })
  },
  handler (argv) {
    const build = require('../src/build')
    return build(argv)
  }
}
