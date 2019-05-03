'use strict'

const chalk = require('chalk')

function onError (err) {
  if (!err) {
    return
  }

  console.log(chalk.red(err.message)) // eslint-disable-line no-console
  console.log(chalk.gray(err.stack)) // eslint-disable-line no-console
  process.exit(1)
}

module.exports = onError
