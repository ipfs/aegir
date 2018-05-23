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
    env: {
      describe: 'Sets NODE_ENV in the childprocess (NODE_ENV=production aegir build also works)',
      default: 'production'
    }
  },
  handler (argv) {
    const build = require('../src/build')
    if (argv.eebb) {
      return require('./../src/build/experimental-browser')(argv)
    }
    return build.run(argv)
  }
}
