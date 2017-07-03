'use strict'

const chalk = require('chalk')

function onError (err) {
  if (!err) {
    return
  }

  console.log(chalk.red(err.message))
  console.log(chalk.gray(err.stack))
  process.exit(1)
}

module.exports = onError
