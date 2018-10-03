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
    },
    'enable-experimental-browser-builds': {
      alias: 'eebb',
      describe: 'Use experimental webpack config',
      default: false
    },
    analyze: {
      alias: 'a',
      describe: 'Analyze mode use experimental config. Opens webpack-bundle-analyzer and write stats to disk',
      default: false
    }
  },
  handler (argv) {
    const build = require('../src/build')
    return build(argv)
  }
}
