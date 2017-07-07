'use strict'

const build = require('../src/build')
const onError = require('../src/error-handler')

module.exports = {
  command: 'build',
  desc: 'Build ready to release',
  builder: {
    browser: {
      alias: 'b',
      describe: 'Build for browser usage',
      default: true
    },
    node: {
      alias: 'n',
      describe: 'Build for node usage',
      default: false
    }
  },
  handler (argv) {
    build.run(argv).catch(onError)
  }
}
