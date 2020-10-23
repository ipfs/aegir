#! /usr/bin/env node
/* eslint-disable no-console */

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
const { config } = require('./src/config/user')
cli
  .scriptName('aegir')
  .env('AEGIR')
  .usage('Usage: $0 <command> [options]')
  .example('$0 build', 'Runs the build command to bundle JS code for the browser.')
  .example('npx $0 build', 'Can be used with `npx` to use a local version')
  .example('$0 test -t webworker -- --browsers Firefox', 'If the command supports `--` can be used to forward options to the underlying tool.')
  .example('npm test -- -- --browsers Firefox', 'If `npm test` translates to `aegir test -t browser` and you want to forward options you need to use `-- --` instead.')
  .epilog('Use `$0 <command> --help` to learn more about each command.')
  .middleware((yargs) => {
    yargs.config = config()
  })
  .commandDir('cmds')
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .option('debug', {
    desc: 'Show debug output.',
    type: 'boolean',
    default: false,
    alias: 'd'
  })
  // TODO remove after webpack 5 upgrade
  .options('node', {
    type: 'boolean',
    describe: 'Flag to control if bundler should inject node globals or built-ins.',
    default: false
  })
  .options('ts', {
    type: 'boolean',
    describe: 'Enable support for Typescript',
    default: false
  })
  .group(['help', 'version', 'debug', 'node', 'ts'], 'Global Options:')
  .demandCommand(1, 'You need at least one command.')
  .wrap(cli.terminalWidth())
  .parserConfiguration({ 'populate--': true })
  .recommendCommands()
  .completion()
  .strictCommands()

const args = cli.fail((msg, err, yargs) => {
  if (msg) {
    yargs.showHelp()
    console.error(chalk.red(msg))
  }

  if (err) {
    if (args.debug) {
      console.error('\n', err)
    } else {
      console.error(chalk.red(err.message))
    }
  }

  process.exit(1)
})
  .argv
