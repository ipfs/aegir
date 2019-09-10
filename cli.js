#! /usr/bin/env node

'use strict'

process.on('unhandledRejection', (err) => {
  throw err
})

const updateNotifier = require('update-notifier')
const chalk = require('chalk')
const pkg = require('./package.json')

updateNotifier({
  pkg: pkg,
  isGlobal: false
}).notify()

const cli = require('yargs')
cli.env('AEGIR')
  .usage('Usage: $0 <command> [options]')
  .example('$0 build', 'Runs the build command to bundle JS code for the browser.')
  .example('npx $0 build', 'Can be used with `npx` to use a local version')
  .example('$0 test -t webworker -- --browsers Firefox', 'If the command supports `--` can be used to forward options to the underlying tool.')
  .example('npm test -- -- --browsers Firefox', 'If `npm test` translates to `aegir test -t browser` and you want to forward options you need to use `-- --` instead.')
  .epilog('Use `$0 <command> --help` to learn more about each command.')
  .commandDir('cmds')
  .demandCommand(1, 'You need at least one command.')
  .option('D', {
    desc: 'Show debug output.',
    type: 'boolean',
    default: false,
    alias: 'debug'
  })
  .help()
  .alias('h', 'help')
  .alias('v', 'version')
  .group(['help', 'version', 'debug'], 'Global Options:')
  .wrap(cli.terminalWidth())
  .parserConfiguration({ 'populate--': true })
  // .strict() // this doesnt allow for cross-env AEGIR_TEST=hello node cli.js test -t node --files 'test/**/*.spec.js' "--bail"

const args = cli.fail((msg, err, yargs) => {
  if (msg) {
    yargs.showHelp()
    console.error(chalk.red(msg)) // eslint-disable-line no-console
  }

  if (err) {
    console.error(chalk.red(err.message)) // eslint-disable-line no-console

    if (args.debug) {
      // errors from execa output the child_process stderr
      if (err && err.stderr) {
        console.error('Error running command: ', err.cmd, '\n') // eslint-disable-line no-console
        console.error(err.stderr) // eslint-disable-line no-console
      } else {
        console.error(chalk.gray(err.stack)) // eslint-disable-line no-console
      }
    }
  }

  process.exit(1)
})
  .argv
