'use strict'

const Server = require('karma').Server

const utils = require('../utils')

module.exports = (getConfig) => {
  function karma (config) {
    return new Promise((resolve, reject) => {
      const server = new Server(config, (exitCode) => {
        if (exitCode > 0) {
          reject(new Error('Some tests are failing'))
        }

        resolve()
      })

      server.start()
    })
  }

  function testBrowser (isWebworker) {
    const postHook = utils.hook('browser', 'post')
    const preHook = utils.hook('browser', 'pre')

    return (ctx) => {
      return preHook(ctx)
        .then(() => karma(getConfig(isWebworker, ctx)))
        .then(() => postHook(ctx))
    }
  }

  return {
    default: testBrowser(false),
    webworker: testBrowser(true)
  }
}
