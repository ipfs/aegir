'use strict'

const EPILOG = `
Supports options forwarding with '--' for more info check https://github.com/documentationjs/documentation/blob/master/docs/USAGE.md
`

module.exports = {
  command: 'docs',
  desc: 'Generate documentation from JSDoc.',
  builder: yargs => {
    yargs
      .epilog(EPILOG)
      .example('aegir docs -- --format md -o docs.md', 'Build markdown documentation.')
      .options(
        {
          publish: {
            alias: 'p',
            type: 'boolean',
            describe: 'Publish to GitHub Pages',
            default: false
          }
        }
      )
  },
  handler (argv) {
    const docs = require('../src/docs')
    const onError = require('../src/error-handler')
    docs.run(argv).catch(onError)
  }
}
