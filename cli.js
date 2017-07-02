#! /usr/bin/env node

'use strict'

require('yargs') // eslint-disable-line
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
