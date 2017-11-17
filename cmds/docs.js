'use strict'

const docs = require('../src/docs')
const onError = require('../src/error-handler')

module.exports = {
  command: 'docs',
  desc: 'Generate documentation using jsdoc',
  builder: {
    publish: {
      alias: 'p',
      describe: 'Publish to GitHub Pages',
      default: false
    },
    docsFormats: {
      alias: 'd',
      describe: 'Which documentation formats to build',
      type: 'array',
      choices: ['html', 'md'],
      default: ['html']
    }
  },
  handler (argv) {
    docs.run(argv).catch(onError)
  }
}
