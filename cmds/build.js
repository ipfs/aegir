'use strict'

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
    const build = require('../src/build')
    const onError = require('../src/error-handler')
    build.run(argv).catch(onError)
  }
}
