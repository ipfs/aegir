#! /usr/bin/env node

'use strict'

require('yargs') // eslint-disable-line
  .env('AEGIR')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
