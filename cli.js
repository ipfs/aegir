#! /usr/bin/env node

'use strict'

const updateNotifier = require('update-notifier')
const chalk = require('chalk')
const pkg = require('./package.json')

updateNotifier({
  pkg: pkg,
  isGlobal: false
}).notify()

require('yargs') // eslint-disable-line
  .env('AEGIR')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .fail((msg, err, yargs) => {
    // errors from execa output the child_process stderr
    if (err && err.stderr) {
      console.error('Error running command: ', err.cmd, '\n')
      console.error(err.stderr)
    } else {
      if (msg) {
        console.error(chalk.red(msg))
      }
      if (err) {
        console.error(chalk.red(err.message))
        if (err.cause) {
          console.error(err.cause)
        } else {
          console.error(chalk.gray(err.stack))
        }
      }
    }
    process.exit(1)
  })
  .argv
