#! /usr/bin/env node

'use strict'

const updateNotifier = require('update-notifier')
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
  .argv
