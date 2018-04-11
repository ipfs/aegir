'use strict'

const path = require('path')

const chokidar = require('chokidar')

const build = require('../src/build')
const onError = require('../src/error-handler')
const utils = require('../src/utils')

module.exports = {
  command: 'build',
  desc: 'Build ready to release',
  builder: {
    dist: {
      alias: 'd',
      describe: 'Build dist package',
      default: true
    },
    lib: {
      alias: 'l',
      describe: 'Transpile src to lib',
      default: true
    },
    watch: {
      alias: 'w',
      describe: 'Keep watching source files for changes',
      default: false
    }
  },
  handler (argv) {
    build.run(argv).catch(onError)
  }
}
