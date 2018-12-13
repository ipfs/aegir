'use strict'

module.exports = {
  command: 'build',
  desc: 'Build ready to release',
  builder: {
    analyze: {
      alias: 'a',
      describe: 'Analyze mode. Opens webpack-bundle-analyzer and write stats to disk',
      default: false
    }
  },
  handler (argv) {
    const build = require('../src/build')
    return build(argv)
  }
}
