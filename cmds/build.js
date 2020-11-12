'use strict'
const EPILOG = `
This command bundles js code and builds TS type declaration to ./dist folder.
Supports options forwarding with '--' for more info check https://webpack.js.org/api/cli/
`
module.exports = {
  command: 'build',
  desc: 'Builds browser bundles with Webpack.',
  builder: (yargs) => {
    yargs
      .epilog(EPILOG)
      .options({
        bundlesize: {
          alias: 'b',
          type: 'boolean',
          describe: 'Analyse bundle size. Default threshold is 100kB, you can override that in `.aegir.js` with the property `bundlesize.maxSize`.',
          default: false
        }
      })
  },
  handler (argv) {
    const build = require('../src/build')
    return build(argv)
  }
}
