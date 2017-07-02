'use strict'

const chalk = require('chalk')

function onError (err) {
  if (!err) {
    return
  }

  chalk.red(err.message)
  chalk.gray(err.stack)
  process.exit(1)
}

module.exports = onError
