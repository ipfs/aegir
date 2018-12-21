'use strict'

module.exports = {
  command: 'dependency-check',
  desc: 'Checks is there are missing or extra dependencies defined',
  handler (argv) {
    const dependencyCheck = require('../src/dependency-check')
    return dependencyCheck(argv)
  }
}
