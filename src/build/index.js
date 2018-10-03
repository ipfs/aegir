'use strict'

const build = require('./browser')
const experimentalBuild = require('./experimental-browser')
const debug = require('debug')('aegir:build')

module.exports = (argv) => {
  debug('argv', argv)
  if (argv['enable-experimental-browser-builds']) {
    debug('running experimental build')
    return experimentalBuild(argv)
  }

  debug('running legacy build')
  return build.run(argv)
}
