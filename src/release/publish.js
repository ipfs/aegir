'use strict'

const execa = require('execa')

function publish () {
  return execa('npm', ['publish'])
}

module.exports = publish
