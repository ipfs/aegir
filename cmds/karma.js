'use strict'
const resolveBin = require('resolve-bin')
const execa = require('execa')
const path = require('path')
const userConfig = require('./../src/config/user')()
const {hook} = require('./../src/utils')
const here = p => path.join(__dirname, p)

module.exports = {
  command: 'karma',
  desc: 'Run karma browser tests',
  builder: {
    watch: {
      alias: 'w',
      describe: 'Watch for file changes',
      default: false
    },
    env: {
      describe: 'Sets NODE_ENV in the childprocess (NODE_ENV=dev aegir karma also works)',
      default: 'development'
    },
    webworker: {
      describe: 'Webworker enviroment for Karma',
      default: false
    }

  },
  handler (argv) {
    const bin = resolveBin.sync('karma')
    const input = argv._.slice(1)
    const watch = argv.watch ? ['--auto-watch', '--no-single-run'] : []
    return hook('browser', 'pre')(userConfig)
      .then(() => {
        return execa(bin, [
          'start',
          ...watch,
          here('./../src/config/karma2.conf.js'),
          ...input
        ], {
          env: {
            NODE_ENV: argv.env,
            AEGIR_WEBWORKER: argv.webworker
          },
          stdio: 'inherit'
        })
      })
      .then(process => hook('browser', 'post')(userConfig))
  }
}
