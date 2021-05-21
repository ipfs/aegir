#! /usr/bin/env node
/* eslint-disable no-console */

'use strict'

process.on('unhandledRejection', (err) => {
  throw err
})

const updateNotifier = require('update-notifier')
const pkg = require('./package.json')

updateNotifier({
  pkg: pkg
}).notify()

const cli = require('yargs')
const { userConfig } = require('./src/config/user')
cli
  .scriptName('aegir')
  .env('AEGIR')
  .usage('Usage: $0 <command> [options]')
  .example('$0 build', 'Runs the build command to bundle JS code for the browser.')
  .example('npx $0 build', 'Can be used with `npx` to use a local version')
  .example('$0 test -t webworker -- --browser firefox', 'If the command supports `--` can be used to forward options to the underlying tool.')
  .example('npm test -- -- --browser firefox', 'If `npm test` translates to `aegir test -t browser` and you want to forward options you need to use `-- --` instead.')
  .epilog('Use `$0 <command> --help` to learn more about each command.')
  .middleware((yargs) => {
    yargs.fileConfig = userConfig
  })
  .commandDir('src/cmds')
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .option('debug', {
    desc: 'Show debug output.',
    type: 'boolean',
    alias: 'd',
    default: userConfig.debug
  })
  .options('ts-repo', {
    type: 'boolean',
    describe: 'Enable support for Typescript repos.',
    default: userConfig.tsRepo
  })
  .group(['help', 'version', 'debug', 'ts-repo'], 'Global Options:')
  .demandCommand(1, 'You need at least one command.')
  .wrap(cli.terminalWidth())
  .parserConfiguration({ 'populate--': true })
  .recommendCommands()
  .completion()
  .strictCommands()
  .fail(false)

async function main () {
  try {
    await cli.parse()
  } catch (err) {
    if (cli.parsed && cli.parsed.argv.debug) {
      console.error('\n', err)
    } else {
      console.error(err.message)
    }
    process.exit(1)
  }
}

main()
