'use strict'

const build = require('./browser')
const experimentalBuild = require('./experimental-browser')

module.exports = (argv) => {
  if (argv['enable-experimental-browser-builds']) {
    return experimentalBuild(argv)
  }

  return build.run(argv)
}
