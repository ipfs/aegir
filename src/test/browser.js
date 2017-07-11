'use strict'

const Server = require('karma').Server

const getConfig = require('./browser-config')
const utils = require('../utils')

const IS_SAUCE = process.env.SAUCE_USERNAME && process.env.TRAVIS

function karma (config) {
  return new Promise((resolve, reject) => {
    const server = new Server(config, (exitCode) => {
      if (exitCode > 0 && !IS_SAUCE) {
        reject(new Error('Some tests are failing'))
      }

      resolve()
    })

    server.start()
  })
}

function testBrowser (isWebworker) {
  const postHook = utils.hook('node', 'post')
  const preHook = utils.hook('node', 'pre')

  return (ctx) => {
    return preHook(ctx)
      .then(() => karma(getConfig(isWebworker, ctx)))
      .then(() => postHook(ctx))
  }
}

module.exports = {
  default: testBrowser(false),
  webworker: testBrowser(true)
}
