'use strict'

const build = require('../src/build')
const onError = require('../src/error-handler')

module.exports = {
  command: 'build',
  desc: 'Build ready to release',
  builder: {
    dist: {
      alias: 'd',
      describe: 'Build dist package',
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
